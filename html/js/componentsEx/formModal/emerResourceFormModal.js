define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./emerresourceFormModal.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//名称
			name : null,
			//状态 0:在用,1:停用,2:报废
			status : null,
			//存储地点
			location : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//单位
			unit : null,
			//数量
			quantity : null,
			//分类 1:作业场所配备,2:个人防护装备,3:救援车辆配备,4:救援物资配备
			type : null,
			//联系电话
			contactNumber : null,
			//
			remark : null,
			//技术要求或功能要求
			reqirement : null,
			//抢险救援物资种类 1:侦检,2:警戒,3:灭火,4:通信,5:救生,6:破拆,7:堵漏,8:输转,9:洗消,10:排烟,11:照明,12:其他
			rescueSupplyCategory : null,
			//抢险救援车辆种类 1:灭火抢险救援车,2:举高抢险救援车,3:专勤抢险救援车,4:后勤抢险救援车
			rescueVehicleCategory : null,
			//规格型号
			specification : null,
			//管理人
			user : {id:'', name:''},
			//检验检测清单
			emerInspectRecords : [],
			//维修保养清单
			emerMaintRecords : [],
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
				"name" : [LIB.formRuleMgr.require("名称"),
						  LIB.formRuleMgr.length(50)
				],
				"status" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("状态")),
				"location" : [LIB.formRuleMgr.require("存储地点"),
						  LIB.formRuleMgr.length(200)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"unit" : [LIB.formRuleMgr.require("单位"),
						  LIB.formRuleMgr.length(10)
				],
				"quantity" : [LIB.formRuleMgr.length(10)],
				"type" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("分类")),
				"contactNumber" : [LIB.formRuleMgr.length(100)],
				"remark" : [LIB.formRuleMgr.length(500)],
				"reqirement" : [LIB.formRuleMgr.length(200)],
				"rescueSupplyCategory" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"rescueVehicleCategory" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"specification" : [LIB.formRuleMgr.length(200)],
				"user.id" : [LIB.formRuleMgr.allowStrEmpty],
	        },
	        emptyRules:{}
		},
		selectModel : {
			userSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"userSelectModal":userSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowUserSelectModal : function() {
				this.selectModel.userSelectModel.visible = true;
				//this.selectModel.userSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveUser : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.user = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});