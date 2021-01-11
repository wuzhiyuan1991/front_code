define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./gasDetectionRecordFormModal.html");
	var cloudFileSelectModal = require("componentsEx/selectTableModal/cloudFileSelectModal");
	var ptwWorkPermitSelectModal = require("componentsEx/selectTableModal/ptwWorkPermitSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//启用/禁用 0:启用,1:禁用
			disable : "0",
			//检测地点
			detectSite : null,
			//检测时间
			detectTime : null,
			//检测类型 1:作业前,2:作业中
			type : null,
			//签名
			cloudFile : {id:'', name:''},
			//作业许可
			workPermit : {id:'', name:''},
			//气体检测详情
			gasDetectionDetails : [],
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
				"detectSite" : [LIB.formRuleMgr.length(200)],
				"detectTime" : [LIB.formRuleMgr.allowStrEmpty],
				"type" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"cloudFile.id" : [LIB.formRuleMgr.allowStrEmpty],
				"workPermit.id" : [LIB.formRuleMgr.require("作业许可")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			cloudFileSelectModel : {
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
			"cloudfileSelectModal":cloudFileSelectModal,
			"ptwworkpermitSelectModal":ptwWorkPermitSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowCloudFileSelectModal : function() {
				this.selectModel.cloudFileSelectModel.visible = true;
				//this.selectModel.cloudFileSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveCloudFile : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.cloudFile = selectedDatas[0];
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