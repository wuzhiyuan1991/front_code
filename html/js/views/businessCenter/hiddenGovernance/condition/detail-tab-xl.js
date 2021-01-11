define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-tab-xl.html");
	var activitiModelerSelectModal = require("componentsEx/selectTableModal/activitiModelerSelectModal");
	var activitiConditionFormModal = require("componentsEx/formModal/activitiConditionFormModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
			//
			id : null,
			//编码
			code : null,
			//名称
			name : null,
			//公司id
			compId : null,
			//部门id
			orgId : null,
			//禁用标识
			disable : null,
			//表达式
			express : null,
			//修改时间
			modifyDate : null,
			//创建时间
			createDate : null,
			//工作流程
			activitiModeler : {id:'', name:''},
		}
	};
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
			showActivitiModelerSelectModal : false,

			//验证规则
	        rules:{
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"code" : [LIB.formRuleMgr.length()],
				"name" : [LIB.formRuleMgr.length()],
				"disable" : [LIB.formRuleMgr.length()],
				"express" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		},
		tableModel : {
		},
		formModel : {
			activitiConditionFormModel : {
				show : false,
				queryUrl : "activiticondition/{id}"
			}
		},
		cardModel : {
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
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailTabXlPanel],
		template: tpl,
		components : {
			"activitimodelerSelectModal":activitiModelerSelectModal,
			"activiticonditionFormModal":activitiConditionFormModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doSaveActivitiModeler : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.activitiModeler = selectedDatas[0];
				}
			},
			doShowActivitiConditionFormModal4Update : function(data) {
				this.formModel.activitiConditionFormModel.show = true;
				this.$refs.activiticonditionFormModal.init("update", {id: this.mainModel.vo.id});
			},
			doUpdateActivitiCondition : function(data) {
				this.doUpdate(data);
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