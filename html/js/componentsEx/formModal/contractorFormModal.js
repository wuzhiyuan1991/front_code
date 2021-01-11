define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./contractorFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//健康安全环保协议有效期
			agreementDeadline : null,
			//经营范围
			businessScope : null,
			//资质证书
			certificate : null,
			//证书期限
			cetDeadline : null,
			//企业类别
			compType : null,
			//法人代表
			corporation : null,
			//单位地址
			deptAddr : null,
			//单位名称
			deptName : null,
			//雇员人数
			empNum : null,
			//营业执照编号
			licenceNo : null,
			//联系人
			linkman : null,
			//手机
			mobilePhone : null,
			//服务资质
			qualification : null,
			//资质等级
			qualificationLevel : null,
			//注册资金
			registerCapital : null,
			//备注
			remark : null,
			//健康安全环保协议
			securityAgreement : null,
			//服务类别
			serviceType : null,
			//座机
			telephone : null,
			//承包商员工
			contractorEmps : [],
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
				"disable" :LIB.formRuleMgr.require("状态"),
				"agreementDeadline" : [LIB.formRuleMgr.allowStrEmpty],
				"businessScope" : [LIB.formRuleMgr.length(100)],
				"certificate" : [LIB.formRuleMgr.length(100)],
				"cetDeadline" : [LIB.formRuleMgr.allowStrEmpty],
				"compType" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"corporation" : [LIB.formRuleMgr.length(100)],
				"deptAddr" : [LIB.formRuleMgr.length(200)],
				"deptName" : [LIB.formRuleMgr.length(100)],
				"empNum" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"licenceNo" : [LIB.formRuleMgr.length(100)],
				"linkman" : [LIB.formRuleMgr.length(100)],
				"mobilePhone" : [LIB.formRuleMgr.length(100)],
				"qualification" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"qualificationLevel" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"registerCapital" : [LIB.formRuleMgr.length(10)],
				"remark" : [LIB.formRuleMgr.length(500)],
				"securityAgreement" : [LIB.formRuleMgr.length(100)],
				"serviceType" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"telephone" : [LIB.formRuleMgr.length(100)],
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