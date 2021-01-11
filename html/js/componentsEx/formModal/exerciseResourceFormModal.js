define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./exerciseResourceFormModal.html");
	var emerResourceSelectModal = require("componentsEx/selectTableModal/emerResourceSelectModal");
	var exerciseSchemeSelectModal = require("componentsEx/selectTableModal/exerciseSchemeSelectModal");

    LIB.registerDataDic("iem_emer_resource_type1", [
        ["1","作业场所配备"],
        ["2","个人防护装备"],
        ["3","救援车辆配备"],
        ["4","救援物资配备"],
    ]);

	//初始化数据模型
	var newVO = function() {
		return {
			//名称
			name : null,
			//规格型号
			specification : null,
			//数量
			quantity : null,
			type:null,
			unit:null, //单位
			//应急资源
			emerResource : {id:'', name:''},
			// //演练方案
			// exerciseScheme : {id:'', name:''},
		}
	};

	//Vue数据
	var dataModel = {
        modify:true,
		mainModel : {
			vo : newVO(),
			opType : 'create',
			isReadOnly : false,
			title:"添加",

			//验证规则
	        rules:{
				"name" : [LIB.formRuleMgr.require("名称"),
						  LIB.formRuleMgr.length(50)
				],
				// "specification" :
				// 		  LIB.formRuleMgr.length(200)
				// ,
				// "quantity" : [LIB.formRuleMgr.require("数量"),
				// 		  LIB.formRuleMgr.length(50)
				// ],
                "quantity":[{required:true,validator:function(rule, value, callback){
                    // var a =  /^-?[1-9]\d*$/.test(value);
                    var a =  /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(String(value));

                    if(value <= 0){
                        return callback(new Error("请输入大于0的数"));
                    }

                    if(a){
                        return callback();
                    }else{
                        return callback(new Error("请输入两位小数"));
                    }
                }}],
                "unit" : [LIB.formRuleMgr.require("单位"),
                    LIB.formRuleMgr.length(10)
                ],
				"type":[LIB.formRuleMgr.require("资源类型")],
				// "emerResource.id" : [LIB.formRuleMgr.require("规格型号")],
				// "exerciseScheme.id" : [LIB.formRuleMgr.require("演练方案")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			emerResourceSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			exerciseSchemeSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"emerresourceSelectModal":emerResourceSelectModal,
			"exerciseschemeSelectModal":exerciseSchemeSelectModal,
			
		},
		watch:{
			visible:function (val) {
				val && this.afterInitData();
            }
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			beforeInit:function () {
				this.mainModel.vo = this.newVO();
            },
			afterInitData:function () {
				if(this.mainModel.vo.emerResource && this.mainModel.vo.emerResource.id){
                    this.modify =  false;
				}else{
					this.modify = true;
				}
            },
			doShowEmerResourceSelectModal : function() {
				this.selectModel.emerResourceSelectModel.visible = true;
				this.selectModel.emerResourceSelectModel.filterData = {status:0};
			},
			doSaveEmerResource : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.name = selectedDatas[0].name;
                    this.mainModel.vo.quantity = selectedDatas[0].quantity;
                    this.mainModel.vo.type = selectedDatas[0].type;
                    this.mainModel.vo.specification = selectedDatas[0].specification;
                    this.mainModel.vo.unit = selectedDatas[0].unit;

                    this.mainModel.vo.emerResource.id = selectedDatas[0].id;
					// if(selectedDatas[0].unit){
					// 	this.mainModel.vo.quantity += " ( " + selectedDatas[0].unit +" ) "
					// }
					this.modify = false;
				}
			},
			doShowExerciseSchemeSelectModal : function() {
				this.selectModel.exerciseSchemeSelectModel.visible = true;
				//this.selectModel.exerciseSchemeSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveExerciseScheme : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.exerciseScheme = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});