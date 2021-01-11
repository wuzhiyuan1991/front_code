define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
    // var detailPanel = require("./detail-xl");


    var initDataModel = function () {
        return {
            moduleCode: "isaauditPlan",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "middle-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt({
                url: "isaauditplan/list{/curPage}{/pageSize}",
                selectedDatas: [],
                columns: [
                    {
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
                        title: this.$t("gb.common.reviewPlan"),
                        fieldName: "name",
                        filterType: "text",
                        width: 240
                    },
                    {
                        //名称
                        title: this.$t("gb.isa.reviewTable"),
                        fieldName: "auditTable.name",
                        orderName: "audittable.name",
                        filterType: "text",
                        width: 200
                    },
                    {
                        //开始时间
                        title: this.$t("gb.common.startTime"),
                        fieldName: "startDate",
                        filterType: "date",
                        width: 180
                    },
                    {
                        //结束时间
                        title: this.$t("gb.common.endTime"),
                        fieldName: "endDate",
                        filterType: "date",
                        width: 180
                    },
                    LIB.tableMgr.column.company,
                    LIB.tableMgr.column.dept,
                    {
                        title: this.$t("gb.common.personInCharge"),
                        fieldName: 'user.name',
                        orderName: "user.id",
                        filterName: "user.username",
                        filterType: "text",
                        width: 100
                    },
                    {
                        //发布状态 1未发布 2已发布
                        title: "发布状态",
                        fieldName: "status",
                        fieldType: "custom",
                        render: function (data) {
                            return data.status === '1' ? '未发布' : '已发布';
                        },
                        filterType: "enum",
                        filterName: "criteria.intsValue.status",
                        popFilterEnum: [{id: '1', value: '未发布'}, {id: '2', value: '已发布'}],
                        width: 120
                    },

                ]
            }),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/isaauditPlan/importExcel"
            },
            exportModel: {
                url: "/isaauditPlan/exportExcel"
            }

        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel
        },
        computed: {
            selectId: function () {
                return this.tableModel.selectedDatas.length ? this.tableModel.selectedDatas[0].id : '';
            },
            showOperationBtns: function () {
                return this.tableModel.selectedDatas.length && this.tableModel.selectedDatas[0].status != '2';
            }
        },
        methods: {
            doChange: function () {
            },
            //修改方法,滑出编辑页面
            doUpdate: function () {
                var rows = this.tableModel.selectedDatas;
                if (_.some(rows, function (row) {
                        return row.status == 2;
                    })) {
                    LIB.Msg.warning("【已发布】状态不能编辑,请重新选择!");
                } else if (!_.isEmpty(rows)) {
                    this.showDetail(rows[0], {opType: "update"});
                }
            },
            beforeDoDelete: function () {
                var rows = this.tableModel.selectedDatas;
                //判断是否已发布
                if (_.some(rows, function (row) {
                        return row.status == 2;
                    })) {
                    LIB.Msg.warning("【已发布】状态不能删除,请重新选择!");
                    return false;
                }
            },
            doPublish: function () {
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                if (rows.length == 0) {
                    LIB.Msg.warning("请选择数据!");
                    return;
                }
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量发布数据");
                    return;
                }
                //判断是否已发布
                if (_.some(rows, function (row) {
                        return row.status == 2;
                    })) {
                    LIB.Msg.warning("【已发布】状态不能发布,请重新选择!");
                    return;
                }
                LIB.Modal.confirm({
                    title: '发布选中数据?',
                    onOk: function () {
                        _this.$api.publish({id: rows[0].id, status: 2}).then(function (data) {
                            _.each(rows, function (row) {
                                row.status = 2;
                            });
                            LIB.Msg.info("已发布!");
                            _this.emitMainTableEvent("do_update_row_data", {opType: "update", value: rows});
                        });
                    }
                });
            }
        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
