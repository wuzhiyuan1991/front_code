define(function(require){
	var LIB = require('lib');
 	//数据模型
	var api = require("../vuex/api");
	var tpl = require("text!./editRules.html");
	//运算符号集合
	var operationSymbol = {
			'+':'+',
			'-':'-',
			'*':'×',
			'/':'÷'
	}; 
	//数据模型
	var dataModel = {
			mainModel : {
				calcRule : ''
			},
			gradeLats : []
	};
	//校验运算规则正确性
	var checkCalcRule = function(calcRule){
		return !/^(\s?[a-zA-Z0-9]+)(\s[\+\-\*\/](\s[a-zA-Z0-9]+))*$/.test(calcRule);
	}
	//是否提醒用户，修改运算规则会清空分值范围配置
	var prompt = false;
	var detail = LIB.Vue.extend({
		props:{
			riskModelId : String,
			calculatingFormula : String
		},
		template: tpl,
		data:function(){
			return dataModel;
		},
		computed:{
			symbols:function(){
				return _.keys(operationSymbol);
			},
			ruleLabels:function(){
				var labels = [];
				var calcRule = this.mainModel.calcRule;
				if(calcRule){
					var _this = this;
					var rules = calcRule.split(" ");
					_.each(rules,function(rule){
						var label = _.trim(_this.getSignRule(rule));
						if(label != ""){
							labels.push(label);
						}
					});
				}
				return labels;
			}
			//calcRuleLable:function(){
			//	var calcRule = this.mainModel.calcRule;
			//	if(calcRule == null) return "";
			//	var _this = this;
			//	var rules = calcRule.split(" ");
			//	var label = "";
			//	_.each(rules,function(rule){
			//		label += _this.getSignRule(rule)+" ";
			//	});
			//	return label;
			//}
		},
		methods:{
			doPrint:function(){
				var calcRule = this.mainModel.calcRule;
				//console.log("'"+calcRule+"':"+checkCalcRule(this.mainModel.calcRule));
			},
			doSave:function(){
				if(checkCalcRule(this.mainModel.calcRule)){
					LIB.Msg.error("请配置正确的运算规则");
					return false;
				}
				var _this = this;
				var data = {
								id:this.riskModelId,
								calculatingFormula:this.mainModel.calcRule
							};
				var updateInfo = function(){
					api.updateRule(data).then(function(res){
						LIB.Msg.info("保存成功");
						//_this.$dispatch("ev_editRulesFinshed");
						_this.$emit("do-edit-rules-finshed");
					});
				}
				if(prompt){
					LIB.Modal.confirm({
						title:'修改运算规则会清空分值范围配置,确定修改运算规则?',
						onOk:function(){
							updateInfo();
						}
					});
				}else{
					updateInfo();
				}
			},
			doCancel:function(){
				this.mainModel.calcRule = "";
			},
			doRuleDel:function(index){
				//去空格br yyt 3665
				var rules = _.trim(this.mainModel.calcRule).split(" ");
				rules.splice(index, 1);
				this.mainModel.calcRule = rules.join(" ");
			},
			doMove:function(index,lat){
				this.add2CalcRule(lat.id);
			},
			add2CalcRule:function(rule){
				this.mainModel.calcRule += " " + rule;
			},
			//根据参数获取对应数学符号标示或者纬度名称
			getSignRule:function(rule){
				var operation = _.propertyOf(operationSymbol)(rule);
				if(operation == null){
					_.each(this.gradeLats,function(lat){
						if(lat.id == rule){
							operation = lat.name;
						}
					});
				}
				return operation || '';
			}
		},
		events:{
			'ev_loadRules':function(data){
				var _this = this;
				prompt = data.prompt;
				this.riskModelId = data.riskModelId;
				this.mainModel.calcRule = data.calculatingFormula || '';
				if(this.riskModelId){
					api.listGradeLat({'riskModel.id':this.riskModelId}).then(function(res){
						_this.gradeLats = res.data;
					});
				}
			}
		}
	});
	return detail;
});