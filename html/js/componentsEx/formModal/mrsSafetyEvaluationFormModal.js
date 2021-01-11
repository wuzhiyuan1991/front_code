define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./mrsSafetyEvaluationFormModal.html");
	var majorRiskSourceSelectModal = require("src/main/webapp/html/js/componentsEx/selectTableModal/majorRiskSourceEquipmentSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//安全评价单位
			evaluateUnit : null,
			//委托单位
			trusteeUnit : null,
			//启用/禁用 0:启用,1:禁用
			disable : "0",
			//评价时间
			evaluateDate : null,
			//重大危险源名称
			mrsName : null,
			//编制日期
			compileDate : null,
			//危险源控制程序
			controlProcedure : null,
			//评价原因 1:重大危险源安全评估已满三年的,2:构成重大危险源的装置、设施或者场所进行新建、改建、扩建的,3:危险化学品种类、数量、生产、使用工艺或者储存方式及重要设备、设施等发生变化，影响重大危险源级别或者风险程度的,4:外界生产安全环境因素发生变化，影响重大危险源级别和风险程度的,5:发生危险化学品事故造成人员死亡，或者10人以上受伤，或者影响到公共安全的
			evaluateReason : null,
			//重大危险源级别
			mrsRiskLevel : null,
			//备注
			remark : null,
			//安全评价报告编号
			reportNumber : null,
			//委托单位法人
			trusteeCorp : null,
			//委托单位法人电话
			trusteeCorpMobile : null,
			//委托单位联系人
			trusteeLinkman : null,
			//委托单位联系人电话
			trusteeLinkmanMobile : null,
			//重大危险源
			majorRiskSource : {id:'', name:''},
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
				"evaluateUnit" : [LIB.formRuleMgr.require("安全评价单位"),
						  LIB.formRuleMgr.length(100)
				],
				"trusteeUnit" : [LIB.formRuleMgr.require("委托单位"),
						  LIB.formRuleMgr.length(100)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"evaluateDate" : [LIB.formRuleMgr.require("评价时间")],
				"mrsName" : [LIB.formRuleMgr.require("重大危险源名称"),
						  LIB.formRuleMgr.length(50)
				],
				"compileDate" : [LIB.formRuleMgr.allowStrEmpty],
				"controlProcedure" : [LIB.formRuleMgr.length(50)],
				"evaluateReason" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"mrsRiskLevel" : [LIB.formRuleMgr.length(50)],
				"remark" : [LIB.formRuleMgr.length(500)],
				"reportNumber" : [LIB.formRuleMgr.length(50)],
				"trusteeCorp" : [LIB.formRuleMgr.length(50)],
				"trusteeCorpMobile" : [LIB.formRuleMgr.length(50)],
				"trusteeLinkman" : [LIB.formRuleMgr.length(50)],
				"trusteeLinkmanMobile" : [LIB.formRuleMgr.length(50)],
				"majorRiskSource.id" : [LIB.formRuleMgr.require("重大危险源")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			majorRiskSourceSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"majorrisksourceSelectModal":majorRiskSourceSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowMajorRiskSourceSelectModal : function() {
				this.selectModel.majorRiskSourceSelectModel.visible = true;
				//this.selectModel.majorRiskSourceSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveMajorRiskSource : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.majorRiskSource = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});