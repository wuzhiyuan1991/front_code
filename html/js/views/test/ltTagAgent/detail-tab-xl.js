define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-tab-xl.html");
	var organizationSelectModal = require("componentsEx/selectTableModal/organizationSelectModal");
	var ltTagAgentFormModal = require("componentsEx/formModal/ltTagAgentFormModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//标签类型
			tagType : null,
			//禁用标识 0:未禁用,1:已禁用
			disable : "0",
			//标签名称
			tagName : null,
			//所属公司
			compId : null,
			//所属部门
			orgId : null,
			//员工
			org : {id:'', name:''},
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
				"tagType" : [LIB.formRuleMgr.require("标签类型"),
						  LIB.formRuleMgr.length(100)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"tagName" : [LIB.formRuleMgr.require("标签名称"),
						  LIB.formRuleMgr.length(100)
				],
				"compId" : [LIB.formRuleMgr.require("所属公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"org.id" : [LIB.formRuleMgr.require("员工")],
	        }
		},
		tableModel : {
		},
		formModel : {
			ltTagAgentFormModel : {
				show : false,
				queryUrl : "lttagagent/{id}"
			}
		},
		cardModel : {
		},
		selectModel : {
			orgSelectModel : {
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
			"organizationSelectModal":organizationSelectModal,
			"lttagagentFormModal":ltTagAgentFormModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowOrgSelectModal : function() {
				this.selectModel.orgSelectModel.visible = true;
				//this.selectModel.orgSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveOrg : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.org = selectedDatas[0];
				}
			},
			doShowLtTagAgentFormModal4Update : function(data) {
				this.formModel.ltTagAgentFormModel.show = true;
				this.$refs.lttagagentFormModal.init("update", {id: this.mainModel.vo.id});
			},
			doUpdateLtTagAgent : function(data) {
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