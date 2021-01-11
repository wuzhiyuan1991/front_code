define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./articleReplyFormModal.html");
	var techArticleSelectModal = require("componentsEx/selectTableModal/techArticleSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//公司Id
			compId : null,
			//部门Id
			orgId : null,
			//回复内容
			content : null,
			//本回复的上级回复id
			replyFor : null,
			//帖子
			techArticle : {id:'', name:''},
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
				"content" : [LIB.formRuleMgr.length(4000)],
				"replyFor" : [LIB.formRuleMgr.length(10)],
				"techArticle.id" : [LIB.formRuleMgr.allowStrEmpty],
	        },
	        emptyRules:{}
		},
		selectModel : {
			techArticleSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"techarticleSelectModal":techArticleSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowTechArticleSelectModal : function() {
				this.selectModel.techArticleSelectModel.visible = true;
				//this.selectModel.techArticleSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveTechArticle : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.techArticle = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});