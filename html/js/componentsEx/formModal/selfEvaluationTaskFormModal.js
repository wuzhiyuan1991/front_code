define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./selfEvaluationTaskFormModal.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var exerciseSchemeSelectModal = require("componentsEx/selectTableModal/exerciseSchemeSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//状态 0:未提交,1:已提交
			status : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//所属公司id
			compId : null,
			//所属部门id
			orgId : null,
			//提交时间
			submitTime : null,
			//自评人
			user : {id:'', name:''},
			//演练方案
			exerciseScheme : {id:'', name:''},
			//自评详情
			selfEvaluationDetails : [],
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
				"status" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("状态")),
				"disable" :LIB.formRuleMgr.require("状态"),
				"compId" : [LIB.formRuleMgr.require("所属公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"submitTime" : [LIB.formRuleMgr.allowStrEmpty],
				"user.id" : [LIB.formRuleMgr.require("自评人")],
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