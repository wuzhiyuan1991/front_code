define(function (require) {
    //基础js
    var LIB = require('lib');
    var BASE = require('base');
    var tpl = LIB.renderHTML(require("text!./main.html"))
    var api = require("./vuex/api");
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    //编辑弹框页面
    var editComponent = require("./dialog/edit");
    var editDataComponent = require("./dialog/edit-data");
    var editFuncAndMenuComponent = require("./dialog/edit-func-menu");
    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");


    var initDataModel = function () {
        return {
            moduleCode: "role",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "middle-info-aside",
//				detailPanelClass : "large-info-aside"

            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "role/list{/curPage}{/pageSize}?attr1=20",
                    selectedDatas: [],
                    isSingleCheck:false,
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
                            fieldType: "link",
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
                        // LIB.tableMgr.column.company,
                        (function () {
                            var companyOld = LIB.tableMgr.column.company;
                            var company = _.cloneDeep(companyOld);

                            var render = companyOld.render;
                            var isHasCompMenu = false;
                            _.each(BASE.setting.menuList, function (item) {
                                if(item.routerPath && item.routerPath.indexOf('organizationalInstitution/CompanyFi') > -1){
                                    isHasCompMenu = true;
                                }
                            });
                            if(isHasCompMenu){
                                company.render = function (data) {
                                    var str = '';
                                    var comp =  LIB.getDataDic("org", data.compId);
                                    str += '<a style="color:#33a6ff;" target="_blank" href="main.html#!/basicSetting/organizationalInstitution/CompanyFi?method=detail&id='+data.compId+'&code='+comp.code+'">'+render(data)+'</a>'
                                    return str;
                                };
                                company.renderHead = function () {
                                    var titleStr='';
                                    var comp =  LIB.getDataDic("org", LIB.user.compId);
                                    // titleStr = '<a target="_blank" href="main.html#!/basicSetting/organizationalInstitution/CompanyFi?method=select&code='+comp.code+'&id='+LIB.user.compId+'">所属公司</a>'
                                    titleStr = '<a style="color:#666;border-bottom:1px solid #666;padding-bottom:1px;" target="_blank" href="main.html#!/basicSetting/organizationalInstitution/CompanyFi">所属公司</a>'

                                    return  titleStr;
                                };
                                company.tipRender = function (data) {
                                    var name = ' ';
                                    if(LIB.getDataDic("org", data.compId)){
                                        name = LIB.getDataDic("org", data.compId)["compName"]
                                    }
                                    return name;
                                };
                            }
                            return company;
                        })(),
                        LIB.tableMgr.column.disable
                    ],
                    defaultFilterValue: {"criteria.orderValue": {fieldName: "modifyDate", orderType: "1"}}
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
            chooiseRoleModel: {
                //控制组件显示
                title: "角色分配",
                //显示编辑弹框
                show: false
            },
            chooiseFuncModel: {
                //控制组件显示
                title: "角色分配",
                //显示编辑弹框
                show: false
            },
            chooiseMenuModel: {
                //控制组件显示
                title: "菜单分配",
                //显示编辑弹框
                show: false
            },
            chooiseDataModel: {
                //控制组件显示
                title: "角色分配",
                //显示编辑弹框
                show: false
            },
            chooiseFuncAndMenuModel: {
                //控制组件显示
                title: "菜单功能权限",
                //显示编辑弹框
                show: false
            },
            copyModel: {
                visible: false,
                title: "复制",
                isNeedCopyUser: false
            }
        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        //Legacy模式
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
            "editcomponent": editComponent,
            "editdatacomponent": editDataComponent,
            'editFuncAndMenuComponent': editFuncAndMenuComponent
            //Legacy模式
//			"roleFormModal":roleFormModal,

        },
        methods: {
            doClose: function () {
                this.$broadcast('ev_editFuncEmptied', null);
            },
            //启用停用
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
                    api.updateDisable({type: 1}, [updateIds]).then(function (res) {
                        _.each(rows, function (row) {
                            row.disable = '1';
                        });
                        _this.emitMainTableEvent("do_update_row_data", {opType: "update", value: rows});
                        LIB.Msg.info("停用成功!");
                    });
                } else {
                    api.updateStartup({type: 0}, [updateIds]).then(function (res) {
                        _.each(rows, function (row) {
                            row.disable = '0';
                        });
                        _this.emitMainTableEvent("do_update_row_data", {opType: "update", value: rows});
                        LIB.Msg.info("启用成功!");
                    });
                }
            },
            doAlotFunc: function () {
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量修改数据");
                    return;
                }
                var row = rows[0];
                this.chooiseFuncModel.show = true;
                this.chooiseFuncModel.title = "功能权限";
                this.chooiseFuncModel.id = null;
                this.$broadcast('ev_editFuncReload', row.id);
            },
            doAlotData: function (id, name) {
                if (!_.isString(id)) {
                    var rows = this.tableModel.selectedDatas;
                    if (rows.length > 1) {
                        LIB.Msg.warning("无法批量修改数据");
                        return;
                    }
                    var row = rows[0];
                    id = row.id;
                    name = row.name;
                }

                this.chooiseDataModel.show = true;
                this.chooiseDataModel.title = "数据权限 - " + name;
                this.chooiseDataModel.id = null;
                this.$broadcast('ev_editDataReload', id);
            },
            doAlotMenu: function () {
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量修改数据");
                    return;
                }
                var row = rows[0];
                this.chooiseMenuModel.show = true;
                this.chooiseMenuModel.title = "菜单权限";
                this.chooiseMenuModel.id = null;
                this.$broadcast('ev_editMenuReload', row.id);
            },
            doMenuAndFunc: function (id, name) {
                if (!_.isString(id))  {
                    var rows = this.tableModel.selectedDatas;
                    if (rows.length > 1) {
                        LIB.Msg.warning("无法批量修改数据");
                        return;
                    }
                    var row = rows[0];
                    id = row.id;
                    name = row.name;
                }

                this.chooiseFuncAndMenuModel.show = true;
                this.chooiseFuncAndMenuModel.title = "菜单功能权限 - " + name;
                this.chooiseFuncAndMenuModel.id = null;
                this.$broadcast('ev_editFuncAndMenuReload', id);
            },
            doDetailFinshed: function (data) {
                this.emitMainTableEvent("do_update_row_data", {opType: "update", value: data});
                //this.detailModel.show = false;
                //this.refreshMainTable();
            },
            doEditFinshed: function (data) {
                var opType = data.id ? "update" : "add";
                this.emitMainTableEvent("do_update_row_data", {opType: opType, value: data});
                this.editModel.show = false;
            },
            doCopyRole:function (data) {
                var rows = this.tableModel.selectedDatas;
                if (!_.isEmpty(rows)) {
                    var row = rows[0];
                    this.$broadcast('ev_dtReload', "copy", row.id, row);
                    this.detailModel.show = true;
                }
            },
            doMenuAndFuncBatch:function (type) {
                var rows = this.tableModel.selectedDatas;
                this.chooiseFuncAndMenuModel.show = true;
                if (type == "1") {
                    this.chooiseFuncAndMenuModel.title = "批量设置菜单功能权限";
                } else {
                    this.chooiseFuncAndMenuModel.title = "批量删除菜单功能权限";
                }
                this.chooiseFuncAndMenuModel.id = null;
                this.$broadcast('ev_editFuncAndMenuBacth', rows,type);
            },
            doDetailUserAdd: function (data) {
                this.editRow.userList = data;
            },
            doEditMenuFinshed: function () {
                this.chooiseMenuModel.show = false;
            },
            doEditDataFinshed: function () {
                this.chooiseDataModel.show = false;
            },
            doEditFuncAndMenuFinshed: function () {
                this.chooiseFuncAndMenuModel.show = false;
            },
            doAdd4Copy2: function () {
                this.copyModel.isNeedCopyUser = false;
                this.copyModel.visible = true;
            },
            doSaveCopy: function () {
                this.$broadcast("ev_set_copy_parameter", this.copyModel.isNeedCopyUser);
                this.copyModel.visible = false;
                this.doAdd4Copy();
            }
        },
        init: function () {
            this.$api = api;
        },
        attached: function(){
            this.tableModel.isSingleCheck =  !LIB.authMixin.methods.hasPermission('1020006009');
        }
    });

    return vm;
});
