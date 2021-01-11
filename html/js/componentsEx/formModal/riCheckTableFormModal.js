define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./riCheckTableFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//巡检表名称
			name : null,
			//禁用标识 0:未禁用,1:已禁用
			disable : null,
			//所属公司id
			compId : null,
			//所属部门id
			orgId : null,
			//备注
			remarks : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//巡检区域
			riCheckAreas : [],
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
				"code" : [LIB.formRuleMgr.length()],
				"name" : [LIB.formRuleMgr.require("巡检表名称"),
						  LIB.formRuleMgr.length()
				],
				"disable" : LIB.formRuleMgr.range(1, 100).concat(LIB.formRuleMgr.require("状态")),
				"remarks" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		},
		selectModel : {
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