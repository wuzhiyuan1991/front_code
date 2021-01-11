define(function (require) {
    //基础js
    var LIB = require('lib');
    var tpl = LIB.renderHTML(require("text!./main.html"))
    var api = require("./vuex/api");
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    //编辑弹框页面
    var editFuncAndMenuComponent = require("./dialog/edit-func-menu");

    var initDataModel = function () {
        return {
            moduleCode: "CompRole",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "middle-info-aside",
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "organization/first/comp/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    isSingleCheck:false,
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                        },
                        {
                            title: this.$t("gb.common.code"),
                            fieldName: "code",
                            filterType: "text",
                            width: 200
                        },
                        {
                            title: this.$t("ori.perm.compName"),
                            fieldName: "name",
                            filterType: "text",
                            width: 240
                        },
                    ],
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/role/importExcel"
            },
            exportModel: {
                url: "/role/exportExcel"
            },
            editModel: {
                //控制编辑组件显示
                title: "新增",
                //显示编辑弹框
                show: false,
                //编辑模式操作类型
                type: "create",
                id: null
            },
            chooiseFuncAndMenuModel: {
                //控制组件显示
                title: "菜单功能权限",
                //显示编辑弹框
                show: false
            },
        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        //Legacy模式
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
            'editFuncAndMenuComponent': editFuncAndMenuComponent
        },
        methods: {
            doClose: function () {
                this.$broadcast('ev_editFuncEmptied', null);
            },
            doMenuAndFunc: function () {
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量修改数据");
                    return;
                }
                var row = rows[0];
                this.chooiseFuncAndMenuModel.show = true;
                this.chooiseFuncAndMenuModel.title = "菜单功能权限 - " + row.name;
                this.chooiseFuncAndMenuModel.id = null;
                this.$broadcast('ev_editFuncAndMenuReload', row.id);
            },
            doEditFuncAndMenuFinished: function () {
                this.chooiseFuncAndMenuModel.show = false;
            },
            doMenuAndFuncBatch:function (type) {
                var rows = this.tableModel.selectedDatas;
                this.chooiseFuncAndMenuModel.show = true;
                if (type === 1) {
                    this.chooiseFuncAndMenuModel.title = "批量设置菜单功能权限";
                } else {
                    this.chooiseFuncAndMenuModel.title = "批量删除菜单功能权限";
                }
                this.chooiseFuncAndMenuModel.id = null;
                this.$broadcast('ev_editFuncAndMenuBatch', rows, type);
            },
        },
        ready: function () {
            this.$api = api;
        }
    });

    return vm;
});
