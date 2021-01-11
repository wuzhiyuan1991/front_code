define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./examPointFormModal.html");
	var courseSelectModal = require("componentsEx/selectTableModal/courseSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//考点id
			id : null,
			//编码
			code : null,
			//考点名称
			name : null,
			//
			compId : null,
			//组织id
			orgId : null,
			//是否禁用 0未发布，1发布
			disable : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//课程
			course : {id:'', name:''},
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
				"code" : [LIB.formRuleMgr.require("编码"),
						  LIB.formRuleMgr.length()
				],
				"name" : [LIB.formRuleMgr.length()],
				"disable" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		}
	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"courseSelectModal":courseSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowCourseSelectModal : function() {
				this.selectModel.courseSelectModel.visible = true;
			},
			doSaveCourse : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.course = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});