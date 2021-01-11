define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-tab-xl.html");
	var opEmerStepFormModal = require("componentsEx/formModal/opEmerStepFormModal");
	var opStdStepFormModal = require("componentsEx/formModal/opStdStepFormModal");
	var opMaintStepFormModal = require("componentsEx/formModal/opMaintStepFormModal");
	var opCardFormModal = require("componentsEx/formModal/opCardFormModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//唯一标识
			code : null,
			//卡票名称
			name : null,
			//专业
			specialityType : null,
			//禁用标识 0未禁用，1已禁用
			disable : null,
			//所属部门id
			orgId : null,
			//卡票类型 1:操作票,2:维检修作业卡,3:应急处置卡
			type : null,
			//审核状态 0:待提交,1:待审核,2:已审核
			status : null,
			//所属公司id
			compId : null,
			//审核时间（已审核状态独有）
			auditDate : null,
			//检修内容/操作流程
			content : null,
			//设备设施名称（维检修作业卡独有）
			equipName : null,
			//备注
			remarks : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//应急处置步骤
			opEmerSteps : [],
			//操作票操作步骤
			opStdSteps : [],
			//维检修工序
			opMaintSteps : [],
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
				"code" : [LIB.formRuleMgr.require("唯一标识"),
						  LIB.formRuleMgr.length()
				],
				"name" : [LIB.formRuleMgr.require("卡票名称"),
						  LIB.formRuleMgr.length()
				],
				"specialityType" : LIB.formRuleMgr.range(1, 100).concat(LIB.formRuleMgr.require("专业")),
				"disable" :LIB.formRuleMgr.require("状态"),
				"type" : LIB.formRuleMgr.range(1, 100).concat(LIB.formRuleMgr.require("卡票类型")),
				"status" : LIB.formRuleMgr.range(1, 100).concat(LIB.formRuleMgr.require("审核状态")),
				"content" : [LIB.formRuleMgr.length()],
				"equipName" : [LIB.formRuleMgr.length()],
				"remarks" : [LIB.formRuleMgr.length()],
	        }
		},
		tableModel : {
			opEmerStepTableModel : LIB.Opts.extendDetailTableOpt({
				url : "opcard/opemersteps/list/{curPage}/{pageSize}?criteria.orderValue.fieldName=orderNo&criteria.orderValue.orderType=0",
				columns : [
					LIB.tableMgr.ksColumn.code,
				{
					title : "名称",
					fieldName : "name",
					keywordFilterName: "criteria.strValue.keyWordValue_name"
				},{
					title : "",
					fieldType : "tool",
					toolType : "move,edit,del"
				}]
			}),
			opStdStepTableModel : LIB.Opts.extendDetailTableOpt({
				url : "opcard/opstdsteps/list/{curPage}/{pageSize}?criteria.orderValue.fieldName=orderNo&criteria.orderValue.orderType=0",
				columns : [
					LIB.tableMgr.ksColumn.code,
				{
					title : "名称",
					fieldName : "name",
					keywordFilterName: "criteria.strValue.keyWordValue_name"
				},{
					title : "",
					fieldType : "tool",
					toolType : "move,edit,del"
				}]
			}),
			opMaintStepTableModel : LIB.Opts.extendDetailTableOpt({
				url : "opcard/opmaintsteps/list/{curPage}/{pageSize}?criteria.orderValue.fieldName=orderNo&criteria.orderValue.orderType=0",
				columns : [
					LIB.tableMgr.ksColumn.code,
				{
					title : "名称",
					fieldName : "name",
					keywordFilterName: "criteria.strValue.keyWordValue_name"
				},{
					title : "",
					fieldType : "tool",
					toolType : "move,edit,del"
				}]
			}),
		},
		formModel : {
			opEmerStepFormModel : {
				show : false,
				hiddenFields : ["cardId"],
				queryUrl : "opcard/{id}/opemerstep/{opEmerStepId}"
			},
			opStdStepFormModel : {
				show : false,
				hiddenFields : ["cardId"],
				queryUrl : "opcard/{id}/opstdstep/{opStdStepId}"
			},
			opMaintStepFormModel : {
				show : false,
				hiddenFields : ["cardId"],
				queryUrl : "opcard/{id}/opmaintstep/{opMaintStepId}"
			},
			opCardFormModel : {
				show : false,
				queryUrl : "opcard/{id}"
			}
		},
		cardModel : {
			opEmerStepCardModel : {
				showContent : true
			},
			opStdStepCardModel : {
				showContent : true
			},
			opMaintStepCardModel : {
				showContent : true
			},
		},
		selectModel : {
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
			"opemerstepFormModal":opEmerStepFormModal,
			"opstdstepFormModal":opStdStepFormModal,
			"opmaintstepFormModal":opMaintStepFormModal,
			"opcardFormModal":opCardFormModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowOpEmerStepFormModal4Update : function(param) {
				this.formModel.opEmerStepFormModel.show = true;
				this.$refs.opemerstepFormModal.init("update", {id: this.mainModel.vo.id, opEmerStepId: param.entry.data.id});
			},
			doShowOpEmerStepFormModal4Create : function(param) {
				this.formModel.opEmerStepFormModel.show = true;
				this.$refs.opemerstepFormModal.init("create");
			},
			doSaveOpEmerStep : function(data) {
				if (data) {
					var _this = this;
					api.saveOpEmerStep({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.opemerstepTable);
					});
				}
			},
			doUpdateOpEmerStep : function(data) {
				if (data) {
					var _this = this;
					api.updateOpEmerStep({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.opemerstepTable);
					});
				}
			},
			doRemoveOpEmerSteps : function(item) {
				var _this = this;
				var data = item.entry.data;
				api.removeOpEmerSteps({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					_this.$refs.opemerstepTable.doRefresh();
				});
			},
			doMoveOpEmerSteps : function(item) {
				var _this = this;
				var data = item.entry.data;
				var param = {
					id : data.id,
					cardId : dataModel.mainModel.vo.id
				};
				_.set(param, "criteria.intValue.offset", item.offset);
				api.moveOpEmerSteps({id : this.mainModel.vo.id}, param).then(function() {
					_this.$refs.opemerstepTable.doRefresh();
				});
			},
			doShowOpStdStepFormModal4Update : function(param) {
				this.formModel.opStdStepFormModel.show = true;
				this.$refs.opstdstepFormModal.init("update", {id: this.mainModel.vo.id, opStdStepId: param.entry.data.id});
			},
			doShowOpStdStepFormModal4Create : function(param) {
				this.formModel.opStdStepFormModel.show = true;
				this.$refs.opstdstepFormModal.init("create");
			},
			doSaveOpStdStep : function(data) {
				if (data) {
					var _this = this;
					api.saveOpStdStep({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.opstdstepTable);
					});
				}
			},
			doUpdateOpStdStep : function(data) {
				if (data) {
					var _this = this;
					api.updateOpStdStep({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.opstdstepTable);
					});
				}
			},
			doRemoveOpStdSteps : function(item) {
				var _this = this;
				var data = item.entry.data;
				api.removeOpStdSteps({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					_this.$refs.opstdstepTable.doRefresh();
				});
			},
			doMoveOpStdSteps : function(item) {
				var _this = this;
				var data = item.entry.data;
				var param = {
					id : data.id,
					cardId : dataModel.mainModel.vo.id
				};
				_.set(param, "criteria.intValue.offset", item.offset);
				api.moveOpStdSteps({id : this.mainModel.vo.id}, param).then(function() {
					_this.$refs.opstdstepTable.doRefresh();
				});
			},
			doShowOpMaintStepFormModal4Update : function(param) {
				this.formModel.opMaintStepFormModel.show = true;
				this.$refs.opmaintstepFormModal.init("update", {id: this.mainModel.vo.id, opMaintStepId: param.entry.data.id});
			},
			doShowOpMaintStepFormModal4Create : function(param) {
				this.formModel.opMaintStepFormModel.show = true;
				this.$refs.opmaintstepFormModal.init("create");
			},
			doSaveOpMaintStep : function(data) {
				if (data) {
					var _this = this;
					api.saveOpMaintStep({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.opmaintstepTable);
					});
				}
			},
			doUpdateOpMaintStep : function(data) {
				if (data) {
					var _this = this;
					api.updateOpMaintStep({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.opmaintstepTable);
					});
				}
			},
			doRemoveOpMaintSteps : function(item) {
				var _this = this;
				var data = item.entry.data;
				api.removeOpMaintSteps({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					_this.$refs.opmaintstepTable.doRefresh();
				});
			},
			doMoveOpMaintSteps : function(item) {
				var _this = this;
				var data = item.entry.data;
				var param = {
					id : data.id,
					cardId : dataModel.mainModel.vo.id
				};
				_.set(param, "criteria.intValue.offset", item.offset);
				api.moveOpMaintSteps({id : this.mainModel.vo.id}, param).then(function() {
					_this.$refs.opmaintstepTable.doRefresh();
				});
			},
			doShowOpCardFormModal4Update : function(data) {
				this.formModel.opCardFormModel.show = true;
				this.$refs.opcardFormModal.init("update", {id: this.mainModel.vo.id});
			},
			doUpdateOpCard : function(data) {
				this.doUpdate(data);
			},
			afterInitData : function() {
				this.$refs.opemerstepTable.doQuery({id : this.mainModel.vo.id});
				this.$refs.opstdstepTable.doQuery({id : this.mainModel.vo.id});
				this.$refs.opmaintstepTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.opemerstepTable.doClearData();
				this.$refs.opstdstepTable.doClearData();
				this.$refs.opmaintstepTable.doClearData();
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