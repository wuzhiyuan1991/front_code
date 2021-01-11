define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./courseFormModal.html");
	var cloudFileSelectModal = require("componentsEx/selectTableModal/cloudFileSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//课程id
			id : null,
			//唯一标识
			code : null,
			//课程名称
			name : null,
			//
			compId : null,
			//组织机构id
			orgId : null,
			//类型 1法定 2知识 3技能
			category : null,
			//课程简介
			description : null,
			//禁用标识， 1:已禁用，0：未禁用，null:未禁用
			disable : null,
			//培训效果 1了解 2掌握 3精通 4取证
			effect : null,
			//复培频率 以年为单位 0表示一次性
			frequence : null,
			//语言 0中文 1英语
			language : null,
			//启用多频率提醒距离培训开始的天数
			lastRemindDays : null,
			//多频率提醒的频率 天为单位
			lastRemindFrequence : null,
			//三级安全教育  1班组级 2车间级 3厂级
			level : null,
			//学习条件
			precondition : null,
			//培训目的
			purpose : null,
			//备注
			remark : null,
			//提前提醒天数
			remindDays : null,
			//提醒标识 0不提醒 1普通提醒 2多频率提醒
			remindType : null,
			//所有关联分类id
			subjectLink : null,
			//培训课时
			trainHour : null,
			//授课类型 1自学 2教学 3实操
			type : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//课程封面
			cloudFile : {id:'', name:''},
			//课程章节
			courseKpoints : [],
			//讲师
			teachers : [],
			//行业
			industryCategories : [],
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
				"category" : [LIB.formRuleMgr.length()],
				"description" : [LIB.formRuleMgr.length()],
				"disable" : [LIB.formRuleMgr.length()],
				"effect" : [LIB.formRuleMgr.length()],
				"frequence" : [LIB.formRuleMgr.length()],
				"language" : [LIB.formRuleMgr.length()],
				"lastRemindDays" : [LIB.formRuleMgr.length()],
				"lastRemindFrequence" : [LIB.formRuleMgr.length()],
				"level" : [LIB.formRuleMgr.length()],
				"precondition" : [LIB.formRuleMgr.length()],
				"purpose" : [LIB.formRuleMgr.length()],
				"remark" : [LIB.formRuleMgr.length()],
				"remindDays" : [LIB.formRuleMgr.length()],
				"remindType" : [LIB.formRuleMgr.length()],
				"subjectLink" : [LIB.formRuleMgr.length()],
				"trainHour" : [LIB.formRuleMgr.length()],
				"type" : [LIB.formRuleMgr.length()],
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
			"cloudfileSelectModal":cloudFileSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowCloudFileSelectModal : function() {
				this.selectModel.cloudFileSelectModel.visible = true;
			},
			doSaveCloudFile : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.cloudFile = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});