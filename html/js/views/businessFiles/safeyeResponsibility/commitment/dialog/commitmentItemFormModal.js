define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./commitmentItemFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//唯一标识
			code : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//量化考核内容
			content : null,
			//考核落实结果
			result : null,
			//
            score : null,
			//考核标准
			standard : null
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
				"code" : [LIB.formRuleMgr.require("唯一标识"),
						  LIB.formRuleMgr.length(100)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"content" : [LIB.formRuleMgr.require("量化考核内容"),
						  LIB.formRuleMgr.length(1000)
				],
				"result" : [LIB.formRuleMgr.length(1000)],
				"score" : [
					// LIB.formRuleMgr.length(5),
					LIB.formRuleMgr.require("分值")
				].concat(LIB.formRuleMgr.range(1, 999)),
				"standard" : [LIB.formRuleMgr.length(1000)],
				"commitmentGroup.id" : [LIB.formRuleMgr.allowStrEmpty],
	        },
	        emptyRules:{}
		},
		selectModel : {
			commitmentGroupSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {

		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doSaveCommitmentGroup : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.commitmentGroup = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});