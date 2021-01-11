define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./opStdRecordDetailFormModal.html");
	var opRecordSelectModal = require("componentsEx/selectTableModal/opRecordSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//唯一标识
			code : null,
			//步骤名称
			stepName : null,
			//禁用标识 0未禁用，1已禁用
			disable : null,
			//操作内容
			itemContent : null,
			//操作明细序号
			itemOrderNo : null,
			//操作步骤序号
			stepOrderNo : null,
			//控制措施
			itemCtrlMethod : null,
			//风险
			itemRisk : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//作业记录
			opRecord : {id:'', name:''},
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
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"code" : [LIB.formRuleMgr.require("唯一标识"),
						  LIB.formRuleMgr.length()
				],
				"stepName" : [LIB.formRuleMgr.require("步骤名称"),
						  LIB.formRuleMgr.length()
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"itemContent" : [LIB.formRuleMgr.require("操作内容"),
						  LIB.formRuleMgr.length()
				],
				"itemOrderNo" : LIB.formRuleMgr.range(1, 100).concat(LIB.formRuleMgr.require("操作明细序号")),
				"stepOrderNo" : LIB.formRuleMgr.range(1, 100).concat(LIB.formRuleMgr.require("操作步骤序号")),
				"itemCtrlMethod" : [LIB.formRuleMgr.length()],
				"itemRisk" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		},
		selectModel : {
			opRecordSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"oprecordSelectModal":opRecordSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowOpRecordSelectModal : function() {
				this.selectModel.opRecordSelectModel.visible = true;
				//this.selectModel.opRecordSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveOpRecord : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.opRecord = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});