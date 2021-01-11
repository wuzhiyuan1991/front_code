define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("./detail-xl");

    LIB.registerDataDic("isr_risk_assess_task_is_read", [
        ["0", "未读"],
        ["1", "已读"]
    ]);


    var initDataModel = function () {
        return {
            moduleCode: "riskAssessTask",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                // detailPanelClass : "middle-info-aside"
                detailPanelClass: "large-info-aside"
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
                                if (data.isComplete !== '2') {
                                    return "";
                                }
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
                        {
                            title: "下属汇报汇总",
                            render: function (data) {
                                if (data.attr2) {
                                    if (data.attr3 > 0) {
                                        return data.attr3+"/"+data.attr2
                                    } else {
                                        return "0/"+data.attr2
                                    }
                                }
                                return "";
                            }
                        },
                    ],
                    defaultFilterValue: {"criteria.intsValue": {riskassessStatus: [4]}}
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
            filterTabId: 'isComplete1'
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
            }
        },
        events: {},
        init: function () {
            this.$api = api;
        },
        ready: function () {
            this._normalizeFilterParam('isComplete', '1');
        }
    });

    return vm;
});
