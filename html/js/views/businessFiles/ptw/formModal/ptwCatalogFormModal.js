define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./ptwCatalogFormModal.html");
	var ptwCatalogSelectModal = require("../selectTableModal/ptwCatalogSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//(级别/指标）名称/承诺岗位
			name : null,
			//启用/禁用 0:启用,1:禁用
			disable : "0",
			//字典类型 1:作业类型,2:作业分级,3:个人防护设备,4:气体检测指标,5:岗位会签承诺
			type : null,
			//分级依据/标准范围/承诺内容
			content : null,
			//作业级别
			level : null,
			//单位（气体检测指标）
			unit : null,
			//父级类型
			parent : {id:'', name:''},
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
				"name" : [LIB.formRuleMgr.require("(级别/指标）名称/承诺岗位"),
						  LIB.formRuleMgr.length(50)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"type" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("字典类型")),
				"content" : [LIB.formRuleMgr.length(500)],
				"level" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"unit" : [LIB.formRuleMgr.length(50)],
				"parent.id" : [LIB.formRuleMgr.allowStrEmpty],
	        },
	        emptyRules:{}
		},
		selectModel : {
			parentSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"ptwcatalogSelectModal":ptwCatalogSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowParentSelectModal : function() {
				this.selectModel.parentSelectModel.visible = true;
				//this.selectModel.parentSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveParent : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.parent = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});