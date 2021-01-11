define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-tab-xl.html");
	var ptwCatalogSelectModal = require("componentsEx/selectTableModal/ptwCatalogSelectModal");
	var gasDetectionRecordSelectModal = require("componentsEx/selectTableModal/gasDetectionRecordSelectModal");
	var gasDetectionDetailFormModal = require("componentsEx/formModal/gasDetectionDetailFormModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//编码
			code : null,
			//数值
			value : null,
			//气体检测指标类型 1:有毒有害气体或蒸汽,2:可燃气体或蒸汽,3:氧气
			gasType : null,
			//启用/禁用 0:启用,1:禁用
			disable : "0",
			//气体类型
			gasCatalog : {id:'', name:''},
			//气体检测记录
			gasDetectionRecord : {id:'', name:''},
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
				"value" : [LIB.formRuleMgr.length(10)],
				"gasType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("气体检测指标类型")),
				"disable" :LIB.formRuleMgr.require("状态"),
				"gasCatalog.id" : [LIB.formRuleMgr.require("气体类型")],
				"gasDetectionRecord.id" : [LIB.formRuleMgr.require("气体检测记录")],
	        }
		},
		tableModel : {
		},
		formModel : {
			gasDetectionDetailFormModel : {
				show : false,
				queryUrl : "gasdetectiondetail/{id}"
			}
		},
		cardModel : {
		},
		selectModel : {
			gasCatalogSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			gasDetectionRecordSelectModel : {
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
			"ptwcatalogSelectModal":ptwCatalogSelectModal,
			"gasdetectionrecordSelectModal":gasDetectionRecordSelectModal,
			"gasdetectiondetailFormModal":gasDetectionDetailFormModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowGasCatalogSelectModal : function() {
				this.selectModel.gasCatalogSelectModel.visible = true;
				//this.selectModel.gasCatalogSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveGasCatalog : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.gasCatalog = selectedDatas[0];
				}
			},
			doShowGasDetectionRecordSelectModal : function() {
				this.selectModel.gasDetectionRecordSelectModel.visible = true;
				//this.selectModel.gasDetectionRecordSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveGasDetectionRecord : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.gasDetectionRecord = selectedDatas[0];
				}
			},
			doShowGasDetectionDetailFormModal4Update : function(data) {
				this.formModel.gasDetectionDetailFormModel.show = true;
				this.$refs.gasdetectiondetailFormModal.init("update", {id: this.mainModel.vo.id});
			},
			doUpdateGasDetectionDetail : function(data) {
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