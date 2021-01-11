define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");

    var initDataModel = function () {
        return {
            moduleCode: "activitiProcess",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "middle-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "activitiprocess/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                        },
                        {
                            //编码
                            title: this.$t("gb.common.code"),
                            fieldName: "code",
                            fieldType: "link",
                            filterType: "text"
                        },
                        {
                            //流程阶段名称
                            title: "名称",
                            fieldName: "name",
                            filterType: "text"
                        },
                        {
                            //所属流程名称
                            title: "所属流程",
                            fieldType: "custom",
                            filterType: "text",
                            filterName: "criteria.strValue.activitiModelerName",
                            render: function (data) {
                                return _.propertyOf(data.activitiModeler)("name");
                            }
                        },
                        LIB.tableMgr.column.company,
                        {
                            //流程阶段id
                            title: "阶段值",
                            fieldName: "value",
                            filterType: "text"
                        },
                        {
                            //修改时间
                            title: "修改时间",
                            fieldName: "modifyDate",
                            filterType: "date"
                        },
                        {
                            //创建时间
                            title: "创建时间",
                            fieldName: "createDate",
                            filterType: "date"
                        },
                    ],
                    defaultFilterValue: {"criteria.orderValue": {fieldName: "modifyDate", orderType: "1"}}
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/activitiprocess/importExcel"
            },
            exportModel: {
                url: "/activitiprocess/exportExcel"
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
            // @override
            refreshMainTable: function() {
                var param = {
                    'activitiModeler.id': this.modeId
                };
                this.$refs.mainTable.doQuery(param);
            }
        },
        created: function () {
            this.modeId = this.$route.query.id;
        },
        ready: function () {
            this.$api = api;
        }
    });

    return vm;
});
