define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./riCheckItemParamFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//禁用标识 0:未禁用,1:已禁用
			disable : null,
			//单位
			unit : null,
			//较大值
			bigValue : null,
			//最大值
			maxValue : null,
			//最小值
			minValue : null,
			//较小值
			smallValue : null,
			//标准值
			standardValue : null,
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
				"unit" : [LIB.formRuleMgr.require("单位"),
						  LIB.formRuleMgr.length()
				],
				"bigValue" : [LIB.formRuleMgr.length()],
				"maxValue" : [LIB.formRuleMgr.length()],
				"minValue" : [LIB.formRuleMgr.length()],
				"smallValue" : [LIB.formRuleMgr.length()],
				"standardValue" : [LIB.formRuleMgr.length()],	
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