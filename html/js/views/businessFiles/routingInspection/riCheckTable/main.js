define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
	var approvalPanel = require("../../auditProcess/approvalSetting");
    //导入
    var importProgress = require("componentsEx/importProgress/main");
    var sumMixin = require("../mixin/sumMixin");
    var auditFormModal = require("../../auditProcess/auditFormModal");

    var initDataModel = function () {
        return {
            moduleCode: "riCheckTable",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "middle-info-aside",
                showTempSetting: true
//				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "richecktable/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            //巡检表名称
                            title: "巡检表名称",
                            fieldName: "name",
                            filterType: "text",
                            width: 300
                        },
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        {
                            //审核状态 0:待提交,1:待审核,2:已审核
                            title: "审核状态",
                            fieldName: "status",
                            orderName: "status",
                            filterName: "criteria.intsValue.status",
                            filterType: "enum",
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("com_audit_status"),
                            render: function (data) {
                                return LIB.getDataDic("com_audit_status", data.status);
                            }
                        },
                        // {
                        //     //备注
                        //     title: "备注",
                        //     fieldName: "remarks",
                        //     filterType: "text"
                        // },
                        LIB.tableMgr.column.disable
                    ],
                    defaultFilterValue : {"orgId" : LIB.user.orgId}
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/richecktable/importExcel",
                updateUrl: "/richecktable/importForUpdate"
            },
            exportModel: {
                url: "/richecktable/exportExcel",
                withColumnCfgParam: true
            },
            templete: {
                url: "/richecktable/file/down"
            },
            importProgress: {
                url: null,
                show: false
            },
            approvalModel: {
                show: false
            },
            filterTabId: 'todo1',
            undoCount: 0,
            auditObj: {
                visible: false
            },
            auditProcessModel: {
                visible: false,
                values: null
            },
            enableProcess: false,
            hasProcessRecord: false,
            showAuditButton:false,
        };
    };

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel, sumMixin],
        template: tpl,
        watch:{
          "tableModel.selectedDatas": function(val) {
              if(val.length > 0) {
                  this._checkAuditProcess();
              }
          }
        },
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
            "approvalPanel": approvalPanel,
            "auditFormModal": auditFormModal
        },
        methods: {
            _checkShowAudit: function() {
                if(this.tableModel.selectedDatas.length > 0) {
                    var vo = this.tableModel.selectedDatas[0];
                    var baseAuth = vo.status === '1' && this.hasAuth('audit');
                    if (!this.enableProcess) {
                        return baseAuth
                    } else {
                        return baseAuth && this.hasProcessRecord;
                    }
                }
                return false;
            },
            _checkProcessEnable: function () {
                var _this = this;

                api.queryLookupItem().then(function (res) {
                    var lookup = _.find(_.get(res.data, "[0].lookupItems"), "name", "RiCheckTable");
                    _this.enableProcess = (_.get(lookup, "value") === '1');
                    _this.checkedProcessEnable = true;
                })
            },
            beforeDoUpdate: function(row) {
                if(!row || !_.isString(row.id)) {
                    var rows = this.tableModel.selectedDatas;
                    if (rows.length > 1) {
                        LIB.Msg.warning("无法批量导入更新");
                        return;
                    }
                    row = rows[0];
                }
                if(row.status == 1) {
                    LIB.Msg.warning("待审核状态不可进行此操作");
                    return false;
                }
                if(row.status == 2) {
                    LIB.Msg.warning("需要弃审之后才可操作");
                    return false;
                }
            },
            doImportToUpdate: function(row) {
                if (this.beforeDoUpdate(row) === false) {
                    return;
                }
                if(!row || !_.isString(row.id)) {
                    var rows = this.tableModel.selectedDatas;
                    if (rows.length > 1) {
                        LIB.Msg.warning("无法批量导入更新");
                        return;
                    }
                    row = rows[0];
                }
                this.importProgress.url = this.uploadModel.updateUrl + "?id=" + row.id;
                this.importProgress.show = true;
            },
            _submit: function () {
                var _this = this;
                var vo = this.tableModel.selectedDatas[0];
                LIB.Modal.confirm({
                    title: '确定修改完毕，提交审核?',
                    onOk: function() {
                        api.submitCheckTable({id: vo.id}).then(function () {
                            vo.status = '1';
                            _this.refreshMainTable();
                            _this._getUndoCount();
                            LIB.Msg.success("提交成功");
                        })
                    }
                });
            },
            doSubmit: function () {
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                if (rows.length === 0) {
                    LIB.Msg.warning("请选择数据!");
                    return;
                }
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量提交巡检表");
                    return;
                }

                api.checkRouteExist({id: rows[0].id}).then(function () {
                    _this._submit();
                });
            },
            doAudit: function () {
                var rows = this.tableModel.selectedDatas;
                if (rows.length === 0) {
                    LIB.Msg.warning("请选择数据!");
                    return;
                }
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量审核巡检表");
                    return;
                }
                if (!!this.auditProcessParam) {
                    this.auditProcessModel.visible = true;
                    return;
                }
                this.auditObj.visible = true;
            },
            doSaveAuditProcessRecord: function (data) {
                var _this = this;
                var param = this.auditProcessParam;
                param.result = data.result;
                param.remark = data.remark;
                var vo = this.tableModel.selectedDatas[0];

                api.saveAuditProcessRecord({id: vo.id}, param).then(function (res) {
                    LIB.Msg.success("审核操作成功");
                    _this.refreshMainTable();
                    _this._getUndoCount();
                    _this.auditProcessModel.visible = false;
                });
            },
            // 判断启用审核流之后，当前登陆人是否是当前审批节点审核人，如果是，则后端返回一条审核记录数据，审核提交时返回给后端
            _checkAuditProcess: function () {
                var _this = this;
                var vo = this.tableModel.selectedDatas[0];
                api.queryProcessStatus({auditObjectId: vo.id, auditObjectType: 'RiCheckTable'}).then(function (res) {
                    _this.auditProcessParam = res.data;
                    _this.hasProcessRecord = !!res.data;
                    _this.showAuditButton = _this._checkShowAudit();
                })
            },
            doPass: function (val) {
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                if (rows.length === 0) {
                    LIB.Msg.warning("请选择数据!");
                    return;
                }
                if (rows.length > 1) {
                    LIB.Msg.warning("无法审核巡检表");
                    return;
                }
                api.auditCheckTable({id: rows[0].id, status: val}).then(function (res) {
                    _this.refreshMainTable();
                    LIB.Msg.success("审核操作成功");
                    _this._getUndoCount();
                    _this.auditObj.visible = false;
                });
            },
            doQuit: function () {
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                if (rows.length === 0) {
                    LIB.Msg.warning("请选择数据!");
                    return;
                }
                if (rows.length > 1) {
                    LIB.Msg.warning("无法审核巡检表");
                    return;
                }
                api.quitCheckTable({id: rows[0].id}).then(function (res) {
                    _this.refreshMainTable();
                    _this._getUndoCount();
                    LIB.Msg.success("弃审成功");
                })
            },
            doImport: function () {
                this.importProgress.url = this.uploadModel.url;
                this.importProgress.show = true;
            },
            doExport: function() {
            	var _this = this;
                var rows = this.tableModel.selectedDatas;
                if (rows.length === 0) {
                    LIB.Msg.warning("请选择数据!");
                    return;
                }
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量导出巡检表");
                    return;
                }
                LIB.Modal.confirm({
                    title: '导出选中数据?',
                    onOk: function () {
                        window.open("/richecktable/export/" + rows[0].id);
                    }
                });
            },
            showDetail: function(row, opts) {
                this.approvalModel.show = false;
                var opType = (opts && opts.opType) ? opts.opType : "view";
                //this.$broadcast('ev_dtReload', "view", row.id);
                this.$broadcast('ev_dtReload', opType, row.id, row, opts);
                this.detailModel.show = true;
            },
            doSetApproval: function () {
                this.approvalModel.show = true;
                this.$broadcast("ev_dtReload2");
            },
            doFilterBySpecial: function (v) {
                this.filterTabId = 'todo' + (v || '');
                this._normalizeFilterParam(v);
            },
            _normalizeFilterParam: function (v) {
                var params = [];
                var name = 'criteria.strValue.todo';
                if (v) {
                    params.push({
                        value : {
                            columnFilterName : name,
                            columnFilterValue : v
                        },
                        type : "save"
                    })
                } else {
                    params.push({
                        type: "remove",
                        value: {
                            columnFilterName: name
                        }
                    })
                }
                this.$refs.mainTable.doQueryByFilter(params);
            },
            _getUndoCount: function () {
                var _this = this;
                api.getUndoCount().then(function (res) {
                    _this.undoCount = res.data || 0;
                })
            },
            afterDoDetailUpdate: function () {
                this.onTableDataLoaded();
                this._getUndoCount();
            }
        },
        events: {
            "ev_dtClose2": function () {
                this.approvalModel.show = false;
            }
        },
        init: function () {
            this.$api = api;
        },
        created: function () {
            this._getUndoCount();
            this._checkProcessEnable();
        },
        ready: function () {
            this.$refs.categorySelector.setDisplayTitle({type: "org", value: LIB.user.orgId});
            if (!LIB.user.compId) {
                this.mainModel.showTempSetting = false;
            }
            this.doFilterBySpecial();
        }
    });

    return vm;
});
