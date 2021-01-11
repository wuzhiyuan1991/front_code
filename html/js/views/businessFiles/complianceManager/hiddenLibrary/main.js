define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"
    var importProgress = require("componentsEx/importProgress/main");
    //编辑弹框页面bip (big-info-panel)
    //	var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
    //编辑弹框页面bip (big-info-panel) Legacy模式
    //  var detailPanel = require("./detail-tab-xl");//修改 detailPanelClass : "large-info-aside"

    //Legacy模式
    //	var hiddenLibraryFormModal = require("componentsEx/formModal/hiddenLibraryFormModal");


    var initDataModel = function () {
        if (LIB.setting.useCheckInsteadOfCodeAsLink) {
            LIB.tableMgr.column.code={
                title:"  ",
                width:'80px',
                fieldType:"custom",
                fieldName:'code',
                fixed:true,
                render:function () {
                    return '<div style="color: #33a6ff;cursor: pointer;">查 看</div>'
                }
            }
        }
        
        return {
            moduleCode: "hiddenLibrary",
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
                    url: "hiddenlibrary/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            //隐患描述
                            title: "",
                            filterType: "text",
                            width: 60,
                            // renderClass: 'hidden',//用于表格高度不统一 ,调换cb code位置,然后隐藏
                            visible: false
                        },
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            //隐患描述
                            title: "隐患描述",
                            fieldName: "problem",
                            filterType: "text",
                            width: 300
                        },
                        {
                            title: "隐患图片",
                            render: function (data) {
                                if (data && data.cloudFiles.length > 0) {
                                    var img = LIB.convertFilePath(LIB.convertFileData(data.cloudFiles[0]))
                                    return '<img style="width:100px;height:100px;object-fit:contain;cursor:pointer;margin:0px  0 0px 7px" src=' + img + ' />'
                                }
                                return '<div style="height:99px;margin:5px 15px 5px 0;line-height:100px;text-align:center">暂无图片</div>'

                            },
                            width: 150
                        },
                        {
                            //检查人依据
                            title: "检查依据",
                            fieldName: "checkBasic",
                            filterType: "text",
                            width: 300
                        },
                        {
                            //依据条款
                            title: "依据条款",
                            fieldName: "reason",
                            filterType: "text",
                            width: 300
                        },
                        {
                            title: "处罚条款",
                            fieldName: "punishment",
                            filterType: "text",
                        }
                    ]
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/hiddenlibrary/importExcel"
            },
            exportModel: {
                url: "/hiddenlibrary/exportExcel",
                withColumnCfgParam: true
            },
            templete: {
                url: "/hiddenlibrary/importExcelTpl/down"
            },
            importProgress: {
                show: false
            },
            images: [],
            isCheckKind:false
            //Legacy模式
            //			formModel : {
            //				hiddenLibraryFormModel : {
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
            "importprogress": importProgress,
            //Legacy模式
            //			"hiddenlibraryFormModal":hiddenLibraryFormModal,

        },
        methods: {
            doImport: function () {
                this.importProgress.show = true;
            },
            doTableCellClick: function (data) {
                if (data.cell.colId == 3 && data.entry.data.cloudFiles.length > 0) {
                    $('.viewer-close').off('click')
                    this.images = _.map(data.entry.data.cloudFiles, function (content) {
                        return LIB.convertFileData(content);
                    });
                    var _this = this;
                    setTimeout(function () {
                        _this.$refs.imageViewer.view(0);
                        $('.viewer-close').on('click',function () {
                           
                            _this.images = []
                        })
                    }, 100);
                } else if (data.cell.colId == 1) {
                    this.showDetail(data.entry.data)
                }

            },
            checkSelect:function (val) {
                this.tableModel.isSingleCheck = !this.isCheckKind;
                if(!this.isCheckKind){
                    this.tableModel.selectedDatas = [];
                    this.$refs.mainTable.isSingleCheck = this.tableModel.isSingleCheck;
                    this.$refs.mainTable.checkAll = false;
                    this.$refs.mainTable.setAllCheckBoxValues(false);
                    // this.$refs.mainTable.doClearData();
                    // this.$refs.mainTable.doQuery();
                    return ;
                }
                this.$refs.mainTable.isSingleCheck = this.tableModel.isSingleCheck;
            },
            doDelete: function () {
                var loadingModel =new LIB.Msg.circleLoading();
                var _this = this;
                var rows = _this.tableModel.selectedDatas;
                var deleteIds = _.map(this.tableModel.selectedDatas, function (row) {
                    return {id:row.id}
                });
                if (rows.length > 1) {
                    LIB.Modal.confirm({
                        title: '删除选中数据?',
                        onOk: function () {
                            api.deleteByIds(null, deleteIds).then(function (res) {
                                
                                    LIB.Msg.info("已删除" + rows.length +"条数据！");
                                
                                _this.emitMainTableEvent("do_update_row_data", {
                                    opType: "remove",
                                    value: _this.tableModel.selectedDatas
                                });
                            });
                        }
                    });
                } else {
                    LIB.Modal.confirm({
                        title: '删除选中数据?',
                        onOk: function () {
                            _this.$api.remove(null, {id:rows[0].id}).then(function (data) {
                                if (data.data && data.error != '0') {
                                    LIB.Msg.warning("删除失败");
                                    return;
                                } else {
                                    _this.mainModel.showHeaderTools = false;
                                    _this.emitMainTableEvent("do_update_row_data", {
                                        opType: "remove",
                                        value: _this.tableModel.selectedDatas
                                    });
                                    LIB.Msg.success("删除成功");
                                }
                            });
                        }
                    });
                }
            },
            //Legacy模式
            //			doAdd : function(data) {
            //				this.formModel.hiddenLibraryFormModel.show = true;
            //				this.$refs.hiddenlibraryFormModal.init("create");
            //			},
            //			doSaveHiddenLibrary : function(data) {
            //				this.doSave(data);
            //			}

        },
        events: {
        },
        init: function () {


            this.$api = api;
        },
        ready: function () {
                this.$nextTick(function () {
                    $('.table-fixed-left-body').hide()
                    $('.table-fixed-left').hide()
                })
            }
        });

    return vm;
});
