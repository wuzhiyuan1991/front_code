define(function(require) {
    var LIB = require('lib');
    var template = require("text!./unqualifiedRateReport.html");
    var dateUtils = require("../../tools/dateUtils");
    var dataUtils = require("../../tools/dataUtils");
    var api = require("./vuex/unqualifiedRateReport-api");
    var statisConst = require("../../tools/statisticalConst");
    var echartTools = require("../../tools/echartTools");
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
                title:"不符合率排名",
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
                //散点图配置
                barChartOpt:{
                    series :[]
                }
            },
            qryModel:{
                dateRange:[],
                typeOfRange:null,
                objRange:[],
                sourceInfo:null
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
                return this.qryModel.typeOfRange == 'frw' ? api.unqualifiedRateByComp:api.unqualifiedRateByOrg;
            }
        },
        methods:{
            changeTypeOfRange:function(){
                this.qryModel.objRange = [];
            },
            initQryModel:function(){
                //默认本月
                this.qryModel.dateRange = [dateUtils.getMonthFirstDay(current), dateUtils.getMonthLastDay(current)];
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
                        "type":paramOpt("sourceInfo"),
						"idsRange":dataUtils.getIdsRange(paramOpt("objRange")),
						"startDateRange":beginDate,
						"endDateRange":endDate
                };
                qryParam.bizType = this.$route.query.bizType ? this.$route.query.bizType : 'default';
                return qryParam;
            },
            //查询
            doQry:function(){
                var _this = this;
                this.$refs.ruleform.validate(function (valid){
                    if(valid){
                        var qryParam = _this.getQryParam();
                        _this.getApi(qryParam).then(function(res){
                            _this.buildBarChartOpt(res.data);
                        });
                    }
                });
            },
            //构造柱状图报表配置
            buildBarChartOpt:function(data){
                var typeOfRange = this.qryModel.typeOfRange;
                var opt = {
                    tooltip: [{trigger: 'axis',formatter: function(params){
                        var data = params[0].data;
                        var tip = data.xName +echartTools.getCsn(typeOfRange, data.compId)+":"+data.value+"%";
                        return tip;
                    }}],
                    yAxis : [{name:'不符合率(%)',type : 'value',min:0,axisLabel:{formatter:"{value}%"}}],
                    grid: {
                        left: 10,
                        right: 10,
                        bottom: 20,
                        top: 40,
                        containLabel: true
                    }
                };
                var sery1 = {
                    name:'不符合率',
                    type:'bar',
                    barMaxWidth:40,
                    label:{normal:{show:true,position:'top',formatter:'{c}%'}},
                    itemStyle: {normal: {barBorderRadius :[5, 5, 0, 0]}},
                    data:[]
                };
                var xAxis1 = {
                    type : 'category',
                    axisLabel:{
                        interval:0
                    },
                    data : []
                };

                var _data = _.sortBy(data,function(d){return Number(d.yValue)* -1;});
                _data = _.map(_.take(_data, this.dataNumLimit), function (v) {
                    return {
                        xId:v.xId,
                        xName:v.xName,
                        deptId: v.deptId,
                        compId: v.compId,
                        value:v.yValue
                    };
                });
                sery1.data = _data;
                xAxis1.data = _.pluck(_data, "xName");

                if(20 < xAxis1.data.length){//如果分组数量大等于限制数量,添加缩放滚动条
                    opt.grid.bottom = '15%';
                    opt.dataZoom = [
                        {
                            type: 'slider',
                            show: true,
                            xAxisIndex: 0,
                            start: 0,
                            end: parseInt((20 / xAxis1.data.length) * 100),
                            zoomLock:true,
                            showDetail:false
                        }
                    ]
                }

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
                opt.series = [sery1];
                this.mainModel.barChartOpt = opt;
            },
            _queryDataNumLimit: function () {
                var _this = this;
                api.queryDataNumLimit().then(function (res) {
                    _this.dataNumLimit = Number(res.data.result) || 20;
                    _this.doQry();
                })
            }
        },
        ready:function(){
            this.initQryModel();
            this.$nextTick(function(){
                this._queryDataNumLimit();
            });
        }
    };
    return LIB.Vue.extend(opt);
});