define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./ptwCardTplFormModal.html");
	var ptwCatalogSelectModal = require("../selectTableModal/ptwCatalogSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//启用/禁用 0:启用,1:禁用
			disable : "0",
			//公司Id
			compId : null,
			//部门Id
			orgId : null,
			//字段启用禁用设置(json)
			columnSetting : null,
			//是否启用气体检测 0:否,1:是
			gasDetection : null,
			//能量隔离启用禁用设置(json)
			isolationSetting : null,
			//个人防护启用禁用设置(json)
			ppeCatalogSetting : null,
			//作业类型
			workCatalog : {id:'', name:''},
			//作业票内容
			ptwCardStuffs : [],
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
				"compId" : [LIB.formRuleMgr.require("公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"columnSetting" : [LIB.formRuleMgr.length(1000)],
				"gasDetection" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"isolationSetting" : [LIB.formRuleMgr.length(200)],
				"ppeCatalogSetting" : [LIB.formRuleMgr.length(500)],
				"workCatalog.id" : [LIB.formRuleMgr.require("作业类型")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			workCatalogSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"ptwcatalogSelectModal":ptwCatalogSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowWorkCatalogSelectModal : function() {
				this.selectModel.workCatalogSelectModel.visible = true;
				//this.selectModel.workCatalogSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveWorkCatalog : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.workCatalog = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});