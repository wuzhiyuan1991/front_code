define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./tpaEquipmentFormModal.html");
	var tpaEquipmentTypeSelectModal = require("componentsEx/selectTableModal/tpaEquipmentTypeSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//id
			id : null,
			//设备编号
			code : null,
			//设备设施名称
			name : null,
			//所属公司
			compId : null,
			//所属部门
			orgId : null,
			//是否禁用 0启用，1禁用
			disable : null,
			//报废日期
			retirementDate : null,
			//设备设施状态 0再用,1停用,2报废
			state : null,
			//设备型号
			version : null,
			//保修期(月)
			warranty : null,
			//保修终止日期 根据保修期自动算出
			warrantyPeriod : null,
			//设备更新日期
			modifyDate : null,
			//设备登记日期
			createDate : null,
			//设备类型
			tpaEquipmentType : {id:'', name:''},
			//设备设施子项
			tpaEquipmentItems : [],
		}
	};

	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'create',
			isReadOnly : false,
			title:"添加",

			//验证规则
	        rules:{
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"code" : [LIB.formRuleMgr.require("设备编号"),
						  LIB.formRuleMgr.length()
				],
				"name" : [LIB.formRuleMgr.length()],
				"disable" : [LIB.formRuleMgr.length()],
				"retirementDate" : [LIB.formRuleMgr.length()],
				"state" : [LIB.formRuleMgr.length()],
				"version" : [LIB.formRuleMgr.length()],
				"warranty" : [LIB.formRuleMgr.length()],
				"warrantyPeriod" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		},
		selectModel : {
			tpaEquipmentTypeSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"tpaequipmenttypeSelectModal":tpaEquipmentTypeSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowTpaEquipmentTypeSelectModal : function() {
				this.selectModel.tpaEquipmentTypeSelectModel.visible = true;
				//this.selectModel.tpaEquipmentTypeSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveTpaEquipmentType : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.tpaEquipmentType = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});