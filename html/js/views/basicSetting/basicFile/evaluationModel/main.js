define(function (require) {
    var BASE = require("base");
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    //编辑弹框页面
    var editComponent = require("./edit");
    var copyComponent = require("./dialog/copyRules");
    var refreshRiskModelComponent = require("./dialog/refreshRiskModel");
    var initDataModel = function () {
        return {
            moduleCode: LIB.ModuleCode.BD_RiA_EvaM,
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: []
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "riskmodel/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                        }, {
                            //title : "编码",
                            title: this.$t("gb.common.code"),
                            fieldName: "code",
                            width: 180,
                            fieldType: "link",
                            filterType: "text"
                        }, {
                            //title : "名称",
                            title: this.$t("gb.common.evaluationName"),
                            fieldName: "name",
                            filterType: "text",
                            width: 180
                        },
                        LIB.tableMgr.column.company,
                        {
                            //  title : "描述",
                            title: this.$t("gb.common.describe"),
                            fieldName: "description",
                            filterType: "text",
                            width: 180
                        },
                        LIB.tableMgr.column.disable
                    ]
                }
            ),
            detailModel: {
                //控制右侧滑出组件显示编辑
                show: false
            },
            copyModel:{
                title: "复制模型",
                //控制copy组件显示
                show: false,
                riskModelId: null,
                name: '',
                description: ''
            },
            uploadModel: {
                url: "/riskmodel/importExcel"
            },
            exportModel: {
                url: "/riskmodel/exportExcel"
            },
            refreshRiskModel: {
                show: false,
                title: '批量修正风险等级',
                gradeLatRanges: []
            },
        };
    }

    //var dataModel = initDataModel();
    var tpl = LIB.renderHTML(require("text!./main.html"));
    var vm = LIB.VueEx.extend({
        template: tpl,
        data: initDataModel,
        components: {
            "editcomponent": editComponent,
            "copyComponent": copyComponent,
            "refreshRiskModelComponent": refreshRiskModelComponent
        },
        methods: {
            doCategoryChange: function (obj) {

            },
            doCopy: function(){
                var row = this.tableModel.selectedDatas[0];
                // console.log(row);
                this.copyModel.riskModelId = row.id;
                this.copyModel.name = row.name;
                this.copyModel.description = row.description;
                this.copyModel.show = true;
            },
            doCopySucceeded: function(){
                this.copyModel.show = false;
                LIB.Msg.info("复制成功");
                this.refreshMainTable();
            },
            doExportExcels: function () {
                this.doExportExcel();
            },
            doEnableDisable: function () {
                var _this = this;
                var rows = _this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量修改启用停用");
                    return
                }
                var updateIds = rows[0].id, disable = rows[0].disable;
                //0启用，1禁用
                if (disable == 0) {
                    api.disable({type: 1}, [updateIds]).then(function (res) {
                        _.each(rows, function (row) {
                            row.disable = 1;
                        });
                        _this.refreshMainTable();
                        //_this.emitMainTableEvent("do_update_row_data", {opType:"update", value: rows});
                        LIB.Msg.info("停用成功!");
                    });
                } else {

                    api.enable(null, [updateIds]).then(function (res) {
                        _.each(rows, function (row) {
                            row.disable = 0;
                        });
                        _this.refreshMainTable();
                        LIB.Msg.info("启用成功!");
                    });

                    // LIB.globalLoader.show();
                    // api.queryHistoryRiskModel({
                    //     compId: rows[0].compId,
                    //     riskModelId: rows[0].id
                    // }).then(function (res) {
                    //     if (res.data && res.data.riskModel.length > 0 && res.data.listResult.length > 0) {
                    //         _this.refreshRiskModel.show = true;
                    //         _this.$broadcast('ev_loadHistoryRange', res.data, rows[0].id);
                    //     } else {
                    //         _this.refreshMainTable();
                    //         LIB.Msg.info("启用成功!");
                    //     }
                    //     LIB.globalLoader.hide();
                    // },function () {
                    //     LIB.globalLoader.hide();
                    // });
                    // api.enable({type: 0}, [updateIds]).then(function (res) {
                    //     _.each(rows, function (row) {
                    //         row.disable = 0;
                    //     });
                    //     _this.refreshMainTable();
                    //     //_this.emitMainTableEvent("do_update_row_data", {opType:"update", value: rows});
                    //     LIB.Msg.info("启用成功!");
                    // });
                }
            },
            doEditFinshed: function () {
                this.refreshMainTable();
            },
            doEditReferencedFinshed: function () {
                this.refreshRiskModel.show = false;
                //加载结果集范围列表数据
                this.doEditFinshed();
            },
        },
        init: function () {
            this.$api = api;
        }

    });


    return vm;
});