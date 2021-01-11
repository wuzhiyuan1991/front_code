/**
 * 设备设施Echarts报表生成器
 */
define(function (require) {
    var LIB = require("lib");
    var api = require("./vuex/userParticipationReport-api");
    var template = require("text!./keyPost.html");

    // var echartTools = require("../../../echartTools");
    var issueColumns = [
        {title: "编码", width: 180, fieldName: "title"},
        {
            title: "类型",
            width: 80,
            fieldName: "type",
            render: function (data) {
                return LIB.getDataDic("pool_type", data.type);
            }
        },

        {title: "检查人", width: 200, fieldName: "checkerName"},
        {title: "问题描述", width: 320, fieldName: "problem"},
        {title: "登记日期", width: 180, fieldName: "registerDate"},
        {
            title: "风险等级",
            width: 120,
            fieldName: "riskLevel",
            showTip: false,
            render: function (data) {
                if (data.riskLevel) {
                    var riskLevel = JSON.parse(data.riskLevel);
                    var resultColor = _.propertyOf(JSON.parse(data.riskLevel))("resultColor");
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
            },
        },
        {
            title: "状态",
            width: 120,
            fieldName: "title",
            render: function (data) {
                return LIB.getDataDic("pool_status", data.status);
            }
        }
    ];
    var timesColumns = [
        {title: "检查表", width: 200, fieldName: "checkTableName"},
        {title: "检查人", width: 120, fieldName: "checkPersonName"},
        {title: "检查时间", width: 180, fieldName: "checkDate"},
        {title: "来源", width: 120, fieldName: "checkSource"},
        {title: "总数/不合格", width: 100, fieldName: "checkResultDetail"},
        {title: "状态", width: 100, fieldName: "checkResult"}
    ];

    var dataModel = function () {
        return {
            apiMap: {
                'times-abs': api.checkTimeAbs, //检查次数-绝对值
                'times-avg': api.checkTimeAvg, //检查次数-平均值
                'times-trend': api.checkTimeTrend, //检查次数-趋势
                'issue-abs': api.issueAbs, //发现问题-绝对值
                'issue-avg': api.issueAvg, //发现问题-平均值
                'issue-trend': api.issueTrend //发现问题-趋势
            },
            moreModel: {
                show: false,
                scroll: false,
                columns: [],
                data: []
            },
            //撰取Model属性
            drillModel: {
                show: false,
                title: "明细",
                groups: null,
                //导出excel服务地址
                exportDataUrl: null,
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
            },
            method: 'abs'
        }
    };

    var opts = {
        mixins: [require("../../tools/chartUtils/charts/normal/normalMixin")],
        template: template,
        props: {
            qryParam: {
                type: Object,
                required: true
            },
            dataLimit: {
                type: Number
            }
        },
        data: dataModel,
        computed: {
            apiKey: function () {
                var paramOpt = _.propertyOf(this.qryParam);
                var item = paramOpt("item");
                var key = item[0] + '-' + this.method;
                return key;
            },
            detailUrl: function () {
                var urls = {
                    times: 'rpt/stats/details/keyPost/list/{curPage}/{pageSize}',
                    issue: 'rpt/stats/details/keyPostHiddenDanger/list/{curPage}/{pageSize}'
                };
                var t = this.qryParam.item[0];
                return urls[t];
            },
            exportUrl: function () {
                var urls = {
                    times: '/rpt/stats/details/keyPost/exportExcel',
                    issue: '/rpt/stats/details/keyPostHiddenDanger/exportExcel'
                };
                var t = this.qryParam.item[0];
                return urls[t];
            },
            columns: function () {
                var t = this.qryParam.item[0];
                var _columns = {
                    times: timesColumns,
                    issue: issueColumns
                };
                return _columns[t];
            }
        },
        methods: {
            /**
             * 转换id数组参数为使用","拼接的字符串
             * @param ranges
             * @returns {string}
             */
            getIdsRange: function (ranges) {
                var array = _.map(ranges, function (r) {
                    return r.key;
                });
                return array.join(",");
            },
            changeMethod: function (val) {
                this.method = val;
                this.$emit("change-method", val);
                this.doQry();
            },
            getData: function () {
                var _this = this;
                var param = this.buildParam();
                return {
                    then: function (callback) {
                        var api = _this.apiMap[_this.apiKey];
                        if (!api) {
                            LIB.Msg.error("未定义此类纬度统计接口");
                            return;
                        }
                        _this.$nextTick(function () {
                            var echarts = _this.$refs.echarts;
                            if (echarts) {
                                echarts.showLoading();
                                echarts.clear();
                            }
                        });
                        api(param).then(function (res) {
                            _this.rptData = res.data;
                            if (typeof callback === "function") {
                                callback.call(_this, _this.rptData);
                            }
                            var echarts = _this.$refs.echarts;
                            if (echarts) {
                                echarts.hideLoading();
                            }
                        });
                    }
                }
            },
            showChart: function () {
                this.doQry();
            },
            doQry: function () {
                this.method = this.method || "abs";
                this.getData().then(function (data) {
                    this.buildChart(data);
                });
            },
            buildChart: function (data) {
                var opt;
                if (_.contains(["abs", "avg"], this.method)) {
                    opt = this.buildBarChars(data, this.dataLimit);
                    this.buildToolBox(opt);
                } else {
                    opt = this.buildLineChars(data, this.dataLimit);
                }
                this.$emit("build-chart-opt", opt);
                this.charts.opt = opt;
            },
            chartClick: function (params) {
                if ("avg" === this.method) return;//平均值不进行撰取
                var objId = '';
                if ("trend" === this.method) {//趋势折线图
                    objId = params.data.yId;
                } else {//绝对值/平均值柱状图
                    objId = params.data.xId;
                }
                var tableOpt=null
                if (this.qryParam.orgType=='1') {
                    tableOpt = {
                        url: this.detailUrl,
                        qryParam: _.extend({compId: objId}, this.buildDrillParam(this.method, this.qryParam, params)),
                        columns: this.columns,
                        filterColumns: ["criteria.strValue.keyWordValue"]
                    };
                }
                else if(this.qryParam.orgType=='2'){
                    tableOpt = {
                        url: this.detailUrl,
                        qryParam: _.extend({depId: objId}, this.buildDrillParam(this.method, this.qryParam, params)),
                        columns: this.columns,
                        filterColumns: ["criteria.strValue.keyWordValue"]
                    };
                }else{
                    tableOpt = {
                        url: this.detailUrl,
                        qryParam: _.extend({positionId: objId}, this.buildDrillParam(this.method, this.qryParam, params)),
                        columns: this.columns,
                        filterColumns: ["criteria.strValue.keyWordValue"]
                    };
                }
               
                this.drillModel.exportDataUrl = this.exportUrl;
                this.drillModel.table = tableOpt;
                this.drillModel.show = true;
            },
            doExportData: function () {
                window.open(this.drillModel.exportDataUrl + LIB.urlEncode(this.$refs.rptDetailsTable.getCriteria()).replace("&", "?"));
            },
            getRptDataExportUrl: function () {
                var paramOpt = _.propertyOf(this.qryParam);
                // var typeOfRange = paramOpt("typeOfRange");
                var item = paramOpt("item")[0];
                var type = item === 'times' ? 'checkNum' : 'hiddenDanger';

                return "/rpt/stats/keypost/" + type + "/" + this.method + "/exportExcel";
            },
            doExportRptData: function () {
                window.open(this.getRptDataExportUrl() + LIB.urlEncode(this.buildParam()).replace("&", "?"));
            },
            buildTableData: function () {
                var tableOpt = this.buildMoreDataTable(this.method, this.rptData);
                this.moreModel.columns = tableOpt.columns;
                this.moreModel.scroll = this.moreModel.columns.length >= 10;
                this.moreModel.data = tableOpt.data;
            },
            showMore: function () {
                this.buildTableData();
                this.moreModel.show = true;
            }
        }
    };
    var comp = LIB.Vue.extend(opts);
    return comp;
});