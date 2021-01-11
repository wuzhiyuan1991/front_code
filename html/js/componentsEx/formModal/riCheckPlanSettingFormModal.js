define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./riCheckPlanSettingFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//
			code : null,
			//禁用标识 0:未禁用,1:已禁用
			disable : null,
			//结束时间
			endTime : null,
			//频率类型 1天 2周 3月 4季度 5自定义
			frequencyType : null,
			//是否重复 0执行一次 1执行多次
			isRepeatable : null,
			//是否包含周末 0不包含 1包含（frequency_type=1时生效）
			isWeekendInculed : null,
			//时间间隔
			period : null,
			//开始时间
			startTime : null,
			//间隔单位 1分钟 2小时 3天 4周 5月 6季度
			unit : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
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
				"disable" : LIB.formRuleMgr.range(1, 100).concat(LIB.formRuleMgr.require("状态")),
				"endTime" : [LIB.formRuleMgr.length()],
				"frequencyType" : LIB.formRuleMgr.range(1, 100),
				"isRepeatable" : LIB.formRuleMgr.range(1, 100),
				"isWeekendInculed" : LIB.formRuleMgr.range(1, 100),
				"period" : LIB.formRuleMgr.range(1, 100),
				"startTime" : [LIB.formRuleMgr.length()],
				"unit" : LIB.formRuleMgr.range(1, 100),	
	        },
	        emptyRules:{}
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