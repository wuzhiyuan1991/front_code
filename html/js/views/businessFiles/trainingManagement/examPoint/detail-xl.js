define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var courseSelectModal = require("componentsEx/selectTableModal/courseSelectModal");
	var questionSelectModal = require("componentsEx/selectTableModal/questionSelectModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
			//知识点id
			id : null,
			//编码
			code : null,
			//知识点名称
			name : null,
			compId:null
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
				"code" : [LIB.formRuleMgr.require("编码"),
						  LIB.formRuleMgr.length()
				],
				"name" : [LIB.formRuleMgr.length()],
	        },
	        emptyRules:{}
		},
		tableModel : {
			courseTableModel : LIB.Opts.extendDetailTableOpt({
				url : "exampoint/courses/list/{curPage}/{pageSize}",
				columns : [
				{
					title : "课程名称",
					fieldName : "name",
					keywordFilterName: "criteria.strValue.keyWordValue_name"
				},
				_.extend(_.omit(LIB.tableMgr.column.company, "filterType")),
				_.extend(_.omit(LIB.tableMgr.column.dept, "filterType")),
				
				{
                    title : "课程类型",
                    fieldName: "attr1",
                },{
					title : "",
					fieldType : "tool",
					toolType : "del"
				}]
			}),
			questionTableModel : {
				url : "exampoint/questions/list/{curPage}/{pageSize}",
				columns : [{
					title: "题型",
					fieldType : "custom",
					render : function(data){
						return LIB.getDataDic("question_type",data.type);
					}
				},{
					title : "试题内容",
					fieldName : "content",
					keywordFilterName: "criteria.strValue.keyWordValue_content"
				},{
					title : "",
					fieldType : "tool",
					toolType : "del"
				}]
			},
		},
		formModel : {
		},
		cardModel : {
			courseCardModel : {
				showContent : true
			},
			questionCardModel : {
				showContent : true
			},
		},
		selectModel : {
			courseSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			questionSelectModel : {
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
			"courseSelectModal":courseSelectModal,
			"questionSelectModal":questionSelectModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowCourseSelectModal : function() {
				this.selectModel.courseSelectModel.visible = true;
				//this.selectModel.courseSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveCourses : function(selectedDatas) {
				if (selectedDatas) {
					dataModel.mainModel.vo.courses = selectedDatas;
					var param = _.map(selectedDatas, function(data){return {id : data.id}});
					var _this = this;
					api.saveCourses({id : dataModel.mainModel.vo.id}, param).then(function() {
						_this.refreshTableData(_this.$refs.courseTable);
					});
				}
			},
			doRemoveCourses : function(item) {
				var _this = this;
				var data = item.entry.data;
				api.removeCourses({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					_this.$refs.courseTable.doRefresh();
				});
			},
			doShowQuestionSelectModal : function() {
				this.selectModel.questionSelectModel.visible = true;
				//this.selectModel.questionSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveQuestions : function(selectedDatas) {
				if (selectedDatas) {
					dataModel.mainModel.vo.questions = selectedDatas;
					var param = _.map(selectedDatas, function(data){return {id : data.id}});
					var _this = this;
					api.saveQuestions({id : dataModel.mainModel.vo.id}, param).then(function() {
						_this.refreshTableData(_this.$refs.questionTable);
					});
				}
			},
			doRemoveQuestions : function(item) {
				if(!this.hasPermission('4020004011')) {
                	LIB.Msg.warning("你没有此权限!");
                	return;
                }
				var _this = this;
				var data = item.entry.data;
				api.removeQuestions({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					_this.$refs.questionTable.doRefresh();
				});
			},
			afterInitData : function() {
				this.$refs.courseTable.doQuery({id : this.mainModel.vo.id});
				this.$refs.questionTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.courseTable.doClearData();
				this.$refs.questionTable.doClearData();
			},

		},
		events : {
		},
        init: function(){
        	this.$api = api;
        }
	});

	return detail;
});