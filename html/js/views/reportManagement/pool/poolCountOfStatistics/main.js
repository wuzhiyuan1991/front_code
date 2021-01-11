define(function (require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var api = require("./vuex/api");
    var dataUtils = require("../../tools/dataUtils");
    var dateUtils = require("views/reportManagement/tools/dateUtils");
    var components = {
        'obj-select': require("../../tools/dialog/objSelect")
    };
    var dataModel = function () {
        var current = new Date();
        var currYear = current.getFullYear();
        var times = {
            prevWeek: new Date(currYear, current.getMonth(), current.getDate() - 7),
            prevMonth: new Date(currYear, current.getMonth() - 1),
            prevQuarter: new Date(currYear, current.getMonth() - 3),
            prevYear: new Date(currYear - 1, current.getMonth())
        };
        return {
            mainModel: {
                title: '隐患总数统计',
                vo: {
                    timeType: 1,
                    dateRange: [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)],
                    objRange: [],
                    type: "0",
                },
                charts: {
                    pieChartOpt: {
                        series: []
                    },
                    barChartOpt: {
                        series: []
                    }
                },
                stateList : [
                    {value:"0",label:'全部'},
                    {value:"1",label:'未完成'},
                    {value:"2",label:'已完成'}
                ]
            },
            datePickModel: {
                options: {
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
                }
            },
        }
    };
    var opt = {
        template: template,
        components: components,
        data: function () {
            return new dataModel();
        },
        methods: {
            changeQryYear: function (year) {
                this.mainModel.vo.dateRange = [year + '-01-01 00:00:00', year + '-12-31 23:59:59'];
            },
            showChartLoading: function () {
                this.$refs.pieChart.showLoading();
                this.$refs.barChart.showLoading();
            },
            toggleLegend: function () {
                var opt = this.mainModel.charts.pieChartOpt;
                opt.legend.show = !opt.legend.show;
                if (opt.legend.show) {
                    opt.series[0].center = ['55%', '50%'];
                    opt.toolbox.feature.myTool1.title = '隐藏图例';
                } else {
                    opt.series[0].center = ['50%', '50%'];
                    opt.toolbox.feature.myTool1.title = '显示图例';
                }
            },
            buildPieChart: function (data) {
                
                var _this = this;
                var opt = {
                    title: {
                        x: 'center',
                        text: '隐患总数统计-饼状图',
                        top: 20
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    toolbox: {
                        feature: {
                            myTool1: {
                                show: true,
                                title: '隐藏图例',
                                icon: 'image://images/toggle.svg',
                                onclick: function (){
                                    _this.toggleLegend();
                                }
                            }
                        },
                        top: 5,
                        left: 5,
                        iconStyle: {
                            emphasis: {
                                textPosition: 'right',
                                textAlign: 'left'
                            }
                        }
                    }
                };
                var legend = {
                    type: 'scroll',
                    orient: 'vertical',
                    left: 10,
                    top: 'middle',
                    padding: [30, 0],
                    // bottom: 20,
                    z: 1,
                    data: [],
                    show: true
                };
                var sery = {
                    startAngle: 0,
                    name: '隐患总数',
                    type: 'pie',
                    radius: '50%',
                    center: ['55%', '50%'],
                    label: {
                        normal: {
                            show: true,
                            formatter: '{b} : {c} ({d}%)'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '18',
                                fontWeight: 'bold',
                                backgroundColor: 'white'
                            },
                            borderColor: '#aaa',
                            borderWidth: 1,
                            borderRadius: 4,
                            padding: 5
                        }
                    },
                    data: []
                };
                _.find(data, function (d, i) {
                    LIB.reNameOrg(d,'xValue')
                    legend.data.push(d.xValue);
                    sery.data.push({
                        xId: d.xId,
                        name: d.xValue,
                        value: d.yValue
                    });
                    return i + 1 == 20;
                    //return false;
                });
                opt.legend = legend;
                opt.series = [sery];
                this.mainModel.charts.pieChartOpt = opt;
                this.$refs.pieChart.hideLoading();
            },
            buildBarChart: function (data) {
                var opt = {
                    title: {x: 'center', text: '隐患总数统计', top: 20},
                    tooltip: {trigger: 'axis'},
                    xAxis: {
                        type: 'value'
                    },
                    grid: {
                        left: 10,
                        right: 30,
                        bottom: 30,
                        containLabel: true
                    }
                };
                var yAxis = {
                    type: 'category',
                    axisLabel: {
                        interval: 0
                    },
                    data: []
                };
                var sery = {
                    name: '隐患总数',
                    type: 'bar',
                    barMaxWidth: 40,
                    label: {
                        normal: {
                            show: true,
                            position: 'inside'
                        }
                    },
                    itemStyle: {
                        normal: {
                            barBorderRadius: [0, 5, 5, 0]
                        }
                    },
                    data: []
                };
                _.find(_.sortBy(data, "xValue"), function (d, i) {
                    yAxis.data.push(d.xValue);
                    sery.data.push({
                        xId: d.xId,
                        name: d.xValue,
                        value: d.yValue
                    });
                    return i + 1 == 20;
                    //return false;
                });

                //如果名称最大值大于8个字符，横坐标标签倾斜30度,并截断
                var maxLengthOfName = _.max(yAxis.data, function (d) {return d.length}).length;
                if (8 <= maxLengthOfName) {
                    yAxis.axisLabel = _.extend(yAxis.axisLabel, {
                        // rotate: 30,
                        formatter: function (val) {
                            return dataUtils.sliceStr(val, 8);
                        }
                    });
                }
                opt.yAxis = yAxis;
                opt.series = [sery];
                this.mainModel.charts.barChartOpt = opt;
                this.$refs.barChart.hideLoading();
            },
            getQryParam: function () {
                var vo = this.mainModel.vo;
                var qryParam;
                var dateRange = vo.dateRange;
                if (dateRange.length == 2 && vo.dateRange) {
                    var beginDate = vo.dateRange[0].Format("yyyy-MM-dd hh:mm:ss");
                    var endDate = vo.dateRange[1].Format("yyyy-MM-dd 23:59:59");
                    qryParam = {
                        startDateRange: beginDate,
                        endDateRange: endDate
                    };
                } else {
                    qryParam = {};
                }
                qryParam.idsRange = _.map(vo.objRange, function (r) {
                    return r.key;
                }).join(",");
                qryParam.type = vo.type;
                return _.extend(qryParam, _.pick(vo, "timeType"));
            },
            doQry: function () {
                var _this = this;
                var qryParam = this.getQryParam();
                this.showChartLoading();
                api.poolCountByOrg(qryParam).then(function (res) {
                    _this.buildPieChart(res.data);
                });
                api.poolCountByDate(qryParam).then(function (res) {
                    _this.buildBarChart(res.data);
                });
            }
        },
        ready: function () {
            this.doQry();
        }
    };
    return LIB.Vue.extend(opt);
});