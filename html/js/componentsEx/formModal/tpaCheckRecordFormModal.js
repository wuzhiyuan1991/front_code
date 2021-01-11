define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./tpaCheckRecordFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//id
			id : null,
			//编码
			code : null,
			//检查结果详情 如10/10,10条合格,10条不合格
			checkResultDetail : null,
			//检查结果 0:不合格,1:合格
			checkResult : null,
			//检查时间
			checkDate : null,
			//
			compId : null,
			//组织id
			orgId : null,
			//检查开始时间
			checkBeginDate : null,
			//检查结束时间
			checkEndDate : null,
			//来源 0:手机检查,1:web录入
			checkSource : null,
			//是否禁用 0启用,1禁用
			disable : null,
			//是否为抽检数据,即抽检人做的记录  0-否(默认) 1-是
			isRandom : null,
			//备注
			remarks : null,
			//检查类型 1日常检查 2计划检查
			type : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//行为类检查记录详情
			tpaBehaviorComms : [],
			//检查记录详情
			tpaCheckRecordDetails : [],
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
				"checkResultDetail" : [LIB.formRuleMgr.require("检查结果详情"),
						  LIB.formRuleMgr.length()
				],
				"checkResult" : [LIB.formRuleMgr.require("检查结果"),
						  LIB.formRuleMgr.length()
				],
				"checkDate" : [LIB.formRuleMgr.require("检查时间"),
						  LIB.formRuleMgr.length()
				],
				"checkBeginDate" : [LIB.formRuleMgr.length()],
				"checkEndDate" : [LIB.formRuleMgr.length()],
				"checkSource" : [LIB.formRuleMgr.length()],
				"disable" : [LIB.formRuleMgr.length()],
				"isRandom" : [LIB.formRuleMgr.length()],
				"remarks" : [LIB.formRuleMgr.length()],
				"type" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()],	
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