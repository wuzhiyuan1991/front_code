define(function(require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var qryInfoApi = require("../../tools/vuex/qryInfoApi");
	var dateUtils = require("../../tools/dateUtils");
    var statisConst = require("../../tools/statisticalConst");
    var components = {
			'cascader':require('components/cascader/iviewCascader'),
			'obj-select':require("../../reportDynamic/dialog/objSelect"),
			'qry-info-edit':require("../../reportDynamic/dialog/qryInfoEdit"),
			'check-record-details':require("../../reportDynamic/dialog/checkRecordDetails"),
			'echart-component':require("../../tools/chartUtils/chartFactory")
		};
    var dataModel = function(){
        var current = new Date();
        var currYear = current.getFullYear();
        var times = {
            prevWeek: new Date(currYear, current.getMonth(), current.getDate()-7),
            prevMonth: new Date(currYear, current.getMonth()-1),
            prevQuarter: new Date(currYear, current.getMonth()-3),
            prevYear: new Date(currYear-1, current.getMonth())
        };
        return {
            items:statisConst.items,
            datePickModel:{
                options:{
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
                }
            },
            qryInfoModel:{
                title:null,
                vo:{
                    method:null,//统计方式,abs-绝对值;avg-平均值;trend-平均值
                    item:[],
                    typeOfRange:null,
                    indicators:null,
                    objRange:[],
                    dateRange:[],
                    containRandomData: false
                },
                rules:{
                    item:{type:'array',required: true, message: '请选择统计项目'},
                    typeOfRange:{required: true, message: '请选择对象范围'},
                    dateRange:{type:'array',required: true, message: '请选择统计日期'}
                }
            }
        };
    };
    var opt = {
        template:template,
        components:components,
        data:function(){
            return dataModel();
        },
        props:{
            qryInfoDetail:Object
        },
        computed:{
			typeOfRanges:function(){
				var item = this.qryInfoModel.vo.item[0];
				var typeOfRanges = statisConst.typeOfRanges;
				if(null === item || "" === item){
					return [];
				}else if("taskPlan" === item){
					return typeOfRanges["0"];
				}else if("person" === item){
					return typeOfRanges["1"];
				}else{
					return typeOfRanges["2"];
				}
			},
            showRadom: function () {
                return this.qryInfoModel.vo.item && (this.qryInfoModel.vo.item[0] === 'person' || this.qryInfoModel.vo.item[0] === 'equip');
            }
        },
        methods:{
            changeItem:function(){
                this.qryInfoModel.vo.typeOfRange = null;
                this.qryInfoModel.vo.containRandomData = false;
            },
            changeTypeOfRange:function(){
                this.qryInfoModel.vo.objRange = [];
            },
            loadQryParam:function(qryInfo){
                var _this = this;
                var qryInfoId = qryInfo.schemeId;
                if(_.isNull(qryInfoId)){
                    return;
                }
                qryInfoApi.get({id:qryInfoId}).then(function(res){
                    var d = res.data;
                    var param = _.clone(d.details);
                    _this.qryInfoModel.title = d.name;
                    var qryParam = _this.qryInfoModel.vo;

                    var item = new Array();
                    item.push(param.item);
                    if(param.indicators){
                        item = item.concat(param.indicators.split("-"));
                    }
                    qryParam.item = item;
                    //统计方法
                    qryParam.method = param.method;

                    if("containRandomData" in param) {
                        qryParam.containRandomData = param.containRandomData === '1';
                    }

                    _this.$nextTick(function(){
                        qryParam.typeOfRange = param.typeOfRange;
                        qryParam.dateRange = [new Date(param.beginDate), new Date(param.endDate)];
                        _this.$nextTick(function(){
                            if(!_.isNull(param.objRange) && "" != _.trim(param.objRange)){
                                qryParam.objRange = JSON.parse(param.objRange);
                            }else {
                                qryParam.objRange = [];
                            }
                            //查询绝对值
                            _this.doQry();
                        });
                    });
                });
            },
            doQry:function(){
                var _this = this;
                this.$refs.ruleform.validate(function (valid){
                    if(valid){
                        var qryParam = _.deepExtend({}, _this.qryInfoModel.vo);
                        var chartComp = _this.$refs.echart;
                        chartComp.doQry(qryParam);
                    }
                });
            }
        },
        created:function(){
            if(!_.isNull(this.qryInfoDetail)){
                this.loadQryParam(this.qryInfoDetail);
            }
        }
    };
    return LIB.Vue.extend(opt);
});