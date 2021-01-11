define(function (require) {
	//基础js
	var LIB = require('lib');
	var api = require("./vuex/api");
	var tpl = LIB.renderHTML(require("text!./main.html"));
	//编辑弹框页面fip (few-info-panel)
	var detailPanel = require("./detail"); //修改 detailPanelClass : "middle-info-aside"
	//编辑弹框页面bip (big-info-panel)
	//	var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
	//编辑弹框页面bip (big-info-panel) Legacy模式
	//  var detailPanel = require("./detail-tab-xl");//修改 detailPanelClass : "large-info-aside"

	//Legacy模式
	//	var riskCardFormModal = require("componentsEx/formModal/riskCardFormModal");
	//  var importingComponent = require("./importing");

	var printModal = require("./preivew");
	var importingComponent = require("./importing");
	LIB.registerDataDic("ira_risk_card_state", [
		["0", "停用"],
		["1", "启用"]
	]);


	var initDataModel = function () {
		return {
			showImportingModal: false,
			visible: false,
			moduleCode: "riskCard",
			//控制全部分类组件显示
			mainModel: {
				showHeaderTools: false,
				//当前grid所选中的行
				selectedRow: [],
				detailPanelClass: "middle-info-aside"
				//				detailPanelClass : "large-info-aside"
			},
			props: {
				initFun:{
					type:Function,
				},
			},

			tableModel: LIB.Opts.extendMainTableOpt({
				url: "riskcard/list{/curPage}{/pageSize}",
				selectedDatas: [],
				isSingleCheck: false,
				allowMultiDelete:true,
				columns: [
					LIB.tableMgr.column.cb,
					LIB.tableMgr.column.code,
					LIB.tableMgr.column.disable,
					// LIB.tableMgr.column.dept,
					{
						//风险点
						title: "风险点",
						fieldName: "riskPoint",
						filterType: "text"
					},
					{
						//风险点
						title: "风险点位置",
						fieldName: "dominationArea.name",
						filterType: "text",
						filterName: "criteria.strValue.dominationAreaName",
					},
					{
						title: this.$t("gb.common.riskGrade"),
						fieldName: "riskLevel",
						orderName: "riskLevel",
						filterType: 'text',
						width: 120,
						fieldType: "custom",
						showTip: false,
						render: function (data) {
							var resultColor = _.propertyOf(JSON.parse(data.riskModel))("resultColor");
							if (resultColor) {
								return "<span style='background:\#" + resultColor + ";color:\#" + resultColor + ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + data.riskLevel;
							} else {
								return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + data.riskLevel;
							}
						},
					},
					{
						//危害因素
						title: "危害因素",
						fieldName: "scene",
						filterType: "text"
					},
					{
						//控制措施
						title: "管控措施",
						fieldName: "controlMeasures",
						filterType: "text"
					},
					{
						//责任人
						title: "责任人",
						// fieldName: "User.name",
						filterType: "text",
						render:function(data){
							if(data && data.users){
								return _.map(data.users,"username").join(",");
							}    
						},
						filterName: "criteria.strValue.userName",
					},
					{
						//联系电话
						title: "联系电话",
						fieldName: "telephone",
						filterType: "text"
					},
					{
						//责任岗位
						title: "责任岗位",
						fieldName: "positionName",
						filterType: "text",
						filterName: "criteria.strValue.positionName",
                        render:function(data){
							 
							if(data && data.positions){
								  
								return _.map(data.positions,"name").join(",");
							}




						}



					},
					{
						//事故类型
						title: "事故类型",
						fieldName: "accidentType",
						filterType: "text"
					},
					{
						//应急处置措施
						title: "应急处置措施",
						fieldName: "emergencyMeasures",
						filterType: "text"
					},
					LIB.tableMgr.column.company,
                  




					// {
					// 	//急救电话
					// 	title: "急救电话",
					// 	fieldName: "emergencyTelephone",
					// 	filterType: "text"
					// },
					// {
					// 	//火警电话
					// 	title: "火警电话",
					// 	fieldName: "fireTelephone",
					// 	filterType: "text"
					// },
				]
			}),
			detailModel: {
				show: false
			},
			uploadModel: {
				url: "/riskcard/importExcel"
			},
			exportModel: {
				url: "/riskcard/exportExcel",
				withColumnCfgParam: true
			},
			//Legacy模式
			//			formModel : {
			//				riskCardFormModel : {
			//					show : false,
			//				}
			//			}

		};
	}

	var vm = LIB.VueEx.extend({
		mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
		//Legacy模式
		//		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainLegacyPanel],
		template: tpl,
		data: initDataModel,
		components: {
			"detailPanel": detailPanel,
			"importingcomponent": importingComponent,
			"print-modal": printModal,
			//Legacy模式
			//			"riskcardFormModal":riskCardFormModal,

		},

      


		methods: {
			doAdd: function () {
				//debugger
				this.visible = true
			},
			doSave: function () {
				var _this = this
			     	_this.showImportingModal = true;
					_this.$broadcast("doUploadStart");
				api.saveRiskAssessments().then(function (res) {
					if (res.status == 200) {
                            
						_this.showImportingModal = false;

					//	LIB.Msg.info("同步成功")
						_this.visible = false
						_this.refreshMainTable();

					} else {
						LIB.Msg.info("更新错误联系管理人员")
					}
				})
			},

			detaMes:function(data,arry){
				this.$refs.printModal.init(data,arry)
			},

			//删除table的数据
			doDeleteBatch: function() {
				//当beforeDoDelete方法明确返回false时,不继续执行doDelete方法, 返回undefine和true都会执行后续方法
				if (this.beforeDoDelete() == false) {
					return;
				}
				var allowMulti = !!this.tableModel.allowMultiDelete;
				var _this = this;
				var arr = [];
				_.each(_this.tableModel.selectedDatas, function (item) {
					arr.push({id:item.id, orgId:LIB.user.orgId});
				});

				if (!allowMulti && this.tableModel.selectedDatas.length > 1) {
					LIB.Msg.warning("一次只能删除一条数据");
					return;
				}
				//var _vo = this.tableModel.selectedDatas[0];
				LIB.Modal.confirm({
					title: '确定删除数据?',
					onOk: function() {
						api.deleteBatch(null, arr).then(function() {
							LIB.Msg.info("删除成功");
							_this.$refs.mainTable.doClearData();
							_this.$refs.mainTable.doQuery();
						});
					}
				});
			},

		},
		events: {},
		init: function () {
			this.$api = api;
		},
        ready:function () {
            if(this.$route.query.method === 'check') {
                if(this.$route.query.riskPoint) {
                    var riskPointColumn = this.tableModel.columns.filter(function (item) {
                        return item.fieldName === "riskPoint";
                    });
                    if(riskPointColumn.length === 1) {
                        this.$refs.mainTable.doOkActionInFilterPoptip(null, riskPointColumn[0], this.$route.query.riskPoint);
                    }
                }
				if(this.$route.query.positionName) {
					var positionNameColumn = this.tableModel.columns.filter(function (item) {
						return item.fieldName === "positionName";
					});
					if(positionNameColumn.length === 1) {
						this.$refs.mainTable.doOkActionInFilterPoptip(null, positionNameColumn[0], this.$route.query.positionName);
					}
				}
                //this.clearGoToInfoData();
            }
        }
	});

	return vm;
});