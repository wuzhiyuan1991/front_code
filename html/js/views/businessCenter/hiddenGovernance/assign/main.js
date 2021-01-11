define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("../vuex/api");

    var sumMixin = require("../sumMixin");
    //右侧滑出详细页
    var detailComponent = require("../detail");
    //整改人弹框页面
    // var reformComponent = require("./dialog/reform");
    //隐患处理弹框页面
    var poolTreatmentComponent = require("./dialog/poolTreatment");
    //委托弹框页面
    var poolDelegateComponent = require("../dialog/poolDelegate");
    //导入
    var importProgress = require("componentsEx/importProgress/main");
    var exportTemplate = require("componentsEx/exportTemplate/index");
    var companyBusinessSetState = LIB.getCompanyBusinessSetState();

    //Vue数据模型
    var dataModel = function () {
        var _this = this;

        var columsCfg = LIB.setting.fieldSetting["BC_HaG_HazR"] ? LIB.setting.fieldSetting["BC_HaG_HazR"] : [];

        var renderTableModel = _.bind(LIB.tableRenderMgr.renderModel, _this, columsCfg);

        return {
            moduleCode: LIB.ModuleCode.BC_HaT_TasA,
            tableModel: LIB.Opts.extendMainTableOpt(renderTableModel(
                {
                    url: "pool/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                        },
                        {
                            //title: this.$t("gb.common.code"),
                            title: this.$t("gb.common.code"),
                            fieldName: "title",
                            width: '200px',
                            fieldType: "link",
                            filterName: "criteria.strValue.title",
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
                        {
                            //title: "问题描述",
                            title: this.$t("gb.common.problemDesc"),
                            fieldName: "problem",
                            filterName: "criteria.strValue.problem",
                            renderClass: "textarea",
                            filterType: "text"
                        },
                        {
                            title: this.$t("gb.common.latentDefect"),
                            fieldName: "latentDefect",
                            filterType: "text"
                        }, {
                            //title: "建议措施",
                            title: this.$t("gb.common.recMeasure"),
                            fieldName: "danger",
                            filterName: "criteria.strValue.danger",
                            renderClass: "textarea",
                            filterType: "text"
                        }, {
                            //title: "登记日期",
                            title: this.$t("bc.hal.registratDate"),
                            fieldName: "registerDate",
                            filterType: "date"
                        }, {
                            //title: "风险等级",
                            title: this.$t("gb.common.riskGrade"),
                            orderName: "riskLevel",
                            fieldType: "custom",
                            filterType: "text",
                            filterName: "criteria.strValue.riskLevel",
                            render: function (data) {
                                if (data.riskLevel) {
                                    var riskLevel = JSON.parse(data.riskLevel);
                                    var resultColor = _.propertyOf(JSON.parse(data.riskModel))("resultColor");
                                    if (riskLevel && riskLevel.result) {
                                        if (resultColor) {
                                            return "<span style='background:\#" + resultColor + ";color:\#" + resultColor + ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + riskLevel.result;
                                        } else {
                                            return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + riskLevel.result;
                                        }
                                        //return riskLevel.result;
                                    } else {
                                        return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + "无";
                                        //return "无";
                                    }
                                } else if (data.riskLevelResult) {
                                    var resultColor = LIB.getDataDic("risk_level_result_color", data.riskLevelResult);
                                    return "<span style='background:" + resultColor + ";color:" + resultColor + ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + LIB.getDataDic("risk_level_result", data.riskLevelResult);

                                } else {
                                    return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + "无";
                                }
                            }
                        }, {
                            title: this.$t("gb.common.state"),
                            orderName: "status",
                            fieldType: "custom",
                            filterType: "enum",
                            filterName: "criteria.intsValue.status",
                            popFilterEnum: LIB.getDataDicList("pool_status"),
                            render: function (data) {
                                return LIB.getDataDic("pool_status", data.status);
                            }
                        },{
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
                            }
                        }
                        ],
                    defaultFilterValue: {"status": "11"}
                }
            )),
            //控制全部分类组件显示
            mainModel: {
                //显示分类
                showCategory: false,
                showHeaderTools: false,
                showTempSetting: true
            },
            reformModel: {
                //控制编辑组件显示
                title: "指派",
                //显示编辑弹框
                show: false,
                //编辑模式操作类型
                type: "reform",
                id: null
            },
            processReform: {
                title: "处理隐患",
                //显示编辑弹框
                show: false,
                formType: null,
                poolId: null
            },
            delegateModel: {
                title: "委托",
                //显示编辑弹框
                show: false,
                poolId: null
            },
            detailModel: {
                //控制右侧滑出组件显示
                show: false
            },

            //按钮权限控制
            buttonShow: {
                //导出按钮
                exportButton: false,
                //分配人员
                assignButton: false,
                //否军按钮
                cancelButton: false
            },
            poolId: null,
            exportModel: {
                url: "/pool/exportExcel"
            },
            uploadModel: {
                url: "/pool/importExcel?type=2"
            },
            templete: {
                url: "/pool/file/down?type=2"
            },
            importProgress: {
                show: false
            },
            templateModel: {
                visible: false
            }
        }
    };
    var tpl = LIB.renderHTML(require("text!./main.html"));
    var vm = LIB.VueEx.extend({
        template: tpl,
        mixins: [sumMixin, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        data: dataModel,
        components: {
            // "reform-component": reformComponent,
            "detail-component": detailComponent,
            "pool-treatment-component": poolTreatmentComponent,
            "pool-delegate-component": poolDelegateComponent,
            "export-template": exportTemplate
        },
        methods: {
            doImport: function () {
                this.importProgress.show = true;
            },
            doCategoryChange: function (obj) {
            },
            doTableCellClick: function (data) {
                if (data.cell.fieldName == "title") {
                    this.showDetail(data.entry.data);
                } else {
                    this.detailModel.show = false;
                }
            },

            //显示详情
            showDetail: function (row) {
                this.detailModel.show = true;
                this.$broadcast('ev_detailDataReload', row.id);
                this.$broadcast('ev_detailButton', {
                    auditButton: this.hasAuth('assignReform'),
                    cancelButton: this.hasAuth('assignDelete'),
                    delegateButton: this.hasAuth('assignDelegate')
                })
            },
            //显示全部分类
            doShowCategory: function () {
                this.mainModel.showCategory = !this.mainModel.showCategory;
            },
            //删除方法
            doDelete: function () {
                var _this = this;
                var deleteIds = _.map(this.tableModel.selectedDatas, function (row) {
                    return row.id
                });
                if (deleteIds.length > 1) {
                    LIB.Msg.warning("无法批量删除隐患记录");
                    return;
                }
                LIB.Modal.confirm({
                    title: '删除选中数据?',
                    onOk: function () {
                        api.delete(null, deleteIds).then(function (data) {
                            if (data.data && data.error != '0') {
                                LIB.Msg.warning("删除失败");
                                return;
                            } else {
                                _this.mainModel.showHeaderTools = false;
                                _this.emitMainTableEvent("do_update_row_data", {
                                    opType: "remove",
                                    value: _this.tableModel.selectedDatas
                                });
                                LIB.Msg.success("删除成功");
                            }
                        });
                    }
                });
            },
            //分配人员
            doReform: function () {
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量分配人员");
                    return;
                }
                var row = rows[0];

                this.reformModel.show = true;
                this.reformModel.title = "分配人员";
                this.reformModel.type = "reform";
                this.$broadcast('ev_editReload', row.id);
            },
            doDelegate: function (row) {
                if(!row || !_.isString(row.id)) {
                    var rows = this.tableModel.selectedDatas;
                    if (rows.length > 1) {
                        LIB.Msg.warning("无法批量委托");
                        return;
                    }
                    row = rows[0];
                }
                this.delegateModel.poolId = row.id;
                this.delegateModel.show = true;
            },
            doCloseDelegateModel: function () {
                this.delegateModel.poolId = null;
            },
            doProcessReform: function (id, formType) {
                if (!_.isString(id))  {
                    var rows = this.tableModel.selectedDatas;
                    if (rows.length > 1) {
                        LIB.Msg.warning("无法批量修改数据");
                        return;
                    }
                    var row = rows[0];
                    id = row.id;
                    if ("1" == row.status) {//审批
                        formType = "1"
                    } else {//指派
                        formType = "2"
                    }
                }
                this.processReform.formType = formType
                this.processReform.poolId = id;
                this.processReform.show = true;
            },
            doCloseProcessReform: function () {
                this.processReform.poolId = null;
            },
            showTemplateSetting: function () {
                this.templateModel.visible = true;
            },
            refreshGrid: function () {
                this.emitMainTableEvent("do_update_row_data", {opType: "remove", value: this.tableModel.selectedDatas});
            },
        },
        //响应子组件$dispatch的event
        events: {
            //edit框点击保存后事件处理
            "ev_editFinshed": function () {
                //重新加载数据
                this.emitMainTableEvent("do_update_row_data", {opType: "add"});
                this.reformModel.show = false;
            },
            "ev_delegate": function () {
                //重新加载数据
                this.emitMainTableEvent("do_update_row_data", {opType: "add"});
                this.delegateModel.show = false;
                this.detailModel.show = false;
            },
            //处理隐患点击保存后事件处理
            "ev_processedReform": function () {
                this.processReform.poolId = null; // bug 12825
                //重新加载数据
                this.emitMainTableEvent("do_update_row_data", {opType: "add"});
                this.processReform.show = false;
                this.detailModel.show = false;
            },
            ////edit框点击取消后事件处理
            //"ev_editCanceled": function () {
            //    this.reformModel.show = false;
            //},
            //detail框点击关闭后事件处理
            "ev_detailColsed": function () {
                this.refreshGrid();
                this.detailModel.show = false;
            }
        },
        route: {
            activate: function (transition) {
                var queryObj = transition.to.query;
                if (queryObj.id && queryObj.method == "detail" && queryObj.opt == "isClickPoolAssignExecutBtn") {
                    this.detailModel.show = true;
                    this.$broadcast('ev_detailDataReload', queryObj.id);
                    window.isClickPoolAssignExecutBtn = false;
                }
                if (queryObj.id && queryObj.action == "audit" && queryObj.status) {
                    var formType;
                    if ("1" == queryObj.status) {//审批
                        formType = "1"
                    } else {//指派
                        formType = "2"
                    }
                    this.doProcessReform(queryObj.id, formType);
                }

                transition.next();
            }
        },
        init: function () {
            this.$api = api;
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
        }
    });
    return vm;
});