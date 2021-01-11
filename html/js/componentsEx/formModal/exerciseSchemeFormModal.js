define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./exerciseSchemeFormModal.html");
	var exercisePlanSelectModal = require("componentsEx/selectTableModal/exercisePlanSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//状态 0:未发布,1:已发布
			status : null,
			//注意事项
			announcements : null,
			//场景概述
			scenarioOverview : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//演练地点
			exerciseAddress : null,
			//演练参加人员职责
			participantDuty : null,
			//演练实施步骤
			executionStep : null,
			//演练科目
			subjects : null,
			//应急演练组织机构
			exerciseOrgan : null,
			//演练科目类型
			subjectType : null,
			//演练时间
			exerciseDate : null,
			//
			purpose : null,
			//所属公司id
			compId : null,
			//所属部门id
			orgId : null,
			//演练时长（时）
			hour : null,
			//演练时长（分）
			minute : null,
			//备注
			remarks : null,
			//演练计划
			exercisePlan : {id:'', name:''},
			//危险性分析
			riskAnalyses : [],
			//自评问卷问题
			selfEvaluationQuestions : [],
			//演练自评任务
			selfEvaluationTasks : [],
			//演练人员
			exerciseParticipants : [],
			//演练物资
			emerResources : [],
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
				"status" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("状态")),
				"announcements" : [LIB.formRuleMgr.require("注意事项"),
						  LIB.formRuleMgr.length(2000)
				],
				"scenarioOverview" : [LIB.formRuleMgr.require("场景概述"),
						  LIB.formRuleMgr.length(2000)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"exerciseAddress" : [LIB.formRuleMgr.require("演练地点"),
						  LIB.formRuleMgr.length(100)
				],
				"participantDuty" : [LIB.formRuleMgr.require("演练参加人员职责"),
						  LIB.formRuleMgr.length(2000)
				],
				"executionStep" : [LIB.formRuleMgr.require("演练实施步骤"),
						  LIB.formRuleMgr.length(2000)
				],
				"subjects" : [LIB.formRuleMgr.require("演练科目"),
						  LIB.formRuleMgr.length(200)
				],
				"exerciseOrgan" : [LIB.formRuleMgr.require("应急演练组织机构"),
						  LIB.formRuleMgr.length(2000)
				],
				"subjectType" : [LIB.formRuleMgr.require("演练科目类型"),
						  LIB.formRuleMgr.length(100)
				],
				"exerciseDate" : [LIB.formRuleMgr.require("演练时间")],
				"purpose" : [LIB.formRuleMgr.require(""),
						  LIB.formRuleMgr.length(2000)
				],
				"compId" : [LIB.formRuleMgr.require("所属公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"hour" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"minute" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"remarks" : [LIB.formRuleMgr.length(2000)],
				"exercisePlan.id" : [LIB.formRuleMgr.require("演练计划")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			exercisePlanSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"exerciseplanSelectModal":exercisePlanSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowExercisePlanSelectModal : function() {
				this.selectModel.exercisePlanSelectModel.visible = true;
				//this.selectModel.exercisePlanSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveExercisePlan : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.exercisePlan = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});