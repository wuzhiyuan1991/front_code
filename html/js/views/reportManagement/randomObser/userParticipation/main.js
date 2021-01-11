define(function (require) {
    var LIB = require('lib');
    var echarts = require("charts");
    var template = require("text!./main.html");
    var objSelect = require("views/reportManagement/reportDynamic/dialog/objSelect");
    var dateUtils = require("views/reportManagement/tools/dateUtils");
    var dataUtils = require("views/reportManagement/tools/dataUtils");
    var echartTools = require("views/reportManagement/tools/echartTools");

    var api = require("../vuex/api");
    var mixin = require("views/reportManagement/tools/chartUtils/charts/normal/normalMixin");

    var typeOfSorts = ['yValue3 desc', 'yValue3 asc', 'yValue1 desc', 'yValue1 asc'];

    var typeOfRanges = [{
            value: "frw",
            label: '公司'
        },
        {
            value: "dep",
            label: '部门'
        },
    ];

    var buildDataModel = function () {
        var current = new Date();
        var currYear = current.getFullYear();
        var times = {
            prevWeek: new Date(currYear, current.getMonth(), current.getDate() - 7),
            prevMonth: new Date(currYear, current.getMonth() - 1),
            prevQuarter: new Date(currYear, current.getMonth() - 3),
            prevYear: new Date(currYear - 1, current.getMonth())
        };
        var defaultFilterModel = {
            typeOfRange: 'dep',
            dateRange: [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)],
            objRange: [],
            typeOfSort: 0,
        };
        var orgDataLevel = window.localStorage.getItem("org_data_level");
        // if (orgDataLevel < 30) {
        //     defaultFilterModel.typeOfRange = 'dep';
        // }
        return {
            typeOfRanges: typeOfRanges,
            qryParam: defaultFilterModel,
            datePickModel: {
                options: {
                    shortcuts: [{
                            text: '本周',
                            value: function () {
                                return [dateUtils.getWeekFirstDay(current), dateUtils.getWeekLastDay(current)];
                            }
                        },
                        {
                            text: '本月',
                            value: function () {
                                return [dateUtils.getMonthFirstDay(current), dateUtils.getMonthLastDay(current)];
                            }
                        },
                        {
                            text: '本季度',
                            value: function () {
                                return [dateUtils.getQuarterFirstDay(current), dateUtils.getQuarterLastDay(current)];
                            }
                        },
                        {
                            text: '本年',
                            value: function () {
                                return [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)];
                            }
                        },
                        {
                            text: '上周',
                            value: function () {
                                return [dateUtils.getWeekFirstDay(times.prevWeek), dateUtils.getWeekLastDay(times.prevWeek)];
                            }
                        },
                        {
                            text: '上月',
                            value: function () {
                                return [dateUtils.getMonthFirstDay(times.prevMonth), dateUtils.getMonthLastDay(times.prevMonth)];
                            }
                        },
                        {
                            text: '上季度',
                            value: function () {
                                return [dateUtils.getQuarterFirstDay(times.prevQuarter), dateUtils.getQuarterLastDay(times.prevQuarter)];
                            }
                        },
                        {
                            text: '去年',
                            value: function () {
                                return [dateUtils.getYearFirstDay(times.prevYear), dateUtils.getYearLastDay(times.prevYear)];
                            }
                        }
                    ]
                }
            },
            selectModel: {},
            method: 'abs',
            charts: {
                opt: {
                    series: []
                }
            },
            maxDate: new Date().Format("yyyy-MM-dd HH:mm:ss"),
            leaveWorkerSwitch: false
        };
    };

    var opt = {
        template: template,
        mixins: [mixin],
        components: {
            objSelect: objSelect
        },
        data: function () {
            return buildDataModel();
        },
        watch: {
            leaveWorkerSwitch: function (values) {
                this.doQuery()
            }
        },
        methods: {
            changeTypeOfRange: function () {
                this.qryParam.objRange = [];
            },
            buildChars: function (data, dataLimit, showToolBox) {
                var _this = this;
                if ("abs" === this.method) {
                    var opt = {
                        tooltip: {
                            trigger: 'item',
                            formatter: function (param) {
                                var label = "";
                                label += param.name;
                                label += '<br/>' + echartTools.buildColorPie('#c23531') + "参与人数" + ' : ' + param.data.values.yValue1;
                                label += '<br/>' + echartTools.buildColorPie('#ddd') + "机构总人数" + ' : ' + param.data.values.yValue2;
                                label += '<br/>' + echartTools.buildColorPie("#2f4554") + "参与率" + ' : ' + param.data.values.yValue3 + "%";
                                return label;
                            }
                        },
                        yAxis: [{
                            name: '数量',
                            type: 'value'
                        }, {
                            name: '百分比(%)',
                            type: 'value',
                            min: 0,
                            axisLabel: {
                                formatter: "{value}%"
                            }
                        }],
                        grid: {
                            left: '0',
                            right: '4%',
                            bottom: 10,
                            top: 30,
                            containLabel: true
                        }
                    };

                    var xAxis1 = {
                        type: 'category',
                        axisLabel: {
                            interval: 0
                        },
                        data: []
                    };

                    var series = [{
                            name: "检查记录数",
                            type: 'bar',
                            stack: '检查记录数',
                            barMaxWidth: 40,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'inside'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    barBorderRadius: [5, 5, 0, 0],
                                    color: "#c23531"
                                }
                            },
                            data: []
                        },
                        {
                            name: "已执行",
                            type: 'bar',
                            barGap: '25%',
                            stack: '隐患数',
                            barMaxWidth: 40,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'inside'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    barBorderRadius: [5, 5, 0, 0],
                                    color: "#c23531"
                                }
                            },
                            data: []
                        },
                        {
                            name: "未执行",
                            type: 'bar',
                            stack: '隐患数',
                            barMaxWidth: 40,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'inside'
                                },
                                color: 'black'
                            },
                            itemStyle: {
                                normal: {
                                    barBorderRadius: [5, 5, 0, 0],
                                    color: "#ddd"
                                }
                            },
                            data: []
                        },
                        {
                            name: "完成率",
                            type: 'line',
                            //xAxisIndex: 1,
                            yAxisIndex: 1,
                            itemStyle: {
                                normal: {
                                    color: "#2f4554"
                                }
                            },
                            data: [],
                        },
                    ];
                    _.forEach(_.take(data, this.dataNumLimit), function (d, i) {
                        if (_this.qryParam.typeOfRange=='dep') {
                            LIB.reNameOrg(d,'xName')
                        }
                        xAxis1.data.push(d.xName);
                        var yValues = d.yValues;
                        series[0].data.push({
                            xId: d.xId,
                            name: d.xName,
                            compId: d.compId,
                            value: yValues.yValue4,
                            values: yValues
                        });
                        series[1].data.push({
                            xId: d.xId,
                            name: d.xName,
                            compId: d.compId,
                            value: yValues.yValue1,
                            values: yValues
                        });
                        series[2].data.push({
                            xId: d.xId,
                            name: d.xName,
                            compId: d.compId,
                            value: yValues.yValue2,
                            values: yValues
                        });
                        series[3].data.push({
                            xId: d.xId,
                            name: d.xName,
                            compId: d.compId,
                            value: yValues.yValue3,
                            values: yValues
                        });
                    });
                    if (20 < xAxis1.data.length) { //如果分组数量大等于限制数量,添加缩放滚动条
                        opt.grid.bottom = '15%';
                        opt.dataZoom = [{
                            type: 'slider',
                            show: true,
                            xAxisIndex: 0,
                            start: 0,
                            end: parseInt((20 / xAxis1.data.length) * 100),
                            zoomLock: true,
                            showDetail: false
                        }]
                    }
                    var maxLengthOfName = _.max(xAxis1.data, function (d) {
                        if (!!d) {
                            return d.length;
                        } else {
                            return 0;
                        }
                    }).length;
                    if (8 <= maxLengthOfName) { //如果名称最大值大于8个字符，横坐标标签倾斜30度,并截断
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
                    opt.series = series;

                }
                return opt;
            },
            doQuery: function () {
                this._getAbs();
            },
            _getAbs: function () {
                var _this = this;
                var params = this._getParams();
                _this.$refs.echarts.showLoading();
                api.queryTaskExecuteAbs(params).then(function (res) {
                    _this.$refs.echarts.hideLoading();
                    if (!res.data || res.data.length == 0) {
                        LIB.Msg.info("当前条件查询，暂无数据");
                    }
                    _this.charts.opt = _this.buildChars(res.data);
                })
            },
            _getIdsRange: function (ranges) {
                var array = _.map(ranges, function (r) {
                    return r.key;
                });
                return array.join(",");
            },
            _getParams: function () {
                var types = {
                    'frw': '1',
                    'dep': '2',
                };
                var params = {
                    type: types[this.qryParam.typeOfRange],
                    startDateRange: this.qryParam.dateRange[0].Format("yyyy-MM-dd hh:mm:ss"),
                    endDateRange: this.qryParam.dateRange[1].Format("yyyy-MM-dd 23:59:59"),
                    idsRange: this._getIdsRange(this.qryParam.objRange),
                    "criteria.strValue": {
                        orderBy: typeOfSorts[this.qryParam.typeOfSort]
                    },
                    containResignedData: Number(this.leaveWorkerSwitch).toString()
                };
                return params;
            },
            _queryDataNumLimit: function () {
                var _this = this;
                api.queryDataNumLimit().then(function (res) {
                    _this.dataNumLimit = Number(res.data.result) || 20;
                    _this.doQuery();
                })
            }
        },
        events: {},
        ready: function () {
            this._queryDataNumLimit();
        },
        route: {}
    };
    return LIB.Vue.extend(opt);
});