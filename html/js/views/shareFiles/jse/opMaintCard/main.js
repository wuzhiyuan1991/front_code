define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("./detail-xl");
    var previewModal = require("./dialog/preview");

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

    LIB.registerDataDic("jse_op_card_copy_status", [
        ["0", "否"],
        ["1", "是"]
    ]);

    var initDataModel = function () {
        return {
            moduleCode: "opMaintCardShare",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                // detailPanelClass : "middle-info-aside"
                detailPanelClass: "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "opmaintcard/share/list{/curPage}{/pageSize}",
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
                            title: "维修卡名称",
                            fieldName: "name",
                            filterType: "text",
                            width: 250
                        },
                        {
                            //设备设施名称（维检修作业卡独有）
                            title: "设备设施名称",
                            fieldName: "equipName",
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
                            title: "是否复制",
                            fieldName: "isCopy",
                            // orderName: "isCopy",
                            filterName: "criteria.intsValue.isCopy",
                            filterType: "enum",
                            fieldType: "custom",
                            sortable :false,
                            popFilterEnum: LIB.getDataDicList("jse_op_card_copy_status"),
                            render: function (data) {
                                var text = LIB.getDataDic("jse_op_card_copy_status", data.isCopy);
                                var icons = {
                                    "0": '<i class="ivu-icon ivu-icon-close-round" style="font-weight: bold;color: #f03;margin-right: 5px;"></i>',
                                    "1": '<i class="ivu-icon ivu-icon-checkmark-round" style="font-weight: bold;color: #aacd03;margin-right: 5px;"></i>'
                                };
                                return icons[data.isCopy] + text;
                            }
                        },
                        {
                            title: "创建时间",
                            fieldName: "createDate",
                            filterType: "date"
                        },
                    ],
                    defaultFilterValue : {"criteria.intsValue": {"isShare":["1"]}}
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/opCard/importExcel"
            },
            exportModel: {
                url: "/opmaintcard/share/exportExcel",
                withColumnCfgParam: true
            },
            auditObj: {
                visible: false
            },
            previewModel: {
                visible: false,
                id: ''
            }
        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
            "previewModal": previewModal
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
            }
        },
        methods: {
            doTableCellClick: function(data) {
                if (!!this.showDetail && data.cell.fieldName === "attr1") {
                    this.showDetail(data.entry.data);
                } else {
                    (!!this.detailModel) && (this.detailModel.show = false);
                }
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
            doPreview: function (id) {
                var _id = id || _.get(this.tableModel.selectedDatas, '[0].id');
                this.previewModel.id= _id;
                this.previewModel.visible = true;
            }
        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
