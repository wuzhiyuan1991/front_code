define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
    //	var detailPanel = require("./detail-xl");


    var initDataModel = function () {
        return {
            moduleCode: "activitiCondition",
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
                    url: "activiticondition/list{/curPage}{/pageSize}",
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
                            //名称
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
                            //表达式
                            title: "表达式",
                            fieldName: "express",
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
                url: "/activitiCondition/importExcel"
            },
            exportModel: {
                url: "/activitiCondition/exportExcel"
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
            // @override
            refreshMainTable: function() {
                var param = {
                    'activitiModeler.id': this.modeId
                };
                this.$refs.mainTable.doQuery(param);
            }
        },
        events: {},
        created: function () {
            this.modeId = this.$route.query.id;
        },
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
