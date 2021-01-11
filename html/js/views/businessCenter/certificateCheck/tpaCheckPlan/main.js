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
            moduleCode: LIB.ModuleCode.BC_Hal_InsP,
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(renderTableModel({
                url: "tpacheckplan/list{/curPage}{/pageSize}",
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
                        filterType: "text"
                    },

                    {
                        //计划名
                        title: this.$t("gb.common.checkPlanName"),
                        fieldName: "name",
                        filterType: "text"
                    },
                    {
                        title: this.$t("gb.common.state"),
                        orderName: "disable",
                        fieldType: "custom",
                        render: function(data) {
                            return LIB.getDataDic("isPublished", data.disable);
                        },
                        popFilterEnum: LIB.getDataDicList("isPublished"),
                        filterType: "enum",
                        filterName: "criteria.intsValue.disable"
                    },
                    // {
                    //     title: this.$t("gb.common.type"),
                    //     orderName: "type",
                    //     fieldType: "custom",
                    //     render: function (data) {
                    //         return data.type == "100" ? "证书类" : "资料类"
                    //     },
                    //     popFilterEnum: [{id : "100", value: "证书类"},{id : "200", value: "资料类"}],
                    //     filterType: "enum",
                    //     filterName: "criteria.strsValue.type"
                    // },
                    {
                        //开始时间
                        title: this.$t("gb.common.startTime"),
                        fieldName: "startDate",
                        filterType: "date"
                    },
                    {
                        //结束时间
                        title: this.$t("gb.common.endTime"),
                        fieldName: "endDate",
                        filterType: "date"
                    },
                    {
                        title: this.$t("gb.common.check"),
                        orderName: "checkTableId",
                        fieldName: "tpaCheckTable.name",
                        filterType: "text",
                        filterName: "criteria.strValue.checktableName"
                    },
                    {
                        title: "设备设施",
                        orderName: "tpaboatequipment.id",
                        fieldName: "tpaBoatEquipment.name",
                        filterType: "text",
                        filterName: "criteria.strValue.tpaBoatEquipmentName"
                    },
                    {
                        title: "设备类型",
                        orderName: "tpaboatequipment.type",
                        fieldType: "custom",
                        render: function(data) {
                            if (data.tpaBoatEquipment) {
                                return LIB.getDataDic("boat_equipment_type", data.tpaBoatEquipment.type);
                            }
                        },
                        popFilterEnum: LIB.getDataDicList("boat_equipment_type"),
                        filterType: "enum",
                        filterName: "criteria.intsValue.boatEquipmentType"
                    },
                    LIB.tableMgr.column.company,
                ],
                defaultFilterValue: { "criteria.orderValue": { fieldName: "modifyDate", orderType: "1" } }
            })),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/tpacheckplan/importExcel"
            },
            exportModel: {
                url: "/tpacheckplan/exportExcel"
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
                if (_.some(rows, function(row) { return row.disable == 1; })) {
                    LIB.Msg.warning("【已发布】状态不能编辑,请重新选择!");
                } else if (!_.isEmpty(rows)) {
                    this.showDetail(rows[0], { opType: "update" });
                }
            },

            //删除
            beforeDoDelete: function() {
                if (this.tableModel.selectedDatas.length > 1) {
                    LIB.Msg.warning("一次只能删除一条数据");
                    return false;
                }
                if (this.tableModel.selectedDatas[0].disable == 1) {
                    LIB.Msg.warning("已发布不能删除,请重新选择!");
                    return false;
                }
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
                var retirementDate = _.get(rows, "[0].tpaBoatEquipment.retirementDate");
                if (retirementDate) {
                    var now = new Date().Format("yyyy-MM-dd 00:00:00");
                    if (now >= retirementDate) {
                        return LIB.Msg.error("该设备已过期，请维护设备报废日期", 5);
                    }
                }

                //为了获取关联人员的长度
                api.get({ id: rows[0].id }).then(function(res) {
                    if (res.body.purList.length == 0) {
                        LIB.Msg.warning("请添加人员!");
                        return;
                    } else if (res.body) {

                        if (_.some(rows, function(row) { return row.disable == 1; })) {
                            LIB.Msg.warning("【已发布】状态不能发布,请重新选择!");
                        } else {
                            var ids = _.map(rows, function(row) { return row.id });
                            api.publish(null, ids).then(function(res) {
                                _.each(rows, function(row) {
                                    row.disable = 1;
                                });
                                LIB.Msg.info("已发布!");
                                _this.emitMainTableEvent("do_update_row_data", { opType: "update", value: rows });
                            });
                        }
                    }
                })


            },

        },
        events: {
            "ev_dtPublish": function() {
                this.refreshMainTable();
                this.detailModel.show = false;
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
        ready: function() {
            this.$api = api;
        }
    });

    return vm;
});
