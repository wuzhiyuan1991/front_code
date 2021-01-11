define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	// var asmtItemFormModal = require("componentsEx/formModal/asmtItemFormModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//id
			id : null,
			//编码
			code : null,
			//自评表名称
			name : null,
			//自评表类型 暂时不用
			type : null,
			//
			compId : null,
			//组织id
			orgId : null,
			//是否禁用 0启用,1禁用
			disable : null,
			//备注
			remarks : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//自评项
			asmtItems : [],
			//自评计划
			asmtPlans : [],
		}
	};
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
            disableList:[{id:"0",name:"启用"},{id:"1",name:"停用"}],
			//验证规则
	        rules:{
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"code" : [LIB.formRuleMgr.length()],
				"name" : [LIB.formRuleMgr.require("自评表名称"),
						  LIB.formRuleMgr.length()
				],
				"type" : [LIB.formRuleMgr.require("自评表类型"),
						  LIB.formRuleMgr.length()
				],
				"disable" : [LIB.formRuleMgr.length()],
				"remarks" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		},
		tableModel : {
			asmtItemTableModel : {
				url : "asmttable/asmtitems/list/{curPage}/{pageSize}",
				columns : [{
					title : "编码",
					fieldName : "code"
				},{
					title : "名称",
					fieldName : "name",
				},{
					title : "",
					fieldType : "tool",
					toolType : "edit,del"
				}]
			},
			asmtPlanTableModel : {
				url : "asmttable/asmtplans/list/{curPage}/{pageSize}",
				columns : [{
					title : "编码",
					fieldName : "code"
				},{
					title : "名称",
					fieldName : "name",
				},{
					title : "",
					fieldType : "tool",
					toolType : "edit,del"
				}]
			},
		},
		formModel : {
			asmtItemFormModel : {
				show : false,
				queryUrl : "asmttable/{id}/asmtitem/{asmtItemId}"
			},
			asmtPlanFormModel : {
				show : false,
				queryUrl : "asmttable/{id}/asmtplan/{asmtPlanId}"
			},
		},
		cardModel : {
			asmtItemCardModel : {
				showContent : true
			},
			asmtPlanCardModel : {
				showContent : true
			},
		},
		selectModel : {
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
			// "asmtitemFormModal":asmtItemFormModal,
			// "asmtplanFormModal":asmtPlanFormModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			// doShowAsmtItemFormModal4Update : function(param) {
			// 	this.formModel.asmtItemFormModel.show = true;
			// 	this.$refs.asmtitemFormModal.init("update", {id: this.mainModel.vo.id, asmtItemId: param.entry.data.id});
			// },
			// doShowAsmtItemFormModal4Create : function(param) {
			// 	this.formModel.asmtItemFormModel.show = true;
			// 	this.$refs.asmtitemFormModal.init("create");
			// },
			// doSaveAsmtItem : function(data) {
			// 	if (data) {
			// 		var _this = this;
			// 		api.saveAsmtItem({id : this.mainModel.vo.id}, data).then(function() {
			// 			_this.refreshTableData(_this.$refs.asmtitemTable);
			// 		});
			// 	}
			// },
			// doUpdateAsmtItem : function(data) {
			// 	if (data) {
			// 		var _this = this;
			// 		api.updateAsmtItem({id : this.mainModel.vo.id}, data).then(function() {
			// 			_this.refreshTableData(_this.$refs.asmtitemTable);
			// 		});
			// 	}
			// },
			// doRemoveAsmtItems : function(item) {
			// 	var _this = this;
			// 	var data = item.entry.data;
			// 	api.removeAsmtItems({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
			// 		_this.$refs.asmtitemTable.doRefresh();
			// 	});
			// },
			// doShowAsmtPlanFormModal4Update : function(param) {
			// 	this.formModel.asmtPlanFormModel.show = true;
			// 	this.$refs.asmtplanFormModal.init("update", {id: this.mainModel.vo.id, asmtPlanId: param.entry.data.id});
			// },
			// doShowAsmtPlanFormModal4Create : function(param) {
			// 	this.formModel.asmtPlanFormModel.show = true;
			// 	this.$refs.asmtplanFormModal.init("create");
			// },
			// doSaveAsmtPlan : function(data) {
			// 	if (data) {
			// 		var _this = this;
			// 		api.saveAsmtPlan({id : this.mainModel.vo.id}, data).then(function() {
			// 			_this.refreshTableData(_this.$refs.asmtplanTable);
			// 		});
			// 	}
			// },
			// doUpdateAsmtPlan : function(data) {
			// 	if (data) {
			// 		var _this = this;
			// 		api.updateAsmtPlan({id : this.mainModel.vo.id}, data).then(function() {
			// 			_this.refreshTableData(_this.$refs.asmtplanTable);
			// 		});
			// 	}
			// },
			// doRemoveAsmtPlans : function(item) {
			// 	var _this = this;
			// 	var data = item.entry.data;
			// 	api.removeAsmtPlans({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
			// 		_this.$refs.asmtplanTable.doRefresh();
			// 	});
			// },
			// afterInitData : function() {
			// 	this.$refs.asmtitemTable.doQuery({id : this.mainModel.vo.id});
			// 	this.$refs.asmtplanTable.doQuery({id : this.mainModel.vo.id});
			// },
			// beforeInit : function() {
			// 	// this.$refs.asmtitemTable.doClearData();
			// 	// this.$refs.asmtplanTable.doClearData();
			// },

		},
		events : {
		},
        ready: function(){
        	this.$api = api;
        }
	});

	return detail;
});