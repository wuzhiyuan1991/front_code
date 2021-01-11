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
            moduleCode: LIB.ModuleCode.BC_Hal_InsT,
            //控制全部分类组件显示
            mainModel: {
                isShowExcute: true,
                bizType: null,
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "large-info-aside",
                checkRecordRoutePath: null,
                bizType: "default"
            },
            tableModel: LIB.Opts.extendMainTableOpt({
                url: "checktaskgroup/list/{curPage}/{pageSize}",
                selectedDatas: [],
                columns: [{
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
                        title: "检查任务",
                        filterType: "text",
                        fieldName: "groupName",
                        render: function (data) {
                            return data.groupName + "#" + data.num;
                        },
                        width: 240
                    },
                    {
                        title: this.$t("gb.common.check"),
                        filterType: "text",
                        fieldType: "custom",
                        filterName: "criteria.strValue.checkTableName",
                        sortable: false,
                        render: function (data) {
                            if (data.checkPlan) {
                                var list = _.pluck(data.checkPlan.checkTables, 'name');
                                list = list.filter(function (item) {
                                    return item && item != '' && item != null && item != undefined
                                });
                                return list.join("，");
                            }
                        },
                        width: 240
                    },
                    {
                        title: "检查对象",
                        filterType: "text",
                        fieldType: "custom",
                        filterName: "criteria.strValue.checkObjName",
                        sortable: false,
                        render: function (data) {
                            if (data.checkPlan) {
                                var list = _.pluck(data.checkPlan.checkObjects, 'name');
                                list = _.union(list).join("，")
                                return list;
                            }
                        },
                        width: 240
                    },
                    {
                        //检查人
                        title: "检查人",
                        //fieldName: "checkUser.name",
                        orderName: "checkerId",
                        filterType: "text",
                        filterName: "criteria.strValue.checkUserName",
                        width: 100,
                        render: function (data) {
                            if (data.status === '2') {
                                if (data.checkerNames) {
                                    return data.checkerNames;
                                } else if (data.checkUser) {
                                    return data.checkUser.name;
                                }
                            } else {
                                if (data.checkUser) {
                                    return data.checkUser.name;
                                } else if (data.checkerNames) {
                                    return data.checkerNames;
                                }
                            }

                        },
                    },
                    {
                        //任务状态 默认0未到期 1待执行 2按期执行 3超期执行 4未执行
                        title: this.$t("gb.common.state"),
                        fieldName: "status",
                        fieldType: "custom",
                        orderName: "status",
                        filterType: "enum",
                        render: function (data) {
                            return LIB.getDataDic("task_group_status", data.status);
                        },
                        filterName: "criteria.intsValue.status",
                        popFilterEnum: LIB.getDataDicList("task_group_status"),
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
                    },
                    LIB.tableMgr.column.company,
                    LIB.tableMgr.column.dept,
                    /* {
                         //实际完成时间
                         title: "实际完成时间",
                         fieldName: "checkDate",
                         filterType: "date"
                     },
                     {
                         //是否禁用，0未发布，1发布
                         title: "是否禁用，0未发布，1发布",
                         fieldName: "disable",
                         filterType: "text"
                     },
                     {
                         //修改日期
                         title: "修改日期",
                         fieldName: "modifyDate",
                         filterType: "date"
                     },
                     {
                         //创建日期
                         title: "创建日期",
                         fieldName: "createDate",
                         filterType: "date"
                     },*/
                ],

                defaultFilterValue: {
                    "criteria.orderValue": {
                        fieldName: "start_date",
                        orderType: "1"
                    },
                    // checkerId: ''

                }
            }),
            detailModel: {
                show: false
            },
            delegateSingleModel: {
                title: "委托",
                //显示编辑弹框
                show: false,
                id: null,
                checkerIds: null,
                type: null
            },
            delegateBatchModel: {
                type: null,
                visible: false,
                checkerIds: null,
            },
            uploadModel: {
                url: "/checktaskgroup/importExcel"
            },
            exportModel: {
                url: "/checktaskgroup/exportExcel",
                withColumnCfgParam: true
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
        watch: {
            "tableModel.selectedDatas": function (val) {
                // if(val && val[0] && val[0].checkPlan && val[0].checkPlan.checkTables && val[0].checkPlan.checkTables.length>0){
                //     this.mainModel.isShowExcute = true;
                // }else
                if (val && val[0] && val[0].checkPlan && val[0].checkPlan.checkObjectTableBeans && val[0].checkPlan.checkObjectTableBeans.length == 0) {
                    this.mainModel.isShowExcute = false;
                } else if (val && val[0] && val[0].checkPlan && val[0].checkPlan.checkObjectTableBeans && val[0].checkPlan.checkObjectTableBeans.length == 1 && val[0].checkPlan.checkObjectTableBeans[0].checkObjType == '4') {
                    this.mainModel.isShowExcute = false;
                } else {
                    this.mainModel.isShowExcute = true;
                }
            }
        },
        methods: {
            getBusinessSetStateByNamePath: LIB.getBusinessSetStateByNamePath,
            doSingleDelegate: function (type) {
                var Optype = "委托";
                if (type === 'assign') {
                    Optype = "分派";
                }
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("此处无法批量" + Optype);
                    return;
                }
                var row = rows[0];
                if (type === 'delegate') {
                    if (row.checkerId && row.checkerId != LIB.user.id) {
                        LIB.Msg.warning("只能" + Optype + "自己的任务");
                        return;
                    }
                    if (row.checkerIds && row.checkerIds.indexOf(LIB.user.id) == -1) {
                        LIB.Msg.warning("只能" + Optype + "自己的任务");
                        return;
                    }
                }
                // if(row.checkerId != LIB.user.id) {
                // 	LIB.Msg.warning("只能委托自己的任务");
                //     return;
                // }
                if (row.status !== '0' && row.status !== '1' && row.status !== '4') {
                    LIB.Msg.warning("只能" + Optype + "【未到期】、【待执行】、【未执行】的任务");
                    return;
                }
                this.delegateSingleModel.id = row.id;
                this.delegateSingleModel.checkerIds = row.checkerIds ? row.checkerIds : row.checkerId;
                this.delegateSingleModel.type = type;
                this.delegateSingleModel.show = true;
            },
            doMultipleDelegate: function (type) {
                this.delegateBatchModel.type = type;
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

                if (!this.mainModel.isShowExcute) {
                    LIB.Msg.warning("当前任务只能在app里面执行");
                    return;
                }

                if (row.checkerId && row.checkerId != LIB.user.id) {
                    LIB.Msg.warning("只能执行自己的任务");
                    return;
                } else if (row.checkerIds && row.checkerIds.indexOf(LIB.user.id) == -1) {
                    LIB.Msg.warning("只能执行自己的任务");
                    return;
                }
                // if(row.checkerId != LIB.user.id) {
                // 	LIB.Msg.warning("只能执行自己的任务");
                //     return;
                // }
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
                    var routerPart = "";
                    if (this.mainModel.bizType) {
                        routerPart = this.mainModel.checkRecordRoutePath + "?bizType=" + this.mainModel.bizType + "&keepUrlParam=true&method=check&checkTaskId=" + deleteIds[0];;
                    } else {
                        routerPart = this.mainModel.checkRecordRoutePath + "?method=check&checkTaskId=" + deleteIds[0];
                    }
                    this.$router.go(routerPart);
                }
            },
            initData: function () {
                var startRoute = this.$route.path.split("/")[1];
                if (this.$route.query.bizType) {
                    this.mainModel.bizType = this.$route.query.bizType;
                }

                if (this.mainModel.bizType) {
                    this.mainModel.checkRecordRoutePath = "/" + startRoute + "/businessCenter/checkRecord";
                } else {
                    this.mainModel.checkRecordRoutePath = "/hiddenDanger/businessCenter/checkRecord";
                }
                var params = [];
                // 筛选状态
                this._initFilterByState(this.$route.query)
                //大类型
                params.push({
                    value: {
                        columnFilterName: "bizType",
                        columnFilterValue: this.mainModel.bizType
                    },
                    type: "save"
                });

                var allstatus = this.$route.query.allstatus;
                if (allstatus && allstatus == "true") {
                    var paramStatus = [0, 1, 2, 3, 4, 5];
                    params.push({
                        value: {
                            columnFilterName: "criteria.intsValue.status",
                            columnFilterValue: paramStatus
                        },
                        type: "save"
                    });
                } else {
                    var status = this.$route.query.status || this.$route.query.checktaskIsBegin;
                    var paramStatus = !!status ? [status] : null;
                    params.push({
                        value: {
                            columnFilterName: "criteria.intsValue.status",
                            columnFilterValue: paramStatus
                        },
                        type: "save"
                    });
                }
                var allcheckers = this.$route.query.allcheckers;
                if (allcheckers && allcheckers == "true") {
                    this.$api.__auth__.exportPdf= '7920001006';
                    params.push({
                        value: {
                            columnFilterName: "checkerId",
                            columnFilterValue: null
                        },
                        type: "save"
                    });
                } else {
                    this.$api.__auth__.exportPdf= '2020004006';
                    params.push({
                        value: {
                            columnFilterName: "checkerId",
                            columnFilterValue: LIB.user.id,
                        },
                        type: "save"
                    });
                }
                this.$refs.mainTable.doQueryByFilter(params);
            },
            _initFilterByState: function (queryObj) {
                // 设置的筛选条件 任务状态[ 1待执行, 2未完成,4未执行]
                var initStatus = ['1', '2', '4']
                var column = _.find(this.tableModel.columns, function (c) {
                    return c.fieldName === 'status';
                })
                if (queryObj.allstatus && queryObj.allstatus === 'true') {
                    this.$refs.mainTable.doOkActionInFilterPoptip(null, column, []);
                } else {
                    this.$refs.mainTable.doOkActionInFilterPoptip(null, column, initStatus);
                }

            },
            // _filterByCreater: function () {
            //     // 是否需要筛选掉不符合当前账号的检查任务，当为检查任务时筛选，当任务总览时不筛选
            //     var checkerIdColumn = _.find(this.tableModel.columns, function (item) {
            //         return item.orderName === "checkerId";
            //     });
            //     // this.tableModel.defaultFilterValue.checkerId = LIB.user.id
            //     this.$refs.mainTable.doOkActionInFilterPoptip(null, checkerIdColumn, LIB.user.name);
            //     // this.$set('tableModel.defaultFilterValue.checkerId', LIB.user.id)
            //     // this.$refs.mainTable.doCleanRefresh()
            //     // this.$refs.mainTable.buildDefaultFilter()
            //     // this.$refs.mainTable.doCleanRefresh()
            //     // console.log(this.tableModel.defaultFilterValue)

            // },
            // _filterByJudgeStatus: function (queryObj) {
            //     // 设置初始筛选条件
            //     if (!!!queryObj.allstatus) {
            //         this._initFilterByState(queryObj)
            //     } else {
            //         var statusColumn = []
            //         var checkerIdColumn = []
            //         _.each(this.tableModel.columns, function (item) {
            //             if (item.fieldName === "status") {
            //                 statusColumn = item
            //             } else if (item.orderName === "checkerId") {
            //                 checkerIdColumn = item
            //             }
            //         })
            //         this.$refs.mainTable.doOkActionInFilterPoptip(null, statusColumn, [1, 2, 3, 4, 5]);

            //         if (!!queryObj.allcheckers) {
            //             this.$refs.mainTable.doOkActionInFilterPoptip(null, checkerIdColumn, '');
            //         }
            //         // this.$set('tableModel.defaultFilterValue.checkerId', '')
            //         // this.$refs.mainTable.buildDefaultFilter()
            //         // console.log()
            //     }
            // }
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

            //首页跳转时根据首页对应搜索条件查询
            if (this.$route.query.method === "filterByUser") {
                var checkerColumn = {
                    title: "检查人id",
                    fieldName: "checkerId"
                };
                if (!!checkerColumn) {
                    this.$refs.mainTable.doOkActionInFilterPoptip(null, checkerColumn, LIB.user.id);
                }
                var statusColumn = _.find(this.tableModel.columns, function (item) {
                    return item.fieldName === "status";
                });
                if (!!statusColumn && !!this.$route.query.state) {
                    if (this.$route.query.state == 1) {
                        this.$refs.mainTable.doOkActionInFilterPoptip(null, statusColumn, ['1', '2', '4']);
                    } else if (this.$route.query.state == 2) {
                        this.$refs.mainTable.doOkActionInFilterPoptip(null, statusColumn, ['0']);
                    }
                }
            }
            if (LIB.getBusinessSetByNamePath('common.enableCheckLevel').result === '2') {
                _this.tableModel.columns.push({
                    title: "检查级别",
                    fieldName: "checkLevel",
                    orderName: "checkLevel",
                    fieldType: "custom",
                    filterType: "enum",
                    filterName: "criteria.intsValue.checkLevel",
                    popFilterEnum: LIB.getDataDicList("checkLevel"),
                    render: function (data) {
                        return LIB.getDataDic("checkLevel", data.checkLevel);
                    },
                    width: 100
                });
            }
            /*api.getEnvconfig({type: "BUSINESS_SET"}).then(function (res) {
                if (res.body !== 'E30000' && res.body.checkTaskSet) {
                    _this.isLateCheckAllowed = !!res.body.checkTaskSet.isLateCheckAllowed;
                    _this.isLateWorkPlanExecute = !!res.body.checkTaskSet.isLateWorkPlanExecute;
                    _this.isLatePollingPlanExecute = !!res.body.checkTaskSet.isLatePollingPlanExecute;
                }
            });*/
        },
        events: {
            "ev_single_delegate": function () {
                //重新加载数据
                this.emitMainTableEvent("do_update_row_data", {
                    opType: "add"
                });
                this.delegateSingleModel.show = false;
            },
        },
        route: {
            activate: function (transition) {
                // 筛选状态
                if (!this.$route.query.allstatus) {
                    this._initFilterByState(this.$route.query)
                }

                var queryObj = transition.to.query;
                if (queryObj.id && queryObj.method === "detail" && queryObj.opt === "isClickCheckTaskExecutBtn") {
                    this.detailModel.id = queryObj.id;
                }
                // console.log(!!!queryObj.allcheckers && !this.tableModel.defaultFilterValue.checkerId)
                // console.log(LIB.user.name)
                // if (!!!queryObj.allcheckers && !this.tableModel.defaultFilterValue.checkerId) {
                //     this._filterByCreater()
                // }
                transition.next();
            }
        }
    });

    return vm;
});