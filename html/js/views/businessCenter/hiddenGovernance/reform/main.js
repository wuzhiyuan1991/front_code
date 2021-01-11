define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
var isMustPictures = true
    var sumMixin = require("../sumMixin");
    //右侧滑出详细页
    var detailComponent = require("../detail");
    //整改弹框页面
    var reformSuccess = require("./dialog/reformSuccess");
    //委托弹框页面
    var poolDelegateComponent = require("../dialog/poolDelegate");
    //整改受阻弹框页面
    var reformFailure = require("./dialog/reformFailure");
    var exportTemplate = require("componentsEx/exportTemplate/index");
    var companyBusinessSetState = LIB.getCompanyBusinessSetState();
    //Vue数据模型
    var dataModel = function () {
        var _this = this;
        var columsCfg = LIB.setting.fieldSetting["BC_HaG_HazR"] ? LIB.setting.fieldSetting["BC_HaG_HazR"] : [];

        var renderTableModel = _.bind(LIB.tableRenderMgr.renderModel, _this, columsCfg);
        return {

            moduleCode: LIB.ModuleCode.BC_HaT_HazT,
            tableModel: LIB.Opts.extendMainTableOpt(renderTableModel(
                {
                    url: "pool/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                        }, {
                            //title: "标题",
                            title: this.$t("gb.common.code"),
                            fieldName: "title",
                            fieldType: "link",
                            filterName: "criteria.strValue.title",
                            filterType: "text",
                            width: '200px'
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
                            renderClass: "textarea",
                            filterType: "text"
                        },
                        {
                            title: this.$t("gb.common.latentDefect"),
                            fieldName: "latentDefect",
                            filterType: "text"
                        },
                        {
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
                            //title: "隐患等级",
                            title: this.$t("hag.hazc.hiddenGrade"),
                            orderName: "type",
                            fieldType: "custom",
                            filterType: "enum",
                            filterName: "criteria.strsValue.riskType",
                            popFilterEnum: LIB.getDataDicList("risk_type"),
                            render: function (data) {
                                return LIB.getDataDic("risk_type", data.riskType);
                            }
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
                                        //return riskLevel.result;
                                        if (resultColor) {
                                            return "<span style='background:\#" + resultColor + ";color:\#" + resultColor + ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + riskLevel.result;
                                        } else {
                                            return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + riskLevel.result;
                                        }
                                    }  else if (data.riskLevelResult) {
                                        var resultColor = LIB.getDataDic("risk_level_result_color", data.riskLevelResult);
                                        return "<span style='background:" + resultColor + ";color:" + resultColor + ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + LIB.getDataDic("risk_level_result", data.riskLevelResult);

                                    } else {
                                        return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + "无";
                                    }
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
                            }
                        }
                    ],
                    defaultFilterValue: {"status": "2"}
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
            reformSuccess: {
                //控制编辑组件显示
                title: "整改",
                //显示编辑弹框
                show: false,
                id: null,
                isMustPictures: false,
            },
            reformFail: {
                //控制编辑组件显示
                title: "整改受阻,流程重新流转到原始指派人?",
                //显示编辑弹框
                show: false,
                id: null
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
                //整改按钮
                reformSuccessButton: false,
                //整改受阻按钮
                reformFailButton: false
            },
            poolId: null,
            exportModel: {
                url: "/pool/exportExcel"
            },
            templateModel: {
                visible: false
            }
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
        template: tpl,
        mixins: [sumMixin, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        components: {
            "reform-success": reformSuccess,
            "reform-failure": reformFailure,
            "pool-delegate-component": poolDelegateComponent,
            "detail-component": detailComponent,
            "export-template": exportTemplate
        },
        data: dataModel,
        methods: {
            doCategoryChange: function (obj) {
//            	if(obj.categoryType == "xxx") {
//            	}
            },
            doTableCellClick: function (data) {
                if (data.cell.fieldName == "title") {
                    this.showDetail(data.entry.data);
                } else {
                    this.detailModel.show = false;
                }
            },
            doClose: function () {
                this.$broadcast('ev_verifyDelPlay');
            },
            //显示详情
            showDetail: function (row) {
                this.detailModel.show = true;
                this.$broadcast('ev_detailDataReload', row.id);
                this.$broadcast('ev_detailButton', {
                    reformButton: this.hasAuth('reformDone'),
                    cancelButton: this.hasAuth('reformDelete'),
                    delegateButton: this.hasAuth('reformDelegate'),
                    reformFailButton: this.hasAuth('reformFail')
                })
            },
            //显示全部分类
            doShowCategory: function () {
                this.mainModel.showCategory = !this.mainModel.showCategory;
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
            //整改受阻
            doReformFail: function (row) {
                if(!row || !_.isString(row.id)) {
                    var rows = this.tableModel.selectedDatas;
                    if (rows.length > 1) {
                        LIB.Msg.warning("无法批量操作数据");
                        return;
                    }
                    row = rows[0];
                }
                this.reformFail.id = row.id;
                this.reformFail.show = true;
            },
            //整改受阻提交成功
            doReformFailed: function () {
                this.reformFail.id = null;
                this.reformFail.show = false;
                this.detailModel.show = false;
                this.refreshGrid();
            },
            //整改
            doReform: function (row) {
                if(!row || !_.isString(row.id)) {
                    var rows = this.tableModel.selectedDatas;
                    if (rows.length > 1) {
                        LIB.Msg.warning("无法批量操作数据");
                        return;
                    }
                    row = rows[0];
                }
                this.reformSuccess.show = true;
                this.reformSuccess.id = row.id;
                this.$broadcast('ev_reformSuccessReload', row, this.reformSuccess.isMustPictures);
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

            },
            refreshGrid: function () {
                this.emitMainTableEvent("do_update_row_data", {opType: "remove", value: this.tableModel.selectedDatas});
            },
            showTemplateSetting: function () {
                this.templateModel.visible = true;
            },
            getPoolGovernConfig:  function (){
                var _this = this;
                api.getPoolGovernConfig().then(function (res) {
                    _.forEach(res.data.children, function (item) {
                        if (item.name === "isMustPictures") {
                            _this.reformSuccess.isMustPictures = item.result === '2';
                        }
                    });
                })
            },
        },

        //响应子组件$dispatch的event
        events: {
            //edit框点击保存后事件处理
            "ev_reformFinshed": function () {
                this.refreshGrid();
                this.reformSuccess.show = false;
                this.reformFail.show = false;
                this.detailModel.show = false;
            },
            "ev_reformSave": function () {
                this.reformSuccess.show = false;
                this.reformFail.show = false;
                this.detailModel.show = false;
                this.refreshGrid();
            },
            "ev_delegate": function () {
                //重新加载数据
                this.emitMainTableEvent("do_update_row_data", {opType: "add"});
                this.delegateModel.show = false;
            },
            //edit框点击取消后事件处理
            "ev_reformCanceled": function () {
                this.reformSuccess.show = false;
                this.reformFail.show = false;
            },
            //detail框点击关闭后事件处理
            "ev_detailColsed": function () {
                this.refreshGrid();
                this.detailModel.show = false;
            }
        },
        route: {
            activate: function (transition) {
                var queryObj = transition.to.query;
                if (queryObj.id && queryObj.method == "detail" && !!window.isClickPoolReformExecutBtn) {
                    this.detailModel.show = true;
                    this.$broadcast('ev_detailDataReload', queryObj.id);
                    window.isClickPoolReformExecutBtn = false;
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
            if (isShowEquName) {
                var length = _this.tableModel.columns.length;
                var columns1 = _this.tableModel.columns.slice(0, 6);
                var columns2 = _this.tableModel.columns.slice(6, length);
                columns1.push({
                    title: "设备名称",
                    fieldName: "equName",
                    filterType: "text",
                    width: 100
                });
                _this.tableModel.columns = columns1.concat(columns2);
            }

            var enableHSEType = companyBusinessSetState['poolGovern.enableHSEType'] == null ? false : companyBusinessSetState['poolGovern.enableHSEType'].result === '2';
            if (enableHSEType) {
                _this.tableModel.columns.push({
                    title: "HSE类型",
                    fieldName: "hseType",
                    orderName: "hseType",
                    fieldType: "custom",
                    filterType: "enum",
                    filterName: "criteria.intsValue.hseType",
                    popFilterEnum: LIB.getDataDicList("random_observe_hse_type"),
                    render: function (data) {
                        return LIB.getDataDic("random_observe_hse_type", data.hseType);
                    },
                    width: 100
                });
            }
        },
        ready: function () {
            var _this = this;
            if (!LIB.user.compId) {
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