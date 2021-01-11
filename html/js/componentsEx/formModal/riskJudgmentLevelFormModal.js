define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./riskJudgmentLevelFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//
			name : null,
			//暂时不用
			type : null,
			//承诺
			promise : null,
			//额定完成时间
			ratedCompleteDate : null,
			//备注
			remark : null,
			//模板
			riskTemplateConfig : {id:'', name:''},
			//风险研判
			riskJudgment : {id:'', name:''},
			//研判单位
			riskJudgmentUnits : [],
			//组
			riskJudgmentGroups : [],
		}
	};

	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'create',
			isReadOnly : false,
			title:"添加",
			name:'研判层级名称',
			//验证规则
	        rules:{
				"name" : [LIB.formRuleMgr.length(100), LIB.formRuleMgr.require("风险研判")],
				"type" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.require("暂时不用")),
				"promise" : [LIB.formRuleMgr.length(2000)],
				"ratedCompleteDate" : [LIB.formRuleMgr.allowStrEmpty],
				"remark" : [LIB.formRuleMgr.length(200)],
				"riskTemplateConfig.id" : [LIB.formRuleMgr.allowStrEmpty],
				"riskJudgment.id" : [LIB.formRuleMgr.require("风险研判")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			riskTemplateConfigSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			riskJudgmentSelectModel : {
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