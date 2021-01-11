define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("./detail-xl");
                           
    LIB.registerDataDic("danger-explosive", [
        ["0", "否"],
        ["1", "是"]
        
    ]);
                               
    LIB.registerDataDic("danger-precursor", [
        ["0", "否"],
        ["1", "是"]
        
    ]);

    var initDataModel = function () {
        return {
            moduleCode: "sDCD",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "chemicalregister/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        // {
                        //     //名称
                        //     title: "化学品",
                        //     filterType: "text",
                        //     fieldName: "catalog.name",
                        //     orderName: "checkobjectcatalog.name",
                        //     filterName: "criteria.strValue.catalogName"
                        // },
                        {
                            //名称
                            title: "一般化学品名称",
                            fieldName: "name",
                            filterType: "text"
                        },
                        {
                            title: "别名",
                            fieldName: "alias",
                            filterType: "text"
                        },
                        {
                            title: "类别",
                            fieldName: "category",
                            filterType: "text"
                        },
                        {
                            title: "易制爆",
                            fieldName: "explosive",
                            renderClass: "textarea text-center",
                            width: 100,
                            render: function (data) {
                                if(data.explosive == 1) {
                                    return '<i class="ivu-icon ivu-icon-checkmark-round" style="font-weight: bold;color: #aacd03;margin-right: 5px;"></i>' + '是';
                                } else {
                                    return '<i class="ivu-icon ivu-icon-close-round" style="font-weight: bold;color: #f03;margin-right: 5px;"></i>' + '否';
                                }
                                // if (data.explosive == 1) {
                                //     return '<label class="ivu-checkbox-wrapper"><span class="ivu-checkbox ivu-checkbox-checked"><span class="ivu-checkbox-inner"></span></span><span></span></label>'
                                // } else {
                                //     return '<label class="ivu-checkbox-wrapper"><span class="ivu-checkbox"><span class="ivu-checkbox-inner"></span></span><span></span></label>';
                                // }
                            },
                            filterType: "enum",
                            fieldType: "custom",
                            filterName: "criteria.intsValue.explosive",
                            popFilterEnum: LIB.getDataDicList("danger-explosive"),
                        },
                        {
                            title: "易制毒",
                            fieldName: "precursor",
                            renderClass: "textarea text-center",
                            width: 100,
                            render: function (data) {
                                if(data.precursor == 1) {
                                    return '<i class="ivu-icon ivu-icon-checkmark-round" style="font-weight: bold;color: #aacd03;margin-right: 5px;"></i>' + '是';
                                } else {
                                    return '<i class="ivu-icon ivu-icon-close-round" style="font-weight: bold;color: #f03;margin-right: 5px;"></i>' + '否';
                                }
                                // if (data.precursor == 1) {
                                //     return '<label class="ivu-checkbox-wrapper"><span class="ivu-checkbox ivu-checkbox-checked"><span class="ivu-checkbox-inner"></span></span><span></span></label>'
                                // } else {
                                //     return '<label class="ivu-checkbox-wrapper"><span class="ivu-checkbox"><span class="ivu-checkbox-inner"></span></span><span></span></label>';
                                // }
                            },
                            filterType: "enum",
                            fieldType: "custom",
                            filterName: "criteria.intsValue.precursor",
                            popFilterEnum: LIB.getDataDicList("danger-precursor"),
                        },
                        {
                            //CAS编码
                            title: "CAS编码",
                            fieldName: "ccode",
                            filterType: "text"
                        },
                        {
                            //UN编号
                            title: "UN编号",
                            fieldName: "uncode",
                            filterType: "text"
                        },
                        LIB.tableMgr.column.remark,
                        // LIB.tableMgr.column.company,
                        // LIB.tableMgr.column.dept,
                        // {
                        //     //实际储量
                        //     title: "实际储量",
                        //     fieldName: "actualReserves",
                        //     orderName: "mcoActualReserves",
                        //     filterType: "number",
                        //     render: function (data) {
                        //         var unit = _.propertyOf(data.catalog)("unit") || '';
                        //         return data.actualReserves ? (data.actualReserves + unit) : '';
                        //     }
                        // },
                        // LIB.tableMgr.column.company,
                        // LIB.tableMgr.column.dept,
                        // {
                        //     title: "属地",
                        //     fieldName: "dominationArea.name",
                        //     orderName: "dominationarea.name",
                        //     filterType: "text"
                        // },
                        // LIB.tableMgr.column.disable,
                        // LIB.tableMgr.column.remark
                    ]
                }
            ),
            detailModel: {
                show: false
            },
            importModel: {
                url: "/chemicalregister/importExcel",
                templeteUrl: "/chemicalregister/file4Import",
                importProgressShow: false
            },
            uploadModel: {
                url: "/chemicalregister/importExcel"
            },
            exportModel : {
                url: "/chemicalregister/exportExcel",
                withColumnCfgParam: true
            },
        };
    }

    var vm = LIB.VueEx.extend({
        template: tpl,
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
        },
        methods: {
            doImport: function () {
                this.importModel.importProgressShow = true;
            },
            doDownFile: function () {
                window.open(this.importModel.templeteUrl);
            },
        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
