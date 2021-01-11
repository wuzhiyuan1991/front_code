define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./risktypeFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//ID
			id : null,
			//角色编码
			code : null,
			//分类名称
			name : null,
			//排序
			orderNo : null,
			//描述说明
			description : null,
			//是否禁用，0启用，1禁用
			disable : null,
			//备注
			remarks : null,
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
				"name" : [LIB.formRuleMgr.require("分类名称"),
						  LIB.formRuleMgr.length()
				],
				"orderNo" : [LIB.formRuleMgr.require("排序"),
						  LIB.formRuleMgr.length()
				],
				"description" : [LIB.formRuleMgr.length()],
				"disable" : [LIB.formRuleMgr.length()],
				"remarks" : [LIB.formRuleMgr.length()],
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