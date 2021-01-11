define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("./detail-xl");

    var initDataModel = function () {
        return {
            moduleCode: "Major_C_Obj",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "majorchemicalobj/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            //名称
                            title: "化学品",
                            filterType: "text",
                            fieldName: "catalog.name",
                            orderName: "checkobjectcatalog.name",
                            filterName: "criteria.strValue.catalogName"
                        },
                        {
                            //名称
                            title: "重点化学品名称",
                            fieldName: "name",
                            filterType: "text"
                        },
                        {
                            //实际储量
                            title: "实际储量",
                            fieldName: "actualReserves",
                            filterType: "number",
                            orderName: "mcoActualReserves",
                            render: function (data) {
                                var unit = _.propertyOf(data.catalog)("unit") || '';
                                return data.actualReserves ? (data.actualReserves + unit) : '';
                            }
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
                url: "/majorchemicalobj/importExcel"
            },
            exportModel: {
                url: "/majorchemicalobj/exportExcel",
                withColumnCfgParam: true
            }
        };
    }

    var vm = LIB.VueEx.extend({
        template: tpl,
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
        },
        methods: {},
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
