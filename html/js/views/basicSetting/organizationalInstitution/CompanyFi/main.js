define(function (require) {
    //基础js
    var LIB = require('lib');
    var Vue = require('vue');
    var api = require("./vuex/api");
    //数据模型
    var ModualAllView=require("./dialog/company_chart");
    //导入
    var importProgress = require("componentsEx/importProgress/main");
    //右侧滑出详细页
    var detailComponent = require("./detail");
    //var gridSel = "#jqxgrid";
    var tpl = LIB.renderHTML(require("text!./main.html"));
    var loading = new LIB.Msg.circleLoading();
    //Vue数据模型
    var dataModel = function () {
        return {
            modualCompanychart:{show:false,title:"总览图"},
            moduleCode: LIB.ModuleCode.BS_OrI_ComD,
            //控制全部分类组件显示
            mainModel: {
                mainModelFilter:[],
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                editRow: null
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "organization/list{/curPage}{/pageSize}?type=1",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                        }, {
                            title: this.$t("gb.common.code"),
                            fieldName: "code",
                            width: 160,
                            fieldType: "link",
                            filterType: "text"
                        }, {
                            title: this.$t("ori.perm.compName"),
                            fieldName: "name",
                            filterType: "text",
                            width: 240
                        }, {
                            title: this.$t("ori.perm.abbreviat"),
                            fieldName: "attr5",
                            filterType: "text",
                            width: 160
                        },
                        LIB.tableMgr.column.compByParentId,
                        LIB.tableMgr.column.disable,
                        {
                            title: this.$t("ori.perm.detailAddr"),
                            fieldName: "address",
                            filterType: "text",
                            width: 240
                        }, {
                            title: this.$t("ori.perm.introduct"),
                            fieldName: "remarks",
                            filterType: "text",
                            width: 600
                        },
                    ]
                }
            ),
            detailModel: {
                //控制右侧滑出组件显示详情
                show: false
            },
            editModel: {
                //控制编辑组件显示
                title: "新增提醒",
                //显示编辑弹框
                show: false,
                //编辑模式操作类型
                type: "create",
                id: null
            },
            uploadModel: {
                url: "/organization/importExcel/company",
            },
            exportModel: {
                url: "/organization/exportExcel/company"
            },
            templete: {
                url: "/organization/file/down"
            },
            importProgress: {
                show: false
            },
            deptShow:true,
        }

    };

    var vm = LIB.VueEx.extend({
        template: tpl,
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        data: dataModel,
        components: {
            "detailcomponent": detailComponent,
            "importprogress": importProgress,
            "modual-companychart":ModualAllView,
        },
        methods: {
            companyChange: function (pms) {
                this.companyId = pms.nodeId;
            },
            closeChart: function () {
                this.modualCompanychart.show = false;
            },
            doAllView: function () {
                window.open("allview.html?type=1&id=" + this.companyId);
            },
            doDownGmjfOrg: function () {
                var _this = this;
                loading.show();
                api.downGmjfOrg().then(function(){
                    loading.hide();
                    LIB.Msg.info("同步完成");
                    window.location.reload();
                });
            },
            doToggleDept: function (show) {
                if (show == this.deptShow) {
                    return;
                } else {
                    this.deptShow = !this.deptShow;
                    this.$refs.companychart.toggleDept(this.deptShow);

                }
            },
            doShowCategory: function () {
                this.mainModel.showCategory = !this.mainModel.showCategory;
            },
            doImport: function () {
                var _this = this;
                _this.importProgress.show = true;
            },
            doClose: function () {
                this.$broadcast('ev_detailClose');
            },
            doEditFinshed: function (data) {
                var opType = data.id ? "update" : "add";
                this.refreshMainTableData();
                this.editModel.show = false;
            },
            afterDoDetailCreate: function () {
                this.$refs.categorySelector.refreshOrgList();
            },
            afterDoDetailUpdate: function () {
                this.$refs.categorySelector.refreshOrgList();
            },
            afterDoDetailDelete: function () {
                this.$refs.categorySelector.refreshOrgList();
            },
            afterDoDelete: function (vo) {
                LIB.updateOrgCache(vo, {type: "delete"});
                this.$refs.categorySelector.refreshOrgList();
            },

            doEnableDisable: function (dataCallback, handler) {
                var _this = this;
                var rows = _this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量操作");
                    return
                }
                var data = rows[0];
                var disable = (data.disable == "0") ? "1" : "0";
                var param = _.extend({disable: disable}, _.pick(data, "id", "orgId"));

                if (disable == "1") {//停用判断
                    api.countChildrenOrg({id:data.id}).then(function (res) {
                        var val = res.data;
                        if (val > 0) {
                            LIB.Modal.confirm({
                                title: data.name+'有子公司，请确认是否要停用？',
                                onOk: function () {
                                    _this.updateDisable(param,disable);
                                }
                            });
                        } else {
                            _this.updateDisable(param,disable);
                        }
                    })
                } else {
                    _this.updateDisable(param,disable);
                }
            },
            updateDisable:function(param,disable) {
                var _this = this;
                api.updateDisable(null, param).then(function (res) {
                    _this.refreshMainTable();
                    LIB.Msg.info((disable == "0") ? "启用成功" : "停用成功");
                });
            }
        },

        init: function () {
            this.$api = api;
        },
        ready: function () {
            if(this.$route.query.code) {
                var data = {
                    columnFilterName: "code",
                    columnFilterValue:this.$route.query.code,
                    displayTitle: "编码",
                    displayValue: this.$route.query.code,
                }
                for(var i=0; i<this.filterConditions.length; i++){
                    if(this.filterConditions[i].columnFilterName == 'code'){
                        this.filterConditions[i].displayTitle = '编码'
                        break;
                    }
                }
                return ;
            };
            var column = _.find(this.tableModel.columns, function (c) {
                return c.fieldName === 'disable';
            });
            this.$refs.mainTable.doOkActionInFilterPoptip(null, column, ['0']);
        }
    });

    return vm;
});