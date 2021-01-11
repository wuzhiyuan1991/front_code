define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    var detailPanel = require("./detail-xl");


    LIB.registerDataDic("icpe_check_object_mrs_catalog_use", [
        ["1","原材料"],
        ["2","中间产品"],
        ["3","成品"]
    ]);

    LIB.registerDataDic("icpe_check_object_mrs_functional_area", [
        ["1","工业区"],
        ["2","农业区"],
        ["3","商业区"],
        ["4","居民区"],
        ["5","行政办公区"],
        ["6","交通枢纽区"],
        ["7","科技文化区"],
        ["8","水源保护区"],
        ["9","文物保护区"]
    ]);

    LIB.registerDataDic("icpe_check_object_mrs_risk_level", [
        ["1","一级"],
        ["2","二级"],
        ["3","三级"],
        ["4","四级"]
    ]);

    LIB.registerDataDic("icpe_check_object_mrs_unit_classification", [
        ["1","生产单元"],
        ["2","储存单元"]
    ]);

    var initDataModel = function () {
        return {
            moduleCode: "Major_R_Source",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "majorrisksource/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            //名称
                            title: "重大危险源名称",
                            fieldName: "name",
                            filterType: "text",
                            width: 240
                        },
                        {
                            //所在地址
                            title: "所在地址",
                            fieldName: "mrsPlace",
                            filterType: "text"
                        },
                        {
                            //投用时间
                            title: "投用时间",
                            fieldName: "timeOfInvestment",
                            orderName: "mrsTimeOfInvestment",
                            filterType: "date",
                            render: function (data) {
                                if(data.timeOfInvestment) {
                                    return data.timeOfInvestment.substr(0, 10)
                                }
                                return ''
                            }
                        },
                        {
                            //重大危险源级别 1:一级,2:二级,3:三级,4:四级
                            title: "级别",
                            fieldName: "riskLevel",
                            orderName: "mrsRiskLevel",
                            filterName: "criteria.intsValue.riskLevel",
                            filterType: "enum",
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("icpe_check_object_mrs_risk_level"),
                            render: function (data) {
                                return LIB.getDataDic("icpe_check_object_mrs_risk_level", data.riskLevel);
                            }
                        },
                        LIB.tableMgr.column.disable,
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        {
                            title: "属地",
                            fieldName: "dominationArea.name",
                            orderName: "dominationarea.name",
                            filterType: "text"
                        },
                        {
                            //单元内主要装置/设施
                            title: "单元内主要装置/设施",
                            fieldName: "mrsEquipmentOfUnit",
                            filterType: "text"
                        },
                    ]
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/majorrisksource/importExcel"
            },
            exportModel: {
                url: "/majorrisksource/exportExcel",
                withColumnCfgParam: true
            }
        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel
        },
        methods: {},
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
