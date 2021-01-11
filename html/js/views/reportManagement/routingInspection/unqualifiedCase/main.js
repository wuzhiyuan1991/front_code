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
    ];

    var typeOfGroups = [
        {
            value: '1',
            label: '巡检表'
        },
        {
            value: '2',
            label: '巡检区域'
        },
        {
            value: '3',
            label: '巡检点'
        },
        {
            value: '4',
            label: '巡检项'
        }
    ];

    var typeOfPlans = [
        {value: "0", label: '全部'},
        {value: "2", label: '计划巡检'},
        {value: "1", label: '临时巡检'},

    ];

    var typeOfSorts = [
        'yValue1 desc',
        'yValue1 asc',
        'yValue3 desc',
        'yValue3 asc'
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
            typeOfGroup: '2',
            typeOfRange: 'frw',
            dateRange: [dateUtils.getMonthFirstDay(current), dateUtils.getMonthLastDay(current)],
            objRange: [],
            typeOfSort: 0,
            typeOfPlan: '0',
            checkTables: [],
            checkTypes: [],
        };
        return {
            typeOfRanges: typeOfRanges,
            typeOfGroups: typeOfGroups,
            typeOfPlans: typeOfPlans,
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
                exportDataUrl: '/rpt/iri/checkdetail/unqualified/details/exportexcel',
                table: {
                    url: 'rpt/iri/checkdetail/unqualified/details{/curPage}{/pageSize}',
                    qryParam: null,
                    columns: [
                        {
                            title: "统计对象",
                            fieldName: "xName"
                        },
                        {
                            title: "公司",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.compId) {
                                    return LIB.getDataDic("org", data.compId)["compName"];
                                }
                            }
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
                            title: "检查总数",
                            fieldName: "yValues.yValue2"
                        },
                        {
                            title: "不符合数",
                            fieldName: "yValues.yValue1"
                        },
                        {
                            title: "不符合率",
                            fieldName: "yValues.yValue3",
                            render: function (data) {
                                if (data.yValues) {
                                    return data.yValues.yValue3 + '%';
                                }
                            }
                        }
                    ]
                }
            },
            selectModel: {
                tableSelectModel: {
                    title: "选择巡检表",
                    visible: false,
                    filterData: {type: null}
                }
            },
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
            objSelect: objSelect,
            tableSelectModal: tableSelectModal
        },
        data: function () {
            return buildDataModel();
        },
        computed: {},
        watch: {
            'qryParam.objRange': function () {
                this.changeObjOfRange();
            }
        },
        methods: {
            changeGroupOfRange: function () {
                this.doQuery();
            },
            changeTypeOfRange: function () {
                this.qryParam.objRange = [];
                this.qryParam.checkTables = [];
                this.doQueryCheckTypes();
            },
            changeObjOfRange: function () {
                this.qryParam.checkTables = [];
                this.doQueryCheckTypes();
            },
            buildChartOpt: function (data) {
                var _this = this;
                var opt = {
                    tooltip: {
                        trigger: 'axis', formatter: function (params) {
                            var label = "";
                            _.each(params, function (param, i) {
                                if (i == 0) label += param.name + ((_this.qryParam.typeOfRange == 'frw' || !param.data) ? "" : echartTools.getCsn("ici", param.data.compId));
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
                    data: []
                };
                var series = [
                    {
                        name: "不符合数",
                        type: 'bar',
                        barGap: '-100%',
                        z: 10,
                        barMaxWidth: 40,
                        label: {normal: {show: true, position: 'top'}},
                        itemStyle: {normal: {barBorderRadius: [5, 5, 0, 0]}},
                        data: []
                    },
                    {
                        name: "检查总数",
                        type: 'bar',
                        // barGap: '-100%',
                        barMaxWidth: 40,
                        label: {normal: {show: true, position: 'top'}},
                        itemStyle: {normal: {color: '#ddd', barBorderRadius: [5, 5, 0, 0]}},
                        data: []
                    },
                    {
                        name: "不符合率",
                        type: 'line',
                        yAxisIndex: 1,
                        z: 20,
                        data: []
                    }
                ];
                _.forEach(_.take(data, this.dataNumLimit), function (d) {
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
                return opt;
            },
            doQuery: function () {
                var _this = this;
                var params = this._getParams();
                api.queryUnqualifiedCases(params).then(function (res) {
                    if (!res.data || res.data.length == 0) {
                        LIB.Msg.info("暂无巡检数据");
                    }
                    _this.charts.opt = _this.buildChartOpt(res.data);
                })
            },
            doQueryCheckTypes: function () {
                var _this = this;

                var checkTableIds = _.map(this.qryParam.checkTables, function (table) {
                    return table.id;
                });
                var idsRange = this._getIdsRange(this.qryParam.objRange);

                var strsValue = {};

                if (checkTableIds.length > 0) {
                    strsValue.checkTableId = checkTableIds.join(",");
                }
                if (idsRange.length > 0) {
                    if (this.qryParam.typeOfRange == "frw") {
                        strsValue.compId = idsRange;
                    } else if (this.qryParam.typeOfRange == "dep") {
                        strsValue.orgId = idsRange;
                    }
                }
                api.queryRiCheckTypesByTable({"criteria.strsValue": strsValue}).then(function (res) {
                    _this.checkTypes = res.data;
                });
            },
            doRemoveTable: function (index) {
                this.qryParam.checkTables.splice(index, 1);
                this.doQueryCheckTypes();

            },
            doShowTableModal: function () {
                var objRange = _.get(this.qryParam, "objRange");
                var idsRange = _.map(objRange, function (obj) {
                    return obj.key
                });
                var params = {
                    type: this.qryParam.typeOfRange,
                    orgIds: idsRange,
                    excludeIds: _.map(this.qryParam.checkTables, function (checkTable) {
                        return checkTable.id;
                    })
                };

                this.selectModel.tableSelectModel.visible = true;
                this.$broadcast('ev_selectTableReload', params);
            },
            changeSort: function (index) {
                this.qryParam.typeOfSort = index;
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
                };
                var params = {
                    checkTypeIds: paramOpt("checkTypes").join(","),
                    planType: this.qryParam.typeOfPlan,
                    objType: this.qryParam.typeOfGroup,
                    type: types[this.qryParam.typeOfRange],
                    startDateRange: this.qryParam.dateRange[0].Format("yyyy-MM-dd hh:mm:ss"),
                    endDateRange: this.qryParam.dateRange[1].Format("yyyy-MM-dd 23:59:59"),
                    idsRange: this._getIdsRange(this.qryParam.objRange),
                    "criteria.strValue": {orderBy: typeOfSorts[this.qryParam.typeOfSort]},
                    "tableIds": _.map(paramOpt("checkTables"), function (table) {
                        return table.id;
                    }).join(",")
                };

                return params;
            },
            showMore: function () {
                var _this = this;
                this.detailModel.table.qryParam = _.deepExtend({}, this._getParams());
                var toolCol = this.detailModel.table.columns[0];
                var typeOfGroup = _.find(typeOfGroups, function (item) {
                    return item.value == _this.qryParam.typeOfGroup;
                }).label;
                if (toolCol.title !== typeOfGroup) {
                    toolCol.title = typeOfGroup;
                }
                this.detailModel.show = true;
            },
            doExport: function () {
                var _this = this;
                window.open(_this.detailModel.exportDataUrl + LIB.urlEncode(_this.$refs.rptDetailsTable.getCriteria()).replace("&", "?"));
            },
            _queryDataNumLimit: function () {
                var _this = this;
                api.queryDataNumLimit().then(function (res) {
                    _this.dataNumLimit = Number(res.data.result) || 20;
                    _this.doQuery();
                })
            }
        },
        events: {
            "ev_selectTableFinshed": function (data) {
                var _this = this;
                this.selectModel.tableSelectModel.visible = false;
                this.qryParam.checkTables = _.map(data, function (table) {
                    return {id: table.id, name: table.name};
                });
                this.doQueryCheckTypes();
            },
            "ev_selectTableCanceled": function () {
                this.selectModel.tableSelectModel.visible = false;
            }
        },
        ready: function () {
            this._queryDataNumLimit();
            this.doQueryCheckTypes();
        },
        route: {}
    };
    return LIB.Vue.extend(opt);
});
