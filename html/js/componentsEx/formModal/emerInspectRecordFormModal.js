define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./emerInspectRecordFormModal.html");
	var emerResourceSelectModal = require("componentsEx/selectTableModal/emerResourceSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//检验检测量
			inspectQuantity : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//检验/检测内容
			inspectionContent : null,
			//检验/检测机构
			inspectOrgan : null,
			//检验检测时间
			inspectTime : null,
			//检验/检测人员
			inspectors : null,
			//应急物资
			emerResource : {id:'', name:''},
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
				"inspectQuantity" : [LIB.formRuleMgr.length(10)],
				"disable" :LIB.formRuleMgr.require("状态"),
				"inspectionContent" : [LIB.formRuleMgr.require("检验/检测内容"),
						  LIB.formRuleMgr.length(500)
				],
				"inspectOrgan" : [LIB.formRuleMgr.require("检验/检测机构"),
						  LIB.formRuleMgr.length(200)
				],
				"inspectTime" : [LIB.formRuleMgr.require("检验检测时间")],
				"inspectors" : [LIB.formRuleMgr.length(200)],
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