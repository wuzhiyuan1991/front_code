define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-tab-xl.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var ptwWorkCardSelectModal = require("componentsEx/selectTableModal/ptwWorkCardSelectModal");
	var ptwWorkPermitSelectModal = require("componentsEx/selectTableModal/ptwWorkPermitSelectModal");
	var ptwWorkTodoFormModal = require("componentsEx/formModal/ptwWorkTodoFormModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//编码
			code : null,
			//启用/禁用 0:启用,1:禁用
			disable : "0",
			//待办类型 1:作业评审,2:填写作业票,3:隔离实施,4:作业前气体检测,5:措施落实,6:作业会签,7:作业批准,8:安全教育,9:作业中气体检测,10:作业监控,11:隔离解除,12:作业关闭
			type : null,
			//完成时间
			completeTime : null,
			//状态 0:待执行,1:已执行
			status : null,
			//执行人
			operator : {id:'', name:''},
			//作业票
			workCard : {id:'', name:''},
			//作业许可
			workPermit : {id:'', name:''},
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
				"code" : [LIB.formRuleMgr.length(255)],
				"disable" :LIB.formRuleMgr.require("状态"),
				"type" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("待办类型")),
				"completeTime" : [LIB.formRuleMgr.allowStrEmpty],
				"status" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"operator.id" : [LIB.formRuleMgr.require("执行人")],
				"workCard.id" : [LIB.formRuleMgr.require("作业票")],
				"workPermit.id" : [LIB.formRuleMgr.allowStrEmpty],
	        }
		},
		tableModel : {
		},
		formModel : {
			ptwWorkTodoFormModel : {
				show : false,
				queryUrl : "ptwworktodo/{id}"
			}
		},
		cardModel : {
		},
		selectModel : {
			operatorSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			workCardSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			workPermitSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

		//无需附件上传请删除此段代码
		/*
		 fileModel:{
			 default : {
				 cfg: {
					 params: {
						 recordId: null,
						 dataType: 'XXX1', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
						 fileType: 'XX'    // 文件类型标识，需要根据数据库的注释进行对应的修改
					 }
				 },
				data : []
			 }
		 }
		 */

	};
	//Vue组件
	/**
	 *  请统一使用以下顺序配置Vue参数，方便codeview
	 *	 el
		 template
		 components
		 componentName
		 props
		 data
		 computed
		 watch
		 methods
			_XXX    			//内部方法
			doXXX 				//事件响应方法
			beforeInit 			//初始化之前回调
			afterInit			//初始化之后回调
			afterInitData		//请求 查询 接口后回调
			afterInitFileData   //请求 查询文件列表 接口后回调
			beforeDoSave		//请求 新增/更新 接口前回调，返回false时不进行保存操作
			afterFormValidate	//表单rule的校验通过后回调，，返回false时不进行保存操作
			buildSaveData		//请求 新增/更新 接口前回调，重新构造接口的参数
			afterDoSave			//请求 新增/更新 接口后回调
			beforeDoDelete		//请求 删除 接口前回调
			afterDoDelete		//请求 删除 接口后回调
		 events
		 vue组件声明周期方法
		 init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
	 **/
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailTabXlPanel],
		template: tpl,
		components : {
			"userSelectModal":userSelectModal,
			"ptwworkcardSelectModal":ptwWorkCardSelectModal,
			"ptwworkpermitSelectModal":ptwWorkPermitSelectModal,
			"ptwworktodoFormModal":ptwWorkTodoFormModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowOperatorSelectModal : function() {
				this.selectModel.operatorSelectModel.visible = true;
				//this.selectModel.operatorSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveOperator : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.operator = selectedDatas[0];
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
			doShowWorkPermitSelectModal : function() {
				this.selectModel.workPermitSelectModel.visible = true;
				//this.selectModel.workPermitSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveWorkPermit : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.workPermit = selectedDatas[0];
				}
			},
			doShowPtwWorkTodoFormModal4Update : function(data) {
				this.formModel.ptwWorkTodoFormModel.show = true;
				this.$refs.ptwworktodoFormModal.init("update", {id: this.mainModel.vo.id});
			},
			doUpdatePtwWorkTodo : function(data) {
				this.doUpdate(data);
			},

		},
		events : {
		},
    	init: function(){
        	this.$api = api;
        }
	});

	return detail;
});