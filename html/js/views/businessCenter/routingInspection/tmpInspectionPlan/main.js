define(function(require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("./detail-xl");

    var initDataModel = function() {
        var _this = this;
        var columsCfg = LIB.setting.fieldSetting["BC_Hal_InsP"] ? LIB.setting.fieldSetting["BC_Hal_InsP"] : [];
        var renderTableModel = _.bind(LIB.tableRenderMgr.renderModel, _this, columsCfg);
        return {
            moduleCode: "ritmpcheckplan",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "large-info-aside",
                showTempSetting: true
            },
            tableModel: LIB.Opts.extendMainTableOpt(renderTableModel({
                url: "ritmpcheckplan/list{/curPage}{/pageSize}",
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
                        title: '临时工作计划名称',
                        fieldName: "name",
                        filterType: "text",
                        width: 240
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
                    // {
                    //     title: this.$t("gb.common.check"),
                    //     filterType: "text",
                    //     fieldType: "custom",
                    //     filterName: "criteria.strValue.checkTableName",
                    //     sortable :false,
                    //     render: function (data) {
                    //         if (data.checkTables) {
                    //             return _.pluck(data.checkTables, 'name').join(', ')
                    //         }
                    //     },
                    //     width: 240
                    // },
                    {
                        title: this.$t("gb.common.state"),
                        orderName: "disable",
                        fieldType: "custom",
                        render: function(data) {
                            if(data.endDate != null && data.disable != null && data.disable == 1 && data.endDate < new Date().Format("yyyy-MM-dd hh:mm:ss")) {
                                data.disable = 3;
                            }
                            return LIB.getDataDic("isPublished", data.disable);
                        },
                        popFilterEnum: LIB.getDataDicList("isPublished"),
                        filterType: "enum",
                        filterName: "criteria.intsValue.disable",
                        width: 100
                    },

                ],
                defaultFilterValue: { "criteria.orderValue": { fieldName: "modifyDate", orderType: "1" },"orgId" : LIB.user.orgId}
            })),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/ritmpcheckplan/importExcel"
            },
            exportModel: {
                url: "/ritmpcheckplan/exportExcel"
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
            doUpdate: function() {
                var rows = this.tableModel.selectedDatas;
                if (!_.isEmpty(rows)) {
                    var row = rows[0];
                    if(row.disable !== '0') {
                        LIB.Msg.warning("只能编辑未发布的数据");
                        return;
                    }
                    this.showDetail(rows[0], { opType: "update" });
                }
                // if (_.some(rows, function(row) { return row.disable == 1; })) {
                //     LIB.Msg.warning("【已发布】状态不能编辑,请重新选择!");
                // } else if (!_.isEmpty(rows)) {
                //     this.showDetail(rows[0], { opType: "update" });
                // }
            },

            //删除
            beforeDoDelete: function() {
                if (this.tableModel.selectedDatas.length > 1) {
                    LIB.Msg.warning("一次只能删除一条数据");
                    return false;
                }
                // if (this.tableModel.selectedDatas[0].disable == 1) {
                //     LIB.Msg.warning("已发布不能删除,请重新选择!");
                //     return false;
                // }
            },
            //发布
            doPublish: function() {
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
                if(rows[0].disable !== '0') {
                    LIB.Msg.warning("只能发布尚未发布的数据");
                    return;
                }
                //为了获取关联人员的长度
                api.get({ id: rows[0].id }).then(function(res) {
                    if (res.body.purList.length == 0) {
                        LIB.Msg.warning("请添加人员!");
                        return;
                    } else if (res.body) {
                        LIB.Modal.confirm({
                            title: '发布选中数据?',
                            onOk: function() {
                                //判断是否已发布
                                if (_.some(rows, function(row) { return row.disable == 1; })) {
                                    LIB.Msg.warning("【已发布】状态不能发布,请重新选择!");
                                } else if(_.some(rows, function(row) { return row.disable == 2; })) {
                                    LIB.Msg.warning("【已失效】状态不能发布,请重新选择!");
                                } else {
                                    var ids = _.map(rows, function(row) { return row.id });
                                    api.publish(null, ids).then(function(res) {
                                        _.each(rows, function(row) {
                                            row.disable = 1;
                                        });
                                        LIB.Msg.info("已发布!");
                                        // _this.emitMainTableEvent("do_update_row_data", { opType: "update", value: rows });
                                        _this.refreshMainTable();
                                    });
                                }
                            }
                        });
                    }
                })


            },
            doInvalid : function () {
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
                LIB.Modal.confirm({
                    title: '失效选中数据?',
                    onOk: function() {
                        //判断是否已发布
                        if (_.some(rows, function(row) { return row.disable == 0; })) {
                            LIB.Msg.warning("【未发布】状态不能失效,请重新选择!");
                        } else if(_.some(rows, function(row) { return row.disable == 2; })) {
                            LIB.Msg.warning("【已失效】状态不能失效,请重新选择!");
                        } else {
                            api.invalid(null, _.pick(rows[0],"id","disable")).then(function(res) {
                                _.each(rows, function(row) {
                                    row.disable = 2;
                                });
                                LIB.Msg.info("已失效!");
                                _this.emitMainTableEvent("do_update_row_data", { opType: "update", value: rows });
                            });
                        }
                    }
                });
            }
        },
        events: {
            "ev_dtPublish": function() {
                this.refreshMainTable();
                this.detailModel.show = false;
            }
        },
        ready: function () {
            this.$refs.categorySelector.setDisplayTitle({type: "org", value: LIB.user.orgId});
            if (!LIB.user.compId) {
                this.mainModel.showTempSetting = false;
            }
        },
        route: {
            activate: function(transition) {
                var queryObj = transition.to.query;
                if (queryObj.method && queryObj.method == "create") {
                    this.doAdd();
                }
                transition.next();
            }
        },
        init: function() {
            this.$api = api;
        }
    });

    return vm;
});
