define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./projThrSimultaneousTaskFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//角色编码
			code : null,
			//类型 1:职业病防护,2:安全防护,3:防火防护,4:环境防护
			type : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//
			compId : null,
			//
			orgId : null,
			//政府审查性质 1:公司内部,2:委托外包
			examineNature : null,
			//执行单位
			execuDept : null,
			//项目阶段 1:可行性研究,2:项目立项,3:初步设计,4:详细设计,5:施工建设,6:试生产
			phase : null,
			//任务计划结束时间
			planEndDate : null,
			//任务计划开始时间
			planStartDate : null,
			//项目实际结束时间
			realEndDate : null,
			//项目实际开始时间
			realStartDate : null,
			//任务性质 1:公司内部,2:委托外包
			taskNature : null,
			//项目三同时
			projThrSimultaneous : {id:'', name:''},
			//任务执行明细
			projThrSimultaneousTaskDetails : [],
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
				"type" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("类型")),
				"disable" :LIB.formRuleMgr.require("状态"),
				"compId" : [LIB.formRuleMgr.require("")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"examineNature" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"execuDept" : [LIB.formRuleMgr.length(200)],
				"phase" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"planEndDate" : [LIB.formRuleMgr.allowStrEmpty],
				"planStartDate" : [LIB.formRuleMgr.allowStrEmpty],
				"realEndDate" : [LIB.formRuleMgr.allowStrEmpty],
				"realStartDate" : [LIB.formRuleMgr.allowStrEmpty],
				"taskNature" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"projThrSimultaneous.id" : [LIB.formRuleMgr.allowStrEmpty],
	        },
	        emptyRules:{}
		},
		selectModel : {
			projThrSimultaneousSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowProjThrSimultaneousSelectModal : function() {
				this.selectModel.projThrSimultaneousSelectModel.visible = true;
				//this.selectModel.projThrSimultaneousSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveProjThrSimultaneous : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.projThrSimultaneous = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});