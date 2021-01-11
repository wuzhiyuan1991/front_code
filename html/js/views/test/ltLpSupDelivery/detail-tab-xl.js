define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-tab-xl.html");
	var ltLpSupSelectModal = require("componentsEx/selectTableModal/ltLpSupSelectModal");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var ltLpSupDeliveryFormModal = require("componentsEx/formModal/ltLpSupDeliveryFormModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//编号
			code : null,
			//禁用标识 0:未禁用,1:已禁用
			disable : "0",
			//领用日期
			receiverDate : null,
			//领用数量
			quantity : null,
			//所属公司
			compId : null,
			//所属部门
			orgId : null,
			//劳保用品
			sup : {id:'', name:''},
			//领用人
			receiver : {id:'', name:''},
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
				"receiverDate" : [LIB.formRuleMgr.require("领用日期")],
				"quantity" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.require("领用数量")),
				"compId" : [LIB.formRuleMgr.require("所属公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"sup.id" : [LIB.formRuleMgr.require("劳保用品")],
				"receiver.id" : [LIB.formRuleMgr.require("领用人")],
	        }
		},
		tableModel : {
		},
		formModel : {
			ltLpSupDeliveryFormModel : {
				show : false,
				queryUrl : "ltlpsupdelivery/{id}"
			}
		},
		cardModel : {
		},
		selectModel : {
			supSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			receiverSelectModel : {
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
			"ltlpsupSelectModal":ltLpSupSelectModal,
			"userSelectModal":userSelectModal,
			"ltlpsupdeliveryFormModal":ltLpSupDeliveryFormModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowSupSelectModal : function() {
				this.selectModel.supSelectModel.visible = true;
				//this.selectModel.supSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveSup : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.sup = selectedDatas[0];
				}
			},
			doShowReceiverSelectModal : function() {
				this.selectModel.receiverSelectModel.visible = true;
				//this.selectModel.receiverSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveReceiver : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.receiver = selectedDatas[0];
				}
			},
			doShowLtLpSupDeliveryFormModal4Update : function(data) {
				this.formModel.ltLpSupDeliveryFormModel.show = true;
				this.$refs.ltlpsupdeliveryFormModal.init("update", {id: this.mainModel.vo.id});
			},
			doUpdateLtLpSupDelivery : function(data) {
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