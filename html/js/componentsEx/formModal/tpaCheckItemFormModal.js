define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./tpaCheckItemFormModal.html");
    var api = require("views/businessFiles/certificateFiles/tpaCheckTable/vuex/api");
	// var risktypeSelectModal = require("componentsEx/selectTableModal/risktypeSelectModal");
	var equipmentSelectModal = require("componentsEx/selectTableModal/tpaEquipmentSelectModal");
	//初始化数据模型
	var newVO = function() {
		return {
			//ID
			id : null,
			//
			code : null,
			//检查项名称
			name : null,
			//类型 0 行为类   1 状态类  2 管理类
			type : null,
			//
			compId : null,
			//组织id
			orgId : null,
			//检查项来源标识 0转隐患生成 1危害辨识生成  2手动生成
			// category : null,
			//是否禁用，0启用，1禁用
			disable : "0",
			//是否被使用 0：未使用 1已使用
			isUse : null,
			//备注
			remarks : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//检查分类
            riskType : {},
			//检查方法
			checkMethods : [],
            riskTypeId:null,
			//设备设施
            tpaEquipment : {id:'', name:''}

		}
	};

	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : '',
			isReadOnly : false,
			title:"新增",
			showRisktypeSelectModal : false,
            typeList:[{id:"0",name:"行为类"},{id:"1",name:"状态类"},{id:"2",name:"管理类"}],
			//验证规则
	        rules:{
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"code" : [LIB.formRuleMgr.require(""),
						  LIB.formRuleMgr.length()
				],
				"name" : [LIB.formRuleMgr.require("检查项名称"),
						  LIB.formRuleMgr.length(500)
				],
				"type" : [LIB.formRuleMgr.require("类型"),
						  LIB.formRuleMgr.length()
				],
                "compId" : [{required: true, message: '请选择所属公司'},
                    LIB.formRuleMgr.length()
                ],
				// "category" : [LIB.formRuleMgr.length()],
				// "disable" : [LIB.formRuleMgr.length()],
				// "isUse" : [LIB.formRuleMgr.length()],
				// "remarks" : [LIB.formRuleMgr.length()],
				// "modifyDate" : [LIB.formRuleMgr.length()],
				// "createDate" : [LIB.formRuleMgr.length()],
	        },
	        emptyRules:{},

		},
		selectModel:{
			equipmentSelectModel:{
				visible : false
			}
		},
        riskTypeList:[],
        selectedDatas:[],
        riskTypeId:null,
        riskTypeName:null,
	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"equipmentSelectModal":equipmentSelectModal
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowEquipmentSelectModal : function() {
				this.selectModel.equipmentSelectModel.visible = true;
			},
			doSaveEquipment : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.tpaEquipment = selectedDatas[0];
				}
			},
			doClearInput:function(){
				this.mainModel.vo.tpaEquipment.id = null;
			},
			beforeInit:function(){
				this.selectedDatas=[];
				this.mainModel.opType = 'create';
                api.checkItemType().then(function(res){
                    dataModel.riskTypeList = res.data;
                });
			},
		},
        ready:function(){

        }
	});
	
	return detail;
});