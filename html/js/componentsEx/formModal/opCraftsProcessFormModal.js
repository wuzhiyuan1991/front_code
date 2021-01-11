define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./opCraftsProcessFormModal.html");
	// var opTaskSelectModal = require("componentsEx/selectTableModal/opTaskSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//唯一标识
			code : null,
			//工艺流程名称
			name : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//工艺操作
			opTask : {id:'', name:''},
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
				"name" : [LIB.formRuleMgr.require("工艺流程内容"),
						  LIB.formRuleMgr.length(200)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				// "opTask.id" : [LIB.formRuleMgr.require("工艺操作")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			opTaskSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			// "optaskSelectModal":opTaskSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			// doShowOpTaskSelectModal : function() {
			// 	this.selectModel.opTaskSelectModel.visible = true;
			// 	//this.selectModel.opTaskSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			// },
			// doSaveOpTask : function(selectedDatas) {
			// 	if (selectedDatas) {
			// 		this.mainModel.vo.opTask = selectedDatas[0];
			// 	}
			// },
			
		}
	});
	
	return detail;
});