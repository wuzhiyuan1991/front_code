define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./ptwWorkHistoryFormModal.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var ptwWorkCardSelectModal = require("componentsEx/selectTableModal/ptwWorkCardSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//操作类型 1:作业预约,2:作业审核,3:填写作业票,4:能量隔离,5:作业前气体检测,6:措施落实,7:作业会签,8:安全教育,9:作业中气体检测,10:作业监控,11:能量隔离解除,12:作业关闭
			operationType : null,
			//启用/禁用 0:启用,1:禁用
			disable : "0",
			//操作时间
			operateTime : null,
			//操作时作业状态  1:作业预约,2:作业评审,3:填报作业票,4:现场落实,5:作业会签,6:作业批准,7:作业监测,8:待关闭,9:作业取消,10:作业完成,11:已否决
			workStatus : null,
			//隔离类型 1:工艺隔离,2:机械隔离,3:电气隔离,4:系统屏蔽
			isolationType : null,
			//作业结果 1:作业取消,2:作业完成,3:作业续签
			resultType : null,
			//会签类型 1:作业申请人,2:作业负责人,3:作业监护人,4:生产单位现场负责人,5:主管部门负责人,6:安全部门负责人,7:相关方负责人,8:许可批准人
			signType : null,
			//操作人
			operator : {id:'', name:''},
			//作业票
			workCard : {id:'', name:''},
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
				"operationType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("操作类型")),
				"disable" :LIB.formRuleMgr.require("状态"),
				"operateTime" : [LIB.formRuleMgr.require("操作时间")],
				"workStatus" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("操作时作业状态")),
				"isolationType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"resultType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"signType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"operator.id" : [LIB.formRuleMgr.require("操作人")],
				"workCard.id" : [LIB.formRuleMgr.require("作业票")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			operatorSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			workCardSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"userSelectModal":userSelectModal,
			"ptwworkcardSelectModal":ptwWorkCardSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowOperatorSelectModal : function() {
				this.selectModel.operatorSelectModel.visible = true;
				//this.selectModel.operatorSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveOperator : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.operator = selectedDatas[0];
				}
			},
			doShowWorkCardSelectModal : function() {
				this.selectModel.workCardSelectModel.visible = true;
				//this.selectModel.workCardSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveWorkCard : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.workCard = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});