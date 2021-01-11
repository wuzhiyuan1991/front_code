/**
 * 检查人Echarts报表生成器
 */
define(function (require) {
    var LIB = require("lib");
    var api = require("../../../vuex/statsPerson-api");
    var api1 = require("../../../../../basicSetting/basicSetting/parameter/vuex/api");
    var template = require("text!./tpl/chartTpl.html");
    var mixins = [require("./../baseMixin"), require("./normalMixin")];

    var dataModel = function () {
        return {
            apiMap: {
                'person-frw-abs': api.compAbs,//检查人-公司-绝对值
                'person-frw-avg': api.compAvg,//检查人-公司-平均值
                'person-frw-trend': api.compTrend,//检查人-公司-趋势
                'person-dep-abs': api.depAbs,//检查人-部门-绝对值
                'person-dep-avg': api.depAvg,//检查人-部门-平均值
                'person-dep-trend': api.depTrend,//检查人-部门-趋势
                'person-per-abs': api.checkerAbs,//检查人-人员-绝对值
                'person-per-avg': api.checkerAbs,//检查人-人员-平均值
                'person-per-trend': api.checkerTrend//检查人-人员-趋势
            },
            limit:null,
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
        mixins: mixins,
        template: template,
        props: {},
        computed: {
            disableAvg:function(){
                var typeOfRange = _.propertyOf(this.qryParam)("typeOfRange");
                return "per" === typeOfRange;
            },
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
        created: function () {
            this.getLimit()
        },
        methods: {
            //TODO 由于人员查询存在请求参数过大,所有请求方式改为post,此处重写getIdsRange()方法,特殊处理POST请求参数
            getIdsRange: function(ranges){
                var paramOpt = _.propertyOf(this.qryParam);
                var typeOfRange = paramOpt("typeOfRange");
                var array = _.map(ranges,function(r){return r.key;});
                return "per" === typeOfRange ? array : array.join(",");
            },
            showChart: function () {
                this.doQry();
            },
            getRptDataExportUrl:function(){
                var paramOpt = _.propertyOf(this.qryParam);
                var typeOfRange = paramOpt("typeOfRange");
                return "/rpt/stats/checker/" + typeOfRange+ "/" + this.method+"/exportExcel";
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
            buildTableOpt: function (params) {
                var tableOpt = null;
                // 检查记录
                if(this.detailType === 'checkItem') {
                    tableOpt = {
                        url: "rpt/stats/details/checkerRecord/list/{curPage}/{pageSize}",
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
                // var tableOpt = null;
                if ("avg" === this.method) return;//平均值不进行撰取

                this.drillModel.exportDataUrl = "/rpt/stats/details/checkerRecord/exportExcel";
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
        }
    };
    var comp = LIB.Vue.extend(opts);
    return comp;
});