define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./ptwCardTplFormModal.html");
	var ptwCatalogSelectModal = require("componentsEx/selectTableModal/ptwCatalogSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//作业票模板名称
			name : null,
			//启用/禁用 0:启用,1:禁用
			disable : "0",
			//公司Id
			compId : null,
			//部门Id
			orgId : null,
			//字段启用禁用设置(json)
			columnSetting : null,
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
			//是否需要监护人员 0:不需要,1:需要
			enableSupervisor : null,
			//是否启用系统屏蔽 0:否,1:是
			enableSystemMask : null,
			//启用的个人防护设备类型id串
			ppeCatalogSetting : null,
			//作业类型
			workCatalog : {id:'', name:''},
			//作业票模板风险库内容
			ptwCardStuffs : [],
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
				"name" : [LIB.formRuleMgr.require("作业票模板名称"),
						  LIB.formRuleMgr.length(200)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"compId" : [LIB.formRuleMgr.require("公司")],
				"orgId" : [LIB.formRuleMgr.require("部门"),
						  LIB.formRuleMgr.length(10)
				],
				"columnSetting" : [LIB.formRuleMgr.length(1000)],
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
				"ppeCatalogSetting" : [LIB.formRuleMgr.length(500)],
				"workCatalog.id" : [LIB.formRuleMgr.require("作业类型")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			workCatalogSelectModel : {
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
			
		}
	});
	
	return detail;
});