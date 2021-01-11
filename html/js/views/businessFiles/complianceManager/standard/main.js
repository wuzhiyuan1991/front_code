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
//	var standardFormModal = require("componentsEx/formModal/standardFormModal");

	// LIB.registerDataDic("icm_standard_is_revise", [
	// 	["0","不是"],
	// 	["1","是(页面只显示未修订的)"]
	// ]);
	//
	// LIB.registerDataDic("icm_standard_limitation", [
	// 	["1","现行"],
	// 	["2","废止"],
	// 	["3","即将实施"]
	// ]);
	// LIB.registerDataDic("icm_standard_effective_level", [
	// 	["1","强制性国际标准"],
	// 	["2","推荐性国际标准"],
	// 	["3","强制性国家标准"],
	// 	["4","推荐性国家标准"],
	// 	["5","强制性行业标准"],
	// 	["6","推荐性行业标准"],
	// 	["7","强制性地方标准"],
	// 	["8","推荐性地方标准"],
	// 	["9","其他国外标准"],
	// 	["10","其他国内标准"],
	// ]);

    
    var initDataModel = function () {
        return {
			typeForm: {
				visible: false
			},
            moduleCode: "standard",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass : "middle-info-aside"
//				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
	            {
	                url: "standard/list{/curPage}{/pageSize}",
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
						title: "中文标准名称",
						fieldName: "chName",
						filterType: "text",
						fieldType:'link',
						// render: function (data) {
						// 	return "<span title="+data.chName+" style='display:inline-block;width:124px; color:#33a6ff;cursor:pointer;position: relative;z-index: 9;top:3px'>"+data.chName+"</span>";
						// },

					},
					{
						//英文标准名称
						title: "英文标准名称",
						fieldName: "enName",
						filterType: "text"
					},
					{
						//标准号
						title: "标准号",
						fieldName: "number",
						filterType: "text"
					},
					{
						//废止信息
						title: "时效性",
						fieldName: "limitation",
						filterType: "text",
						render:function(data){
							return LIB.getDataDic('standard_limitation', data.limitation)
						}
					},
					{
						//废止日期
						title: "发布日期",
						fieldName: "publishDate",
						filterType: "date",
//						fieldType: "custom",
						render: function (data) {
							return LIB.formatYMD(data.publishDate);
						}
					},
					{
						//废止日期
						title: "实施日期",
						fieldName: "effectiveDate",
						filterType: "date",
//						fieldType: "custom",
						render: function (data) {
							return LIB.formatYMD(data.effectiveDate);
						}
					},
					
					{
						//中国标准分类号
						title: "中国标准分类号",
						fieldName: "cssCode",
						filterType: "text"
					},
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
				url: "/standard/importExcel",
				typeUrl:"/standardtype/importExcel"
			},
			templete: {
				url: "/standard/importExcelTpl/down",
				typeUrl:"/standardtype/importExcelTpl/down"
			},
			importProgress: {
				show: false
			},
			importTypeProgress:{
				show: false
			},
            exportModel : {
                url: "/standard/exportExcel",
                withColumnCfgParam: true,
				typeUrl:"/standardtype/exportExcel"
			},
			legalTypes: null,
			treeSelectData: [],
			typeId: null,
			//Legacy模式
//			formModel : {
//				standardFormModel : {
//					show : false,
//				}
//			}

        };
    }

    var vm = LIB.VueEx.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
		//Legacy模式
//		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainLegacyPanel],
    	template: tpl,
        data: initDataModel,
        components: {
			"detailPanel": detailPanel,
			'typeFormModal': typeFormModal,
			"importprogress": importProgress,
		
			//Legacy模式
//			"standardFormModal":standardFormModal,
            
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
			doTableCellClick:function(val){
				if (val.cell.fieldName=='chName') {
					this.detailModel.show=true
					this.showDetail(val.entry.data);
				}else if(val.cell.colId==1){
					window.open("/html/main.html#!/viewLawsText?standardId=" +val.entry.data.id+'&&discernId='+val.entry.data.discernId)
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
			doImportType:function(){
				this.importTypeProgress.show = true;
			},
			doExportType:function(){
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
        init: function(){
        	this.$api = api;
		},
		ready: function () {
			this._getTreeList()
		}
    });

    return vm;
});
