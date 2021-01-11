define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("./detail-xl");

    var initDataModel = function () {
        return {
            moduleCode: "Major_C_P",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "majorchemicalprocess/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            //数据类型 1-重点 危险化学工艺 2-重点危险化学品 3-一般危险化学品 4-重大危险源
                            title: "化学工艺类型",
                            fieldName: "catalog.name",
                            filterName: "criteria.strValue.catalogName",
                            orderName: "checkobjectcatalog.name",
                            filterType: "text",
                            width: 240
                        },
                        {
                            //名称
                            title: "重点化学工艺名称",
                            fieldName: "name",
                            filterType: "text",
                            width: 240
                        },

                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        {
                            title: "属地",
                            fieldName: "dominationArea.name",
                            orderName: "dominationarea.name",
                            filterType: "text"
                        },
                        LIB.tableMgr.column.disable,
                        LIB.tableMgr.column.remark
                    ]
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/majorchemicalprocess/importExcel"
            },
            exportModel: {
                url: "/majorchemicalprocess/exportExcel",
                withColumnCfgParam: true
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

        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
