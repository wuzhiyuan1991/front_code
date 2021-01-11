define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var opCardSelectModal = require("componentsEx/selectTableModal/opCardSelectModal");
	var jsaDetailNewFormModal = require("componentsEx/formModal/jsaDetailNewFormModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
			id : null,
			//编码
			code : null,
			//分析人员，可以以逗号或者是其他字符分割
			analysePerson : null,
			//作业日期
			workDate : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//分析小组组长
			analyseLeader : null,
			//作业内容
			taskContent : null,
			//公司Id
			compId : null,
			//部门Id
			orgId : null,
			//专家点评
			commentExpert : null,
			//管理处点评
			commentGlc : null,
			//公司点评
			commentGongsi : null,
			//施工单位，可手填
			construction : null,
			//是否承包商作业；0:否,1:是
			contractor : null,
			//表明是否复制页面传来的数据，非空时为复制页面传来的值
			copy : null,
			//是否为交叉作业
			crossTask : null,
			//
			isflag : null,
			//步骤json
			jsonstr : null,
			//是否为新的工作任务 0--已做过的任务；  1--新任务
			newTask : null,
			//是否需要许可证
			permit : null,
			//是否有特种作业人员资质证明
			qualification : null,
			//是否参考库
			reference : null,
			//备注
			remark : null,
			//步骤中最高风险级别的分值
			riskScore : null,
			//是否分享
			share : null,
			//是否有相关操作规程
			specification : null,
			//作业许可证号（如有）
			taskLicense : null,
			//提交类型
			updatetype : null,
			//作业位置
			workPlace : null,
			//票卡
			opCard : {id:'', name:''},
			//步骤
			jsaDetailNews : [],
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
				"code" : [LIB.formRuleMgr.length(255)],
				"analysePerson" : [LIB.formRuleMgr.require("分析人员，可以以逗号或者是其他字符分割"),
						  LIB.formRuleMgr.length(255)
				],
				"workDate" : [LIB.formRuleMgr.require("作业日期")],
				"disable" :LIB.formRuleMgr.require("状态"),
				"analyseLeader" : [LIB.formRuleMgr.require("分析小组组长"),
						  LIB.formRuleMgr.length(255)
				],
				"taskContent" : [LIB.formRuleMgr.require("作业内容"),
						  LIB.formRuleMgr.length(255)
				],
				"compId" : [LIB.formRuleMgr.require("公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"commentExpert" : [LIB.formRuleMgr.length(255)],
				"commentGlc" : [LIB.formRuleMgr.length(255)],
				"commentGongsi" : [LIB.formRuleMgr.length(255)],
				"construction" : [LIB.formRuleMgr.length(255)],
				"contractor" : [LIB.formRuleMgr.length(0)],
				"copy" : [LIB.formRuleMgr.length(255)],
				"crossTask" : [LIB.formRuleMgr.length(0)],
				"isflag" : [LIB.formRuleMgr.length(0)],
				"jsonstr" : [LIB.formRuleMgr.length(255)],
				"newTask" : [LIB.formRuleMgr.length(0)],
				"permit" : [LIB.formRuleMgr.length(0)],
				"qualification" : [LIB.formRuleMgr.length(0)],
				"reference" : [LIB.formRuleMgr.length(0)],
				"remark" : [LIB.formRuleMgr.length(255)],
				"riskScore" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"share" : [LIB.formRuleMgr.length(0)],
				"specification" : [LIB.formRuleMgr.length(0)],
				"taskLicense" : [LIB.formRuleMgr.length(255)],
				"updatetype" : [LIB.formRuleMgr.length(255)],
				"workPlace" : [LIB.formRuleMgr.length(255)],
				"opCard.id" : [LIB.formRuleMgr.allowStrEmpty],
	        }
		},
		tableModel : {
			jsaDetailNewTableModel : LIB.Opts.extendDetailTableOpt({
				url : "jsamasternew/jsadetailnews/list/{curPage}/{pageSize}?criteria.orderValue.fieldName=orderNo&criteria.orderValue.orderType=0",
				columns : [
					LIB.tableMgr.ksColumn.code,
				{
					title : "名称",
					fieldName : "name",
					keywordFilterName: "criteria.strValue.keyWordValue_name"
				},{
					title : "",
					fieldType : "tool",
					toolType : "move,edit,del"
				}]
			}),
		},
		formModel : {
			jsaDetailNewFormModel : {
				show : false,
				hiddenFields : ["jsaMasterNewId"],
				queryUrl : "jsamasternew/{id}/jsadetailnew/{jsaDetailNewId}"
			},
		},
		selectModel : {
			opCardSelectModel : {
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
			"opcardSelectModal":opCardSelectModal,
			"jsadetailnewFormModal":jsaDetailNewFormModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowOpCardSelectModal : function() {
				this.selectModel.opCardSelectModel.visible = true;
				//this.selectModel.opCardSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveOpCard : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.opCard = selectedDatas[0];
				}
			},
			doShowJsaDetailNewFormModal4Update : function(param) {
				this.formModel.jsaDetailNewFormModel.show = true;
				this.$refs.jsadetailnewFormModal.init("update", {id: this.mainModel.vo.id, jsaDetailNewId: param.entry.data.id});
			},
			doShowJsaDetailNewFormModal4Create : function(param) {
				this.formModel.jsaDetailNewFormModel.show = true;
				this.$refs.jsadetailnewFormModal.init("create");
			},
			doSaveJsaDetailNew : function(data) {
				if (data) {
					var _this = this;
					api.saveJsaDetailNew({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.jsadetailnewTable);
					});
				}
			},
			doUpdateJsaDetailNew : function(data) {
				if (data) {
					var _this = this;
					api.updateJsaDetailNew({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.jsadetailnewTable);
					});
				}
			},
			doRemoveJsaDetailNews : function(item) {
				var _this = this;
				var data = item.entry.data;
				api.removeJsaDetailNews({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					_this.$refs.jsadetailnewTable.doRefresh();
				});
			},
			doMoveJsaDetailNews : function(item) {
				var _this = this;
				var data = item.entry.data;
				var param = {
					id : data.id,
					jsaMasterNewId : dataModel.mainModel.vo.id
				};
				_.set(param, "criteria.intValue.offset", item.offset);
				api.moveJsaDetailNews({id : this.mainModel.vo.id}, param).then(function() {
					_this.$refs.jsadetailnewTable.doRefresh();
				});
			},
			afterInitData : function() {
				this.$refs.jsadetailnewTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.jsadetailnewTable.doClearData();
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