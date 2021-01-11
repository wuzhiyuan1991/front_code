define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./selfEvaluationQuestionFormModal.html");
	var exerciseSchemeSelectModal = require("componentsEx/selectTableModal/exerciseSchemeSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//禁用标识 0:启用,1:禁用
			disable : "0",
			//自评内容
			content : null,
			//题型 1:单选,2:多选,3:问答
			type : '1',
			//问题选项
			selfEvaluationOpts : [],
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
				"disable" :LIB.formRuleMgr.require("状态"),
				"content" : [LIB.formRuleMgr.require("自评内容"),
						  LIB.formRuleMgr.length(200)
				],
				"type" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("题型")),
				"exerciseScheme.id" : [LIB.formRuleMgr.require("演练方案")],
				"selfEvaluationOpts":[{type:"array", required: true, validator:function (rule, value, callback) {
						if(value.length == 0){
                            return callback(new Error("请添加答案"))
						}
						return callback();
                }}]
	        },
	        emptyRules:{}
		},
		selectModel : {
			exerciseSchemeSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"exerciseschemeSelectModal":exerciseSchemeSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,

			beforeDoSave:function () {
				if(parseInt(this.mainModel.vo.type)>=3){
                    this.mainModel.vo.selfEvaluationOpts = [];
				}
				var arr = [];
				if(this.mainModel.vo.selfEvaluationOpts){
                    for(var i=0; i<this.mainModel.vo.selfEvaluationOpts.length; i++){
						if(this.mainModel.vo.selfEvaluationOpts[i].content){
							arr.push(this.mainModel.vo.selfEvaluationOpts[i]);
						}
                    }
				}
                this.mainModel.vo.selfEvaluationOpts = [].concat(arr);
                this.mainModel.vo.exerciseScheme = null;
                var status = false;
                this.$refs.ruleform.validate(function(valid) {
                    if (valid) {
                        status = valid;
					}
                });
                if(this.mainModel.vo.selfEvaluationOpts.length == 0){
                    this.mainModel.vo.selfEvaluationOpts.push({content:null});
                    this.mainModel.vo.selfEvaluationOpts.push({content:null});
                    this.mainModel.vo.selfEvaluationOpts.push({content:null});
                    this.mainModel.vo.selfEvaluationOpts.push({content:null});
				}
                return status;
            },

			afterDoSave:function () {
				LIB.Msg.info("保存成功");
            },

            doAddInputItem:function () {
                this.mainModel.vo.selfEvaluationOpts.push({content:null});
            },
			doShowExerciseSchemeSelectModal : function() {
				this.selectModel.exerciseSchemeSelectModel.visible = true;
				//this.selectModel.exerciseSchemeSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveExerciseScheme : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.exerciseScheme = selectedDatas[0];
				}
			},
			beforeInit:function () {
				if(this.mainModel.opType == "create"){
                    this.mainModel.vo = this.newVO();
                    this.mainModel.vo.selfEvaluationOpts.push({content:null});
                    this.mainModel.vo.selfEvaluationOpts.push({content:null});
                    this.mainModel.vo.selfEvaluationOpts.push({content:null});
                    this.mainModel.vo.selfEvaluationOpts.push({content:null});
				}
            }
		}
	});
	
	return detail;
});