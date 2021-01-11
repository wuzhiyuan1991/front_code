define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./exercisePlanFormModal.html");
	var dominationAreaSelectModal = require("componentsEx/selectTableModal/dominationAreaSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//状态 0:未发布,1:已发布,2:已失效
			status : null,
			//参演人数（人）
			participantNumber : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//演练形式 1:桌面推演,2:现场演习,3:自行拟定
			form : null,
			//演练时间
			exerciseTime : null,
			//演练科目
			subjects : null,
			//演练具体地点(默认取属地地址)
			specificAddress : null,
			//预案所在部门
			emerPlanDept : null,
			//预案类型 1:综合应急预案,2:专项应急预案,3:现场处置方案
			emerPlanType : null,
			//参演部门/岗位
			participant : null,
			//演练科目类型
			subjectType : null,
			//计划年份
			year : null,
			//所属公司id
			compId : null,
			//所属部门id
			orgId : null,
			//备注
			remark : null,
			//属地
			dominationArea : {id:'', name:''},
			//演练方案
			exerciseSchemes : [],
			//演练负责人
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
				"status" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("状态")),
				"participantNumber" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.require("参演人数（人）")),
				"disable" :LIB.formRuleMgr.require("状态"),
				"form" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("演练形式")),
				"exerciseTime" : [LIB.formRuleMgr.require("演练时间"),
						  LIB.formRuleMgr.length(20)
				],
				"subjects" : [LIB.formRuleMgr.require("演练科目"),
						  LIB.formRuleMgr.length(200)
				],
				"specificAddress" : [LIB.formRuleMgr.require("演练具体地点(默认取属地地址)"),
						  LIB.formRuleMgr.length(100)
				],
				"emerPlanDept" : [LIB.formRuleMgr.require("预案所在部门"),
						  LIB.formRuleMgr.length(200)
				],
				"emerPlanType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("预案类型")),
				"participant" : [LIB.formRuleMgr.require("参演部门/岗位"),
						  LIB.formRuleMgr.length(200)
				],
				"subjectType" : [LIB.formRuleMgr.require("演练科目类型"),
						  LIB.formRuleMgr.length(100)
				],
				"year" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.require("计划年份")),
				"compId" : [LIB.formRuleMgr.require("所属公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"remark" : [LIB.formRuleMgr.length(500)],
				"dominationArea.id" : [LIB.formRuleMgr.require("属地")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			dominationAreaSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"dominationareaSelectModal":dominationAreaSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowDominationAreaSelectModal : function() {
				this.selectModel.dominationAreaSelectModel.visible = true;
				//this.selectModel.dominationAreaSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveDominationArea : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.dominationArea = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});