define(function(require) {
    var LIB = require('lib');
    var template = require("text!./userParticipationReport.html");
    var dateUtils = require("../../tools/dateUtils");
    var dataUtils = require("../../tools/dataUtils");
    var echartTools = require("../../tools/echartTools");
    var api = require("./vuex/userParticipationReport-api");
    var statisConst = require("../../tools/statisticalConst");
    var components = {
			'obj-select':require("../../reportDynamic/dialog/objSelect")
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
                title:"随机观察统计",
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
                //折线图配置
                lineChartOpt:{
                    series :[]
                }
            },
            qryModel:{
                dateRange:[],
                typeOfRange:null,
                objRange:[]
            }
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
                return this.qryModel.typeOfRange == 'frw' ? api.userParticipationByComp:api.userParticipationByOrg;
            }
        },
        methods:{
            changeTypeOfRange:function(){
                this.qryModel.objRange = [];
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
						"endDateRange":endDate
                };
                return qryParam;
            },
            //查询
            doQry:function(){
                var _this = this;
                this.$refs.ruleform.validate(function (valid){
                    if(valid){
                        var qryParam = _this.getQryParam();
                        _this.getApi(qryParam).then(function(res){
                            _this.buildLineChartOpt(res.data);
                        });
                    }
                });
            },
            //构造柱状图报表配置
            buildLineChartOpt:function(data){
                var currentData = new Date().Format("yyyy-MM");
                var opt = {
                    tooltip: {trigger: 'axis'},
                    yAxis: [{name:'次数',type: 'value'}]
                };

                var xAxis1Data = [];
                var sery1Data = [];

                _.each(data, function(d){
                    xAxis1Data.push(d.xName);
                    var yValue = d.xName > currentData ? '-' : d.yValue;
                    sery1Data.push(yValue);
                });
                opt.xAxis = [
                    {type: 'category',data:xAxis1Data}
                ];
                opt.series = [
                    {
                        name:'总次数',
                        type:'line',
                        data:sery1Data
                    }
                ];
                this.mainModel.lineChartOpt = opt;
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