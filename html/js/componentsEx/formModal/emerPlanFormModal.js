define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./emerplanFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//预案名称
			name : null,
			//评审状态 1:方案编制,2:内部评审,3:外部审核,4:法人批准,5:政府备案,6:发布实施,10:已发布
			status : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//预案类型 1:综合应急预案,2:专项应急预案,3:现场处置方案
			type : null,
			//版本号
			verNo : null,
			//是否为初始版本 0:否,1:是
			isInitial : null,
			//修订频率
			reviseFrequence : null,
			//所属公司id
			compId : null,
			//所属部门id
			orgId : null,
			//备注
			remark : null,
			//全部版本
			emerPlanVersions : [],
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
				"name" : [LIB.formRuleMgr.require("预案名称"),
						  LIB.formRuleMgr.length(50)
				],
				"status" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("评审状态")),
				"disable" :LIB.formRuleMgr.require("状态"),
				"type" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("预案类型")),
				"verNo" : [LIB.formRuleMgr.require("版本号"),
						  LIB.formRuleMgr.length(20)
				],
				"isInitial" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("是否为初始版本")),
				"reviseFrequence" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.require("修订频率")),
				"compId" : [LIB.formRuleMgr.require("所属公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"remark" : [LIB.formRuleMgr.length(500)],
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