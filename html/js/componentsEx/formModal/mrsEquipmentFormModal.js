define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./mrsEquipmentFormModal.html");
	var majorRiskSourceSelectModal = require("src/main/webapp/html/js/componentsEx/selectTableModal/majorRiskSourceEquipmentSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//名称
			name : null,
			//启用/禁用 0:启用,1:禁用
			disable : "0",
			//数量
			quantity : null,
			//类型 1:设备,2:管道,3:监控系统,4:设备子件
			type : null,
			//生产厂家
			manufacturer : null,
			//公称直径
			nominalDiameter : null,
			//管道材质
			pipingMaterial : null,
			//出厂日期
			productionDate : null,
			//规格型号
			specification : null,
			//储存介质
			storageMedium : null,
			//工程壁厚
			wallThickness : null,
			//重大危险源
			majorRiskSource : {id:'', name:''},
			//储存设备/管道/监控设备维护记录
			mrsEquipMaintRecords : [],
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
				"name" : [LIB.formRuleMgr.require("名称"),
						  LIB.formRuleMgr.length(100)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"quantity" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.require("数量")),
				"type" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("类型")),
				"manufacturer" : [LIB.formRuleMgr.length(100)],
				"nominalDiameter" : [LIB.formRuleMgr.length(100)],
				"pipingMaterial" : [LIB.formRuleMgr.length(100)],
				"productionDate" : [LIB.formRuleMgr.allowStrEmpty],
				"specification" : [LIB.formRuleMgr.length(100)],
				"storageMedium" : [LIB.formRuleMgr.length(100)],
				"wallThickness" : [LIB.formRuleMgr.length(100)],
				"majorRiskSource.id" : [LIB.formRuleMgr.require("重大危险源")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			majorRiskSourceSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"majorrisksourceSelectModal":majorRiskSourceSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowMajorRiskSourceSelectModal : function() {
				this.selectModel.majorRiskSourceSelectModel.visible = true;
				//this.selectModel.majorRiskSourceSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveMajorRiskSource : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.majorRiskSource = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});