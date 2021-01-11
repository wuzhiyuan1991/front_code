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

    var initDataModel = function () {
        return {
            moduleCode: "activitiModeler",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "middle-info-aside"
				// detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "activitimodeler/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                        },
                        {
                            //用户编码
                            title: "工作流编码",
                            fieldName: "code",
                            fieldType: "link",
                            filterType: "text"
                        },
                        {
                            //工作流名称
                            title: "名称",
                            fieldName: "name",
                            filterType: "text"
                        },
                        LIB.tableMgr.column.company,
                        {
                            //状态
                            title: "状态",
                            orderName: "status",
                            fieldType: "custom",
                            filterType: "enum",
                            filterName: "criteria.intsValue.status",
                            popFilterEnum: LIB.getDataDicList("modeler_type"),
                            render: function (data) {
                                return LIB.getDataDic("modeler_type", data.status);
                            }
                        },
                        {
                            //状态
                            title: "类型",
                            orderName: "type",
                            fieldType: "custom",
                            filterType: "enum",
                            filterName: "criteria.strsValue.type",
                            popFilterEnum: LIB.getDataDicList("workflow_type"),
                            render: function (data) {
                                return LIB.getDataDic("workflow_type", data.type);
                            }
                        },
                        {
                            //工作流描述
                            title: "描述",
                            fieldName: "description",
                            filterType: "text"
                        },
                        {
                            //更新日期
                            title: "更新日期",
                            fieldName: "modifyDate",
                            filterType: "date"
                        },
                        {
                            //创建日期
                            title: "创建日期",
                            fieldName: "createDate",
                            filterType: "date"
                        }
                    ],
                    defaultFilterValue: {"criteria.orderValue": {fieldName: "modifyDate", orderType: "1"}}
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/activitimodeler/importExcel"
            },
            exportModel: {
                url: "/activitimodeler/exportExcel"
            },
            templete: {
                url: "/activitimodeler/file/down"
            },
            importProgress: {
                show: false
            }
        };
    };
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
            doDeploy: function () {
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                var modelId = rows[0].modeId;
                api.deploy({id: modelId}).then(function () {
                    _this.emitMainTableEvent("do_query_by_filter", {opType: "update", value: rows});
                    LIB.Msg.info("发布成功!");
                })
            },
            doCopy: function () {
                var row = this.tableModel.selectedDatas[0];
                this.$broadcast('ev_dtReload', "copy", row.id, row);
                this.detailModel.show = true;
            }
        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
