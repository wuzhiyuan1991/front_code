/**
 * 设备设施Echarts报表生成器
 */
define(function (require) {
    var LIB = require("lib");
    var api = require("../../../vuex/statsEquip-api");
    var api1 = require("../../../../../basicSetting/basicSetting/parameter/vuex/api");
    var template = require("text!./tpl/chartTpl.html");

    var dataModel = function () {
        return {
            apiMap: {
                'equip-frw-abs': api.compAbs,//区域设施-公司-绝对值
                'equip-frw-avg': api.compAvg,//区域设施-公司-平均值
                'equip-frw-trend': api.compTrend,//区域设施-公司-趋势
                'equip-dep-abs': api.depAbs,//区域设施-部门-绝对值
                'equip-dep-avg': api.depAvg,//区域设施-部门-平均值
                'equip-dep-trend': api.depTrend,//区域设施-部门-趋势
                'equip-equip-abs': api.equipAbs,//区域设施-设备设施-绝对值
                'equip-equip-avg': api.equipAbs,//区域设施-设备设施-平均值
                'equip-equip-trend': api.equipTrend,//区域设施-设备设施-趋势
            },
            disableAvg: true,
            detailType: 'checkItem'
        }
    };
    var defaultColumns = [
        {title: "检查表", width: 200, fieldName: "checkTableName"},
        {title: "检查人", width: 120, fieldName: "checkPersonName"},
        {title: "检查时间", width: 180, fieldName: "checkDate"},
        {title: "来源", width: 120, fieldName: "checkSource"},
        {title: "总数/不合格", width: 100, fieldName: "checkResultDetail"},
        {title: "状态", width: 100, fieldName: "checkResult"}
    ];
    var randomColumns = [
        {
            title: "编码",
            fieldName: "code",
            width: 220
        },
        {
            title: "检查人",
            fieldName: "publisherName",
            width: 120
        },
        _.pick(LIB.tableMgr.column.company, ["title", "render", "width"]),
        _.pick(LIB.tableMgr.column.dept, ["title", "render", "width"]),
        {
            title: "设备设施",
            fieldName: "equipmentName",
            width: 180
        },
        {
            title: "检查时间",
            fieldName: "checkDate",
            width: 180
        }, {
            title: "发现内容描述",
            fieldName: "content",
            width: 240
        }, {
            title: "应用端来源",
            fieldName: "checkSource",
            width: 100
        }, {
            title: "数据来源",
            fieldName: "type",
            fieldType: "custom",
            render: function (data) {
                return LIB.getDataDic("data_type", data.type);
            },
            width: 120
        }, {
            title: "创建时间",
            fieldName: "createDate",
            width: 180
        }, {
            title: "修改时间",
            fieldName: "modifyDate",
            width: 180
        }
    ];
    var opts = {
        mixins: [require("./../baseMixin"), require("./normalMixin")],
        template: template,
        props: {},
        computed: {
            apiKey: function () {
                var paramOpt = _.propertyOf(this.qryParam);
                var item = paramOpt("item")[0];
                var typeOfRange = paramOpt("typeOfRange");
                var key = item + '-' + typeOfRange + '-' + this.method;
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
            getRptDataExportUrl: function () {
                var paramOpt = _.propertyOf(this.qryParam);
                var typeOfRange = paramOpt("typeOfRange");
                return "/rpt/stats/equip/" + typeOfRange + "/" + this.method + "/exportExcel";
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
                this.$emit("build-chart-opt", opt);
                this.charts.opt = opt;
            },
            buildTableOpt: function (params) {
                var tableOpt = null;
                // 检查记录
                if(this.detailType === 'checkItem') {
                    tableOpt = {
                        url: "rpt/stats/details/equip/list/{curPage}/{pageSize}",
                        qryParam: this.buildDrillParam(this.method, this.qryParam, params),
                        columns: defaultColumns,
                        filterColumns: ["criteria.strValue.checkTableName", "criteria.strValue.checkPersonName"]
                    };
                } else {
                    tableOpt = {
                        url: "rpt/stats/details/radomObser/list/{curPage}/{pageSize}",
                        qryParam: this.buildDrillParam(this.method, this.qryParam, params),
                        columns: randomColumns,
                        filterColumns: ["criteria.strValue.publisherName", "criteria.strValue.equipmentName", "criteria.strValue.code", "criteria.strValue.content"]
                    };
                }
                return tableOpt;
            },
            chartClick: function (params) {
                this.detailType = "checkItem";
                this._chartParams = params;
                if ("avg" === this.method) return;//平均值不进行撰取

                this.drillModel.exportDataUrl = "/rpt/stats/details/equip/exportExcel";
                this.drillModel.table = this.buildTableOpt(params);
                this.drillModel.show = true;
            },
            buildTableData: function () {
                var tableOpt = this.buildMoreDataTable(this.method, this.rptData);
                this.moreModel.columns = tableOpt.columns;
                this.moreModel.scroll = this.moreModel.columns.length >= 10;
                this.moreModel.data = tableOpt.data;
            },
            changeDetailType: function (detailType) {
                this.$refs.rptDetailsTable.clearFilterColumns();
                this.detailType = detailType;
                this.drillModel.table = this.buildTableOpt(this._chartParams);
            }
        },  
      
     
    };
  
    var comp = LIB.Vue.extend(opts);
    return comp;
}
);