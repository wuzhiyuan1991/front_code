define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./exerciseSummaryFormModal.html");
	var exerciseSchemeSelectModal = require("componentsEx/selectTableModal/exerciseSchemeSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//演习前的准备
			preparation : null,
			//演习的改进建议
			suggestionSummary : null,
			//演习经过简述(默认演练方案的步骤)
			processDesc : null,
			//
			revelation : null,
			//演习的不足之处
			shortcomings : null,
			//演习的评估情况
			estimateSummary : null,
			//备注
			remarks : null,
			//演练总结
			exerciseScheme : {id:'', name:''},
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
				"disable" :LIB.formRuleMgr.require("状态"),
				"preparation" : [LIB.formRuleMgr.require("演习前的准备"),
						  LIB.formRuleMgr.length(2000)
				],
				"suggestionSummary" : [LIB.formRuleMgr.require("演习的改进建议"),
						  LIB.formRuleMgr.length(2000)
				],
				"processDesc" : [LIB.formRuleMgr.require("演习经过简述(默认演练方案的步骤)"),
						  LIB.formRuleMgr.length(2000)
				],
				"revelation" : [LIB.formRuleMgr.require(""),
						  LIB.formRuleMgr.length(2000)
				],
				"shortcomings" : [LIB.formRuleMgr.require("演习的不足之处"),
						  LIB.formRuleMgr.length(2000)
				],
				"estimateSummary" : [LIB.formRuleMgr.require("演习的评估情况"),
						  LIB.formRuleMgr.length(2000)
				],
				"remarks" : [LIB.formRuleMgr.length(2000)],
				"exerciseScheme.id" : [LIB.formRuleMgr.require("演练总结")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			exerciseSchemeSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"exerciseschemeSelectModal":exerciseSchemeSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowExerciseSchemeSelectModal : function() {
				this.selectModel.exerciseSchemeSelectModel.visible = true;
				//this.selectModel.exerciseSchemeSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveExerciseScheme : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.exerciseScheme = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});