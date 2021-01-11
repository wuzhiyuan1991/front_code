define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./checkPlanFormModal.html");
	var checkTableSelectModal = require("componentsEx/selectTableModal/checkTableSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//id
			id : null,
			//
			code : null,
			//计划名
			name : null,
			//结束时间
			endDate : null,
			//开始时间
			startDate : null,
			//
			compId : null,
			//组织id
			orgId : null,
			//是否禁用，0未发布，1发布
			disable : null,
			//检查频率
			frequency : null,
			//检查频率类型
			frequencyType : null,
			//备注
			remarks : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//检查表
			checkTable : {id:'', name:''},
			//检查人
			users : [],
		}
	};

	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'create',
			isReadOnly : false,
			title:"添加",
			showCheckTableSelectModal : false,

			//验证规则
	        rules:{
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"code" : [LIB.formRuleMgr.require(""),
						  LIB.formRuleMgr.length()
				],
				"name" : [LIB.formRuleMgr.require("计划名"),
						  LIB.formRuleMgr.length()
				],
				"endDate" : [LIB.formRuleMgr.require("结束时间"),
						  LIB.formRuleMgr.length()
				],
				"startDate" : [LIB.formRuleMgr.require("开始时间"),
						  LIB.formRuleMgr.length()
				],
				"disable" : [LIB.formRuleMgr.length()],
				"frequency" : [LIB.formRuleMgr.length()],
				"frequencyType" : [LIB.formRuleMgr.length()],
				"remarks" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		}
	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"checktableSelectModal":checkTableSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doSaveCheckTable : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.checkTable = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});