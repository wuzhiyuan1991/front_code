define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
	var casualtyFormModal = require("componentsEx/formModal/casualtyFormModal");
	var economicLossFormModal = require("componentsEx/formModal/economicLossFormModal");
	
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//唯一标识
			code : null,
			//卡票名称
			name : null,
			//发生时间
			accidentTime : null,
			//发生地点
			attr1: null,
			//所属公司id
			compId : null,
			//事故简要经过
			description : null,
			//人员伤亡
			casualties : [],
			//初步估计经济损失
			economicLosses : [],
			unitPrincipalId:null,
			scenePrincipalId:null,
			investigation:{id:null},
			//事故单位负责人
			unitPrincipal : {id:'', name:'', mobile:''},
			//事故现场负责人
			scenePrincipal : {id:'', name:'', mobile:''},
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
				"code" : [LIB.formRuleMgr.require("唯一标识"),
						  LIB.formRuleMgr.length(100)
				],
				"name" : [LIB.formRuleMgr.require("事故名称"),
						  LIB.formRuleMgr.length(200)
				],
				"attr1" : [LIB.formRuleMgr.require("发生地点"),
					LIB.formRuleMgr.length(100)
				],
				"unitPrincipal.id" : [LIB.formRuleMgr.require("事故现场负责人")],
				"scenePrincipal.id" : [LIB.formRuleMgr.require("事故现场负责人")],
				"accidentTime" : [LIB.formRuleMgr.require("发生时间")],
				"compId" : [LIB.formRuleMgr.require("所属公司")],
				"description" : [LIB.formRuleMgr.require("事故简要经过"),
						  LIB.formRuleMgr.length(300)
				],
	        }
		},
		tableModel : {
			casualtyTableModel : LIB.Opts.extendDetailTableOpt({
				url : "accident/casualties/list/{curPage}/{pageSize}",
				columns : [
				{
					//人员归属 1:管理局员工,2:承包商员工
					title: "人员归属",
					fieldName: "affiliation",
					render: function (data) {
						return LIB.getDataDic("iam_casualty_affiliation", data.affiliation);
					}
				},
				{
					//死亡人数
					title: "死亡人数",
					fieldName: "deathToll",
				},
				{
					//受伤人数
					title: "受伤人数",
					fieldName: "injuryNumber",
				},
				{
					//事故描述
					title: "事故描述",
					fieldName: "remarks",
					renderClass: "textarea",
				},
				{
					title : "",
					fieldType : "tool",
					toolType : "edit,del"
				}]
			}),
			economicLossTableModel : LIB.Opts.extendDetailTableOpt({
				url : "accident/economiclosses/list/{curPage}/{pageSize}",
				columns : [
					{
						//损失物品
						title: "损失物品",
						fieldName: "lostArticle",
					},
					{
						//数量
						title: "数量",
						fieldName: "articleNumber",
					},
					{
						//单位
						title: "单位",
						fieldName: "articleUnit",
					},
					{
						//价值金额（元）
						title: "价值金额（元）",
						fieldName: "totalValue",
					},{
					title : "",
					fieldType : "tool",
					toolType : "edit,del"
				}]
			}),
		},
		formModel : {
			casualtyFormModel : {
				show : false,
				hiddenFields : ["accidentId"],
				queryUrl : "accident/{id}/casualty/{casualtyId}"
			},
			economicLossFormModel : {
				show : false,
				hiddenFields : ["accidentId"],
				queryUrl : "accident/{id}/economicloss/{economicLossId}"
			},
		},
		cardModel : {
			casualtyCardModel : {
				showContent : true
			},
			economicLossCardModel : {
				showContent : true
			},
		},
		selectModel : {
			unitPrincipalSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
			scenePrincipalSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},


		fileModel:{
			probableCause : {
				cfg: {
					params: {
						recordId: null,
						dataType: 'AC1', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
						fileType: 'AC'    // 文件类型标识，需要根据数据库的注释进行对应的修改
					},
					filters: {
						max_file_size: '10mb',
					},
				},
				data : []
			},
			other : {
				cfg: {
					params: {
						recordId: null,
						dataType: 'AC2', // 文件关联的业务对象的类型标识，需要根据数据库的注释进行对应的修改
						fileType: 'AC'    // 文件类型标识，需要根据数据库的注释进行对应的修改
					},
					filters: {
						max_file_size: '10mb',
					}
				},
				data : []
			}
		}


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
			"unitPrincipalSelectModal":userSelectModal,
			"scenePrincipalSelectModal":userSelectModal,
			"casualtyFormModal":casualtyFormModal,
			"economiclossFormModal":economicLossFormModal,
			
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowUnitPrincipalSelectModal : function() {
				this.selectModel.unitPrincipalSelectModel.visible = true;
				//this.selectModel.unitPrincipalSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveUnitPrincipal : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.unitPrincipalId = selectedDatas[0].id;
					this.mainModel.vo.unitPrincipal.id = selectedDatas[0].id;
					this.mainModel.vo.unitPrincipal.name = selectedDatas[0].name;
					this.mainModel.vo.unitPrincipal.mobile = selectedDatas[0].mobile;
				}
			},
			doShowScenePrincipalSelectModal : function() {
				this.selectModel.scenePrincipalSelectModel.visible = true;
				//this.selectModel.scenePrincipalSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveScenePrincipal : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.scenePrincipalId = selectedDatas[0].id;
					this.mainModel.vo.scenePrincipal.id = selectedDatas[0].id;
					this.mainModel.vo.scenePrincipal.name = selectedDatas[0].name;
					this.mainModel.vo.scenePrincipal.mobile = selectedDatas[0].mobile;
				}
			},
			doShowCasualtyFormModal4Update : function(param) {
				this.formModel.casualtyFormModel.show = true;
				this.$refs.casualtyFormModal.init("update", {id: this.mainModel.vo.id, casualtyId: param.entry.data.id});
			},
			doShowCasualtyFormModal4Create : function(param) {
				this.formModel.casualtyFormModel.show = true;
				this.$refs.casualtyFormModal.init("create");
			},
			doSaveCasualty : function(data) {
				if (data) {
					var _this = this;
					api.saveCasualty({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.casualtyTable);
					});
				}
			},
			doUpdateCasualty : function(data) {
				if (data) {
					var _this = this;
					api.updateCasualty({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.casualtyTable);
					});
				}
			},
			doRemoveCasualties : function(item) {
				var _this = this;
				var data = item.entry.data;
				api.removeCasualties({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					_this.$refs.casualtyTable.doRefresh();
				});
			},
			doShowEconomicLossFormModal4Update : function(param) {
				this.formModel.economicLossFormModel.show = true;
				this.$refs.economiclossFormModal.init("update", {id: this.mainModel.vo.id, economicLossId: param.entry.data.id});
			},
			doShowEconomicLossFormModal4Create : function(param) {
				this.formModel.economicLossFormModel.show = true;
				this.$refs.economiclossFormModal.init("create");
			},
			doSaveEconomicLoss : function(data) {
				if (data) {
					var _this = this;
					api.saveEconomicLoss({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.economiclossTable);
					});
				}
			},
			doUpdateEconomicLoss : function(data) {
				if (data) {
					var _this = this;
					api.updateEconomicLoss({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.economiclossTable);
					});
				}
			},
			doRemoveEconomicLosses : function(item) {
				var _this = this;
				var data = item.entry.data;
				api.removeEconomicLosses({id : this.mainModel.vo.id}, [{id : data.id}]).then(function() {
					_this.$refs.economiclossTable.doRefresh();
				});
			},
			doGenerateReport: function() {
				window.isClickGenerateReportBtn = true;
				var _this = this;
				setTimeout(function(){
					var routerPart="/accidentManagement/businessCenter/investigation?method=create&accidentId="+_this.mainModel.vo.id;
					_this.$router.go(routerPart);
				}, 400);
			},
			afterInitData : function() {
				this.$refs.casualtyTable.doQuery({id : this.mainModel.vo.id});
				this.$refs.economiclossTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.casualtyTable.doClearData();
				this.$refs.economiclossTable.doClearData();
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