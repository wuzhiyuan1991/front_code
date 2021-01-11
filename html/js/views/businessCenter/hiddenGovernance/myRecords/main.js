define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var mainOpt = require("./main-opt");
    var sumMixin = require("../sumMixin");

    //右侧滑出详细页
    var detailComponent = require("../detail");
    //回转风险库弹框页面
    var riskComponent = require("./dialog/risk-modal");

    var exportTemplate = require("componentsEx/exportTemplate/index");

    var companyBusinessSetState = LIB.getCompanyBusinessSetState();

    //Vue数据模型
    var dataModel = function () {
        var _this = this;
        var columsCfg = LIB.setting.fieldSetting["BC_HaG_HazR"] ? LIB.setting.fieldSetting["BC_HaG_HazR"] : [];

        var renderTableModel = _.bind(LIB.tableRenderMgr.renderModel, _this, columsCfg);
        return {

            moduleCode: LIB.ModuleCode.BC_HaG_HazT,
            tableModel: LIB.Opts.extendMainTableOpt(renderTableModel(
                {
                    url: "pool/list{/curPage}{/pageSize}?_bizModel=myRecords",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                        }, {
                            //title: "编号",
                            title: this.$t("gb.common.code"),
                            fieldName: "title",
                            width: 180,
                            fieldType: "link",
                            filterName: "title",
                            filterType: "text"
                        },
                        //    {
                        //    //title: "受检对象",
                        //    title: this.$t("gb.common.subjectObj"),
                        //    orderName:"checkObject.name",
                        //    fieldName : "checkObject.name",
                        //    filterType: "text",
                        //    filterName : "criteria.strValue.name",
                        //},
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        {
                            title: "属地",
                            fieldName: "dominationArea.name",
                            orderName: "dominationAreaId",
                            filterType: "text"
                        },
                        {
                            title: "检查对象",
                            fieldName: "checkObj.name",
                            orderName: "ifnull(e.check_object_id,e.equipment_id)",
                            filterType: "text"
                        },
                        {
                            title: this.$t("gb.common.checkUser"),
                            orderName: "attr1",
                            fieldName: "user.name",
                            filterType: "text",
                            filterName: "criteria.strValue.checkUserName",
                            width: 100
                        },
                        {
                            title: this.$t("gb.common.problemFinder"),
                            fieldName: "problemFinder",
                            filterType: "text",
                            filterName: "criteria.strValue.problemFinder",
                        },
                        // {
                        //     //title: "信息来源",
                        //     title: this.$t("gb.common.infoSource"),
                        //     orderName: "infoSource",
                        //     fieldType: "custom",
                        //     filterType: "enum",
                        //     filterName: "criteria.intsValue.infoSource",
                        //     popFilterEnum: LIB.getDataDicList("info_source"),
                        //     render: function (data) {
                        //         return LIB.getDataDic("info_source", data.infoSource);
                        //     }
                        // }, {
                        //     //title: "体系要素",
                        //     title: this.$t("gb.common.systemElement"),
                        //     orderName: "systemElement",
                        //     fieldType: "custom",
                        //     filterType: "enum",
                        //     filterName: "criteria.intsValue.systemElement",
                        //     popFilterEnum: LIB.getDataDicList("system_element"),
                        //     render: function (data) {
                        //         return LIB.getDataDic("system_element", data.systemElement);
                        //     }
                        // },{
                        //     //title: "专业",
                        //     title: this.$t("gb.common.profession"),
                        //     orderName: "profession",
                        //     fieldType: "custom",
                        //     filterType: "enum",
                        //     filterName: "criteria.intsValue.profession",
                        //     popFilterEnum: LIB.getDataDicList("profession"),
                        //     render: function (data) {
                        //         return LIB.getDataDic("profession", data.profession);
                        //     }
                        // },
                        {
                            //title: "问题描述",
                            title: this.$t("gb.common.problemDesc"),
                            fieldName: "problem",
                            filterName: "criteria.strValue.problem",
                            filterType: "text",
                            renderClass: "textarea",
                            width: 320
                        },
                        {
                            title: this.$t("gb.common.latentDefect"),
                            fieldName: "latentDefect",
                            filterType: "text",
                            width: 180
                        },
                        {
                            //title: "建议措施",
                            title: this.$t("gb.common.recMeasure"),
                            fieldName: "danger",
                            filterName: "criteria.strValue.danger",
                            filterType: "text",
                            renderClass: "textarea",
                            width: 320
                        }, {
                            //title: "登记日期",
                            title: this.$t("bc.hal.registratDate"),
                            fieldName: "registerDate",
                            filterType: "date",
                            width: 180
                        }, {
                            //title: "隐患等级",
                            title: this.$t("hag.hazc.hiddenGrade"),
                            orderName: "type",
                            fieldType: "custom",
                            filterType: "enum",
                            filterName: "criteria.strsValue.riskType",
                            popFilterEnum: LIB.getDataDicList("risk_type"),
                            render: function (data) {
                                return LIB.getDataDic("risk_type", data.riskType);
                            },
                            width: 120
                        }, {
                            //title: "风险等级",
                            title: this.$t("gb.common.riskGrade"),
                            orderName: "riskLevel",
                            fieldType: "custom",
                            filterType: "text",
                            showTip: false,
                            filterName: "criteria.strValue.riskLevel",
                            render: function (data) {
                                if (data.riskLevel) {
                                    var riskLevel = JSON.parse(data.riskLevel);
                                    var resultColor = _.propertyOf(JSON.parse(data.riskModel))("resultColor");
                                    if (riskLevel && riskLevel.result) {
                                        //return riskLevel.result;
                                        if (resultColor) {
                                            return "<span style='background:\#" + resultColor + ";color:\#" + resultColor + ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + riskLevel.result;
                                        } else {
                                            return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + riskLevel.result;
                                        }
                                    } else {
                                        return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + "无";
                                        //return "无";
                                    }
                                }  else if (data.riskLevelResult) {
                                    var resultColor = LIB.getDataDic("risk_level_result_color", data.riskLevelResult);
                                    return "<span style='background:" + resultColor + ";color:" + resultColor + ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + LIB.getDataDic("risk_level_result", data.riskLevelResult);

                                } else {
                                    return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + "无";
                                    //return "无";
                                }
                            },
                            width: 120
                        }, {
                            title: this.$t("gb.common.state"),
                            orderName: "status",
                            fieldType: "custom",
                            filterType: "enum",
                            filterName: "criteria.intsValue.status",
                            popFilterEnum: LIB.getDataDicList("pool_status"),
                            render: function (data) {
                                return LIB.getDataDic("pool_status", data.status);
                            },
                            width: 120
                        }, {
                            title: "来源",
                            orderName: "sourceType",
                            fieldType: "custom",
                            filterType: "enum",
                            filterName: "criteria.intsValue.sourceType",
                            popFilterEnum: LIB.getDataDicList("pool_sourceType"),
                            render: function (data) {
                                return LIB.getDataDic("pool_sourceType", data.sourceType);
                            },
                            width: 100
                        },
                        {
                            title: "整改类型",
                            orderName: "reformType",
                            fieldType: "custom",
                            filterType: "enum",
                            filterName: "criteria.strsValue.reformType",
                            popFilterEnum: LIB.getDataDicList("pool_reformType"),
                            render: function (data) {
                                return LIB.getDataDic("pool_reformType", data.reformType);
                            },
                            width: 100
                        },
                        {
                            //title: "类型",
                            title: this.$t("gb.common.type"),
                            orderName: "type",
                            fieldType: "custom",
                            filterType: "enum",
                            filterName: "criteria.intsValue.type",
                            popFilterEnum: LIB.getDataDicList("pool_type"),
                            render: function (data) {
                                return LIB.getDataDic("pool_type", data.type);
                            },
                            width: 80
                        }
                    ],
                    defaultFilterValue: {"criteria.orderValue": {fieldName: "registerDate", orderType: "1"}}

                }
            )),
            //控制全部分类组件显示
            mainModel: {
                //显示分类
                showCategory: false,
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                showTempSetting: true
            },
            riskModel: {
                //控制编辑组件显示
                title: "回转风险库",
                //显示编辑弹框
                show: false,
                //编辑模式操作类型
                type: "create",
                id: null
            },
            detailModel: {
                //控制右侧滑出组件显示
                show: false
            },
            poolId: null,
            exportModel: {
                url: "/pool/exportExcel"
            },
            templateModel: {
                visible: false
            },
            filterTabId:"all"
        }
    };


    //使用Vue方式，对页面进行事件和数据绑定
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *    el
     template
     components
     componentName
     props
     data
     computed
     watch
     methods
     events
     vue组件声明周期方法
     created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var tpl = LIB.renderHTML(require("text!./main.html"));
    var vm = LIB.VueEx.extend({
        mixins: [sumMixin, LIB.VueMixin.auth, LIB.VueMixin.mainPanel, mainOpt],
        template: tpl,
        components: {
            "detail-component": detailComponent,
            "risk-component": riskComponent,
            "export-template": exportTemplate
        },
        data: dataModel,
        methods: {
            showTemplateSetting: function () {
                this.templateModel.visible = true;
            },
            doFilterBySpecial: function (status) {
                this.filterTabId = status;
                this._normalizeFilterParam(status);
            },
            _normalizeFilterParam: function (status) {
                if(status == "all") {
                   status = null;
                }
                var params = [{
                    value : {
                        columnFilterName : "status",
                        columnFilterValue : status
                    },
                    type : "save"
                }];
                this.$refs.mainTable.doQueryByFilter(params);
            },
            doExportExcel:function () {debugger
                var url =  this._getExportURL()+'&_bizModel=myRecords';
                window.open(url);
            }
        },
        created:function() {
            var _this = this;
            var isShowEquName = companyBusinessSetState['poolGovern.isShowEquName'] == null ? false : companyBusinessSetState['poolGovern.isShowEquName'].result === '2';
            if(isShowEquName){
                var length = _this.tableModel.columns.length;
                var columns1 = _this.tableModel.columns.slice(0,6);
                var columns2 = _this.tableModel.columns.slice(6,length);
                columns1.push({
                    title: "设备名称",
                    fieldName: "equName",
                    filterType: "text",
                    width: 100
                });
                _this.tableModel.columns = columns1.concat(columns2);
            }

            var enableHSEType = companyBusinessSetState['poolGovern.enableHSEType'] == null ? false : companyBusinessSetState['poolGovern.enableHSEType'].result === '2';
            if(enableHSEType) {
                _this.tableModel.columns.push({
                    title: "HSE类型",
                    fieldName: "hseType",
                    orderName: "hseType",
                    fieldType: "custom",
                    filterType: "enum",
                    filterName: "criteria.intsValue.hseType",
                    popFilterEnum : LIB.getDataDicList("random_observe_hse_type"),
                    render: function (data) {
                        return LIB.getDataDic("random_observe_hse_type",data.hseType);
                    },
                    width: 100
                });
            }
        },
        ready: function () {
            var _this = this;
            if(!LIB.user.compId) {
                this.mainModel.showTempSetting = false;
            }

            var isShowXBGDField = companyBusinessSetState['poolGovern.isShowXBGDField'] == null ? false : companyBusinessSetState['poolGovern.isShowXBGDField'].result === '2';
            if (isShowXBGDField) {
                var dataDicList1 = LIB.getDataDicList('pool_high_risk');
                var dataDicList2 = LIB.getDataDicList('pool_medium_risk');
                var dataDicList3 = LIB.getDataDicList('pool_low_risk');
                var arr = []
                _.each(dataDicList1, function (item) {
                    arr.push([item.id, item.value]);
                })
                _.each(dataDicList2, function (item) {
                    arr.push([item.id, item.value]);
                })
                _.each(dataDicList3, function (item) {
                    arr.push([item.id, item.value]);
                })
                LIB.registerDataDic("pool_judgement_type", arr);

                _this.tableModel.columns.push({
                        title: "检查依据",
                        fieldName: "checkBasis",
                        filterType: "text",
                        width: 100
                    },
                    {
                        title: "一级分类",
                        fieldName: "firstLevel",
                        orderName: "firstLevel",
                        fieldType: "custom",
                        filterType: "enum",
                        filterName: "criteria.intsValue.firstLevel",
                        popFilterEnum: LIB.getDataDicList("pool_first_level"),
                        render: function (data) {
                            return LIB.getDataDic("pool_first_level", data.firstLevel);
                        },
                        width: 100
                    },
                    {
                        title: "二级分类",
                        fieldName: "secondLevel",
                        orderName: "secondLevel",
                        fieldType: "custom",
                        filterType: "enum",
                        filterName: "criteria.intsValue.secondLevel",
                        popFilterEnum: LIB.getDataDicList("pool_second_level"),
                        render: function (data) {
                            return LIB.getDataDic("pool_second_level", data.secondLevel);
                        },
                        width: 100
                    },
                    {
                        title: "低老坏分类",
                        fieldName: "lowOldBadLevel",
                        orderName: "lowOldBadLevel",
                        fieldType: "custom",
                        filterType: "enum",
                        filterName: "criteria.intsValue.lowOldBadLevel",
                        popFilterEnum: LIB.getDataDicList("pool_low_old_bad_level"),
                        render: function (data) {
                            return LIB.getDataDic("pool_low_old_bad_level", data.lowOldBadLevel);
                        },
                        width: 100
                    },
                    {
                        title: "责任人",
                        fieldName: "principalName",
                        filterType: "text",
                        width: 100
                    }, {
                        title: "责任部门/单位",
                        filterName: "criteria.strValue.principalOrgName",
                        orderName: "principalOrgId",
                        filterType: "text",
                        fieldType: "custom",
                        render: function (data) {
                            if (data.principalOrgId) {
                                return LIB.getDataDic("org", data.principalOrgId)["deptName"];
                            }
                        },
                        width: 140
                    }, {
                        title: "风险判定类型",
                        fieldName: "riskJudgementType",
                        orderName: "riskJudgementType",
                        fieldType: "custom",
                        filterType: "enum",
                        filterName: "criteria.intsValue.riskJudgementType",
                        popFilterEnum: LIB.getDataDicList("pool_judgement_type"),
                        render: function (data) {
                            return LIB.getDataDic("pool_judgement_type", data.riskJudgementType);
                        },
                        width: 140
                    }
                );
            }
        },
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});