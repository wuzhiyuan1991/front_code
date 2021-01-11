define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("./detail-xl");
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");
    var previewModal = require("./dialog/preview");
    //var sumMixin = require("../mixin/sumMixin");

    LIB.registerDataDic("jse_op_task_disable", [
        ["1", "未发布"],
        ["0", "待执行"],
        ["2", "已执行"],
    ]);


    var initDataModel = function () {
        return {
            moduleCode: "opTaskException",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                // detailPanelClass : "middle-info-aside"
                detailPanelClass: "large-info-aside",
                showTempSetting: true,
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "optaskexception/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            title: "操作任务名称",
                            fieldName: "name",
                            filterType: "text",
                            width: 250
                        },
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        //{
                        //    //任务状态
                        //    title: "任务状态",
                        //    fieldName: "opTask.disable",
                        //    filterName: "criteria.intsValue.opTaskDisable",
                        //    filterType: "enum",
                        //    fieldType: "custom",
                        //    popFilterEnum: LIB.getDataDicList("jse_op_task_disable"),
                        //    render: function (data) {
                        //        if(data.opTask) {
                        //            return LIB.getDataDic("jse_op_task_disable", data.opTask.disable);
                        //        }
                        //    }
                        //},
                        {
                            //操作人
                            title: "操作人",
                            fieldName: "operators",
                            filterName: "criteria.strValue.operators",
                            fieldType: "custom",
                            filterType: "text",
                            render: function (data) {
                                if(data && data.operators){
                                    return _.map(data.operators, _.iteratee('name'));
                                }
                                return "";
                            }
                        },
                        {
                            //监护人
                            title: "监护人",
                            fieldName: "operators",
                            filterName: "criteria.strValue.supervisors",
                            fieldType: "custom",
                            filterType: "text",
                            render: function (data) {
                                if(data && data.supervisors){
                                    return _.map(data.supervisors, _.iteratee('name'));
                                }
                                return "";
                            }
                        },
                        {
                            //审核人
                            title: "审核人",
                            fieldName: "auditors",
                            filterName: "criteria.strValue.auditors",
                            fieldType: "custom",
                            filterType: "text",
                            render: function (data) {
                                if(data && data.auditors){
                                    return _.map(data.auditors, _.iteratee('name'));
                                }
                                return "";
                            }
                        },
                        {
                            //审核人
                            title: "操作时间",
                            fieldName: "publishTime",
                            filterType: "date",
                        },
                        {
                            //异常理由
                            title: "异常原因",
                            fieldName: "opTaskException.reason",
                            filterName: "criteria.strValue.opTaskExceptionReason",
                            filterType: "text"
                        },
                    ],
                    defaultFilterValue : {"orgId" : LIB.user.orgId}
                }
            ),
            detailModel: {
                show: false
            },
            exportModel: {
                url: "/opstdcard/exportExcel",
                withColumnCfgParam: true
            },
            previewModel: {
                visible: false,
                id: ''
            },
        };
    };

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
            "previewModal": previewModal
        },
        methods: {
            doPreview: function (id) {
                var _id = id || _.get(this.tableModel.selectedDatas, '[0].opTask.id');
                this.previewModel.id= _id;
                this.previewModel.visible = true;
            },
            showDetail: function(row, opts) {
                var opType = (opts && opts.opType) ? opts.opType : "view";
                this.$broadcast('ev_dtReload', opType, row.id, row, opts);
                this.detailModel.show = true;
            },
        },
        events: {
        },
        init: function () {
            this.$api = api;
        },
    });

    return vm;
});
