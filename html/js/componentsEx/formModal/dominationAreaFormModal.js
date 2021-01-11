define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./dominationAreaFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//ID
			id : null,
			//编码
			code : null,
			//名称
			name : null,
			//禁用标识 0未禁用，1已禁用
			disable : null,
			//公司id
			compId : null,
			//部门id
			orgId : null,
			//备注
			remark : null,
			//修改日期
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
				"code" : [LIB.formRuleMgr.length()],
				"name" : [LIB.formRuleMgr.require("名称"),
						  LIB.formRuleMgr.length()
				],
				"disable" : [LIB.formRuleMgr.require("禁用标识"),
						  LIB.formRuleMgr.length()
				],
				"remark" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()],	
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