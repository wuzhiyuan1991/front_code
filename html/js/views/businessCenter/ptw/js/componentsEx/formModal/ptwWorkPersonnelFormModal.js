define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./ptwWorkPersonnelFormModal.html");
	var ptwWorkPermitSelectModal = require("componentsEx/selectTableModal/ptwWorkPermitSelectModal");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//启用/禁用 0:启用,1:禁用
			disable : "0",
			//人员类型 1:作业申请人,2:作业负责人,3:作业监护人,4:生产单位现场负责人,5:主管部门负责人,6:安全部门负责人,7:相关方负责人,8:许可批准人,9:安全教育人,10:作业人员
			type : null,
			//作业完成意见（限作业申请人）
			completionOpinion : null,
			//会签意见
			signOpinion : null,
			//会签结果 1:通过,2:否决
			signResult : null,
			//作业许可
			workPermit : {id:'', name:''},
			//人员
			user : {id:'', name:''},
			//签名
			cloudFiles : [],
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
				"disable" :LIB.formRuleMgr.require("状态"),
				"type" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("人员类型")),
				"completionOpinion" : [LIB.formRuleMgr.length(500)],
				"signOpinion" : [LIB.formRuleMgr.length(500)],
				"signResult" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"workPermit.id" : [LIB.formRuleMgr.require("作业许可")],
				"user.id" : [LIB.formRuleMgr.require("人员")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			workPermitSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			userSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"ptwworkpermitSelectModal":ptwWorkPermitSelectModal,
			"userSelectModal":userSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowWorkPermitSelectModal : function() {
				this.selectModel.workPermitSelectModel.visible = true;
				//this.selectModel.workPermitSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveWorkPermit : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.workPermit = selectedDatas[0];
				}
			},
			doShowUserSelectModal : function() {
				this.selectModel.userSelectModel.visible = true;
				//this.selectModel.userSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveUser : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.user = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});