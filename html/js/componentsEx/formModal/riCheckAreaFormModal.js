define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./riCheckAreaFormModal.html");
	var riCheckTableSelectModal = require("componentsEx/selectTableModal/riCheckTableSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//巡检区域名称
			name : null,
			//关联类型 1:自身,2:属地
			refType : null,
			//禁用标识 0:未禁用,1:已禁用
			disable : null,
			//序号
			orderNo : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//巡检表
			riCheckTable : {id:'', name:''},
			//巡检点
			riCheckPoints : [],
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
				"refType" : LIB.formRuleMgr.range(1, 100).concat(LIB.formRuleMgr.require("关联类型")),
				"disable" : LIB.formRuleMgr.range(1, 100).concat(LIB.formRuleMgr.require("状态")),
				"orderNo" : LIB.formRuleMgr.range(1, 100).concat(LIB.formRuleMgr.require("序号"))
	        },
	        emptyRules:{}
		},
		selectModel : {
			riCheckTableSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"richecktableSelectModal":riCheckTableSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowRiCheckTableSelectModal : function() {
				this.selectModel.riCheckTableSelectModel.visible = true;
				//this.selectModel.riCheckTableSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveRiCheckTable : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.riCheckTable = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});