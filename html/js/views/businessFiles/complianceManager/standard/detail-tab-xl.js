define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-tab-xl.html");
	var standardChapterFormModal = require("componentsEx/formModal/standardChapterFormModal");
	var standardFormModal = require("componentsEx/formModal/standardFormModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//角色编码
			code : null,
			//英文标准名称
			enName : null,
			//中文标准名称
			chName : null,
			//标准号
			number : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//废止信息
			annulment : null,
			//废止日期
			annulmentDate : null,
			//标准简介
			content : null,
			//中国标准分类号
			cssCode : null,
			//CCS分类
			cssType : null,
			//国内行业分类
			domesticType : null,
			//实施日期
			effectiveDate : null,
			//效力级别
			effectiveLevel : null,
			//国际标准分类号
			icsCode : null,
			//ICS分类
			icsType : null,
			//国外行业协会分类
			internationalType : null,
			//是否是已修订 0:不是,1:是(页面只显示未修订的)
			isRevise : null,
			//文件时效 1:现行,2:废止,3:即将实施
			limitation : null,
			//管理部门
			managerOrg : null,
			//发布日期
			publishDate : null,
			//发布单位
			publishOrg : null,
			//修订信息
			revise : null,
			//归口部门
			underOrg : null,
			//章节
			standardChapters : [],
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
				"enName" : [LIB.formRuleMgr.require("英文标准名称"),
						  LIB.formRuleMgr.length(100)
				],
				"chName" : [LIB.formRuleMgr.require("中文标准名称"),
						  LIB.formRuleMgr.length(100)
				],
				"number" : [LIB.formRuleMgr.require("标准号"),
						  LIB.formRuleMgr.length(100)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"annulment" : [LIB.formRuleMgr.length(500)],
				"annulmentDate" : [LIB.formRuleMgr.allowStrEmpty],
				"content" : [LIB.formRuleMgr.length(500)],
				"cssCode" : [LIB.formRuleMgr.length(100)],
				"cssType" : [LIB.formRuleMgr.length(100)],
				"domesticType" : [LIB.formRuleMgr.length(100)],
				"effectiveDate" : [LIB.formRuleMgr.allowStrEmpty],
				"effectiveLevel" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"icsCode" : [LIB.formRuleMgr.length(100)],
				"icsType" : [LIB.formRuleMgr.length(100)],
				"internationalType" : [LIB.formRuleMgr.length(100)],
				"isRevise" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"limitation" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"managerOrg" : [LIB.formRuleMgr.length(100)],
				"publishDate" : [LIB.formRuleMgr.allowStrEmpty],
				"publishOrg" : [LIB.formRuleMgr.length(100)],
				"revise" : [LIB.formRuleMgr.length(500)],
				"underOrg" : [LIB.formRuleMgr.length(100)],
	        }
		},
		tableModel : {
			standardChapterTableModel : LIB.Opts.extendDetailTableOpt({
				url : "standard/standardchapters/list/{curPage}/{pageSize}?criteria.orderValue.fieldName=orderNo&criteria.orderValue.orderType=0",
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
			standardChapterFormModel : {
				show : false,
				hiddenFields : ["standardId"],
				queryUrl : "standard/{id}/standardchapter/{standardChapterId}"
			},
			standardFormModel : {
				show : false,
				queryUrl : "standard/{id}"
			}
		},
		cardModel : {
			standardChapterCardModel : {
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
			"standardchapterFormModal":standardChapterFormModal,
			"standardFormModal":standardFormModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowStandardChapterFormModal4Update : function(param) {
				this.formModel.standardChapterFormModel.show = true;
				this.$refs.standardchapterFormModal.init("update", {id: this.mainModel.vo.id, standardChapterId: param.entry.data.id});
			},
			doShowStandardChapterFormModal4Create : function(param) {
				this.formModel.standardChapterFormModel.show = true;
				this.$refs.standardchapterFormModal.init("create");
			},
			doSaveStandardChapter : function(data) {
				if (data) {
					var _this = this;
					api.saveStandardChapter({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.standardchapterTable);
					});
				}
			},
			doUpdateStandardChapter : function(data) {
				if (data) {
					var _this = this;
					api.updateStandardChapter({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.standardchapterTable);
					});
				}
			},
			doRemoveStandardChapter : function(item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeStandardChapters({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							_this.$refs.standardchapterTable.doRefresh();
						});
					}
				});
			},
			doMoveStandardChapter : function(item) {
				var _this = this;
				var data = item.entry.data;
				var param = {
					id : data.id,
					standardId : dataModel.mainModel.vo.id
				};
				_.set(param, "criteria.intValue.offset", item.offset);
				api.moveStandardChapters({id : this.mainModel.vo.id}, param).then(function() {
					_this.$refs.standardchapterTable.doRefresh();
				});
			},
			doShowStandardFormModal4Update : function(data) {
				this.formModel.standardFormModel.show = true;
				this.$refs.standardFormModal.init("update", {id: this.mainModel.vo.id});
			},
			doUpdateStandard : function(data) {
				this.doUpdate(data);
			},
			afterInitData : function() {
				this.$refs.standardchapterTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.standardchapterTable.doClearData();
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