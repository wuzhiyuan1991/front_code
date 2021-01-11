define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-tab-xl.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var ptwCatalogSelectModal = require("componentsEx/selectTableModal/ptwCatalogSelectModal");
	var ptwCardTplSelectModal = require("componentsEx/selectTableModal/ptwCardTplSelectModal");
	var ptwWorkCardSelectModal = require("componentsEx/selectTableModal/ptwWorkCardSelectModal");
	var ptwJsaMasterSelectModal = require("componentsEx/selectTableModal/ptwJsaMasterSelectModal");
	var ptwWorkIsolationFormModal = require("componentsEx/formModal/ptwWorkIsolationFormModal");
	var gasDetectionRecordFormModal = require("componentsEx/formModal/gasDetectionRecordFormModal");
	var ptwWorkStuffFormModal = require("componentsEx/formModal/ptwWorkStuffFormModal");
	var superviseRecordFormModal = require("componentsEx/formModal/superviseRecordFormModal");
	var ptwWorkPersonnelFormModal = require("componentsEx/formModal/ptwWorkPersonnelFormModal");
	var ptwWorkPermitFormModal = require("componentsEx/formModal/ptwWorkPermitFormModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//编码
			code : null,
			//启用/禁用 0:启用,1:禁用
			disable : "0",
			//作业时限结束时间
			permitEndTime : null,
			//作业时限开始时间
			permitStartTime : null,
			//作业地点
			workPlace : null,
			//作业内容
			workContent : null,
			//是否需要主管部门负责人 0:不需要,1:需要
			enableDeptPrin : null,
			//是否启用电气隔离 0:否,1:是
			enableElectricIsolation : null,
			//是否启用气体检测 0:否,1:是
			enableGasDetection : null,
			//是否启用机械隔离 0:否,1:是
			enableMechanicalIsolation : null,
			//是否启用工艺隔离 0:否,1:是
			enableProcessIsolation : null,
			//是否需要生产单位现场负责人 0:不需要,1:需要
			enableProdPrin : null,
			//是否需要相关方负责人 0:不需要,1:需要
			enableRelPin : null,
			//是否需要安全教育人  0:不需要,1:需要
			enableSafetyEducator : null,
			//是否需要安全部门负责人 0:不需要,1:需要
			enableSecurityPrin : null,
			//是否需要监护人员 0:否,1:是
			enableSupervisor : null,
			//是否启用系统屏蔽 0:否,1:是
			enableSystemMask : null,
			//作业中气体检测模式 1:定期检查,2:持续检查
			gasCheckType : null,
			//许可证编号
			permitCode : null,
			//启用的个人防护设备类型id串
			ppeCatalogSetting : null,
			//备注
			remark : null,
			//作业结果 1:作业取消,2:作业完成,3:作业续签
			result : null,
			//序号（续签时重置，重新填报时更新）
			serialNum : null,
			//状态 1:填报作业票,2:现场落实,3:作业会签,4:作业批准,5:作业监测,6:待关闭,7:作业取消,8:作业完成,9:作业续签,10:被否决
			status : null,
			//作业许可有效期结束时间
			validityEndTime : null,
			//作业许可有效期开始时间
			validityStartTime : null,
			//版本号（续签时更新）
			versionNum : null,
			//作业所在设备
			workEquipment : null,
			//授权气体检测员
			gasInspector : {id:'', name:''},
			//作业类型
			workCatalog : {id:'', name:''},
			//作业票模板
			cardTpl : {id:'', name:''},
			//作业票
			workCard : {id:'', name:''},
			//工作安全分析
			jsaMaster : {id:'', name:''},
			//能量隔离
			workIsolations : [],
			//气体检测记录
			gasDetectionRecords : [],
			//作业许可风险库内容
			workStuffs : [],
			//监控记录
			superviseRecords : [],
			//作业许可相关人员
			workpeoplenel : [],
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
				"permitEndTime" : [LIB.formRuleMgr.require("作业时限结束时间")],
				"permitStartTime" : [LIB.formRuleMgr.require("作业时限开始时间")],
				"workPlace" : [LIB.formRuleMgr.require("作业地点"),
						  LIB.formRuleMgr.length(200)
				],
				"workContent" : [LIB.formRuleMgr.require("作业内容"),
						  LIB.formRuleMgr.length(500)
				],
				"enableDeptPrin" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"enableElectricIsolation" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"enableGasDetection" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"enableMechanicalIsolation" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"enableProcessIsolation" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"enableProdPrin" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"enableRelPin" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"enableSafetyEducator" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"enableSecurityPrin" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"enableSupervisor" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"enableSystemMask" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"gasCheckType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"permitCode" : [LIB.formRuleMgr.length(10)],
				"ppeCatalogSetting" : [LIB.formRuleMgr.length(65535)],
				"remark" : [LIB.formRuleMgr.length(500)],
				"result" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"serialNum" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"status" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"validityEndTime" : [LIB.formRuleMgr.allowStrEmpty],
				"validityStartTime" : [LIB.formRuleMgr.allowStrEmpty],
				"versionNum" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"workEquipment" : [LIB.formRuleMgr.length(200)],
				"gasInspector.id" : [LIB.formRuleMgr.allowStrEmpty],
				"workCatalog.id" : [LIB.formRuleMgr.require("作业类型")],
				"cardTpl.id" : [LIB.formRuleMgr.allowStrEmpty],
				"workCard.id" : [LIB.formRuleMgr.allowStrEmpty],
				"jsaMaster.id" : [LIB.formRuleMgr.allowStrEmpty],
	        }
		},
		tableModel : {
			workIsolationTableModel : LIB.Opts.extendDetailTableOpt({
				url : "ptwworkpermit/workisolations/list/{curPage}/{pageSize}",
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
			gasDetectionRecordTableModel : LIB.Opts.extendDetailTableOpt({
				url : "ptwworkpermit/gasdetectionrecords/list/{curPage}/{pageSize}",
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
			workStuffTableModel : LIB.Opts.extendDetailTableOpt({
				url : "ptwworkpermit/workstuffs/list/{curPage}/{pageSize}",
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
			superviseRecordTableModel : LIB.Opts.extendDetailTableOpt({
				url : "ptwworkpermit/superviserecords/list/{curPage}/{pageSize}",
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
			workPersonnelTableModel : LIB.Opts.extendDetailTableOpt({
				url : "ptwworkpermit/workpeoplenel/list/{curPage}/{pageSize}",
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
		},
		formModel : {
			workIsolationFormModel : {
				show : false,
				hiddenFields : ["workPermitId"],
				queryUrl : "ptwworkpermit/{id}/workisolation/{workIsolationId}"
			},
			gasDetectionRecordFormModel : {
				show : false,
				hiddenFields : ["workPermitId"],
				queryUrl : "ptwworkpermit/{id}/gasdetectionrecord/{gasDetectionRecordId}"
			},
			workStuffFormModel : {
				show : false,
				hiddenFields : ["workPermitId"],
				queryUrl : "ptwworkpermit/{id}/workstuff/{workStuffId}"
			},
			superviseRecordFormModel : {
				show : false,
				hiddenFields : ["workPermitId"],
				queryUrl : "ptwworkpermit/{id}/superviserecord/{superviseRecordId}"
			},
			workPersonnelFormModel : {
				show : false,
				hiddenFields : ["workPermitId"],
				queryUrl : "ptwworkpermit/{id}/workpersonnel/{workPersonnelId}"
			},
			ptwWorkPermitFormModel : {
				show : false,
				queryUrl : "ptwworkpermit/{id}"
			}
		},
		cardModel : {
			workIsolationCardModel : {
				showContent : true
			},
			gasDetectionRecordCardModel : {
				showContent : true
			},
			workStuffCardModel : {
				showContent : true
			},
			superviseRecordCardModel : {
				showContent : true
			},
			workPersonnelCardModel : {
				showContent : true
			},
		},
		selectModel : {
			gasInspectorSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			workCatalogSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			cardTplSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			workCardSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			jsaMasterSelectModel : {
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
			"ptwcatalogSelectModal":ptwCatalogSelectModal,
			"ptwcardtplSelectModal":ptwCardTplSelectModal,
			"ptwworkcardSelectModal":ptwWorkCardSelectModal,
			"ptwjsamasterSelectModal":ptwJsaMasterSelectModal,
			"ptwworkisolationFormModal":ptwWorkIsolationFormModal,
			"gasdetectionrecordFormModal":gasDetectionRecordFormModal,
			"ptwworkstuffFormModal":ptwWorkStuffFormModal,
			"superviserecordFormModal":superviseRecordFormModal,
			"ptwworkpersonnelFormModal":ptwWorkPersonnelFormModal,
			"ptwworkpermitFormModal":ptwWorkPermitFormModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowGasInspectorSelectModal : function() {
				this.selectModel.gasInspectorSelectModel.visible = true;
				//this.selectModel.gasInspectorSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveGasInspector : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.gasInspector = selectedDatas[0];
				}
			},
			doShowWorkCatalogSelectModal : function() {
				this.selectModel.workCatalogSelectModel.visible = true;
				//this.selectModel.workCatalogSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveWorkCatalog : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.workCatalog = selectedDatas[0];
				}
			},
			doShowCardTplSelectModal : function() {
				this.selectModel.cardTplSelectModel.visible = true;
				//this.selectModel.cardTplSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveCardTpl : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.cardTpl = selectedDatas[0];
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
			doShowJsaMasterSelectModal : function() {
				this.selectModel.jsaMasterSelectModel.visible = true;
				//this.selectModel.jsaMasterSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveJsaMaster : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.jsaMaster = selectedDatas[0];
				}
			},
			doShowWorkIsolationFormModal4Update : function(param) {
				this.formModel.workIsolationFormModel.show = true;
				this.$refs.workisolationFormModal.init("update", {id: this.mainModel.vo.id, workIsolationId: param.entry.data.id});
			},
			doShowWorkIsolationFormModal4Create : function(param) {
				this.formModel.workIsolationFormModel.show = true;
				this.$refs.workisolationFormModal.init("create");
			},
			doSaveWorkIsolation : function(data) {
				if (data) {
					var _this = this;
					api.saveWorkIsolation({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.workisolationTable);
					});
				}
			},
			doUpdateWorkIsolation : function(data) {
				if (data) {
					var _this = this;
					api.updateWorkIsolation({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.workisolationTable);
					});
				}
			},
			doRemoveWorkIsolation : function(item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeWorkIsolations({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							_this.$refs.workisolationTable.doRefresh();
						});
					}
				});
			},
			doShowGasDetectionRecordFormModal4Update : function(param) {
				this.formModel.gasDetectionRecordFormModel.show = true;
				this.$refs.gasdetectionrecordFormModal.init("update", {id: this.mainModel.vo.id, gasDetectionRecordId: param.entry.data.id});
			},
			doShowGasDetectionRecordFormModal4Create : function(param) {
				this.formModel.gasDetectionRecordFormModel.show = true;
				this.$refs.gasdetectionrecordFormModal.init("create");
			},
			doSaveGasDetectionRecord : function(data) {
				if (data) {
					var _this = this;
					api.saveGasDetectionRecord({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.gasdetectionrecordTable);
					});
				}
			},
			doUpdateGasDetectionRecord : function(data) {
				if (data) {
					var _this = this;
					api.updateGasDetectionRecord({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.gasdetectionrecordTable);
					});
				}
			},
			doRemoveGasDetectionRecord : function(item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeGasDetectionRecords({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							_this.$refs.gasdetectionrecordTable.doRefresh();
						});
					}
				});
			},
			doShowWorkStuffFormModal4Update : function(param) {
				this.formModel.workStuffFormModel.show = true;
				this.$refs.workstuffFormModal.init("update", {id: this.mainModel.vo.id, workStuffId: param.entry.data.id});
			},
			doShowWorkStuffFormModal4Create : function(param) {
				this.formModel.workStuffFormModel.show = true;
				this.$refs.workstuffFormModal.init("create");
			},
			doSaveWorkStuff : function(data) {
				if (data) {
					var _this = this;
					api.saveWorkStuff({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.workstuffTable);
					});
				}
			},
			doUpdateWorkStuff : function(data) {
				if (data) {
					var _this = this;
					api.updateWorkStuff({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.workstuffTable);
					});
				}
			},
			doRemoveWorkStuff : function(item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeWorkStuffs({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							_this.$refs.workstuffTable.doRefresh();
						});
					}
				});
			},
			doShowSuperviseRecordFormModal4Update : function(param) {
				this.formModel.superviseRecordFormModel.show = true;
				this.$refs.superviserecordFormModal.init("update", {id: this.mainModel.vo.id, superviseRecordId: param.entry.data.id});
			},
			doShowSuperviseRecordFormModal4Create : function(param) {
				this.formModel.superviseRecordFormModel.show = true;
				this.$refs.superviserecordFormModal.init("create");
			},
			doSaveSuperviseRecord : function(data) {
				if (data) {
					var _this = this;
					api.saveSuperviseRecord({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.superviserecordTable);
					});
				}
			},
			doUpdateSuperviseRecord : function(data) {
				if (data) {
					var _this = this;
					api.updateSuperviseRecord({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.superviserecordTable);
					});
				}
			},
			doRemoveSuperviseRecord : function(item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeSuperviseRecords({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							_this.$refs.superviserecordTable.doRefresh();
						});
					}
				});
			},
			doShowWorkPersonnelFormModal4Update : function(param) {
				this.formModel.workPersonnelFormModel.show = true;
				this.$refs.workpersonnelFormModal.init("update", {id: this.mainModel.vo.id, workPersonnelId: param.entry.data.id});
			},
			doShowWorkPersonnelFormModal4Create : function(param) {
				this.formModel.workPersonnelFormModel.show = true;
				this.$refs.workpersonnelFormModal.init("create");
			},
			doSaveWorkPersonnel : function(data) {
				if (data) {
					var _this = this;
					api.saveWorkPersonnel({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.workpersonnelTable);
					});
				}
			},
			doUpdateWorkPersonnel : function(data) {
				if (data) {
					var _this = this;
					api.updateWorkPersonnel({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.workpersonnelTable);
					});
				}
			},
			doRemoveWorkPersonnel : function(item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeWorkpeoplenel({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							_this.$refs.workpersonnelTable.doRefresh();
						});
					}
				});
			},
			doShowPtwWorkPermitFormModal4Update : function(data) {
				this.formModel.ptwWorkPermitFormModel.show = true;
				this.$refs.ptwworkpermitFormModal.init("update", {id: this.mainModel.vo.id});
			},
			doUpdatePtwWorkPermit : function(data) {
				this.doUpdate(data);
			},
			afterInitData : function() {
				this.$refs.workisolationTable.doQuery({id : this.mainModel.vo.id});
				this.$refs.gasdetectionrecordTable.doQuery({id : this.mainModel.vo.id});
				this.$refs.workstuffTable.doQuery({id : this.mainModel.vo.id});
				this.$refs.superviserecordTable.doQuery({id : this.mainModel.vo.id});
				this.$refs.workpersonnelTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.workisolationTable.doClearData();
				this.$refs.gasdetectionrecordTable.doClearData();
				this.$refs.workstuffTable.doClearData();
				this.$refs.superviserecordTable.doClearData();
				this.$refs.workpersonnelTable.doClearData();
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