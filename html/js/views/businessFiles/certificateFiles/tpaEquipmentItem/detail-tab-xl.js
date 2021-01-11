define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-tab-xl.html");
	var tpaEquipmentSelectModal = require("componentsEx/selectTableModal/tpaEquipmentSelectModal");
	var tpaEquipmentItemFormModal = require("componentsEx/formModal/tpaEquipmentItemFormModal");
	
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
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//设备类型
			tpaEquipment : {id:'', name:''},
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
			tpaEquipmentItemFormModel : {
				show : false,
				queryUrl : "tpaequipmentitem/{id}"
			}
		},
		cardModel : {
		},
		selectModel : {
			tpaEquipmentSelectModel : {
				visible : false,
				filterData : {orgId : null}
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
			"tpaequipmentSelectModal":tpaEquipmentSelectModal,
			"tpaequipmentitemFormModal":tpaEquipmentItemFormModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowTpaEquipmentSelectModal : function() {
				this.selectModel.tpaEquipmentSelectModel.visible = true;
				//this.selectModel.tpaEquipmentSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveTpaEquipment : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.tpaEquipment = selectedDatas[0];
				}
			},
			doShowTpaEquipmentItemFormModal4Update : function(data) {
				this.formModel.tpaEquipmentItemFormModel.show = true;
				this.$refs.tpaequipmentitemFormModal.init("update", {id: this.mainModel.vo.id});
			},
			doUpdateTpaEquipmentItem : function(data) {
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