define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./riCheckPlanFormModal.html");
	var riCheckPlanSettingSelectModal = require("componentsEx/selectTableModal/riCheckPlanSettingSelectModal");
	var riCheckTableSelectModal = require("componentsEx/selectTableModal/riCheckTableSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//计划名
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
			//是否按秩序执行检查 0:否,1:是
			checkInOrder : null,
			//频率类型 0:执行一次,1:重复执行
			checkType : null,
			//备注
			remarks : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//巡检计划配置
			riCheckPlanSetting : {id:'', name:''},
			//巡检表
			riCheckTable : {id:'', name:''},
			//巡检记录
			riCheckRecords : [],
			//巡检任务
			riCheckTasks : [],
			//检查人
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
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"code" : [LIB.formRuleMgr.length()],
				"name" : [LIB.formRuleMgr.require("计划名"),
						  LIB.formRuleMgr.length()
				],
				"disable" : LIB.formRuleMgr.range(1, 100).concat(LIB.formRuleMgr.require("状态")),
				"endDate" : [LIB.formRuleMgr.require("结束时间"),
						  LIB.formRuleMgr.length()
				],
				"startDate" : [LIB.formRuleMgr.require("开始时间"),
						  LIB.formRuleMgr.length()
				],
				"checkInOrder" : LIB.formRuleMgr.range(1, 100),
				"checkType" : LIB.formRuleMgr.range(1, 100),
				"remarks" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		},
		selectModel : {
			riCheckPlanSettingSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			riCheckTableSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"richeckplansettingSelectModal":riCheckPlanSettingSelectModal,
			"richecktableSelectModal":riCheckTableSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowRiCheckPlanSettingSelectModal : function() {
				this.selectModel.riCheckPlanSettingSelectModel.visible = true;
				//this.selectModel.riCheckPlanSettingSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveRiCheckPlanSetting : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.riCheckPlanSetting = selectedDatas[0];
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
			
		}
	});
	
	return detail;
});