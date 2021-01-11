define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./ptwCatalogFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//(级别/指标）名称/承诺岗位
			name : null,
			//启用/禁用 0:启用,1:禁用
			disable : "0",
			//字典类型 1:作业类型,2:作业分级,3:个人防护设备,4:气体检测指标,5:岗位会签承诺
			type : null,
			//承诺类型 1:作业申请人承诺,2:作业负责人承诺,3:作业监护人承诺,4:生产单位现场负责人承诺,5:主管部门负责人承诺,6:安全部门负责人,7:相关方负责人承诺,8:许可批准人承诺,9:作业完成声明,10:作业取消声明,11:开工前气体检测结论
			commitmentType : null,
			//分级依据/标准范围/承诺内容
			content : null,
			//气体检测指标类型 1:有毒有害气体或蒸汽,2:可燃气体或蒸汽,3:氧气
			gasType : null,
			//作业级别
			level : null,
			//单位（气体检测指标）
			unit : null,
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
				"name" : [LIB.formRuleMgr.require("(级别/指标）名称/承诺岗位"),
						  LIB.formRuleMgr.length(50)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"type" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("字典类型")),
				"commitmentType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"content" : [LIB.formRuleMgr.length(500)],
				"gasType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"level" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"unit" : [LIB.formRuleMgr.length(50)],
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