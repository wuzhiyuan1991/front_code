define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    var detailPanel = require("./detail-xl");


    LIB.registerDataDic("isr_risk_assess_status", [
        ["1", "制定中"],
        ["2", "已下发"],
        ["3", "已承诺"],
        ["4", "已发布"],
        ["5", "已取消"]
    ]);


    var initDataModel = function () {
        return {
            moduleCode: "riskAssess",
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
                    url: "riskassess/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        LIB.tableMgr.column.company,
                        // LIB.tableMgr.column.dept,
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
                        {
                            title: "责任对象",
                            fieldName: "bizOrgRels",
                            // filterType: "text",
                            render: function (data) {
                                var items = _.map(data.bizOrgRels, function (item) {
                                    return {
                                        name: LIB.getDataDic("org", item.orgId)["deptName"]
                                    }
                                });
                                return _.pluck(items, "name").join("、")
                            }
                        },
                        {
                            //制定时间
                            title: "制定时间",
                            fieldName: "formulateDate",
                            filterType: "date"
                        },
                        {
                            //年份
                            title: "研判年份",
                            fieldName: "year",
                            filterType: "date",
                            render: function (data) {
                                return data.year ? data.year.substr(0, 4) + "年" : ""
                            }
                        },
                        {
                            //额定完成时间
                            title: "制定部门",
                            fieldName: "formulateOrgId",
                            filterType: "text",
                            filterName:"criteria.strValue.formulateOrgName",
                            render: function (data) {
                                return LIB.getDataDic('org', data.formulateOrgId)['deptName']
                            }
                        },
                        LIB.tableMgr.column.remark,
                        {
                            //状态 1:制定中,2:已下发,3:已承诺,4:已发布,5:已取消
                            title: "状态",
                            fieldName: "status",
                            orderName: "status",
                            filterName: "criteria.intsValue.status",
                            filterType: "enum",
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("isr_risk_assess_status"),
                            render: function (data) {
                                return LIB.getDataDic("isr_risk_assess_status", data.status);
                            }
                        }
                    ]
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/riskassess/importExcel"
            },
            exportModel: {
                url: "/riskassess/exportExcel",
                withColumnCfgParam: true
            },
        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
        },
        computed: {
            isFormulate: function () {
                return _.get(this.tableModel, "selectedDatas[0].status") === '1';
            }
        },
        methods: {},
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
