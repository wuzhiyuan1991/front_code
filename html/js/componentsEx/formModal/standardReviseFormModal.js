define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./standardReviseFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//角色编码
			code : null,
			//
			name : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//修订信息
			revise : null,
			//修订时间
			reviseDate : null,
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
				"code" : [LIB.formRuleMgr.length(100)],
				"name" : [LIB.formRuleMgr.length(100)],
				"disable" :LIB.formRuleMgr.require("状态"),
				"revise" : [LIB.formRuleMgr.length(255)],
				"reviseDate" : [LIB.formRuleMgr.allowStrEmpty],
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