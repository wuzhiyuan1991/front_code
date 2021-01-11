define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./regulationChapterFormModal.html");
	var regulationSelectModal = require("componentsEx/selectTableModal/regulationSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//角色编码
			code : null,
			//章节名称
			name : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//HSE制度库
			regulation : {id:'', name:''},
			//正文内容
			regulationContents : [],
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
				"regulation.id" : [LIB.formRuleMgr.allowStrEmpty],
	        },
	        emptyRules:{}
		},
		selectModel : {
			regulationSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"regulationSelectModal":regulationSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowRegulationSelectModal : function() {
				this.selectModel.regulationSelectModel.visible = true;
				//this.selectModel.regulationSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveRegulation : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.regulation = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});