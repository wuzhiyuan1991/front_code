define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./idaDutySubjectFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//分类名称
			name : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//公司id
			compId : null,
			//部门id
			orgId : null,
			//履职能力清单
			dutyAbilities : [],
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
				"code" : [LIB.formRuleMgr.length(100)],
				"name" : [LIB.formRuleMgr.length(50)],
				"disable" :LIB.formRuleMgr.require("状态"),
				"compId" : [LIB.formRuleMgr.require("公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
	        },
	        emptyRules:{}
		},
		selectModel : {
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