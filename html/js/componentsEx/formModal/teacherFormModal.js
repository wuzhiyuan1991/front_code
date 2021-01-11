define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./teacherFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//教师id
			id : null,
			//唯一标识
			code : null,
			//教师名称
			name : null,
			//
			compId : null,
			//组织id
			orgId : null,
			//现居地
			address : null,
			//讲师介绍
			career : null,
			//禁用标识， 1:已禁用，0：未禁用，null:未禁用
			disable : null,
			//邮箱
			email : null,
			//家乡
			hometown : null,
			//兴趣爱好
			interest : null,
			//手机号码
			mobile : null,
			//图片路径
			picPath : null,
			//qq号
			qq : null,
			//性别 0女 1男
			sex : null,
			//来源 
			source : null,
			//专长
			speciality : null,
			//微博
			weibo : null,
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
				"name" : [LIB.formRuleMgr.length()],
				"address" : [LIB.formRuleMgr.length()],
				"career" : [LIB.formRuleMgr.length()],
				"disable" : [LIB.formRuleMgr.length()],
				"email" : [LIB.formRuleMgr.length()],
				"hometown" : [LIB.formRuleMgr.length()],
				"interest" : [LIB.formRuleMgr.length()],
				"mobile" : [LIB.formRuleMgr.length()],
				"picPath" : [LIB.formRuleMgr.length()],
				"qq" : [LIB.formRuleMgr.length()],
				"sex" : [LIB.formRuleMgr.length()],
				"source" : [LIB.formRuleMgr.length()],
				"speciality" : [LIB.formRuleMgr.length()],
				"weibo" : [LIB.formRuleMgr.length()],
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