define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
	var detailPanel = require("./detail-xl");

    LIB.registerDataDic("isr_commitment_status", [
        ["1", "制定中"],
        ["2", "已下发"],
        ["3", "已承诺"],
        ["4", "已发布"],
        ["5", "已取消"]
    ]);


    var initDataModel = function () {
        return {
            moduleCode: "commitment",
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
                    url: "commitment/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            //承诺书名称
                            title: "承诺书名称",
                            fieldName: "name",
                            filterType: "text"
                        },
                        LIB.tableMgr.column.company,
                        {
                            title: "责任部门",
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
                        // LIB.tableMgr.column.dept,
                        {
                            title: "计划类型",
                            fieldName: "commitmentSetting.type",
                            filterType: "enum",
                            fieldType: "custom",
                            filterName: "criteria.intsValue.settingType",
                            orderName: "commitmentsetting.type",
                            popFilterEnum: LIB.getDataDicList("isr_time_plan"),
                            render: function (data) {
                                return LIB.getDataDic("isr_time_plan", _.get(data, "commitmentSetting.type", "1"));
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
                            //制定时间
                            title: "制定时间",
                            fieldName: "formulateDate",
                            filterType: "date"
                        },
                        {
                            title: "制定部门",
                            fieldName: "formulateOrgId",
                            filterName: "criteria.strValue.formulateOrgName",
                            filterType: "text",
                            render: function (data) {
                                return LIB.getDataDic("org", data.formulateOrgId)["deptName"]
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
                            popFilterEnum: LIB.getDataDicList("isr_commitment_status"),
                            render: function (data) {
                                return LIB.getDataDic("isr_commitment_status", data.status);
                            }
                        },
                        // {
                        //     //承诺书类别(待定)
                        //     title: "承诺书类别(待定)",
                        //     fieldName: "type",
                        //     filterType: "number"
                        // },
//					 LIB.tableMgr.column.modifyDate,
////					 LIB.tableMgr.column.createDate,
//
                    ]
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/commitment/importExcel"
            },
            exportModel: {
                url: "/commitment/exportExcel",
                withColumnCfgParam: true
            },
            //Legacy模式
//			formModel : {
//				commitmentFormModel : {
//					show : false,
//				}
//			}

        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel
        },
        computed: {
            isFormulate: function () {
                return _.get(this.tableModel, "selectedDatas[0].status") === '1';
            }
        },
        methods: {

        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
