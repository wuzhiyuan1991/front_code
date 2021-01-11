define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./emerLinkmanFormModal.html");
	var emerGroupSelectModal = require("componentsEx/selectTableModal/emerGroupSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//姓名
			name : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//职务
			duty : null,
			//手机号码
			mobile : null,
			//办公电话
			officePhone : null,
			//备注信息
			remarks : null,
			//外部应急单位
			emerGroup : {id:'', name:''},
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
				"name" : [LIB.formRuleMgr.require("姓名"),
						  LIB.formRuleMgr.length(50)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"duty" : [LIB.formRuleMgr.length(100)],
				"mobile" : [LIB.formRuleMgr.length(100)],
				"officePhone" : [LIB.formRuleMgr.length(100)],
				"remarks" : [LIB.formRuleMgr.length(500)],
				"emerGroup.id" : [LIB.formRuleMgr.require("外部应急单位")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			emerGroupSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"emergroupSelectModal":emerGroupSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowEmerGroupSelectModal : function() {
				this.selectModel.emerGroupSelectModel.visible = true;
				//this.selectModel.emerGroupSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveEmerGroup : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.emerGroup = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});