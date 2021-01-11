define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./riskAssessmentFormModal.html");
	var riskTypeSelectModal = require("componentsEx/selectTableModal/riskTypeSelectModal");
	var checkItemSelectModal = require("componentsEx/selectTableModal/checkItemSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//ID
			id : null,
			//
			code : null,
			//
			compId : null,
			//组织id
			orgId : null,
			//检查频次
			checkFrequency : null,
			//管控层级
			controlHierarchy : null,
			//控制措施
			controlMeasures : null,
			//是否禁用，0启用，1禁用
			disable : null,
			//'危害辨识来源标识 0 隐患回转 1 自建记录
			markup : null,
			//风险等级
			riskLevel : null,
			//风险等级模型
			riskModel : null,
			//场景
			scene : null,
			//状态（0已评估，1未评估,2未通过）
			state : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//危害分类
			riskType : {id:'', name:''},
			//检查项
			checkItem : {id:'', name:''},
		}
	};

	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'create',
			isReadOnly : false,
			title:"添加",
			showRiskTypeSelectModal : false,
			showCheckItemSelectModal : false,

			//验证规则
	        rules:{
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"code" : [LIB.formRuleMgr.require(""),
						  LIB.formRuleMgr.length()
				],
				"checkFrequency" : [LIB.formRuleMgr.length()],
				"controlHierarchy" : [LIB.formRuleMgr.length()],
				"controlMeasures" : [LIB.formRuleMgr.length()],
				"disable" : [LIB.formRuleMgr.length()],
				"markup" : [LIB.formRuleMgr.length()],
				"riskLevel" : [LIB.formRuleMgr.length()],
				"riskModel" : [LIB.formRuleMgr.length()],
				"scene" : [LIB.formRuleMgr.length()],
				"state" : [LIB.formRuleMgr.length()],
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
			"risktypeSelectModal":riskTypeSelectModal,
			"checkitemSelectModal":checkItemSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doSaveRiskType : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.riskType = selectedDatas[0];
				}
			},
			doSaveCheckItem : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.checkItem = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});