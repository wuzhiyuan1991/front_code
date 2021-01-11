define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./jsaMasterNewFormModal.html");
	var opCardSelectModal = require("componentsEx/selectTableModal/opCardSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//分析人员，可以以逗号或者是其他字符分割
			analysePerson : null,
			//作业日期
			workDate : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//分析小组组长
			analyseLeader : null,
			//作业内容
			taskContent : null,
			//公司Id
			compId : null,
			//部门Id
			orgId : null,
			//审核时间（已审核状态独有）
			auditDate : null,
			//专家点评
			commentExpert : null,
			//管理处点评
			commentGlc : null,
			//公司点评
			commentGongsi : null,
			//施工单位，可手填
			construction : null,
			//是否承包商作业；0:否,1:是
			contractor : null,
			//表明是否复制页面传来的数据，非空时为复制页面传来的值
			copy : null,
			//是否为交叉作业
			crossTask : null,
			//
			isflag : null,
			//步骤json
			jsonstr : null,
			//是否为新的工作任务 0--已做过的任务；  1--新任务
			newTask : null,
			//是否需要许可证
			permit : null,
			//是否有特种作业人员资质证明
			qualification : null,
			//是否参考库
			reference : null,
			//备注
			remark : null,
			//步骤中最高风险级别的分值
			riskScore : null,
			//是否分享
			share : null,
			//是否有相关操作规程
			specification : null,
			//审核状态 0:待提交,1:待审核,2:已审核
			status : null,
			//作业许可证号（如有）
			taskLicense : null,
			//提交类型
			updatetype : null,
			//作业位置
			workPlace : null,
			//票卡
			opCard : {id:'', name:''},
			//步骤
			jsaDetailNews : [],
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
				"analysePerson" : [LIB.formRuleMgr.require("分析人员，可以以逗号或者是其他字符分割"),
						  LIB.formRuleMgr.length(255)
				],
				"workDate" : [LIB.formRuleMgr.require("作业日期")],
				"disable" :LIB.formRuleMgr.require("状态"),
				"analyseLeader" : [LIB.formRuleMgr.require("分析小组组长"),
						  LIB.formRuleMgr.length(255)
				],
				"taskContent" : [LIB.formRuleMgr.require("作业内容"),
						  LIB.formRuleMgr.length(255)
				],
				"compId" : [LIB.formRuleMgr.require("公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"auditDate" : [LIB.formRuleMgr.allowStrEmpty],
				"commentExpert" : [LIB.formRuleMgr.length(255)],
				"commentGlc" : [LIB.formRuleMgr.length(255)],
				"commentGongsi" : [LIB.formRuleMgr.length(255)],
				"construction" : [LIB.formRuleMgr.length(255)],
				"contractor" : [LIB.formRuleMgr.length(0)],
				"copy" : [LIB.formRuleMgr.length(255)],
				"crossTask" : [LIB.formRuleMgr.length(0)],
				"isflag" : [LIB.formRuleMgr.length(0)],
				"jsonstr" : [LIB.formRuleMgr.length(255)],
				"newTask" : [LIB.formRuleMgr.length(0)],
				"permit" : [LIB.formRuleMgr.length(0)],
				"qualification" : [LIB.formRuleMgr.length(0)],
				"reference" : [LIB.formRuleMgr.length(0)],
				"remark" : [LIB.formRuleMgr.length(255)],
				"riskScore" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"share" : [LIB.formRuleMgr.length(0)],
				"specification" : [LIB.formRuleMgr.length(0)],
				"status" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"taskLicense" : [LIB.formRuleMgr.length(255)],
				"updatetype" : [LIB.formRuleMgr.length(255)],
				"workPlace" : [LIB.formRuleMgr.length(255)],
				"opCard.id" : [LIB.formRuleMgr.allowStrEmpty],
	        },
	        emptyRules:{}
		},
		selectModel : {
			opCardSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"opcardSelectModal":opCardSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowOpCardSelectModal : function() {
				this.selectModel.opCardSelectModel.visible = true;
				//this.selectModel.opCardSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveOpCard : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.opCard = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});