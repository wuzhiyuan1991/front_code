define(function(require) {
    var LIB = require('lib');
    var template = require("text!./percentOfPassReport.html");
    var dateUtils = require("../../tools/dateUtils");
    var dataUtils = require("../../tools/dataUtils");
    var echartTools = require("../../tools/echartTools");
    var api = require("./vuex/percentOfPassReport-api");
    var statisConst = require("../../tools/statisticalConst");
    var components = {
			'obj-select':require("../../reportDynamic/dialog/objSelect"),
//            'checktable-select-modal' : require("componentsEx/selectTableModal/checkTableSelectModal")
			'checktable-select-modal' : require("../dialog/selectCheckTable")
		};
    var current = new Date();
    var currYear = current.getFullYear();
    var times = {
        prevWeek: new Date(currYear, current.getMonth(), current.getDate()-7),
        prevMonth: new Date(currYear, current.getMonth()-1),
        prevQuarter: new Date(currYear, current.getMonth()-3),
        prevYear: new Date(currYear-1, current.getMonth())
    };
    var dataModel = function(){
        return {
            mainModel:{
                title:"风险点的符合率趋势",
                datePickOpts:{
                    shortcuts:[
                        {text: '本周',value: function() {return [dateUtils.getWeekFirstDay(current), dateUtils.getWeekLastDay(current)];}},
                        {text: '本月',value: function() {return [dateUtils.getMonthFirstDay(current), dateUtils.getMonthLastDay(current)];}},
                        {text: '本季度',value: function() {return [dateUtils.getQuarterFirstDay(current), dateUtils.getQuarterLastDay(current)];}},
                        {text: '本年',value: function() {return [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)];}},
                        {text: '上周',value: function() {return [dateUtils.getWeekFirstDay(times.prevWeek), dateUtils.getWeekLastDay(times.prevWeek)];}},
                        {text: '上月',value: function() {return [dateUtils.getMonthFirstDay(times.prevMonth), dateUtils.getMonthLastDay(times.prevMonth)];}},
                        {text: '上季度',value: function() {return [dateUtils.getQuarterFirstDay(times.prevQuarter), dateUtils.getQuarterLastDay(times.prevQuarter)];}},
                        {text: '去年',value: function() {return [dateUtils.getYearFirstDay(times.prevYear), dateUtils.getYearLastDay(times.prevYear)];}}
                    ]
                },
                typeOfRanges:statisConst.typeOfRanges[0],
                sourceInfos:statisConst.sourceInfos,
                qryRules:{
                    typeOfRange:{required: true, message: '请选择对象范围'},
                    dateRange:[
                        {type:'array',required: true, message: '请选择统计日期'},
                        {
                            validator: function(rule, value, callback) {
                                return value[1] < value[0] ? callback(new Error('结束时间须不小于开始时间')) : callback();
                            }
                        }
                    ]
                },
                chartOpt:{
                    series :[]
                }
            },
            qryModel:{
                dateRange:[],
                typeOfRange:null,
                objRange:[],
                checkTable:{
                    id:null,
                    name:null
                },
                checkTables:[]
            },
            checkTableSelectModel:{
                visible:false,
                title: "选择检查表",
            },
            magicType:'line',
        }
    };
    var opt = {
        template:template,
        components:components,
        data:function(){
            return new dataModel();
        },
        computed:{
            getApi:function(){
            	if(this.magicType == "line") {
                    return this.qryModel.typeOfRange == 'frw' ? api.percentOfPassByComp:api.percentOfPassByOrg;
            	}else if(this.magicType == "bar"){
            		return this.qryModel.typeOfRange == 'frw' ? api.percentOfPassGroupByComp:api.percentOfPassGroupByOrg;
            	}
            }
        },
        methods:{
        	//选择检查表
            doShowCheckTableSelectModal: function () {
            	
            	var paramOpt = _.propertyOf(this.qryModel);
            	
                var idsRange = dataUtils.getIdsRange(paramOpt("objRange"));
                
                var params = {
                	type : this.qryModel.typeOfRange,
                	orgIds : idsRange = dataUtils.getIdsRange(paramOpt("objRange")),
                	excludeIds : _.map(this.qryModel.checkTables, function(checkTable){
                    	return checkTable.id;
                    })
                };
                
                this.checkTableSelectModel.visible = true;
                this.$broadcast('ev_selectTableReload', params);
            },
            doRemoveCheckTable: function (index) {
                this.qryModel.checkTables.splice(index, 1);
            },
            changeTypeOfRange:function(data){
                this.qryModel.objRange = [];
            },
            changeMagicType:function(magicType) {
            	if(this.magicType === magicType) {
                    return;
                }
            	this.magicType = magicType;
            	this.doQry();
            },
            initQryModel:function(){
                //默认本月
                this.qryModel.dateRange = [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)];
                //默认公司
                this.qryModel.typeOfRange = 'frw';
                //默认全部
                this.qryModel.sourceInfo = '0';
            },
            //组装查询条件
            getQryParam:function(){
                var paramOpt = _.propertyOf(this.qryModel);
				var dateRange = paramOpt("dateRange");
				var beginDate = dateRange[0].Format("yyyy-MM-dd hh:mm:ss");
				var endDate = dateRange[1].Format("yyyy-MM-dd hh:mm:ss");
                var qryParam = {
						"idsRange":dataUtils.getIdsRange(paramOpt("objRange")),
						"startDateRange":beginDate,
						"endDateRange":endDate,
						"checkTableIds":_.map(paramOpt("checkTables"), function(table){
		                	return table.id;
		                }).join(",")
                };
                return qryParam;
            },
            //查询
            doQry:function(){
                var _this = this;
                this.$refs.ruleform.validate(function (valid){
                    if(valid){
                        _this.$refs.chart.showLoading();
                        var qryParam = _this.getQryParam();
                        _this.getApi(qryParam).then(function(res){
                        	if(_this.magicType == "line") {
                        		_this.buildLineChartOpt(res.data);
                        	}else if(_this.magicType == "bar") {
                        		_this.buildBarChartOpt(res.data);
                        	}
                            _this.$refs.chart.hideLoading();
                        });
                    }
                });
            },
            //构造折线图报表配置
            buildLineChartOpt:function(data){
                var currentData = new Date().Format("yyyy-MM");
                var opt = {
                    legend:{data:["总符合率","抽检符合率"]},
                    tooltip: {trigger: 'axis',formatter: echartTools.formatTooltip},
                    yAxis: [{name:'符合率(%)',min:0,axisLabel:{formatter:"{value}%"}}]
                };
                var xAxis1Data = [];
                var sery1Data = [];
                var sery2Data = [];
                _.each(data, function(d){
                    xAxis1Data.push(d.xName);
                    var yValues = d.xName > currentData ? {yValue1:"-",yValue2:"-"} : d.yValues;
                    sery1Data.push(yValues.yValue1);
                    sery2Data.push(yValues.yValue2);
                });
                opt.xAxis = [
                    {type: 'category',data:xAxis1Data}
                ];
                opt.series = [
                    {
                        name:'总符合率',
                        type:'line',
                        data:sery1Data
                    },
                    {
                        name:'抽检符合率',
                        type:'line',
                        data:sery2Data
                    }
                ];
                this.mainModel.chartOpt = opt;
            },
            //构造柱状图报表配置
            buildBarChartOpt:function(data){
                var opt = {
                    legend:{data:["总符合率","抽检符合率"]},
                    tooltip: {trigger: 'axis',formatter: echartTools.formatTooltip},
                    yAxis: [{name:'符合率(%)',min:0,axisLabel:{formatter:"{value}%"}}],
                    dataZoom: [
                               {show: true, xAxisIndex: 0, startValue:0, endValue:10}, {type: 'inside'}
                           ]
                };
                var xAxis1Data = [];
                var sery1Data = [];
                var sery2Data = [];
                _.each(data, function(d){
                    xAxis1Data.push(d.xName);
                    var yValues = d.yValues;
                    sery1Data.push(yValues.yValue1);
                    sery2Data.push(yValues.yValue2);
                });
                opt.xAxis = [
                    {type: 'category',axisLabel:{interval:0},data:xAxis1Data}
                ];
                
                opt.series = [
                    {
                        name:'总符合率',
                        type:'bar',
                        barGap: '130%',
                        barMaxWidth:40,
                        z: 10,
                        //barWidth:40,
                        label:{normal:{show:true,position:'top',formatter : '{c}%'}},
                        itemStyle: {normal: {barBorderRadius :[5, 5, 0, 0]}},
                        data:sery1Data
                    },
                    {
                        name:'抽检符合率',
                        type:'bar',
                        type: 'bar',
                        barGap: '130%',
                        barMaxWidth:40,
                        label:{normal:{show:true,position:'top',formatter : '{c}%'}},
                        itemStyle: {normal: {color: '#ddd',barBorderRadius :[5, 5, 0, 0]}},
                        data:sery2Data
                    }
                ];
                var maxLengthOfName = _.max(xAxis1Data,function(d){return d.length}).length;
                if(8 <= maxLengthOfName){//如果名称最大值大于8个字符，横坐标标签倾斜30度,并截断
                	opt.xAxis[0].axisLabel = _.extend(opt.xAxis[0].axisLabel, {
                        rotate:30,
                        formatter:function(val){
                            return dataUtils.sliceStr(val,8);
                        }
                    });
                    //扩大横坐标底部边距
                    opt.grid = {
                        bottom:120
                    };
                }
                this.mainModel.chartOpt = opt;
            },
        },
        events: {
            //checkTableSelectModel框点击保存后事件处理
            "ev_selectTableFinshed": function (data) {
                var _this = this;
                this.checkTableSelectModel.visible = false;
                this.qryModel.checkTables = _.map(data, function(table){
                	return {id:table.id,name:table.name};
                });
            },
            //checkTableSelectModel框点击取消后事件处理
            "ev_selectTableCanceled": function () {
                this.checkTableSelectModel.visible = false;
            }
        },
        ready:function(){
            this.initQryModel();
            this.$nextTick(function(){
                this.doQry();
            });
        }
    };
    return LIB.Vue.extend(opt);
});