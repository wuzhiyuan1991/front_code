define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./riDutyRecordItemFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//电池压力
			batteryPressure : null,
			//气缸压力
			cylinderPressure : null,
			//直流电压
			directVoltage : null,
			//压力
			pressure : null,
			//汇报时间
			reportTime : null,
			//温度
			temperature : null,
			//项
			riDutyRecordGroup : {id:'', name:''},
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
				"batteryPressure" : [LIB.formRuleMgr.length(255)],
				"cylinderPressure" : [LIB.formRuleMgr.length(255)],
				"directVoltage" : [LIB.formRuleMgr.length(255)],
				"pressure" : [LIB.formRuleMgr.length(255)],
				"reportTime" : [LIB.formRuleMgr.allowStrEmpty],
				"temperature" : [LIB.formRuleMgr.length(255)],
				"riDutyRecordGroup.id" : [LIB.formRuleMgr.allowStrEmpty],
	        },
	        emptyRules:{}
		},
		selectModel : {
			riDutyRecordGroupSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
		}
	});
	
	return detail;
});