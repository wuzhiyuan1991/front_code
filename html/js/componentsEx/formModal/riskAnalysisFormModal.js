define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./riskAnalysisFormModal.html");
	var exerciseSchemeSelectModal = require("componentsEx/selectTableModal/exerciseSchemeSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//事故类型
			accidentPattern : null,
			//可能发生的次生/衍生事故
			possibleDerivativeAccidents : null,
			//可能发生的装置
			possibleEquipments : null,
			//可能发生的地点
			possibleLocations : null,
			//可能发生的场景
			possibleScenarios : null,
			//可能发生的征兆
			possibleSigns : null,
			//演练方案
			exerciseScheme : {id:'', name:''},
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
				"code" : [LIB.formRuleMgr.length(100)],
				"disable" :LIB.formRuleMgr.require("状态"),
				"accidentPattern" : [LIB.formRuleMgr.length(100),LIB.formRuleMgr.require("事故类型")],
				"possibleDerivativeAccidents" : [LIB.formRuleMgr.length(500),LIB.formRuleMgr.require("可能发生的次生/衍生事故")],
				"possibleEquipments" : [LIB.formRuleMgr.length(500),LIB.formRuleMgr.require("可能发生的装置")],
				"possibleLocations" : [LIB.formRuleMgr.length(200),LIB.formRuleMgr.require("可能发生的地点")],
				"possibleScenarios" : [LIB.formRuleMgr.length(500),LIB.formRuleMgr.require("可能发生的场景")],
				"possibleSigns" : [LIB.formRuleMgr.length(500),LIB.formRuleMgr.require("可能发生的征兆")],
				"exerciseScheme.id" : [LIB.formRuleMgr.require("演练方案")],
	        },
	        emptyRules:{}
		},
		rows:6,
		selectModel : {
			exerciseSchemeSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"exerciseschemeSelectModal":exerciseSchemeSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowExerciseSchemeSelectModal : function() {
				this.selectModel.exerciseSchemeSelectModel.visible = true;
				//this.selectModel.exerciseSchemeSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveExerciseScheme : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.exerciseScheme = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});