define(function (require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var objSelect = require("views/reportManagement/reportDynamic/dialog/objSelect");
    var dateUtils = require("views/reportManagement/tools/dateUtils");
    var dataUtils = require("views/reportManagement/tools/dataUtils");
    var echartTools = require("views/reportManagement/tools/echartTools");

    var api = require("../vuex/api");

    var mixin = require("views/reportManagement/tools/chartUtils/charts/normal/normalMixin");

    var typeOfRanges = [
        {value: "frw", label: '公司'},
        {value: "dep", label: '部门'},
        {value: "per", label: '员工'},
    ];
    var riTypes = [
        {value: "3", label: '全部'},
        {value: "1", label: '巡检记录'},
        {value: "2", label: '临时工作记录'}
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
            riType: '3',
        };
        var orgDataLevel = window.localStorage.getItem("org_data_level");
        if (orgDataLevel < 30) {
            typeOfRanges = [{value: "dep", label: '部门'}, {value: "per", label: '员工'}];
            defaultFilterModel.typeOfRange = 'dep';
        }
        return {
            typeOfRanges: typeOfRanges,
            riTypes: riTypes,
            qryParam: defaultFilterModel,
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
            detailModel: {
                show: false,
                title: '更多',
                exportAbsDataUrl: '/rpt/iri/checkdetail/find/problem/exportExcel',
                table: {
                    url: null,
                    absUrl: 'rpt/iri/checkdetail/find/problem/details{/curPage}{/pageSize}',
                    qryParam: null,
                    columns: [],
                    absColumns: [
                        {
                            title: "名称",
                            fieldName: "xValue",
                        },
                        {
                            title: "部门",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.deptId) {
                                    return LIB.getDataDic("org", data.deptId)["deptName"];
                                }
                            }
                        },
                        {
                            title: "公司",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.compId) {
                                    return LIB.getDataDic("org", data.compId)["csn"];
                                }
                            }
                        },
                        {
                            title: "发现问题数",
                            fieldName: "yValue"
                        }
                    ],
                    trendColumns: [
                        {
                            title: "名称",
                            fieldName: "name",
                        },
                        {
                            title: "部门",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.deptId) {
                                    return LIB.getDataDic("org", data.deptId)["deptName"];
                                }
                            }
                        },
                        {
                            title: "公司",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.compId) {
                                    return LIB.getDataDic("org", data.compId)["compName"];
                                }
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
        watch: {},
        methods: {
            changeTypeOfRange: function () {
                this.qryParam.objRange = [];
            },
            doQuery: function () {
                this._getAbs();
            },
            _getAbs: function () {
                var _this = this;
                var params = this._getParams();
                api.queryFindProblemAbs(params).then(function (res) {
                    if (!res.data || res.data.length == 0) {
                        LIB.Msg.info("当前条件查询，暂无数据");
                    }
                    _this.charts.opt = _this.buildBarChars(res.data);
                })
            },
            _getIdsRange: function (ranges) {
                var array = _.map(ranges, function (r) {
                    return r.key;
                });
                return array.join(",");
            },
            buildBarChars: function (data) {
                var typeOfRange = this.qryParam.typeOfRange;
                var opt = {
                    tooltip: [
                        {
                            trigger: 'axis',
                            formatter: function (params) {
                                var data = params[0].data;
                                var tip = '';
                                if(data) {
                                    tip = data.xName + echartTools.getCsn(typeOfRange, data.compId) + ":" + data.value;
                                }
                                return tip;
                            }
                        }
                    ],
                    grid: {
                        left: '0',
                        right: '4%',
                        bottom: 10,
                        top: 20,
                        containLabel: true
                    },
                    yAxis: [{type: 'value'}]
                };
                var sery1 = {
                    name: '检查次数',
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
                var _data = _.sortBy(data, function (d) {
                    return Number(d.yValue) * -1
                });
                _data = _.map(_.take(_data, this.dataNumLimit), function (v) {
                    return {
                        xId: v.xId,
                        xName: v.xValue,
                        deptId: v.deptId,
                        compId: v.compId,
                        value: v.yValue
                    };
                });
                xAxis1.data = _.pluck(_data, "xName");
                sery1.data = _data;

                if(20 < xAxis1.data.length){//如果分组数量大等于限制数量,添加缩放滚动条
                    opt.grid.bottom = '15%';
                    opt.dataZoom = [
                        {
                            type: 'slider',
                            show: true,
                            xAxisIndex: 0,
                            start: 0,
                            end: parseInt((20 / xAxis1.data.length) * 100),
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
                        bottom: 80,
                        top: 80
                    };
                }
                opt.xAxis = [xAxis1];
                opt.series = [sery1];
                return opt;
            },
            _getParams: function () {
                var types = {
                    'frw': '1',
                    'dep': '2',
                    'per': '3',
                };
                var params = {
                    riType: this.qryParam.riType,
                    objType: this.qryParam.typeOfGroup,
                    type: types[this.qryParam.typeOfRange],
                    startDateRange: this.qryParam.dateRange[0].Format("yyyy-MM-dd hh:mm:ss"),
                    endDateRange: this.qryParam.dateRange[1].Format("yyyy-MM-dd 23:59:59"),
                    idsRange: this._getIdsRange(this.qryParam.objRange),
                };
                return params;
            },
            showMore: function () {
                var _this = this;
                this.detailModel.table.qryParam = _.deepExtend({}, this._getParams());
                if (this.method === 'abs') {
                    this.detailModel.table.url = this.detailModel.table.absUrl;
                    this.detailModel.table.columns = this.detailModel.table.absColumns.concat();
                }
                var nameCol = this.detailModel.table.columns[0];
                var typeOfRange = _.find(typeOfRanges, function (item) {
                    return item.value == _this.qryParam.typeOfRange;
                }).label;
                if (nameCol.title != typeOfRange) {
                    nameCol.title = typeOfRange;
                }

                var isCompColShow = (this.detailModel.table.qryParam.type != "1");
                if (!isCompColShow) this.detailModel.table.columns.splice(2, 1)

                var isDeptColShow = (this.detailModel.table.qryParam.type != "1" && this.detailModel.table.qryParam.type != "2");
                if (!isDeptColShow) this.detailModel.table.columns.splice(1, 1)

                this.detailModel.show = true;
            },
            doExport: function () {
                var _this = this;
                if (this.method === 'abs') {
                    window.open(_this.detailModel.exportAbsDataUrl + LIB.urlEncode(_this.$refs.rptDetailsTable.getCriteria()).replace("&", "?"));
                }
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
