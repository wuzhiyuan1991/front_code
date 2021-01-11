define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./svRandomCheckTableFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//记录表名
			name : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//内容
			content : null,
			//来源 0:手机检查,1:web录入,2 其他
			checkSource : null,
			//状态 1:待审核,2:已转隐患,3:被否决
			status : null,
			//
			compId : null,
			//组织id
			orgId : null,
			//备注
			remarks : null,
			//安全监督随机检查记录
			svRandomCheckRecords : [],
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
				"code" : [LIB.formRuleMgr.length(100)],
				"name" : [LIB.formRuleMgr.require("记录表名"),
						  LIB.formRuleMgr.length(4000)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"content" : [LIB.formRuleMgr.require("内容"),
						  LIB.formRuleMgr.length(4000)
				],
				"checkSource" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("来源")),
				"status" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("状态")),
				"compId" : [LIB.formRuleMgr.require("")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"remarks" : [LIB.formRuleMgr.length(500)],
	        },
	        emptyRules:{}
		},
		selectModel : {
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