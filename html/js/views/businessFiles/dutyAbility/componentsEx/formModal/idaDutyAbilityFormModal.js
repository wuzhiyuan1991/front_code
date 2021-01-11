define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./idaDutyAbilityFormModal.html");
	var idaCourseKpointSelectModal = require("componentsEx/selectTableModal/idaCourseKpointSelectModal");
	var idaDutySubjectSelectModal = require("componentsEx/selectTableModal/idaDutySubjectSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//履职能力要求
			ability : null,
			//分组
			group : null,
			//职责描述
			duty : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//公司id
			compId : null,
			//部门id
			orgId : null,
			//章节
			idaCourseKpoint : {id:'', name:''},
			//岗位分类
			idaDutySubject : {id:'', name:''},
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
				"ability" : [LIB.formRuleMgr.require("履职能力要求"),
						  LIB.formRuleMgr.length(100)
				],
				"group" : [LIB.formRuleMgr.require("分组"),
						  LIB.formRuleMgr.length(100)
				],
				"duty" : [LIB.formRuleMgr.require("职责描述"),
						  LIB.formRuleMgr.length(100)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"compId" : [LIB.formRuleMgr.require("公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"idaCourseKpoint.id" : [LIB.formRuleMgr.allowStrEmpty],
				"idaDutySubject.id" : [LIB.formRuleMgr.require("岗位分类")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			idaCourseKpointSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			idaDutySubjectSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"idacoursekpointSelectModal":idaCourseKpointSelectModal,
			"idadutysubjectSelectModal":idaDutySubjectSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowIdaCourseKpointSelectModal : function() {
				this.selectModel.idaCourseKpointSelectModel.visible = true;
				//this.selectModel.idaCourseKpointSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveIdaCourseKpoint : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.idaCourseKpoint = selectedDatas[0];
				}
			},
			doShowIdaDutySubjectSelectModal : function() {
				this.selectModel.idaDutySubjectSelectModel.visible = true;
				//this.selectModel.idaDutySubjectSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveIdaDutySubject : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.idaDutySubject = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});