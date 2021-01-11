define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./lawsChapterFormModal.html");
	// var lawsSelectModal = require("componentsEx/selectTableModal/lawsSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//角色编码
			code : null,
			//章节名称
			name : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//法律法规
			laws : {id:'', name:''},
			//正文内容
			lawsContents : [],
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
				"laws.id" : [LIB.formRuleMgr.allowStrEmpty],
	        },
	        emptyRules:{}
		},
		selectModel : {
			lawsSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			// "lawsSelectModal":lawsSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			// doShowLawsSelectModal : function() {
			// 	this.selectModel.lawsSelectModel.visible = true;
			// 	//this.selectModel.lawsSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			// },
			// doSaveLaws : function(selectedDatas) {
			// 	if (selectedDatas) {
			// 		this.mainModel.vo.laws = selectedDatas[0];
			// 	}
			// },
			
		}
	});
	
	return detail;
});