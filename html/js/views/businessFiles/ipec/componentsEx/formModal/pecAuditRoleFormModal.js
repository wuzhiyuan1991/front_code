define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./pecAuditRoleFormModal.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//所属公司id
			compId : null,
			//级别 1:站队级,2:管理处级,3:公司级
			positionLevel : null,
			//岗位 1:基层站队长,2:管理处机关业务人员,3:管理处机关科室长,4:管理处机关主管领导,5:公司业务处室业务人员,6:公司业务处室科室长,7:公司业务处室主管领导
			positionType : null,
			//审批形式 1:按站队,2:按公司,3:按专业
			relType : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//人员
			user : {id:'', name:''},
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
				"code" : [LIB.formRuleMgr.length(10)],
				"compId" : [LIB.formRuleMgr.require("所属公司")],
				"positionLevel" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("级别")),
				"positionType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("岗位")),
				"relType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("审批形式")),
				"disable" :LIB.formRuleMgr.require("状态"),
				"user.id" : [LIB.formRuleMgr.require("人员")],
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