define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./standardChapterFormModal.html");
	var standardSelectModal = require("componentsEx/selectTableModal/standardSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//角色编码
			code : null,
			//章节名称
			name : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//标准规范
			standard : {id:'', name:''},
			//正文内容
			standardContents : [],
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
				"name" : [LIB.formRuleMgr.require("章节名称"),
						  LIB.formRuleMgr.length(100)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"standard.id" : [LIB.formRuleMgr.allowStrEmpty],
	        },
	        emptyRules:{}
		},
		selectModel : {
			standardSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"standardSelectModal":standardSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowStandardSelectModal : function() {
				this.selectModel.standardSelectModel.visible = true;
				//this.selectModel.standardSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveStandard : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.standard = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});