define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var asmtPlanSelectModal = require("componentsEx/selectTableModal/asmtPlanSelectModal");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
			//id
			id : null,
			//状态 0:未完成,1:已完成
			status : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//自评计划
			asmtPlan : {id:'', name:''},
			//自评人
			user : {id:'', name:''},
		}
	};
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
			
			//验证规则
	        rules:{
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"status" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		},
		tableModel : {
		},
		formModel : {
		},
		cardModel : {
		},
		selectModel : {
			asmtPlanSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			userSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	//Vue组件
	/**
	 *  请统一使用以下顺序配置Vue参数，方便codeview
	 *	el
	 template
	 components
	 componentName
	 props
	 data
	 computed
	 watch
	 methods
	 events
	 vue组件声明周期方法
	 created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
	 **/
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
		template: tpl,
		components : {
			"asmtplanSelectModal":asmtPlanSelectModal,
			"userSelectModal":userSelectModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowAsmtPlanSelectModal : function() {
				this.selectModel.asmtPlanSelectModel.visible = true;
				//this.selectModel.asmtPlanSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveAsmtPlan : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.asmtPlan = selectedDatas[0];
				}
			},
			doShowUserSelectModal : function() {
				this.selectModel.userSelectModel.visible = true;
				//this.selectModel.userSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveUser : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.user = selectedDatas[0];
				}
			},

		},
		events : {
		},
        ready: function(){
        	this.$api = api;
        }
	});

	return detail;
});