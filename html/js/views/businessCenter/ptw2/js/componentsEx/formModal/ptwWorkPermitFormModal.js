define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./ptwWorkPermitFormModal.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var ptwCatalogSelectModal = require("componentsEx/selectTableModal/ptwCatalogSelectModal");
	var ptwCardTplSelectModal = require("componentsEx/selectTableModal/ptwCardTplSelectModal");
	var ptwWorkCardSelectModal = require("componentsEx/selectTableModal/ptwWorkCardSelectModal");
	var ptwJsaMasterSelectModal = require("componentsEx/selectTableModal/ptwJsaMasterSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//启用/禁用 0:启用,1:禁用
			disable : "0",
			//作业时限结束时间
			permitEndTime : null,
			//作业时限开始时间
			permitStartTime : null,
			//作业地点
			workPlace : null,
			//作业内容
			workContent : null,
			//是否需要主管部门负责人 0:不需要,1:需要
			enableDeptPrin : null,
			//是否启用电气隔离 0:否,1:是
			enableElectricIsolation : null,
			//是否启用气体检测 0:否,1:是
			enableGasDetection : null,
			//是否启用机械隔离 0:否,1:是
			enableMechanicalIsolation : null,
			//是否启用工艺隔离 0:否,1:是
			enableProcessIsolation : null,
			//是否需要生产单位现场负责人 0:不需要,1:需要
			enableProdPrin : null,
			//是否需要相关方负责人 0:不需要,1:需要
			enableRelPin : null,
			//是否需要安全教育人  0:不需要,1:需要
			enableSafetyEducator : null,
			//是否需要安全部门负责人 0:不需要,1:需要
			enableSecurityPrin : null,
			//是否需要监护人员 0:否,1:是
			enableSupervisor : null,
			//是否启用系统屏蔽 0:否,1:是
			enableSystemMask : null,
			//作业中气体检测模式 1:定期检查,2:持续检查
			gasCheckType : null,
			//许可证编号
			permitCode : null,
			//启用的个人防护设备类型id串
			ppeCatalogSetting : null,
			//备注
			remark : null,
			//作业结果 1:作业取消,2:作业完成,3:作业续签
			result : null,
			//序号（续签时重置，重新填报时更新）
			serialNum : null,
			//状态 1:填报作业票,2:现场落实,3:作业会签,4:作业批准,5:作业监测,6:待关闭,7:作业取消,8:作业完成,9:作业续签,10:被否决
			status : null,
			//作业许可有效期结束时间
			validityEndTime : null,
			//作业许可有效期开始时间
			validityStartTime : null,
			//版本号（续签时更新）
			versionNum : null,
			//作业所在设备
			workEquipment : null,
			//授权气体检测员
			gasInspector : {id:'', name:''},
			//作业类型
			workCatalog : {id:'', name:''},
			//作业票模板
			cardTpl : {id:'', name:''},
			//作业票
			workCard : {id:'', name:''},
			//工作安全分析
			jsaMaster : {id:'', name:''},
			//能量隔离
			workIsolations : [],
			//气体检测记录
			gasDetectionRecords : [],
			//作业许可风险库内容
			workStuffs : [],
			//监控记录
			superviseRecords : [],
			//作业许可相关人员
			workpeoplenel : [],
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
				"disable" :LIB.formRuleMgr.require("状态"),
				"permitEndTime" : [LIB.formRuleMgr.require("作业时限结束时间")],
				"permitStartTime" : [LIB.formRuleMgr.require("作业时限开始时间")],
				"workPlace" : [LIB.formRuleMgr.require("作业地点"),
						  LIB.formRuleMgr.length(200)
				],
				"workContent" : [LIB.formRuleMgr.require("作业内容"),
						  LIB.formRuleMgr.length(500)
				],
				"enableDeptPrin" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"enableElectricIsolation" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"enableGasDetection" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"enableMechanicalIsolation" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"enableProcessIsolation" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"enableProdPrin" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"enableRelPin" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"enableSafetyEducator" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"enableSecurityPrin" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"enableSupervisor" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"enableSystemMask" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"gasCheckType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"permitCode" : [LIB.formRuleMgr.length(10)],
				"ppeCatalogSetting" : [LIB.formRuleMgr.length(65535)],
				"remark" : [LIB.formRuleMgr.length(500)],
				"result" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"serialNum" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"status" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"validityEndTime" : [LIB.formRuleMgr.allowStrEmpty],
				"validityStartTime" : [LIB.formRuleMgr.allowStrEmpty],
				"versionNum" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"workEquipment" : [LIB.formRuleMgr.length(200)],
				"gasInspector.id" : [LIB.formRuleMgr.allowStrEmpty],
				"workCatalog.id" : [LIB.formRuleMgr.require("作业类型")],
				"cardTpl.id" : [LIB.formRuleMgr.allowStrEmpty],
				"workCard.id" : [LIB.formRuleMgr.allowStrEmpty],
				"jsaMaster.id" : [LIB.formRuleMgr.allowStrEmpty],
	        },
	        emptyRules:{}
		},
		selectModel : {
			gasInspectorSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			workCatalogSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			cardTplSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			workCardSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			jsaMasterSelectModel : {
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
			"ptwcatalogSelectModal":ptwCatalogSelectModal,
			"ptwcardtplSelectModal":ptwCardTplSelectModal,
			"ptwworkcardSelectModal":ptwWorkCardSelectModal,
			"ptwjsamasterSelectModal":ptwJsaMasterSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowGasInspectorSelectModal : function() {
				this.selectModel.gasInspectorSelectModel.visible = true;
				//this.selectModel.gasInspectorSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveGasInspector : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.gasInspector = selectedDatas[0];
				}
			},
			doShowWorkCatalogSelectModal : function() {
				this.selectModel.workCatalogSelectModel.visible = true;
				//this.selectModel.workCatalogSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveWorkCatalog : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.workCatalog = selectedDatas[0];
				}
			},
			doShowCardTplSelectModal : function() {
				this.selectModel.cardTplSelectModel.visible = true;
				//this.selectModel.cardTplSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveCardTpl : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.cardTpl = selectedDatas[0];
				}
			},
			doShowWorkCardSelectModal : function() {
				this.selectModel.workCardSelectModel.visible = true;
				//this.selectModel.workCardSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveWorkCard : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.workCard = selectedDatas[0];
				}
			},
			doShowJsaMasterSelectModal : function() {
				this.selectModel.jsaMasterSelectModel.visible = true;
				//this.selectModel.jsaMasterSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveJsaMaster : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.jsaMaster = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});