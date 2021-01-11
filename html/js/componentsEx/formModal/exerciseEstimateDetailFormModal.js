define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./exerciseEstimateDetailFormModal.html");
	var exerciseEstimateSelectModal = require("componentsEx/selectTableModal/exerciseEstimateSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//客观记录
			objectiveRecord : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//存在问题
			problem : null,
			//评价内容
			content : null,
			//改进建议
			suggestion : null,
			//演练评估
			exerciseEstimate : {id:'', name:''},
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
				"objectiveRecord" : [LIB.formRuleMgr.require("客观记录"),
						  LIB.formRuleMgr.length(2000)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"problem" : [LIB.formRuleMgr.require("存在问题"),
						  LIB.formRuleMgr.length(2000)
				],
				"content" : [LIB.formRuleMgr.require("评价内容"),
						  LIB.formRuleMgr.length(2000)
				],
				"suggestion" : [LIB.formRuleMgr.require("改进建议"),
						  LIB.formRuleMgr.length(2000)
				],
				"exerciseEstimate.id" : [LIB.formRuleMgr.require("演练评估")],
	        },
	        emptyRules:{}
		},
		selectModel : {
			exerciseEstimateSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"exerciseestimateSelectModal":exerciseEstimateSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowExerciseEstimateSelectModal : function() {
				this.selectModel.exerciseEstimateSelectModel.visible = true;
				//this.selectModel.exerciseEstimateSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveExerciseEstimate : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.exerciseEstimate = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});