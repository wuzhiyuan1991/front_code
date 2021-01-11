define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("./detail-xl");
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");
    var previewModal = require("./dialog/preview");
    var electricPreviewModal = require("./dialog/electricPreview");
    //导入
    var importProgress = require("componentsEx/importProgress/main");
    var approvalPanel = require("../../auditProcess/approvalSetting");
    var sumMixin = require("../mixin/sumMixin");

    LIB.registerDataDic("jse_op_card_type", [
        ["1", "操作票"],
        ["2", "维检修作业卡"],
        ["3", "应急处置卡"]
    ]);

    LIB.registerDataDic("jse_op_card_status", [
        ["0", "待提交"],
        ["1", "待审核"],
        ["2", "已审核"]
    ]);


    var initDataModel = function () {
        return {
            moduleCode: "opStdCardNew",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                // detailPanelClass : "middle-info-aside"
                detailPanelClass: "large-info-aside",
                showTempSetting: true
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "opstdcard/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        {
                            title: this.$t("gb.common.code"),
                            fieldName: "attr1",
                            width: 180,
                            orderName: "attr1",
                            fieldType: "link",
                            filterType: "text",
                            fixed: true,
                            codeToView:true,//是否需要code转查看

                        },
                        {
                            //卡票名称
                            title: "操作票名称",
                            fieldName: "name",
                            filterType: "text",
                            width: 250
                        },
                        {
                            title: "流程操作名称",
                            fieldName: "content",
                            filterType: "text",
                            width: 250
                        },
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        LIB.tableMgr.column.disable,
                        {
                            //审核状态 0:待提交,1:待审核,2:已审核
                            title: "审核状态",
                            fieldName: "status",
                            orderName: "status",
                            filterName: "criteria.intsValue.status",
                            filterType: "enum",
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("jse_op_card_status"),
                            render: function (data) {
                                return LIB.getDataDic("jse_op_card_status", data.status);
                            }
                        },
                        {
                            title: "类型",
                            fieldName: "specialityType",
                            orderName: "specialityType",
                            filterName: "criteria.intsValue.specialityType",
                            filterType: "enum",
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("jse_op_card_speciality_type"),
                            render: function (data) {
                                return LIB.getDataDic("jse_op_card_speciality_type", data.specialityType);
                            }
                        },
                        {
                            title: "创建时间",
                            fieldName: "createDate",
                            filterType: "date"
                        }
                    ],
                    defaultFilterValue : {"orgId" : LIB.user.orgId}
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/opstdcard/importExcel"
            },
            exportModel: {
                url: "/opstdcard/exportExcel",
                withColumnCfgParam: true
            },
            templete: {
                url: "/opstdcard/file/down"
            },
            importHelperUrl: '/opcard/helper/down',
            auditObj: {
                visible: false
            },
            previewModel: {
                visible: false,
                id: ''
            },
            electricPreviewModel: {
                visible: false,
                id: ''
            },
            shareModal: {
                visible: false,
                title: '批量共享',
                leftArray: null,
                rightArray: null
            },
            importProgress: {
                show: false
            },
            approvalModel: {
                show: false
            },
            filterTabId: 'todo1',
            undoCount: 0
        };
    };

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel, sumMixin],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
            "previewModal": previewModal,
            "approvalPanel": approvalPanel,
            "electricPreviewModal": electricPreviewModal,

        },
        computed: {
            showSubmit: function () {
                return _.get(this.tableModel.selectedDatas, '[0].status') === '0';
            },
            showAudit: function () {
                return _.get(this.tableModel.selectedDatas, '[0].status') === '1';
            },
            showQuit: function () {
                return _.get(this.tableModel.selectedDatas, '[0].status') === '2';
            },
            showJSA: function () {
                return _.get(this.tableModel.selectedDatas, '[0].status') === '2' && _.get(this.tableModel.selectedDatas, '[0].disable') === '0';
            }
        },
        methods: {
            doJSA: function () {
                var row = this.tableModel.selectedDatas[0];
                if (!_.isPlainObject(row)) {
                    return;
                }

                var routerPart = "/jse/businessCenter/jsaMasterNew?method=create&type=1&cardId=" + row.id;
                window.__JSA_CARD__ = row;
                this.$router.go(routerPart);

            },
            doImport: function () {
                this.importProgress.show = true;
            },
            doImport: function () {
                var url = "/opstdcard/importExcel";
                //1工艺 6电气
                if (this.mainModel.bizType) {
                    url = "/opstdcard/importExcel?specialityType=" + this.mainModel.bizType;
                }
                this.$broadcast("ev_update_url", url);
                this.importProgress.show = true;
            },

            _getSharedCards: function () {
                var _this = this;
                this._cacheShare = [];
                api.list({curPage: 1, pageSize: 9999, disable: '0'}).then(function (res) {
                    var items = _.map(res.data.list, function (item) {
                        return {
                            key: item.id,
                            isShare: item.isShare,
                            label: item.name,
                            shareCode:item.attr1
                        }
                    });
                    _this.shareModal.leftArray = items;
                    var rightArray = _.filter(items, function (item) {
                        return item.isShare === '1';
                    });
                    _this.shareModal.rightArray = _.map(rightArray, function (item) {
                        return item.key
                    })
                })
            },
            handleTransferChange: function (newTargetKeys, direction, moveKeys) {
                this._cacheShare = _.xor(this._cacheShare, moveKeys);
                this.shareModal.rightArray = newTargetKeys;
            },
            showShareModal: function () {
                this._getSharedCards();
                this.shareModal.visible = true;
            },
            closeShareModal: function () {
                this.shareModal.visible = false;
            },
            batchShare: function () {
                var _this = this;
                var params = _.filter(this.shareModal.leftArray, function (item) {
                    return _.includes(_this._cacheShare, item.key);
                });
                params = _.map(params, function (item) {
                    return {
                        id: item.key,
                        isShare: item.isShare === '0' ? '1' : '0'
                    }
                });
                api.batchShare(params).then(function () {
                    LIB.Msg.success("操作成功");
                    _this.closeShareModal();
                    _this.refreshMainTableData();
                })
            },
            doTableCellClick: function(data) {
                if (!!this.showDetail && data.cell.fieldName === "attr1") {
                    this.showDetail(data.entry.data);
                } else {
                    (!!this.detailModel) && (this.detailModel.show = false);
                }
            },
            doSubmit: function () {
                var _this = this;
                var id = _.get(this.tableModel.selectedDatas, '[0].id');

                api.submitOpCard({id: id}).then(function (res) {
                    _this.refreshMainTable();
                    LIB.Msg.success("提交成功");
                })

            },
            doAudit: function () {
                this.auditObj.visible = true;
            },
            doPass: function (val) {
                var _this = this;
                var id = _.get(this.tableModel.selectedDatas, '[0].id');
                api.auditOpCard({id: id, status: val}).then(function (res) {
                    _this.refreshMainTable();
                    LIB.Msg.success("审核操作成功");
                    _this.auditObj.visible = false;
                })
            },
            doQuit: function () {
                var _this = this;
                var id = _.get(this.tableModel.selectedDatas, '[0].id');
                api.quitOpCard({id: id}).then(function (res) {
                    _this.refreshMainTable();
                    LIB.Msg.success("弃审成功");
                })
            },
            doPreview: function (data) {
                var _id = data ? data.id : _.get(this.tableModel.selectedDatas, '[0].id');
                var bizType = data ? data.bizType : _.get(this.tableModel.selectedDatas, '[0].specialityType');
                if(bizType == "6"){
                    this.electricPreviewModel.id= _id;
                    this.electricPreviewModel.visible = true;
                }else{
                    this.previewModel.id= _id;
                    this.previewModel.visible = true;
                }

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
                    _this.undoCount = _.get(res.data, '1', 0);
                })
            },
            afterDoDetailUpdate: function () {
                this.onTableDataLoaded();
                this._getUndoCount();
            },
            initData: function () {
                this.mainModel.bizType = this.$route.query.bizType;
                var params = [];
                //大类型
                params.push({
                    value : {
                        columnFilterName : "specialityType",
                        columnFilterValue : this.mainModel.bizType
                    },
                    type : "save"
                });
                this.$refs.mainTable.doQueryByFilter(params);
            },
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
        },
        ready: function () {
            this.$refs.categorySelector.setDisplayTitle({type: "org", value: LIB.user.orgId});
            if (!LIB.user.compId) {
                this.mainModel.showTempSetting = false;
            }
            if (this.$route.query.method === "filterByUser") {//首页跳转时根据首页对应搜索条件查询
                    this.doFilterBySpecial("1");
            }else{
                this.doFilterBySpecial();
            }
        }
    });

    return vm;
});
