define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-tab-xl.html");
	var idaCourseKpointSelectModal = require("componentsEx/selectTableModal/idaCourseKpointSelectModal");
	var idaDutySubjectSelectModal = require("componentsEx/selectTableModal/idaDutySubjectSelectModal");
	var idaDutyAbilityFormModal = require("componentsEx/formModal/idaDutyAbilityFormModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//编码
			code : null,
			//履职能力要求
			ability : null,
			//分组
			group : null,
			//职责描述
			duty : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//公司id
			compId : null,
			//部门id
			orgId : null,
			//章节
			idaCourseKpoint : {id:'', name:''},
			//岗位分类
			idaDutySubject : {id:'', name:''},
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
				"ability" : [LIB.formRuleMgr.require("履职能力要求"),
						  LIB.formRuleMgr.length(100)
				],
				"group" : [LIB.formRuleMgr.require("分组"),
						  LIB.formRuleMgr.length(100)
				],
				"duty" : [LIB.formRuleMgr.require("职责描述"),
						  LIB.formRuleMgr.length(100)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"compId" : [LIB.formRuleMgr.require("公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"idaCourseKpoint.id" : [LIB.formRuleMgr.allowStrEmpty],
				"idaDutySubject.id" : [LIB.formRuleMgr.require("岗位分类")],
	        }
		},
		tableModel : {
		},
		formModel : {
			idaDutyAbilityFormModel : {
				show : false,
				queryUrl : "idadutyability/{id}"
			}
		},
		cardModel : {
		},
		selectModel : {
			idaCourseKpointSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			idaDutySubjectSelectModel : {
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
			"idacoursekpointSelectModal":idaCourseKpointSelectModal,
			"idadutysubjectSelectModal":idaDutySubjectSelectModal,
			"idadutyabilityFormModal":idaDutyAbilityFormModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowIdaCourseKpointSelectModal : function() {
				this.selectModel.idaCourseKpointSelectModel.visible = true;
				//this.selectModel.idaCourseKpointSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveIdaCourseKpoint : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.idaCourseKpoint = selectedDatas[0];
				}
			},
			doShowIdaDutySubjectSelectModal : function() {
				this.selectModel.idaDutySubjectSelectModel.visible = true;
				//this.selectModel.idaDutySubjectSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveIdaDutySubject : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.idaDutySubject = selectedDatas[0];
				}
			},
			doShowIdaDutyAbilityFormModal4Update : function(data) {
				this.formModel.idaDutyAbilityFormModel.show = true;
				this.$refs.idadutyabilityFormModal.init("update", {id: this.mainModel.vo.id});
			},
			doUpdateIdaDutyAbility : function(data) {
				this.doUpdate(data);
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