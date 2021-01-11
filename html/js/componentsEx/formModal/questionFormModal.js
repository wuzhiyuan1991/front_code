define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./questionFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//主键
			id : null,
			//唯一标识
			code : null,
			//
			compId : null,
			//组织机构id
			orgId : null,
			//正确率
			accuracy : null,
			//试题解析
			analysis : null,
			//正确选项
			answer : null,
			//试题内容
			content : null,
			//禁用标识， 1:已禁用，0：未禁用，null:未禁用
			disable : null,
			//该试题被做错过多少次
			errorTime : null,
			//标志
			flag : null,
			//该试题被做正确过多少道
			rightTime : null,
			//做过的次数
			time : null,
			//试题类型 1单选题 2多选题 3判断题 4不定项题
			type : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//选项
			opts : [],
			//考点
			examPoints : [],
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
				"accuracy" : [LIB.formRuleMgr.length()],
				"analysis" : [LIB.formRuleMgr.length()],
				"answer" : [LIB.formRuleMgr.length()],
				"content" : [LIB.formRuleMgr.length()],
				"disable" : [LIB.formRuleMgr.length()],
				"errorTime" : [LIB.formRuleMgr.length()],
				"flag" : [LIB.formRuleMgr.length()],
				"rightTime" : [LIB.formRuleMgr.length()],
				"time" : [LIB.formRuleMgr.length()],
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