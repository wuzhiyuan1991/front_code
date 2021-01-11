define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./mrsEquipMaintRecordFormModal.html");
	var mrsEquipmentSelectModal = require("componentsEx/selectTableModal/mrsEquipmentSelectModal");
	var majorRiskSourceSelectModal = require("src/main/webapp/html/js/componentsEx/selectTableModal/majorRiskSourceEquipmentSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//维护/保养数量
			maintQuantity : null,
			//作业类别 1:内部,2:外部
			operationType : null,
			//操作内容
			operationContent : null,
			//启用/禁用 0:启用,1:禁用
			disable : "0",
			//设备类型 1:设备,2:管道,3:监控系统
			mrsEquipmentType : null,
			//维护/保养时间
			maintTime : null,
			//作业阶段 1:检修抢修,2:维护保养,3:检验检测
			phase : null,
			//所属公司id
			compId : null,
			//所属部门id
			orgId : null,
			//作业操作人员
			operators : null,
			//重大危险源
			mrsEquipment : {id:'', name:''},
			//重大危险源
			majorRiskSource : {id:'', name:''},
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
				"maintQuantity" : [LIB.formRuleMgr.length(10)],
				"operationType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("作业类别")),
				"operationContent" : [LIB.formRuleMgr.require("操作内容"),
						  LIB.formRuleMgr.length(500)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"mrsEquipmentType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("设备类型")),
				"maintTime" : [LIB.formRuleMgr.require("维护/保养时间")],
				"phase" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("作业阶段")),
				"compId" : [LIB.formRuleMgr.require("所属公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"operators" : [LIB.formRuleMgr.length(100)],
				"mrsEquipment.id" : [LIB.formRuleMgr.require("重大危险源")],
				"majorRiskSource.id" : [LIB.formRuleMgr.require("重大危险源")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			mrsEquipmentSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			majorRiskSourceSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"mrsequipmentSelectModal":mrsEquipmentSelectModal,
			"majorrisksourceSelectModal":majorRiskSourceSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowMrsEquipmentSelectModal : function() {
				this.selectModel.mrsEquipmentSelectModel.visible = true;
				//this.selectModel.mrsEquipmentSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveMrsEquipment : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.mrsEquipment = selectedDatas[0];
				}
			},
			doShowMajorRiskSourceSelectModal : function() {
				this.selectModel.majorRiskSourceSelectModel.visible = true;
				//this.selectModel.majorRiskSourceSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveMajorRiskSource : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.majorRiskSource = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});