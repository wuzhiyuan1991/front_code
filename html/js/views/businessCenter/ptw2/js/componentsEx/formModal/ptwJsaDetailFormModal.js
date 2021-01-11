define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./ptwJsaDetailFormModal.html");
	var ptwJsaMasterSelectModal = require("componentsEx/selectTableModal/ptwJsaMasterSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//启用/禁用 0:启用,1:禁用
			disable : "0",
			//步骤描述
			stepDesc : null,
			//残余风险是否可接受 0:否,1:是
			riskAccept : null,
			//控制措施
			currentControl : null,
			//严重性
			degree : null,
			//危害描述
			harmDesc : null,
			//改进措施
			improveControl : null,
			//作业阶段 0:作业前,1:作业中,2:作业后
			phase : null,
			//可能性
			possiblity : null,
			//后果及影响
			result : null,
			//风险等级评估模型
			riskModel : null,
			//风险分值
			riskScore : null,
			//工作安全分析
			ptwJsaMaster : {id:'', name:''},
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
				"disable" :LIB.formRuleMgr.require("状态"),
				"stepDesc" : [LIB.formRuleMgr.require("步骤描述"),
						  LIB.formRuleMgr.length(500)
				],
				"riskAccept" : [LIB.formRuleMgr.require("残余风险是否可接受"),
						  LIB.formRuleMgr.length(255)
				],
				"currentControl" : [LIB.formRuleMgr.length(2147483647)],
				"degree" : [LIB.formRuleMgr.length(255)],
				"harmDesc" : [LIB.formRuleMgr.length(2147483647)],
				"improveControl" : [LIB.formRuleMgr.length(2147483647)],
				"phase" : [LIB.formRuleMgr.length(255)],
				"possiblity" : [LIB.formRuleMgr.length(255)],
				"result" : [LIB.formRuleMgr.length(2147483647)],
				"riskModel" : [LIB.formRuleMgr.length(1000)],
				"riskScore" : [LIB.formRuleMgr.length(100)],
				"ptwJsaMaster.id" : [LIB.formRuleMgr.require("工作安全分析")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			ptwJsaMasterSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"ptwjsamasterSelectModal":ptwJsaMasterSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowPtwJsaMasterSelectModal : function() {
				this.selectModel.ptwJsaMasterSelectModel.visible = true;
				//this.selectModel.ptwJsaMasterSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSavePtwJsaMaster : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.ptwJsaMaster = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});