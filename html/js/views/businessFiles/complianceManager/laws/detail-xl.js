define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var lawsChapterFormModal = require("componentsEx/formModal/lawsChapterFormModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//角色编码
			code : null,
			//法规名称
			name : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//废止信息
			annulment : null,
			//废止日期
			annulmentDate : null,
			//实施日期
			effectiveDate : null,
			//效力级别 1:国际公约,2:宪法,3:法律,4:行政法规,5:国务院部门规章,6:地方性法规,7:地方性部门规章,8:行业规定,9:团体规定,10:司法解释
			effectiveLevel : null,
			//是否是已修订 0:不是,1:是(页面只显示未修订的)
			isRevise : null,
			//发文字号
			issuedNumber : null,
			//时效性 1:现行有效,2:已经修改,3:等待实行,4:废止
			limitation : null,
			//发布机关
			publishAuthority : null,
			//发布日期
			publishDate : null,
			//
			remark : null,
			//法规简述
			resume : null,
			//修订信息
			revise : null,
			//章节
			lawsChapters : [],
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
				"name" : [LIB.formRuleMgr.require("法规名称"),
						  LIB.formRuleMgr.length(100)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"annulment" : [LIB.formRuleMgr.length(500)],
				"annulmentDate" : [LIB.formRuleMgr.allowStrEmpty],
				"effectiveDate" : [LIB.formRuleMgr.allowStrEmpty],
				"effectiveLevel" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"isRevise" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"issuedNumber" : [LIB.formRuleMgr.length(200)],
				"limitation" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"publishAuthority" : [LIB.formRuleMgr.length(200)],
				"publishDate" : [LIB.formRuleMgr.allowStrEmpty],
				"remark" : [LIB.formRuleMgr.length(500)],
				"resume" : [LIB.formRuleMgr.length(500)],
				"revise" : [LIB.formRuleMgr.length(500)],
	        }
		},
		tableModel : {
			lawsChapterTableModel : LIB.Opts.extendDetailTableOpt({
				url : "laws/lawschapters/list/{curPage}/{pageSize}?criteria.orderValue.fieldName=orderNo&criteria.orderValue.orderType=0",
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
			lawsChapterFormModel : {
				show : false,
				hiddenFields : ["lawsId"],
				queryUrl : "laws/{id}/lawschapter/{lawsChapterId}"
			},
		},
		cardModel : {
			lawsChapterCardModel : {
				showContent : true
			},
		},
		selectModel : {
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
			"lawschapterFormModal":lawsChapterFormModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowLawsChapterFormModal4Update : function(param) {
				this.formModel.lawsChapterFormModel.show = true;
				this.$refs.lawschapterFormModal.init("update", {id: this.mainModel.vo.id, lawsChapterId: param.entry.data.id});
			},
			doShowLawsChapterFormModal4Create : function(param) {
				this.formModel.lawsChapterFormModel.show = true;
				this.$refs.lawschapterFormModal.init("create");
			},
			doSaveLawsChapter : function(data) {
				if (data) {
					var _this = this;
					api.saveLawsChapter({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.lawschapterTable);
					});
				}
			},
			doUpdateLawsChapter : function(data) {
				if (data) {
					var _this = this;
					api.updateLawsChapter({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.lawschapterTable);
					});
				}
			},
			doRemoveLawsChapter : function(item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeLawsChapters({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							_this.$refs.lawschapterTable.doRefresh();
						});
					}
				});
			},
			doMoveLawsChapter : function(item) {
				var _this = this;
				var data = item.entry.data;
				var param = {
					id : data.id,
					lawsId : dataModel.mainModel.vo.id
				};
				_.set(param, "criteria.intValue.offset", item.offset);
				api.moveLawsChapters({id : this.mainModel.vo.id}, param).then(function() {
					_this.$refs.lawschapterTable.doRefresh();
				});
			},
			afterInitData : function() {
				this.$refs.lawschapterTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.lawschapterTable.doClearData();
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