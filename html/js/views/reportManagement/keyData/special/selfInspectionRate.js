define(function(require) {
    var LIB = require('lib');
    var template = require("text!./selfInspectionRate.html");
    var dateUtils = require("../../tools/dateUtils");
    var dataUtils = require("../../tools/dataUtils");
    var echartTools = require("../../tools/echartTools");
    var api = require("../../tools/vuex/qryInfoApi");
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
                title:"自查自纠率",
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
                }
            },
            qryModel:{
                dateRange:[],
                typeOfRange:null,
                objRange:[],
                containSubOrg: false
            },
            //柱状图配置
            barChartOpt:{
                series :[]
            },
            detailModel:{
            show:false,
                title:'明细',
                exportDataUrl:'/rpt/stats/pool/exportInspectionRateData',
                table:{
                url:'/rpt/stats/pool/selfInspectionRatePageData{/curPage}{/pageSize}',
                    qryParam:null,
                    filterColumns:["criteria.strValue.keyword"],
                    columns:[
                    {
                        title: "部门",
                        fieldName:"xName",
                        width:'80px'
                    },
                    _.omit(LIB.tableMgr.column.company,"filterType"),
                    {
                        title: "自查自纠率",
                        fieldName: "yValue",
                        width:'100px',
                        render: function(data){
                            return data.yValue + "%";
                        }
                    },

                ]
            }
        },
        }
    };
    var opt = {
        template:template,
        components:components,
        data:function(){
            return new dataModel();
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
                this.qryModel.containSubOrg = false;
            },
            //组装查询条件
            getQryParam:function(){
                var paramOpt = _.propertyOf(this.qryModel);
                var dateRange = paramOpt("dateRange");
                var beginDate = dateRange[0].Format("yyyy-MM-dd hh:mm:ss");
                var endDate = dateRange[1].Format("yyyy-MM-dd hh:mm:ss");
                var containSubOrg = paramOpt("containSubOrg");
                var typeOfRange = paramOpt("typeOfRange");
                var qryParam = {
                    "idsRange":dataUtils.getIdsRange(paramOpt("objRange")),
                    "startDateRange":beginDate,
                    "endDateRange":endDate,
                    "type": containSubOrg ? 1 : 0,
                    "orgType": typeOfRange == 'frw' ? 1 : 2
                };
                return qryParam;
            },
            //查询
            doQry:function(){
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        _this.showChartLoading();
                        var qryParam = _this.getQryParam();
                        api.querySelfInspectionRate(qryParam).then(function(res){
                            _this.buildChartOpt(res.data);
                        });
                    }
                });

            },
            showChartLoading:function(){
                this.$refs.barChart.showLoading();
            },
            //构造柱状图报表配置
            buildChartOpt:function(data){
                var _this = this;
                var opt = {
                    tooltip: [{trigger: 'axis',formatter: function(params){
                        var data = params[0].data;
                        var tip = data.xName +echartTools.getCsn('dep', data.xId)+":"+data.value;
                        return tip;
                    }}],
                    yAxis : [{type : 'value'}]
                };
                var sery1 = {
                    name:'积分数',
                    type:'bar',
                    barMaxWidth:40,
                    label:{normal:{show:true,position:'top'}},
                    itemStyle: {normal: {barBorderRadius :[5, 5, 0, 0]}},
                    data:[]
                };
                var xAxis1 = {
                    type : 'category',
                    axisLabel:{
                        rotate:30,
                        interval:0
                    },
                    data : []
                };

                _.forEach(_.take(data, 20), function(v, i){
                    if ( _this.qryModel.typeOfRange=='dep') {
                        LIB.reNameOrg(v,'xName')
                    }
                    var value = {
                        xId:v.id,
                        xName:v.xName,
                        deptId: v.deptId,
                        compId: v.compId,
                        value:v.yValue
                    };
                    xAxis1.data.push(dataUtils.sliceStr(value.xName,"8"));
                    sery1.data.push(value);
                });
                opt.xAxis = [xAxis1];
                opt.series = [sery1];

                this.barChartOpt = opt;
                this.$refs.barChart.hideLoading();
            },
            showDetails:function(){
                this.detailModel.table.qryParam = this.getQryParam();
                this.detailModel.show = true;
            },
            doExportData:function(){
                var _this = this;
                window.open(_this.detailModel.exportDataUrl+LIB.urlEncode(_this.$refs.rptDetailsTable.getCriteria()).replace("&", "?"));
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