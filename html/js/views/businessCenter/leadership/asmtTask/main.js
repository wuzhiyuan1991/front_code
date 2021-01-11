define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
	var detailPanel = require("./detail-xl");

    // var statusList = [
    //     {
    //         id:'0',
    //         value: '待开始'
    //     },
    //     {
    //         id:'1',
    //         value: '待自评'
    //     },
    //     {
    //         id:'2',
    //         value: '待评审'
    //     },
    //     {
    //         id:'3',
    //         value: '待修改'
    //     },
    //     {
    //         id:'4',
    //         value: '已完成'
    //     },
    //     {
    //         id:'5',
    //         value: '已过期'
    //     },
    //     {
    //         id:'6',
    //         value: '已取消'
    //     }
    // ];
    var initDataModel = function () {
        return {
            moduleCode: "asmtTask",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                // detailPanelClass: "middle-info-aside"
				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "asmttask/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    isSingleCheck: false,
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                        },
                        {
                            //编码
                            title: "编码",
                            fieldName: "code",
                            fieldType: "link",
                            filterType: "text",
                            width: 160
                        },
                        // {
                        //     title:"编号",
                        //     fieldName:'num'
                        // },
                        {
                            title:'计划名称',
                            fieldName: 'asmtPlan.name',
                            filterType: "text",
                            width: 240,
                            orderName: "asmtplan.id",
                            filterName: "criteria.strValue.asmtPlanName"
                        },
                        {
                            title: '自评表名称',
                            fieldName: 'asmtTable.name',
                            filterType: "text",
                            width: 200,
                            orderName: "asmttable.id",
                            filterName: "criteria.strValue.asmtTableName"
                        },
                        LIB.tableMgr.column.company, 
                        {
                            title: '状态',
                            fieldName: 'status',
                            filterType: "enum",
                            fieldType: 'custom',
                            // popFilterEnum: statusList,
                            // render: function (data) {
                            //     var res = statusList.filter(function (item) {
                            //         return item.id === data.status;
                            //     });
                            //     if(res.length > 0) {
                            //         return res[0].value;
                            //     }
                            // },
                            render: function(data) {
                                return LIB.getDataDic("asmt_task_status", data.status);
                            },
                            popFilterEnum: LIB.getDataDicList("asmt_task_status"),
                            filterName: 'criteria.intsValue.status',
                            width: 100
                        },
                        {
                            title: "自评人",
                            fieldName: "mbrea.username",
                            filterType: "text",
                            width: 100,
                            orderName: "mbrea_id",
                            filterName: "criteria.strValue.mbreaName"
                        },
                        {
                            title: "评审人",
                            fieldName: "auditor.username",
                            filterType: "text",
                            width: 100,
                            orderName: "auditor.id",
                            filterName:"criteria.strValue.auditorName"
                        },
                        {
                            //得分
                            title: "得分",
                            fieldName: "score",
                            filterType: "number",
                            width: 100
                        },
                        {
                            //开始时间
                            title: "开始时间",
                            fieldName: "startDate",
                            filterType: "date",
                            width: 180
                        },
                        {
                            //结束时间
                            title: "结束时间",
                            fieldName: "endDate",
                            filterType: "date",
                            width: 180
                        },
                        {
                            title: "来源",
                            fieldName: "auditSource",
                            filterType: "enum",
                            fieldType: 'custom',
                            render: function(data) {
                                return LIB.getDataDic("asmt_task_auditSource", data.auditSource);
                            },
                            popFilterEnum: LIB.getDataDicList("asmt_task_auditSource"),
                            width: 140,
                            orderName: "audit_source",
                            filterName: 'criteria.intsValue.auditSource',
                        }
                        // {
                        //     //实际完成时间
                        //     title: "实际完成时间",
                        //     fieldName: "actualfinishDate",
                        //     filterType: "date"
                        // }
                    ]
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/asmttask/importExcel"
            },
            exportModel: {
                url: "/asmttask/exportExcel"
            },
            userSelectModel: {
                visible: false
            },
            filterTabId: 'todo',
        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel
        },
        methods: {
            doCancelTask: function () {
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                var row = rows[0];
                if(rows.length > 1) {
                    LIB.Msg.error("不能同时取消多条任务");
                    return;
                }

                if(row.status === '6') {
                    LIB.Msg.info("任务已经取消");
                    return;
                }
                if(row.status === '5') {
                    LIB.Msg.info("已过期的任务不能取消");
                    return;
                }
                if(row.status === '4') {
                    LIB.Msg.info("已完成的任务不能取消");
                    return;
                }
                LIB.Modal.confirm({
                    title: '确定取消该自评任务?',
                    onOk: function() {
                        _this.$api.cancelTask({id: row.id, status: '6'}).then(function () {
                            row.status = '6';
                            _this.emitMainTableEvent("do_update_row_data", { opType: "update", value: _this.tableModel.selectedDatas });
                            LIB.Msg.info("任务已取消");
                        })
                    }
                });

            },
            doModify: function () {
                var rows = this.tableModel.selectedDatas;
                var hasError = false;
                for(var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    if(row.status === '6') {
                        LIB.Msg.info("编码为" + row.code + "的任务已取消,不能变更");
                        hasError = true;
                        break;
                    }
                    if(row.status === '5') {
                        LIB.Msg.info("编码为" + row.code + "的任务已过期,不能变更");
                        hasError = true;
                        break;
                    }
                    if(row.status === '4') {
                        LIB.Msg.info("编码为" + row.code + "的任务已完成,不能变更");
                        hasError = true;
                        break;
                    }
                    if(row.status === '7') {
                        LIB.Msg.info("编码为" + row.code + "的任务已失效,不能变更");
                        hasError = true;
                        break;
                    }
                }
                if(hasError) {
                    return;
                }
                this.userSelectModel.visible = true;
            },
            doModifyAuditor: function (selectedDatas) {
                var user = selectedDatas[0];
                var _this = this;
                var rows = this.tableModel.selectedDatas;
                var hasError = false;
                var params = [];
                for(var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    params.push({
                        id: row.id,
                        auditorId: user.id
                    })
                }
                if(hasError) {
                    params = null;
                    return;
                }

                this.$api.modifyAuditor(params).then(function () {
                    // row.auditor = user;
                    // _this.emitMainTableEvent("do_update_row_data", { opType: "update", value: _this.tableModel.selectedDatas });
                    _this.refreshMainTableData();
                    LIB.Msg.info("评审人已变更");
                })
            },
            // 获取业务参数设置中的自评权重和复评权重，在详情页计算最终得分
            _getSetting: function () {
                api.getSetting().then(function (res) {
                    var asmtWeight = _.find(res.data.children, function (item) {
                        return item.name === 'asmtWeight'
                    });
                    var auditWeight = _.find(res.data.children, function (item) {
                        return item.name === 'auditWeight'
                    });
                    window.__ASMT_WEIGHT__ = parseFloat(asmtWeight.result) / 100;
                    window.__AUDIT_WEIGHT__ = parseFloat(auditWeight.result) / 100;
                })
            },
            doFilterBySpecial: function (v) {
                this.filterTabId = 'todo' + (v || '');
                this._normalizeFilterParam(v);
            },
            _normalizeFilterParam: function (v) {
                var params = [];
                var name = 'criteria.strValue.todo';
                if (v) {
                    params.push({
                        value : {
                            columnFilterName : name,
                            columnFilterValue : v
                        },
                        type : "save"
                    })
                } else {
                    params.push({
                        type: "remove",
                        value: {
                            columnFilterName: name
                        }
                    })
                }
                this.$refs.mainTable.doQueryByFilter(params);
            },
        },
        events: {},
        init: function () {
            this.$api = api;
        },
        ready: function () {
            this._getSetting();
            //首页跳转时根据首页对应搜索条件查询
            if (this.$route.query.method === "filterByUser") {
                var statusColumn = _.find(this.tableModel.columns, function (item) {
                    return item.fieldName === "status";
                });
                if(!!statusColumn && !!this.$route.query.state) {
                    if(this.$route.query.state == 1) {
                        this.$refs.mainTable.doOkActionInFilterPoptip(null, statusColumn, ['1','2','3']);
                    }else if(this.$route.query.state == 2) {
                        this.$refs.mainTable.doOkActionInFilterPoptip(null, statusColumn, ['0']);
                    }
                    this.doFilterBySpecial("1");
                }
            }
        }
    });

    return vm;
});
