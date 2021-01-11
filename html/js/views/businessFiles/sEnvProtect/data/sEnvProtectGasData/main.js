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


    var initDataModel = function () {
        return {
            moduleCode: "sEdgas",
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
                    url: "wastegasdectction/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        // {
                        // 	title: "类型",
                        //    width: 300,
                        // 	fieldName: "name",
                        // 	filterType: "text"
                        // },
                        // {
                        //    title: "取样日期",
                        //    fieldName: "getDate",
                        //    filterType: "text"
                        // },
                        {
                            //点位
                            title: "点位",
                            fieldName: "position",
                            filterType: "text"
                        },
                        {
                            //取样时间
                            title: "取样时间",
                            fieldName: "sampleDate",
                            filterType: "date"
                            //						fieldType: "custom",
                            //						render: function (data) {
                            //							return LIB.formatYMD(data.sampleDate);
                            //						}
                        },
                        {
                            						//污染物种类
                            						title: "污染物种类",
                            						fieldName: "kind",
                            						filterType: "text"
                            					},
                        {
                            title: "排放方式",
                            fieldName: "emissMode",
                            filterType: "text"
                        },
                        {
                            title: "排放浓度 mg/m3",
                            fieldName: "emissConcentra",
                            filterType: "text"
                        },
                        {
                            title: "排放速度 kg/h",
                            fieldName: "emissSpeed",
                            filterType: "text"
                        },
                        // {
                        //     title: "备注",
                        //     fieldName: "remark",
                        //     filterType: "text"
                        // },
                        // {
                        //     title: "状态",
                        //     width: 100,
                        //     fieldName: "status",
                        //     filterType: "text"
                        // },
                        // {
                        //     title: "所属公司",
                        //     width: 200,
                        //     fieldName: "company",
                        //     filterType: "text"
                        // },
                        // {
                        //     title: "所属部门",
                        //     fieldName: "dept",
                        //     filterType: "text"
                        // },
                        // LIB.tableMgr.column.disable,
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        // LIB.tableMgr.column.modifyDate,
                        // LIB.tableMgr.column.createDate,
                    ]
                }
            ),
            detailModel: {
                show: false
            },
            importModel: {
                url: "/wastegasdectction/importExcel",
                templeteUrl: "/wastegasdectction/importExcelTpl/down",
                importProgressShow: false
            },
            exportModel: {
                url: "/wastegasdectction/exportExcel",
                withColumnCfgParam: true
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
