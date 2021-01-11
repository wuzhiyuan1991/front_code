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
    LIB.registerDataDic("irf_wastegas_equi_record_run_flag", [
        ["0", "否"],
        ["1", "是"]
    ]);

    var initDataModel = function () {
        return {
            moduleCode: "sEgas",
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
                    url: "wastegasequirecord/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,

                        {
                            //点位
                            title: "点位",
                            fieldName: "point",
                            filterType: "text"
                        },
                        {
                            //设备名称
                            title: "设备名称",
                            fieldName: "name",
                            filterType: "text"
                        },
                        {
                            //开始时间
                            title: "开始时间",
                            fieldName: "startDate",
                            filterType: "date"
                            //						fieldType: "custom",
                            //						render: function (data) {
                            //							return LIB.formatYMD(data.startDate);
                            //						}
                        },
                        {
                            //关闭时间
                            title: "关闭时间",
                            fieldName: "closeDate",
                            filterType: "date"
                            //						fieldType: "custom",
                            //						render: function (data) {
                            //							return LIB.formatYMD(data.closeDate);
                            //						}
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
                            //是否运行 1:是,0:否
                            title: "是否运行",
                            fieldName: "runFlag",
                            orderName: "runFlag",
                            filterName: "criteria.intsValue.runFlag",
                            filterType: "enum",
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("irf_wastegas_equi_record_run_flag"),
                            render: function (data) {
                                return LIB.getDataDic("irf_wastegas_equi_record_run_flag", data.runFlag);
                            }
                        },
                        {
                            title: "情况描述",
                           
                            fieldName: "description",
                            filterType: "text"
                        },
                        {
                            //填报人
                            title: "填报人",
                            fieldName: "reporter",
                            filterType: "text"
                        },
                        {
                            //操作人
                            title: "操作人",
                            fieldName: "operator",
                            filterType: "text"
                        },
                        LIB.tableMgr.column.remark,
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
                url: "/wastegasequirecord/importExcel",
                templeteUrl: "/wastegasequirecord/importExcelTpl/down",
                importProgressShow: false
            },
            exportModel: {
                url: "/wastegasequirecord/exportExcel",
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
