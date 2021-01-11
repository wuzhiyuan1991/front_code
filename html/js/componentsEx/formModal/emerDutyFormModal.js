define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./emerDutyFormModal.html");
	var emerCardSelectModal = require("componentsEx/selectTableModal/emerCardSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//岗位
			position : null,
			//职责
			duty : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
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
				"position" : [LIB.formRuleMgr.require("岗位"),
						  LIB.formRuleMgr.length(100)
				],
				"duty" : [LIB.formRuleMgr.require("职责"),
						  LIB.formRuleMgr.length(300)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"emerCard.id" : [LIB.formRuleMgr.require("应急处置卡")],
	        },
	        emptyRules:{}
		},
		selectModel : {
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
			"emercardSelectModal":emerCardSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
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