define(function (require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    // var objSelect = require("./objSelect")
    var dateUtils = require("./dateUtils");

    var api = require('./vuex/api')
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
            dateRange: [dateUtils.getMonthFirstDay(current), dateUtils.getMonthLastDay(current)],
            objRange: [],
            charts: {
                opt: {}
            },
            compId: null,
            checked: false,
            type: [],

            list: [],
            tableHeader: [],
            tableHeader1: [],
            tableData1: [],
            tableData2: [],
            tableData3: [],


        }
    };
    var opt = {
        template: template,
        components: {

        },
        data: function () {
            return new dataModel();
        },
        watch: {
            compId: function (val) {
                var _this = this
                if (val) {
                    api.workcardType({ compId: val }).then(function (res) {
                        if (res.data) {
                            _this.list = res.data
                        } else {
                            _this.list = []
                        }

                        _this.type = []
                    })
                }
            }
        },
        methods: {
            getBarChartSery3: function (data) {
                var sery = [];
                var yAxis = {
                    type: 'category',
                    axisLabel: {
                        interval: 0
                    },
                    data: []
                };
                var value = {
                    name: '已完成数量',
                    type: 'bar',
                    stack: '总量',
                    barMaxWidth: 40,
                    label: {
                        normal: {
                            show: true,
                            position: 'inside'
                        }
                    },

                    data: []
                };
                // var value1 = {
                //     name: '巡检项数量',
                //     type: 'line',


                //     data: []
                // };
                var value2 = {
                    name: '未完成数量',
                    type: 'bar',
                    stack: '总量',
                    barMaxWidth: 40,
                    label: {
                        normal: {
                            show: true,
                            position: 'inside'
                        }
                    },

                    data: []
                };
                _.each(data, function (item) {
                    value.data.push(item.yValues.yValue1)
                    // value1.data.push(item.total)
                    value2.data.push(item.yValues.yValue2)
                })
                sery.push(value);
                // sery.push(value1);
                sery.push(value2);

                return sery;
            },
            buildChart: function (data) {
                this.$refs.chart.showLoading();
                var total = 0;
                // this.mainModel.charts.barChart.thirdBarChart.typeObj = _.uniq(data,"xValue");
                var xdata = _.pluck(data, "xName");
                var opt = {

                    tooltip: { trigger: 'axis' },
                    // color: ['#c26002'],
                    yAxis: {
                        type: 'value'
                    },
                    xAxis: {
                        type: 'category',
                        data: xdata,
                        axisLabel: {
                            interval: "0",
                            rotate: "30"
                        }
                    },
                    grid: {
                        left: 10,
                        right: 30,
                        bottom: 30,
                        containLabel: true
                    },
                    // legend: {
                    //     data: riskKeyValue[0]
                    // },
                };
                if (10 <= data.length) {//如果分组数量大等于限制数量,调整x轴标签倾斜
                    opt.dataZoom = [
                        { show: true, xAxisIndex: 0, startValue: 0, endValue: 10 }, { type: 'inside' }
                    ];
                }
                opt.series = this.getBarChartSery3(data);

                this.charts.opt = opt;
               
            },
            doQuery: function () {
                // criteria.dateValue: {"startApplyDate":"2020-11-12","endApplyDate":"2020-12-08 23:59:59"}
                var _this = this;

                if (this.dateRange.length > 1 && !!this.compId) {
                    if (this.dateRange[0] == null || this.dateRange[1] == null) {
                        LIB.Msg.error('请选择查询条件')
                        return
                    }

                    var obj = {
                        compId: this.compId,
                        startDateRange: this.dateRange[0].Format("yyyy-MM-dd hh:mm:ss"),
                        endDateRange: this.dateRange[1].Format("yyyy-MM-dd hh:mm:ss"),
                        workCatalogIds: this.type.length > 0 ? this.type.join(",") : null
                    }
                    
                    api.workcardEchart(obj).then(function (res) {
                        _this.tableHeader = []
                        _this.tableHeader1 = []
                        _this.tableData1 = []
                        _this.tableData2 = []
                        _this.tableData3 = []
                        
                        if (res.data.length > 0) {
                            res.data = _.sortBy(res.data, function (item) {
                                return -item.yValues.yValue3;
                            });
                            var map = {}
                            _.each(res.data, function (item) {
                                if (item.xName.indexOf('级)') > 0) {
                                    item.yName = item.xName.substring(0, item.xName.length - 4)
                                } else {
                                    item.yName = item.xName
                                }

                                if (map.hasOwnProperty(item.xId)) {
                                    map[item.xId].children.push(item)
                                } else {
                                    if (item.yName == item.xName) {
                                        map[item.xId] = {
                                            val: item,
                                            children: []
                                        }
                                    } else {
                                        map[item.xId] = {
                                            val: item,
                                            children: [item]
                                        }
                                    }

                                }
                            })
                            
                            Object.keys(map).forEach(function (key) {
                                var col = 1
                                var row = false
                                if (map[key].children.length > 0) {
                                   
                                    col = map[key].children.length
                                    row = true
                                    _.each(map[key].children, function (item) {
                                        if (item.xName.indexOf('1级')>0) {
                                            _this.tableHeader1.push({val:'一级'})
                                        }else{
                                            _this.tableHeader1.push({val:'二级'})
                                        }
                                        // _this.tableHeader1.push(item.xName)
                                    })
                                }
                                // else{

                                // _this.tableHeader1.push(map[key].val.xName)

                                // }
                                _this.tableHeader.push({ val: map[key]['val'].yName, col: col, row: row })

                            })
                            _this.buildChart(res.data)

                            _this.tableHeader.push({ val: '小计', col: 1, row: false })

                            _.each(res.data, function (item) {


                                _this.tableData1.push({ val: parseInt(item.yValues.yValue1) })
                                _this.tableData2.push({ val: parseInt(item.yValues.yValue2) })
                                _this.tableData3.push({ val: parseInt(item.yValues.yValue3) })
                            })
                            // _this.tableData1 = _.pluck(res.data, "yValues.yValue1");
                            _this.tableData1.push({ val: _.sum(_this.tableData1, 'val') })
                            // _this.tableData2 = _.pluck(res.data, "yValues.yValue2");
                            _this.tableData2.push({ val: _.sum(_this.tableData2, 'val') })
                            // _this.tableData3 = _.pluck(res.data, "yValues.yValue3");
                            _this.tableData3.push({ val: _.sum(_this.tableData3, 'val') })

                            _this.$nextTick(function () {

                                var tableWidth = $('.totalTable').width()
                                var width = tableWidth /( res.data.length + 1)
                                 
                                var tdWidth = width
                                _this.$refs.chart.resize();
                                this.$refs.chart.hideLoading();
                                $('.autoWidth').css('width', tdWidth + 'px')
                            }

                            )
                        } else {
                            _this.buildChart([])
                            _this.$refs.chart.hideLoading();
                            _this.tableHeader = [{ val: '暂无数据', col: 1, row: false }]
                            _this.tableHeader1 = []
                            _this.tableData1 = [{ val: '暂无数据' }]
                            _this.tableData2 = [{ val: '暂无数据' }]
                            _this.tableData3 = [{ val: '暂无数据' }]
                            LIB.Msg.warning('暂无数据')
                        }

                    })
                } else {
                    LIB.Msg.warning('请选择查询条件')
                }

            },
            doExport: function () {
                if (this.dateRange.length > 1 && !!this.compId) {
                    if (this.dateRange[0] == null || this.dateRange[1] == null) {
                        LIB.Msg.error('请选择查询条件')
                        return
                    }
                    var obj = {
                        compId: this.compId,
                        startDateRange: this.dateRange[0].Format("yyyy-MM-dd hh:mm:ss"),
                        endDateRange: this.dateRange[1].Format("yyyy-MM-dd hh:mm:ss"),
                        workCatalogIds: this.type.length > 0 ? this.type.join(",") : null
                    };
                    window.open("/rpt/iptw/workcard/number/exportexcel" + LIB.urlEncode(obj).replace("&", "?"));
                } else {
                    LIB.Msg.error('请选择查询条件')
                }

            },
        },
        ready: function () {
            if (LIB.user.compId) {
                this.compId = LIB.user.compId
                this.doQuery()
            }
            this.buildChart([])
            this.tableHeader = [{ val: '暂无数据', col: 1, row: false }]
            this.tableHeader1 = []
            this.tableData1 = [{ val: '暂无数据' }]
            this.tableData2 = [{ val: '暂无数据' }]
            this.tableData3 = [{ val: '暂无数据' }]
            // this.deptSelectModel.filterData.compId = LIB.user.compId
        }
    };
    return LIB.Vue.extend(opt);
});