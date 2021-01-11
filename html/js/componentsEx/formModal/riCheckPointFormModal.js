define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./riCheckPointFormModal.html");
	var riCheckAreaSelectModal = require("componentsEx/selectTableModal/riCheckAreaSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//巡检区域名称
			name : null,
			//禁用标识 0:未禁用,1:已禁用
			disable : null,
			//关联类型 1:自身,2:设备设施
			refType : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//巡检区域
			riCheckArea : {id:'', name:''},
			//巡检项
			riCheckItems : [],
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
				"name" : [LIB.formRuleMgr.length()],
				"disable" : LIB.formRuleMgr.range(1, 100).concat(LIB.formRuleMgr.require("状态")),
				"refType" : LIB.formRuleMgr.range(1, 100),	
	        },
	        emptyRules:{}
		},
		selectModel : {
			riCheckAreaSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"richeckareaSelectModal":riCheckAreaSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowRiCheckAreaSelectModal : function() {
				this.selectModel.riCheckAreaSelectModel.visible = true;
				//this.selectModel.riCheckAreaSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveRiCheckArea : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.riCheckArea = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});