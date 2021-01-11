define(function (require) {
	//基础js
	var LIB = require('lib');
	var api = require("./vuex/api");
	var tpl = LIB.renderHTML(require("text!./main.html"));
	var typeFormModal = require("./dialog/typeFormModal");
	//编辑弹框页面fip (few-info-panel)
	var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"
	//编辑弹框页面bip (big-info-panel)
	//	var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
	//编辑弹框页面bip (big-info-panel) Legacy模式
	//  var detailPanel = require("./detail-tab-xl");//修改 detailPanelClass : "large-info-aside"

	//Legacy模式
	//	var icmRiskAssessmentFormModal = require("componentsEx/formModal/icmRiskAssessmentFormModal");

	var importProgress = require("componentsEx/importProgress/main");
	var initDataModel = function () {
		return {
			moduleCode: "icmRiskAssessment",
			//控制全部分类组件显示
			mainModel: {
				showHeaderTools: false,
				//当前grid所选中的行
				selectedRow: [],
				detailPanelClass: "middle-info-aside"
				//				detailPanelClass : "large-info-aside"
			},
			riskPoint: null,
			hazardFactorType: null,
			scene: null,
			riskLevelScene: null,
			tableModel:
			{
				selectedDatas: [],
				values: [],
				columns: [
					//  LIB.tableMgr.column.cb,
					//  LIB.tableMgr.column.code,
					//  LIB.tableMgr.column.disable,
					{
						title: "风险点分类",
						fieldName: "riskPointType",
						orderName: "riskPointType",
						renderClass: 'riskPointType textarea',
						render: function (data) {
							return '<div style="color:red;font-size=16px" title=' + data.riskPointType + '>' + data.riskPointType + '</div>'
						},
						width: 80
					},
					{
						//风险点
						title: "风险点",
						fieldName: "riskPoint",
						renderClass: 'riskPoint textarea',
						render: function (data) {
							return '<div style="color:red;font-size=18px" title=' + data.riskPoint + '>' + data.riskPoint + '</div>'
						},
						width: 100
					},
					{
						//危害因素分类
						title: "危害因素分类",
						fieldName: "hazardFactorType",
						width: 180
					},
					{
						//风险场景
						title: "风险场景",
						fieldName: "scene",
						renderClass: 'textarea',
						width: 350
					},
					{
						title: "风险等级",
						width: 400,
						"children": [
							{
								//后果严重性
								title: "事故后果严重性",
								fieldName: "severity",
								renderClass: 'severity',
								width: 100

							},
							{
								//发生可能性
								title: "事故发生可能性",
								fieldName: "possibility",
								renderClass: 'possibility',
								width: 100

							},
							{
								//风险得分
								title: "风险得分",
								fieldName: "score",
								width: 100
							},
							{
								//风险等级(场景)
								title: "风险等级(场景)",
								fieldName: "riskLevelScene",
								renderClass: "riskLevelScene",
								width: 100
							},

							// {
							// 	//风险等级(场景)
							// 	title: "风险等级(风险点)",
							// 	fieldName: "riskLevelPoint",


							// },
						]
					},

					{
						title: "管控标准（检查项）",
						"children": [{
							//检查项内容
							title: "检查项内容",
							fieldName: "checkItemName",
							width: 400,
							renderClass: 'textarea'
						},
						{
							//类型
							title: "类型",
							fieldName: "type",
							width: 70
						},]
					},


					{
						//管控等级
						title: "管控等级",
						fieldName: "controlLevel",
						renderClass: "controlLevel",

						width: 100

					},
					{
						//控制措施
						title: "应急措施方案",
						fieldName: "controlMeasures",

						width: 300
					},



					// {
					// 	title: "风险分类",
					// 	fieldName: "icmRiskType.name",
					// 	orderName: "icmRiskType.name",
					// 	filterType: "text",
					// },
					//					{
					//						//风险点分类
					//						title: "风险点分类",
					//						fieldName: "riskPointType",
					//						filterType: "text"
					//					},




					//					 LIB.tableMgr.column.modifyDate,
					////					 LIB.tableMgr.column.createDate,
					//
				]
			}
			,
			detailModel: {
				show: false
			},
			typeForm: {
				visible: false
			},
			uploadModel: {
				url: "/icmriskassessment/importExcel"
			},
			exportModel: {
				url: "/icmriskassessment/exportExcel",
				withColumnCfgParam: true
			},
			templete: {
				url: "/icmriskassessment/importExcelTpl/down"
			},
			importProgress: {
				show: false
			},
			treeSelectData: [],
			typeId: null,
			legalTypes: null,
			pointlist: [],
			checkedPointIndex: null,
			oldValues: []
			//Legacy模式
			//			formModel : {
			//				icmRiskAssessmentFormModel : {
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
			//			"icmriskassessmentFormModal":icmRiskAssessmentFormModal,

		},
		methods: {
			initData: function () {
				//解决keepalive强制刷新
				return
			},
			doImport: function () {
				this.importProgress.show = true;
			},
			doPointSelect: function (item, index) {
				var that = this
				this.riskPoint = _.trim(this.riskPoint)
				this.hazardFactorType = _.trim(this.hazardFactorType)
				this.scene = _.trim(this.scene)
				this.riskLevelScene = _.trim(this.riskLevelScene)
				if (this.checkedPointIndex == index) {
					this.checkedPointIndex = null
					this.tableModel.values = this.oldValues
				} else {
					this.checkedPointIndex = index
					$('tbody td').show()
					$('.table-scroll-main-body').scrollTop(0)
					this.tableModel.values = _.filter(this.oldValues, function (value) {
						return item.riskPoint == value.riskPoint
					})


					

				}
				that.$nextTick(function () {
					var rows = that.rowSpanRiskPointType()
					that.rowSpanRiskPoint(rows)
					// that.rowSpanRiskLevelPoint(rows)
					that.rowSpanControlLevel(rows)
					$('tbody .riskLevelScene').each(function (index, item) {
						$(item).parent().css('background', '#FFF');
						$(item).css('color', '#666')
						if ($(item).text().indexOf('低') > 0) {
							$(item).parent().css('background', 'rgb(122, 255, 15)');
						} else if ($(item).text().indexOf('中') > 0) {
							$(item).parent().css('background', 'rgb(255, 226, 148)')
						} else if ($(item).text().indexOf('高') > 0 || $(item).text().indexOf('重大') > 0) {
							$(item).parent().css('background', 'red')
							$(item).css('color', '#fff')
						}
					})
				})
			},
			doSearch: function () {
				this.riskPoint = _.trim(this.riskPoint)
				this.hazardFactorType = _.trim(this.hazardFactorType)
				this.scene = _.trim(this.scene)
				this.riskLevelScene = _.trim(this.riskLevelScene)
				// if (this.riskPoint == '' &&
				// 	this.hazardFactorType == '' &&
				// 	this.scene == '' &&
				// 	this.riskLevelScene == '') {
				// 	LIB.Msg.error("请输入过滤条件");
				// } else {
				// 
				var params = null


				var params = null
				if (this.typeId) {
					params = {
						'icmRiskType.id': this.typeId,
						'criteria.strValue': { riskPoint: this.riskPoint },
						'hazardFactorType': this.hazardFactorType,
						'scene': this.scene,
						'riskLevelScene': this.riskLevelScene
					}
				} else {
					params = {
						'criteria.strValue': { riskPoint: this.riskPoint },
						'hazardFactorType': this.hazardFactorType,
						'scene': this.scene,
						'riskLevelScene': this.riskLevelScene
					}

				}


				this._getRiskPointList(params)
				this._getTableData(params)
				this.checkedPointIndex = null
				// }

			},
			doClean: function () {
				this.riskPoint = null
				this.hazardFactorType = null
				this.scene = null
				this.riskLevelScene = null
				var params = null
				if (this.typeId) {
					params = {
						'icmRiskType.id': this.typeId,
					}
				}
				this._getRiskPointList(params)
				this._getTableData(params)
				this.checkedPointIndex = null
			},
			doTreeNodeClick: function () {
				this.riskPoint = _.trim(this.riskPoint)
				this.hazardFactorType = _.trim(this.hazardFactorType)
				this.scene = _.trim(this.scene)
				this.riskLevelScene = _.trim(this.riskLevelScene)
				var typeId = _.get(this.treeSelectData, "[0].id");
				this.typeData = this.treeSelectData[0];
				this.typeId = typeId;
				var params = {
					'icmRiskType.id': typeId, 'criteria.strValue': { riskPoint: this.riskPoint },
					'hazardFactorType': this.hazardFactorType,
					'scene': this.scene,
					'riskLevelScene': this.riskLevelScene
				}
				// this.checkedPointIndex

				this._getRiskPointList(params)
				this._getTableData(params)
				this.checkedPointIndex = null
				// this.$refs.mainTable.doCleanRefresh(params);
			},
			doSaveType: function () {
				this._getTreeList();
				this.doClean()
				this.treeSelectData = []
				// this._getRiskPointList()
				this.typeForm.visible = false;
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
						api.deleteRiskType(null, { id: id }).then(function () {
							LIB.Msg.success("删除成功");
							_this.typeId = null
							_this._getTreeList();
							_this.doClean()
							_this.treeSelectData = []
							// _this._getRiskPointList()
							// _this.$refs.mainTable.doCleanRefresh();
						});
					}
				});
			},
			_getTreeList: function () {
				var that = this
				this.$api.getTreeList().then(function (res) {
					that.legalTypes = res.data

				})
			},
			_getRiskPointList: function (val) {
				var that = this
				if (!val) {
					val = {}
				}
				this.$api.getRiskPointList(val).then(function (res) {
					that.pointlist = res.data
					$('.leftPointUl').scrollTop(0)
				})
			},
			rowSpanRiskPointType: function () {
				var row = 1
				var rowName = ''
				var rowItem = null
				var same = []
				var rows = []
				$('tbody .riskPointType').each(function (index, item) {

					if (rowName == $(item).text()) {
						row++
						same.push($(item))
					} else {

						_.each(same, function ($item) {
							$item.parent().hide()
						})
						if (rowItem) {
							rowItem.parent().attr('rowspan', row)
							rows.push(index)
						}

						rowName = $(item).text()
						rowItem = $(item)
						row = 1
						same = []
					}

					if (index + 1 == $('tbody .riskPointType').length) {
						_.each(same, function ($item) {
							$item.parent().hide()
						})
						if (rowItem) {
							rowItem.parent().attr('rowspan', row)
						}
						rows.push(index)

						return false
					}



				})

				return rows
			},
			rowSpanRiskPoint: function (rows) {
				var row = 1//初始索引
				var rowName = ''//名字
				var rowItem = null
				var same = []
				var rowlength = rows[0]//依赖风险点的rowspan 
				var rowIndex = 0
				$('tbody .riskPoint').each(function (index, item) {

					if (rowName == $(item).text() && (index < rowlength || index + 1 == $('tbody .riskPoint').length)) {
						row++
						same.push($(item))
					} else {
						_.each(same, function ($item) {
							$item.parent().hide()
						})
						if (rowItem) {
							rowItem.parent().attr('rowspan', row)

						}
						if (index >= rowlength) {
							rowIndex++
							rowlength = rows[rowIndex]
						}
						rowName = $(item).text()
						rowItem = $(item)
						row = 1
						same = []
					}

					if (index + 1 == $('tbody .riskPoint').length) {
						_.each(same, function ($item) {
							$item.parent().hide()
						})
						if (rowItem) {
							rowItem.parent().attr('rowspan', row)
						}
						return false
					}



				})
			},
			// rowSpanRiskLevelPoint: function (rows) {
			// 	var row = 1//初始索引
			// 	var rowName = ''//名字
			// 	var rowItem = null
			// 	var same = []
			// 	var rowlength = rows[0]//依赖风险点的rowspan 
			// 	var rowIndex = 0
			// 	$('tbody .riskLevelPoint').each(function (index, item) {

			// 		if (rowName == $(item).text() && (index < rowlength || index + 1 == $('tbody .riskLevelPoint').length)) {
			// 			row++
			// 			same.push($(item))
			// 		} else {
			// 			_.each(same, function ($item) {
			// 				$item.parent().hide()
			// 			})
			// 			if (rowItem) {
			// 				rowItem.parent().attr('rowspan', row)
			// 				if ($(item).text().indexOf('低') > 0) {
			// 					rowItem.parent().css('background', 'rgb(122, 255, 15)');
			// 				} else if ($(item).text().indexOf('中') > 0) {
			// 					rowItem.parent().css('background', 'rgb(255, 226, 148)')
			// 				} else if ($(item).text().indexOf('高') > 0 || $(item).text().indexOf('重大') > 0) {
			// 					rowItem.parent().css('background', 'red')
			// 					rowItem.css('color', '#fff')
			// 				}

			// 			}
			// 			if (index >= rowlength) {
			// 				rowIndex++
			// 				rowlength = rows[rowIndex]
			// 			}
			// 			rowName = $(item).text()
			// 			rowItem = $(item)
			// 			row = 1
			// 			same = []
			// 		}

			// 		if (index + 1 == $('tbody .riskLevelPoint').length) {
			// 			_.each(same, function ($item) {
			// 				$item.parent().hide()
			// 			})
			// 			if (rowItem) {
			// 				rowItem.parent().attr('rowspan', row)
			// 				if ($(item).text().indexOf('低') > 0) {
			// 					rowItem.parent().css('background', 'rgb(122, 255, 15)');
			// 				} else if ($(item).text().indexOf('中') > 0) {
			// 					rowItem.parent().css('background', 'rgb(255, 226, 148)')
			// 				} else if ($(item).text().indexOf('高') > 0 || $(item).text().indexOf('重大') > 0) {
			// 					rowItem.parent().css('background', 'red')
			// 					rowItem.css('color', '#fff')
			// 				}
			// 			}
			// 			return false
			// 		}



			// 	})
			// },
			rowSpanControlLevel: function (rows) {
				var row = 1//初始索引
				var rowName = ''//名字
				var rowItem = null
				var same = []
				var rowlength = rows[0]//依赖风险点的rowspan 
				var rowIndex = 0
				$('tbody .controlLevel').each(function (index, item) {

					if (rowName == $(item).text() && (index < rowlength || index + 1 == $('tbody .controlLevel').length)) {
						row++
						same.push($(item))
					} else {
						_.each(same, function ($item) {
							$item.parent().hide()
						})
						if (rowItem) {
							rowItem.parent().attr('rowspan', row)
							// rowItem.parent().css('background', '#92D050');


						}
						if (index >= rowlength) {
							rowIndex++
							rowlength = rows[rowIndex]
						}
						rowName = $(item).text()
						rowItem = $(item)
						row = 1
						same = []
					}

					if (index + 1 == $('tbody .controlLevel').length) {
						_.each(same, function ($item) {
							$item.parent().hide()
						})
						if (rowItem) {
							rowItem.parent().attr('rowspan', row)

						}
						return false
					}



				})
			},
			doDelete: function () {

				var params = []
				_.each(this.tableModel.values, function (item) {
					params.push({ id: item.id })
				})
				var _this = this
				LIB.Modal.confirm({
					title: '删除当前数据将会删除呈现的清单，是否确认?',
					onOk: function () {
						api.deleteIcmRiskassessment(null, params).then(function () {

							_this.doClean()
							_this.treeSelectData = []
							_this._getRiskPointList()
							_this.$nextTick(function () {
								LIB.Msg.success("删除成功,数据切换为全部显示");
							})

						});
					}
				});
			},
			_getTableData: function (val) {
				var that = this
				// criteria.strValue{riskPointType:val.riskPointType,"icmRiskType.id":val.icmRiskType}
				if (!val) {
					val = {}
				}
				this.$refs.mainTable.showSpin=true
				// LIB.globalLoader.show()
				this.$api.getTableData(val).then(function (res) {
					if (res.data.length > 0) {
						$('.table-scroll-main-header').css('overflow-x', 'visible')
					} else {
						$('.table-scroll-main-header').css('overflow-x', 'auto')
					}
					$('tbody td').show()

					$('.table-scroll-main-body').scrollTop(0)
					that.tableModel.values = res.data
					that.oldValues = res.data
					that.$nextTick(function () {
						var rows = that.rowSpanRiskPointType()
						that.rowSpanRiskPoint(rows)
						// that.rowSpanRiskLevelPoint(rows)
						that.rowSpanControlLevel(rows)
						$('tbody .riskLevelScene').each(function (index, item) {
							if ($(item).text().indexOf('低') > 0 || $(item).text().indexOf('一般') > 0) {
								$(item).parent().css('background', 'rgb(122, 255, 15)');
							} else if ($(item).text().indexOf('中') > 0 || $(item).text().indexOf('较大') > 0) {
								$(item).parent().css('background', 'rgb(255, 226, 148)')
							} else if ($(item).text().indexOf('高') > 0 || $(item).text().indexOf('重大') > 0) {
								$(item).parent().css('background', 'red')
								$(item).css('color', '#fff')
							}
						})
						// LIB.globalLoader.hide()
						this.$refs.mainTable.showSpin=false
					})
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
			this._getRiskPointList()
			this._getTableData()
			this.$nextTick(function () {
				$('.table-head-cell-box').children().css('text-align', 'center')
			})
		}
	});

	return vm;
});
