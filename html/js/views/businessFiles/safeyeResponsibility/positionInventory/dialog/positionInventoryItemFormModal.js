define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./positionInventoryItemFormModal.html");
	// var positionInventoryGroupSelectModal = require("componentsEx/selectTableModal/positionInventoryGroupSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//唯一标识
			code : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//工作项
			content : null,
			//周期 1:天,2:月,3:旬,4:季度,5:半年,6:年(默认年)
            frequencyType : '6',
			//考核落实结果
			result : null,
			//
            score : null,
			//考核标准
			standard : null,
			//执行组
			positionInventoryGroup : {id:'', name:''},
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
				"content" : [LIB.formRuleMgr.require("工作项"),
						  LIB.formRuleMgr.length(1000)
				],
				"frequencyType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"result" : [LIB.formRuleMgr.length(500)],
                "score" : [
                    // LIB.formRuleMgr.length(5),
                    LIB.formRuleMgr.require("分值")
                ].concat(LIB.formRuleMgr.range(1, 999)),
				"standard" : [LIB.formRuleMgr.length(1000)],
				"positionInventoryGroup.id" : [LIB.formRuleMgr.allowStrEmpty],
	        },
	        emptyRules:{}
		},
		selectModel : {
			positionInventoryGroupSelectModel : {
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
			
		}
	});
	
	return detail;
});