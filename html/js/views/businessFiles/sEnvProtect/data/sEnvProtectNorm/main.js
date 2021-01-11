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
    LIB.registerDataDic("irf_standard_config_target", [
        ["0", "环境因数"],
        ["1", "加药量"],
        ["3", "出水监测"]
    ]);

    var initDataModel = function () {
        return {
            moduleCode: "sEdNorm",
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
                    url: "standardconfig/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        // {
                        // 	//字段名称
                        // 	title: "字段名称",
                        // 	fieldName: "fieldName",
                        // 	filterType: "text"
                        // },
                        // {
                        // 	//指标名称
                        // 	title: "指标名称",
                        // 	fieldName: "standardName",
                        // 	filterType: "text"
                        // },
                        {
                            //监测对象 0:废气,1:废水,3:噪音
                            title: "监测对象",
                            fieldName: "target",
                            orderName: "target",
                            filterName: "criteria.intsValue.target",
                            filterType: "enum",
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("irf_standard_config_target"),
                            render: function (data) {
                                return LIB.getDataDic("irf_standard_config_target", data.target);
                            },
                            width: 200
                        },
                        {
                            title: "所属公司",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.compId == "9999999999") {
                                    return '默认配置'
                                } else {
                                    return LIB.tableMgr.rebuildOrgName(data.compId, 'comp');
                                }
                            },
                            // filterType: "text",
                            // filterName: "criteria.strValue.compName",
                            fieldName: "compId",
                            width: 150
                        },
                        //  LIB.tableMgr.column.company,
                        //  LIB.tableMgr.column.dept,
                        LIB.tableMgr.column.remark,

                        //					 LIB.tableMgr.column.createDate,
                        //
                    ]
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/standardconfig/importExcel"
            },
            exportModel: {
                url: "/standardconfig/exportExcel",
                withColumnCfgParam: true
            },

            notDefault: false
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

            doTableCellClick: function (data) {
                if (data.entry.data.compId == '9999999999') {
                    this.notDefault = false
                } else {
                    this.notDefault = true
                }
                if (!!this.showDetail && data.cell.fieldName == "code") {
                    this.showDetail(data.entry.data);
                } else {
                    (!!this.detailModel) && (this.detailModel.show = false);
                }
            },
            doImport: function () {
                this.importModel.importProgressShow = true;
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
