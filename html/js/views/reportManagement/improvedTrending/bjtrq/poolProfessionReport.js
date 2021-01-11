define(function(require) {
    var LIB = require('lib');
    var template = require("text!./poolProfessionReport.html");
    var dateUtils = require("../../tools/dateUtils");
    var dataUtils = require("../../tools/dataUtils");
    var api = require("./vuex/poolProfessionReport-api");
    var components = {
			'obj-select':require("../../reportDynamic/dialog/objSelect")
		};
    var current = new Date();
    var dataModel = function(){
        var currentYear = Number(new Date().Format("yyyy"));
        return {
            qryInfoModel:{
                title:'专业统计',
                qryDateType:'1',
                qryYears:(function(lastYear){
                    var years = [];
                    for(var year = 2014; year <= lastYear; year++){
                        years.push(year);
                    }
                    return years;
                })(currentYear),

                vo:{
                    //timeType:1,
                    dateRange:[dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)],
                    objRange:[]
                }
            },
            pieChartOpt:{
                series :[]
            },
            barChartOpt:{
                series :[]
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
            changeQryDate:function(type){
                if(1 == type){//本年
                    this.qryInfoModel.vo.dateRange = [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)];
                }else if(2 == type){//本季度
                    this.qryInfoModel.vo.dateRange = [dateUtils.getQuarterFirstDay(current), dateUtils.getQuarterLastDay(current)];
                }else if(3 == type){//本月
                    this.qryInfoModel.vo.dateRange = [dateUtils.getMonthFirstDay(current), dateUtils.getMonthLastDay(current)];
                }else{
                    this.qryInfoModel.vo.dateRange = [];
                }
            },
            //changeQryYear:function(year){
            //    this.qryInfoModel.vo.dateRange = [year+'-01-01 00:00:00',year+'-12-31 23:59:59'];
            //},
            buildPieChart:function(data){
                var opt = {
                    title:{x:'center',text:'专业隐患统计-饼状图'},
                    tooltip : {trigger: 'item',formatter: "{a} <br/>{b} : {c} ({d}%)"}
                };
                var legend = {
                    orient: 'vertical',
                    left: 'left',
                    data:[]
                };
                var sery = {
                    name: '隐患总数',
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
                    legend.data.push(d.xValue);
                    sery.data.push({
                        xId:d.xId,
                        name:d.xValue,
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
                    title:{x:'center',text:'专业隐患统计'},
                    tooltip : {trigger: 'axis'},
                    yAxis : [{type : 'value'}]
                };
                var xAxis1 =
                    {type : 'category',
                    axisLabel:{
                        interval:0
                    },data:[]}
                ;
                var sery = {
                    name: '隐患总数',
                    type: 'bar',
                    barMaxWidth:40,
                    label:{normal:{show:true,position:'top'}},
                    itemStyle: {normal: {barBorderRadius :[5, 5, 0, 0]}},
                    data:[]
                };
                _.find(data,function(d,i){
                    xAxis1.data.push(d.xValue)
                    sery.data.push({
                        xId:d.xId,
                        name:d.xValue,
                        value:d.yValue
                    });
                    return i+1 == 20;
                    //return false;
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
            showChartLoading:function(){
                this.$refs.pieChart.showLoading();
                this.$refs.barChart.showLoading();
            },
            getQryParam:function(){
                var vo = this.qryInfoModel.vo;
                var qryParam;
                var dateRange = vo.dateRange;
                if(dateRange.length == 2){
                    var beginDate = vo.dateRange[0].Format("yyyy-MM-dd hh:mm:ss");
                    var endDate = vo.dateRange[1].Format("yyyy-MM-dd hh:mm:ss");
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
                this.showChartLoading();
                api.poolCountByProfession(qryParam).then(function(res){
                    _this.buildPieChart(res.data);
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