/**
 * 设备设施Echarts报表生成器
 */
define(function(require) {
    var LIB = require("lib");
    var api = require("../../../vuex/statsCheckItem-api");
    var api1 = require("../../../../../basicSetting/basicSetting/parameter/vuex/api");
    var template = require("text!./tpl/chartTpl.html");

    var echartTools = require("../../../echartTools");

    var dataModel = function(){
        return {
            apiMap:{
                        'checkItem-frw-abs-1':api.invalidCompAbs,//检查项-公司-不合格项-绝对值
                        'checkItem-frw-avg-1':api.invalidCompAvg,//检查项-公司-不合格项-平均值
                        'checkItem-frw-trend-1':api.invalidCompTrend,//检查项-公司-不合格项-趋势
                        'checkItem-dep-abs-1':api.invalidDepAbs,//检查项-部门-不合格项-绝对值
                        'checkItem-dep-avg-1':api.invalidDepAvg,//检查项-部门-不合格项-平均值
                        'checkItem-dep-trend-1':api.invalidDepTrend,//检查项-部门-不合格项-趋势
                        'checkItem-equip-abs-1':api.invalidEquipAbs,//检查项-设备设施-不合格项-绝对值
                        'checkItem-equip-avg-1':api.invalidEquipAvg,//检查项-设备设施-不合格项-平均值
                        'checkItem-equip-trend-1':api.invalidEquipTrend,//检查项-设备设施-不合格项-趋势

                        'checkItem-frw-abs-2':api.passrateCompAbs,//检查项-公司-合格率-绝对值
                        'checkItem-frw-trend-2':api.passrateCompTrend,//检查项-公司-合格率-趋势
                        'checkItem-dep-abs-2':api.passrateDepAbs,//检查项-部门-合格率-绝对值
                        'checkItem-dep-trend-2':api.passrateDepTrend,//检查项-部门-合格率-趋势
                        'checkItem-equip-abs-2':api.passrateEquipAbs,//检查项-设备设施-合格率-绝对值
                        'checkItem-equip-trend-2':api.passrateEquipTrend//检查项-设备设施-合格率-趋势
                    },
            disableAvg:true
        }
    }
    var opts = {
        mixins : [require("./../baseMixin"),require("./normalMixin")],
        template:template,
        props:{
        },
        computed:{
            apiKey:function(){
                var paramOpt = _.propertyOf(this.qryParam);
                var item = paramOpt("item");
                var typeOfRange = paramOpt("typeOfRange");
                var key = item[0]+'-'+typeOfRange+'-'+this.method + '-' + item[1];
                return key;
            }
        },
        data:function(){
            return new dataModel();
        },
        created:function() {
            this.getLimit()
        },
        methods : {
            showChart : function(){
                this.doQry();
            },
            getRptDataExportUrl:function(){
                var paramOpt = _.propertyOf(this.qryParam);
                var item = "1" == paramOpt("item")[1] ? "invalid" : "passrate";
                var typeOfRange = paramOpt("typeOfRange");
                return "/rpt/stats/checkitem/" + item+ "/" + typeOfRange+ "/" + this.method+"/exportExcel";
            },
            doQry : function(){
                this.method = this.method || "abs";
                this.getData().then(function(data){
                    this.buildChart(data);
                });
            },
            getLimit: function(){

            },
            buildChart : function(data){
                var opt = _.contains(["abs","avg"],this.method) ? this.buildBarChars(data, this.dataLimit) : this.buildLineChars(data,this.dataLimit);
                if("2" === this.qryParam.item[1]){
                    var typeOfRange = this.qryParam.typeOfRange;
                    if("trend" == this.method){
                        opt.tooltip={trigger:'axis',formatter:function(params){
                                var tip = "";
                                _.each(params, function(param, i){
                                    if(i == 0) tip = param.name;
                                    var data = param.data;
                                    tip += "<br/>"+ echartTools.buildColorPie(param.color)+data.yName +echartTools.getCsn(typeOfRange,data.compId)+":"+('-'==data.value ? '-':data.value+'%');
                                });
                                return tip;
                            }};
                    }else{
                        opt.tooltip={trigger:'axis',formatter:function(params){
                            var data = params[0].data;
                            var tip = data.xName +echartTools.getCsn(typeOfRange, data.compId)+":"+('-'==data.value ? '-':data.value+'%');
                            return tip;
                        }};
                    }
                    opt.yAxis[0].axisLabel ={
                         formatter:'{value}%'
                     } ;
                     _.each(opt.series,function(sery){
                         sery.label.normal.formatter = '{c}%';
                     });
                }
                this.$emit("build-chart-opt",opt);
                this.charts.opt = opt;
            },
            chartClick : function(params){
                if("avg" === this.method) return;//平均值不进行撰取
                var tableOpt = {
                    url:"rpt/stats/details/checkItem/list/{curPage}/{pageSize}",
                    qryParam:this.buildDrillParam(this.method, this.qryParam, params),
                    columns: [
                        {title: "检查表", width: 200, fieldName: "checkTableName"},
                        {title: "检查人", width: 120, fieldName: "checkPersonName"},
                        {title: "检查时间", width: 180, fieldName: "checkDate"},
                        {title: "来源", width: 120, fieldName: "checkSource"},
                        {title: "总数/不合格", width: 100, fieldName: "checkResultDetail"},
                        {title: "状态", width: 100, fieldName: "checkResult"}
                    ],
                    filterColumns:["criteria.strValue.checkTableName", "criteria.strValue.checkPersonName"]
                }
                this.drillModel.exportDataUrl="/rpt/stats/details/checkItem/exportExcel";
                this.drillModel.table = tableOpt;
                this.drillModel.show = true;
            },
            buildTableData:function(){
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