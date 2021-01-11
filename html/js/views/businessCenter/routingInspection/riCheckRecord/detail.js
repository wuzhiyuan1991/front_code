define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var riCheckTableSelectModal = require("componentsEx/selectTableModal/riCheckTableSelectModal");
	var riCheckTaskSelectModal = require("componentsEx/selectTableModal/riCheckTaskSelectModal");
	var riCheckPlanSelectModal = require("componentsEx/selectTableModal/riCheckPlanSelectModal");
	var riCheckRecordDetailFormModal = require("componentsEx/formModal/riCheckRecordDetailFormModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
			id : null,
			//编码
			code : null,
			//检查结果详情 如10/10,10条合格,10条不合格
			checkResultDetail : null,
			//检查结果 0:不合格,1:合格
			checkResult : null,
			//禁用标识 0:未禁用,1:已禁用
			disable : null,
			//检查时间
			checkDate : null,
			//
			compId : null,
			//组织id
			orgId : null,
			//检查开始时间
			checkBeginDate : null,
			//检查结束时间
			checkEndDate : null,
			//来源 0:手机检查,1:web录入
			checkSource : null,
			//备注
			remarks : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//检查人
			user : {id:'', name:''},
			//巡检表
			riCheckTable : {id:'', name:''},
			//巡检任务
			riCheckTask : {id:'', name:''},
			//巡检计划
			riCheckPlan : {id:'', name:''},
			//巡检记录明细
			riCheckRecordDetails : [],
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
				"code" : [LIB.formRuleMgr.length()],
				"checkResultDetail" : [LIB.formRuleMgr.require("检查结果详情"),
						  LIB.formRuleMgr.length()
				],
				"checkResult" : [LIB.formRuleMgr.require("检查结果"),
						  LIB.formRuleMgr.length()
				],
				"disable" : LIB.formRuleMgr.require("状态"),
				"checkDate" : [LIB.formRuleMgr.require("检查时间"),
						  LIB.formRuleMgr.length()
				],
				"checkSource" : LIB.formRuleMgr.range(1, 100),
				"remarks" : [LIB.formRuleMgr.length()],
	        }
		},
		tableModel : {
			riCheckRecordDetailTableModel : LIB.Opts.extendDetailTableOpt({
				url : "richeckrecord/richeckrecorddetails/list/{curPage}/{pageSize}",
				columns : [
					LIB.tableMgr.ksColumn.code,
				{
					title : "名称",
					fieldName : "name",
					keywordFilterName: "criteria.strValue.keyWordValue_name"
				},{
					title : "",
					fieldType : "tool",
					toolType : "edit,del"
				}]
			}),
		},
		formModel : {
			riCheckRecordDetailFormModel : {
				show : false,
				hiddenFields : ["checkRecordId"],
				queryUrl : "richeckrecord/{id}/richeckrecorddetail/{riCheckRecordDetailId}"
			},
		},
		selectModel : {
			userSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			riCheckTableSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			riCheckTaskSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			riCheckPlanSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

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
			 beforeInit 		//初始化之前回调
			 afterInit			//初始化之后回调
			 afterInitData		//请求 查询 接口后回调
			 afterInitFileData  //请求 查询文件列表 接口后回调
			 beforeDoSave		//请求 新增/更新 接口前回调，返回false时不进行保存操作
			 afterFormValidate	//表单rule的校验通过后回调，，返回false时不进行保存操作
			 buildSaveData		//请求 新增/更新 接口前回调，重新构造接口的参数
			 afterDoSave		//请求 新增/更新 接口后回调
			 beforeDoDelete		//请求 删除 接口前回调
			 afterDoDelete		//请求 删除 接口后回调
		 events
		 vue组件声明周期方法
		 init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
	 **/
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
		template: tpl,
		components : {
			"userSelectModal":userSelectModal,
			"richecktableSelectModal":riCheckTableSelectModal,
			"richecktaskSelectModal":riCheckTaskSelectModal,
			"richeckplanSelectModal":riCheckPlanSelectModal,
			"richeckrecorddetailFormModal":riCheckRecordDetailFormModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowUserSelectModal : function() {
				this.selectModel.userSelectModel.visible = true;
				//this.selectModel.userSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveUser : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.user = selectedDatas[0];
				}
			},
			doShowRiCheckTableSelectModal : function() {
				this.selectModel.riCheckTableSelectModel.visible = true;
				//this.selectModel.riCheckTableSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveRiCheckTable : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.riCheckTable = selectedDatas[0];
				}
			},
			doShowRiCheckTaskSelectModal : function() {
				this.selectModel.riCheckTaskSelectModel.visible = true;
				//this.selectModel.riCheckTaskSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveRiCheckTask : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.riCheckTask = selectedDatas[0];
				}
			},
			doShowRiCheckPlanSelectModal : function() {
				this.selectModel.riCheckPlanSelectModel.visible = true;
				//this.selectModel.riCheckPlanSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveRiCheckPlan : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.riCheckPlan = selectedDatas[0];
				}
			},
			doShowRiCheckRecordDetailFormModal4Update : function(param) {
				this.formModel.riCheckRecordDetailFormModel.show = true;
				this.$refs.richeckrecorddetailFormModal.init("update", {id: this.mainModel.vo.id, riCheckRecordDetailId: param.entry.data.id});
			},
			doShowRiCheckRecordDetailFormModal4Create : function(param) {
				this.formModel.riCheckRecordDetailFormModel.show = true;
				this.$refs.richeckrecorddetailFormModal.init("create");
			},
			doSaveRiCheckRecordDetail : function(data) {
				if (data) {
					var _this = this;
					api.saveRiCheckRecordDetail({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.richeckrecorddetailTable);
					});
				}
			},
			doUpdateRiCheckRecordDetail : function(data) {
				if (data) {
					var _this = this;
					api.updateRiCheckRecordDetail({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.richeckrecorddetailTable);
					});
				}
			},
			doRemoveRiCheckRecordDetails : function(item) {
				var _this = this;
				var data = item.entry.data;
				api.removeRiCheckRecordDetails({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					_this.$refs.richeckrecorddetailTable.doRefresh();
				});
			},
			afterInitData : function() {
				this.$refs.richeckrecorddetailTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.richeckrecorddetailTable.doClearData();
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