define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./equipmentItemFormModal.html");
	var equipmentSelectModal = require("componentsEx/selectTableModal/equipmentSelectModal");

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
			opType : 'create',
			isReadOnly : false,
			title:"添加",

			//验证规则
	        rules:{
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"code" : [LIB.formRuleMgr.require("编码"),
						  LIB.formRuleMgr.length()
				],
				"name" : [
                    LIB.formRuleMgr.require("名称"),
					LIB.formRuleMgr.length()
				],
				"serialNumber" : [LIB.formRuleMgr.require("序列号"),
						  LIB.formRuleMgr.length()
				],
				"disable" : [LIB.formRuleMgr.length()],
				"retirementDate" : [LIB.formRuleMgr.length()],
				"warranty" : [
					{type:'number', required: true, message: '请输入正确保修期'},
					{type:'integer', min:0, max: 9999, message: '请输入0-9999之间的整数'},
                    {
                        validator: function(rule, value, callback) {
                            var r = /^[0-9]*[1-9][0-9]*$/g;
                            var isNegative = r.test(value);
                            return isNegative ? callback() : callback(new Error("请输入0-9999之间的整数"));
                        }
                    }
				],
				"warrantyPeriod" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		},
		selectModel : {
			equipmentSelectModel : {
				visible : false
			},
		},
	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"equipmentSelectModal":equipmentSelectModal,
			
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
			
		}
	});
	
	return detail;
});