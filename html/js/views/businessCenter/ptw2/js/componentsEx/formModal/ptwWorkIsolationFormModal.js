define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./ptwWorkIsolationFormModal.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var ptwWorkPermitSelectModal = require("componentsEx/selectTableModal/ptwWorkPermitSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//启用/禁用 0:启用,1:禁用
			disable : "0",
			//隔离类型 1:工艺隔离,2:机械隔离,3:电气隔离,4:系统屏蔽
			type : null,
			//解除隔离时间
			disisolateTime : null,
			//是否挂牌上锁 0:否,1:是
			enableLoto : null,
			//隔离的设备/保护的系统
			facility : null,
			//隔离时间
			isolateTime : null,
			//隔离点/保护的系统子件
			position : null,
			//状态 0:未隔离,1:已隔离,2:已解除
			status : null,
			//授权操作人员
			authoriser : {id:'', name:''},
			//作业许可
			workPermit : {id:'', name:''},
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
				"type" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("隔离类型")),
				"disisolateTime" : [LIB.formRuleMgr.allowStrEmpty],
				"enableLoto" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"facility" : [LIB.formRuleMgr.length(500)],
				"isolateTime" : [LIB.formRuleMgr.allowStrEmpty],
				"position" : [LIB.formRuleMgr.length(500)],
				"status" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"authoriser.id" : [LIB.formRuleMgr.allowStrEmpty],
				"workPermit.id" : [LIB.formRuleMgr.require("作业许可")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			authoriserSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			workPermitSelectModel : {
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
			"ptwworkpermitSelectModal":ptwWorkPermitSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowAuthoriserSelectModal : function() {
				this.selectModel.authoriserSelectModel.visible = true;
				//this.selectModel.authoriserSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveAuthoriser : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.authoriser = selectedDatas[0];
				}
			},
			doShowWorkPermitSelectModal : function() {
				this.selectModel.workPermitSelectModel.visible = true;
				//this.selectModel.workPermitSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveWorkPermit : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.workPermit = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});