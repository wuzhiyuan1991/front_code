define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./riCheckTaskFormModal.html");
	var riCheckPlanSelectModal = require("componentsEx/selectTableModal/riCheckPlanSelectModal");
	var riCheckTableSelectModal = require("componentsEx/selectTableModal/riCheckTableSelectModal");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//
			code : null,
			//巡检任务名称
			name : null,
			//禁用标识 0:未禁用,1:已禁用
			disable : null,
			//结束时间
			endDate : null,
			//开始时间
			startDate : null,
			//所属公司id
			compId : null,
			//所属部门id
			orgId : null,
			//实际完成时间
			checkDate : null,
			//任务序号
			num : null,
			//任务状态 0:未到期,1:,待执行,2:按期执行,3:超期执行,4:未执行,5:已失效
			status : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//巡检计划
			riCheckPlan : {id:'', name:''},
			//巡检表
			riCheckTable : {id:'', name:''},
			//检查人
			user : {id:'', name:''},
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
				"name" : [LIB.formRuleMgr.length()],
				"disable" : LIB.formRuleMgr.range(1, 100).concat(LIB.formRuleMgr.require("状态")),
				"endDate" : [LIB.formRuleMgr.require("结束时间"),
						  LIB.formRuleMgr.length()
				],
				"startDate" : [LIB.formRuleMgr.require("开始时间"),
						  LIB.formRuleMgr.length()
				],
				"num" : LIB.formRuleMgr.range(1, 100),
				"status" : LIB.formRuleMgr.range(1, 100),	
	        },
	        emptyRules:{}
		},
		selectModel : {
			riCheckPlanSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			riCheckTableSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			userSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"richeckplanSelectModal":riCheckPlanSelectModal,
			"richecktableSelectModal":riCheckTableSelectModal,
			"userSelectModal":userSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowRiCheckPlanSelectModal : function() {
				this.selectModel.riCheckPlanSelectModel.visible = true;
				//this.selectModel.riCheckPlanSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveRiCheckPlan : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.riCheckPlan = selectedDatas[0];
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
			doShowUserSelectModal : function() {
				this.selectModel.userSelectModel.visible = true;
				//this.selectModel.userSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveUser : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.user = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});