define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./emerPlanVersionFormModal.html");
	var emerPlanSelectModal = require("componentsEx/selectTableModal/emerPlanSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//预案名称
			name : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//预案类型 1:综合应急预案,2:专项应急预案,3:现场处置方案
			type : null,
			//版本号
			verNo : null,
			//修订频率
			reviseFrequence : null,
			//备注
			remark : null,
			//修订理由(枚举值用英文逗号拼接）
			reviseReason : null,
			//修订类型 1:定期修订,2:不定期修订
			reviseType : null,
			//应急预案
			emerPlan : {id:'', name:''},
			//审核历史
			emerPlanHistories : [],
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
				"disable" :LIB.formRuleMgr.require("状态"),
				"type" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("预案类型")),
				"verNo" : [LIB.formRuleMgr.require("版本号"),
						  LIB.formRuleMgr.length(20)
				],
				"reviseFrequence" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.require("修订频率")),
				"remark" : [LIB.formRuleMgr.length(500)],
				"reviseReason" : [LIB.formRuleMgr.length(20)],
				"reviseType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"emerPlan.id" : [LIB.formRuleMgr.require("应急预案")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			emerPlanSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"emerplanSelectModal":emerPlanSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowEmerPlanSelectModal : function() {
				this.selectModel.emerPlanSelectModel.visible = true;
				//this.selectModel.emerPlanSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveEmerPlan : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.emerPlan = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});