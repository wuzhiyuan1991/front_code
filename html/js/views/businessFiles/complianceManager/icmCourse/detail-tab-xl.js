define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-tab-xl.html");
	var icmCourseKpointFormModal = require("componentsEx/formModal/icmCourseKpointFormModal");
	var icmCourseFormModal = require("componentsEx/formModal/icmCourseFormModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//编码
			code : null,
			//课程名称
			name : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//所属公司
			compId : null,
			//所属部门
			orgId : null,
			//分类
			classification : null,
			//课程描述
			description : null,
			//课程章节
			icmCourseKpoints : [],
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
				"code" : [LIB.formRuleMgr.require("编码"),
						  LIB.formRuleMgr.length(100)
				],
				"name" : [LIB.formRuleMgr.length(200)],
				"disable" :LIB.formRuleMgr.require("状态"),
				"compId" : [LIB.formRuleMgr.require("所属公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"classification" : [LIB.formRuleMgr.length(100)],
				"description" : [LIB.formRuleMgr.length(500)],
	        }
		},
		tableModel : {
			icmCourseKpointTableModel : LIB.Opts.extendDetailTableOpt({
				url : "icmcourse/icmcoursekpoints/list/{curPage}/{pageSize}",
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
			icmCourseKpointFormModel : {
				show : false,
				hiddenFields : ["courseId"],
				queryUrl : "icmcourse/{id}/icmcoursekpoint/{icmCourseKpointId}"
			},
			icmCourseFormModel : {
				show : false,
				queryUrl : "icmcourse/{id}"
			}
		},
		cardModel : {
			icmCourseKpointCardModel : {
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
			"icmcoursekpointFormModal":icmCourseKpointFormModal,
			"icmcourseFormModal":icmCourseFormModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowIcmCourseKpointFormModal4Update : function(param) {
				this.formModel.icmCourseKpointFormModel.show = true;
				this.$refs.icmcoursekpointFormModal.init("update", {id: this.mainModel.vo.id, icmCourseKpointId: param.entry.data.id});
			},
			doShowIcmCourseKpointFormModal4Create : function(param) {
				this.formModel.icmCourseKpointFormModel.show = true;
				this.$refs.icmcoursekpointFormModal.init("create");
			},
			doSaveIcmCourseKpoint : function(data) {
				if (data) {
					var _this = this;
					api.saveIcmCourseKpoint({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.icmcoursekpointTable);
					});
				}
			},
			doUpdateIcmCourseKpoint : function(data) {
				if (data) {
					var _this = this;
					api.updateIcmCourseKpoint({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.icmcoursekpointTable);
					});
				}
			},
			doRemoveIcmCourseKpoint : function(item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeIcmCourseKpoints({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							_this.$refs.icmcoursekpointTable.doRefresh();
						});
					}
				});
			},
			doShowIcmCourseFormModal4Update : function(data) {
				this.formModel.icmCourseFormModel.show = true;
				this.$refs.icmcourseFormModal.init("update", {id: this.mainModel.vo.id});
			},
			doUpdateIcmCourse : function(data) {
				this.doUpdate(data);
			},
			afterInitData : function() {
				this.$refs.icmcoursekpointTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.icmcoursekpointTable.doClearData();
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