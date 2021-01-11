define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./tpaCheckTaskFormModal.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var tpaCheckTableSelectModal = require("componentsEx/selectTableModal/tpaCheckTableSelectModal");
	var tpaCheckPlanSelectModal = require("componentsEx/selectTableModal/tpaCheckPlanSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//检查任务id
			id : null,
			//
			code : null,
			//结束时间
			endDate : null,
			//开始时间
			startDate : null,
			//
			compId : null,
			//组织id
			orgId : null,
			//实际完成时间
			checkDate : null,
			//是否禁用 0未发布，1发布
			disable : null,
			//任务序号
			num : null,
			//任务状态 默认0未到期 1待执行 2按期执行 3超期执行 4未执行
			status : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//检查人
			user : {id:'', name:''},
			//检查表
			tpaCheckTable : {id:'', name:''},
			//检查计划
			tpaCheckPlan : {id:'', name:''},
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
				"code" : [LIB.formRuleMgr.require(""),
						  LIB.formRuleMgr.length()
				],
				"endDate" : [LIB.formRuleMgr.require("结束时间"),
						  LIB.formRuleMgr.length()
				],
				"startDate" : [LIB.formRuleMgr.require("开始时间"),
						  LIB.formRuleMgr.length()
				],
				"checkDate" : [LIB.formRuleMgr.length()],
				"disable" : [LIB.formRuleMgr.length()],
				"num" : [LIB.formRuleMgr.length()],
				"status" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		},
		selectModel : {
			userSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			tpaCheckTableSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			tpaCheckPlanSelectModel : {
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
			"tpachecktableSelectModal":tpaCheckTableSelectModal,
			"tpacheckplanSelectModal":tpaCheckPlanSelectModal,
			
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
			doShowTpaCheckTableSelectModal : function() {
				this.selectModel.tpaCheckTableSelectModel.visible = true;
				//this.selectModel.tpaCheckTableSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveTpaCheckTable : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.tpaCheckTable = selectedDatas[0];
				}
			},
			doShowTpaCheckPlanSelectModal : function() {
				this.selectModel.tpaCheckPlanSelectModel.visible = true;
				//this.selectModel.tpaCheckPlanSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveTpaCheckPlan : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.tpaCheckPlan = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});