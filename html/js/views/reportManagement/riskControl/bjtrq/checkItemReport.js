define(function (require) {
    var LIB = require('lib');
    var template = require("text!./checkItemReport.html");
    var dateUtils = require("../../tools/dateUtils");
    var dataUtils = require("../../tools/dataUtils");
    var echartTools = require("../../tools/echartTools");
    var api = require("./vuex/checkItemReport-api");
    var components = {
        'obj-select': require("../../reportDynamic/dialog/objSelect")
    };
    var dataModel = function () {
        return {
            qryInfoModel: {
                title: LIB.lang('em.ms.cidnm'),
                qryDateType: '1',
                year: null,
                typeOfRanges: [
                    { value: "frw", label: LIB.lang('gb.common.company') },
                    { value: "dep", label: LIB.lang('gb.common.dept') }
                ],
                types: [{ value: "2", label: LIB.lang('gb.common.whole') }, { value: "1", label: LIB.lang('em.ms.regulari') }, { value: "0", label: LIB.lang('em.ms.randomi') }],
                vo: {
                    dateRange: [],
                    objRange: [],
                    typeOfRange: 'frw',
                    recordType: "2"
                }
            },
            barChartOpt1: {
                series: []
            },
            //弹窗-撰取
            drillDataModel: {
                show: false,
                title: LIB.lang('gb.common.detailed'),
                groups: null,
                placeholderOfGroups: LIB.lang('em.ms.psai'),
                table: {
                    //数据请求地址
                    url: null,
                    //请求参数
                    qryParam: null,
                    //对应表格字段
                    columns: null,
                    //筛选过滤字段
                    filterColumns: null
                }
            }
        }
    };
    var opt = {
        template: template,
        components: components,
        data: function () {
            return new dataModel();
        },
        props: {
            qryInfoDetail: Object
        },
        methods: {
            changeTypeOfRange: function () {
                this.qryInfoModel.vo.objRange = [];
            },
            changeQryYear: function (year) {
                this.qryInfoModel.vo.dateRange = [year + '-01-01 00:00:00', year + '-12-31 23:59:59'];
            },
            changeQryMonth: function (month) {
                var monthDate = dateUtils.getMonthLastDay(new Date(month + '-20 23:59:59'));
                this.qryInfoModel.vo.dateRange = [month + '-01 00:00:00', monthDate.Format("yyyy-MM-dd 23:59:59")];
            },
            buildDrillParam: function (params) {
                var qryParam = this.getQryParam();
                var dataOpt = _.propertyOf(params.data);
                var objId = dataOpt("xId");
                var param = _.deepExtend({}, qryParam);
                param['criteria.strValue.checkItemId'] = objId;
                param['rptType'] = 1;
                return param;
            },
            doClickCell: function (data) {
                if (!data.cell.fieldName === "code") {
                    return;
                }
                var vo = data.entry.data;
                var router = LIB.ctxPath("/html/main.html#!");
                var routerPart;
                if (vo.type == 1) {//定期排查
                    routerPart = "/hiddenDanger/businessCenter/checkRecord?method=detail&code=" + vo.code + "&id=" + vo.id;
                } else if (vo.type == 0) {//随机排查
                    routerPart = "/randomInspection/businessCenter/notPlanCheckRecord?method=detail&code=" + vo.code + "&id=" + vo.id;
                }
                window.open(router + routerPart);
            },
            chartClick: function (params) {
                var tableOpt = {
                    url: "/rpt/stats/details/checkItem/list/{curPage}/{pageSize}",
                    qryParam: this.buildDrillParam(params),
                    columns: [
                        {
                            title: "  ",
                            width: '80px',
                            fieldType: "custom",
                            fieldName: 'code',
                            fixed: true,
                            render: function () {
                                return '<div style="color: #33a6ff;cursor: pointer;">查 看</div>'
                            }
                        },
                        { title: LIB.lang('gb.common.ir'), width: 100, fieldName: "checkResult" },
                        { title: LIB.lang('gb.common.checkUser'), width: 80, fieldName: "checkPersonName" },
                        { title: LIB.lang('gb.common.ist'), width: 150, fieldName: "checkBeginDate" },
                        { title: LIB.lang('gb.common.iet'), width: 150, fieldName: "checkEndDate" },
                        { title: LIB.lang('ri.bc.io'), width: 120, fieldName: "checkObjectName" },
                        { title: LIB.lang('gb.common.check'), width: 150, fieldName: "checkTableName" },
                        { title: LIB.lang('hag.hazv.qualify'), width: 75, fieldName: "total" },
                        { title: LIB.lang('hag.hazv.qualified'), width: 75, fieldName: "qualified" },
                        { title: LIB.lang('hag.hazv.unqualified'), width: 75, fieldName: "unqualified" },
                        { title: LIB.lang('ri.bc.nin'), width: 75, fieldName: "uninvolved" }

                    ],
                    filterColumns: ["criteria.strValue.checkPersonName", "criteria.strValue.checkTableName", "criteria.strValue.checkObjectName", "criteria.strValue.checkResult"]
                };
                this.drillDataModel.table = tableOpt;
                this.drillDataModel.show = true;
            },
            buildBarChart: function (type, data) {
                var opt = {
                    tooltip: {
                        trigger: 'axis', formatter: function (params) {
                            var label = "";
                            _.each(params, function (param, i) {
                                if (i == 0) label += param.name + echartTools.getCsn("ici", param.data.compId);
                                label += '<br/>' + echartTools.buildColorPie(param.color) + param.seriesName + ' : ' + param.value;
                                if (i == 2) label += '%';
                            });
                            return label;
                        }
                    },
                    yAxis: [{ name: LIB.lang('gb.common.number'), type: 'value' }, { name: LIB.lang('gb.common.percentage') + '(%)', type: 'value', min: 0, axisLabel: { formatter: "{value}%" } }],
                    grid: {
                        left: '0',
                        right: '4%',
                        bottom: 10,
                        top: 20,
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
                        name: LIB.lang('gb.common.iNumber'),
                        type: 'bar',
                        barGap: '-100%',
                        z: 10,
                        barMaxWidth: 40,
                        label: { normal: { show: true, position: 'top' } },
                        itemStyle: { normal: { barBorderRadius: [5, 5, 0, 0] } },
                        data: []
                    },
                    {
                        name: LIB.lang('gb.common.tnoi'),
                        type: 'bar',
                        barGap: '-100%',
                        barMaxWidth: 40,
                        label: { normal: { show: true, position: 'top' } },
                        itemStyle: { normal: { color: '#ddd', barBorderRadius: [5, 5, 0, 0] } },
                        data: []
                    },
                    {
                        name: LIB.lang('gb.common.ncr'),
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
                if (20 < xAxis1.data.length) {//如果分组数量大等于限制数量,添加缩放滚动条
                    opt.grid.bottom = '15%';
                    opt.dataZoom = [
                        {
                            type: 'slider',
                            show: true,
                            xAxisIndex: 0,
                            start: 0,
                            end: parseInt((20 / xAxis1.data.length) * 100),
                            zoomLock: true,
                            showDetail: false
                        }
                    ]
                }

                var maxLengthOfName = _.max(xAxis1.data, function (d) { return d.length }).length;
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
            showChartLoading: function () {
                this.$refs.barChart1.showLoading();
            },
            getQryParam: function () {
                var vo = this.qryInfoModel.vo;
                var qryParam;

                var dateRange = vo.dateRange;
                if (dateRange.length == 2) {
                    var beginDate = vo.dateRange[0];
                    var endDate = vo.dateRange[1];
                    qryParam = {
                        startDateRange: beginDate,
                        endDateRange: endDate
                    };
                } else {
                    qryParam = {};
                }
                var orgType = { "frw": 1, "dep": 2 };
                qryParam.orgType = orgType[vo.typeOfRange];
                qryParam.idsRange = _.map(vo.objRange, function (r) { return r.key; }).join(",");
                qryParam.bizType = this.$route.query.bizType ? this.$route.query.bizType : 'default';
                qryParam.recordType = vo.recordType;
                return _.extend(qryParam, _.pick(vo, "timeType"));
            },
            doQuery: function () {
                var _this = this;
                var qryParam = this.getQryParam();
                this.showChartLoading();
                api.recordCountByCheckItem(_.extend({ type: 0 }, qryParam)).then(function (res) {
                    _this.barChartOpt1 = _this.buildBarChart(0, res.data);
                    _this.$refs.barChart1.hideLoading();
                });
            },
            _queryDataNumLimit: function () {
                var _this = this;
                api.queryDataNumLimit().then(function (res) {
                    _this.dataNumLimit = Number(res.data.result) || 20;
                    _this.doQuery();
                })
            }
        },
        ready: function () {
            var currentYear = new Date().Format("yyyy");
            this.qryInfoModel.year = currentYear;
            this.changeQryYear(currentYear);
            this._queryDataNumLimit();
        }
    };
    return LIB.Vue.extend(opt);
});