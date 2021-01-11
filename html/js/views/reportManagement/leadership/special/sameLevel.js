define(function (require) {
    var LIB = require('lib');
    var template = require("text!./average.html");
    var dateUtils = require("../../tools/dateUtils");
    var dataUtils = require("../../tools/dataUtils");
    var api = require("../vuex/api");

    var cycles = [
        {
            id: "1",
            name: "天"
        },
        {
            id: "2",
            name: "周"
        },
        {
            id: "6",
            name: "旬"
        },
        {
            id: "3",
            name: "半月"
        },
        {
            id: "4",
            name: "月"
        },
        {
            id: "5",
            name: "季度"
        },
        {
            id: "7",
            name: "半年"
        },
        {
            id: "8",
            name: "年"
        }
    ];
    var asmtTableSelectModal = require("componentsEx/selectTableModal/asmtTableSelectModal");
    var current = new Date();
    var currYear = current.getFullYear();
    var times = {
        prevWeek: new Date(currYear, current.getMonth(), current.getDate() - 7),
        prevMonth: new Date(currYear, current.getMonth() - 1),
        prevQuarter: new Date(currYear, current.getMonth() - 3),
        prevYear: new Date(currYear - 1, current.getMonth())
    };
    var dataModel = function () {
        return {
            mainModel: {
                title: "同层级积分明细",
                datePickOpts: {
                    shortcuts: [
                        {
                            text: '本周', value: function () {
                            return [dateUtils.getWeekFirstDay(current), dateUtils.getWeekLastDay(current)];
                        }
                        },
                        {
                            text: '本月', value: function () {
                            return [dateUtils.getMonthFirstDay(current), dateUtils.getMonthLastDay(current)];
                        }
                        },
                        {
                            text: '本季度', value: function () {
                            return [dateUtils.getQuarterFirstDay(current), dateUtils.getQuarterLastDay(current)];
                        }
                        },
                        {
                            text: '本年', value: function () {
                            return [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)];
                        }
                        },
                        {
                            text: '上周', value: function () {
                            return [dateUtils.getWeekFirstDay(times.prevWeek), dateUtils.getWeekLastDay(times.prevWeek)];
                        }
                        },
                        {
                            text: '上月', value: function () {
                            return [dateUtils.getMonthFirstDay(times.prevMonth), dateUtils.getMonthLastDay(times.prevMonth)];
                        }
                        },
                        {
                            text: '上季度', value: function () {
                            return [dateUtils.getQuarterFirstDay(times.prevQuarter), dateUtils.getQuarterLastDay(times.prevQuarter)];
                        }
                        },
                        {
                            text: '去年', value: function () {
                            return [dateUtils.getYearFirstDay(times.prevYear), dateUtils.getYearLastDay(times.prevYear)];
                        }
                        }
                    ]
                },
                //柱状图配置
                barChartOpt: {
                    series: []
                },
                qryRules: {
                    "asmtTable.id": [
                        LIB.formRuleMgr.require("自评表")
                    ],
                    dateRange: [
                        {type: 'array', required: true, message: '请选择统计日期'},
                        {
                            validator: function (rule, value, callback) {
                                return value[1] < value[0] ? callback(new Error('结束时间须不小于开始时间')) : callback();
                            }
                        }
                    ]
                }
            },
            qryModel: {
                dateRange: [],
                asmtTable: {id: '', name: ''},
                dateType: '2'
            },
            asmtTableSelectModel: {
                visible: false
            },
            cycles: cycles,
        }
    };
    var opt = {
        template: template,
        components: {
            "asmtTableSelectModal": asmtTableSelectModal
        },
        data: dataModel,
        computed: {},
        methods: {
            initQryModel: function () {
                this.qryModel.dateRange = [
                    dateUtils.getMonthFirstDay(current),
                    dateUtils.getMonthLastDay(current)
                ];
            },
            doShowAsmtTableSelectModal: function () {
                this.asmtTableSelectModel.visible = true
            },
            doSaveAsmtTable: function (data) {
                this.qryModel.asmtTable = _.pick(data[0], ['id', 'name']);
                this._getPlansByTableId(this.qryModel.asmtTable.id);
            },
            //查询
            doQry: function () {
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        var paramOpt = _.propertyOf(_this.qryModel);
                        var dateRange = paramOpt("dateRange");
                        var beginDate = dateRange[0].Format("yyyy-MM-dd hh:mm:ss");
                        var endDate = dateRange[1].Format("yyyy-MM-dd 23:59:59");
                        var qryParam = {
                            startDateRange: beginDate,
                            endDateRange: endDate,
                            frequencyType: _this.qryModel.dateType,
                            asmtTableId: _this.qryModel.asmtTable.id
                        };
                        _this.$api.getSameLevel(qryParam).then(function (res) {
                            _this.buildBarChartOpt(res.data);
                        });
                    }
                });
            },
            //构造柱状图报表配置
            buildBarChartOpt: function (data) {
                var opt = {
                    yAxis: [{name: '积分', type: 'value'}]
                };
                if (data.length > 0) {
                    opt.tooltip = [{trigger: 'axis', formatter: '{b}<br/>积分:{c}'}];
                }
                var sery1 = {
                    name: '自评积分',
                    type: 'bar',
                    barMaxWidth: 40,
                    label: {normal: {show: true, position: 'top'}},
                    itemStyle: {normal: {barBorderRadius: [5, 5, 0, 0]}},
                    data: []
                };
                var xAxis1 = {
                    type: 'category',
                    axisLabel: {
                        interval: 0
                    },
                    data: []
                };

                _.find(_.sortBy(data, function (d) {
                    return Number(d.yValue) * -1;
                }), function (v, i) {
                    var value = {
                        xId: v.xId,
                        xName: v.xName,
                        value: v.yValue
                    };
                    xAxis1.data.push(value.xName);
                    sery1.data.push(value);
                    return i === 19;
                });

                var maxLengthOfName = _.max(xAxis1.data, function (d) {
                    return d.length
                }).length;
                //如果名称最大值大于8个字符，横坐标标签倾斜30度,并截断
                if (8 <= maxLengthOfName) {
                    xAxis1.axisLabel = _.extend(xAxis1.axisLabel, {
                        rotate: 30,
                        formatter: function (val) {
                            return dataUtils.sliceStr(val, 8);
                        }
                    });
                    //扩大横坐标底部边距
                    opt.grid = {
                        bottom: 80
                    };
                }
                opt.xAxis = [xAxis1];
                opt.series = [sery1];
                this.mainModel.barChartOpt = opt;
            },
            _getPlansByTableId: function (id) {
                if (this._cacheTableId === id) {
                    return;
                }
                this._cacheTableId = id;
                var _this = this;
                var params = {
                    "asmtTable.id": id,
                    "criteria.intsValue": '{"disable": ["1", "2", "3"]}'
                };
                api.getPlansByTableId(params).then(function (res) {
                    var types = _.map(res.data, function (item) {
                        return _.get(item, 'asmtPlanSetting.frequencyType')
                    });
                    types = _.uniq(types);
                    _this.setCycles(types);
                })
            },
            setCycles: function (types) {
                var cycleGroup = _.groupBy(cycles, "id");
                this.cycles = _.map(types, function (t) {
                    return cycleGroup[t][0];
                });
                this.qryModel.dateType = _.get(this.cycles, "[0].id", "");
            }
        },
        ready: function () {
            this.$api = api;
            this.initQryModel();
            // this.$nextTick(function(){
            //     this.doQry();
            // });
        }
    };
    return LIB.Vue.extend(opt);
});