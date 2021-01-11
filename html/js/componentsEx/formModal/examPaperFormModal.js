define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./examPaperFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//主键
			id : null,
			//唯一标识
			code : null,
			//试卷名称
			name : null,
			//
			compId : null,
			//组织机构id
			orgId : null,
			//禁用标识， 1:已禁用，0：未禁用，null:未禁用
			disable : null,
			//试卷描述
			info : null,
			//试题总数
			qstCount : null,
			//限制答题的时间 单位分钟
			replyTime : null,
			//试卷总分
			score : null,
			//试卷类型 0手动组卷 1随机组卷
			type : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//大题
			paperTopics : [],
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
				"disable" : [LIB.formRuleMgr.length()],
				"info" : [LIB.formRuleMgr.length()],
				"qstCount" : [LIB.formRuleMgr.length()],
				"replyTime" : [LIB.formRuleMgr.length()],
				"score" : [LIB.formRuleMgr.length()],
				"type" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		}
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