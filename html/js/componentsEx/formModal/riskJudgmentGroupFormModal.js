define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./riskJudgmentGroupFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//唯一标识
			code : null,
			//步骤名称
			name : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//是否全部排出 0:不排出,1排出
			allExclude : null,
			//项内容
			itemContent : null,
			//风险层级
			riskJudgmentLevel : {id:'', name:''},
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
				"code" : [LIB.formRuleMgr.require("唯一标识"),
						  LIB.formRuleMgr.length(100)
				],
				"name" : [LIB.formRuleMgr.require("步骤名称"),
						  LIB.formRuleMgr.length(100)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"allExclude" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"itemContent" : [LIB.formRuleMgr.length(65535)],
				"riskJudgmentLevel.id" : [LIB.formRuleMgr.allowStrEmpty],
	        },
	        emptyRules:{}
		},
		selectModel : {
			riskJudgmentLevelSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
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