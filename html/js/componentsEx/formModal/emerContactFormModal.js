define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./emerContactFormModal.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var emerCardSelectModal = require("componentsEx/selectTableModal/emerCardSelectModal");

    LIB.registerDataDic("iem_emer_contact_is_insider", [
        ["1","内部人员"],
        ["0","外部人员"]
    ]);


    //初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//姓名
			name : null,
			//是否内部人员 1:内部人员,0:外部人员
			isInsider : 0,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//联系方式
			mobile : null,
			//机构
			organization : null,
			//职务
			position : null,
			//内部人员
			user : {id:'', name:''},
			//应急处置卡
			emerCard : {id:'', name:''},
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
				"code" : [LIB.formRuleMgr.length(100)],
				"name" : [LIB.formRuleMgr.require("姓名"),LIB.formRuleMgr.length(50)],
				"isInsider" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("是否内部人员")),
				"disable" :LIB.formRuleMgr.require("状态"),
				"mobile" : [LIB.formRuleMgr.require("联系方式"),LIB.formRuleMgr.length(50)],
				"organization" : [LIB.formRuleMgr.require("外部机构"),LIB.formRuleMgr.length(100)],
				"position" : [LIB.formRuleMgr.length(50)],
				"user.id" : [LIB.formRuleMgr.allowStrEmpty],
				"emerCard.id" : [LIB.formRuleMgr.require("应急处置卡")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			userSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			emerCardSelectModel : {
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
			"emercardSelectModal":emerCardSelectModal,
			
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
			doShowEmerCardSelectModal : function() {
				this.selectModel.emerCardSelectModel.visible = true;
				//this.selectModel.emerCardSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveEmerCard : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.emerCard = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});