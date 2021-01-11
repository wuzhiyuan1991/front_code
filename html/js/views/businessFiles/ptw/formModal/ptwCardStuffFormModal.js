define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./ptwCardStuffFormModal.html");
	var ptwStuffSelectModal = require("../selectTableModal/ptwStuffSelectModal");
	var ptwCardTplSelectModal = require("../selectTableModal/ptwCardTplSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//类型 1:作业工具/设备,2:作业资格证书,3:危害辨识,4:控制措施,5:工艺隔离-方法,6:个人防护设备,7:作业取消原因,8:气体类型
			stuffType : null,
			//风险库id
			stuffId : null,
			//个人防护设备类型id
			ppeCatalogId: null,
			//作业票模板
			ptwCardTpl : {id:'', name:''},
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
				"stuffType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("类型")),
				"disable" :LIB.formRuleMgr.require("状态"),
				"extraContent" : [LIB.formRuleMgr.length(500)],
				"ptwStuff.id" : [LIB.formRuleMgr.require("基础库")],
				"ptwCardTpl.id" : [LIB.formRuleMgr.require("作业票模板")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			ptwStuffSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			ptwCardTplSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"ptwstuffSelectModal":ptwStuffSelectModal,
			"ptwcardtplSelectModal":ptwCardTplSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowPtwStuffSelectModal : function() {
				this.selectModel.ptwStuffSelectModel.visible = true;
				//this.selectModel.ptwStuffSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSavePtwStuff : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.ptwStuff = selectedDatas[0];
				}
			},
			doShowPtwCardTplSelectModal : function() {
				this.selectModel.ptwCardTplSelectModel.visible = true;
				//this.selectModel.ptwCardTplSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSavePtwCardTpl : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.ptwCardTpl = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});