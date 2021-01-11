define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./riCheckRecordFormModal.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var riCheckTableSelectModal = require("componentsEx/selectTableModal/riCheckTableSelectModal");
	var riCheckTaskSelectModal = require("componentsEx/selectTableModal/riCheckTaskSelectModal");
	var riCheckPlanSelectModal = require("componentsEx/selectTableModal/riCheckPlanSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//检查结果详情 如10/10,10条合格,10条不合格
			checkResultDetail : null,
			//检查结果 0:不合格,1:合格
			checkResult : null,
			//禁用标识 0:未禁用,1:已禁用
			disable : null,
			//检查时间
			checkDate : null,
			//
			compId : null,
			//组织id
			orgId : null,
			//检查开始时间
			checkBeginDate : null,
			//检查结束时间
			checkEndDate : null,
			//来源 0:手机检查,1:web录入
			checkSource : null,
			//备注
			remarks : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//检查人
			user : {id:'', name:''},
			//巡检表
			riCheckTable : {id:'', name:''},
			//巡检任务
			riCheckTask : {id:'', name:''},
			//巡检计划
			riCheckPlan : {id:'', name:''},
			//巡检记录明细
			riCheckRecordDetails : [],
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
				"checkResultDetail" : [LIB.formRuleMgr.require("检查结果详情"),
						  LIB.formRuleMgr.length()
				],
				"checkResult" : [LIB.formRuleMgr.require("检查结果"),
						  LIB.formRuleMgr.length()
				],
				"disable" : LIB.formRuleMgr.range(1, 100).concat(LIB.formRuleMgr.require("状态")),
				"checkDate" : [LIB.formRuleMgr.require("检查时间"),
						  LIB.formRuleMgr.length()
				],
				"checkSource" : LIB.formRuleMgr.range(1, 100),
				"remarks" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		},
		selectModel : {
			userSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			riCheckTableSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			riCheckTaskSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			riCheckPlanSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"userSelectModal":userSelectModal,
			"richecktableSelectModal":riCheckTableSelectModal,
			"richecktaskSelectModal":riCheckTaskSelectModal,
			"richeckplanSelectModal":riCheckPlanSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowUserSelectModal : function() {
				this.selectModel.userSelectModel.visible = true;
				//this.selectModel.userSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveUser : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.user = selectedDatas[0];
				}
			},
			doShowRiCheckTableSelectModal : function() {
				this.selectModel.riCheckTableSelectModel.visible = true;
				//this.selectModel.riCheckTableSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveRiCheckTable : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.riCheckTable = selectedDatas[0];
				}
			},
			doShowRiCheckTaskSelectModal : function() {
				this.selectModel.riCheckTaskSelectModel.visible = true;
				//this.selectModel.riCheckTaskSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveRiCheckTask : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.riCheckTask = selectedDatas[0];
				}
			},
			doShowRiCheckPlanSelectModal : function() {
				this.selectModel.riCheckPlanSelectModel.visible = true;
				//this.selectModel.riCheckPlanSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveRiCheckPlan : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.riCheckPlan = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});