define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./gasDetectionDetailFormModal.html");
	var ptwCatalogSelectModal = require("componentsEx/selectTableModal/ptwCatalogSelectModal");
	var gasDetectionRecordSelectModal = require("componentsEx/selectTableModal/gasDetectionRecordSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//数值
			value : null,
			//气体检测指标类型 1:有毒有害气体或蒸汽,2:可燃气体或蒸汽,3:氧气
			gasType : null,
			//启用/禁用 0:启用,1:禁用
			disable : "0",
			//气体类型
			gasCatalog : {id:'', name:''},
			//气体检测记录
			gasDetectionRecord : {id:'', name:''},
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
				"value" : [LIB.formRuleMgr.length(10)],
				"gasType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("气体检测指标类型")),
				"disable" :LIB.formRuleMgr.require("状态"),
				"gasCatalog.id" : [LIB.formRuleMgr.require("气体类型")],
				"gasDetectionRecord.id" : [LIB.formRuleMgr.require("气体检测记录")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			gasCatalogSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			gasDetectionRecordSelectModel : {
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
			"gasdetectionrecordSelectModal":gasDetectionRecordSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowGasCatalogSelectModal : function() {
				this.selectModel.gasCatalogSelectModel.visible = true;
				//this.selectModel.gasCatalogSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveGasCatalog : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.gasCatalog = selectedDatas[0];
				}
			},
			doShowGasDetectionRecordSelectModal : function() {
				this.selectModel.gasDetectionRecordSelectModel.visible = true;
				//this.selectModel.gasDetectionRecordSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveGasDetectionRecord : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.gasDetectionRecord = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});