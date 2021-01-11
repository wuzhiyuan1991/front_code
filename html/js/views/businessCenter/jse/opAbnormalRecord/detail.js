define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var opCardSelectModal = require("componentsEx/selectTableModal/opCardSelectModal");
	var opMaintRecordDetailFormModal = require("componentsEx/formModal/opMaintRecordDetailFormModal");
	var opStdRecordDetailFormModal = require("componentsEx/formModal/opStdRecordDetailFormModal");
	var principalSelectModal = require("componentsEx/selectTableModal/principalSelectModal");
	var supervisorSelectModal = require("componentsEx/selectTableModal/supervisorSelectModal");
	var operatorSelectModal = require("componentsEx/selectTableModal/operatorSelectModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
			id : null,
			//唯一标识
			code : null,
			//禁用标识 0未禁用，1已禁用
			disable : null,
			//作业开始时间
			startTime : null,
			//所属部门id
			orgId : null,
			//作业结束时间
			endTime : null,
			//记录类型 1:操作票作业记录,2:维检修作业记录
			type : null,
			//作业全部设备号
			equipNos : null,
			//所属公司id
			compId : null,
			//操作地点
			site : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//卡票
			opCard : {id:'', name:''},
			//维检修作业明细
			opMaintRecordDetails : [],
			//操作票作业明细
			opStdRecordDetails : [],
			//负责人
			principals : [],
			//监护人
			supervisors : [],
			//操作人
			operators : [],
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
				"disable" :LIB.formRuleMgr.require("状态"),
				"startTime" : [LIB.formRuleMgr.require("作业开始时间"),
						  LIB.formRuleMgr.length()
				],
				"endTime" : [LIB.formRuleMgr.require("作业结束时间"),
						  LIB.formRuleMgr.length()
				],
				"type" : LIB.formRuleMgr.range(1, 100).concat(LIB.formRuleMgr.require("记录类型")),
				"equipNos" : [LIB.formRuleMgr.require("作业全部设备号"),
						  LIB.formRuleMgr.length()
				],
				"site" : [LIB.formRuleMgr.require("操作地点"),
						  LIB.formRuleMgr.length()
				],
	        }
		},
		tableModel : {
			opMaintRecordDetailTableModel : LIB.Opts.extendDetailTableOpt({
				url : "oprecord/opmaintrecorddetails/list/{curPage}/{pageSize}",
				columns : [
					LIB.tableMgr.ksColumn.code,
				{
					title : "名称",
					fieldName : "name",
					keywordFilterName: "criteria.strValue.keyWordValue_name"
				},{
					title : "",
					fieldType : "tool",
					toolType : "edit,del"
				}]
			}),
			opStdRecordDetailTableModel : LIB.Opts.extendDetailTableOpt({
				url : "oprecord/opstdrecorddetails/list/{curPage}/{pageSize}",
				columns : [
					LIB.tableMgr.ksColumn.code,
				{
					title : "名称",
					fieldName : "name",
					keywordFilterName: "criteria.strValue.keyWordValue_name"
				},{
					title : "",
					fieldType : "tool",
					toolType : "edit,del"
				}]
			}),
			principalTableModel : LIB.Opts.extendDetailTableOpt({
				url : "oprecord/principals/list/{curPage}/{pageSize}",
				columns : [
					LIB.tableMgr.ksColumn.code,
				{
					title : "名称",
					fieldName : "name",
					keywordFilterName: "criteria.strValue.keyWordValue_name"
				},{
					title : "",
					fieldType : "tool",
					toolType : "del"
				}]
			}),
			supervisorTableModel : LIB.Opts.extendDetailTableOpt({
				url : "oprecord/supervisors/list/{curPage}/{pageSize}",
				columns : [
					LIB.tableMgr.ksColumn.code,
				{
					title : "名称",
					fieldName : "name",
					keywordFilterName: "criteria.strValue.keyWordValue_name"
				},{
					title : "",
					fieldType : "tool",
					toolType : "del"
				}]
			}),
			operatorTableModel : LIB.Opts.extendDetailTableOpt({
				url : "oprecord/operators/list/{curPage}/{pageSize}",
				columns : [
					LIB.tableMgr.ksColumn.code,
				{
					title : "名称",
					fieldName : "name",
					keywordFilterName: "criteria.strValue.keyWordValue_name"
				},{
					title : "",
					fieldType : "tool",
					toolType : "del"
				}]
			}),
		},
		formModel : {
			opMaintRecordDetailFormModel : {
				show : false,
				hiddenFields : ["recordId"],
				queryUrl : "oprecord/{id}/opmaintrecorddetail/{opMaintRecordDetailId}"
			},
			opStdRecordDetailFormModel : {
				show : false,
				hiddenFields : ["recordId"],
				queryUrl : "oprecord/{id}/opstdrecorddetail/{opStdRecordDetailId}"
			},
		},
		selectModel : {
			opCardSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			principalSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			supervisorSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			operatorSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

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
			 beforeInit 		//初始化之前回调
			 afterInit			//初始化之后回调
			 afterInitData		//请求 查询 接口后回调
			 afterInitFileData  //请求 查询文件列表 接口后回调
			 beforeDoSave		//请求 新增/更新 接口前回调，返回false时不进行保存操作
			 afterFormValidate	//表单rule的校验通过后回调，，返回false时不进行保存操作
			 buildSaveData		//请求 新增/更新 接口前回调，重新构造接口的参数
			 afterDoSave		//请求 新增/更新 接口后回调
			 beforeDoDelete		//请求 删除 接口前回调
			 afterDoDelete		//请求 删除 接口后回调
		 events
		 vue组件声明周期方法
		 init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
	 **/
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
		template: tpl,
		components : {
			"opcardSelectModal":opCardSelectModal,
			"opmaintrecorddetailFormModal":opMaintRecordDetailFormModal,
			"opstdrecorddetailFormModal":opStdRecordDetailFormModal,
			"principalSelectModal":principalSelectModal,
			"supervisorSelectModal":supervisorSelectModal,
			"operatorSelectModal":operatorSelectModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowOpCardSelectModal : function() {
				this.selectModel.opCardSelectModel.visible = true;
				//this.selectModel.opCardSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveOpCard : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.opCard = selectedDatas[0];
				}
			},
			doShowOpMaintRecordDetailFormModal4Update : function(param) {
				this.formModel.opMaintRecordDetailFormModel.show = true;
				this.$refs.opmaintrecorddetailFormModal.init("update", {id: this.mainModel.vo.id, opMaintRecordDetailId: param.entry.data.id});
			},
			doShowOpMaintRecordDetailFormModal4Create : function(param) {
				this.formModel.opMaintRecordDetailFormModel.show = true;
				this.$refs.opmaintrecorddetailFormModal.init("create");
			},
			doSaveOpMaintRecordDetail : function(data) {
				if (data) {
					var _this = this;
					api.saveOpMaintRecordDetail({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.opmaintrecorddetailTable);
					});
				}
			},
			doUpdateOpMaintRecordDetail : function(data) {
				if (data) {
					var _this = this;
					api.updateOpMaintRecordDetail({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.opmaintrecorddetailTable);
					});
				}
			},
			doRemoveOpMaintRecordDetails : function(item) {
				var _this = this;
				var data = item.entry.data;
				api.removeOpMaintRecordDetails({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					_this.$refs.opmaintrecorddetailTable.doRefresh();
				});
			},
			doShowOpStdRecordDetailFormModal4Update : function(param) {
				this.formModel.opStdRecordDetailFormModel.show = true;
				this.$refs.opstdrecorddetailFormModal.init("update", {id: this.mainModel.vo.id, opStdRecordDetailId: param.entry.data.id});
			},
			doShowOpStdRecordDetailFormModal4Create : function(param) {
				this.formModel.opStdRecordDetailFormModel.show = true;
				this.$refs.opstdrecorddetailFormModal.init("create");
			},
			doSaveOpStdRecordDetail : function(data) {
				if (data) {
					var _this = this;
					api.saveOpStdRecordDetail({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.opstdrecorddetailTable);
					});
				}
			},
			doUpdateOpStdRecordDetail : function(data) {
				if (data) {
					var _this = this;
					api.updateOpStdRecordDetail({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.opstdrecorddetailTable);
					});
				}
			},
			doRemoveOpStdRecordDetails : function(item) {
				var _this = this;
				var data = item.entry.data;
				api.removeOpStdRecordDetails({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					_this.$refs.opstdrecorddetailTable.doRefresh();
				});
			},
			doShowPrincipalSelectModal : function() {
				this.selectModel.principalSelectModel.visible = true;
				//this.selectModel.principalSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSavePrincipals : function(selectedDatas) {
				if (selectedDatas) {
					dataModel.mainModel.vo.principals = selectedDatas;
					var param = _.map(selectedDatas, function(data){return {id : data.id}});
					var _this = this;
					api.savePrincipals({id : dataModel.mainModel.vo.id}, param).then(function() {
						_this.refreshTableData(_this.$refs.principalTable);
					});
				}
			},
			doRemovePrincipals : function(item) {
				var _this = this;
				var data = item.entry.data;
				api.removePrincipals({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					_this.$refs.principalTable.doRefresh();
				});
			},
			doShowSupervisorSelectModal : function() {
				this.selectModel.supervisorSelectModel.visible = true;
				//this.selectModel.supervisorSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveSupervisors : function(selectedDatas) {
				if (selectedDatas) {
					dataModel.mainModel.vo.supervisors = selectedDatas;
					var param = _.map(selectedDatas, function(data){return {id : data.id}});
					var _this = this;
					api.saveSupervisors({id : dataModel.mainModel.vo.id}, param).then(function() {
						_this.refreshTableData(_this.$refs.supervisorTable);
					});
				}
			},
			doRemoveSupervisors : function(item) {
				var _this = this;
				var data = item.entry.data;
				api.removeSupervisors({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					_this.$refs.supervisorTable.doRefresh();
				});
			},
			doShowOperatorSelectModal : function() {
				this.selectModel.operatorSelectModel.visible = true;
				//this.selectModel.operatorSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveOperators : function(selectedDatas) {
				if (selectedDatas) {
					dataModel.mainModel.vo.operators = selectedDatas;
					var param = _.map(selectedDatas, function(data){return {id : data.id}});
					var _this = this;
					api.saveOperators({id : dataModel.mainModel.vo.id}, param).then(function() {
						_this.refreshTableData(_this.$refs.operatorTable);
					});
				}
			},
			doRemoveOperators : function(item) {
				var _this = this;
				var data = item.entry.data;
				api.removeOperators({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					_this.$refs.operatorTable.doRefresh();
				});
			},
			afterInitData : function() {
				this.$refs.opmaintrecorddetailTable.doQuery({id : this.mainModel.vo.id});
				this.$refs.opstdrecorddetailTable.doQuery({id : this.mainModel.vo.id});
				this.$refs.principalTable.doQuery({id : this.mainModel.vo.id});
				this.$refs.supervisorTable.doQuery({id : this.mainModel.vo.id});
				this.$refs.operatorTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.opmaintrecorddetailTable.doClearData();
				this.$refs.opstdrecorddetailTable.doClearData();
				this.$refs.principalTable.doClearData();
				this.$refs.supervisorTable.doClearData();
				this.$refs.operatorTable.doClearData();
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