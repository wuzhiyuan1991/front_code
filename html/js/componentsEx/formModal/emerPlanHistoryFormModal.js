define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./emerplanhistoryFormModal.html");
	var emerPlanVersionSelectModal = require("componentsEx/selectTableModal/emerPlanVersionSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//预案名称
			name : null,
			//步骤 1:方案编制,2:内部评审,3:外部审核,4:法人批准,5:政府备案,6:发布实施
			step : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//操作时间
			operateTime : null,
			//参与人员
			participant : null,
			//备注描述
			remark : null,
			//处理结果 1:未通过,2:通过,3:回退
			result : null,
			//修订频率
			reviseFrequence : null,
			//修订理由(枚举值用英文逗号拼接）
			reviseReason : null,
			//修订类型 1:定期修订,2:不定期修订
			reviseType : null,
			//回退节点 1:方案编制,2:内部评审,3:外部审核,4:法人批准,5:政府备案
			rollbackStep : null,
			//预案类型 1:综合应急预案,2:专项应急预案,3:现场处置方案
			type : null,
			//版本号
			verNo : null,
			//预案版本
			emerPlanVersion : {id:'', name:''},
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
				"name" : [LIB.formRuleMgr.length(50)],
				"step" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("步骤")),
				"disable" :LIB.formRuleMgr.require("状态"),
				"operateTime" : [LIB.formRuleMgr.require("操作时间")],
				"participant" : [LIB.formRuleMgr.length(500)],
				"remark" : [LIB.formRuleMgr.length(1000)],
				"result" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"reviseFrequence" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"reviseReason" : [LIB.formRuleMgr.length(20)],
				"reviseType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"rollbackStep" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"type" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"verNo" : [LIB.formRuleMgr.length(20)],
				"emerPlanVersion.id" : [LIB.formRuleMgr.require("预案版本")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			emerPlanVersionSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"emerplanversionSelectModal":emerPlanVersionSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowEmerPlanVersionSelectModal : function() {
				this.selectModel.emerPlanVersionSelectModel.visible = true;
				//this.selectModel.emerPlanVersionSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveEmerPlanVersion : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.emerPlanVersion = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});