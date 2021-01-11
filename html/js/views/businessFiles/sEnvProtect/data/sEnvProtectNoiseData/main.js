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

    LIB.registerDataDic("irf_noise_detection_day_nig", [
        ["1", "夜"],
        ["0", "昼"]
    ]);
    var initDataModel = function () {
        return {
            moduleCode: "sEdnoise",
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
                    url: "noisedectction/list{/curPage}{/pageSize} ",
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
                            //昼夜 1:夜,0:昼
                            title: "昼夜",
                            fieldName: "dayNig",
                            orderName: "dayNig",
                            filterName: "criteria.intsValue.dayNig",
                            filterType: "enum",
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("irf_noise_detection_day_nig"),
                            render: function (data) {
                                return LIB.getDataDic("irf_noise_detection_day_nig", data.dayNig);
                            }
                        },
                        {
                            title: "检测结果，dB（A)",
                            width: 200,
                            fieldName: "result",
                            filterType: "text"
                        },
                        // {
                        //     title: "排放方式",
                        //     fieldName: "pubType",
                        //     filterType: "text"
                        // },
                        // {
                        //     title: "排放浓度 mg/m3",
                        //     fieldName: "pubDens",
                        //     filterType: "text"
                        // },
                        // {
                        //     title: "排放速度 kg/h",
                        //     fieldName: "pubRate",
                        //     filterType: "text"
                        // },
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
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
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
            importModel: {
                url: "/noisedectction/importExcel",
                templeteUrl: "/noisedectction/importExcelTpl/down",
                importProgressShow: false
            },
            exportModel: {
                url: "/noisedectction/exportExcel",
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
