define(function (require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var dateUtils = require("../../tools/dateUtils");
    var dataUtils = require("../../tools/dataUtils");
    var api = require("./vuex/api");
    var statisConst = require("../../tools/tpaStatisticalConst");
    var components = {
        'cascader': require('components/cascader/iviewCascader'),
        'obj-select': require("../../reportDynamic/dialog/objSelect")
    };
    var current = new Date();
    var currYear = current.getFullYear();
    var times = {
        prevWeek: new Date(currYear, current.getMonth(), current.getDate()-7),
        prevMonth: new Date(currYear, current.getMonth()-1),
        prevQuarter: new Date(currYear, current.getMonth()-3),
        prevYear: new Date(currYear-1, current.getMonth())
    };
    var dataModel = function () {
        return {
            items: statisConst.items,
            typeOfRanges: statisConst.typeOfRanges,
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
                        {text: '上周',value: function() {return [dateUtils.getWeekFirstDay(times.prevWeek), dateUtils.getWeekLastDay(times.prevWeek)];}},
                        {text: '上月',value: function() {return [dateUtils.getMonthFirstDay(times.prevMonth), dateUtils.getMonthLastDay(times.prevMonth)];}},
                        {text: '上季度',value: function() {return [dateUtils.getQuarterFirstDay(times.prevQuarter), dateUtils.getQuarterLastDay(times.prevQuarter)];}},
                        {text: '去年',value: function() {return [dateUtils.getYearFirstDay(times.prevYear), dateUtils.getYearLastDay(times.prevYear)];}}
                    ]
                }
            },
            qryInfoModel: {
                title: '安全隐患审查',
                vo: {
                    typeOfRange: null,
                    objRange: [],
                    dateRange: [],
                    type: null
                },
                rules: {
                    item: {type: 'array', required: true, message: '请选择统计项目'},
                    typeOfRange: {required: true, message: '请选择对象范围'},
                    dateRange: {type: 'array', required: true, message: '请选择统计日期'}
                }
            },
            barChartOpt: {
                series: []
            },
            drillModel: {
                show: false,
                title: '详情',
                table: {
                    //数据请求地址
                    url: null,
                    //请求参数
                    qryParam: null,
                    //对应表格字段
                    columns: null,
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
            initQryModel: function () {
                //默认本月
                this.qryInfoModel.vo.dateRange = [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)];
                //默认公司
                this.qryInfoModel.vo.typeOfRange = 'frw';
                //默认全部
                this.qryInfoModel.vo.type = '0';
            },
            chartClick: function (params) {
                var qryParam = this.getQryParam();
                if (qryParam.range == "equip") {
                    qryParam.equipId = params.data.xId;
                } else {
                    qryParam.orgId = params.data.xId;
                }
                var url = "/rpt/stats/tpa/pool/detail/{curPage}/{pageSize}";
                var tableOpt = {
                    url: url,
                    qryParam: qryParam,
                    filterColumns: ["criteria.strValue.keyWordValue"],
                    columns: [
                        {title: "编码", width: "170px", fieldName: "title"},
                        {
                            title: "船舶", width: "120px", fieldType: "custom", render: function (data) {
                            if (data.tpaCheckPlan) {
                                if (data.tpaCheckPlan.tpaBoatEquipment) {
                                    return data.tpaCheckPlan.tpaBoatEquipment.name;
                                } else {
                                    return null;
                                }
                            } else {
                                return null;
                            }
                        }
                        },
                        {
                            title: "类型", width: "88px", fieldType: "custom", render: function (data) {
                            return LIB.getDataDic("pool_type", data.type);
                        }
                        },
                        {title: "问题描述", width: "150px", fieldName: "problem"},
                        {title: "建议措施", width: "150px", fieldName: "danger"},
                        {title: "登记日期", width: "150px", fieldName: "registerDate"},
                        {
                            title: "风险等级",
                            width: 120,
                            fieldType: "custom",
                            render: function (data) {
                                if (data.riskLevel) {
                                    var riskLevel = JSON.parse(data.riskLevel);
                                    var resultColor = _.propertyOf(JSON.parse(data.riskModel))("resultColor");
                                    if (riskLevel && riskLevel.result) {
                                        //return riskLevel.result;
                                        if (resultColor) {
                                            return "<span style='background:\#" + resultColor + ";color:\#" + resultColor + ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + riskLevel.result;
                                        } else {
                                            return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + riskLevel.result;
                                        }
                                    } else {
                                        return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + "无";
                                        //return "无";
                                    }
                                } else {
                                    return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + "无";
                                    //return "无";
                                }
                            }
                        },
                        {
                            title: "状态", fieldType: "custom", render: function (data) {
                            return LIB.getDataDic("pool_status", data.status);
                        }
                        }
                    ]
                };
                this.drillModel.table = tableOpt;
                this.drillModel.exportDataUrl = "/rpt/stats/tpa/pool/detail/export";
                this.drillModel.show = true;
            },
            doExportData: function () {
                var _this = this;
                window.open(_this.drillModel.exportDataUrl + LIB.urlEncode(_this.$refs.rptDetailsTable.getCriteria()).replace("&", "?"));
            },
            //构造柱状图报表配置
            buildBarChartOpt: function (data) {
                var opt = {
                    tooltip: [{trigger: 'axis', formatter: '{b}:{c}%'}],
                    yAxis: [{name: '', type: 'value', min: 0, axisLabel: {formatter: "{value}%"}}]
                };
                var sery1 = {
                    name: '',
                    type: 'bar',
                    barMaxWidth: 40,
                    label: {normal: {show: true, position: 'top', formatter: '{c}%'}},
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

                _.find(_.sortBy(data, function (d) {
                    return Number(d.yValue) * -1;
                }), function (v, i) {
                    var value = {
                        xId: v.xId,
                        xName: v.xValue,
                        value: v.yValue
                    };
                    xAxis1.data.push(value.xName);
                    sery1.data.push(value);
                    return i == 19;
                });
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
                this.barChartOpt = opt;
                this.$refs.barChart.hideLoading();
            },

            buildBarChart: function (data) {
                var opt = {
                    title: {x: 'center', text: '安全隐患审查', top: 20},
                    tooltip: {trigger: 'axis'},
                    yAxis: [{type: 'value'}]
                };
                var xAxis1 =
                    {
                        type: 'category',
                        axisLabel: {
                            interval: 0
                        }, data: []
                    };
                var sery = {
                    name: '数量',
                    type: 'bar',
                    barMaxWidth: 40,
                    label: {normal: {show: true, position: 'top'}},
                    itemStyle: {normal: {barBorderRadius: [5, 5, 0, 0]}},
                    data: []
                };
                _.find(_.sortBy(data, "xValue"), function (d, i) {
                    xAxis1.data.push(d.xValue);
                    sery.data.push({
                        xId: d.xId,
                        name: d.xValue,
                        value: d.yValue
                    });
                    return i + 1 == 20;
                    //return false;
                });
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
                this.$refs.barChart.showLoading();
            },
            getQryParam: function () {
                var vo = this.qryInfoModel.vo;
                var paramOpt = _.propertyOf(this.qryInfoModel.vo);
                var dateRange = paramOpt("dateRange");
                var beginDate = dateRange[0].Format("yyyy-MM-dd hh:mm:ss");
                var endDate = dateRange[1].Format("yyyy-MM-dd hh:mm:ss");
                var type = paramOpt("type");
                var range = paramOpt("typeOfRange");
                var qryParam = {
                    "idsRange": dataUtils.getIdsRange(paramOpt("objRange")),
                    "startDateRange": beginDate,
                    "endDateRange": endDate,
                    "type": type,
                    "range": range
                };
                return qryParam;
            },
            doQry: function () {
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        var qryParam = _this.getQryParam();
                        api.reportPoolReform(qryParam).then(function (res) {
                            if (qryParam.type == 1) {
                                _this.buildBarChart(res.data);
                            } else {
                                _this.buildBarChartOpt(res.data);
                            }
                        });
                    }
                });
            }
        },
        ready: function () {
            this.initQryModel();
            this.doQry();
        }
    };
    return LIB.Vue.extend(opt);
});