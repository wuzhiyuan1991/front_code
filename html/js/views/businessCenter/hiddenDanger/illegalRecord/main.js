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
            moduleCode: "illegalRecord",
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "checktask/illegal/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb"
                        },
                        {
                            title: "检查任务",
                            filterType: "text",
                            fieldName:"taskName",
                            filterName: "criteria.strValue.taskName",
                            render: function (data) {
                                return data.taskName;
                            },
                            width: 240
                        },
                        {
                            title: this.$t("gb.common.check"),
                            filterType: "text",
                            filterName: "criteria.strValue.checkTableName",
                            sortable :false,
                            render: function (data) {
                                if (data.checkObjectTableBean) {
                                    return data.checkObjectTableBean.checkTableName;
                                }
                            },
                            width: 240
                        },
                        {
                            title: "检查对象",
                            filterType: "text",
                            filterName: "criteria.strValue.checkObjName",
                            sortable :false,
                            render: function (data) {
                                if (data.checkObjectTableBean) {
                                    return data.checkObjectTableBean.checkObjName;
                                }
                            },
                            width: 240
                        },
                        {
                            title: this.$t("gb.common.checkUser"),
                            orderName: "checkerId",
                            fieldName: "checkerNames",
                            filterType: "text",
                            filterName: "criteria.strValue.checkUserName",
                            width: 120
                        },
                        {
                            title: "检查开始时间",
                            fieldName: "checkRecord.checkBeginDate",
                            width: 180
                        },
                        {
                            title: "检查结束时间",
                            fieldName: "checkRecord.checkEndDate",
                            width: 180
                        },
                        {
                            title: "检查时长",
                            render: function (data) {
                                if (data.checkRecord && data.checkRecord.checkBeginDate && data.checkRecord.checkEndDate) {
                                    return LIB.calcDate(data.checkRecord.checkEndDate,data.checkRecord.checkBeginDate);
                                }
                                return "";
                            },
                            width: 100
                        },
                        {
                            title: "GPS偏移量(米)",
                            fieldName: "checkRecord.gpsOffset",
                            width: 150
                        },
                        {
                            title: "异常记录原因",
                            fieldName:"abnormalReason",
                            fieldType: "custom",
                            orderName: "abnormalReason",
                            filterType: "enum",
                            filterName: "criteria.intsValue.abnormalReason",
                            popFilterEnum: LIB.getDataDicList("task_illegal_status"),
                            width: 300,
                            render: function (data) {
                                var re = [];
                                if(data.checkRecord && data.checkRecord.abnormalReason){
                                    var res = data.checkRecord.abnormalReason.split(",");
                                    _.each(res,function (item) {
                                        re.push(LIB.getDataDic("task_illegal_status", item));
                                    })
                                }
                                return re.join(",");
                            },
                        },
                    ],
                    //defaultFilterValue: {"criteria.intsValue.isAbnormalDefault":[2]}
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
                show: false,
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
            initData: function () {

                this.mainModel.bizType = this.$route.query.bizType;

                var params = [];

                //大类型
                params.push({
                    value : {
                        columnFilterName : "bizType",
                        columnFilterValue : this.mainModel.bizType
                    },
                    type : "save"
                });

                this.$refs.mainTable.doQueryByFilter(params);

            }
        },
        events: {},
        init: function () {
            this.$api = api;
        },
        ready: function () {
            var _this = this;
            if(LIB.getBusinessSetByNamePath('common.enableCheckLevel').result === '2'){
                _this.tableModel.columns.push({
                    title: "检查级别",
                    fieldName: "checkLevel",
                    orderName: "checkLevel",
                    fieldType: "custom",
                    filterType: "enum",
                    filterName: "criteria.intsValue.checkLevel",
                    popFilterEnum : LIB.getDataDicList("checkLevel"),
                    render: function (data) {
                        return LIB.getDataDic("checkLevel",data.checkLevel);
                    },
                    width: 100
                });
            }
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