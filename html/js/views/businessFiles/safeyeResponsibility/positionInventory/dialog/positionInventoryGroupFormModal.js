define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./positionInventoryGroupFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//唯一标识
			code : null,
			//步骤名称
			name : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//岗位安全清单
			positionInventory : {id:'', name:''},
			//执行项
			positionInventoryItems : [],
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
				"name" : [LIB.formRuleMgr.require("步骤名称"),
						  LIB.formRuleMgr.length(100)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"positionInventory.id" : [LIB.formRuleMgr.require("岗位安全清单")],
	        },
	        emptyRules:{}
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