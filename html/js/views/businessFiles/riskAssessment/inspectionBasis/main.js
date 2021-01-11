define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
    //	var detailPanel = require("./detail-xl");
//导入
    var importProgress = require("componentsEx/importProgress/main");

    var initDataModel = function () {
        return {
            categoryModel: {
                config: [{
                    NodeEdit: true,
                    title: "业务分类",
                    url: "checkbasistype/list",
                    type: "business"
                }]
            },
            moduleCode: LIB.ModuleCode.BD_RiA_InsB,
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "middle-info-aside"
//				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "checkbasis/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb"
                        },
                        {
                            //title : "编码",
                            title: this.$t("gb.common.code"),
                            fieldName: "code",
                            width: 180,
                            fieldType: "link",
                            filterType: "text"
                        },
                        LIB.tableMgr.column.company,
                        {
                            //title : "法律法规",
                            title: this.$t("bc.ria.lawsRegulat"),
                            //fieldType : "custom",
                            width: 160,
                            orderName: "checkbasistype.name",
                            fieldName: "checkBasisType.name",
                            triggerRowSelected: false,
                            //render: function(data){
                            //	if(data.checkBasisType){
                            //		return data.checkBasisType.name;
                            //	}
                            //},
                            filterType: "text",
                            filterName: "criteria.strValue.checkBasisName"
                        },
                        {
                            //title : "章节名称",
                            title: this.$t("gb.common.chapterTitle"),
                            fieldName: "name",
                            width: 200,
                            orderName: "name",
                            filterType: "text"
                        },
                        {
                            //title : "内容说明",
                            title: this.$t("gb.common.contentDesInfo"),
                            fieldName: "content",
                            orderName: "content",
                            filterType: "text",
                            renderClass: "textarea",
                            width: 800
                        }
                    ],
                    defaultFilterValue: {"criteria.orderValue": {fieldName: "modifyDate", orderType: "1"}}
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/checkbasis/importExcel"
            },
            exportModel: {
                url: "/checkbasis/exportExcel",
                withColumnCfgParam: true
            },
            templete: {
                url: "/checkbasis/file/down"
            },
            importProgress: {
                show: false
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
            doImport: function () {
                var _this = this;
                this.importProgress.show = true;
            },
            doCategoryChange: function (obj) {
                var data = {};
                //条件 后台搜索的 属性
                data.columnFilterName = "checkBasisType.id";
                //条件 后台搜索的 值
                data.columnFilterValue = obj.nodeId;
                this.emitMainTableEvent("do_query_by_filter", {type: "save", value: data});
            }
        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
