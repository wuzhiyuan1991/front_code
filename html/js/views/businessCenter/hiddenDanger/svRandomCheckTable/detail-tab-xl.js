define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-tab-xl.html");
	var svRandomCheckRecordFormModal = require("componentsEx/formModal/svRandomCheckRecordFormModal");
	var svRandomCheckTableFormModal = require("componentsEx/formModal/svRandomCheckTableFormModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//编码
			code : null,
			//记录表名
			name : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//内容
			content : null,
			//来源 0:手机检查,1:web录入,2 其他
			checkSource : null,
			//状态 1:待审核,2:已转隐患,3:被否决
			status : null,
			//
			compId : null,
			//组织id
			orgId : null,
			//备注
			remarks : null,
			//安全监督随机检查记录
			svRandomCheckRecords : [],
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
				"code" : [LIB.formRuleMgr.length(100)],
				"name" : [LIB.formRuleMgr.require("记录表名"),
						  LIB.formRuleMgr.length(4000)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"content" : [LIB.formRuleMgr.require("内容"),
						  LIB.formRuleMgr.length(4000)
				],
				"checkSource" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("来源")),
				"status" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("状态")),
				"compId" : [LIB.formRuleMgr.require("")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"remarks" : [LIB.formRuleMgr.length(500)],
	        }
		},
		tableModel : {
			svRandomCheckRecordTableModel : LIB.Opts.extendDetailTableOpt({
				url : "svrandomchecktable/svrandomcheckrecords/list/{curPage}/{pageSize}",
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
			svRandomCheckRecordFormModel : {
				show : false,
				hiddenFields : ["checkTableId"],
				queryUrl : "svrandomchecktable/{id}/svrandomcheckrecord/{svRandomCheckRecordId}"
			},
			svRandomCheckTableFormModel : {
				show : false,
				queryUrl : "svrandomchecktable/{id}"
			}
		},
		cardModel : {
			svRandomCheckRecordCardModel : {
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
			"svrandomcheckrecordFormModal":svRandomCheckRecordFormModal,
			"svrandomchecktableFormModal":svRandomCheckTableFormModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowSvRandomCheckRecordFormModal4Update : function(param) {
				this.formModel.svRandomCheckRecordFormModel.show = true;
				this.$refs.svrandomcheckrecordFormModal.init("update", {id: this.mainModel.vo.id, svRandomCheckRecordId: param.entry.data.id});
			},
			doShowSvRandomCheckRecordFormModal4Create : function(param) {
				this.formModel.svRandomCheckRecordFormModel.show = true;
				this.$refs.svrandomcheckrecordFormModal.init("create");
			},
			doSaveSvRandomCheckRecord : function(data) {
				if (data) {
					var _this = this;
					api.saveSvRandomCheckRecord({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.svrandomcheckrecordTable);
					});
				}
			},
			doUpdateSvRandomCheckRecord : function(data) {
				if (data) {
					var _this = this;
					api.updateSvRandomCheckRecord({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.svrandomcheckrecordTable);
					});
				}
			},
			doRemoveSvRandomCheckRecords : function(item) {
				var _this = this;
				var data = item.entry.data;
				api.removeSvRandomCheckRecords({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					_this.$refs.svrandomcheckrecordTable.doRefresh();
				});
			},
			doShowSvRandomCheckTableFormModal4Update : function(data) {
				this.formModel.svRandomCheckTableFormModel.show = true;
				this.$refs.svrandomchecktableFormModal.init("update", {id: this.mainModel.vo.id});
			},
			doUpdateSvRandomCheckTable : function(data) {
				this.doUpdate(data);
			},
			afterInitData : function() {
				this.$refs.svrandomcheckrecordTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.svrandomcheckrecordTable.doClearData();
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