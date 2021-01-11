define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-tab-xl.html");
	var adminLicenseSelectModal = require("componentsEx/selectTableModal/adminLicenseSelectModal");
	var adminLicenseProcessFormModal = require("views/businessFiles/complianceManager/adminLicense/dialog/adminLicenseProcessFormModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//角色编码
			code : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//内容
			content : null,
			//操作 1:企业初次申请,2:企业变更申请,3:企业延续申请,4:政府审查,5:政府批准,6:企业修订,10:其他
			operate : null,
			//操作时间
			operateDate : null,
			//行政许可
			adminLicense : {id:'', name:''},
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
				"disable" :LIB.formRuleMgr.require("状态"),
				"content" : [LIB.formRuleMgr.length(500)],
				"operate" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"operateDate" : [LIB.formRuleMgr.allowStrEmpty],
				"adminLicense.id" : [LIB.formRuleMgr.allowStrEmpty],
	        }
		},
		tableModel : {
		},
		formModel : {
			adminLicenseProcessFormModel : {
				show : false,
				queryUrl : "adminlicenseprocess/{id}"
			}
		},
		cardModel : {
		},
		selectModel : {
			adminLicenseSelectModel : {
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
			"adminlicenseSelectModal":adminLicenseSelectModal,
			"adminlicenseprocessFormModal":adminLicenseProcessFormModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowAdminLicenseSelectModal : function() {
				this.selectModel.adminLicenseSelectModel.visible = true;
				//this.selectModel.adminLicenseSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveAdminLicense : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.adminLicense = selectedDatas[0];
				}
			},
			doShowAdminLicenseProcessFormModal4Update : function(data) {
				this.formModel.adminLicenseProcessFormModel.show = true;
				this.$refs.adminlicenseprocessFormModal.init("update", {id: this.mainModel.vo.id});
			},
			doUpdateAdminLicenseProcess : function(data) {
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