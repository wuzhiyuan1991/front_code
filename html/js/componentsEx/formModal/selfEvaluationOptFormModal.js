define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./selfEvaluationOptFormModal.html");
	var selfEvaluationQuestionSelectModal = require("componentsEx/selectTableModal/selfEvaluationQuestionSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//选项内容
			content : null,
			//自评问卷问题
			selfEvaluationQuestion : {id:'', name:''},
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
				"content" : [LIB.formRuleMgr.require("选项内容"),
						  LIB.formRuleMgr.length(200)
				],
				"selfEvaluationQuestion.id" : [LIB.formRuleMgr.require("自评问卷问题")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			selfEvaluationQuestionSelectModel : {
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
			
		}
	});
	
	return detail;
});