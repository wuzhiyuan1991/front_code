/**
 * 设备设施Echarts报表生成器
 */
define(function (require) {
    var LIB = require("lib");
    var api = require("../../../vuex/statsCheckReform-api");
    var api1 = require("../../../../../basicSetting/basicSetting/parameter/vuex/api");
    var template = require("text!./tpl/chartTpl.html");

    var echartTools = require("../../../echartTools");

    var dataModel = function () {
        return {
            apiMap: {
                'rectification-frw-abs-1': api.reformrateCompAbs,//整改情况-公司-日期范围-整改率-绝对值
                'rectification-frw-avg-1': api.reformrateCompAbs,//整改情况-公司-日期范围-整改率-平均值
                'rectification-frw-trend-1': api.reformrateCompTrend,//整改情况-公司-日期范围-整改率-趋势
                'rectification-dep-abs-1': api.reformrateDepAbs,//整改情况-部门-日期范围-整改率-绝对值
                'rectification-dep-avg-1': api.reformrateDepAbs,//整改情况-部门-日期范围-整改率-平均值
                'rectification-dep-trend-1': api.reformrateDepTrend,//整改情况-部门-日期范围-整改率-趋势
                'rectification-equip-abs-1': api.reformrateEquipAbs,//整改情况-设备设施-日期范围-整改率-绝对值
                'rectification-equip-avg-1': api.reformrateEquipAbs,//整改情况-设备设施-日期范围-整改率-平均值
                'rectification-equip-trend-1': api.reformrateEquipTrend,//整改情况-设备设施-日期范围-整改率-趋势

                'rectification-frw-abs-2': api.overduerectCompAbs,//整改情况-公司-日期范围-超期未整改-绝对值
                'rectification-frw-avg-2': api.overduerectCompAbs,//整改情况-公司-日期范围-超期未整改-平均值
                'rectification-frw-trend-2': api.overduerectCompTrend,//整改情况-公司-日期范围-超期未整改-趋势
                'rectification-dep-abs-2': api.overduerectDepAbs,//整改情况-部门-日期范围-超期未整改-绝对值
                'rectification-dep-avg-2': api.overduerectDepAbs,//整改情况-部门-日期范围-超期未整改-平均值
                'rectification-dep-trend-2': api.overduerectDepTrend,//整改情况-部门-日期范围-超期未整改-趋势
                'rectification-equip-abs-2': api.overduerectEquipAbs,//整改情况-设备设施-日期范围-超期未整改-绝对值
                'rectification-equip-avg-2': api.overduerectEquipAbs,//整改情况-设备设施-日期范围-超期未整改-平均值
                'rectification-equip-trend-2': api.overduerectEquipTrend//整改情况-设备设施-日期范围-超期未整改-趋势
            },
            disableAvg: true
        }
    }
    var opts = {
        mixins: [require("./../baseMixin"), require("./normalMixin")],
        template: template,
        props: {},
        computed: {
            apiKey: function () {
                var paramOpt = _.propertyOf(this.qryParam);
                var item = paramOpt("item");
                var typeOfRange = paramOpt("typeOfRange");
                var key = item[0] + '-' + typeOfRange + '-' + this.method + '-' + item[1];
                return key;
            }
        },
        data: function () {
            return new dataModel();
        },
        created: function() {
            this.getLimit()
        },
        methods: {
            showChart: function () {
                this.doQry();
            },
            getRptDataExportUrl:function(){
                var paramOpt = _.propertyOf(this.qryParam);
                var item = "1" == paramOpt("item")[1] ? "reformrate" : "overduerect";
                var typeOfRange = paramOpt("typeOfRange");
                return "/rpt/stats/checkreform/" + item+ "/" + typeOfRange+ "/" + this.method+"/exportExcel";
            },
            doQry: function () {
                this.method = this.method || "abs";
                this.getData().then(function (data) {
                    this.buildChart(data);
                });
            },
            getLimit: function(){

            },
            buildChart: function (data) {
                var opt = _.contains(["abs", "avg"], this.method) ? this.buildBarChars(data, this.dataLimit) : this.buildLineChars(data, this.dataLimit);
                if ("1" === this.qryParam.item[1]) {
                    if ("trend" == this.method) {
                        var typeOfRange = this.qryParam.typeOfRange;
                        opt.tooltip = {trigger: 'axis', formatter:function(params){
                                var tip = "";
                                _.each(params, function(param, i){
                                    if(i == 0) tip = param.name;
                                    var data = param.data;
                                    tip += "<br/>"+ echartTools.buildColorPie(param.color)+data.yName +echartTools.getCsn(typeOfRange,data.compId)+":"+('-'==data.value ? '-':data.value+'%');
                                });
                                return tip;
                            }};
                    } else {
                        opt.tooltip = {trigger: 'axis', formatter:function(params){
                            var data = params[0].data;
                            var tip = data.xName +echartTools.getCsn(typeOfRange, data.compId)+":"+('-'==data.value ? '-':data.value+'%');
                            return tip;
                        }};
                    }
                    opt.yAxis[0].axisLabel = {
                        formatter: '{value}%'
                    };
                    _.each(opt.series, function (sery) {
                        sery.label.normal.formatter = '{c}%';
                    });
                }
                this.$emit("build-chart-opt", opt);
                this.charts.opt = opt;
            },
            chartClick: function (params) {
                
                if ("avg" === this.method) return;//平均值不进行撰取
                var tableOpt = {
                    url: "rpt/stats/details/rectification/list/{curPage}/{pageSize}",
                    qryParam: this.buildDrillParam(this.method, this.qryParam, params),
                    columns: [
                        {title: "编码", width: 200, fieldName: "title", fieldType: "link", pathCode: "BC_HG_T"},
                        {
                            title: "类型", width: 80, fieldType: "custom", render: function (data) {
                            return LIB.getDataDic("pool_type", data.type);
                        }
                        },
                        {title: "检查人", width: 200, fieldName: "checkerName"},
                        {title: "问题描述", width: 200, fieldName: "problem"},
                        {title: "建议措施", width: 200, fieldName: "danger"},
                        {title: "登记日期", width: 180, fieldName: "registerDate"},
                        {title: "整改期限", width: 180, fieldName: "reformMaxDate"},
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
                            title: "状态", width: 100, fieldType: "custom", render: function (data) {
                            return LIB.getDataDic("pool_status", data.status);
                        }
                        },
                        {title:"整改类型", fieldType: "custom", render: function (data) {
                            return data.reformType == '0' ? '立即整改' : '正常整改';
                        }
                        }
                    ],
                    filterColumns: ["criteria.strValue.keyWordValue"]
                }
                this.drillModel.exportDataUrl = "/rpt/stats/details/rectification/exportExcel";
                this.drillModel.table = tableOpt;
                this.drillModel.show = true;
            },
            buildTableData: function () {
                var tableOpt = this.buildMoreDataTable(this.method, this.rptData);
                this.moreModel.columns = tableOpt.columns;
                this.moreModel.scroll = this.moreModel.columns.length >= 10;
                this.moreModel.data = tableOpt.data;
            }
        }
    };
    var comp = LIB.Vue.extend(opts);
    return comp;
});