define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./emerStepFormModal.html");
	var emerSceneSelectModal = require("componentsEx/selectTableModal/emerSceneSelectModal");
	var emerCardSelectModal = require("componentsEx/selectTableModal/emerCardSelectModal");
	var emerPositionSelectModel = require("componentsEx/selectTableModal/emerPositionSelectModal")
	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//步骤
			name : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//负责人
			principal : null,
			//处置
			disposal : null,
			//事故场景
			emerScene : {id:'', name:''},
			//应急处置卡
			emerCard : {id:'', name:''},
            positions:null
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
				"name" : [LIB.formRuleMgr.require("步骤"),
						  LIB.formRuleMgr.length(100)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"principal" : [LIB.formRuleMgr.require("负责人"),
						  LIB.formRuleMgr.length(100)
				],
				"disposal" : [LIB.formRuleMgr.require("处置"),
						  LIB.formRuleMgr.length(300)
				],
				"positions":[{
					required:true, message:"请选择相关岗位",type:"array"
				}],
				"emerScene.id" : [LIB.formRuleMgr.require("事故场景")],
				"emerCard.id" : [LIB.formRuleMgr.require("应急处置卡")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			emerSceneSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			emerCardSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			emerPositionModel: {
				visible: false,
				filterData : {
					orgId: null
				}
			}
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"emersceneSelectModal":emerSceneSelectModal,
			"emercardSelectModal":emerCardSelectModal,
			"emerPositionSelectModel":emerPositionSelectModel
		},
		props:{
			id:{
				default:''
			},
		},
		data:function(){
			return dataModel;
		},


		methods:{
			newVO : newVO,

            doRemovePositions : function(index) {
                this.mainModel.vo.positions.splice(index, 1);
            },

			beforeInit:function () {
				this.selectModel.emerSceneSelectModel.filterData = {id:this.id}

            },

			afterInitData:function () {
            },

            doSavePosition:function (data) {
					this.mainModel.vo.positions = data;

            },
            doShowUserSelectModal:function () {
				this.selectModel.emerPositionModel.visible = true;
            },
			doShowEmerSceneSelectModal : function() {
                this.selectModel.emerSceneSelectModel.filterData = {id:this.id};
                this.selectModel.emerSceneSelectModel.visible = true;

                //this.selectModel.emerSceneSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveEmerScene : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.emerScene = selectedDatas[0];
				}
			},
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