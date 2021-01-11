define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("./detail-xl");

    LIB.registerDataDic("isr_risk_assess_task_is_read", [
        ["0", "未读"],
        ["1", "已读"]
    ]);


    var initDataModel = function () {
        return {
            moduleCode: "personalRiskAssessTask",
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
                    url: "riskassesstask/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            title: "研判人",
                            fieldName: "user.name",
                            orderName: "user.username",
                            filterType: "text",
                        },
                        LIB.tableMgr.column.company,
                        {
                            //控制层级 1:班组级,2:工段级,3:车间级,4:厂级,5公司级
                            title: "研判层级",
                            fieldName: "controlRank",
                            orderName: "riskassess.controlRank",
                            filterName: "criteria.intsValue.controlRank",
                            filterType: "enum",
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("isr_control_rank"),
                            render: function (data) {
                                return LIB.getDataDic("isr_control_rank", data.controlRank);
                            }
                        },
                        // LIB.tableMgr.column.dept,
                        // {
                        //     title: "责任对象",
                        //     render: function (data) {
                        //         return _.pluck(data.bizOrgRels, "name").join("、")
                        //     }
                        // },
                        {
                            //完成时间
                            title: "额定完成时间",
                            fieldName: "riskAssess.ratedCompleteDate",
                            filterType: "date"
                        },
                        {
                            //完成时间
                            title: "完成时间",
                            fieldName: "completeDate",
                            filterType: "date"
                        },
                        {
                            title: "研判结果",
                            render: function (data) {
                                if (data.attr1 > 0) {
                                    return '<div style="color: red;">有风险（' + data.attr1 + '）</div>'
                                }
                                return "无风险"
                            }
                        },
                        {
                            //1:未完成,2:已完成
                            title: "状态",
                            fieldName: "isComplete",
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("isr_is_complete"),
                            render: function (data) {
                                return LIB.getDataDic("isr_is_complete", data.isComplete);
                            }
                        },
                        // {
                        //     title: "下属汇报汇总"
                        // },

                        //
                        // {
                        //     //结束时间
                        //     title: "结束时间",
                        //     fieldName: "endDate",
                        //     filterType: "date"
                        // },

                        // {
                        //     //是否已读 0:未读,1:已读
                        //     title: "是否已读",
                        //     fieldName: "isRead",
                        //     orderName: "isRead",
                        //     filterName: "criteria.intsValue.isRead",
                        //     filterType: "enum",
                        //     fieldType: "custom",
                        //     popFilterEnum: LIB.getDataDicList("isr_risk_assess_task_is_read"),
                        //     render: function (data) {
                        //         return LIB.getDataDic("isr_risk_assess_task_is_read", data.isRead);
                        //     }
                        // },
                        // {
                        //     title: "执行记录",
                        //     fieldName: "riskAssessRecord.name",
                        //     orderName: "riskAssessRecord.name",
                        //     filterType: "text",
                        // },
                        // {
                        //     title: "安全风险研判",
                        //     fieldName: "riskAssess.name",
                        //     orderName: "riskAssess.name",
                        //     filterType: "text",
                        // },

//					{
//						//开始时间
//						title: "开始时间",
//						fieldName: "startDate",
//						filterType: "date"
//					},
                    ],
                    defaultFilterValue: {"user.id": LIB.user.id, "criteria.intsValue": {riskassessStatus: [4]}}
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/riskassesstask/importExcel"
            },
            exportModel: {
                url: "/riskassesstask/exportExcel",
                withColumnCfgParam: true
            },
            filterTabId: 'isComplete1',
            count: {
                unfinished: 0,
                unread: 0
            }
        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
        },
        methods: {
            doFilterBySpecial: function (type, v) {
                this.filterTabId = type + v;
                this._normalizeFilterParam(type, v);
            },
            _normalizeFilterParam: function (type, v) {
                var params = [
                    {
                        value : {
                            columnFilterName : type,
                            columnFilterValue : v
                        },
                        type : "save"
                    }
                ];
                this.$refs.mainTable.doQueryByFilter(params);
            },
            _getCount: function () {
                var _this = this;
                api.getCount().then(function (res) {
                    _this.count.unfinished = _.get(res.data, "[0].unfinished", 0);
                    _this.count.unread = _.get(res.data, "[0].unread", 0);
                })
            },
            afterDoDetailUpdate: function () {
                this._getCount();
            }
        },
        events: {},
        init: function () {
            this.$api = api;
        },
        attached: function () {
            this._getCount();
        },
        ready: function () {
            this._normalizeFilterParam('isComplete', '1');
        }
    });

    return vm;
});
