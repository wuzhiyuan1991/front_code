define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./opCardFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//唯一标识
			code : null,
			//卡票名称
			name : null,
			//专业
			specialityType : null,
			//禁用标识 0未禁用，1已禁用
			disable : null,
			//所属部门id
			orgId : null,
			//卡票类型 1:操作票,2:维检修作业卡,3:应急处置卡
			type : null,
			//审核状态 0:待提交,1:待审核,2:已审核
			status : null,
			//所属公司id
			compId : null,
			//审核时间（已审核状态独有）
			auditDate : null,
			//检修内容（维检修作业卡独有）
			content : null,
			//设备设施名称（维检修作业卡独有）
			equipName : null,
			//备注
			remarks : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//应急处置步骤
			opEmerSteps : [],
			//操作票操作步骤
			opStdSteps : [],
			//维检修工序
			opMaintSteps : [],
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
				"code" : [LIB.formRuleMgr.require("唯一标识"),
						  LIB.formRuleMgr.length()
				],
				"name" : [LIB.formRuleMgr.require("卡票名称"),
						  LIB.formRuleMgr.length()
				],
				"specialityType" : LIB.formRuleMgr.range(1, 100).concat(LIB.formRuleMgr.require("专业")),
				"disable" :LIB.formRuleMgr.require("状态"),
				"type" : LIB.formRuleMgr.range(1, 100).concat(LIB.formRuleMgr.require("卡票类型")),
				"status" : LIB.formRuleMgr.range(1, 100).concat(LIB.formRuleMgr.require("审核状态")),
				"content" : [LIB.formRuleMgr.length()],
				"equipName" : [LIB.formRuleMgr.length()],
				"remarks" : [LIB.formRuleMgr.length()],	
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