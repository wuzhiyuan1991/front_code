define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-tab-xl.html");
	var equipmentSelectModal = require("componentsEx/selectTableModal/equipmentSelectModal");
	var equipmentItemFormModal = require("componentsEx/formModal/equipmentItemFormModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
			//id
			id : null,
			//编码
			code : null,
			//设备设施子件名称
			name : null,
			//序列号
			serialNumber : null,
			//是否禁用 0启用，1禁用
			disable : null,
			//报废日期
			retirementDate : null,
			//保修期(月)
			warranty : null,
			//保修终止日期 根据保修期自动算出保修终止日期
			warrantyPeriod : null,
			//设备更新日期
			modifyDate : null,
			//设备登记日期
			createDate : null,
			//设备设施
			equipment : {id:'', name:''},
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
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"code" : [LIB.formRuleMgr.require("编码"),
						  LIB.formRuleMgr.length()
				],
				"name" : [LIB.formRuleMgr.length()],
				"serialNumber" : [LIB.formRuleMgr.require("序列号"),
						  LIB.formRuleMgr.length()
				],
				"disable" : [LIB.formRuleMgr.length()],
				"retirementDate" : [LIB.formRuleMgr.length()],
				"warranty" : [LIB.formRuleMgr.length()],
				"warrantyPeriod" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		},
		tableModel : {
		},
		formModel : {
			equipmentItemFormModel : {
				show : false,
				queryUrl : "equipmentitem/{id}"
			}
		},
		cardModel : {
		},
		selectModel : {
			equipmentSelectModel : {
				visible : false
			},
		},

	};
	//Vue组件
	/**
	 *  请统一使用以下顺序配置Vue参数，方便codeview
	 *	el
	 template
	 components
	 componentName
	 props
	 data
	 computed
	 watch
	 methods
	 events
	 vue组件声明周期方法
	 created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
	 **/
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailTabXlPanel],
		template: tpl,
		components : {
			"equipmentSelectModal":equipmentSelectModal,
			"equipmentitemFormModal":equipmentItemFormModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowEquipmentSelectModal : function() {
				this.selectModel.equipmentSelectModel.visible = true;
			},
			doSaveEquipment : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.equipment = selectedDatas[0];
				}
			},
			doShowEquipmentItemFormModal4Update : function(data) {
				this.formModel.equipmentItemFormModel.show = true;
				this.$refs.equipmentitemFormModal.init("update", {id: this.mainModel.vo.id});
			},
			doUpdateEquipmentItem : function(data) {
				this.doUpdate(data);
			},

		},
		events : {
		},
        ready: function(){
        	this.$api = api;
        }
	});

	return detail;
});