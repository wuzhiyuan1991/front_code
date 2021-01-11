define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./emerSceneFormModal.html");
	var emerCardSelectModal = require("componentsEx/selectTableModal/emerCardSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//处置卡名称
			name : "名称",
			//事故可能引发的次生、衍生事故
			derivativeEvents : null,
			//事故发生的可能时间，事故的危害严重程度及其影响范围
			timeAndInfluence : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//事故类型
			accidentType : null,
			//事故前可能出现的征兆
			sign : null,
			//事故发生的区域、地点或装置的名称
			accidentScene : null,
			//应急处置卡
			emerCard : {id:'', name:''},
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
				"name" : [LIB.formRuleMgr.require("处置卡名称"),
						  LIB.formRuleMgr.length(100)
				],
				"derivativeEvents" : [LIB.formRuleMgr.require("事故可能引发的次生、衍生事故"),
						  LIB.formRuleMgr.length(300)
				],
				"timeAndInfluence" : [LIB.formRuleMgr.require("事故发生的可能时间，事故的危害严重程度及其影响范围"),
						  LIB.formRuleMgr.length(300)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"accidentType" : [LIB.formRuleMgr.require("事故类型"),
						  LIB.formRuleMgr.length(300)
				],
				"sign" : [LIB.formRuleMgr.require("事故前可能出现的征兆"),
						  LIB.formRuleMgr.length(300)
				],
				"accidentScene" : [LIB.formRuleMgr.require("事故发生的区域、地点或装置的名称"),
						  LIB.formRuleMgr.length(300)
				],
				"emerCard.id" : [LIB.formRuleMgr.require("应急处置卡")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			emerCardSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"emercardSelectModal":emerCardSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowEmerCardSelectModal : function() {
				this.selectModel.emerCardSelectModel.visible = true;
				//this.selectModel.emerCardSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveEmerCard : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.emerCard = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});