define(function (require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var api = require("./vuex/api");
    var dateUtils = require("../tools/dateUtils");
    var dataUtils = require("../tools/dataUtils");
    var chartTools = require("../tools/chartTools")
    var components = {
        'obj-select': require("../tools/dialog/objSelect")
    };
    var apiMap = {
        'frw-abs': api.reformRateCompAbs,//整改情况-机构-日期范围-整改率-绝对值
        'frw-trend': api.reformRateCompTrend,//整改情况-机构-日期范围-整改率-趋势
        'dep-abs': api.reformRateDepAbs,//整改情况-部门-日期范围-整改率-绝对值
        'dep-trend': api.reformRateDepTrend,//整改情况-部门-日期范围-整改率-趋势
        'equip-abs': api.reformRateEquipAbs,//整改情况-设备设施-日期范围-整改率-绝对值
        'equip-trend': api.reformRateEquipTrend,//整改情况-设备设施-日期范围-整改率-趋势
    };
    var dataModel = function () {
        var current = new Date();
        return {
            mainModel: {
                title: '问题和隐患整改率统计',
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
                            }
                        ]
                    }
                },
                typeOfRanges: [
                    {value: "frw", label: '机构'},
                    {value: "dep", label: '单位'},
                    {value: "equip", label: '设备设施'}
                ],
                //报表数据
                rptData: [],
                vo: {
                    method: 'abs',
                    typeOfRange: "dep",
                    objRange: [],
                    dateRange: [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)]
                },
                rules: {
                    typeOfRange: {required: true, message: '请选择对象范围'},
                    dateRange: [
                        {type: 'array', required: true, message: '请选择统计日期'},
                        {
                            validator: function (rule, value, callback) {
                                return value[1] < value[0] ? callback(new Error('结束时间须不小于开始时间')) : callback();
                            }
                        }
                    ]
                },
                chart: {
                    dataLimit: 10,
                    opts: {
                        series: []
                    }
                }
            },
            //弹窗-更多
            moreDataModel: {
                show: false,
                title: '更多',
                scroll: false,
                columns: [],
                data: []
            },
            //弹窗-撰取
            drillDataModel: {
                show: false,
                title: "明细",
                groups: null,
                placeholderOfGroups: '请选择对象个体',
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
        };
    };

    var opt = {
        template: template,
        components: components,
        data: function () {
            return new dataModel();
        },
        computed: {
            getApi: function () {
                var vo = this.mainModel.vo;
                return apiMap[vo.typeOfRange + '-' + vo.method];
            }
        },
        methods: {
            changeTypeOfRange: function () {
                this.mainModel.vo.objRange = [];
            },
            chartClick: function (params) {
                var vo = this.mainModel.vo;
                if ("avg" === vo.method) return;//平均值不进行撰取
                var tableOpt = {
                    url: "rpt/stats/details/rectification/list/{curPage}/{pageSize}",
                    qryParam: chartTools.buildDrillParam(vo.method, vo, params),
                    columns: [
                        {title: "编码", width: "150px", fieldName: "title"},
                        {
                            title: "类型", width: "70px", fieldType: "custom", render: function (data) {
                            return LIB.getDataDic("pool_type", data.type);
                        }
                        },
                        {title: "问题描述", width: "150px", fieldName: "problem"},
                        {title: "建议措施", width: "150px", fieldName: "danger"},
                        {title: "登记日期", width: "150px", fieldName: "registerDate"},
                        {
                            title: "风险等级", width: "85px", fieldType: "custom", render: function (data) {
                            if (data.riskLevel) {
                                var riskLevel = JSON.parse(data.riskLevel);
                                if (riskLevel && riskLevel.result) {
                                    return riskLevel.result;
                                } else {
                                    return "无";
                                }
                            } else {
                                return "无";
                            }
                        }
                        },
                        {
                            title: "状态", fieldType: "custom", render: function (data) {
                            return LIB.getDataDic("pool_status", data.status);
                        }
                        }
                    ],
                    filterColumns: ["criteria.strValue.problem", "criteria.strValue.danger", "criteria.strValue.riskLevel", "criteria.strValue.poolStatus"]
                };
                this.drillDataModel.table = tableOpt;
                this.drillDataModel.show = true;
            },
            getParam: function () {
                var vo = this.mainModel.vo;
                var beginDate = vo.dateRange[0].Format("yyyy-MM-dd hh:mm:ss");
                var endDate = vo.dateRange[1].Format("yyyy-MM-dd hh:mm:ss");
                return {
                    "idsRange": chartTools.getIdsRange(_.propertyOf(vo)("objRange")),
                    "startDateRange": beginDate,
                    "endDateRange": endDate
                };
            },
            buildBarChars: function (data, dataLimit) {
                var opt = {
                    tooltip: [{trigger: 'axis', formatter: '{b}:{c}'}],
                    yAxis: [{type: 'value'}]
                };
                var sery1 = {
                    name: "整改率",
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
                _.forEach(_.sortBy(data, function (d) {
                    return Number(d.yValue) * -1
                }), function (v, i) {
                    var value = {
                        xId: v.xId,
                        xName: v.xValue,
                        value: v.yValue
                    };
                    xAxis1.data.push(value.xName);
                    sery1.data.push(value);

                    // return i + 1 == dataLimit;
                });
                if (dataLimit <= xAxis1.data.length) {//如果分组数量大等于限制数量,调整x轴标签倾斜
                    opt.dataZoom = [
                        {show: true, xAxisIndex: 0, startValue: 0, endValue: dataLimit}, {type: 'inside'}
                    ];
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
                opt.series = [sery1];
                return opt;
            },
            buildChart: function () {
                var _this = this;
                var data = this.mainModel.rptData;
                var opt = _.contains(["abs", "avg"], this.mainModel.vo.method)
                    ? this.buildBarChars(data, this.mainModel.chart.dataLimit)
                    : chartTools.buildLineChars(data, this.mainModel.chart.dataLimit);
                opt.yAxis[0].axisLabel = {
                    formatter: '{value}%'
                };
                _.each(opt.series, function (sery) {
                    if(_this.mainModel.vo.method === 'trend') {
                        sery.label = null;
                    } else {
                        sery.label.normal.formatter = '{c}%';
                    }
                });
                this.mainModel.chart.opts = opt;
            },
            doQry: function (type) {
                this.mainModel.vo.method = type || 'abs';
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        _this.$refs.echarts.showLoading();
                        // _this.getApi(_this.getParam()).then(function (res) {

                        api.queryLookUpItem().then(function (res) {
                            var obj = JSON.parse(res.data.content);
                            _this.mainModel.rptData = obj.content;
                            _this.buildChart();
                            _this.$refs.echarts.hideLoading();
                        });
                    }
                });
            },
            showMore: function () {
                var vo = this.mainModel.vo;
                var tableOpt = chartTools.buildMoreDataTable(vo.method, this.mainModel.rptData);
                this.moreDataModel.columns = tableOpt.columns;
                this.moreDataModel.scroll = tableOpt.columns.length >= 10;
                this.moreDataModel.data = tableOpt.data;
                this.moreDataModel.show = true;
            }
        },
        ready: function () {
            this.doQry('abs');
        }
    };
    return LIB.Vue.extend(opt);
});