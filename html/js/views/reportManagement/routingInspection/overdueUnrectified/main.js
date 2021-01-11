define(function (require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var objSelect = require("views/reportManagement/reportDynamic/dialog/objSelect");
    var dateUtils = require("views/reportManagement/tools/dateUtils");
    var dataUtils = require("views/reportManagement/tools/dataUtils");
    var echartTools = require("views/reportManagement/tools/echartTools");
    var tableSelectModal = require("../dialog/selectCheckTable");

    var api = require("../vuex/api");

    var mixin = require("views/reportManagement/tools/chartUtils/charts/normal/normalMixin");

    var typeOfRanges = [
        {value: "frw", label: '公司'},
        {value: "dep", label: '部门'},
        // {value:"equip",label:'设备设施'},
        // {value:"equipitem",label:'设备设施子件'},
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
            checkTypes: [],
        };
        return {
            typeOfRanges: typeOfRanges,
            checkTypes: [],
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
                exportAbsDataUrl: '/rpt/iri/checkreform/overdueunrectified/abs/details/exportexcel',
                exportTrendDataUrl: '/rpt/iri/checkreform/overdueunrectified/trend/details/exportexcel',
                table: {
                    url: null,
                    absUrl: 'rpt/iri/checkreform/overdueunrectified/abs/details{/curPage}{/pageSize}',
                    trendUrl: 'rpt/iri/checkreform/overdueunrectified/trend/details{/curPage}{/pageSize}',
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
                            title: "超期未整改数",
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
            changeMethod: function (m) {
                if (this.method === m) {
                    return;
                }
                var current = new Date();
                if (m == 'abs') {
                    this.qryParam.dateRange = [dateUtils.getMonthFirstDay(current), dateUtils.getMonthLastDay(current)];
                } else {
                    this.qryParam.dateRange = [dateUtils.getYearFirstDay(current), dateUtils.getMonthLastDay(current)];
                }
                this.method = m;

                this.doQuery();
            },
            doQuery: function () {
                this.titleValue = this.qryParam.typeOfRange;
                switch (this.method) {
                    case 'abs':
                        this._getAbs();
                        break;
                    case 'trend':
                        this._getTrend();
                        break;
                }

            },
            _getAbs: function () {
                var _this = this;
                var params = this._getParams();
                api.queryOverdueUnrectifiedAbs(params).then(function (res) {
                    if (!res.data || res.data.length == 0) {
                        LIB.Msg.info("当前条件查询，暂无数据");
                    }
                    _this.charts.opt = _this.buildBarChars(res.data, _this.dataNumLimit);
                })
            },
            _getTrend: function () {
                var _this = this;
                var params = this._getParams();
                api.queryOverdueUnrectifiedTrend(params).then(function (res) {
                    if (!res.data || res.data.length == 0) {
                        LIB.Msg.info("当前条件查询，暂无数据");
                    }
                    _this.charts.opt = _this.buildLineChars(res.data, 20, 1);
                })
            },
            doQueryCheckTypes: function () {
                var _this = this;
                api.queryRiCheckTypes().then(function (res) {
                    _this.checkTypes = res.data;

                });
            },
            _getIdsRange: function (ranges) {
                var array = _.map(ranges, function (r) {
                    return r.key;
                });
                return array.join(",");
            },
            _getParams: function () {
                var paramOpt = _.propertyOf(this.qryParam);
                var types = {
                    'frw': '1',
                    'dep': '2',
                    'equip': '3',
                    'equipitem': '4'
                };
                var params = {
                    checkTypeIds: paramOpt("checkTypes").join(","),
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
                } else if (this.method === 'trend') {
                    this.detailModel.table.url = this.detailModel.table.trendUrl;
                    //根据日期生成动态表头
                    var startDate = this.qryParam.dateRange[0];
                    var endDate = this.qryParam.dateRange[1];
                    var dateColumns = [];
                    var date = new Date(startDate.Format("yyyy-MM"));
                    for (var i = 1; date <= new Date(endDate.Format("yyyy-MM")); date = new Date(date.getFullYear(), date.getMonth() + 1)) {
                        dateColumns.push({title: date.Format("yyyy-MM"), fieldName: "value" + i,});
                        i += 1;
                    }
                    this.detailModel.table.columns = this.detailModel.table.trendColumns.concat(dateColumns);

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
                } else if (this.method === 'trend') {
                    window.open(_this.detailModel.exportTrendDataUrl + LIB.urlEncode(_this.$refs.rptDetailsTable.getCriteria()).replace("&", "?"));
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
            this.doQueryCheckTypes();
        },
        route: {}
    };
    return LIB.Vue.extend(opt);
});
