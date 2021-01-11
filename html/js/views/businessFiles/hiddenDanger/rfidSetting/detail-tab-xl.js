define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-tab-xl.html");
	var checkTableSelectModal = require("componentsEx/selectTableModal/checkTableSelectModal");
	var rfidFormModal = require("componentsEx/formModal/rfidFormModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//标签编码
			code : null,
			//标签名称
			name : null,
			//禁用标识 0:未禁用,1:已禁用
			disable : "0",
			//标签标识
			flag : null,
			//检查表
			checkTables : [],
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
				"name" : [LIB.formRuleMgr.length(100)],
				"disable" :LIB.formRuleMgr.require("状态"),
				"flag" : [LIB.formRuleMgr.length(100)],
	        }
		},
		tableModel : {
			checkTableTableModel : LIB.Opts.extendDetailTableOpt({
				url : "rfid/checktables/list/{curPage}/{pageSize}",
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
			rfidFormModel : {
				show : false,
				queryUrl : "rfid/{id}"
			}
		},
		cardModel : {
			checkTableCardModel : {
				showContent : true
			},
		},
		selectModel : {
			checkTableSelectModel : {
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
			"checktableSelectModal":checkTableSelectModal,
			"rfidFormModal":rfidFormModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowCheckTableSelectModal : function() {
				this.selectModel.checkTableSelectModel.visible = true;
				//this.selectModel.checkTableSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveCheckTables : function(selectedDatas) {
				if (selectedDatas) {
					dataModel.mainModel.vo.checkTables = selectedDatas;
					var param = _.map(selectedDatas, function(data){return {id : data.id}});
					var _this = this;
					api.saveCheckTables({id : dataModel.mainModel.vo.id}, param).then(function() {
						_this.refreshTableData(_this.$refs.checktableTable);
					});
				}
			},
			doRemoveCheckTable : function(item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeCheckTables({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							_this.$refs.checktableTable.doRefresh();
						});
					}
				});
			},
			doShowRfidFormModal4Update : function(data) {
				this.formModel.rfidFormModel.show = true;
				this.$refs.rfidFormModal.init("update", {id: this.mainModel.vo.id});
			},
			doUpdateRfid : function(data) {
				this.doUpdate(data);
			},
			afterInitData : function() {
				this.$refs.checktableTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.checktableTable.doClearData();
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