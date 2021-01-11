define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./tpaCheckTableFormModal.html");
	var checkTableTypeSelectModal = require("componentsEx/selectTableModal/checkTableTypeSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//id
			id : null,
			//编码
			code : null,
			//检查表名称
			name : null,
			//检查表类型 1计划检查,0日常检查
			type : null,
			//
			compId : null,
			//组织id
			orgId : null,
			//是否禁用 0启用,1禁用
			disable : null,
			//备注
			remarks : null,
			//检查表类型 10 证书类 20 资料类
			tableType : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//检查表分类
			checkTableType : {id:'', name:''},
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
				"name" : [LIB.formRuleMgr.require("检查表名称"),
						  LIB.formRuleMgr.length()
				],
				"type" : [LIB.formRuleMgr.require("检查表类型"),
						  LIB.formRuleMgr.length()
				],
				"disable" : [LIB.formRuleMgr.length()],
				"remarks" : [LIB.formRuleMgr.length()],
				"tableType" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		},
		selectModel : {
			checkTableTypeSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"checktabletypeSelectModal":checkTableTypeSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowCheckTableTypeSelectModal : function() {
				this.selectModel.checkTableTypeSelectModel.visible = true;
				//this.selectModel.checkTableTypeSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveCheckTableType : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.checkTableType = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});