define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
   var detailPanel2 = require("./detail");
    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("./detail-xl");
    var trainAgainFormModal = require("./dialog/trainAgainFormModal");

    require("componentsEx/selectTableModal/examPaperSelectModal");


    var filterDateArray = [
        {
            id: '1',
            name: '等待复培中'
        },
        {
            id: '2',
            name: '近1个月'
        },
        {
            id: '3',
            name: '近2个月'
        },
        {
            id: '4',
            name: '近3个月'
        },
        {
            id: '5',
            name: '近6个月'
        },
        {
            id: '6',
            name: '近1年'
        },
        {
            id: '7',
            name: '自定义'
        }
    ];

    var initDataModel = function () {
        return {
            moduleCode: "retrain",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "traintask/retrainlist{/curPage}{/pageSize}",
                    isSingleCheck: false,
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                        },
                        {
                            //唯一标识
                            title: "编码",
                            fieldName: "code",
                            fieldType: "link",
                            filterType: "text",
                            width: 160
                        },
                        {
                            //用户
                            title: "用户",
                            fieldName: "user.name",
                            filterType: "text",
                            orderName: "userId",
                            width: 240
                        },
                        {
                            //课程
                            title: "课程",
                            fieldName: "course.name",
                            filterType: "text",
                            orderName: "courseId",
                            width: 240
                        },
                        {
                            //title : "任务类型",
                            title: "任务类型",
                            fieldType: "custom",
                            render: function (data) {
                                return LIB.getDataDic("train_task_type", data.source);
                            },
                            filterType: "enum",
                            filterName: "criteria.intsValue.source",
                            orderName: "source",
                            popFilterEnum: LIB.getDataDicList("train_task_type"),
                            width: 120
                        },
                        {
                            //title : "培训方式",
                            title: this.$t("bd.trm.trainingMode"),
                            fieldType: "custom",
                            render: function (data) {
                                return LIB.getDataDic("course_type", _.propertyOf(data.course)("type"));
                            },
                            filterType: "enum",
                            filterName: "criteria.intsValue.type",
                            orderName: "course.type",
                            popFilterEnum: LIB.getDataDicList("course_type"),
                            width: 120
                        },
                        {
                            title: "培训开始时间",
                            fieldName: "startTime",
                            filterType: "date",
                            filterName: "startTime",
                            width: 180
                        },
                        {
                            title: "培训结束时间",
                            fieldName: "endTime",
                            filterType: "date",
                            filterName: "endTime",
                            width: 180
                        },
                        {
                            //复培时间 通过时间加上课程复培周期
                            title: "下次复培开始时间",
                            fieldName: "expiredDate",
                            filterType: "date",
                            render: function (data) {
                                if (data.status == 3 || (data.status == 2 && data.source == 1 && data.matrix && data.matrix.frequence > 0)) {
                                    return data.expiredDate;
                                }
                            },
                        },
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,

                    ],
                    defaultFilterValue: { "criteria.orderValue": { fieldName: "endTime", orderType: "1" } }
                }
            ),
            detailModel: {
                show: false,
                id: null
            },
            detailModel2: {
                show: false
            },
            uploadModel: {
                url: "/traintask/importExcel"
            },
            exportModel: {
                url: "/traintask/exportExcel/retrain",
                withColumnCfgParam: true
            },
            trainAgainModel: {
                visible: false
            },
            filterModel: {
                checkedExpiredDateId: '',
                filterDateArray: filterDateArray,
                beginDate: null,
                endDate: null
            }
        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
            "detailPanel2": detailPanel2,
            "trainAgainFormModal": trainAgainFormModal
        },
        methods: {

            initFilterBoxData: function () {
                this.filterModel.checkedExpiredDateId = '';
                this.filterModel.beginDate = null;
                this.filterModel.endDate = null;
            },
            doChangeExpiredDateFilter: function (id) {
                var now = new Date();
                this.filterModel.checkedExpiredDateId = id;
                if (id === '1' || id === '7') {
                    this.filterModel.beginDate = '';
                    this.filterModel.endDate = now.Format("yyyy-MM-dd 00:00:00");
                    return;
                }

                var monthMap = {
                    '2': 1,
                    '3': 2,
                    '4': 3,
                    '5': 6,
                    '6': 12
                };
                var monthNum = monthMap[id] || 1;
                this.filterModel.beginDate = now.Format("yyyy-MM-dd 00:00:00");
                this.filterModel.endDate = (new Date(now.setMonth(now.getMonth() + monthNum))).Format("yyyy-MM-dd 23:59:59");
            },
            doFilterFromBox: function () {

                if (!this.filterModel.beginDate && !this.filterModel.endDate) {
                    return LIB.Msg.warning("请选择时间段");
                }
                // if ()
                // 模拟表格过滤
                var params = {
                    value : {
                        columnFilterName : "criteria.dateValue",
                        columnName: "expiredDate",
                        columnFilterValue : {startExpiredDate: this.filterModel.beginDate, endExpiredDate: this.filterModel.endDate}
                    },
                    type : "save"
                };
                var displayMap = {
                    displayTitle: '',
                    displayValue: '近一个月',
                    columnFilterName: "expiredDate",
                    columnFilterValue: 1
                };

                displayMap.displayValue = _.find(filterDateArray, "id", this.filterModel.checkedExpiredDateId).name;
                if (this.filterModel.checkedExpiredDateId === '7') {
                    displayMap.displayValue = this.filterModel.beginDate ? (this.filterModel.beginDate + " ~ " + this.filterModel.endDate) : ("截止 " + this.filterModel.endDate);
                }

                this.doAddDisplayFilterValue(displayMap);

                this.$refs.mainTable.doQueryByFilter(params);
                this.doFilterBoxClose();
            },
            doFilterBoxClose: function () {
                this.$refs.filterBox.handleClose();
            },

            doRetrainPlan: function () {
                var rows = this.tableModel.selectedDatas;
                if (_.isEmpty(rows)) {
                    this.trainAgainModel.visible = true;
                    this.$refs.trainModal.init();
                    return;
                }
                var courseIds = _.uniq(_.pluck(rows, "courseId"));
                if (courseIds.length > 1) {
                    return LIB.Msg.error("不能同时对多门课程下达复培计划")
                }

                var param = _.map(rows, function (item) {
                    return {
                        compId: item.compId,
                        orgId: item.orgId,
                        userId: item.user.id,
                        userName: item.user.name,
                        course: item.course
                    }
                });

                this.trainAgainModel.visible = true;
                this.$refs.trainModal.init(param);
            },
            doSaveRetrainPlan: function () {
                this.trainAgainModel.visible = false;
                this.refreshMainTable();
            },
            doSetAutoRemind: function () {
                this.detailModel2.show = true;
                this.$broadcast("ev_dtReload2");
            },
            showDetail: function(row, opts) {
                this.detailModel2.show = false;
                var opType = (opts && opts.opType) ? opts.opType : "view";
                //this.$broadcast('ev_dtReload', "view", row.id);
                this.$broadcast('ev_dtReload', opType, row.id, row, opts);
                this.detailModel.show = true;
            },
        },
        events: {
            "ev_dtClose2": function () {
                this.detailModel2.show = false;
            }
        },
        ready: function () {
            if (!!window.isClickTrainingTaskExecutBtn) {
                this.detailModel.show = true;
                this.$broadcast('ev_dtReload', null, this.detailModel.id);
                window.isClickTrainingTaskExecutBtn = false;
            }
        },
        route: {
            activate: function (transition) {
                var queryObj = transition.to.query;
                if (queryObj.id && queryObj.method == "detail") {
                    this.detailModel.id = queryObj.id;
                }
                transition.next();
            }
        },
        init: function(){
            this.$api = api;
        }
    });

    return vm;
});
