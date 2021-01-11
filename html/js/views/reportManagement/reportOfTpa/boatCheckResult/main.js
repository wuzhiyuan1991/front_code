define(function(require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var dateUtils = require("../../tools/dateUtils");
    var dataUtils = require("../../tools/dataUtils");
    var api = require("./vuex/api");
    var components = {
			'obj-select':require("../../reportDynamic/dialog/objSelect")
		};
    var dataModel = function(){
        var currentYear = Number(new Date().Format("yyyy"));
        return {
            qryInfoModel:{
                title:'船舶二级安全审查检查情况统计',
                qryYears:(function(lastYear){
                    var years = [];
                    for(var year = 2014; year <= lastYear; year++){
                        years.push(year);
                    }
                    return years;
                })(currentYear),
                vo:{
                    timeType:1,
                    dateRange:[],
                    objRange:[]
                }
            },
            pieChartOpt:{
                series :[]
            },
            barChartOpt:{
                series :[]
            },
            drillModel:{
                show : false,
                title :'详情',
                table:{
                    //数据请求地址
                    url:null,
                    //请求参数
                    qryParam:null,
                    //对应表格字段
                    columns:null,
                }
            }
        }
    };
    var opt = {
        template:template,
        components:components,
        data:function(){
            return new dataModel();
        },
        props:{
            qryInfoDetail:Object
        },
        methods:{
            changeQryYear:function(year){
                this.qryInfoModel.vo.dateRange = [year+'-01-01 00:00:00',year+'-12-31 23:59:59'];
            },
            buildPieChart:function(data){
                var opt = {
                    title:{x:'center',text:'船舶二级安全审查检查情况统计-饼状图',top:20},
                    tooltip : {trigger: 'item',formatter: "{a} <br/>{b} : {c} ({d}%)"}
                };
                var legend = {
                    orient: 'vertical',
                    left: '20px',
                    top:20,
                    data:[]
                };
                var sery = {
                    name: '数量',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                formatter: '{b} : {c} ({d}%)'
                            },
                            labelLine: {show: true}
                        }
                    },
                    data:[]
                };
                _.find(data,function(d,i){
                    legend.data.push(d.xName);
                    sery.data.push({
                        xId:d.xId,
                        name:d.xName,
                        value:d.yValue
                    });
                    return i+1 == 20;
                    //return false;
                });
                opt.legend = legend;
                opt.series = [sery];
                this.pieChartOpt = opt;
                this.$refs.pieChart.hideLoading();
            },
            buildBarChart:function(data){
                var opt = {
                    title:{x:'center',text:'船舶二级安全审查统计-柱状图',top:20},
                    tooltip : {trigger: 'axis'},
                    yAxis : [{type : 'value'}]
                };
                var xAxis1 =
                    {type : 'category',
                        axisLabel:{
                            interval:0
                        },data:[]};
                var sery = {
                    name: '数量',
                    type: 'bar',
                    barMaxWidth:40,
                    label:{normal:{show:true,position:'top'}},
                    itemStyle: {normal: {barBorderRadius :[5, 5, 0, 0]}},
                    data:[]
                };
                _.find(_.sortBy(data,"xValue"),function(d,i){
                    xAxis1.data.push(d.xValue);
                    sery.data.push({
                        xId:d.xId,
                        name:d.xValue,
                        value:d.yValue
                    });
                    return i+1 == 20;
                });
                var maxLengthOfName = _.max(xAxis1.data,function(d){return d.length}).length;
                if(8 <= maxLengthOfName){//如果名称最大值大于8个字符，横坐标标签倾斜30度,并截断
                    xAxis1.axisLabel = _.extend(xAxis1.axisLabel, {
                        rotate:30,
                        formatter:function(val){
                            return dataUtils.sliceStr(val,8);
                        }
                    });
                    //扩大横坐标底部边距
                    opt.grid = {
                        bottom:80
                    };
                }
                opt.xAxis = [xAxis1];
                opt.series = [sery];
                this.barChartOpt = opt;
                this.$refs.barChart.hideLoading();
            },
            chartClick:function(params) {
                var qryParam = this.getQryParam();
                var result = null;
                qryParam.tableType = 0;
                if (params.data.name == "合格") {
                    result = 1;
                } else if (params.data.name == "不合格"){
                    result = 0;
                }
                qryParam.checkResult = result;
                //获取年
                var year = params.data.xId.substring(0,4);
                if (qryParam.timeType == 1) {
                    qryParam.startDateRange = year+'-01-01 00:00:00';
                    qryParam.endDateRange = year+'-12-31 23:59:59';
                } else if (qryParam.timeType == 2) {
                    //获取选择的季度
                    var date =new Date(params.data.xId);
                    qryParam.startDateRange = dateUtils.getQuarterFirstDay(date).Format("yyyy-MM-dd 00:00:00");
                    qryParam.endDateRange = dateUtils.getQuarterLastDay(date).Format("yyyy-MM-dd 00:00:00");
                } else if (qryParam.timeType == 3) {
                    var date =new Date(params.data.xId);
                    qryParam.startDateRange = dateUtils.getMonthFirstDay(date).Format("yyyy-MM-dd 00:00:00");
                    qryParam.endDateRange = dateUtils.getMonthLastDay(date).Format("yyyy-MM-dd 00:00:00");
                }
                var tableOpt = {
                    url:"rpt/stats/tpa/checkrecord/checkresult/{curPage}/{pageSize}",
                    qryParam:qryParam,
                    filterColumns:["criteria.strValue.keyWordValue"],
                    columns:[
                        {title:"检查表名称",width:"220px",fieldName:"tpaCheckTable.name"},
                        {title:"船舶名称",width:"150px",fieldName:"attr1"},
                        {title:"检查时间",width:"50px",fieldName:"checkDate"}
                    ],
                };
                this.drillModel.table = tableOpt;
                this.drillModel.exportDataUrl = "/rpt/stats/tpa/checkrecord/checkresult/export";
                this.drillModel.show = true;
            },
            doExportData:function(){
                var _this = this;
                window.open(_this.drillModel.exportDataUrl+LIB.urlEncode(_this.$refs.rptDetailsTable.getCriteria()).replace("&", "?"));
            },
            showChartLoading:function(){
                this.$refs.pieChart.showLoading();
                this.$refs.barChart.showLoading();
            },
            getQryParam:function(){
                var vo = this.qryInfoModel.vo;
                var qryParam;
                var dateRange = vo.dateRange;
                if(dateRange.length == 2){
                    var beginDate = vo.dateRange[0];
                    var endDate = vo.dateRange[1];
                    qryParam = {
                        startDateRange:beginDate,
                        endDateRange:endDate
                    };
                }else{
                    qryParam = {};
                }
                qryParam.idsRange = _.map(vo.objRange,function(r){return r.key;}).join(",");
                return _.extend(qryParam, _.pick(vo,"timeType"));
            },
            doQry:function(){
                var _this = this;
                var qryParam = this.getQryParam();
                qryParam.tableType = 0;
                this.showChartLoading();
                api.checkRecordCount(qryParam).then(function(res){
                    _this.buildPieChart(res.data);
                });
                api.checkRecordCountByDate(qryParam).then(function(res){
                    _this.buildBarChart(res.data);
                });
            }
        },
        ready:function(){
            this.doQry();
        }
    };
    return LIB.Vue.extend(opt);
});