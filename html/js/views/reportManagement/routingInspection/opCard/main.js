define(function (require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var dateUtils = require("../../tools/dateUtils");
    var dataUtils = require("../../tools/dataUtils");
    var objSelect = require("views/reportManagement/reportDynamic/dialog/objSelect");


    var api = require("../vuex/api");

    var typeOfRanges = [
        {value: "frw", label: '公司'},
        {value: "dep", label: '部门'}
    ];
    var specialtyTypes = [
        {value: "0", label: '全部'},
        {value: "1", label: '工艺'},
        {value: "2", label: '机械设备'},
        {value: "3", label: '压缩机'},
        {value: "4", label: '仪表自动化'},
        {value: "5", label: '计量'},
        {value: "6", label: '电气'},
        {value: "7", label: '通信'},
        {value: "8", label: '管道'},
        {value: "9", label: '应急'}
    ];
    var opCardTypes = [
        {value: "0", label: '全部'},
        {value: "1", label: '操作票'},
        {value: "2", label: '维检修作业卡'}
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
            typeOfRange: 'frw',
            dateRange: [dateUtils.getMonthFirstDay(current), dateUtils.getMonthLastDay(current)],
            objRange: [],
            specialityType: '0',
            opCardType: '0'
        };
        var orgDataLevel = window.localStorage.getItem("org_data_level");
        if (orgDataLevel < 30) {
            typeOfRanges = [{value: "dep", label: '部门'}];
            defaultFilterModel.typeOfRange = 'dep';
        }
        return {
            qryInfoModel: {
                title: '票卡统计'
            },
            qryParam: defaultFilterModel,
            typeOfRanges: typeOfRanges,
            specialtyTypes: specialtyTypes,
            opCardTypes: opCardTypes,
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
            pieChartOpt: {
                series: []
            },
            barChartOpt: {
                series: []
            },
            drillModel: {
                show: false,
                title: "明细",
                //导出excel服务地址
                exportURL: '',
                table: {
                    //数据请求地址
                    url: '/rpt/jse/opcard/speciality/all/details/{currentPage}/{pageSize}',
                    //请求参数
                    qryParam: null,
                    //对应表格字段
                    columns: [
                        {
                            title: "专业",
                            width: 80,
                            fieldName: "specialityType",
                            fieldType: "custom",
                            render: function (data) {
                                var t = data.specialityType;
                                var o = _.find(specialtyTypes, "value", t);
                                if(_.isPlainObject(o)) {
                                    return o.label;
                                }
                                return ''
                            }
                        },
                        {
                            title: "管理处",
                            width: 140,
                            fieldType: "custom",
                            render: function (data) {
                                if (data.compId) {
                                    return LIB.getDataDic("org", data.compId)["csn"];
                                }
                            }
                        },
                        {
                            title: "站队",
                            width: 120,
                            fieldType: "custom",
                            render: function (data) {
                                if (data.orgId) {
                                    return LIB.getDataDic("org", data.orgId)["deptName"];
                                }
                            }
                        },
                        {
                            title: "票/卡",
                            width: 100,
                            fieldName: "type",
                            render: function (data) {
                                return data.type === '1' ? '操作票' : '维检修作业卡';
                            }
                        },
                        {
                            title: "票/卡名称",
                            width: 240,
                            fieldName: "name"
                        },
                        {
                            title: "次数",
                            width: 80,
                            fieldName: "cardCount"
                        }
                    ]
                }
            }
        }
    };
    var opt = {
        template: template,
        components: {
            objSelect: objSelect
        },
        data: function () {
            return buildDataModel();
        },
        props: {
            qryInfoDetail: Object
        },
        methods: {
            buildPieChart: function (data) {
                var opt = {
                    title: {x: 'center', text: '专业统计', top: 20},
                    tooltip: {trigger: 'item', formatter: "{a} <br/>{b} : {c} ({d}%)"}
                };
                var legend = {
                    orient: 'vertical',
                    left: '20px',
                    top: 'middle',
                    padding: [30, 0],
                    data: []
                };
                var sery = {
                    name: '专业',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                formatter: '{b} : {c} ({d}%)'
                            },
                            labelLine: {show: true}
                        }
                    },
                    data: []
                };
                _.find(data, function (d, i) {
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
                this.pieChartOpt = opt;
                this.$refs.pieChart.hideLoading();
            },
            buildBarChart: function (data) {
                var opt = {
                    title: {x: 'center', text: '使用票卡次数统计', top: 20},
                    tooltip: {trigger: 'axis'},
                    yAxis: [{type: 'value'}],
                    grid: {
                        left: '0',
                        right: '4%',
                        bottom: 10,
                        top: 20,
                        containLabel: true
                    }
                };
                var xAxis1 =
                    {
                        type: 'category',
                        axisLabel: {
                            interval: 0
                        }, data: []
                    };
                var sery = {
                    name: '使用票卡次数',
                    type: 'bar',
                    barMaxWidth: 40,
                    label: {normal: {show: true, position: 'top'}},
                    itemStyle: {normal: {barBorderRadius: [5, 5, 0, 0]}},
                    data: []
                };
                data = _.sortBy(data, function (v) {
                    return v * -1;
                });
                _.forEach(data, function (d, i) {
                    xAxis1.data.push(d.xValue)
                    sery.data.push({
                        xId: d.xId,
                        name: d.xValue,
                        value: d.yValue
                    });
                });

                if(20 < xAxis1.data.length){//如果分组数量大等于限制数量,添加缩放滚动条
                    opt.grid.bottom = '15%';
                    opt.dataZoom = [
                        {
                            type: 'slider',
                            show: true,
                            xAxisIndex: 0,
                            start: 0,
                            end: Math.max(parseInt((15 * 100 / data.length)), 1),
                            zoomLock:true,
                            showDetail:false
                        }
                    ]
                }

                var maxLengthOfName = _.max(xAxis1.data, function (d) {
                    return d.length
                }).length;
                if (8 <= maxLengthOfName) {//如果名称最大值大于8个字符，横坐标标签倾斜30度,并截断
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
                opt.series = [sery];
                this.barChartOpt = opt;
                this.$refs.barChart.hideLoading();
            },

            showChartLoading: function () {
                this.$refs.pieChart.showLoading();
                this.$refs.barChart.showLoading();
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
                    'dep': '2'
                };
                var params = {
                    specialityType: this.qryParam.specialityType,
                    opCardType: this.qryParam.opCardType,
                    objType: this.qryParam.typeOfGroup,
                    type: types[this.qryParam.typeOfRange],
                    startDateRange: this.qryParam.dateRange[0].Format("yyyy-MM-dd hh:mm:ss"),
                    endDateRange: this.qryParam.dateRange[1].Format("yyyy-MM-dd 23:59:59"),
                    idsRange: this._getIdsRange(this.qryParam.objRange)
                };
                return params;
            },

            doQuery: function () {
                var _this = this;
                var qryParam = this._getParams();
                this.showChartLoading();
                api.queryOpCardSpeciality(qryParam).then(function (res) {
                    _this.buildPieChart(res.data);
                });
                api.queryOpCardAll(qryParam).then(function (res) {
                    _this.buildBarChart(res.data);
                });
            },

            clickPieChart: function (v) {
                // this.drillModel.table.qryParam = {
                //     startDateRange: this.qryInfoModel.vo.dateRange[0],
                //     endDateRange: this.qryInfoModel.vo.dateRange[1],
                //     idsRange: v.data.xId
                // };
                var params =  this._getParams();
                var name = v.name;
                var st = _.find(specialtyTypes, "label", name);
                var t = _.get(st, "value");

                params.specialityType = t;
                this.drillModel.table.qryParam = params;
                this.drillModel.table.url = '/rpt/jse/opcard/speciality/all/details/{curPage}/{pageSize}';
                this.drillModel.exportURL = '/rpt/jse/opcard/speciality/exportExcel';
                this.drillModel.show = true;
            },
            clickBarChart: function (v) {
                // this.drillModel.table.qryParam = {
                //     idsRange: _.map(this.qryInfoModel.vo.objRange, function (r) {
                //         return r.key;
                //     }).join(","),
                //     objValue: v.data.name,
                //     timeType: this.qryInfoModel.vo.timeType
                // };
                var id = v.data.xId;
                var params =  this._getParams();
                params.idsRange = id;
                this.drillModel.table.qryParam = params;
                this.drillModel.table.url = '/rpt/jse/opcard/org/all/details/{curPage}/{pageSize}';
                this.drillModel.exportURL = '/rpt/jse/opcard/org/exportExcel';
                this.drillModel.show = true;
            },
            doExportData: function () {
                window.open(this.drillModel.exportURL + LIB.urlEncode(this.drillModel.table.qryParam).replace("&", "?"));
            }
        },
        ready: function () {
            this.doQuery();
        }
    };
    return LIB.Vue.extend(opt);
});