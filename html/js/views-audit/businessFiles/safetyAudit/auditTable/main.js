define(function(require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
    // var detailPanel = require("./detail-xl");


    var initDataModel = function() {
        return {
            moduleCode: "auditTable",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "middle-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt({
                url: "audittable/list{/curPage}{/pageSize}",
                selectedDatas: [],
                columns: [{
                        title: "",
                        fieldName: "id",
                        fieldType: "cb",
                    },
                    {
                        //唯一标识
                        title: this.$t("gb.common.code"),
                        fieldName: "code",
                        fieldType: "link",
                        filterType: "text",
                        width: 160
                    },
                    {
                        //名称
                        title:this.$t("gb.common.reviewTable"),
                        fieldName: "name",
                        filterType: "text",
                        width: 200
                    },
                    LIB.tableMgr.column.disable,
                    // {
                    //     //禁用标识 0未禁用，1已禁用
                    //    title: this.$t("gb.common.state"),
                    //     fieldName: "disable",
                    //     fieldType: "custom",
                    //     filterType: "enum",
                    //     filterName: "criteria.intsValue.disable",
                    //     popFilterEnum: LIB.getDataDicList("disable"),
                    //     render: function(data) {
                    //         return data.disable === '0' ? '启用' : '停用';
                    //     }
                    // },
                    {
                        //表单类型  1文本 2枚举
                        title: "表单类型",
                        fieldName: "type",
                        fieldType: "custom",
                        // filterType: "enum",
                        filterName: "criteria.intsValue.type",
                        popFilterEnum: [{ id: 1, value: '文本' }, { id: 2, value: '枚举' }],
                        render: function(data) {
                            return data.type === '1' ? '文本' : '枚举';
                        },
                        width: 121
                    },
                    // {
                    //     //评分方式 1五分制 2十分制 3百分制
                    //     title: "评分方式",
                    //     fieldName: "scoreMethod",
                    //     filterType: "text"
                    // },
                    // {
                    //     title: "总分",
                    //     fieldName: "score",
                    //     filterType: "number",
                    //     width: 100
                    // },
                    // {
                    //     //状态 1未审核 2已审核
                    //     title: "审核状态",
                    //     fieldName: "status",
                    //     fieldType: "custom",
                    //     filterType: "enum",
                    //     filterName: "criteria.intsValue.status",
                    //     popFilterEnum : [{id:1,value:'未审核'},{id:2,value:'已审核'}],
                    //     render: function(data) {
                    //         return data.status === '1' ? '未审核' : '已审核';
                    //     }
                    // },
                    LIB.tableMgr.column.company,
                    LIB.tableMgr.column.dept,
                    {
                        title: "创建人",
                        fieldName: "createUser.name",
                        filterType: "text",
                        width: 100
                    },
                    // {
                    //     title: "完成进度",
                    //     fieldName: "isComplete ",
                    //     orderName: 'is_complete',
                    //     fieldType: "custom",
                    //     filterType: "enum",
                    //     filterName: "criteria.intsValue.isComplete",
                    //     popFilterEnum: [{ id: "1", value: '未完成' }, { id: "5", value: '已完成' }],
                    //     render: function(data) {
                    //         return data.isComplete === '1' ? '未完成' : '已完成';
                    //     },
                    //     width: 120
                    // },
                ]
            }),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/auditTable/importExcel"
            },
            exportModel: {
                url: "/auditTable/exportExcel"
            }
        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
        },
        computed: {
            isCreator: function () {
                var rows = this.tableModel.selectedDatas;
                var createBy = _.get(rows, "[0].createBy");
                return LIB.user.id === createBy;
            }
        },
        methods: {
            doUpdate: function() {
                var rows = this.tableModel.selectedDatas;
                // if (_.some(rows, function(row) { return row.disable == 1; })) {
                //     LIB.Msg.warning("【已发布】状态不能编辑,请重新选择!");
                // } else if (!_.isEmpty(rows)) {
                //     this.showDetail(rows[0], { opType: "update" });
                // }
                this.showDetail(rows[0], { opType: "update" });
            },
            doAudit: function() {
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量审核");
                    return;
                }
                var row = rows[0];
                if (row.status === '2') {
                    LIB.Msg.warning("请选择未审核的安全体系");
                    return;
                }
                if (row.disable == 1) {
                    LIB.Msg.warning("禁用状态无法审核");
                    return;
                }
                this.$api.audit({ id: row.id, status: '2' }).then(function() {
                    row.status = 2;
                    _this.emitMainTableEvent("do_update_row_data", { opType: "update", value: row });
                    LIB.Msg.info("审核成功!");
                })
            },
            doEnableDisable: function() {
                var _this = this;
                var rows = _this.tableModel.selectedDatas;

                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量启用停用数据");
                    return
                }
                var row = rows[0];
                var disable = row.disable;
                //0启用，1禁用
                if (disable == 0) {
                    // row.disable = 1;
                    api.updateDisable({ id: row.id, disable: 1 }).then(function(res) {
                        _this.refreshMainTable();
                        LIB.Msg.info("停用成功!");
                    });
                } else {
                    // row.disable = 0;
                    api.updateDisable({ id: row.id, disable: 0 }).then(function(res) {
                        _this.refreshMainTable();
                        LIB.Msg.info("启用成功!");
                    });
                }
            },
            doModifyState: function() {
                this.emitMainTableEvent("do_update_row_data", { opType: "add" });
            }
        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
