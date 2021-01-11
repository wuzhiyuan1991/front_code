define(function (require) {
	//基础js
	var LIB = require('lib');
	var api = require("./vuex/api");
	var tpl = LIB.renderHTML(require("text!./main.html"));
	var typeFormModal = require("./dialog/typeFormModal");
	
	//编辑弹框页面fip (few-info-panel)
	var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"

	var importProgress = require("componentsEx/importProgress/main");

	//编辑弹框页面bip (big-info-panel)
	//	var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
	//编辑弹框页面bip (big-info-panel) Legacy模式
	//  var detailPanel = require("./detail-tab-xl");//修改 detailPanelClass : "large-info-aside"

	//Legacy模式
		// var lawsFormModal = require("componentsEx/formModal/lawsFormModal");

	// LIB.registerDataDic("icm_effective_level", [
	// 	["1", "国际公约"],
	// 	["2", "宪法"],
	// 	["3", "法律"],
	// 	["4", "行政法规"],
	// 	["5", "国务院部门规章"],
	// 	["6", "地方性法规"],
	// 	["7", "地方性部门规章"],
	// 	["8", "行业规定"],
	// 	["9", "团体规定"],
	// 	["10", "司法解释"]
	// ]);

	LIB.registerDataDic("icm_laws_is_revise", [
		["0", "不是"],
		["1", "是"]
	]);

	// LIB.registerDataDic("icm_limitation", [
	// 	["1", "现行有效"],
	// 	["2", "已经修改"],
	// 	["3", "等待实行"],
	// 	["4", "废止"]
	// ]);


	var initDataModel = function () {
		return {
			typeForm: {
				visible: false
			},
			lawId:'',
			discernId:'',
			typeData:null,
			typeId: null,
			legalTypes: null,
			treeSelectData: [],
			moduleCode: "laws",
			//控制全部分类组件显示
			mainModel: {
				showHeaderTools: false,
				//当前grid所选中的行
				selectedRow: [],
				detailPanelClass: "middle-info-aside"
								// detailPanelClass : "large-info-aside"
			},
			tableModel: LIB.Opts.extendMainTableOpt(
				{
					url: "laws/list{/curPage}{/pageSize}",
					selectedDatas: [],
					columns: [
						LIB.tableMgr.column.cb,
						{
							title: "",
							render: function () {
								return "<span  style='color:#33a6ff;cursor:pointer;position: relative;z-index: 9;'>查看</span>";
							},
							// fieldType:'link',
							width:80
						},
						{
							//法规名称
							title: "法规名称",
							fieldType:'link',
							fieldName: "name",
							filterType: "text",
							// render: function (data) {
							// 	return "<span title="+data.name+" style='display:inline-block;width:124px; color:#33a6ff;cursor:pointer;position: relative;z-index: 9;top:3px'>"+data.name+"</span>";
							// },

						},
						{
							//发文字号
							title: "发文字号",
							fieldName: "issuedNumber",
							filterType: "text"
						},
						{
							//时效性 1:现行有效,2:已经修改,3:等待实行,4:废止
							title: "时效性",
							fieldName: "limitation",
							orderName: "limitation",
							filterName: "criteria.intsValue.limitation",
							filterType: "enum",
							fieldType: "custom",
							popFilterEnum: LIB.getDataDicList("icm_limitation"),
							render: function (data) {
								return LIB.getDataDic("icm_limitation", data.limitation);
							}
						},
						{
							//实施日期
							title: "分类",
							fieldName: "lawsType.name",
							filterType: "text"
							
						},
						
						// {
						// 	//效力级别 1:国际公约,2:宪法,3:法律,4:行政法规,5:国务院部门规章,6:地方性法规,7:地方性部门规章,8:行业规定,9:团体规定,10:司法解释
						// 	title: "分类",
						// 	fieldName: "effectiveLevel",
						// 	orderName: "effectiveLevel",
						// 	filterName: "criteria.intsValue.effectiveLevel",
						// 	filterType: "enum",
						// 	fieldType: "custom",
						// 	popFilterEnum: LIB.getDataDicList("icm_effective_level"),
						// 	render: function (data) {
						// 		return LIB.getDataDic("icm_effective_level", data.effectiveLevel);
						// 	}
						// },
						{
							//实施日期
							title: "发布日期",
							fieldName: "publishDate",
							filterType: "date",
							render: function (data) {
								return LIB.formatYMD(data.effectiveDate);
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

						// {
						// 	//是否是已修订 0:不是,1:是(页面只显示未修订的)
						// 	title: "是否是已修订",
						// 	fieldName: "isRevise",
						// 	orderName: "isRevise",
						// 	filterName: "criteria.intsValue.isRevise",
						// 	filterType: "enum",
						// 	fieldType: "custom",
						// 	popFilterEnum: LIB.getDataDicList("icm_laws_is_revise"),
						// 	render: function (data) {
						// 		return LIB.getDataDic("icm_laws_is_revise", data.isRevise);
						// 	}
						// },


						{
							//发布机关
							title: "发布机关",
							fieldName: "publishAuthority",
							filterType: "text"
						},
						//					{
						//						//发布日期
						//						title: "发布日期",
						//						fieldName: "publishDate",
						//						filterType: "date"
						////						fieldType: "custom",
						////						render: function (data) {
						////							return LIB.formatYMD(data.publishDate);
						////						}
						//					},
						//					 LIB.tableMgr.column.remark,
						////					{
						//						//法规简述
						//						title: "法规简述",
						//						fieldName: "resume",
						//						filterType: "text"
						//					},
						//					{
						//						//修订信息
						//						title: "修订信息",
						//						fieldName: "revise",
						//						filterType: "text"
						//					},
						//					 LIB.tableMgr.column.modifyDate,
						////					 LIB.tableMgr.column.createDate,
						//
					]
				}
			),
			
			detailModel: {
				show: false
			},
			uploadModel: {
				url: "/laws/importExcel",
				typeUrl:"/lawstype/importExcel"
			},
			templete: {
				url: "/laws/importExcelTpl/down",
				typeUrl:"/lawstype/importExcelTpl/down"
			},
			exportModel: {
				url: "/laws/exportExcel",
				withColumnCfgParam: true,
				typeUrl:"/lawstype/exportExcel"
			},
			importProgress: {
				show: false
			},
			importTypeProgress:{
				show: false
			}
			//Legacy模式
			//			formModel : {
			//				lawsFormModel : {
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
			//			"lawsFormModal":lawsFormModal,

		},
		methods: {
			doAdd: function() {
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
			doImportType:function(){
				this.importTypeProgress.show = true;
			},
			doExportType:function(){
				var _this = this;
				window.open(_this.exportModel.typeUrl);
			},
			doTableCellClick:function(val){
				if (val.cell.fieldName=='name') {
					this.detailModel.show=true
					this.showDetail(val.entry.data);
				}else if(val.cell.colId==1){
					window.open("/html/main.html#!/viewLawsText?lawsId=" +val.entry.data.id+'&&discernId='+val.entry.data.discernId)
				}
			},
			doSaveType: function () {
				this._getTreeList();
				this.typeForm.visible = false;
			},
			doRevise: function(){
				if (this.beforeDoUpdate() === false) {
                    return;
                }
                var rows = this.tableModel.selectedDatas;
                if (!_.isEmpty(rows)) {
					var that =this
					that.$broadcast('revise')
					this.showDetail(rows[0], { opType: "view" });
				
						
					
					
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
						api.deleteLegalType(null, {id: id}).then(function () {
						    LIB.Msg.success("删除成功");
						    _this._getTreeList();
						    _this.$refs.mainTable.doCleanRefresh();
						});
					}
				});
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
			_getTreeList: function () {
				var that = this
				this.$api.getTreeList().then(function (res) {
					that.legalTypes = res.data

				})
			}
			//Legacy模式
			//			doAdd : function(data) {
			//				this.formModel.lawsFormModel.show = true;
			//				this.$refs.lawsFormModal.init("create");
			//			},
			//			doSaveLaws : function(data) {
			//				this.doSave(data);
			//			}

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
