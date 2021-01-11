define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./riskAssessItemFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//唯一标识
			code : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//工作项
			content : null,
			//检查结果 0:符合,1:不符合,2:不涉及
			checkResult : null,
			//考核落实结果
			result : null,
			//考核标准
			standard : null,
			//执行组
			riskAssessGroup : {id:'', name:''},
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
				"disable" :LIB.formRuleMgr.require("状态"),
				"content" : [LIB.formRuleMgr.require("工作项"),
						  LIB.formRuleMgr.length(1000)
				],
				"checkResult" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"result" : [LIB.formRuleMgr.length(500)],
				"standard" : [LIB.formRuleMgr.length(1000)],
				"riskAssessGroup.id" : [LIB.formRuleMgr.allowStrEmpty],
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