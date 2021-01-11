define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./checkObjectFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//id
			id : null,
			//
			code : null,
			//对象名称
			name : null,
			//
			compId : null,
			//组织id
			orgId : null,
			//是否禁用，0启用，1禁用
			disable : null,
			//排序
			orderNo : null,
			//备注
			remarks : null,
			//类型 0 对象   1 对象类型
			type : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//检查表
			checkTables : [],
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
				"code" : [LIB.formRuleMgr.require(""),
						  LIB.formRuleMgr.length()
				],
				"name" : [LIB.formRuleMgr.require("对象名称"),
						  LIB.formRuleMgr.length()
				],
				"disable" : [LIB.formRuleMgr.length()],
				"orderNo" : [LIB.formRuleMgr.length()],
				"remarks" : [LIB.formRuleMgr.length()],
				"type" : [LIB.formRuleMgr.length()],
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