define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var helper = require("./helper");

    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");

    LIB.registerDataDic("system_document_library_type", [
        ["1", "文件夹"],
        ["2", "文件"]
    ]);


    var initDataModel = function () {
        return {
            moduleCode: "documentLibrary",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "middle-info-aside",
                statusVo: {
                    'all': {value: null, uiFilter:null},
                    'audited': {value:2, uiFilter:null},
                    'auditing': {value: 10, uiFilter:null},
                    'reverted': {value: 11, uiFilter:null},
                    'deleted': {value: 99, uiFilter:null}
                }
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "documentlibrary/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        _.extend({}, LIB.tableMgr.column.code, {width: 120}),
                        {
                            //文件夹名
                            title: "文件名",
                            fieldName: "name",
                            filterType: "text",
                            width: 450,
                            render: function (data) {
                                return helper.getFileIconHtml(data.attr1) + data.name
                            }
                        },
                        {
                            //dataType:1:公开文件,2:已审核,10:待审核,11:已驳回
                            title: "文件状态",
                            fieldName: "dataType",
                            fieldType: "custom",
                            // popFilterEnum: LIB.getDataDicList("document_data_type"),
                            // filterType: "enum",
                            // filterName: "criteria.intsValue.dataType",
                            render: function (data) {
                                if (data.deleteFlag === '1') {
                                    return '已删除'
                                }
                                return LIB.getDataDic("document_data_type", data.dataType);
                            },
                            width: 100
                        },
                        {
                            title: "上传人",
                            fieldName: "user.name",
                            filterType: "text",
                            filterName: "user.username",
                            orderName: 'create_by',
                            width: 100
                        },
                        {
                            title: "审核人",
                            fieldName: "auditorUser.name",
                            filterType: "text",
                            filterName: "auditorUser.username",
                            orderName: 'auditoruser.username',
                            width: 100,
                            render: function (data) {
                                if (data.dataType === '2' || data.dataType === '11') {
                                    return _.get(data, "auditorUser.name", "")
                                }
                                return "";
                            }
                        },
                        LIB.tableMgr.column.modifyDate
                    ],
                    defaultFilterValue: {"criteria.orderValue": {fieldName: "createDate", orderType: "1"}, "type": "2", "criteria.intsValue": {dataType: [10]}}
                }
            ),
            detailModel: {
                show: false
            },
            viewMode: '10',
            visibleMode: 'all',
            auditModel: {
                visible: false,
                remark: ''
            },
            submitModel: {
                visible: false,
                remark: ''
            },
            recoverModel: {
                visible: false,
                remark: ''
            },
            deleteFormModel:{
                visible: false,
                title: '删除文件',
                remark: ''
            },
            uploadModel: {
                params: {
                    id: '',
                    recordId: null,
                    dataType: 'AA1',
                    fileType: 'AA'
                },
                filters: {
                    max_file_size: '10mb',
                    mime_types: [{ title: "files", extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar,txt" }]
                }
            }
        };
    };

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel
        },
        computed: {
            showAuditButton: function () {
                return _.get(this.tableModel.selectedDatas, "[0].dataType") === '10';
            },
            showSubmitButton: function () {
                return _.get(this.tableModel.selectedDatas, "[0].dataType") === '11';
            },
            showDeleteButton:function () {
                return _.get(this.tableModel.selectedDatas, "[0].deleteFlag") === '1';
            },
            showAllItems: function () {
                return this.visibleMode === 'all'
            },
            showAuditing: function () {
                return this.visibleMode === 'all' || this.visibleMode === 'auditing'
            },
            showAudited: function () {
                return this.visibleMode === 'all' || this.visibleMode === 'audited'
            },
            showReverted: function () {
                return this.visibleMode === 'all' || this.visibleMode === 'reverted'
            },
            showDeleteItem: function () {
                return this.visibleMode === 'all' || this.visibleMode === 'deleted'
            },
        },
        methods: {
            changeViewMode: function (v) {
                this.viewMode = v;
                var svo = this.mainModel.statusVo[v];
                var params = [];
                var uiFilterValue;
                if (svo && svo.value) {
                    if (v === 'deleted') {
                        params.push({
                            type: "save",
                            value: {
                                columnFilterName: "deleteFlag",
                                columnFilterValue: "1"
                            }
                        })
                    } else {
                        params.push({
                            type: "save",
                            value: {
                                columnFilterName: "type",
                                columnFilterValue: "2"
                            }
                        });
                        params.push({
                            type: "save",
                            value: {
                                columnFilterName: "criteria.intsValue",
                                columnFilterValue: {dataType: [svo.value]}
                            }
                        });

                        // 已驳回 状态 默认 查询 上传人=登录人
                        if(v == "reverted") {
                            var statusColumn = _.find(this.tableModel.columns, function (item) {
                                return item.fieldName === "user.name";
                            });
                            if(!!statusColumn) {
                                params.push({
                                    type: "save",
                                    value: {
                                        columnFilterName: "user.id",
                                        columnFilterValue: LIB.user.id
                                    }
                                });
                            }

                            uiFilterValue = {
                                //条件 标题
                                displayTitle : statusColumn.title,
                                //条件内容
                                displayValue : LIB.user.username,
                                //条件 后台搜索的 属性
                                columnFilterName : "user.id",
                                //条件 后台搜索的 值
                                columnFilterValue : LIB.user.id
                            };
                        } else if(v == "audited") {
                            var statusColumn = _.find(this.tableModel.columns, function (item) {
                                return item.fieldName === "auditorUser.name";
                            });
                            if(!!statusColumn) {
                                params.push({
                                    type: "save",
                                    value: {
                                        columnFilterName: "auditorUser.id",
                                        columnFilterValue: LIB.user.id
                                    }
                                });
                            }

                            uiFilterValue = {
                                //条件 标题
                                displayTitle : statusColumn.title,
                                //条件内容
                                displayValue : LIB.user.username,
                                //条件 后台搜索的 属性
                                columnFilterName : "auditorUser.id",
                                //条件 后台搜索的 值
                                columnFilterValue : LIB.user.id
                            };
                        }
                    }
                } else {
                    params.push({
                        type: "save",
                        value: {
                            columnFilterName: "type",
                            columnFilterValue: "2"
                        }
                    });
                }
                //keepDefaultFilter = false 时，清空显示的查询条件 ， 并同步添加 uiFilterValue 中的条件
                this.filterConditions.splice(0, this.filterConditions.length);
                if(uiFilterValue) {
                    if(this._isReady) {
                        this.filterConditions.push(uiFilterValue);
                    } else {
                        this.$nextTick(function () {
                            this.filterConditions.push(uiFilterValue);
                        })
                    }
                }
                this.$refs.mainTable.doCleanRefresh(params, {keepDefaultFilter: false});
            },

            uploadParamsRender: function (file, params) {
                return _.extend({}, params, {id: this.reUploadCache.fileId})
            },
            doSubmit: function () {
                var rows = this.tableModel.selectedDatas;
                var file = rows[0];
                this.uploadModel.params.recordId = file.id;
                this.reUploadCache = file;
                this.cacheFileName = file.name;

                this.submitModel.visible = true;
                this.submitModel.remark = '';
            },
            doChooseFile: function () {
                this.submitModel.visible = false;
                this.$refs.singleUploader.$el.firstElementChild.click();
            },
            doUploadBefore: function () {
                LIB.globalLoader.show();
            },
            doUploadSuccess: function (param) {
                var _this = this;
                this.uploadModel.params.recordId = null;
                var con = param.rs.content;
                var parentId = this.reUploadCache.parentIdss;
                var vo = {
                    fileId: con.id,
                    type: '2',
                    name: con.orginalName,
                    disable: '0',
                    parentId: parentId,
                    fileSize: con.fileSize,
                    id: con.recordId,
                    attr1: con.ext,
                    // dataType: '11',
                    remark: this.submitModel.remark
                };

                if (this.cacheFileName !== vo.name) {
                    vo.remark += '(文件名由 ' + this.cacheFileName + ' 变更为 ' + vo.name + ' )';
                }
                api.update({_bizType: 'reupload'}, vo).then(function (res) {
                    setTimeout(function () {
                        _this.doSubmitPass(10);
                    }, 300)
                });
            },
            onUploadComplete: function () {
                setTimeout(function () {
                    LIB.globalLoader.hide();
                }, 300)
            },
            doSubmitPass: function (pass) {
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                var row = rows[0];
                var params = {
                    id: row.id,
                    remark: this.submitModel.remark,
                    dataType: pass
                };
                api.submit(params).then(function () {
                    LIB.Msg.success("提交成功");
                    _this.submitModel.visible = false;
                    _this.refreshMainTable();
                })
            },
            doRecover: function () {
                this.recoverModel.visible = true;
                this.recoverModel.remark = '';
            },
            doSureRecover: function () {
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                var row = rows[0];
                var params = {
                    id: row.id,
                    remark: this.recoverModel.remark,
                    deleteFlag: 0
                };
                api.update({_bizType: 'recover'}, params).then(function () {
                    LIB.Msg.success("恢复成功");
                    _this.recoverModel.visible = false;
                    _this.refreshMainTable();
                })
            },
            doAudit: function () {
                this.auditModel.visible = true;
                this.auditModel.remark = '';
            },
            doPass: function (pass) {
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                var row = rows[0];
                var params = {
                    id: row.id,
                    remark: this.auditModel.remark,
                    dataType: pass
                };

                api.audit(params).then(function () {
                    LIB.Msg.success("审核成功");
                    _this.auditModel.visible = false;
                    _this.refreshMainTable();
                })

            },
            convertFilePath: function(doc) {
                return LIB.convertFilePath({fileId:doc.fileId, ctxPath:doc.attr5});
            },
            doView: function () {
                var rows = this.tableModel.selectedDatas;
                var row = rows[0];
                var officeExts = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'pdf'];
                if (_.includes(officeExts, row.attr1)) {
                    window.open('preview.html?id=' + row.fileId);
                    return;
                }
                if(LIB.isURL(row.attr5)) {
                    window.open(row.attr5);
                } else {
                    window.open("/file/down/" + row.fileId);
                }
            },
            doDeleteFile: function () {
                this.deleteFormModel.visible = true;
                this.deleteFormModel.remark = '';
            },
            doConfirmDeleteFile: function () {
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                var row = rows[0];
                var vo = {
                    id: row.id,
                    remark: this.deleteFormModel.remark
                };
                api.deleteLogic(null, vo).then(function () {
                    _this.refreshMainTable();
                    _this.deleteFormModel.visible = false;
                    LIB.Msg.success("删除成功");
                });
            },
            setPageByPath: function (path) {
                var viewMode = _.last(path.split("/"));
                if (!this.mainModel.statusVo[viewMode]) {
                    this.visibleMode = 'all';
                    this.changeViewMode('all');
                } else {
                    this.visibleMode = viewMode;
                    this.changeViewMode(viewMode);
                }
            }
        },
        events: {},
        init: function () {
            this.$api = api;
        },
        attached: function () {
            var path = this.$route.path;
            this.setPageByPath(path);
        }
    });

    return vm;
});
