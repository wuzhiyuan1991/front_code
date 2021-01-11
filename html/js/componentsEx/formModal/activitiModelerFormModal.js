define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./activitiModelerFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//用户id
			id : null,
			//用户编码
			code : null,
			//工作流名称
			name : null,
			//
			compId : null,
			//企业id
			orgId : null,
			//工作流描述
			description : null,
			//是否禁用，0启用，1禁用
			disable : null,
			//工作流key
			modelerKey : null,
			//更新日期
			modifyDate : null,
			//创建日期
			createDate : null,
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
				"code" : [LIB.formRuleMgr.require("用户编码"),
						  LIB.formRuleMgr.length()
				],
				"name" : [LIB.formRuleMgr.length()],
				"description" : [LIB.formRuleMgr.length()],
				"disable" : [LIB.formRuleMgr.length()],
				"modelerKey" : [LIB.formRuleMgr.length()],
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