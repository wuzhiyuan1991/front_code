define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var ptwCatalogSelectModal = require("componentsEx/selectTableModal/ptwCatalogSelectModal");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var ptwWorkPermitFormModal = require("componentsEx/formModal/ptwWorkPermitFormModal");
	var ptwWorkHistoryFormModal = require("componentsEx/formModal/ptwWorkHistoryFormModal");

	//初始化数据模型
	var newVO = function() {
		return {
			id : null,
			//编码
			code : null,
			//作业开始时间
			workStartTime : null,
			//启用/禁用 0:启用,1:禁用
			disable : "0",
			//作业地点
			workPlace : null,
			//作业结束时间
			workEndTime : null,
			//是否启用预约机制 0:否,1:是
			enableReservation : null,
			//作业内容
			workContent : null,
			//公司Id
			compId : null,
			//部门Id
			orgId : null,
			//评审意见
			auditOpinion : null,
			//评审结果 0:未评审,1:不通过,2:通过
			auditResult : null,
			//评审时间
			auditTime : null,
			//作业状态  1:作业预约,2:作业评审,3:填报作业票,4:现场落实,5:作业会签,6:作业批准,7:作业监测,8:待关闭,9:作业取消,10:作业完成,11:已否决
			status : null,
			//作业所在设备
			workEquipment : null,
			//作业类型
			workCatalog : {id:'', name:''},
			//评审人
			auditor : {id:'', name:''},
			//作业许可
			workPermits : [],
			//作业许可历史
			workHistories : [],
			//申请人
			applicant : {id:'', name:''},
			//作业级别
			workLevel : {id:'', name:''}
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
				"workStartTime" : [LIB.formRuleMgr.require("作业开始时间")],
				"disable" :LIB.formRuleMgr.require("状态"),
				"workPlace" : [LIB.formRuleMgr.require("作业地点"),
						  LIB.formRuleMgr.length(200)
				],
				"workEndTime" : [LIB.formRuleMgr.require("作业结束时间")],
				"enableReservation" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("是否启用预约机制")),
				"workContent" : [LIB.formRuleMgr.require("作业内容"),
						  LIB.formRuleMgr.length(500)
				],
				"compId" : [LIB.formRuleMgr.require("公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"auditOpinion" : [LIB.formRuleMgr.length(500)],
				"auditResult" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"auditTime" : [LIB.formRuleMgr.allowStrEmpty],
				"status" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"workEquipment" : [LIB.formRuleMgr.length(200)],
				"workCatalog.id" : [LIB.formRuleMgr.require("作业类型")],
				"auditor.id" : [LIB.formRuleMgr.require("评审人")],
	        }
		},
		tableModel : {
			workPermitTableModel : LIB.Opts.extendDetailTableOpt({
				url : "ptwworkcard/workpermits/list/{curPage}/{pageSize}",
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
			workHistoryTableModel : LIB.Opts.extendDetailTableOpt({
				url : "ptwworkcard/workhistories/list/{curPage}/{pageSize}",
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
			workPermitFormModel : {
				show : false,
				hiddenFields : ["workCardId"],
				queryUrl : "ptwworkcard/{id}/workpermit/{workPermitId}"
			},
			workHistoryFormModel : {
				show : false,
				hiddenFields : ["workCardId"],
				queryUrl : "ptwworkcard/{id}/workhistory/{workHistoryId}"
			},
		},
		selectModel : {
			workCatalogSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			auditorSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},



//无需附件上传请删除此段代码
    /*
         fileModel:{
             file : {
                 cfg: {
                     params: {
                         recordId: null,
                         dataType: 'XXX1', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
                         fileType: 'XX'    // 文件类型标识，需要根据数据库的注释进行对应的修改
                     },
                     filters: {
                        max_file_size: '10mb',
                     },
                 },
                 data : []
             },
             pic : {
                 cfg: {
                     params: {
                         recordId: null,
                         dataType: 'XXX2', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
                         fileType: 'XX'    // 文件类型标识，需要根据数据库的注释进行对应的修改
                     },
                     filters: {
                         max_file_size: '10mb',
                         mime_types: [{title: "files", extensions: "png,jpg,jpeg"}]
                     }
                 },
                 data : []
             },
             video : {
                 cfg: {
                     params: {
                         recordId: null,
                         dataType: 'XXX3', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
                         fileType: 'XX'    // 文件类型标识，需要根据数据库的注释进行对应的修改
                     },
                     filters: {
                         max_file_size: '10mb',
                         mime_types: [{title: "files", extensions: "mp4,avi,flv,3gp"}]
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
			"ptwcatalogSelectModal":ptwCatalogSelectModal,
			"userSelectModal":userSelectModal,
			"ptwworkpermitFormModal":ptwWorkPermitFormModal,
			"ptwworkhistoryFormModal":ptwWorkHistoryFormModal,

        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowWorkCatalogSelectModal : function() {
				this.selectModel.workCatalogSelectModel.visible = true;
				//this.selectModel.workCatalogSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveWorkCatalog : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.workCatalog = selectedDatas[0];
				}
			},
			doShowAuditorSelectModal : function() {
				this.selectModel.auditorSelectModel.visible = true;
				//this.selectModel.auditorSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveAuditor : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.auditor = selectedDatas[0];
				}
			},
			doShowWorkPermitFormModal4Update : function(param) {
				this.formModel.workPermitFormModel.show = true;
				this.$refs.workpermitFormModal.init("update", {id: this.mainModel.vo.id, workPermitId: param.entry.data.id});
			},
			doShowWorkPermitFormModal4Create : function(param) {
				this.formModel.workPermitFormModel.show = true;
				this.$refs.workpermitFormModal.init("create");
			},
			doSaveWorkPermit : function(data) {
				if (data) {
					var _this = this;
					api.saveWorkPermit({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.workpermitTable);
					});
				}
			},
			doUpdateWorkPermit : function(data) {
				if (data) {
					var _this = this;
					api.updateWorkPermit({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.workpermitTable);
					});
				}
			},
			doRemoveWorkPermit : function(item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeWorkPermits({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							_this.$refs.workpermitTable.doRefresh();
						});
					}
				});
			},
			doShowWorkHistoryFormModal4Update : function(param) {
				this.formModel.workHistoryFormModel.show = true;
				this.$refs.workhistoryFormModal.init("update", {id: this.mainModel.vo.id, workHistoryId: param.entry.data.id});
			},
			doShowWorkHistoryFormModal4Create : function(param) {
				this.formModel.workHistoryFormModel.show = true;
				this.$refs.workhistoryFormModal.init("create");
			},
			doSaveWorkHistory : function(data) {
				if (data) {
					var _this = this;
					api.saveWorkHistory({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.workhistoryTable);
					});
				}
			},
			doUpdateWorkHistory : function(data) {
				if (data) {
					var _this = this;
					api.updateWorkHistory({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.workhistoryTable);
					});
				}
			},
			doRemoveWorkHistory : function(item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeWorkHistories({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							_this.$refs.workhistoryTable.doRefresh();
						});
					}
				});
			},
			afterInitData : function() {
				this.$refs.workpermitTable.doQuery({id : this.mainModel.vo.id});
				this.$refs.workhistoryTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.workpermitTable.doClearData();
				this.$refs.workhistoryTable.doClearData();
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