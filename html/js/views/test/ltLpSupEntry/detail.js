define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	// var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var ltLpSupSelectModal = require("componentsEx/selectTableModal/ltLpSupSelectModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
			id : null,
			//编号
			code : null,
			//禁用标识 0:未禁用,1:已禁用
			disable : "0",
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
			sup : {id:'', name:'', model:'', unit:''},
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
				"totalAmount" : LIB.formRuleMgr.range(0, 99999999, 2).concat(LIB.formRuleMgr.require("物品价值(元)")),
				"storageDate" : [LIB.formRuleMgr.require("入库日期")],
				"quantity" : LIB.formRuleMgr.range(0, 99999999).concat(LIB.formRuleMgr.require("数量")),
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
			// "userSelectModal":userSelectModal,
			"ltlpsupSelectModal":ltLpSupSelectModal,
			
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

		},
		events : {
		},
    	init: function(){
        	this.$api = api;
        }
	});

	return detail;
});