define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var questionSelectModal = require("componentsEx/selectTableModal/questionSelectModal");
	var paperRecordSelectModal = require("componentsEx/selectTableModal/paperRecordSelectModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
			//
			id : null,
			//唯一标识
			code : null,
			//禁用标识， 1:已禁用，0：未禁用，null:未禁用
			disable : null,
			//用户答案
			userAnswer : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//试题
			question : {id:'', name:'',content:"",type:"",answer:"",analysis:""},
			//考试记录
			paperRecord : {id:'', name:''},
			answer : "",
			opts :null,
			analysis:null,
			examPoints:null,
		}
	};
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
			
			//验证规则
	        rules:{
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"code" : [LIB.formRuleMgr.require("唯一标识"),
						  LIB.formRuleMgr.length()
				],
				"disable" : [LIB.formRuleMgr.length()],
				"userAnswer" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		},
		tableModel : {
		},
		formModel : {
		},
		selectModel : {
			questionSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			paperRecordSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	//Vue组件
	/**
	 *  请统一使用以下顺序配置Vue参数，方便codeview
	 *	el
	 template
	 components
	 componentName
	 props
	 data
	 computed
	 watch
	 methods
	 events
	 vue组件声明周期方法
	 created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
	 **/
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
		template: tpl,
		components : {
			"questionSelectModal":questionSelectModal,
			"paperrecordSelectModal":paperRecordSelectModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowQuestionSelectModal : function() {
				this.selectModel.questionSelectModel.visible = true;
				//this.selectModel.questionSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveQuestion : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.question = selectedDatas[0];
				}
			},
			doShowPaperRecordSelectModal : function() {
				this.selectModel.paperRecordSelectModel.visible = true;
				//this.selectModel.paperRecordSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSavePaperRecord : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.paperRecord = selectedDatas[0];
				}
			},
			afterInitData:function(){
				var _this = this;
				if(!_.propertyOf(this.mainModel.vo)("question.id")) {
					return
				}
				//获取试卷详情
				api.queryOpts({id:_this.mainModel.vo.question.id}).then(function(res){
					_this.mainModel.vo.opts =  res.data;
				})
			},

		},
		events : {
		},
        ready: function(){
        	this.$api = api;
        }
	});

	return detail;
});