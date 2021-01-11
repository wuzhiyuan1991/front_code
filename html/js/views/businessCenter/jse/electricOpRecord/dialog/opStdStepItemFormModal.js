define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./opStdStepItemFormModal.html");
	// var opStdStepSelectModal = require("componentsEx/selectTableModal/opStdStepSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//唯一标识
			code : null,
			//禁用标识 0未禁用，1已禁用
			disable : '0',
			//操作内容
			content : null,
			//控制措施
			ctrlMethod : null,
			//风险
			risk : null
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
				"content" : [
					LIB.formRuleMgr.require("操作项目"),
				  	LIB.formRuleMgr.length(1000)
				],
				// "ctrlMethod" : [LIB.formRuleMgr.length(1000)],
				// "risk" : [LIB.formRuleMgr.length(1000)]
	        },
	        emptyRules:{}
		},
		// selectModel : {
		// 	opStdStepSelectModel : {
		// 		visible : false,
		// 		filterData : {orgId : null}
		// 	}
		// }

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			// doShowOpStdStepSelectModal : function() {
			// 	this.selectModel.opStdStepSelectModel.visible = true;
			// 	//this.selectModel.opStdStepSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			// },
			// doSaveOpStdStep : function(selectedDatas) {
			// 	if (selectedDatas) {
			// 		this.mainModel.vo.opStdStep = selectedDatas[0];
			// 	}
			// },
		}
	});
	
	return detail;
});