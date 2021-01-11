define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./trainClassFormModal.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var teacherSelectModal = require("componentsEx/selectTableModal/teacherSelectModal");
	var trainPlanSelectModal = require("componentsEx/selectTableModal/trainPlanSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//主键
			id : null,
			//唯一标识
			code : null,
			//报名截止日期
			applyDeadline : null,
			//审核培训记录时间
			auditTime : null,
			//禁用标识， 1:已禁用，0：未禁用，null:未禁用
			disable : null,
			//结束时间
			endTime : null,
			//培训人数（必修）
			participantLimit : null,
			//报名人数（冗余）
			participants : null,
			//培训地点
			place : null,
			//开始时间
			startTime : null,
			//培训状态 1报名中 2报名结束 3培训中 4培训结束 5审批完成
			status : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//审核人
			user : {id:'', name:''},
			//讲师
			teacher : {id:'', name:''},
			//培训计划
			trainPlan : {id:'', name:''},
			//报名记录
			trainApplies : [],
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
	        	"place" : [LIB.formRuleMgr.require("培训地点"),LIB.formRuleMgr.length()],
	        	"teacherId" : [{required:true,message:'请选择讲师'}],
	        	"participantLimit" : [{type:'integer',required: true, message: '请填写必修人数'},
	      							{type:'integer',min: 0,message: '请选择正确的必修人数'}],
				"applyDeadline" : [{required:true,message:'请选择报名截止时间'}],
				"startTime" : [{required:true,message:'请选择开始时间'}],
				"endTime" : [{required:true,message:'请选择结束时间'}],
				
	        },
	        emptyRules:{}
		},
		selectModel : {
			teacherSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"teacherSelectModal":teacherSelectModal,
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowTeacherSelectModel : function() {
				this.selectModel.teacherSelectModel.visible = true;
				//this.selectModel.teacherSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveTeacher : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.teacher = selectedDatas[0];
					this.mainModel.vo.teacherId = selectedDatas[0].id;
				}
			},
		}
	});
	
	return detail;
});