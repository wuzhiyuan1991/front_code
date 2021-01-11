define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-tab-xl.html");
	var riskAssessmentSelectModal = require("componentsEx/selectTableModal/riskAssessmentSelectModal");
	var riskCardFormModal = require("componentsEx/formModal/riskCardFormModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//角色编码
			code : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//
			compId : null,
			//组织id
			orgId : null,
			//事故类型
			accidentType : null,
			//控制措施
			controlMeasures : null,
			//应急处置措施
			emergencyMeasures : null,
			//急救电话
			emergencyTelephone : null,
			//火警电话
			fireTelephone : null,
			//风险评价等级 1高,2中,3低
			riskLevel : null,
			//风险等级模型
			riskModel : null,
			//风险点
			riskPoint : null,
			//危害因素(风险场景)
			scene : null,
			//状态 0:停用,1:启用
			state : null,
			//联系电话
			telephone : null,
			//危害辨识
			riskAssessments : [],
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
				"code" : [LIB.formRuleMgr.length(100)],
				"disable" :LIB.formRuleMgr.require("状态"),
				"compId" : [LIB.formRuleMgr.require("")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"accidentType" : [LIB.formRuleMgr.length(500)],
				"controlMeasures" : [LIB.formRuleMgr.length(65535)],
				"emergencyMeasures" : [LIB.formRuleMgr.length(1000)],
				"emergencyTelephone" : [LIB.formRuleMgr.length(500)],
				"fireTelephone" : [LIB.formRuleMgr.length(500)],
				"riskLevel" : [LIB.formRuleMgr.length(10)],
				"riskModel" : [LIB.formRuleMgr.length(1000)],
				"riskPoint" : [LIB.formRuleMgr.length(1000)],
				"scene" : [LIB.formRuleMgr.length(65535)],
				"state" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"telephone" : [LIB.formRuleMgr.length(15)],
	        }
		},
		tableModel : {
			riskAssessmentTableModel : LIB.Opts.extendDetailTableOpt({
				url : "riskcard/riskassessments/list/{curPage}/{pageSize}",
				columns : [
					LIB.tableMgr.ksColumn.code,
				{
					title : "名称",
					fieldName : "name",
					keywordFilterName: "criteria.strValue.keyWordValue_name"
				},{
					title : "",
					fieldType : "tool",
					toolType : "del"
				}]
			}),
		},
		formModel : {
			riskCardFormModel : {
				show : false,
				queryUrl : "riskcard/{id}"
			}
		},
		cardModel : {
			riskAssessmentCardModel : {
				showContent : true
			},
		},
		selectModel : {
			riskAssessmentSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

		//无需附件上传请删除此段代码
		/*
		 fileModel:{
			 default : {
				 cfg: {
					 params: {
						 recordId: null,
						 dataType: 'XXX1', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
						 fileType: 'XX'    // 文件类型标识，需要根据数据库的注释进行对应的修改
					 }
				 },
				data : []
			 }
		 }
		 */

	};
	//Vue组件
	/**
	 *  请统一使用以下顺序配置Vue参数，方便codeview
	 *	 el
		 template
		 components
		 componentName
		 props
		 data
		 computed
		 watch
		 methods
			_XXX    			//内部方法
			doXXX 				//事件响应方法
			beforeInit 			//初始化之前回调
			afterInit			//初始化之后回调
			afterInitData		//请求 查询 接口后回调
			afterInitFileData   //请求 查询文件列表 接口后回调
			beforeDoSave		//请求 新增/更新 接口前回调，返回false时不进行保存操作
			afterFormValidate	//表单rule的校验通过后回调，，返回false时不进行保存操作
			buildSaveData		//请求 新增/更新 接口前回调，重新构造接口的参数
			afterDoSave			//请求 新增/更新 接口后回调
			beforeDoDelete		//请求 删除 接口前回调
			afterDoDelete		//请求 删除 接口后回调
		 events
		 vue组件声明周期方法
		 init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
	 **/
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailTabXlPanel],
		template: tpl,
		components : {
			"riskassessmentSelectModal":riskAssessmentSelectModal,
			"riskcardFormModal":riskCardFormModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowRiskAssessmentSelectModal : function() {
				this.selectModel.riskAssessmentSelectModel.visible = true;
				//this.selectModel.riskAssessmentSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveRiskAssessments : function(selectedDatas) {
				if (selectedDatas) {
					dataModel.mainModel.vo.riskAssessments = selectedDatas;
					var param = _.map(selectedDatas, function(data){return {id : data.id}});
					var _this = this;
					api.saveRiskAssessments({id : dataModel.mainModel.vo.id}, param).then(function() {
						_this.refreshTableData(_this.$refs.riskassessmentTable);
					});
				}
			},
			doRemoveRiskAssessment : function(item) {
				var _this = this;
				var data = item.entry.data;
				LIB.Modal.confirm({
					title: '删除当前数据?',
					onOk: function () {
						api.removeRiskAssessments({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
							_this.$refs.riskassessmentTable.doRefresh();
						});
					}
				});
			},
			doShowRiskCardFormModal4Update : function(data) {
				this.formModel.riskCardFormModel.show = true;
				this.$refs.riskcardFormModal.init("update", {id: this.mainModel.vo.id});
			},
			doUpdateRiskCard : function(data) {
				this.doUpdate(data);
			},
			afterInitData : function() {
				this.$refs.riskassessmentTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.riskassessmentTable.doClearData();
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