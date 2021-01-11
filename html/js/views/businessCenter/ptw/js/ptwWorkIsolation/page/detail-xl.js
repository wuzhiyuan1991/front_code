define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var ptwWorkPermitSelectModal = require("componentsEx/selectTableModal/ptwWorkPermitSelectModal");
	var cloudFileFormModal = require("componentsEx/formModal/cloudFileFormModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//编码
			code : null,
			//启用/禁用 0:启用,1:禁用
			disable : "0",
			//隔离类型 1:工艺隔离,2:机械隔离,3:电气隔离,4:系统屏蔽
			type : null,
			//解除隔离时间
			disisolateTime : null,
			//是否挂牌上锁 0:否,1:是
			enableLoto : null,
			//隔离的设备/保护的系统
			facility : null,
			//隔离时间
			isolateTime : null,
			//隔离点/保护的系统子件
			position : null,
			//状态 0:未隔离,1:已隔离,2:已解除
			status : null,
			//授权操作人员
			authoriser : {id:'', name:''},
			//作业许可
			workPermit : {id:'', name:''},
			//签名
			cloudFiles : [],
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
				"type" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("隔离类型")),
				"disisolateTime" : [LIB.formRuleMgr.allowStrEmpty],
				"enableLoto" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"facility" : [LIB.formRuleMgr.length(500)],
				"isolateTime" : [LIB.formRuleMgr.allowStrEmpty],
				"position" : [LIB.formRuleMgr.length(500)],
				"status" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"authoriser.id" : [LIB.formRuleMgr.allowStrEmpty],
				"workPermit.id" : [LIB.formRuleMgr.require("作业许可")],
	        }
		},
		tableModel : {
			cloudFileTableModel : LIB.Opts.extendDetailTableOpt({
				url : "ptwworkisolation/cloudfiles/list/{curPage}/{pageSize}",
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
			cloudFileFormModel : {
				show : false,
				hiddenFields : ["recordId"],
				queryUrl : "ptwworkisolation/{id}/cloudfile/{cloudFileId}"
			},
		},
		cardModel : {
			cloudFileCardModel : {
				showContent : true
			},
		},
		selectModel : {
			authoriserSelectModel : {
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
			"userSelectModal":userSelectModal,
			"ptwworkpermitSelectModal":ptwWorkPermitSelectModal,
			"cloudfileFormModal":cloudFileFormModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowAuthoriserSelectModal : function() {
				this.selectModel.authoriserSelectModel.visible = true;
				//this.selectModel.authoriserSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveAuthoriser : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.authoriser = selectedDatas[0];
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
			doShowCloudFileFormModal4Update : function(param) {
				this.formModel.cloudFileFormModel.show = true;
				this.$refs.cloudfileFormModal.init("update", {id: this.mainModel.vo.id, cloudFileId: param.entry.data.id});
			},
			doShowCloudFileFormModal4Create : function(param) {
				this.formModel.cloudFileFormModel.show = true;
				this.$refs.cloudfileFormModal.init("create");
			},
			doSaveCloudFile : function(data) {
				if (data) {
					var _this = this;
					api.saveCloudFile({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.cloudfileTable);
					});
				}
			},
			doUpdateCloudFile : function(data) {
				if (data) {
					var _this = this;
					api.updateCloudFile({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.cloudfileTable);
					});
				}
			},
			doRemoveCloudFile : function(item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeCloudFiles({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							_this.$refs.cloudfileTable.doRefresh();
						});
					}
				});
			},
			afterInitData : function() {
				this.$refs.cloudfileTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.cloudfileTable.doClearData();
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