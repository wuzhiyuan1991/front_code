define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
	var detailPanel = require("./detail-xl");

    var frequencyTypeList = [
        {
            id: "1",
            value: "天"
        },
        {
            id: "2",
            value: "周"
        },
        {
            id: "6",
            value: "旬"
        },
        {
            id: "3",
            value: "半月"
        },
        {
            id: "4",
            value: "月"
        },
        {
            id: "5",
            value: "季度"
        },
        {
            id: "7",
            value: "半年"
        },
        {
            id: "8",
            value: "年"
        }
    ];

    var initDataModel = function () {
        return {
            moduleCode: "asmtPlan",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                // detailPanelClass: "middle-info-aside"
				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "asmtplan/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                        },
                        {
                            //编码
                            title: "编码",
                            fieldName: "code",
                            fieldType: "link",
                            filterType: "text",
                            width: 160
                        },
                        {
                            //自评计划名名称
                            title: "自评计划名称",
                            fieldName: "name",
                            filterType: "text",
                            width: 240
                        },
                        {
                            title: "自评表名称",
                            fieldName: "asmtTable.name",
                            filterType: "text",
                            width: 240,
                            orderName: "asmtTableId",
                            filterName: "criteria.strValue.asmtTableName"
                        },
                        LIB.tableMgr.column.company,
                        {
                            //开始时间
                            title: "开始时间",
                            fieldName: "startDate",
                            filterType: "date",
                            width: 180
                        },
                        {
                            //结束时间
                            title: "结束时间",
                            fieldName: "endDate",
                            filterType: "date",
                            width: 180
                        },
                        {
                            //自评频率 暂时不用
                            title: "自评周期",
                            orderName: "planSettingId",
                            fieldType: 'custom',
                            filterType: "enum",
                            popFilterEnum: frequencyTypeList,
                            render: function (data) {
                                var res = frequencyTypeList.filter(function (item) {
                                    return item.id === _.propertyOf(data.asmtPlanSetting)("frequencyType");
                                });
                                if(res.length > 0) {
                                    return res[0].value;
                                }
                            },
                            filterName: "criteria.intsValue.frequencyType",
                            width: 100
                        },
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
                        }

                    ]
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/asmtPlan/importExcel"
            },
            exportModel: {
                url: "/asmtPlan/exportExcel"
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
        methods: {
            doPublish: function () {
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                if(rows[0].disable !== '0') {
                    LIB.Msg.warning("只能发布尚未发布的数据");
                    return;
                }
                var params = _.pick(rows[0], ["id", "compId", "orgId"]);
                this.$api.publicPlan([params]).then(function () {
                    LIB.Msg.info("发布成功");
                    _.each(rows, function(row) {
                        row.disable = 1;
                    });
                    _this.emitMainTableEvent("do_update_row_data", { opType: "update", value: rows });
                })
            },
            beforeDoDelete: function() {
                // if (this.tableModel.selectedDatas[0].disable === '1') {
                //     LIB.Msg.warning("已发布不能删除,请重新选择!");
                //     return false;
                // }
            },
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
            },
            doInvalid : function () {
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                if (rows.length == 0) {
                    LIB.Msg.warning("请选择数据!");
                    return;
                }
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量失效数据");
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
            }
        },
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});