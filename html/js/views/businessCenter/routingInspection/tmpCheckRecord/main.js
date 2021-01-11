define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var editComponent = require("./detail-xl");
    //导入
    var importProgress = require("componentsEx/importProgress/main");
    //Vue数据模型
    var dataModel = function () {
        return {
            moduleCode: "ritmpCheckRecord",
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "ritmpcheckrecord/list{/curPage}{/pageSize}?type=1",
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
                            width: 200,
                            orderName: "code",
                            fieldType: "link",
                            filterType: "text"
                        },
                        {
                            title: "临时工作任务",
                            filterType: "text",
                            fieldName:"groupName",
                            orderName: "checkTaskId",
                            filterName: "criteria.strValue.ritmpCheckTaskName",
                            render: function (data) {
                                if (data.checkPlan && data.checkTask) {
                                    return data.checkPlan.name + "#" + data.checkTask.num;
                                }
                            },
                            width: 240
                        },
                        {
                            //开始时间
                            title: '任务开始时间',
                            fieldName: "checkTask.startDate",
                            filterName: "checkTaskStartDate",
                            filterType: "date",
                            width: 180
                        },
                        {
                            //结束时间
                            title: '任务结束时间',
                            fieldName: "checkTask.endDate",
                            filterName: "checkTaskTaskEndDate",
                            filterType: "date",
                            width: 180
                        },
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        {
                            //开始时间
                            title: '检查开始时间',
                            fieldName: "checkBeginDate",
                            filterType: "date",
                            width: 180
                        },
                        {
                            //结束时间
                            title: '检查结束时间',
                            fieldName: "checkEndDate",
                            filterType: "date",
                            width: 180
                        },
                        // {
                        //     title: "检查对象",
                        //     filterType: "text",
                        //     filterName: "criteria.strValue.checkObjName",
                        //     sortable :false,
                        //     render: function (data) {
                        //         if (data.checkPlan) {
                        //             return _.pluck(data.checkPlan.checkObjectTableBeans, 'checkObjName').join(', ')
                        //         }
                        //     },
                        //     width: 240
                        // },
                        // {
                        //     title: this.$t("gb.common.check"),
                        //     filterType: "text",
                        //     filterName: "criteria.strValue.checkTableName",
                        //     sortable :false,
                        //     render: function (data) {
                        //         if (data.checkPlan) {
                        //             return _.pluck(data.checkPlan.checkObjectTableBeans, 'checkTableName').join(', ')
                        //         }
                        //     },
                        //     width: 240
                        // },
                        // {
                        //     title: this.$t("gb.common.checkUser"),
                        //     orderName: "checkerId",
                        //     fieldName: "checkUser.username",
                        //     filterType: "text",
                        //     filterName: "criteria.strValue.checkUserName",
                        //     width: 120
                        // },

                    ],
                    defaultFilterValue : {"orgId" : LIB.user.orgId}
                    // defaultFilterValue: { "criteria.intsValue.status": [2,3] }
                }
            ),
            //控制全部分类组件显示
            mainModel: {
                //显示分类
                showCategory: false,
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                showTempSetting: true
            },
            detailModel: {
                //控制右侧滑出组件显示
                show: false
            },
            exportModel: {
                url: "/checktaskgroup/exportExcel",
                singleUrl: "/checktaskgroup/{id}/exportPdf"
            },
            id: null,
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
            "editcomponent": editComponent
        },
        methods: {
            doCategoryChange: function (obj) {
            },
            //显示全部分类
            doShowCategory: function () {
                this.mainModel.showCategory = !this.mainModel.showCategory;
            },
            //导出pdf
            doExportPdf: function () {
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量操作数据");
                    return;
                }
                window.open(this.exportModel.singleUrl.replace("\{id\}", rows[0].id));

            },
        },
        events: {},
        ready: function () {
            this.$refs.categorySelector.setDisplayTitle({type: "org", value: LIB.user.orgId});
            if (!LIB.user.compId) {
                this.mainModel.showTempSetting = false;
            }
        },
        init: function () {
            this.$api = api;
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