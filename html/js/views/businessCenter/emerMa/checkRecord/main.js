define(function (require) {
    //基础js
    var LIB = require('lib');
    var apiPlan = require("./vuex/api-plan");
    var apiNotPlan = require("./vuex/api-notplan");
    //右侧滑出详细页
    var editComponent = require("./detail-plan");
    var notPlanDetailComponent = require("./detail-random");
    //Vue数据模型
    var dataModel = function () {
        return {
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "checktaskgroup/list{/curPage}{/pageSize}?type=1",
                    planRecordUrl: "checktaskgroup/list{/curPage}{/pageSize}?type=1",
                    notPlanRecordUrl: "checkrecord/list{/curPage}{/pageSize}?type=0",
                    selectedDatas: [],
                    columns:[
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                    //    {
                    //         //title : "编码",
                    //         title: this.$t("gb.common.code"),
                    //         fieldName: "code",
                    //         width: 200,
                    //         orderName: "code",
                    //         fieldType: "link",
                    //         filterType: "text"
                    //     },
                        {
                            title: "检查任务",
                            filterType: "text",
                            fieldName:"groupName",
                            render: function (data) {
                                return data.groupName + "#" + data.num;
                            },
                            width: 240
                        },
                        {
                            title: "检查对象",
                            filterType: "text",
                            filterName: "criteria.strValue.checkObjName",
                            sortable :false,
                            render: function (data) {
                                if (data.checkPlan) {
                                    return _.pluck(data.checkPlan.checkObjectTableBeans, 'checkObjName').join(', ')
                                }
                            },
                            width: 240
                        },
                        {
                            title: this.$t("gb.common.check"),
                            filterType: "text",
                            filterName: "criteria.strValue.checkTableName",
                            sortable :false,
                            render: function (data) {
                                if (data.checkPlan) {
                                    return _.pluck(data.checkPlan.checkObjectTableBeans, 'checkTableName').join(', ')
                                }
                            },
                            width: 240
                        },
                        {
                            title: this.$t("gb.common.checkUser"),
                            orderName: "checkerId",
                            fieldName: "checkUser.username",
                            filterType: "text",
                            filterName: "criteria.strValue.checkUserName",
                            width: 120
                        },
                        {
                            title: this.$t("gb.common.state") + '(' + this.$t("hag.hazv.qualify") + '/' + this.$t("hag.hazv.unqualify") + ')',
                            width: 200,
                            fieldName: "checkResultDetail",
                            //filterType: "text",
                        },
                        {
                            title: this.$t("bd.ria.result"),
                            //orderName: "checkResult",
                            sortable :false,
                            fieldName: "checkResult",
                            filterType: "enum",
                            filterName: "criteria.strsValue.checkResult",
                            popFilterEnum: LIB.getDataDicList("checkResult"),
                            render: function (data) {
                                return LIB.getDataDic("checkResult", data.checkResult);
                            },
                            width: 100
                        },
                        {
                            //开始时间
                            title: this.$t("gb.common.startTime"),
                            fieldName: "startDate",
                            filterType: "date",
                            width: 180
                        },
                        {
                            //结束时间
                            title: this.$t("gb.common.endTime"),
                            fieldName: "endDate",
                            filterType: "date",
                            width: 180
                        }
                    ],
                    planRecordColumns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                            fixed:true,
                        },
                        LIB.Opts.codeHandle({
                            //title : "编码",
                            title: this.$t("gb.common.code"),
                            fieldName: "code",
                            width: 200,
                            orderName: "code",
                            fieldType: "link",
                            filterType: "text"
                        }),
                        {
                            title: "检查任务",
                            filterType: "text",
                            fieldName:"groupName",
                            render: function (data) {
                                return data.groupName + "#" + data.num;
                            },
                            width: 240
                        },
                        {
                            title: "检查对象",
                            filterType: "text",
                            filterName: "criteria.strValue.checkObjName",
                            sortable :false,
                            render: function (data) {
                                if (data.checkPlan) {
                                    return _.pluck(data.checkPlan.checkObjectTableBeans, 'checkObjName').join(', ')
                                }
                            },
                            width: 240
                        },
                        {
                            title: this.$t("gb.common.check"),
                            filterType: "text",
                            filterName: "criteria.strValue.checkTableName",
                            sortable :false,
                            render: function (data) {
                                if (data.checkPlan) {
                                    return _.pluck(data.checkPlan.checkObjectTableBeans, 'checkTableName').join(', ')
                                }
                            },
                            width: 240
                        },
                        {
                            title: this.$t("gb.common.checkUser"),
                            orderName: "checkerId",
                            fieldName: "checkUser.username",
                            filterType: "text",
                            filterName: "criteria.strValue.checkUserName",
                            width: 120
                        },
                        {
                            title: this.$t("gb.common.state") + '(' + this.$t("hag.hazv.qualify") + '/' + this.$t("hag.hazv.unqualify") + ')',
                            width: 200,
                            fieldName: "checkResultDetail",
                            //filterType: "text",
                        },
                        {
                            title: this.$t("bd.ria.result"),
                            //orderName: "checkResult",
                            sortable :false,
                            fieldName: "checkResult",
                            filterType: "enum",
                            filterName: "criteria.strsValue.checkResult",
                            popFilterEnum: LIB.getDataDicList("checkResult"),
                            render: function (data) {
                                return LIB.getDataDic("checkResult", data.checkResult);
                            },
                            width: 100
                        },
                        {
                            //开始时间
                            title: this.$t("gb.common.startTime"),
                            fieldName: "startDate",
                            filterType: "date",
                            width: 180
                        },
                        {
                            //结束时间
                            title: this.$t("gb.common.endTime"),
                            fieldName: "endDate",
                            filterType: "date",
                            width: 180
                        }
                    ],
                    notPlanRecordColumns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                            fixed:true,

                        },LIB.Opts.codeHandle({
                            //title : "编码",
                            title: this.$t("gb.common.code"),
                            fieldName: "code",
                            width: 200,
                            orderName: "code",
                            fieldType: "link",
                            filterType: "text"
                        }), {
                            title: this.$t("gb.common.checkUser"),
                            orderName: "user.username",
                            fieldName: "checkUser.username",
                            filterType: "text",
                            filterName: "criteria.strValue.username",
                            width: 120
                        },
                        {
                            title: this.$t("gb.common.checkTime"),
                            fieldName: "checkDate",
                            filterType: "date",
                            width: 180
                        },  {
                            title: this.$t("gb.common.CheckTableName"),
                            fieldName: "checkTable.name",
                            filterType: "text",
                            orderName: "checktable.name",
                            filterName: "criteria.strValue.checktableName",
                            width: 200
                        },
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        {
                            title: this.$t("bc.hal.source"),
                            orderName: "checkSource",
                            fieldName: "checkSource",
                            render: function (data) {
                                return LIB.getDataDic("checkSource", data.checkSource);
                            },
                            popFilterEnum: LIB.getDataDicList("checkSource"),
                            filterType: "enum",
                            filterName: "criteria.strsValue.checkSource",
                            width: 150
                        }, {
                            title: this.$t("gb.common.state") + '(' + this.$t("hag.hazv.qualify") + '/' + this.$t("hag.hazv.unqualify") + ')',
                            width: 200,
                            fieldName: "checkResultDetail",
                            filterType: "text",
                        }, {
                            title: this.$t("bd.ria.result"),
                            orderName: "checkResult",
                            fieldName: "checkResult",
                            filterType: "enum",
                            filterName: "criteria.strsValue.checkResult",
                            popFilterEnum: LIB.getDataDicList("checkResult"),
                            render: function (data) {
                                return LIB.getDataDic("checkResult", data.checkResult);
                            },
                            width: 100
                        },
                        {
                            title: '检查开始时间',
                            fieldName: "checkBeginDate",
                            filterType: "date",
                            width: 180
                        }, {
                            title: '检查结束时间',
                            fieldName: "checkEndDate",
                            filterType: "date",
                            width: 180
                        }
                    ],
                    defaultFilterValue: { "criteria.intsValue.status": [2,3], "criteria.intValue" : {isEmer: 1} }
                }
            ),
            //控制全部分类组件显示
            mainModel: {
                //显示分类
                showCategory: false,
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: []
            },
            detailModel: {
                //控制右侧滑出组件显示
                show: false
            },
            detailNotPlanModel: {
                //控制右侧滑出组件显示
                show: false
            },
            exportModel: {
                url: "/checktaskgroup/exportExcel",
                singleUrl: "/checktaskgroup/{id}/exportPdf"
            },
            planExportUrl: {
                url: "/checktaskgroup/exportExcel",
                singleUrl: "/checktaskgroup/{id}/exportPdf"
            },
            notPlanExportUrl: {
                url: "/checkrecord/exportExcel",
                singleUrl: "/checkrecord/{id}/exportExcel"
            },
            id: null,
            recordType: null
        }
    };


    //使用Vue方式，对页面进行事件和数据绑定
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *    el
     template
     components
     componentName
     props
     data
     computed
     watch
     methods
     events
     vue组件声明周期方法
     created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var tpl = LIB.renderHTML(require("text!./main.html"));
    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: dataModel,
        components: {
            "editcomponent": editComponent,
            "notplandetailcomponent": notPlanDetailComponent
        },
        watch: {
          'recordType': function(val) {
                if(val == '1') {
                    this.$api = apiPlan;
                    this.$refs.mainTable.url = this.tableModel.planRecordUrl;
                    this.$refs.mainTable.columns = this.tableModel.planRecordColumns;
                    this.$refs.mainTable.refreshColumns();
                    this.exportModel.url = this.planExportUrl.url;
                    this.exportModel.singleUrl = this.planExportUrl.singleUrl;
                }else if(val == '0') {
                    this.$api = apiNotPlan;
                    this.$refs.mainTable.url = this.tableModel.notPlanRecordUrl;
                    this.$refs.mainTable.columns = this.tableModel.notPlanRecordColumns;
                    this.$refs.mainTable.refreshColumns();
                    this.exportModel.url = this.notPlanExportUrl.url;
                    this.exportModel.singleUrl = this.notPlanExportUrl.singleUrl;
                }
          }
        },
        methods: {
            doChangeType: function(type) {
              this.recordType = type;
            },
            showDetail: function(row, opts) {
                var opType = (opts && opts.opType) ? opts.opType : "view";
                if(this.recordType == '1') {
                    this.detailNotPlanModel.show = false;
                    this.detailModel.show = true;
                    this.$broadcast('ev_dtPlanReload', opType, row.id, row, opts);
                }else if(this.recordType == '0') {
                    this.detailModel.show = false;
                    this.detailNotPlanModel.show = true;
                    this.$broadcast('ev_dtRandomReload', opType, row.id, row, opts);
                }
            },
            doCategoryChange: function (obj) {
            },
            //显示全部分类
            doShowCategory: function () {
                this.mainModel.showCategory = !this.mainModel.showCategory;
            }
        },
        events: {
            'ev_dtPlanClose': function() {
                this.detailModel.show = false;
            },
            'ev_dtRandomClose': function() {
                this.detailNotPlanModel.show = false;
            }
        },
        ready: function() {
          this.recordType = '1';
        },
        init: function () {
            this.$api = apiPlan;
        },
        route: {
            activate: function (transition) {

                var queryObj = transition.to.query;
                if (queryObj.method) {
                    if (queryObj.checkTaskId && queryObj.method === "check") {

                        //TODO 以后改成用vuex做,暂时的解决方案
                        if (!!window.isClickCheckTaskExecutBtn) {
                            this.$broadcast('ev_dtReload', "check", queryObj.checkTaskId);
                            window.isClickCheckTaskExecutBtn = false;
                            this.detailModel.show = true;
                        }

                    } else if (queryObj.id && queryObj.method === "detail") {
                        this.detailModel.show = true;
                        this.$broadcast('ev_detailReload', null, queryObj.id);
                    }
                }
                transition.next();
            }
        }
    });


    return vm;
});