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

    var typeOfRanges = [
        {value: "frw", label: '公司'},
        {value: "dep", label: '部门'},
        {value: "per", label: '员工'},
    ];
    var riTypes = [
        {value: "3", label: '全部'},
        {value: "1", label: '巡检计划'},
        {value: "2", label: '临时工作计划'}
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
            dateRange: [dateUtils.getMonthFirstDay(current), current],
            objRange: [],
            typeOfSort: 0,
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
                exportAbsDataUrl: '/rpt/iri/checkdetail/task/execute/exportExcel',
                table: {
                    url: null,
                    absUrl: 'rpt/iri/checkdetail/task/execute/details{/curPage}{/pageSize}',
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
                            title: "检查记录数",
                            fieldName: "yValues.yValue4"
                        },
                        {
                            title: "已执行",
                            fieldName: "yValues.yValue1"
                        },
                        {
                            title: "未执行",
                            fieldName: "yValues.yValue2"
                        },
                        {
                            title: "完成率",
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
            maxDate: new Date().Format("yyyy-MM-dd HH:mm:ss")
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
            'qryParam.dateRange': function(val){
                if(val && val[1] && val[1] > new Date()) {
                    this.qryParam.dateRange[1] = new Date();
                    LIB.Msg.warning("最大查询时间为当前日期");
                }
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
                                if(param.seriesName != '检查记录数') {
                                    label += param.name + (_this.qryParam.typeOfRange == 'frw' ? "" : echartTools.getCsn("ici", param.data.compId));
                                    label += '<br/>' + echartTools.buildColorPie('#c23531') + "已执行" + ' : ' + param.data.values.yValue1;
                                    label += '<br/>' + echartTools.buildColorPie('#ddd') + "未执行" + ' : ' + param.data.values.yValue2;
                                    label += '<br/>' + echartTools.buildColorPie("#2f4554") + "完成率" + ' : ' + param.data.values.yValue3 + "%";
                                }else{
                                    label += param.name + (_this.qryParam.typeOfRange == 'frw' ? "" : echartTools.getCsn("ici", param.data.compId));
                                    label += '<br/>' + echartTools.buildColorPie('#c23531') + param.seriesName + ' : ' + param.data.values.yValue4;
                                }
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
                            name: "检查记录数",
                            type: 'bar',
                            stack: '检查记录数',
                            barMaxWidth: 40,
                            label: {normal: {show: true, position: 'inside'}},
                            itemStyle: {normal: {barBorderRadius: [5, 5, 0, 0], color: "#c23531"}},
                            data: []
                        },
                        {
                            name: "已执行",
                            type: 'bar',
                            barGap: '25%',
                            stack: '隐患数',
                            barMaxWidth: 40,
                            label: {normal: {show: true, position: 'inside'}},
                            itemStyle: {normal: {barBorderRadius: [5, 5, 0, 0], color: "#c23531"}},
                            data: []
                        },
                        {
                            name: "未执行",
                            type: 'bar',
                            stack: '隐患数',
                            barMaxWidth: 40,
                            label: {normal: {show: true, position: 'inside'}, color: 'black'},
                            itemStyle: {normal: {barBorderRadius: [5, 5, 0, 0], color: "#ddd"}},
                            data: []
                        },
                        {
                            name: "完成率",
                            type: 'line',
                            //xAxisIndex: 1,
                            yAxisIndex: 1,
                            itemStyle: {normal: {color: "#2f4554"}},
                            data: [],
                        },
                    ];
                    _.forEach(_.take(data, this.dataNumLimit), function (d, i) {
                        xAxis1.data.push(d.xName);
                        var yValues = d.yValues;
                        series[0].data.push({
                            xId: d.xId,
                            name: d.xName,
                            compId: d.compId,
                            value: yValues.yValue4,
                            values:yValues
                        });
                        series[1].data.push({
                            xId: d.xId,
                            name: d.xName,
                            compId: d.compId,
                            value: yValues.yValue1,
                            values:yValues
                        });
                        series[2].data.push({
                            xId: d.xId,
                            name: d.xName,
                            compId: d.compId,
                            value: yValues.yValue2,
                            values:yValues
                        });
                        series[3].data.push({
                            xId: d.xId,
                            name: d.xName,
                            compId: d.compId,
                            value: yValues.yValue3,
                            values:yValues
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

                    //var itemNum = opt.xAxis[0].data.length;//类目数量
                    //var width = 1305/itemNum;//x轴长度大概1350px,计算每个图例所占x轴长度;
                    ////增加一个隐藏的x轴，作为完成率折线的x轴，用来控制折线图的点的位置
                    //opt.xAxis[1] = {
                    //    type: 'value',
                    //    max: 1305,
                    //    show: false
                    //}
                    ////将完成率折线图偏移，与已执行/未执行柱状图中心线对齐
                    //var offset;
                    //if(itemNum > 12) {//类目数量大于12时，柱子宽度将会小于最大宽度40，但两侧空白宽度大致等于barGap, 又因为barGap为柱子宽度25%，由此计算出右侧柱子的中心线的位置
                    //    offset = width / 11 * 8;
                    //}else{//类目数量小于12时，柱子宽度恒等于40px,柱子和barGap的总宽度为90px，由此计算出两侧空白宽度，再计算右侧柱子的中心线的位置
                    //    offset = (width - 90)/2 + 40 + 10 + 20;
                    //}
                    //opt.series[3].data = _.map(opt.series[3].data, function(item, i){
                    //    item.value = [offset + i * width, item.value];
                    //    return item;
                    //})

                }
                return opt;
            },
            doQuery: function () {
                this._getAbs();
            },
            _getAbs: function () {
                var _this = this;
                var params = this._getParams();
                api.queryTaskExecuteAbs(params).then(function (res) {
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
                    'per': '3',
                };
                var params = {
                    riType: this.qryParam.riType,
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
