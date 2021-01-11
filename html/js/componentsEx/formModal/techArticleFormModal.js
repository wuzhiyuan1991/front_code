define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./techArticleFormModal.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");

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
			//
			content : null,
			//关键词
			keyword : null,
			//发布时间
			lastReplyDate : null,
			//发布时间
			publishDate : null,
			//回复次数
			replyTime : null,
			//发布状态 0：未发布，1：已发布
			state : null,
			//帖子标题
			title : null,
			//查看次数
			viewTime : null,
			//作者
			user : {id:'', name:''},
			//回复
			articleReplies : [],
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
				"content" : [LIB.formRuleMgr.length(65535)],
				"keyword" : [LIB.formRuleMgr.length(4000)],
				"lastReplyDate" : [LIB.formRuleMgr.allowStrEmpty],
				"publishDate" : [LIB.formRuleMgr.allowStrEmpty],
				"replyTime" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"state" : [LIB.formRuleMgr.length(10)],
				"title" : [LIB.formRuleMgr.length(10)],
				"viewTime" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"user.id" : [LIB.formRuleMgr.allowStrEmpty],
	        },
	        emptyRules:{}
		},
		selectModel : {
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
			"userSelectModal":userSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
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