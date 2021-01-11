define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"
    //编辑弹框页面bip (big-info-panel)
    //	var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
    //编辑弹框页面bip (big-info-panel) Legacy模式
    //  var detailPanel = require("./detail-tab-xl");//修改 detailPanelClass : "large-info-aside"

    //Legacy模式
    //	var ltLpSupFormModal = require("componentsEx/formModal/ltLpSupFormModal");
    LIB.registerDataDic("lawcom_evaluation", [
        ["1", "符合"],
        ["0", "不符合"]
    ]);

    var initDataModel = function () {
        return {
            moduleCode: "sLawcom",
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
                    url: "irllegalregulationevaluation/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            title: "法律法规与其他要求名称",
                            fieldName: "irlLegalRegulation.name",
                            orderName: "irlLegalRegulation.name",
                            filterType: "text",
                            width: 200
                        },
                        {
                            title: "编号",
                            fieldName: "irlLegalRegulation.identifier",
                            orderName: "irlLegalRegulation.identifier",
                            filterType: "text"
                        },
                        {
                            //适用文件
                            title: "适用文件",
                            fieldName: "applicableDocuments",
                            filterType: "text"
                        },
                        {
                            //适用条款
                            title: "适用条款",
                            fieldName: "applicableProvisions",
                            filterType: "text"
                        },
                        {
                            //实施情况
                            title: "实施情况",
                            fieldName: "implementation",
                            filterType: "text"
                        },
                        // {
                        // 	//使用的条款
                        // 	title: "使用的条款",
                        // 	fieldName: "usedProvisions",
                        // 	filterType: "text"
                        // },
                        {
                            title: "符合性",
                            width: 100,
                            fieldName: "evaluation",
                            filterType: "enum",
                            fieldType: "custom",
                            render: function (data) {
                                return LIB.getDataDic("lawcom_evaluation", data.evaluation)

                            },
                            filterName: "criteria.strsValue.evaluation",
                            popFilterEnum: LIB.getDataDicList("lawcom_evaluation"),

                        },
                        // {
                        //     title: "状态",
                        //     width: 100,
                        //     fieldName: "status",
                        //     filterType: "text"
                        // },
                        LIB.tableMgr.column.company,
                        // {
                        //     title: "所属部门",
                        //     fieldName: "dept",
                        //     filterType: "text"
                        // },
                        // LIB.tableMgr.column.disable,
                        // LIB.tableMgr.column.company,
                        // LIB.tableMgr.column.dept,
                        // LIB.tableMgr.column.modifyDate,
                        // LIB.tableMgr.column.createDate,
                    ]
                }
            ),
            detailModel: {
                show: false
            },
            importProgress: {
                show: false
            },
            uploadModel: {
                url: "/irllegalregulationevaluation/importExcel"
            },
            exportModel: {
                url: "/irllegalregulationevaluation/exportExcel",
                withColumnCfgParam: true
            },
            templete: {
                url: "/irllegalregulationevaluation/importExcelTpl/down"
            },



            //Legacy模式
            //			formModel : {
            //				ltLpSupFormModel : {
            //					show : false,
            //				}
            //			}

        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        //Legacy模式
        //		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainLegacyPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
            //Legacy模式
            //			"ltlpsupFormModal":ltLpSupFormModal,

        },
        methods: {
            //Legacy模式
            //			doAdd : function(data) {
            //				this.formModel.ltLpSupFormModel.show = true;
            //				this.$refs.ltlpsupFormModal.init("create");
            //			},
            //			doSaveLtLpSup : function(data) {
            //				this.doSave(data);
            //			}

            doImport: function () {
                this.importProgress.show = true;
            },
            doDownFile: function () {
                window.open(this.importModel.templeteUrl);
            },
        },
        events: {
        },
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
