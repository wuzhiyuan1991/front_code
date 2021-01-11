define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./opRecordFormModal.html");
	var opCardSelectModal = require("componentsEx/selectTableModal/opCardSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//唯一标识
			code : null,
			//禁用标识 0未禁用，1已禁用
			disable : null,
			//作业开始时间
			startTime : null,
			//所属部门id
			orgId : null,
			//作业结束时间
			endTime : null,
			//记录类型 1:操作票作业记录,2:维检修作业记录
			type : null,
			//作业全部设备号
			equipNos : null,
			//所属公司id
			compId : null,
			//操作地点
			site : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//卡票
			opCard : {id:'', name:''},
			//维检修作业明细
			opMaintRecordDetails : [],
			//操作票作业明细
			opStdRecordDetails : [],
			//负责人
			principals : [],
			//监护人
			supervisors : [],
			//操作人
			operators : [],
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
				"code" : [LIB.formRuleMgr.require("唯一标识"),
						  LIB.formRuleMgr.length()
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"startTime" : [LIB.formRuleMgr.require("作业开始时间"),
						  LIB.formRuleMgr.length()
				],
				"endTime" : [LIB.formRuleMgr.require("作业结束时间"),
						  LIB.formRuleMgr.length()
				],
				"type" : LIB.formRuleMgr.range(1, 100).concat(LIB.formRuleMgr.require("记录类型")),
				"equipNos" : [LIB.formRuleMgr.require("作业全部设备号"),
						  LIB.formRuleMgr.length()
				],
				"site" : [LIB.formRuleMgr.require("操作地点"),
						  LIB.formRuleMgr.length()
				],	
	        },
	        emptyRules:{}
		},
		selectModel : {
			opCardSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"opcardSelectModal":opCardSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowOpCardSelectModal : function() {
				this.selectModel.opCardSelectModel.visible = true;
				//this.selectModel.opCardSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveOpCard : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.opCard = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});