define(function (require) {
    //基础js
    var LIB = require('lib');
    var tpl = LIB.renderHTML(require("text!./main.html"))
    var api = require("./vuex/api");
    //编辑弹框页面
    var editFuncAndMenuComponent = require("./dialog/edit-func-menu");

    var initDataModel = function () {
        return {
            moduleCode: "SysRole",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                selectedRow: [],
                detailPanelClass: "middle-info-aside",
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "role/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    isSingleCheck:true,
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                        },
                        {
                            //角色编码
                            title: this.$t("gb.common.code"),
                            fieldName: "code",
                            filterType: "text",
                            width: 200
                        },
                        {
                            //角色名称
                            title: this.$t("ori.perm.authName"),
                            fieldName: "name",
                            filterType: "text",
                            width: 180
                        },
                        //LIB.tableMgr.column.company,
                        {
                            //是否禁用，0启用，1禁用
                            title: this.$t("gb.common.state"),
                            fieldName: "disable",
                            filterType: "text",
                            width: 100
                        },
                    ],
                    defaultFilterValue: {"criteria.orderValue": {fieldName: "modifyDate", orderType: "1"},"criteria.intsValue": {"types":["10"]}}
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
            doEditFuncAndMenuFinshed: function () {
                this.chooiseFuncAndMenuModel.show = false;
            }
        },
        ready: function () {
            this.$api = api;
        }
    });

    return vm;
});
