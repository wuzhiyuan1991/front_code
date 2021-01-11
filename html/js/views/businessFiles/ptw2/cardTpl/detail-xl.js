define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var ptwCatalogSelectModal = require("../selectTableModal/ptwCatalogSelectModal");
	var ptwCardStuffFormModal = require("../formModal/ptwCardStuffFormModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//编码
			code : null,
			//作业票模板名称
			name : null,
			//启用/禁用 0:启用,1:禁用
			disable : "0",
			//公司Id
			compId : null,
			//部门Id
			orgId : null,
			//字段启用禁用设置(json)
			columnSetting : null,
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
			//是否需要监护人员 0:不需要,1:需要
			enableSupervisor : null,
			//是否启用系统屏蔽 0:否,1:是
			enableSystemMask : null,
			//个人防护启用禁用设置(json)
			ppeCatalogSetting : null,
			//作业类型
			workCatalog : {id:'', name:''},
			//作业票模板风险库内容
			ptwCardStuffs : [],
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
				"name" : [LIB.formRuleMgr.require("作业票模板名称"),
						  LIB.formRuleMgr.length(200)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"compId" : [LIB.formRuleMgr.require("公司")],
				"orgId" : [LIB.formRuleMgr.require("部门"),
						  LIB.formRuleMgr.length(10)
				],
				"columnSetting" : [LIB.formRuleMgr.length(1000)],
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
				"ppeCatalogSetting" : [LIB.formRuleMgr.length(500)],
				"workCatalog.id" : [LIB.formRuleMgr.require("作业类型")],
	        }
		},
		tableModel : {
			ptwCardStuffTableModel : LIB.Opts.extendDetailTableOpt({
				url : "ptwcardtpl/ptwcardstuffs/list/{curPage}/{pageSize}",
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
			ptwCardStuffFormModel : {
				show : false,
				hiddenFields : ["tplId"],
				queryUrl : "ptwcardtpl/{id}/ptwcardstuff/{ptwCardStuffId}"
			},
		},
		cardModel : {
			ptwCardStuffCardModel : {
				showContent : true
			},
		},
		selectModel : {
			workCatalogSelectModel : {
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
			"ptwcardstuffFormModal":ptwCardStuffFormModal,
			
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
			doShowPtwCardStuffFormModal4Update : function(param) {
				this.formModel.ptwCardStuffFormModel.show = true;
				this.$refs.ptwcardstuffFormModal.init("update", {id: this.mainModel.vo.id, ptwCardStuffId: param.entry.data.id});
			},
			doShowPtwCardStuffFormModal4Create : function(param) {
				this.formModel.ptwCardStuffFormModel.show = true;
				this.$refs.ptwcardstuffFormModal.init("create");
			},
			doSavePtwCardStuff : function(data) {
				if (data) {
					var _this = this;
					api.savePtwCardStuff({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.ptwcardstuffTable);
					});
				}
			},
			doUpdatePtwCardStuff : function(data) {
				if (data) {
					var _this = this;
					api.updatePtwCardStuff({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.ptwcardstuffTable);
					});
				}
			},
			doRemovePtwCardStuff : function(item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removePtwCardStuffs({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							_this.$refs.ptwcardstuffTable.doRefresh();
						});
					}
				});
			},
			afterInitData : function() {
				this.$refs.ptwcardstuffTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.ptwcardstuffTable.doClearData();
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