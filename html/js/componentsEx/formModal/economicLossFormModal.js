define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./economicLossFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//损失物品
			lostArticle : null,
			//数量
			articleNumber : null,
			//单位
			articleUnit : null,
			//价值金额（元）
			totalValue : null,
		}
	};

	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'create',
			isReadOnly : false,
			title:"添加",

			//验证规则
	        rules:{
				"articleUnit" : [LIB.formRuleMgr.require("单位"),
						  LIB.formRuleMgr.length(50)
				],
				"lostArticle" : [LIB.formRuleMgr.require("损失物品"),
						  LIB.formRuleMgr.length(50)
				],
				"articleNumber" : [LIB.formRuleMgr.require("数量"), {type:"integer", min:1, max:10000000000}],
				"totalValue" : [LIB.formRuleMgr.require("价值金额"), {type:"integer", min:1, max:10000000000}],
	        },
	        emptyRules:{}
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			
		}
	});
	
	return detail;
});