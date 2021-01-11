define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./ptwCardStuffFormModal.html");
	var ptwCardTplSelectModal = require("componentsEx/selectTableModal/ptwCardTplSelectModal");
	var ptwCatalogSelectModal = require("componentsEx/selectTableModal/ptwCatalogSelectModal");
	var ptwStuffSelectModal = require("componentsEx/selectTableModal/ptwStuffSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//类型 1:作业工具/设备,2:作业资格证书,3:危害辨识,4:控制措施,5:工艺隔离-方法,6:个人防护设备,7:作业取消原因,8:气体检测指标
			stuffType : null,
			//启用/禁用 0:启用,1:禁用
			disable : "0",
			//作业票模板
			ptwCardTpl : {id:'', name:''},
			//气体类型
			gasCatalog : {id:'', name:''},
			//风险库
			ptwStuff : {id:'', name:''},
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
				"ptwCardTpl.id" : [LIB.formRuleMgr.require("作业票模板")],
				"gasCatalog.id" : [LIB.formRuleMgr.require("气体类型")],
				"ptwStuff.id" : [LIB.formRuleMgr.require("风险库")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			ptwCardTplSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			gasCatalogSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			ptwStuffSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"ptwcardtplSelectModal":ptwCardTplSelectModal,
			"ptwcatalogSelectModal":ptwCatalogSelectModal,
			"ptwstuffSelectModal":ptwStuffSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowPtwCardTplSelectModal : function() {
				this.selectModel.ptwCardTplSelectModel.visible = true;
				//this.selectModel.ptwCardTplSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSavePtwCardTpl : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.ptwCardTpl = selectedDatas[0];
				}
			},
			doShowGasCatalogSelectModal : function() {
				this.selectModel.gasCatalogSelectModel.visible = true;
				//this.selectModel.gasCatalogSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveGasCatalog : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.gasCatalog = selectedDatas[0];
				}
			},
			doShowPtwStuffSelectModal : function() {
				this.selectModel.ptwStuffSelectModel.visible = true;
				//this.selectModel.ptwStuffSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSavePtwStuff : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.ptwStuff = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});