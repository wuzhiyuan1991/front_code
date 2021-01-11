define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./tpaCheckPlanFormModal.html");
	var tpaCheckTableSelectModal = require("componentsEx/selectTableModal/tpaCheckTableSelectModal");
	var tpaBoatEquipmentSelectModal = require("componentsEx/selectTableModal/tpaBoatEquipmentSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//id
			id : null,
			//编码
			code : null,
			//计划名
			name : null,
			//计划类型 0:无意义，1::工作计划 ，2:巡检计划
			planType : null,
			//结束时间
			endDate : null,
			//开始时间
			startDate : null,
			//
			compId : null,
			//组织id
			orgId : null,
			//频率类型 0执行一次 1重复执行
			checkType : null,
			//是否禁用 0启用,1禁用
			disable : null,
			//检查频率
			frequency : null,
			//检查频率类型
			frequencyType : null,
			//备注
			remarks : null,
			//专业 1设备工艺 2自控 3通信 4压缩机 5安全环保 6综合文控 7物资 8应急 9车辆 10电气 11线路 12阴保
			specialty : null,
			//检查计划类型 10 证书类 20资料类
			type : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//检查表
			tpaCheckTable : {id:'', name:''},
			//船舶设备设施
			tpaBoatEquipment : {id:'', name:''},
			//检查任务
			tpaCheckTasks : [],
			//计划人员关系表
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
				"planType" : [LIB.formRuleMgr.require("计划类型"),
						  LIB.formRuleMgr.length()
				],
				"endDate" : [LIB.formRuleMgr.require("结束时间"),
						  LIB.formRuleMgr.length()
				],
				"startDate" : [LIB.formRuleMgr.require("开始时间"),
						  LIB.formRuleMgr.length()
				],
				"checkType" : [LIB.formRuleMgr.length()],
				"disable" : [LIB.formRuleMgr.length()],
				"frequency" : [LIB.formRuleMgr.length()],
				"frequencyType" : [LIB.formRuleMgr.length()],
				"remarks" : [LIB.formRuleMgr.length()],
				"specialty" : [LIB.formRuleMgr.length()],
				"type" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		},
		selectModel : {
			tpaCheckTableSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			tpaBoatEquipmentSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"tpachecktableSelectModal":tpaCheckTableSelectModal,
			"tpaboatequipmentSelectModal":tpaBoatEquipmentSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowTpaCheckTableSelectModal : function() {
				this.selectModel.tpaCheckTableSelectModel.visible = true;
				//this.selectModel.tpaCheckTableSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveTpaCheckTable : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.tpaCheckTable = selectedDatas[0];
				}
			},
			doShowTpaBoatEquipmentSelectModal : function() {
				this.selectModel.tpaBoatEquipmentSelectModel.visible = true;
				//this.selectModel.tpaBoatEquipmentSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveTpaBoatEquipment : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.tpaBoatEquipment = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});