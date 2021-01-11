define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./roleFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//角色ID
			id : null,
			//角色编码
			code : null,
			//角色名称
			name : null,
			//是否禁用，0启用，1禁用
			disable : null,
			//备注
			remarks : null,
			//0：普通角色 1：hse角色
			roleType : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//人员
			users : [],
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
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"code" : [LIB.formRuleMgr.length()],
				"name" : [LIB.formRuleMgr.length()],
				"disable" : [LIB.formRuleMgr.length()],
				"remarks" : [LIB.formRuleMgr.length()],
				"roleType" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		}
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