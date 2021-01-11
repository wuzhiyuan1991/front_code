define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./casualtyFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//唯一标识
			code : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//人员归属 1:管理局员工,2:承包商员工
			affiliation : null,
			//死亡人数
			deathToll : null,
			//受伤人数
			injuryNumber : null,
			//事件背景及事件发生经过的详细描述
			remarks : null,
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
				"code" : [LIB.formRuleMgr.require("唯一标识"),
						  LIB.formRuleMgr.length(100)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"affiliation" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("人员归属")),
				"deathToll" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.require("死亡人数")),
				"injuryNumber" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.require("受伤人数")),
				"remarks" : [LIB.formRuleMgr.require("事故描述"),
					LIB.formRuleMgr.length(300, 10)],
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