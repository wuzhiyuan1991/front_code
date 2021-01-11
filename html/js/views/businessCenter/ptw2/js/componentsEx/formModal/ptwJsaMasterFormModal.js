define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./ptwJsaMasterFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//分析小组组长
			analyseLeader : null,
			//启用/禁用 0:启用,1:禁用
			disable : "0",
			//作业内容
			taskContent : null,
			//作业日期
			workDate : null,
			//分析人员，可以以逗号或者是其他字符分割
			analysePerson : null,
			//公司Id
			compId : null,
			//部门Id
			orgId : null,
			//施工单位，可手填
			construction : null,
			//是否有特种作业人员资质证明 0:否,1:是
			hasQualification : null,
			//是否有相关操作规程 0:否,1:是
			hasSpecification : null,
			//是否承包商作业 0:否,1:是
			isContractor : null,
			//是否为交叉作业 0:否,1:是
			isCrossOperat : null,
			//是否为新的工作任务 0:已做过的任务,1:新任务
			isNewTask : null,
			//是否需要许可证 0:否,1:是
			isPermitRequired : null,
			//是否分享 0:未分享,1:已分享
			isShare : null,
			//是否提交 0:未提交,1:已提交
			isSubmit : null,
			//关联的档案类型
			relType : null,
			//备注
			remark : null,
			//许可证编号
			taskLicense : null,
			//步骤分析
			ptwJsaDetails : [],
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
				"code" : [LIB.formRuleMgr.length(255)],
				"analyseLeader" : [LIB.formRuleMgr.require("分析小组组长"),
						  LIB.formRuleMgr.length(255)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"taskContent" : [LIB.formRuleMgr.require("作业内容"),
						  LIB.formRuleMgr.length(255)
				],
				"workDate" : [LIB.formRuleMgr.require("作业日期")],
				"analysePerson" : [LIB.formRuleMgr.require("分析人员，可以以逗号或者是其他字符分割"),
						  LIB.formRuleMgr.length(255)
				],
				"compId" : [LIB.formRuleMgr.require("公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"construction" : [LIB.formRuleMgr.length(255)],
				"hasQualification" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"hasSpecification" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"isContractor" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"isCrossOperat" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"isNewTask" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"isPermitRequired" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"isShare" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"isSubmit" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"relType" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"remark" : [LIB.formRuleMgr.length(255)],
				"taskLicense" : [LIB.formRuleMgr.length(255)],
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