define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./opStdStepFormModal.html");
	// var opCardSelectModal = require("componentsEx/selectTableModal/opCardSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//唯一标识
			code : null,
			//步骤名称
			name : null,
			//禁用标识 0未禁用，1已禁用
			disable : '0',
			//操作票
			// opCard : {id:'', name:''},
			//操作票操作明细
			// opStdStepItems : [],
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
				"name" : [LIB.formRuleMgr.require("步骤名称"),
						  LIB.formRuleMgr.length()
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"orderNo" : LIB.formRuleMgr.range(1, 100).concat(LIB.formRuleMgr.require("序号")),	
	        },
	        emptyRules:{}
		}

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			// doShowOpCardSelectModal : function() {
			// 	this.selectModel.opCardSelectModel.visible = true;
				//this.selectModel.opCardSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			// },
			// doSaveOpCard : function(selectedDatas) {
			// 	if (selectedDatas) {
			// 		this.mainModel.vo.opCard = selectedDatas[0];
			// 	}
			// },
			
		}
	});
	
	return detail;
});