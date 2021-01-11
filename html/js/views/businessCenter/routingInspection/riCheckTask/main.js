define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");

    require('base').setting.dataDic["iri_check_task_status"] = {
        "0": "未到期",
        "2": "按期执行",
        "3": "超期执行",
        "4": "未执行",
        "5": "已失效"
    };

    var initDataModel = function () {
        return {
            moduleCode: "riCheckTask",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "middle-info-aside",
                showTempSetting: true
//				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "richecktask/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            //巡检任务名称
                            title: "巡检任务名称",
                            fieldName: "name",
                            filterType: "text",
                            width: 300
                        },
                        {
                            title: "检查人",
                            fieldName: "user.name",
                            orderName: "user.username",
                            filterType: "text",
                        },
                        {
                            title: "巡检表",
                            fieldName: "riCheckTable.name",
                            orderName: "riCheckTable.name",
                            filterType: "text",
                        },
                        {
                            //任务状态 0:未到期,1:,待执行,2:按期执行,3:超期执行,4:未执行,5:已失效
                            title: "任务状态",
                            fieldName: "status",
                            orderName: "status",
                            filterName: "criteria.intsValue.status",
                            filterType: "enum",
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("check_status"),
                            render: function (data) {
                                return LIB.getDataDic("check_status", data.status);
                            }
                        },
                        {
                            //开始时间
                            title: "任务开始时间",
                            fieldName: "startDate",
                            filterType: "date"
                        },
                        {
                            //结束时间
                            title: "任务结束时间",
                            fieldName: "endDate",
                            filterType: "date"
                        }],
                    defaultFilterValue : {"orgId" : LIB.user.orgId}
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/riCheckTask/importExcel"
            },
            exportModel: {
                url: "/riCheckTask/exportExcel"
            }

        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        // components: {
        // "detailPanel": detailPanel
        // },
        methods: {
            doTableCellClick: function () {

            },
            initData: function () {
                this.mainModel.bizType = this.$route.query.bizType;
                if(this.mainModel.bizType){
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
        },
        events: {},
        ready: function () {
            this.$refs.categorySelector.setDisplayTitle({type: "org", value: LIB.user.orgId});
            if (!LIB.user.compId) {
                this.mainModel.showTempSetting = false;
            }

            //首页跳转时根据首页对应搜索条件查询
            if (this.$route.query.method === "filterByUser") {
                var checkerColumn = {
                    title: "检查人id",
                    fieldName: "user.id"
                };
                if (checkerColumn) {
                    this.$refs.mainTable.doOkActionInFilterPoptip(null, checkerColumn, LIB.user.id);
                }
                var statusColumn = _.find(this.tableModel.columns, function (item) {
                    return item.fieldName == "status";
                });
                if(!!statusColumn && !!this.$route.query.state) {
                    if(this.$route.query.state == 1) {
                        this.$refs.mainTable.doOkActionInFilterPoptip(null, statusColumn, ['1', '4']);
                    }else if(this.$route.query.state == 2) {
                        this.$refs.mainTable.doOkActionInFilterPoptip(null, statusColumn, ['0']);
                    }
                }
            }
        },
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
