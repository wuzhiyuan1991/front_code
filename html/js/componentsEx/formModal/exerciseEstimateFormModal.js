define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./exerciseEstimateFormModal.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var exerciseSchemeSelectModal = require("componentsEx/selectTableModal/exerciseSchemeSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//预案或方案要求
			demand : null,
			//演练时间（默认演练方案时间）
			exerciseDate : null,
			//评估项目(默认为演练方案的演练科目)
			subjects : null,
			//评估人
			user : {id:'', name:''},
			//演练方案
			exerciseScheme : {id:'', name:''},
			//评估详情
			exerciseEstimateDetails : [],
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
				"demand" : [LIB.formRuleMgr.require("预案或方案要求"),
						  LIB.formRuleMgr.length(2000)
				],
				"exerciseDate" : [LIB.formRuleMgr.require("演练时间（默认演练方案时间）")],
				"subjects" : [LIB.formRuleMgr.require("评估项目(默认为演练方案的演练科目)"),
						  LIB.formRuleMgr.length(200)
				],
				"user.id" : [LIB.formRuleMgr.require("评估人")],
				"exerciseScheme.id" : [LIB.formRuleMgr.require("演练方案")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			userSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
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
			"userSelectModal":userSelectModal,
			"exerciseschemeSelectModal":exerciseSchemeSelectModal,
			
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