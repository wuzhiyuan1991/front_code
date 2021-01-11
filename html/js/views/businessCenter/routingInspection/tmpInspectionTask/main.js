define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    var detailPanel = require("./detail-xl");
    //委托弹框页面
    var delegateSingleComponent = require("./dialog/delegateSingle");
    //批量委托弹框页面
    var delegateBatchComponent = require("./dialog/delegateBatch");

    var initDataModel = function () {
        return {
            moduleCode: "ritmpchecktask",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "large-info-aside",
                showTempSetting: true
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "ritmpchecktaskgroup/list/{curPage}/{pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb"
                        },
                        {
                            //
                            title: this.$t("gb.common.code"),
                            fieldName: "code",
                            fieldType: "link",
                            filterType: "text",
                            width: 180
                        },
                        {
                            title: "临时工作任务",
                            filterType: "text",
                            fieldName:"groupName",
                            render: function (data) {
                                return data.groupName + "#" + data.num;
                            },
                            width: 240
                        },
                        {
                            //开始时间
                            title: '任务开始时间',
                            fieldName: "startDate",
                            filterType: "date",
                            width: 180
                        },
                        {
                            //结束时间
                            title: '任务结束时间',
                            fieldName: "endDate",
                            filterType: "date",
                            width: 180
                        },
                        // {
                        //     title: this.$t("gb.common.check"),
                        //     filterType: "text",
                        //     fieldType: "custom",
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
                        //     title: "检查对象",
                        //     filterType: "text",
                        //     fieldType: "custom",
                        //     filterName: "criteria.strValue.checkObjName",
                        //     sortable :false,
                        //     render: function (data) {
                        //         if (data.checkPlan) {
                        //             return _.pluck(data.checkPlan.checkObjectTableBeans, 'checkObjName').join(', ')
                        //         }
                        //     },
                        //     width: 240
                        // },
                        LIB.tableMgr.column.company,
                        {
                            //检查人
                            title: "任务执行人",
                            fieldName: "checkUser.name",
                            orderName: "checkerId",
                            filterType: "text",
                            filterName: "criteria.strValue.checkUserName",
                            width: 150
                        },
                        {
                            //任务状态 默认0未到期 1待执行 2按期执行 3超期执行 4未执行
                            title: this.$t("gb.common.state"),
                            fieldName:"status",
                            fieldType: "custom",
                            orderName: "status",
                            filterType: "enum",
                            render: function (data) {
                                return LIB.getDataDic("task_group_status", data.status);
                            },
                            filterName: "criteria.intsValue.status",
                            popFilterEnum: LIB.getDataDicList("task_group_status"),
                            width: 100
                        }
                    ],
                    defaultFilterValue: {"criteria.orderValue": {fieldName: "modify_date",orderType: "1"},"orgId" : LIB.user.orgId}
                }
            ),
            detailModel: {
                show: false
            },
            delegateSingleModel: {
                title: "委托",
                //显示编辑弹框
                show: false,
                id: null
            },
            delegateBatchModel: {
                visible: false
            },
            uploadModel: {
                url: "/checkTask/importExcel"
            },
            exportModel: {
                url: "/checkTask/exportExcel"
            },
            isLateCheckAllowed: false,
            isLateWorkPlanExecute: false,
            isLatePollingPlanExecute: false,
            showPlanType: false
        };
    };

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
            "delegate-single-component": delegateSingleComponent,
            "delegate-batch-component": delegateBatchComponent
        },
        methods: {
            doTableCellClick: function () {

            },
        	doSingleDelegate: function () {
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("此处无法批量委托");
                    return;
                }
                var row = rows[0];
                if(row.checkerId != LIB.user.id) {
                	LIB.Msg.warning("只能委托自己的任务");
                    return;
                }
                if(row.status != 0 && row.status != 1 &&  row.status != 4) {
                	LIB.Msg.warning("只能委派【未到期】、【待执行】、【未执行】的任务");
                    return;
                }
                this.delegateSingleModel.id = row.id;
                this.delegateSingleModel.show = true;
            },
            doMultipleDelegate: function () {
                this.delegateBatchModel.visible = true;
            },
            doCloseDelegateModel: function () {
                this.delegateSingleModel.id = null;
            },
            doMakeCheckRecord: function (row) {
                var _this = this;
                var deleteIds = _.map(this.tableModel.selectedDatas, function (row) {
                    return row.id;
                });
                if (deleteIds.length > 1) {
                    LIB.Msg.warning("无法批量执行");
                    return;
                }
                var row = this.tableModel.selectedDatas[0];
                if(row.checkerId != LIB.user.id) {
                	LIB.Msg.warning("只能执行自己的任务");
                    return;
                }
                if (row.status === '0') {
                    LIB.Msg.warning("当前任务未到时间，无法执行!");
                    return false;
                }
                if (row.status === '5') {
                    LIB.Msg.warning("当前任务已失效，无法再次执行!");
                    return false;
                }
                if (row.status === '3') {
                    LIB.Msg.warning("当前任务已完成，无法再次执行!");
                    return false;
                }
                this.showPlanType = !!LIB.setting.fieldSetting["BC_Hal_InsP"];
                if (this.showPlanType) {
                    if (row.status === '4' && !this.isLateWorkPlanExecute && row.checkPlan.planType === '1') {
                        LIB.Msg.warning("当前任务已过期，无法执行!");
                        return false;
                    }
                    if (row.status === '4' && !this.isLatePollingPlanExecute && row.checkPlan.planType === '2') {
                        LIB.Msg.warning("当前任务已过期，无法执行!");
                        return false;
                    }
                } else {
                    if (row.status === '4' && !this.isLateCheckAllowed) {
                        LIB.Msg.warning("当前任务已过期，无法执行!");
                        return false;
                    }
                }
                if (deleteIds.length === 1) {

                    //TODO 以后改成用vuex做,暂时的解决方案
                    window.isClickCheckTaskExecutBtn = true;

                    var routerPart = "/routingInspection/businessCenter/tmpCheckRecord?method=check&checkTaskId=" + deleteIds[0];
                    this.$router.go(routerPart);
                }
            }
        },
        init: function () {
            this.$api = api;
        },
        ready: function () {
            var _this = this;
            if (!!window.isClickCheckTaskExecutBtn) {
                this.detailModel.show = true;
                this.$broadcast('ev_dtReload', null, this.detailModel.id);
                window.isClickCheckTaskExecutBtn = false;
            }
            api.getCheckTaskConfig().then(function (res) {
                if (res.data.result === '2') {
                    _this.isLateCheckAllowed = true;
                } else {
                    _this.isLateCheckAllowed = false;
                }

            })
            /*api.getEnvconfig({type: "BUSINESS_SET"}).then(function (res) {
                if (res.body !== 'E30000' && res.body.checkTaskSet) {
                    _this.isLateCheckAllowed = !!res.body.checkTaskSet.isLateCheckAllowed;
                    _this.isLateWorkPlanExecute = !!res.body.checkTaskSet.isLateWorkPlanExecute;
                    _this.isLatePollingPlanExecute = !!res.body.checkTaskSet.isLatePollingPlanExecute;
                }
            });*/
        },
        ready: function () {
            this.$refs.categorySelector.setDisplayTitle({type: "org", value: LIB.user.orgId});
            if (!LIB.user.compId) {
                this.mainModel.showTempSetting = false;
            }

            //首页跳转时根据首页对应搜索条件查询
            if (this.$route.query.method === "filterByUser") {
                var checkerColumn = {
                    title: "任务执行人id",
                    fieldName: "checkerId"
                };
                if (checkerColumn) {
                    this.$refs.mainTable.doOkActionInFilterPoptip(null, checkerColumn, LIB.user.id);
                }

                var statusColumn = _.find(this.tableModel.columns, function (item) {
                    return item.fieldName === "status";
                });
                if(!!statusColumn && !!this.$route.query.state) {
                    if(this.$route.query.state == 1) {
                        this.$refs.mainTable.doOkActionInFilterPoptip(null, statusColumn, ['1', '2', '4']);
                    }else if(this.$route.query.state == 2) {
                        this.$refs.mainTable.doOkActionInFilterPoptip(null, statusColumn, ['0']);
                    }
                }
            }
        },
        events: {
            "ev_single_delegate": function () {
                //重新加载数据
                this.emitMainTableEvent("do_update_row_data", {opType: "add"});
                this.delegateSingleModel.show = false;
            },
        },
        route: {
            activate: function (transition) {
                var queryObj = transition.to.query;
                if (queryObj.id && queryObj.method === "detail" && queryObj.opt === "isClickCheckTaskExecutBtn") {
                    this.detailModel.id = queryObj.id;
                }
                transition.next();
            }
        }
    });

    return vm;
});
