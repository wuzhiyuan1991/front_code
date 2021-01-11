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

    var typeOfSorts = ['yValue3 desc', 'yValue3 asc', 'yValue1 desc', 'yValue1 asc'];


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
            typeOfSort: 0,
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
                exportAbsDataUrl: '/rpt/iri/checkreform/reformrate/abs/details/exportexcel',
                exportTrendDataUrl: '/rpt/iri/checkreform/reformrate/trend/details/exportexcel',
                table: {
                    url: null,
                    absUrl: 'rpt/iri/checkreform/reformrate/abs/details{/curPage}{/pageSize}',
                    trendUrl: 'rpt/iri/checkreform/reformrate/trend/details{/curPage}{/pageSize}',
                    qryParam: null,
                    columns: [],
                    absColumns: [
                        {
                            title: "名称",
                            fieldName: "xName",
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
                            title: "已整改",
                            fieldName: "yValues.yValue1"
                        },
                        {
                            title: "未整改",
                            fieldName: "yValues.yValue2"
                        },
                        {
                            title: "整改率",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.yValues) {
                                    return data.yValues.yValue3 + '%';
                                }
                            }
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
            buildChars: function (data, dataLimit, showToolBox) {
                var _this = this;
                if ("abs" === this.method) {
                    var opt = {
                        tooltip: {
                            trigger: 'axis', formatter: function (params) {
                                var label = "";
                                _.each(params, function (param, i) {
                                    if (i == 0) label += param.name + (_this.qryParam.typeOfRange == 'frw' ? "" : echartTools.getCsn("ici", param.data.compId));
                                    label += '<br/>' + echartTools.buildColorPie(param.color) + param.seriesName + ' : ' + param.value;
                                    if (i == 2) label += '%';
                                });
                                return label;
                            }
                        },
                        yAxis: [{name: '数量', type: 'value'}, {name: '百分比(%)', type: 'value', min: 0, axisLabel: {formatter: "{value}%"}}],
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
                        data: [],
                    };
                    var series = [
                        {
                            name: "已整改",
                            type: 'bar',
                            stack: '隐患数',
                            barMaxWidth: 40,
                            label: {normal: {show: true, position: 'inside'}},
                            itemStyle: {normal: {barBorderRadius: [5, 5, 0, 0]}},
                            data: []
                        },
                        {
                            name: "未整改",
                            type: 'bar',
                            stack: '隐患数',
                            barMaxWidth: 40,
                            label: {normal: {show: true, position: 'inside'}, color: 'black'},
                            itemStyle: {normal: {color: '#ddd', barBorderRadius: [5, 5, 0, 0]}},
                            data: []
                        },
                        {
                            name: "整改率",
                            type: 'line',
                            yAxisIndex: 1,
                            data: []
                        }
                    ];
                    _.forEach(_.take(data, this.dataNumLimit), function (d, i) {
                        xAxis1.data.push(d.xName);
                        var yValues = d.yValues;
                        series[0].data.push({
                            xId: d.xId,
                            name: d.xName,
                            compId: d.compId,
                            value: yValues.yValue1
                        });
                        series[1].data.push({
                            xId: d.xId,
                            name: d.xName,
                            compId: d.compId,
                            value: yValues.yValue2
                        });
                        series[2].data.push({
                            xId: d.xId,
                            name: d.xName,
                            compId: d.compId,
                            value: yValues.yValue3
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
                                end: parseInt((20 / xAxis1.data.length) * 100),
                                zoomLock:true,
                                showDetail:false
                            }
                        ]
                    }

                    var maxLengthOfName = _.max(xAxis1.data, function (d) {
                        if (!!d) {
                            return d.length;
                        } else {
                            return 0;
                        }
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
                    opt.series = series;
                } else if ('trend' === this.method) {
                    var opt = this.buildLineChars(data, dataLimit, 1);
                    var typeOfRange = this.qryParam.typeOfRange;
                    opt.tooltip = {
                        trigger: 'axis', formatter: function (params) {
                            var tip = "";
                            _.each(params, function (param, i) {
                                if (i == 0) tip = param.name;
                                var data = param.data;
                                tip += "<br/>" + echartTools.buildColorPie(param.color) + data.yName + echartTools.getCsn(typeOfRange, data.compId) + ":" + ('-' == data.value ? '-' : data.value + '%');
                            });
                            return tip;
                        }
                    };
                    opt.yAxis[0].axisLabel = {
                        formatter: '{value}%'
                    };
                    _.each(opt.series, function (sery) {
                        sery.label.normal.formatter = '{c}%';
                    });
                }
                return opt;
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
                api.queryReformRateAbs(params).then(function (res) {
                    if (!res.data || res.data.length == 0) {
                        LIB.Msg.info("当前条件查询，暂无数据");
                    }
                    _this.charts.opt = _this.buildChars(res.data);
                })
            },
            _getTrend: function () {
                var _this = this;
                var params = this._getParams();
                api.queryReformRateTrend(params).then(function (res) {
                    if (!res.data || res.data.length == 0) {
                        LIB.Msg.info("当前条件查询，暂无数据");
                    }
                    _this.charts.opt = _this.buildChars(res.data, 20, 1);
                })
            },
            doQueryCheckTypes: function () {
                var _this = this;
                api.queryRiCheckTypes().then(function (res) {
                    _this.checkTypes = res.data;

                });
            },
            changeSort: function () {
                this.qryParam.typeOfSort += 1;
                if (this.qryParam.typeOfSort >= typeOfSorts.length) {
                    this.qryParam.typeOfSort = 0;
                }
                this.doQuery();
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
                    "criteria.strValue": {orderBy: typeOfSorts[this.qryParam.typeOfSort]},
                };

                return params;
            },
            showMore: function () {
                var _this = this;
                this.detailModel.table.qryParam = _.deepExtend({}, this._getParams());
                if (this.method == 'abs') {
                    this.detailModel.table.url = this.detailModel.table.absUrl;
                    this.detailModel.table.columns = this.detailModel.table.absColumns.concat();
                } else if (this.method == 'trend') {
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
                if (this.method == 'abs') {
                    window.open(_this.detailModel.exportAbsDataUrl + LIB.urlEncode(_this.$refs.rptDetailsTable.getCriteria()).replace("&", "?"));
                } else if (this.method == 'trend') {
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
