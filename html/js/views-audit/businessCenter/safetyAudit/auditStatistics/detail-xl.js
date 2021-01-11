define(function(require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");
    //初始化数据模型
    var newVO = function() {
        return {
            //主键
            id: null,
            //唯一标识
            code: null,
            //名称
            name: null,
            //禁用标识 0未禁用，1已禁用
            disable: null,
            //发布状态 1未发布 2已发布
            status: null,
            //结束时间
            endDate: null,
            //发布时间
            publishDate: null,
            //开始时间
            startDate: null,
            //修改日期
            modifyDate: null,
            //创建日期
            createDate: null,
            //安全体系
            auditTable: { id: '', name: '', score: 0 },
            //负责人
            user: { id: '', name: '', username: '' },
            actScore: 0,
            scorePeople: {id: '', name: ''},
            compChargePersonList:[]
        }
    };
    var newLevelVO = function () {
        return {
            id: null,
            upScore: '',
            lowerScore: '',
            name: '',
            auditPlan: {
                id: ''
            }
        }
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: ""
        },
        levelModel: {
            vo: newLevelVO(),
            showModal: false,
            showTable: true,
            isCreate: false,
            rules: {
                "name": [
                    LIB.formRuleMgr.require("等级名称"),
                    LIB.formRuleMgr.length()
                ],
                "upScore": [
                    LIB.formRuleMgr.require("分数上限"),
                    LIB.formRuleMgr.length()
                ],
                "lowerScore": [
                    LIB.formRuleMgr.require("分数下限"),
                    LIB.formRuleMgr.length()
                ]
            }
        },
        levels: null,
        tableModel: {},
        formModel: {},
        factors: null,
        barChartOption: {
            series: []
        },
        pieChartOption: {
            series: []
        },
        tasks: null,
        viewType: 'table'
    };
    //Vue组件
    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
        template: tpl,
        data: function() {
            return dataModel;
        },
        methods: {
            newVO: newVO,
            newLevelVO: newLevelVO,
            afterInitData: function() {
                var _this = this;
                this.$api.getStatisticsData({ id: this.mainModel.vo.id}).then(function(data) {
                    _this.tasks = data.data.tasks;
                });
                this.getRates();
                this.viewType = 'table';
            },
            getRates: function () {
                var _this = this;
                this.$api.listRating({id: this.mainModel.vo.id}).then(function(data) {
                    _this.levels = data.data;
                });
            },
            toggleView: function (type) {
                var _this = this;
                this.viewType = type;

                if(type === 'bar') {
                    this.$nextTick(function() {
                        _this.barChartOption = _this.buildBarChartOption();
                    })
                }
                if(type === 'pie') {
                    this.$nextTick(function() {
                        _this.pieChartOption = _this.buildPieChartOption();
                    })
                }
            },
            buildBarChartOption: function () {
                var opt = {
                    color: ['#3398DB'],
                    // tooltip: {
                    //     trigger: 'item',
                    // },
                    grid: {
                        left: '1%',
                        right: '1%',
                        bottom: '1%',
                        top: '10%',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        data: _.map(this.tasks, 'elementName'),
                        axisTick: {
                            alignWithLabel: true
                        }
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: [{
                        name: '实际得分',
                        type: 'bar',
                        barWidth: 30,
                        barMaxWidth: '10%',
                        data: _.map(this.tasks, 'actScore'),
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,//是否展示
                                    position: 'top'
                                }
                            }
                        },
                    }]
                };
                return opt;
            },
            buildPieChartOption: function() {
                var opt = {
                    legend: {
                        orient: 'vertical',
                        left: 20,
                        top: 'middle',
                        padding: [30, 0],
                        data: _.map(this.tasks, 'elementName')
                    },
                    series: [{
                        name: '实际得分:',
                        type: 'pie',
                        radius: '75%',
                        center: ['50%', '50%'],
                        data: _.map(this.tasks, function (item) {
                            return {value: item.actScore, name: item.elementName}
                        }),
                        label: {
                            normal: {
                                formatter: '{c}分'
                            }
                        }
                    }]
                };

                return opt;
            },
            doAddLevel: function(){
                var max,len = this.levels.length;
                if(len > 0) {
                    max = this.levels[len-1].upScore;
                    if(max == this.mainModel.vo.auditTable.score) {
                        LIB.Msg.info("上限分数不能高于安全体系总分");
                        return;
                    }
                }
                this.levelModel.isCreate = true;
                this.levelModel.vo = newLevelVO();
                this.levelModel.showModal = true;
            },
            doSaveLevel: function () {
                var _this = this,
                    _vo = this.levelModel.vo;
                if(parseFloat(_vo.upScore) < parseFloat(_vo.lowerScore)) {
                    LIB.Msg.error("上限分数必须大于下限分数");
                    return;
                }
                this.$refs.ruleform.validate(function(valid) {
                    if (valid) {
                        if (_this.levelModel.isCreate) {
                            _vo.auditPlan.id = _this.mainModel.vo.id;
                            _this.$api.createRating(_this.levelModel.vo).then(function () {
                                _this.getRates();
                                LIB.Msg.info("保存成功");
                            })
                        } else {
                            _this.$api.updateRating(_this.levelModel.vo).then(function () {
                                _this.getRates();
                                LIB.Msg.info("保存成功");
                            })
                        }
                    }
                })
                this.levelModel.showModal = false;
            },
            doLevelEdit: function (vo) {
                this.levelModel.isCreate = false;
                this.levelModel.vo = _.cloneDeep(vo);
                this.levelModel.showModal = true;
            },
            doLevelDelete: function (vo) {
                var _this = this;
                LIB.Modal.confirm({
                    title: '确定删除数据?',
                    onOk: function() {
                        _this.$api.removeRating(null, vo).then(function() {
                            _this.getRates();
                            LIB.Msg.info("删除成功");
                        });
                    }
                });
            },
            beforeInit: function () {
                this.mainModel.vo.compChargePersonList = null;
            },
        },
        events: {},
        init: function() {
            this.$api = api;
        }
    });

    return detail;
});
