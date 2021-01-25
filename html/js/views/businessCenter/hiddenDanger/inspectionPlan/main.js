define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("./detail-xl");

    var initDataModel = function () {
        var _this = this;
        var columsCfg = LIB.setting.fieldSetting["BC_Hal_InsP"] ? LIB.setting.fieldSetting["BC_Hal_InsP"] : [];
        var renderTableModel = _.bind(LIB.tableRenderMgr.renderModel, _this, columsCfg);
        return {
            moduleCode: LIB.ModuleCode.BC_Hal_InsP,
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "large-info-aside",
                bizType: "default"
            },
            tableModel: LIB.Opts.extendMainTableOpt(renderTableModel({
                url: "checkplan/list{/curPage}{/pageSize}",
                selectedDatas: [],
                columns: [{
                    title: "",
                    fieldName: "id",
                    fieldType: "cb",
                },
                {
                    //
                    title: this.$t("gb.common.code"),
                    fieldName: "code",
                    fieldType: "link",
                    filterType: "text",
                    width: 220
                },

                {
                    //计划名
                    title: this.$t("gb.common.checkPlanName"),
                    fieldName: "name",
                    filterType: "text",
                    width: 240
                },
                {
                    title: this.$t("gb.common.state"),
                    orderName: "disable",
                    fieldName: "disable",
                    fieldType: "custom",
                    render: function (data) {
                        if (data.endDate != null && data.disable != null && data.disable == 1 && data.endDate < new Date().Format("yyyy-MM-dd hh:mm:ss")) {
                            data.disable = 3;
                        }
                        return LIB.getDataDic("isPublished", data.disable);
                    },
                    popFilterEnum: LIB.getDataDicList("isPublished"),
                    filterType: "enum",
                    filterName: "criteria.intsValue.disable",
                    width: 100
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
                {
                    title: this.$t("gb.common.check"),
                    filterType: "text",
                    fieldType: "custom",
                    filterName: "criteria.strValue.checkTableName",
                    sortable: false,
                    render: function (data) {
                        if (data.checkTables) {
                            return _.pluck(data.checkTables, 'name').join(', ')
                        }
                    },
                    width: 240
                },
                LIB.tableMgr.column.company,
                LIB.tableMgr.column.dept,
                {
                    //创建人
                    title: this.$t("gb.common.founder"), //"创建人",
                    fieldName: "creator.name",
                    orderName: "createBy",
                    filterType: "text",
                },
                {
                    //发布人
                    title: this.$t("hd.bc.publisher"), // "发布人",
                    fieldName: "publisher.name",
                    orderName: "attr1",
                    filterType: "text",
                },
                {
                    //检查频率
                    title: this.$t("hd.bc.if"), // "检查频率",
                    fieldName: "frequencyType",
                    orderName: "frequencyType",
                    fieldType: "custom",
                    render: function (data) {
                        if (data.planSetting) {
                            if (data.checkType == "0") {
                                return LIB.getDataDic("plan_frequence", data.checkType);
                            } else {
                                return LIB.getDataDic("plan_frequence", data.planSetting.frequencyType);
                            }

                        } else {
                            return LIB.getDataDic("plan_frequence", data.checkType);
                        }
                    },
                    popFilterEnum: LIB.getDataDicList("plan_frequence"),
                    filterType: "enum",
                    filterName: "criteria.intsValue.frequencyType",
                    width: 100
                },

                ],
                defaultFilterValue: {
                    "criteria.orderValue": {
                        fieldName: "modifyDate",
                        orderType: "1"
                    },
                    "planType": 0,
                }
            })),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/checkplan/importExcel"
            },
            exportModel: {
                url: "/checkplan/exportExcel"
            },
        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel
        },
        methods: {
            //修改方法,滑出编辑页面
            doUpdate: function () {
                var rows = this.tableModel.selectedDatas;
                if (!_.isEmpty(rows)) {
                    var row = rows[0];
                    if (row.disable !== '0') {
                        LIB.Msg.warning(this.$t('hd.bc.oudc'));
                        return;
                    }
                    this.showDetail(rows[0], {
                        opType: "update"
                    });
                }
                // if (_.some(rows, function(row) { return row.disable == 1; })) {
                //     LIB.Msg.warning("【已发布】状态不能编辑,请重新选择!");
                // } else if (!_.isEmpty(rows)) {
                //     this.showDetail(rows[0], { opType: "update" });
                // }
            },

            //删除
            beforeDoDelete: function () {
                if (this.tableModel.selectedDatas.length > 1) {
                    LIB.Msg.warning(this.$t('hd.bc.oopo'));
                    return false;
                }
                // if (this.tableModel.selectedDatas[0].disable == 1) {
                //     LIB.Msg.warning("已发布不能删除,请重新选择!");
                //     return false;
                // }
            },
            //发布
            doPublish: function () {
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                if (rows.length == 0) {
                    LIB.Msg.warning(this.$t('gb.common.psd'));
                    return;
                }
                if (rows.length > 1) {
                    LIB.Msg.warning(this.$t('hd.bc.utbp'));
                    return;
                }
                if (rows[0].disable !== '0') {
                    LIB.Msg.warning(this.$t('hd.bc.pap'));
                    return;
                }
                //为了获取关联人员的长度
                api.get({
                    id: rows[0].id
                }).then(function (res) {
                    if (res.body.purList.length == 0) {
                        LIB.Msg.warning(this.$t('hd.bc.psd'));
                        return;
                    } else if (res.body) {
                        LIB.Modal.confirm({
                            title: this.$t('hd.bc.scbp'),
                            onOk: function () {
                                //判断是否已发布
                                if (_.some(rows, function (row) {
                                    return row.disable == 1;
                                })) {
                                    LIB.Msg.warning(this.$t("hd.bc.iscb"));
                                } else if (_.some(rows, function (row) {
                                    return row.disable == 2;
                                })) {
                                    LIB.Msg.warning(this.$t("hd.bc.iscb"));
                                } else {
                                    var ids = _.map(rows, function (row) {
                                        return row.id
                                    });
                                    api.publish(null, ids).then(function (res) {
                                        _.each(rows, function (row) {
                                            row.disable = 1;
                                        });
                                        LIB.Msg.info(this.$t("hd.bc.published"));
                                        // _this.emitMainTableEvent("do_update_row_data", { opType: "update", value: rows });
                                        _this.refreshMainTable();
                                    });
                                }
                            }
                        });
                    }
                })


            },
            doInvalid: function () {
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                if (rows.length == 0) {
                    LIB.Msg.warning(this.$t('gb.common.psd'));
                    return;
                }
                if (rows.length > 1) {
                    LIB.Msg.warning(this.$t("hd.bc.utbp"));
                    return;
                }
                LIB.Modal.confirm({
                    title: this.$t("hd.bc.isd"),
                    onOk: function () {
                        //判断是否已发布
                        if (_.some(rows, function (row) {
                            return row.disable == 0;
                        })) {
                            LIB.Msg.warning(this.$t("hd.bc.scbi"));
                        } else if (_.some(rows, function (row) {
                            return row.disable == 2;
                        })) {
                            LIB.Msg.warning(this.$t("hd.bc.scbi"));
                        } else {
                            api.invalid(null, _.pick(rows[0], "id", "disable")).then(function (res) {
                                _.each(rows, function (row) {
                                    row.disable = 2;
                                });
                                LIB.Msg.info(this.$t("hd.bc.invalid"));
                                _this.emitMainTableEvent("do_update_row_data", {
                                    opType: "update",
                                    value: rows
                                });
                            });
                        }
                    }
                });
            },
            initData: function () {

                if (this.$route.query.bizType) {
                    this.mainModel.bizType = this.$route.query.bizType;
                }

                var params = [];

                //大类型
                params.push({
                    value: {
                        columnFilterName: "bizType",
                        columnFilterValue: this.mainModel.bizType
                    },
                    type: "save"
                });
                var column = _.find(this.tableModel.columns, function (item) {
                    return item.fieldName === "disable";
                })
                column.popFilterEnum = LIB.getDataDicList("isPublished");
                if (this.$route.query.excludeStatus) { //西部管道排查已失效数据
                    var excludeStatus = this.$route.query.excludeStatus.split(",");
                    column.popFilterEnum = _.filter(LIB.getDataDicList("isPublished"), function (it) {
                        return !_.contains(excludeStatus, it.id)
                    });
                    params.push({
                        value: {
                            columnFilterName: "criteria.intsValue.excludeStatus",
                            columnFilterValue: excludeStatus
                        },
                        type: "save"
                    });
                }
                this.$refs.mainTable.refreshColumns();
                this.$refs.mainTable.doQueryByFilter(params);

            },
        },
        events: {
            "ev_dtPublish": function () {
                this.refreshMainTable();
                this.detailModel.show = false;
            }
        },
        route: {
            activate: function (transition) {
                var queryObj = transition.to.query;
                if (queryObj.method && queryObj.method == "create") {
                    this.doAdd();
                }
                transition.next();
            }
        },
        init: function () {
            this.$api = api;
        },
        ready: function () {
            var _this = this;
            if (LIB.getBusinessSetByNamePath('common.enableCheckLevel').result === '2') {
                _this.tableModel.columns.push({
                    title: this.$t("ri.bc.il"),
                    fieldName: "checkLevel",
                    orderName: "checkLevel",
                    fieldType: "custom",
                    filterType: "enum",
                    filterName: "criteria.intsValue.checkLevel",
                    popFilterEnum: LIB.getDataDicList("checkLevel"),
                    render: function (data) {
                        return LIB.getDataDic("checkLevel", data.checkLevel);
                    },
                    width: 100
                });
            }
            var column = _.find(this.tableModel.columns, function (c) {
                return c.orderName === 'disable';
            });
            this.$refs.mainTable.doOkActionInFilterPoptip(null, column, ['0', "1"]);
        }
    });

    return vm;
});