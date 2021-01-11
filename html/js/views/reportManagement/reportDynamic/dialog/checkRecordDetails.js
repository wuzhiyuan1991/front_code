define(function (require) {
    var LIB = require("lib");
    var template = require("text!./checkRecordDetails.html");
    var dataModel = {
        tableModel: {
            dataValues: []
        }
    };
    var opts = {
        template: template,
        props: {
            show: {
                type: Boolean,
                required: true
            },
            title: String,
            groups: Array,
            baseQryParam: {
                type: Object,
                required: true
            },
            customQryParam: Object
        },
        data: function () {
            return dataModel;
        },
        computed: {
            qryParam: function () {
                var chartQryParam = this.customQryParam.chartQryParam;
                var dateRange = this.customQryParam.dateRange;
                var qryParam = {
                    'criteria.strsValue.item': chartQryParam.item,
                    startDateRange: dateRange.startDateRange,
                    endDateRange: dateRange.endDateRange
                };
                if ("frw" === this.baseQryParam.typeOfRange) {//公司
                    qryParam.orgId = this.customQryParam.xId;
                } else if ("dep" === this.baseQryParam.typeOfRange) {//部门
                    qryParam.depId = this.customQryParam.xId;
                } else if ("per" === this.baseQryParam.typeOfRange) {//人员
                    qryParam.checkerId = this.customQryParam.xId;
                } else if ("equip" === this.baseQryParam.typeOfRange) {//设备设施
                    qryParam.equipId = this.customQryParam.xId;
                }
                return qryParam;
            },
            tableFilterColumn: function () {
                return "rectification" === this.baseQryParam.item ?
                    ["criteria.strValue.problem", "criteria.strValue.danger", "criteria.strValue.riskLevel", "criteria.strValue.poolStatus"]
                    : ["criteria.strValue.checkTableName", "criteria.strValue.checkPersonName", "criteria.strValue.checkObjectName"];
            },
            tableColumns: function () {
                if ("rectification" === this.baseQryParam.item) {
                    return [
                        {title: "编码", width: "170px", fieldName: "title"},
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
                    ];
                } else {
                    return [
                        {title: "检查表", width: "150px", fieldName: "checkTableName"},
                        {title: "检查人", width: "100px", fieldName: "checkPersonName"},
                        //{title:"被检对象",width:"120px",fieldName:"checkObjectName"},
                        {title: "检查时间", width: "170px", fieldName: "checkDate"},
                        {title: "来源", width: "80px", fieldName: "checkSource"},
                        {title: "合格/不合格", width: "100px", fieldName: "checkResultDetail"},
                        {title: "状态", fieldName: "checkResult"}
                    ];
                }
            },
            tableUrl: function () {
                if ("person" === this.baseQryParam.item) {//检查人
                    return "rpt/stats/details/checkerRecord/list/{curPage}/{pageSize}";
                } else if ("equip" === this.baseQryParam.item) {//检查对象
                    return "rpt/stats/details/equip/list/{curPage}/{pageSize}";
                } else if ("checkItem" === this.baseQryParam.item) {//检查项
                    return "rpt/stats/details/checkItem/list/{curPage}/{pageSize}";
                } else if ("rectification" === this.baseQryParam.item) {//整改情况
                    return "rpt/stats/details/rectification/list/{curPage}/{pageSize}";
                } else {
                    return "";
                }
            }
        },
        watch: {
            show: function (v) {
                if (v) {
                    var groups = this.groups;
                    if (groups) {
                        if (groups.length > 0) {
                            this.customQryParam.xId = groups[0].id;
                        }
                    }
                    //this.doQry();
                }
            }
        },
        methods: {
            onChangeGroup: function () {
                if (this.customQryParam.xId) {
                    var data = {};
                    if ("frw" === this.baseQryParam.typeOfRange) {
                        //条件 后台搜索的 属性
                        data.columnFilterName = "orgId";
                    } else if ("dep" === this.baseQryParam.typeOfRange) {
                        //条件 后台搜索的 属性
                        data.columnFilterName = "depId";
                    }
                    if ("per" === this.baseQryParam.typeOfRange) {
                        //条件 后台搜索的 属性
                        data.columnFilterName = "checkerId";
                    }
                    if ("obj" === this.baseQryParam.typeOfRange) {
                        //条件 后台搜索的 属性
                        data.columnFilterName = "checkObjectId";
                    }
                    //条件 后台搜索的 值
                    data.columnFilterValue = this.customQryParam.xId;

                    this.$refs.rptDetailsTable.$emit("do_query_by_filter", {type: "save", value: data});
                }
            }
        },
        ready: function () {
        }
    };
    var component = LIB.Vue.extend(opts);
    return component;
});