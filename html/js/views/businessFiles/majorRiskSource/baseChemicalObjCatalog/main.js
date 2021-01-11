define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail-xl");
    //导入
    var importProgress = require("componentsEx/importProgress/main");

    var initDataModel = function () {
        return {
            moduleCode: "Base_C_O_Catalog",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "checkobjectcatalog/baseChemicalObj/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            //名称
                            title: "名称",
                            fieldName: "name",
                            // keywordFilterName: "criteria.strValue.keyWordValue_name",
                            filterType: "text",
                            width: 240
                        },
                        {
                            //别名
                            title: "别名",
                            fieldName: "alias",
                            filterType: "text",
                            width: 240
                        },
                        // {
                        //     //最大储量
                        //     title: "最大储量",
                        //     fieldName: "maxReserves",
                        //     filterType: "text"
                        // },
                        {
                            //CAS编码
                            title: "CAS编码",
                            fieldName: "casNumber",
                            orderName: "mcot_cas_number",
                            filterType: "text",
                            width: 200
                        },
                        {
                            //UN编号
                            title: "UN编号",
                            fieldName: "unNumber",
                            orderName: "mcot_un_number",
                            filterType: "text",
                            width: 200
                        },
                        {
                            //数据类型 1-重点危险化学工艺 2-重点危险化学品 3-一般危险化学品 4-重大危险源
                            title: "国家重点监管",
                            orderName: "dataType",
                            filterType: "enum",
                            filterName: "criteria.intsValue.dataTypes",
                            popFilterEnum:[
                                {
                                    id: '2',
                                    value: '是'
                                },
                                {
                                    id: '3',
                                    value: '否'
                                }
                             ]
                            ,
                            render: function (data) {
                                return data.dataType === '2' ? '是' : '否';
                            },
                            width: 130
                        },
                        {
                            title: this.$t("gb.common.remarks"),
                            fieldName: "description",
                            filterType: "text"
                        }
                    ]
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/checkobjectcatalog/baseChemicalObj/importExcel"
            },
            exportModel: {
                url: "/checkobjectcatalog/baseChemicalObj/exportExcel",
                withColumnCfgParam: true
            },
            templete: {
                url: "/checkobjectcatalog/baseChemicalObj/file/down"
            },
            importProgress: {
                show: false
            }
        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
            "importprogress": importProgress
        },
        methods: {
            doImport: function () {
                this.importProgress.show = true;
            },
        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
