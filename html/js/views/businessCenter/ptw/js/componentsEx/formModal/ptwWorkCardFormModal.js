define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./ptwWorkCardFormModal.html");
	var ptwCatalogSelectModal = require("componentsEx/selectTableModal/ptwCatalogSelectModal");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//作业开始时间
			workStartTime : null,
			//启用/禁用 0:启用,1:禁用
			disable : "0",
			//作业地点
			workPlace : null,
			//作业结束时间
			workEndTime : null,
			//是否启用预约机制 0:否,1:是
			enableReservation : null,
			//作业内容
			workContent : null,
			//公司Id
			compId : null,
			//部门Id
			orgId : null,
			//评审意见
			auditOpinion : null,
			//评审结果 0:未评审,1:不通过,2:通过
			auditResult : null,
			//评审时间
			auditTime : null,
			//作业状态  1:作业预约,2:作业评审,3:填报作业票,4:现场落实,5:作业会签,6:作业批准,7:开工监测,8:结果确认,9:作业关闭
			status : null,
			//作业所在设备
			workEquipment : null,
			//作业类型
			workCatalog : {id:'', name:''},
			//评审人
			auditor : {id:'', name:''},
			//作业许可
			workPermits : [],
			//作业许可历史
			workHistories : [],
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
				"code" : [LIB.formRuleMgr.length(255)],
				"workStartTime" : [LIB.formRuleMgr.require("作业开始时间")],
				"disable" :LIB.formRuleMgr.require("状态"),
				"workPlace" : [LIB.formRuleMgr.require("作业地点"),
						  LIB.formRuleMgr.length(200)
				],
				"workEndTime" : [LIB.formRuleMgr.require("作业结束时间")],
				"enableReservation" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("是否启用预约机制")),
				"workContent" : [LIB.formRuleMgr.require("作业内容"),
						  LIB.formRuleMgr.length(500)
				],
				"compId" : [LIB.formRuleMgr.require("公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"auditOpinion" : [LIB.formRuleMgr.length(500)],
				"auditResult" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"auditTime" : [LIB.formRuleMgr.allowStrEmpty],
				"status" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"workEquipment" : [LIB.formRuleMgr.length(200)],
				"workCatalog.id" : [LIB.formRuleMgr.require("作业类型")],
				"auditor.id" : [LIB.formRuleMgr.require("评审人")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			workCatalogSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			auditorSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"ptwcatalogSelectModal":ptwCatalogSelectModal,
			"userSelectModal":userSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowWorkCatalogSelectModal : function() {
				this.selectModel.workCatalogSelectModel.visible = true;
				//this.selectModel.workCatalogSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveWorkCatalog : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.workCatalog = selectedDatas[0];
				}
			},
			doShowAuditorSelectModal : function() {
				this.selectModel.auditorSelectModel.visible = true;
				//this.selectModel.auditorSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveAuditor : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.auditor = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});