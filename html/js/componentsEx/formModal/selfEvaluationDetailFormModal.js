define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./selfEvaluationDetailFormModal.html");
	var selfEvaluationQuestionSelectModal = require("componentsEx/selectTableModal/selfEvaluationQuestionSelectModal");
	var selfEvaluationTaskSelectModal = require("componentsEx/selectTableModal/selfEvaluationTaskSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//自评答案(选择题为选项id，问答题手填)
			answer : null,
			//自评问卷问题
			selfEvaluationQuestion : {id:'', name:''},
			//自评任务
			selfEvaluationTask : {id:'', name:''},
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
				"answer" : [LIB.formRuleMgr.require("自评答案(选择题为选项id，问答题手填)"),
						  LIB.formRuleMgr.length(200)
				],
				"selfEvaluationQuestion.id" : [LIB.formRuleMgr.require("自评问卷问题")],
				"selfEvaluationTask.id" : [LIB.formRuleMgr.require("自评任务")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			selfEvaluationQuestionSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			selfEvaluationTaskSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"selfevaluationquestionSelectModal":selfEvaluationQuestionSelectModal,
			"selfevaluationtaskSelectModal":selfEvaluationTaskSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowSelfEvaluationQuestionSelectModal : function() {
				this.selectModel.selfEvaluationQuestionSelectModel.visible = true;
				//this.selectModel.selfEvaluationQuestionSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveSelfEvaluationQuestion : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.selfEvaluationQuestion = selectedDatas[0];
				}
			},
			doShowSelfEvaluationTaskSelectModal : function() {
				this.selectModel.selfEvaluationTaskSelectModel.visible = true;
				//this.selectModel.selfEvaluationTaskSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveSelfEvaluationTask : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.selfEvaluationTask = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});