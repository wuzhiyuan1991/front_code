define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./emerMaintRecordFormModal.html");
	var emerResourceSelectModal = require("componentsEx/selectTableModal/emerResourceSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//维护/保养数量
			maintQuantity : null,
			//作业类别 1:内部,2:外部
			operationType : null,
			//操作内容
			operationContent : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//类别 1:检修抢修,2:维护保养
			type : null,
			//维护/保养时间
			maintTime : null,
			//作业操作人员
			operators : null,
			//应急物资
			emerResource : {id:'', name:''},
			//作业操作人员
			users : [],
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
				"maintQuantity" : [LIB.formRuleMgr.length(10)],
				"operationType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("作业类别")),
				"operationContent" : [LIB.formRuleMgr.require("操作内容"),
						  LIB.formRuleMgr.length(500)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"type" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("类别")),
				"maintTime" : [LIB.formRuleMgr.require("维护/保养时间")],
				"operators" : [LIB.formRuleMgr.length(100)],
				"emerResource.id" : [LIB.formRuleMgr.require("应急物资")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			emerResourceSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"emerresourceSelectModal":emerResourceSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowEmerResourceSelectModal : function() {
				this.selectModel.emerResourceSelectModel.visible = true;
				//this.selectModel.emerResourceSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveEmerResource : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.emerResource = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});