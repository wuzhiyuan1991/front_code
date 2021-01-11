define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./pecPositionFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//级别 1:站队级,2:管理处级,3:公司级
			level : null,
			//岗位 1:基层站队长,2:管理处机关业务人员,3:管理处机关科室长,4:管理处机关主管领导,5:公司业务处室业务人员,6:公司业务处室科室长,7:公司业务处室主管领导
			type : null,
			//启用/禁用 0:启用,1:禁用
			disable : "0",
			//备注
			remarks : null,
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
				"code" : [LIB.formRuleMgr.length(255)],
				"level" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("级别")),
				"type" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("岗位")),
				"disable" :LIB.formRuleMgr.require("状态"),
				"remarks" : [LIB.formRuleMgr.length(255)],
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