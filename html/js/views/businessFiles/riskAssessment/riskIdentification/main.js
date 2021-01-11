define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"
    //编辑弹框页面bip (big-info-panel)
    //	var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
    //编辑弹框页面bip (big-info-panel) Legacy模式

    var detailPanel = require("./detail-tab-xl"); //修改 detailPanelClass : "large-info-aside"
    //导入
    var importProgress = require("componentsEx/importProgress/main");
    //Legacy模式
    var riskIdentificationFormModal = require("componentsEx/formModal/riskIdentificationFormModal");

    LIB.registerDataDic("ira_risk_identification_control_unit", [
        ["1", "基层单位"],
        ["2", "二级单位"],
        ["3", "公司机关"]
    ]);

    LIB.registerDataDic("ira_risk_identification_existence_state", [
        ["1", "正常"],
        ["2", "异常"],
        ["3", "紧急"]
    ]);

    LIB.registerDataDic("ira_risk_identification_existence_tense", [
        ["1", "过去"],
        ["2", "现在"],
        ["3", "将来"]
    ]);

    LIB.registerDataDic("ira_risk_identification_is_important_danger", [
        ["0", "否"],
        ["1", "是"]
    ]);

    LIB.registerDataDic("ira_risk_identi_controlmeasures_type", [
        ["1", "技术措施"],
        ["2", "管理措施"],
        ["3", "个人防护"],
    ]);

    LIB.registerDataDic("ira_risk_identification_hse_type", [
        ["1", "健康"],
        ["2", "安全"],
        ["3", "环境"]
    ]);
    var dataDicList1 = LIB.getDataDicList('risk_hse_evalu_method');
    var dataDicList2 = LIB.getDataDicList('risk_integrity_evalu_method');
    var dataDicList3 = LIB.getDataDicList('risk_supervise_evalu_method');
    var arr = [];
    _.each(dataDicList1, function (item) {
        arr.push([item.id, item.value]);
    })
    _.each(dataDicList2, function (item) {
        var number = _.findIndex(arr, item.id);
        if (number == -1) {
            arr.push([item.id, item.value]);
        }
    })
    _.each(dataDicList3, function (item) {
        var number = _.findIndex(arr, item);
        if (number == -1) {
            arr.push([item.id, item.value]);
        }
    })
    LIB.registerDataDic("risk_evalu_method", arr);
    // var typeList = [];
    // api.getTypeList().then(function (res) {
    // 	typeList = res.data;
    // })
    var initDataModel = function () {
        return {
            showMainPanel: true,
            moduleCode: "riskIdentification",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                // detailPanelClass : "middle-info-aside"
                detailPanelClass: "large-info-aside",
                bizType: null
            },
            filterTabId: 'all',
            tableModel: LIB.Opts.extendMainTableOpt({
                url: "riskidentification/list{/curPage}{/pageSize}",
                selectedDatas: [],
                columns: [
                    LIB.tableMgr.column.cb,
                    // LIB.tableMgr.column.code,
                    // LIB.tableMgr.column.disable,

                    {
                        title: "编号",
                        fieldName: "number",
                        fieldType: "link",
                        fixed: true,
                        filterType: "text"
                    },
                    {
                        title: "code",
                        fieldName: "code",
                        visible: false
                    },
                    LIB.tableMgr.column.company,
                    LIB.tableMgr.column.dept,
                    // {
                    // 	//设备设施分类
                    // 	title: "设备分类",
                    // 	fieldName: "equipmentType.name",
                    // 	filterName: "criteria.strValue.equipmentType_name",
                    // 	orderName: "equipmentType.name",
                    // 	filterType: "text"
                    // },
                    {
                        title: this.$t("bd.hal.equipmentType"),
                        fieldName: "equipmentType.name",
                        filterType: "text",
                        filterName: "criteria.strValue.equipmentTypeName",
                        orderName: "equipmenttype.id",
                        width: 160,
                        'renderClass': "textarea",
                        fieldType: "custom",
                        render: function (data) {
                            if (data && data.equipmentType) {
                                if (data.equipmentType.attr4) {
                                    return data.equipmentType.attr4;
                                } else {
                                    return data.equipmentType.name
                                }
                            } else {
                                return "";
                            }
                        },
                    },
                    {
                        //区域
                        title: "区域",
                        fieldName: "region",
                        'renderClass': "textarea",
                        filterType: "text"
                    },
                    {
                        //涉及岗位
                        title: "涉及岗位",
                        fieldName: "position",
                        filterType: "text"
                    },
                    {
                        //活动产品服务
                        title: "活动产品服务",
                        fieldName: "activeProductService",
                        filterType: "text"
                    },
                    {
                        //变更管理
                        title: "变更管理",
                        fieldName: "changeManage",
                        filterType: "text"
                    },
                    {
                        //后果分析
                        title: "后果分析",
                        fieldName: "aftermathAnalyze",
                        filterType: "text"
                    },
                    {
                        //事件学习
                        title: "事件学习",
                        fieldName: "eventLearn",
                        filterType: "text"
                    },
                    {
                        //其他活动
                        title: "其他活动",
                        fieldName: "otherActive",
                        filterType: "text"
                    },
                    {
                        //危害因素种类
                        title: "危害因素种类",
                        fieldName: "hazardType",
                        filterType: "text"
                    },
                    {
                        //危害因素成因
                        title: "危害因素成因",
                        fieldName: "hazardCause",
                        'renderClass': "textarea",
                        filterType: "text"
                    },
                    {
                        //存在状态 1:正常,2:异常,3:紧急
                        title: "存在状态",
                        fieldName: "existenceState",
                        orderName: "existenceState",
                        filterName: "criteria.intsValue.existenceState",
                        filterType: "enum",
                        fieldType: "custom",
                        popFilterEnum: LIB.getDataDicList("ira_risk_identification_existence_state"),
                        render: function (data) {
                            return LIB.getDataDic("ira_risk_identification_existence_state", data.existenceState);
                        }
                    },
                    {
                        //存在时态 1:过去,2:现在,3:将来
                        title: "存在时态",
                        fieldName: "existenceTense",
                        orderName: "existenceTense",
                        filterName: "criteria.intsValue.existenceTense",
                        filterType: "enum",
                        fieldType: "custom",
                        popFilterEnum: LIB.getDataDicList("ira_risk_identification_existence_tense"),
                        render: function (data) {
                            return LIB.getDataDic("ira_risk_identification_existence_tense", data.existenceTense);
                        }
                    },
                    {
                        title: "风险评价",
                        fieldName: "riskLevel",
                        orderName: "riskLevel",
                        filterType: 'text',
                        width: 120,
                        fieldType: "custom",
                        showTip: false,
                        render: function (data) {
                            var resultColor = _.propertyOf(JSON.parse(data.riskModel))("resultColor");
                            if (resultColor) {
                                return "<span style='background:\#" + resultColor + ";color:\#" + resultColor + ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + data.riskLevel;
                            } else {
                                return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + data.riskLevel;
                            }
                        },
                    },
                    {
                        //是否危险重要 0:否,1:是
                        title: "重要危险",
                        fieldName: "isImportantDanger",
                        orderName: "isImportantDanger",
                        filterName: "criteria.intsValue.isImportantDanger",
                        filterType: "enum",
                        fieldType: "custom",
                        popFilterEnum: LIB.getDataDicList("ira_risk_identification_is_important_danger"),
                        render: function (data) {
                            return LIB.getDataDic("ira_risk_identification_is_important_danger", data.isImportantDanger);
                        }
                    },
                    {
                        //风险管控单位 1:基层单位,2:二级单位,3:公司机关
                        title: "风险管控单位",
                        fieldName: "controlUnit",
                        orderName: "controlUnit",
                        filterName: "criteria.intsValue.controlUnit",
                        filterType: "enum",
                        fieldType: "custom",
                        popFilterEnum: LIB.getDataDicList("ira_risk_identification_control_unit"),
                        render: function (data) {
                            return LIB.getDataDic("ira_risk_identification_control_unit", data.controlUnit);
                        }
                    },
                    // {
                    // 	//剩余风险评价等级
                    // 	title: "剩余风险评价",
                    // 	fieldName: "residualRiskLevel",
                    // 	filterType: "text"
                    // },
                    {
                        title: "剩余风险评价",
                        fieldName: "residualRiskLevel",
                        orderName: "residualRiskLevel",
                        filterType: 'text',
                        width: 140,
                        fieldType: "custom",
                        showTip: false,
                        render: function (data) {
                            var resultColor = _.propertyOf(JSON.parse(data.residualRiskModel))("resultColor");
                            if (resultColor) {
                                return "<span style='background:\#" + resultColor + ";color:\#" + resultColor + ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + data.residualRiskLevel;
                            } else if (data.residualRiskLevel) {
                                return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + data.residualRiskLevel;
                            } else {
                                return ""
                            }
                        },
                    },

                    {
                        //评估方法
                        title: "评估方法",
                        fieldName: "evaluMethod",
                        orderName: "evaluMethod",
                        filterName: "criteria.intsValue.evaluMethod",
                        filterType: "enum",
                        fieldType: "custom",
                        popFilterEnum: LIB.getDataDicList("risk_evalu_method"),
                        render: function (data) {
                            return LIB.getDataDic("risk_evalu_method", data.evaluMethod);
                        }
                    },
                    LIB.tableMgr.column.remark,
                ]
            }),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/riskidentification/importExcel"
            },
            exportModel: {
                url: "/riskidentification/exportExcel",
                withColumnCfgParam: true
            },
            templete: {
                url: "/riskidentification/file/down"
            },
            importProgress: {
                show: false
            },
            //Legacy模式
            formModel: {
                riskIdentificationFormModel: {
                    show: false,
                    equipmentType: null,
                }
            },
            updateOption: {
                state: 'mian'
            },
            // addEquipmentSelectedData: []
        };
    }

    var vm = LIB.VueEx.extend({
        // mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        //Legacy模式
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainLegacyPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
            // Legacy模式
            "riskidentificationFormModal": riskIdentificationFormModal,

        },

        methods: {
            doTableCellClick: function (data) {
                if (!!this.showDetail && data.cell.fieldName === "number") {
                    this.showDetail(data.entry.data);
                } else {
                    (!!this.detailModel) && (this.detailModel.show = false);
                }
            },
            doImport: function () {
                var hseType = null;
                if (this.mainModel.bizType == 1) { //hse风险校验
                    if (this.filterTabId == 'all') {
                        LIB.Msg.warning("请选择对应的HSE类型");
                        return;
                    }
                    if (this.filterTabId == 'Health') {
                        hseType = 1;
                    }
                    if (this.filterTabId == 'Safety') {
                        hseType = 2;
                    }
                    if (this.filterTabId == 'Environment') {
                        hseType = 3;
                    }
                }
                var url = "/riskidentification/importExcel?bizType=1&hseType=1";
                if (this.mainModel.bizType) {
                    if (hseType) {
                        url = "/riskidentification/importExcel?bizType=" + this.mainModel.bizType + "&hseType=" + hseType;
                    } else {
                        url = "/riskidentification/importExcel?bizType=" + this.mainModel.bizType;
                    }
                }
                this.$broadcast("ev_update_url", url);
                this.importProgress.show = true;
            },
            //Legacy模式
            doAdd: function (data) {
                var _this = this;
                this.updateOption.state = 'main';
                var equipmentTypeId = this.$route.query.equipmentTypeId;
                if (equipmentTypeId) {
                    this.formModel.riskIdentificationFormModel.equipmentType = {
                        id: equipmentTypeId
                    };
                }
                this.formModel.riskIdentificationFormModel.show = true;
                this.formModel.riskIdentificationFormModel.title = "新增";
                this.formModel.riskIdentificationFormModel.type = "create";
                this.formModel.riskIdentificationFormModel.id = null;
                this.showMainPanel = false
                this.$nextTick(function () {
                    _this.$broadcast('ev_editReload', null);
                    _this.showMainPanel = true
                })

            },
            doSaveRiskIdentification: function (data, type) {
                if (data.id && type == 'update') {
                    this.$broadcast("ev_dtReload", "view", data.id);
                }
                if (this.updateOption.state == 'detail') {
                    this.formModel.riskIdentificationFormModel.show = false;
                    this.$broadcast("do-update-detail", data)
                    return;
                }
                // this.$broadcast("ev_dtReload", "view", data.id);
                this.refreshMainTable();
                this.formModel.riskIdentificationFormModel.show = false;

            },
            doUpdate: function (row) {
                this.updateOption.state = 'main';
                this.formModel.riskIdentificationFormModel.show = true;
                this.formModel.riskIdentificationFormModel.title = "修改";
                this.formModel.riskIdentificationFormModel.type = "update";
                this.formModel.riskIdentificationFormModel.id = row.id;
                this.$broadcast('ev_editReload', row.id);
            },
            doUpdateDetail: function (row) {
                this.updateOption.state = 'detail';
                this.doUpdate(row);
            },
            doUpdateModel: function () {
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量修改数据");
                    return;
                }
                var row = rows[0];
                this.updateOption.state = 'main';
                this.doUpdate(row);
            },
            initData: function () {
                var _this = this;
                this.mainModel.bizType = this.$route.query.bizType;
                var params = [];
                if (this.mainModel.bizType) {
                    params.push({
                        value: {
                            columnFilterName: "criteria.intsValue",
                            columnFilterValue: {
                                bizType: [_this.mainModel.bizType]
                            }
                        },
                        type: "save"
                    });
                    params.push({
                        value: {
                            columnFilterName: "criteria.strValue",
                            columnFilterValue: {
                                bizType: _this.mainModel.bizType
                            }
                        },
                        type: "save"
                    });
                } else {
                    params.push({
                        value: {
                            columnFilterName: "criteria.intsValue",
                            // columnFilterValue: {bizType: [_this.mainModel.bizType]}
                        },
                        type: "remove"
                    });
                    params.push({
                        value: {
                            columnFilterName: "criteria.strValue",
                            // columnFilterValue: {bizType: [_this.mainModel.bizType]}
                        },
                        type: "remove"
                    });
                }
                if (this.mainModel.bizType != "1" && (_this.filterTabId != "todo" && _this.filterTabId != "all" && _this.filterTabId != "toImplement")) {
                    _this.filterTabId = "all";
                }
                params.push({
                    value: {
                        columnFilterName: "criteria.strValue.filterFlag",
                        columnFilterValue: _this.filterTabId,
                    },
                    type: "save"
                });
                this.$refs.mainTable.doQueryByFilter(params);
            },
            doFilterByHseType: function (status) {
                this.filterTabId = status;
                this._normalizeFilterParam(status);
            },
            _normalizeFilterParam: function (status) {
                var params = [];
                params.push({
                    value: {
                        columnFilterName: "criteria.strValue.filterFlag",
                        columnFilterValue: status
                    },
                    type: "save"
                });
                this.$refs.mainTable.doQueryByFilter(params);
            },
        },
        events: {
            // sendRiskIdentificationEquipment: function (selectData) {
            //     console.log(selectData)
            //     this.addEquipmentSelectedData = selectData
            // }
        },
        init: function () {
            this.$api = api;
        },
        // ready:function () {debugger
        // 	if(this.$route.query.code) {
        // 		var codeColumn = this.tableModel.columns.filter(function (item) {
        // 			return item.fieldName === "code";
        // 		});
        // 		if(codeColumn.length === 1) {
        // 			this.$refs.mainTable.doOkActionInFilterPoptip(null, codeColumn[0], this.$route.query.code);
        // 		}
        // 		this.showDetail({id: this.$route.query.id});
        // 		this.clearGoToInfoData();
        // 	}
        // },
        route: {
            activate: function (transition) {
                var queryObj = transition.to.query;
                if (queryObj.method) {
                    if (queryObj.id && queryObj.code && queryObj.method === "detail") {
                        var codeColumn = this.tableModel.columns.filter(function (item) {
                            return item.fieldName === "code";
                        });
                        if (codeColumn.length === 1) {
                            this.$refs.mainTable.doOkActionInFilterPoptip(null, codeColumn[0], this.$route.query.code);
                        }
                        this.showDetail({
                            id: this.$route.query.id
                        });
                        this.clearGoToInfoData();
                    }
                }
                transition.next();
            }
        }
    });

    return vm;
});