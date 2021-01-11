define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./riCheckItemFormModal.html");
	var riCheckItemParamSelectModal = require("componentsEx/selectTableModal/riCheckItemParamSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//巡检项名称
			name : null,
			//禁用标识 0:未禁用,1:已禁用
			disable : null,
			//巡检依据
			checkBasis : null,
			//巡检内容
			content : null,
			//是否读取现场参数值 0:不需要,1:需要
			isMeterReadingNeeded : null,
			//关联类型 1:自身,2:设备设施
			refType : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//巡检项参数
			riCheckItemParam : {id:'', value1:"", value2:"", value3:"", value4:"", value5:"",unit:""},
			//适用设备状态
			riCheckItemEquipmentStateRels : [],
			equipmentStates:[],
			//巡检类型
			riCheckTypes : [],
			//巡检结果
			riCheckResults : [],
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
				"code" : [LIB.formRuleMgr.length()],
				"name" : [LIB.formRuleMgr.length()],
				"disable" : LIB.formRuleMgr.range(1, 100).concat(LIB.formRuleMgr.require("状态")),
				"checkBasis" : [LIB.formRuleMgr.length()],
				"content" : [LIB.formRuleMgr.length()],
				"equipmentStatus" : LIB.formRuleMgr.range(1, 100),
				"isMeterReadingNeeded" : LIB.formRuleMgr.range(1, 100),
				"refType" : LIB.formRuleMgr.range(1, 100),	
	        },
	        emptyRules:{}
		},
		selectModel : {
			riCheckItemParamSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"richeckitemparamSelectModal":riCheckItemParamSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowRiCheckItemParamSelectModal : function() {
				this.selectModel.riCheckItemParamSelectModel.visible = true;
				//this.selectModel.riCheckItemParamSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveRiCheckItemParam : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.riCheckItemParam = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});