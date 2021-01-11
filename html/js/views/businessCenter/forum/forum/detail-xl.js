define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var articleReplyFormModal = require("componentsEx/formModal/articleReplyFormModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//编码
			code : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//公司Id
			compId : null,
			//部门Id
			orgId : null,
			//
			content : null,
			//关键词
			keyword : null,
			//发布时间
			lastReplyDate : null,
			//发布时间
			publishDate : null,
			//回复次数
			replyTime : null,
			//发布状态 0：未发布，1：已发布
			state : null,
			//帖子标题
			title : null,
			//查看次数
			viewTime : null,
			//作者
			user : {id:'', name:''},
			//回复
			articleReplies : [],
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
				"compId" : [LIB.formRuleMgr.require("公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"content" : [LIB.formRuleMgr.length(65535)],
				"keyword" : [LIB.formRuleMgr.length(4000)],
				"lastReplyDate" : [LIB.formRuleMgr.allowStrEmpty],
				"publishDate" : [LIB.formRuleMgr.allowStrEmpty],
				"replyTime" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"state" : [LIB.formRuleMgr.length(10)],
				"title" : [LIB.formRuleMgr.length(10)],
				"viewTime" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"user.id" : [LIB.formRuleMgr.allowStrEmpty],
	        }
		},
		tableModel : {
			articleReplyTableModel : LIB.Opts.extendDetailTableOpt({
				url : "techarticle/articlereplies/list/{curPage}/{pageSize}",
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
			articleReplyFormModel : {
				show : false,
				hiddenFields : ["articleId"],
				queryUrl : "techarticle/{id}/articlereply/{articleReplyId}"
			},
		},
		cardModel : {
			articleReplyCardModel : {
				showContent : true
			},
		},
		selectModel : {
			userSelectModel : {
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
			"articlereplyFormModal":articleReplyFormModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowUserSelectModal : function() {
				this.selectModel.userSelectModel.visible = true;
				//this.selectModel.userSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveUser : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.user = selectedDatas[0];
				}
			},
			doShowArticleReplyFormModal4Update : function(param) {
				this.formModel.articleReplyFormModel.show = true;
				this.$refs.articlereplyFormModal.init("update", {id: this.mainModel.vo.id, articleReplyId: param.entry.data.id});
			},
			doShowArticleReplyFormModal4Create : function(param) {
				this.formModel.articleReplyFormModel.show = true;
				this.$refs.articlereplyFormModal.init("create");
			},
			doSaveArticleReply : function(data) {
				if (data) {
					var _this = this;
					api.saveArticleReply({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.articlereplyTable);
					});
				}
			},
			doUpdateArticleReply : function(data) {
				if (data) {
					var _this = this;
					api.updateArticleReply({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.articlereplyTable);
					});
				}
			},
			doRemoveArticleReply : function(item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeArticleReplies({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							_this.$refs.articlereplyTable.doRefresh();
						});
					}
				});
			},
			afterInitData : function() {
				this.$refs.articlereplyTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.articlereplyTable.doClearData();
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