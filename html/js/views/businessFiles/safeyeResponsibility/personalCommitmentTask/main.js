define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
	var detailPanel = require("./detail-xl");

    LIB.registerDataDic("isr_commitment_task_is_read", [
        ["0", "未读"],
        ["1", "已读"]
    ]);


    var initDataModel = function () {
        return {
            moduleCode: "personalCommitmentTask",
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
                    url: "commitmenttask/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            title: "安全承诺书",
                            fieldName: "commitment.name",
                            orderName: "commitment.name",
                            filterType: "text",
                        },
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        {
                            title: "考核人",
                            fieldName: "user.name",
                            orderName: "user.username",
                            filterType: "text",
                        },
                        {
                            title: "计划类型",
                            filterType: "enum",
                            fieldType: "custom",
                            orderName: "commitmentsetting.type",
                            filterName: "criteria.intsValue.commitmentSettingType",
                            popFilterEnum: LIB.getDataDicList("isr_time_plan"),
                            render: function (data) {
                                return LIB.getDataDic("isr_time_plan", _.get(data, "commitmentSetting.type"));
                            }
                        },
                        {
                            title: "承诺时间范围",
                            render: function (data) {
                                var type = _.get(data, "commitmentSetting.type", "1");
                                var year = _.get(data, "commitmentSetting.year", "");
                                var halfYear = _.get(data, "commitmentSetting.halfYear", "1");
                                var quarter = _.get(data, "commitmentSetting.quarter", "1");
                                var halfMap = {
                                    "1": "上半年",
                                    "2": "下半年"
                                };
                                var quarterMap = {
                                    "1": "第一季度",
                                    "2": "第二季度",
                                    "3": "第三季度",
                                    "4": "第四季度"
                                };
                                var yearText = year.substr(0, 4) + "年";
                                if (type === '1') {
                                    return yearText;
                                } else if (type === '2') {
                                    return yearText + halfMap[halfYear];
                                } else if (type === '3') {
                                    return yearText + quarterMap[quarter];
                                }

                                return "";
                            }
                        },
                        {
                            //得分
                            title: "得分",
                            fieldName: "score",
                            filterType: "text"
                        },

                        {
                            //开始时间
                            title: "考核开始时间",
                            fieldName: "startDate",
                            filterType: "date"
                        },
                        {
                            //结束时间
                            title: "考核结束时间",
                            fieldName: "endDate",
                            filterType: "date"
                        },
                        {
                            //完成时间
                            title: "完成时间",
                            fieldName: "completeDate",
                            filterType: "date"
                        },
                        {
                            //1:未完成,2:已完成
                            title: "状态",
                            fieldName: "isComplete",
                            filterName: "criteria.intsValue.isComplete",
                            fieldType: "custom",
                            // filterType: "enum",
                            popFilterEnum: LIB.getDataDicList("isr_is_complete"),
                            render: function (data) {
                                return LIB.getDataDic("isr_is_complete", data.isComplete);
                            }
                        },
                        // {
                        //     //是否已读 0:未读,1:已读
                        //     title: "是否已读",
                        //     fieldName: "isRead",
                        //     orderName: "isRead",
                        //     filterName: "criteria.intsValue.isRead",
                        //     filterType: "enum",
                        //     fieldType: "custom",
                        //     popFilterEnum: LIB.getDataDicList("isr_commitment_task_is_read"),
                        //     render: function (data) {
                        //         return LIB.getDataDic("isr_commitment_task_is_read", data.isRead);
                        //     }
                        // },
//
                    ],
                    defaultFilterValue: {"criteria.intsValue": {commitmentStatus: [4]}}
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/commitmenttask/importExcel"
            },
            exportModel: {
                url: "/commitmenttask/exportExcel",
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
                var removeName = type === 'isComplete' ? 'isRead' : 'isComplete';
                var params = [
                    {
                        value : {
                            columnFilterName : type,
                            columnFilterValue : v
                        },
                        type : "save"
                    },
                    {
                        type: "remove",
                        value: {
                            columnFilterName: removeName
                        }
                    }
                ];

                if (type === 'isComplete') {
                    params.push({
                        value : {
                            columnFilterName : "user.id",
                            columnFilterValue : LIB.user.id
                        },
                        type : "save"
                    })
                } else {
                    params.push({
                        value : {
                            columnFilterName : "user.id"
                        },
                        type : "remove"
                    })
                }

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
