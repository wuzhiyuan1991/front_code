define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-tab-xl.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var ltLpSupSelectModal = require("componentsEx/selectTableModal/ltLpSupSelectModal");
	var ltLpSupEntryFormModal = require("componentsEx/formModal/ltLpSupEntryFormModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//编号
			code : null,
			//禁用标识 0:未禁用,1:已禁用
			disable : "0",
			//计量单位
			unit : null,
			//物品价值
			totalAmount : null,
			//入库日期
			storageDate : null,
			//数量
			quantity : null,
			//供应商
			supplierName : null,
			//所属公司
			compId : null,
			//所属部门
			orgId : null,
			//负责人
			owner : {id:'', name:''},
			//劳保用品
			sup : {id:'', name:''},
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
				"code" : [LIB.formRuleMgr.require("编号"),
						  LIB.formRuleMgr.length(200)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"unit" : [LIB.formRuleMgr.require("计量单位"),
						  LIB.formRuleMgr.length(100)
				],
				"totalAmount" : LIB.formRuleMgr.range(1, 100, 2).concat(LIB.formRuleMgr.require("物品价值")),
				"storageDate" : [LIB.formRuleMgr.require("入库日期")],
				"quantity" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.require("数量")),
				"supplierName" : [LIB.formRuleMgr.require("供应商"),
						  LIB.formRuleMgr.length(100)
				],
				"compId" : [LIB.formRuleMgr.require("所属公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"owner.id" : [LIB.formRuleMgr.require("负责人")],
				"sup.id" : [LIB.formRuleMgr.require("劳保用品")],
	        }
		},
		tableModel : {
		},
		formModel : {
			ltLpSupEntryFormModel : {
				show : false,
				queryUrl : "ltlpsupentry/{id}"
			}
		},
		cardModel : {
		},
		selectModel : {
			ownerSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			supSelectModel : {
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
			"userSelectModal":userSelectModal,
			"ltlpsupSelectModal":ltLpSupSelectModal,
			"ltlpsupentryFormModal":ltLpSupEntryFormModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowOwnerSelectModal : function() {
				this.selectModel.ownerSelectModel.visible = true;
				//this.selectModel.ownerSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveOwner : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.owner = selectedDatas[0];
				}
			},
			doShowSupSelectModal : function() {
				this.selectModel.supSelectModel.visible = true;
				//this.selectModel.supSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveSup : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.sup = selectedDatas[0];
				}
			},
			doShowLtLpSupEntryFormModal4Update : function(data) {
				this.formModel.ltLpSupEntryFormModel.show = true;
				this.$refs.ltlpsupentryFormModal.init("update", {id: this.mainModel.vo.id});
			},
			doUpdateLtLpSupEntry : function(data) {
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