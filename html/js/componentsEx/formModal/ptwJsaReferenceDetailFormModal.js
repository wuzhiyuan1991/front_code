define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./ptwJsaReferenceDetailFormModal.html");
	var riskModel = require("views/basicSetting/basicFile/evaluationModel/dialog/riskModel");

	LIB.registerDataDic("iptw_jsa_phase", [
		["0","作业前"],
		["1","作业中"],
		["2","作业后"]
	]);

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
			//JSA参考库
			ptwJsaReference : {id:'', name:''},
		}
	};

	var acceptList = [
		{
			id: '0',
			value: '否'
		},
		{
			id: '1',
			value: '是'
		}
	];

	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'create',
			isReadOnly : false,
			title:"添加",

			//验证规则
	        rules:{
				"stepDesc" : [
					LIB.formRuleMgr.require("步骤"),
					LIB.formRuleMgr.length(500)
				],
				"harmDesc" : [
					LIB.formRuleMgr.require("危害描述"),
					LIB.formRuleMgr.length(600)
				],
				"result" : [
					LIB.formRuleMgr.require("后果及影响"),
					LIB.formRuleMgr.length(600)
				],
				"currentControl" : [
					LIB.formRuleMgr.require("现有控制措施"),
					LIB.formRuleMgr.length(600)
				],
				"improveControl" : [
					LIB.formRuleMgr.require("建议改进措施"),
					LIB.formRuleMgr.length(600)
				],
				"riskAccept" : [
					LIB.formRuleMgr.require("残余风险是否可接受")
				],
				"riskScore" : [
					LIB.formRuleMgr.require("风险值")
				]
	        },
	        emptyRules:{}
		},
		riskModelObj: null,
		selectModel : {
		},
		acceptList: acceptList
	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			'riskModel': riskModel
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doRiskConfirm: function (vo) {
				this.mainModel.vo.possiblity = vo.possibility;
				this.mainModel.vo.degree = vo.severity;
				this.mainModel.vo.riskScore = vo.riskScore;
				this.mainModel.vo.riskModel = JSON.stringify(this.riskModelObj)
			},
			beforeInit: function() {
				this.riskModelObj = null;
			},
			afterInit: function () {
			},
			afterInitData: function () {
				this.riskModelObj = JSON.parse(this.mainModel.vo.riskModel)
			}
		}
	});
	
	return detail;
});