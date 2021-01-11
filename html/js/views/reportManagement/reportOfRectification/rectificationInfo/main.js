define(function(require) {
	var LIB = require('lib');
    var template = require("text!./main.html");
    var qryInfoApi = require("../../tools/vuex/qryInfoApi");
    var dateUtils = require("views/reportManagement/tools/dateUtils");
    var reqUtils = require("../../tools/vuex/reqUtils");
    var statisConst = require("../../tools/statisticalConst");
    var newQryParam = function(){
    	return {
    		method:null,//统计方式,abs-绝对值;avg-平均值;trend-平均值
    		item:["rectification"],
			typeOfRange:null,
			indicators:null,
			objRange:[],
			dateRange:[]
		};
    }
	var modelData={
		qryParam:newQryParam(),
		indicators:_.find(statisConst.items,function(item){ return item.value === "rectification"}).children,
		title:"",
		qryModel:{
			show:false,
			list:[]
		},
		drillModel:{
			show:false,
			title:"明细",
			groups:[],
			customQryParam:{
				xId:null
			}
		},
		moreModel:{
			show:false
		},
		ruleModel:{
			item:{type:'array',required: true, message: '请选择统计项目'},
			typeOfRange:{required: true, message: '请选择对象范围'},
			objRange:{type:'array',required: true, message: '请选择对象个体'},
			dateRange:{type:'array',required: true, message: '请选择统计日期'}
		},
		charts:{
			show:false,
			opt:null
		}
	};
	var component = LIB.Vue.extend({
		template: template,
		mixins:[require("../../tools/vueUtils")],
		data:function(){
			return modelData;
		},
		computed:{
			currentDate:function(){
				return new Date().Format("yyyy-MM-dd");
			},
			detailsQryParam:function(){
				var item = this.qryParam.item;
				var obj = _.omit(_.clone(this.qryParam),"item");
				obj.item = item[0];
				obj.indicators = item[1];
				return obj;
			},
			typeOfRanges:function(){
				var item = this.qryParam.item[0];
				var typeOfRanges = statisConst.typeOfRanges;
				if(null === item || "" === item){
					return [];
				}else if("person" === item){
					return typeOfRanges["1"];
				}else{
					return typeOfRanges["2"];
				}
			}
		},
		methods:{
			pageReset:function(){
				this.title = null;
				this.qryInfoId = null;
				_.extend(this.qryParam, newQryParam());
				this.$refs.echart.doClear();
				this.charts.show = false;
			},
			changeItem:function(){
				this.qryParam.typeOfRange = null;
			},
			changeTypeOfRange:function(){
				this.qryParam.objRange = [];
			},
			saveQry:function(){
				var _this = this;
				this.$refs.ruleform.validate(function (valid){
					if (valid) {
						_this.qryModel.show = true;
					}
				});
			},
			loadQryInfoList:function(){
				var _this = this;
				qryInfoApi.list({type:"rectification"}).then(function(res){
					_this.qryModel.list = _.map(res.data,function(d){d.star = d.homeOrder > 0;return d;});
				});
			},
			saveQrySuccessed:function(){
				this.loadQryInfoList();
			}
		},
		route: {
			//因为router使用了keeplive, 所以需要每次激活二级路由的时候重新刷新table
			activate: function (transition) {
				this.loadQryInfoList();
				//路由生命周期必须调用
				transition.next();
			}
		}
	})
	return component;
});
