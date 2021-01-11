define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./exerciseParticipantFormModal.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var exerciseSchemeSelectModal = require("componentsEx/selectTableModal/exerciseSchemeSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//姓名
			name : null,
			//是否内部人员 1:内部人员,0:外部人员
			isInsider : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//人员类型 1:演练负责人,2:参演人员,3:评价人员,4:观摩人员
			type : null,
			//联系方式
			mobile : null,
			//机构
			organization : null,
			//职务
			position : null,
			//内部人员
			user : {id:'', name:''},
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
				"name" : [LIB.formRuleMgr.length(50),LIB.formRuleMgr.require("姓名")],
				"isInsider" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("是否内部人员")),
				"disable" :LIB.formRuleMgr.require("状态"),
				"type" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("人员类型")),
				"mobile" : [LIB.formRuleMgr.length(50)],
				"organization" : [LIB.formRuleMgr.length(100)],
				"position" : [LIB.formRuleMgr.length(50)],
				"user.id" : [LIB.formRuleMgr.allowStrEmpty],
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