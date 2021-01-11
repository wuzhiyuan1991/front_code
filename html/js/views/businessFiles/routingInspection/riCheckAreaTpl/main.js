define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");
    //导入
    var importProgress = require("componentsEx/importProgress/main");

    LIB.registerDataDic("rfid_is_bind", [
        ["0", "未绑定"],
        ["1", "已绑定"]
    ]);

    var initDataModel = function () {
        return {
            moduleCode: "riCheckAreaTpl",
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
                    url: "richeckareatpl/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    isSingleCheck:false,
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            //巡检区域名称
                            title: "巡检区域名称",
                            fieldName: "name",
                            filterType: "text",
                            width: 300
                        },
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        {
                            title: "属地",
                            fieldName: "dominationArea.name",
                            filterType: "text",
                            width: 200
                        },
                        LIB.tableMgr.column.disable,
                        {
                            //备注
                            title: "RFID标签",
                            fieldName: "riCheckAreaTplRfid.name",
                            filterType: "text",
                            width: 150
                        },
                        {
                            //备注
                            title: "RFID绑定状态",
                            fieldName: "riCheckAreaTplRfid.isBind",
                            width: 135,
                            orderName: "richeckareatplrfid.isBind",
                            filterName: "criteria.intsValue.isBind",
                            filterType: "enum",
                            popFilterEnum: LIB.getDataDicList("rfid_is_bind"),
                            render: function (data) {
                                var isBind = _.get(data, "riCheckAreaTplRfid.isBind", "0");
                                var text = LIB.getDataDic("rfid_is_bind", isBind);
                                if(isBind === '1') {
                                    return '<i class="ivu-icon ivu-icon-checkmark-round" style="font-weight: bold;color: #aacd03;margin-right: 5px;"></i>' + text
                                } else {
                                    return '<i class="ivu-icon ivu-icon-close-round" style="font-weight: bold;color: #f03;margin-right: 5px;"></i>' + text
                                }
                            }
                        },
                        {
                            //备注
                            title: "备注",
                            fieldName: "remarks",
                            filterType: "text"
                        },
                        // LIB.tableMgr.column.modifyDate,
                        // LIB.tableMgr.column.createDate,

                    ],
                    // defaultFilterValue : {"orgId" : LIB.user.orgId}
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/richeckareatpl/importExcel"
            },
            exportModel: {
                url: "/richeckareatpl/exportExcel",
                withColumnCfgParam: true
            },
            templete: {
                url: "/richeckareatpl/file/down"
            },
            importProgress: {
                show: false
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
            doImport: function () {
                var _this = this;
                this.importProgress.show = true;
            },
            doUnbind: function() {
                var _this = this;
                var ids = _.map(_this.tableModel.selectedDatas, function (row) {
                    return row.id
                });
                var batchNum = this.tableModel.selectedDatas.length;
                api.getTableBatchHandleSetting().then(function (res) {
                    var numer =_.get(res.data, "result");
                    if (batchNum > numer) {
                        LIB.Msg.warning("您已选中的记录数是"+batchNum+",限额数是"+numer);
                    } else {
                        LIB.Modal.confirm({
                            title: '已选中'+batchNum+'条数据,确定解绑电子标签?',
                            onOk: function () {
                                api.unbind(null, ids).then(function (res) {
                                    LIB.Msg.info(res.data+"条记录已经解绑电子标签");
                                    _this.emitMainTableEvent("do_update_row_data", {
                                        opType: "remove",
                                        value: _this.tableModel.selectedDatas
                                    });
                                    _this.onTableDataLoaded();
                                });
                            }
                        });
                    }
                });
            }
        },
        ready: function () {
            this.$refs.categorySelector.setDisplayTitle({type: "org", value: LIB.user.orgId});
            if (!LIB.user.compId) {
                this.mainModel.showTempSetting = false;
            }
        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
