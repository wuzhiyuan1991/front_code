define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./opMaintStepFormModal.html");
	// var opCardSelectModal = require("componentsEx/selectTableModal/opCardSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//唯一标识
			code : null,
			//工序名称
			name : null,
			//禁用标识 0未禁用，1已禁用
			disable : '0',
			//序号
			// orderNo : null,
			//修改日期
			// modifyDate : null,
			//创建日期
			// createDate : null,
			//维检修作业卡
			// opCard : {id:'', name:''},
			//维检修工序明细
			// opMaintStepItems : [],
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
				"name" : [LIB.formRuleMgr.require("工序名称"),
						  LIB.formRuleMgr.length()
				]
	        },
	        emptyRules:{}
		},
		// selectModel : {
        // 	opCardSelectModel : {
        // 		visible : false,
        // 		filterData : {orgId : null}
        // 	}
        // }

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO
		}
	});
	
	return detail;
});