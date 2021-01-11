define(function (require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var qryInfoApi = require("../tools/vuex/qryInfoApi");
    var dateUtils = require("views/reportManagement/tools/dateUtils");
    var reqUtils = require("../tools/vuex/reqUtils");
    var statisConst = require("../tools/statisticalConst");
    var api = require("./vuex/api")

    var newQryParam = function () {
        return {
            method: null,//统计方式,abs-绝对值;avg-平均值;trend-平均值
            item: [],
            typeOfRange: null,
            indicators: null,
            objRange: [],
            dateRange: [],
            containRandomData: false
        };
    };
    var specialQryTypes = [
        {id: 'person', name: '个人检查'},
        {id: 'equip', name: '区域 / 设施'},
        {id: 'checkItem', name: '检查项受检'},
        {id: 'rectification', name: '整改情况'},
        {id: 'taskPlan', name: '计划执行'}
    ];
    var specialQryIds = _.map(specialQryTypes, function (type) {
        return type.id;
    });
    var buildQryInfoList = function (data) {
        var rs = specialQryTypes.concat(_.map(data, function (d) {
            var v = {
                id: d.id,
                name: d.name,
                star: d.homeRpt,
                details: d.details,
                parentId: d.type
            }
            return v;
        }));
        return rs;
    }
    var modelData = {
        qryParam: newQryParam(),
        items: statisConst.items,
        title: "",
        qryModel: {
            show: false,
            list: []
        },
        drillModel: {
            show: false,
            title: "明细",
            groups: [],
            customQryParam: {
                xId: null
            }
        },
        moreModel: {
            show: false
        },
        ruleModel: {
            item: {type: 'array', required: true, message: '请选择统计项目'},
            typeOfRange: {required: true, message: '请选择对象范围'},
            //objRange:{type:'array',required: true, message: '请选择对象个体'},
            dateRange: [
                {type: 'array', required: true, message: '请选择统计日期'},
                {
                    validator: function (rule, value, callback) {
                        return value[1] < value[0] ? callback(new Error('结束时间须不小于开始时间')) : callback();
                    }
                }
            ]
        },
        charts: {
            show: false,
            opt: null
        }
    };
    var component = LIB.Vue.extend({
        template: template,
        mixins: [require("../tools/vueUtils")],
        data: function () {
            return modelData;
        },
        computed: {
            currentDate: function () {
                return new Date().Format("yyyy-MM-dd");
            },
            detailsQryParam: function () {
                var item = this.qryParam.item;
                var obj = _.omit(_.clone(this.qryParam), "item");
                obj.item = item[0];
                obj.indicators = item[1];
                return obj;
            },
            typeOfRanges: function () {
                var item = this.qryParam.item[0];
                var typeOfRanges = statisConst.typeOfRanges;
                if (null === item || "" === item) {
                    return [];
                } else if ("taskPlan" === item) {
                    return typeOfRanges["0"];
                } else if ("person" === item) {
                    return typeOfRanges["1"];
                } else {
                    return typeOfRanges["2"];
                }
            },
            showRadom: function () {
                return this.qryParam.item && (this.qryParam.item[0] === 'person' || this.qryParam.item[0] === 'equip');
            }
        },
        methods: {
            saveTreeStar: function (data) {
                var _this = this;
                var qryInfos = _.filter(data, function (d) {
                    return !_.contains(specialQryIds, d.id);
                });
                var formDatas = _.map(qryInfos, function (info) {
                    return {id: info.id, orderNum: info.sortIndex};
                });
                qryInfoApi.saveBatchOrderNum(formDatas).then(function (res) {
                });
            },
            doTreeStar: function (node) {
                this.setHome(0, node)
            },
            pageReset: function () {
                this.title = null;
                this.qryInfoId = null;
                _.extend(this.qryParam, newQryParam());
                this.qryParam.dateRange = "";
                this.$refs.echart.doClear();
                this.charts.show = false;
            },
            changeItem: function () {
                this.qryParam.typeOfRange = null;
                this.qryParam.containRandomData = false;
            },
            doHidden: function (val) {
                if (val) {
                    this.$refs.cascader.handleClose();
                    this.$refs.select.hideMenu();
                }
            },
            changeTypeOfRange: function () {
                this.qryParam.objRange = [];
            },
            saveQry: function () {
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        _this.queryInfoType = _this.qryParam.item[0];
                        _this.qryModel.show = true;
                    }
                });
            },
            loadQryInfoList: function () {
                var _this = this;
                qryInfoApi.list({accessPermission: "0", homeType: "0"}).then(function (res) {
                    _this.qryModel.list = buildQryInfoList(res.data);
                });
            },
            saveQrySuccessed: function () {
                this.loadQryInfoList();
            },
            getLimit: function(){
                var _this=this
                var param = {
                    name: 'reportFunction',
                    compId :'9999999999'
                };
                api.getParameters(param).then(function (res) {
                    if(_.isArray(res.data.children)){
                        var obj = _.find(res.data.children, function (item) {
                            return item.attr1 == 'reportFunction.dataNumLimit';
                        })

                        if(obj) _this.limit= parseInt(obj.result);
                        else _this.limit = 10;
                    }

                })
            },
        },
        ready: function () {
            this.getLimit();
        },
        route: {
            //因为router使用了keeplive, 所以需要每次激活二级路由的时候重新刷新table
            activate: function (transition) {
                this.loadQryInfoList();
                //路由生命周期必须调用
                transition.next();
            }
        }
    })
    return component;
});
