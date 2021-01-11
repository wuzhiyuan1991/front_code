define(function (require) {
	//基础js
	var LIB = require('lib');
	var api = require("./vuex/api");
	var tpl = LIB.renderHTML(require("text!./main.html"));
	var typeFormModal = require("./dialog/typeFormModal");
	var importProgress = require("componentsEx/importProgress/main");
	//编辑弹框页面fip (few-info-panel)
	var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"
	//编辑弹框页面bip (big-info-panel)
	//	var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
	//编辑弹框页面bip (big-info-panel) Legacy模式
	//  var detailPanel = require("./detail-tab-xl");//修改 detailPanelClass : "large-info-aside"

	//Legacy模式
	//	var regulationFormModal = require("componentsEx/formModal/regulationFormModal");
	//
	// LIB.registerDataDic("icm_regulation_file_level", [
	// 	["1", "机密"],
	// 	["2", "内部公开"],
	// 	["3", "外部公开"],
	// 	["4", "其他"]
	// ]);
	//
	// LIB.registerDataDic("icm_regulation_file_type", [
	// 	["1", "管理手册"],
	// 	["2", "管理程序"],
	// 	["3", "操作规程"],
	// 	["4", "作业指导书"],
	// 	["5", "其他"]
	// ]);
	//
	// LIB.registerDataDic("icm_regulation_is_revise", [
	// 	["0", "不是"],
	// 	["1", "是(页面只显示未修订的)"]
	// ]);
	//
	// LIB.registerDataDic("icm_regulation_limitation", [
	// 	["1", "现行"],
	// 	["2", "废止"],
	// 	["3", "即将实施"]
	// ]);
	//
	// LIB.registerDataDic("icm_regulation_manage_element", [
	// 	["1", "目标职责"],
	// 	["2", "制度化管理"],
	// 	["4", "现场管理"],
	// 	["5", "安全风险管控和隐患排查治理"],
	// 	["6", "应急管理"],
	// 	["7", "事故管理"],
	// 	["8", "持续改进"],
	// 	["9", "其他"]
	// ]);
	//
	// LIB.registerDataDic("icm_regulation_manage_scope", [
	// 	["1", "职业健康(H)"],
	// 	["2", "安全生产(S)"],
	// 	["3", "社会治安(S)"],
	// 	["4", "环境保护(E)"],
	// 	["5", "社会责任(SP)"],
	// 	["6", "其他"]
	// ]);


	var initDataModel = function () {
		return {
			moduleCode: "regulation",
			//控制全部分类组件显示
			mainModel: {
				showHeaderTools: false,
				//当前grid所选中的行
				selectedRow: [],
				detailPanelClass: "middle-info-aside"
				//				detailPanelClass : "large-info-aside"
			},
			tableModel: LIB.Opts.extendMainTableOpt(
				{
					url: "regulation/list{/curPage}{/pageSize}",
					selectedDatas: [],
					columns: [
						LIB.tableMgr.column.cb,
						{
							title: "",
							render: function () {
								return "<span  style='color:#33a6ff;cursor:pointer;position: relative;z-index: 9;'>查看</span>";
							},
							// fieldType:'link',
							width: 80
						},
						{
							//文件名称
							title: "文件名称",
							fieldName: "name",
							filterType: "text",
							fieldType:'link',
							// render: function (data) {
							// 	return "<span title=" + data.name + " style='display:inline-block;width:124px; color:#33a6ff;cursor:pointer;position: relative;z-index: 9;top:3px'>" + data.name + "</span>";
							// },
						},
						{
							//文件编号
							title: "文件编号",
							fieldName: "number",
							filterType: "text"
						},
						{
							//文件时效 1:现行,2:废止,3:即将实施
							title: "文件时效",
							fieldName: "limitation",
							orderName: "limitation",
							filterName: "criteria.intsValue.limitation",
							filterType: "enum",
							fieldType: "custom",
							popFilterEnum: LIB.getDataDicList("regulation_limitation"),
							render: function (data) {
								return LIB.getDataDic("regulation_limitation", data.limitation);
							}
						},
						{
							//文件类型 1:管理手册,2:管理程序,3:操作规程,4:作业指导书,5:其他
							title: "文件类型",
							fieldName: "fileType",
							orderName: "fileType",
							filterName: "criteria.intsValue.fileType",
							filterType: "enum",
							fieldType: "custom",
							popFilterEnum: LIB.getDataDicList("regulation_file_type"),
							render: function (data) {
								return LIB.getDataDic("regulation_file_type", data.fileType);
							}
						},
						{
							//发布日期
							title: "发布日期",
							fieldName: "publishDate",
							filterType: "date",
							//						fieldType: "custom",
							render: function (data) {
								return LIB.formatYMD(data.publishDate);
							}
						},
						{
							//实施日期
							title: "实施日期",
							fieldName: "effectiveDate",
							filterType: "date",
							//						fieldType: "custom",
							render: function (data) {
								return LIB.formatYMD(data.effectiveDate);
							}
						},
						{
							//文件级别 1:机密,2:内部公开,3:外部公开,4:其他
							title: "文件级别",
							fieldName: "fileLevel",
							orderName: "fileLevel",
							filterName: "criteria.intsValue.fileLevel",
							filterType: "enum",
							fieldType: "custom",
							popFilterEnum: LIB.getDataDicList("regulation_file_level"),
							render: function (data) {
								return LIB.getDataDic("regulation_file_level", data.fileLevel);
							}
						},

					]
				}
			),
			detailModel: {
				show: false
			},
			uploadModel: {
				url: "/regulation/importExcel",
				typeUrl:"/regulationtype/importExcel"
			},
			templete: {
				url: "/regulation/importExcelTpl/down",
				typeUrl:"/regulationtype/importExcelTpl/down"
			},
			exportModel: {
				url: "/regulation/exportExcel",
				withColumnCfgParam: true,
				typeUrl:"/regulationtype/exportExcel"
			},
			importProgress: {
				show: false
			},
			importTypeProgress:{
				show: false
			},
			typeForm: {
				visible: false
			},
			legalTypes: null,
			treeSelectData: [],
			typeId: null,
			//Legacy模式
			//			formModel : {
			//				regulationFormModel : {
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
			'typeFormModal': typeFormModal,
			"importprogress": importProgress,
			//Legacy模式
			//			"regulationFormModal":regulationFormModal,

		},
		methods: {
			doAdd: function () {
				if (!this.typeId) {
					LIB.Msg.error("请选择分类");
					return;
				}
				this.$broadcast('ev_dtReload', "create");
				this.detailModel.show = true;
			},
			doImport: function () {
				this.importProgress.show = true;
			},
			doTableCellClick: function (val) {
				if (val.cell.fieldName == 'name') {
					this.detailModel.show = true
					this.showDetail(val.entry.data);
				} else if (val.cell.colId == 1) {
					window.open("/html/main.html#!/viewLawsText?regulationId=" + val.entry.data.id + '&&discernId=' + val.entry.data.discernId)
				}
			},
			doUpdateType: function () {
				if (!this.typeId) {
					LIB.Msg.error("请选择分类");
					return;
				}
				var data = _.find(this.legalTypes, "id", _.get(this.treeSelectData, "[0].id"));

				if (!data) {
					return;
				}
				this.typeForm.visible = true;
				this.$broadcast("ev_le_regulation", "update", data);
			},
			doRevise: function() {
				if (this.beforeDoUpdate() === false) {
					return;
				}
				var rows = this.tableModel.selectedDatas;
				if (!_.isEmpty(rows)) {
					var that = this
					that.$broadcast('revise')
					this.showDetail(rows[0], { opType: "view" });




				}
			},
			doCreateType: function () {
				var parentId = _.get(this.treeSelectData, "[0].id");
				this.typeForm.visible = true;
				this.$broadcast("ev_le_regulation", "create", { id: parentId });
			},
			doDeleteType: function () {
				if (!this.typeId) {
					LIB.Msg.error("请选择分类");
					return;
				}
				var _this = this;
				var id = _.get(this.treeSelectData, "[0].id");

				LIB.Modal.confirm({
					title: '删除当前数据将会删除所有下级数据，是否确认?',
					onOk: function () {
						api.deleteLegalType(null, { id: id }).then(function () {
							LIB.Msg.success("删除成功");
							_this._getTreeList();
							_this.$refs.mainTable.doCleanRefresh();
						});
					}
				});
			},
			doImportType: function () {
				this.importTypeProgress.show = true;
			},
			doExportType: function () {
				var _this = this;
				window.open(_this.exportModel.typeUrl);
			},
			doTreeNodeClick: function () {
				var typeId = _.get(this.treeSelectData, "[0].id");
				this.typeData = this.treeSelectData[0];
				this.typeId = typeId;
				var params = [
					{
						type: "save",
						value: {
							columnFilterName: "criteria.strValue",
							columnFilterValue: { typeId: typeId }
						}
					}
				];
				this.$refs.mainTable.doCleanRefresh(params);
			},
			doSaveType: function () {
				this._getTreeList();
				this.typeForm.visible = false;
			},
			_getTreeList: function () {
				var that = this
				this.$api.getTreeList().then(function (res) {
					that.legalTypes = res.data

				})
			}

		},
		events: {
		},
		init: function () {
			this.$api = api;
		},
		ready: function () {
			this._getTreeList()
		}
	});

	return vm;
});
