define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("../vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    var actions = require("app/vuex/actions");
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    //转隐患弹框页面
    var convertComponent = require("./convert");
    var sumMixin = require("../mixin/sumMixin");

    var initDataModel = function () {
        return {
            moduleCode: 'BC_Hal_RanO_TODO',
            //控制全部分类组件显示
            mainModel: {
                businessLists: [],
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "middle-info-aside"
                //				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "radomobser/list{/curPage}{/pageSize}?_bizModule=todo",
                    selectedDatas: [],
                    isSingleCheck: false,
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                        },
                        {
                            title: this.$t("gb.common.code"),
                            fieldName: "code",
                            width: 150,
                            orderName: "code",
                            fieldType: "link",
                            filterType: "text"
                        },
                        {
                            title: "现场情况描述",
                            orderName: "content",
                            fieldName: "content",
                            filterType: "text",
                            renderClass: "textarea",
                            width: 250
                        },
                        {
                            title: this.$t("gb.common.checkUser"),
                            orderName: "publisherId",
                            fieldName: "user.username",
                            filterType: "text",
                            filterName: "criteria.strValue.username",
                            width: 140
                        },
                        {
                            title: this.$t("gb.common.checkTime"),
                            fieldName: "checkDate",
                            filterType: "date",
                            width: 140
                        },
                        LIB.tableMgr.column.dept,
                        {
                            title: "属地",
                            orderName: "dominationAreaId",
                            fieldName: "dominationArea.name",
                            filterType: "text",
                            width: 120
                        },
                        // {
                        //     title: "检查对象",
                        //     orderName: "ifnull(e.check_object_id,e.equipment_id)",
                        //     fieldName: "checkObj.name",
                        //     filterType: "text",
                        //     width: 150
                        // },
                        LIB.tableMgr.column.company,
                        {
                            title: this.$t("bc.hal.source"),
                            orderName: "checkSource",
                            fieldName: "checkSource",
                            filterType: "enum",
                            filterName: "criteria.intsValue.checkSource",
                            width: 110
                        },
                        {
                            title: this.$t("bc.hal.dataType"),
                            orderName: "type",
                            fieldName: "type",
                            fieldType: "custom",
                            render: function (data) {
                                return LIB.getDataDic("data_type", data.type);
                            },
                            popFilterEnum: LIB.getDataDicList("data_type"),
                            filterType: "enum",
                            filterName: "criteria.intsValue.type",
                            width: 110
                        },
                        {
                            title: this.$t("gb.common.state"),
                            fieldName: "status",
                            orderName: "status",
                            fieldType: "custom",
                            render: function (data) {
                                return LIB.getDataDic("randomObservation_status", data.status);
                            },
                            popFilterEnum: LIB.getDataDicList("randomObservation_status"),
                            filterType: "enum",
                            filterName: "criteria.intsValue.status",
                            width: 80
                        },
                        {
                            title: this.$t("gb.common.createTime"),
                            fieldName: "createDate",
                            filterType: "date",
                            width: 140
                        },
                        {
                            title: this.$t("gb.common.modifyTime"),
                            fieldName: "modifyDate",
                            filterType: "date",
                            width: 140
                        }
                    ],
                    //defaultFilterValue : {"criteria.orderValue" : {fieldName : "createDate", orderType : "1"}}
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/radomobser/importExcel"
            },
            exportModel: {
                url: "/radomobser/exportExcel",
                visible: false,
                title: '导出',
                exportType: "0",
                withColumnCfgParam: true
            },
            convertModel: {
                //控制转隐患组件显示
                title: "审批",
                //显示转隐患弹框
                show: false,
                id: null
            },
            undoCount: 0,

        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel, sumMixin],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
            "convertComponent": convertComponent

        },
        methods: {
            //提交
            doSubmit: function (row) {
                var _this = this;
                if (!row || !_.isString(row.id)) {
                    var rows = this.tableModel.selectedDatas;
                    if (rows.length > 1) {
                        LIB.Msg.warning("无法批量操作数据");
                        return;
                    }
                    row = rows[0];
                }
                if (row.type == 2) {
                    LIB.Msg.warning("当前记录无法提交!");
                    return;
                }
                //判断是否已转隐患
                if (row.status != 0) {
                    LIB.Msg.warning("请选择【待提交】状态的数据!");
                    return;
                }
                // bug 16829 去掉 equipment
                var obj = _.cloneDeep(row);
                delete obj.equipment;

                LIB.Modal.confirm({
                    title: '提交选中数据?',
                    onOk: function () {
                        api.submit(null, obj).then(function (res) {
                            _this.refreshMainTable();
                            _this.onTableDataLoaded();
                            _this.detailModel.show = false;
                            LIB.Msg.info("提交成功!");
                        });
                    }
                });
            },
            //审核
            doConvert: function (row) {
                if (!row || !_.isString(row.id)) {
                    var rows = this.tableModel.selectedDatas;
                    if (rows.length > 1) {
                        LIB.Msg.warning("无法批量操作数据");
                        return;
                    }
                    row = rows[0];
                }
                if (row.type == 2) {
                    LIB.Msg.warning("当前记录无须审核!");
                    return;
                }
                //判断是否已转隐患
                if (row.status != 1) {
                    LIB.Msg.warning("请选择【待审核】状态的数据!");
                    return;
                }
                if (
                    (!row.type && !!this.findByNameResult('requireOperationType'))
                    || (!row.checkItemType && !!this.findByNameResult('requireCheckItemType'))
                    || (!row.operationType && !!this.findByNameResult('requireOperationType'))
                    || (!row.checkLevel && !!this.findByNameResult('requireCheckLevel'))
                    || (!row.dominationAreaId && !!this.findByNameResult('requireArea'))
                    || (!row.hseType && !!this.findByNameResult('requireHSEType'))
                    || !row.orgId
                    || (!row.checkObj && !!this.findByNameResult('requireCheckObj'))
                    || row.orgId == row.compId
                ) {
                    LIB.Msg.warning("请先编辑完善数据后再审核!");
                    this.showDetail(row, { opType: "update" });
                    return;
                }
                this.convertModel.show = true;
                this.convertModel.title = "审核";
                this.convertModel.id = row.id;
                this.$broadcast('ev_convertReload', row);
            },

            findByNameResult: function (name) {
                var arr = this.mainModel.businessLists;
                var obj = _.find(arr, function (item) {
                    return item.name == name && item.result == '2';
                });

                return !!obj || false;
            },
            getBusinessSetting: function () {
                var _this = this;

                api.getBusinessSetting().then(function (res) {
                    _this.mainModel.businessLists = res.data.children;
                    // _this.initRule();
                })
            },
            initRule: function () {
                this.mainModel.rules.checkLevel[0].required = !!this.findByNameResult('requireCheckLevel');
                this.mainModel.rules.operationType[0].required = !!this.findByNameResult('requireOperationType');
                this.mainModel.rules.checkItemType[0].required = !!this.findByNameResult('requireCheckItemType');
                this.mainModel.rules.hseType[0].required = !!this.findByNameResult('requireHSEType');
                this.mainModel.rules.dominationAreaId[0].required = !!this.findByNameResult('requireArea');
                this.mainModel.rules['checkObj.id'][0].required = !!this.findByNameResult('requireCheckObj');
            },

            doConvertFinshed: function () {
                this.convertModel.show = false;
                this.detailModel.show = false;
                this.refreshMainTable();
                this.onTableDataLoaded();
            },
            doDelete: function () {
                if (this.beforeDoDelete() == false) {
                    return;
                }
                var _this = this;
                var deleteIds = _.map(_this.tableModel.selectedDatas, function (row) {
                    return row.id
                });
                var batchNum = this.tableModel.selectedDatas.length;
                api.getTableBatchHandleSetting().then(function (res) {
                    var numer = _.get(res.data, "result");
                    if (batchNum > numer) {
                        LIB.Msg.warning("您已选中的记录数是" + batchNum + ",限额数是" + numer);
                    } else {
                        LIB.Modal.confirm({
                            title: '已选中' + batchNum + '条数据,确定删除数据?',
                            onOk: function () {
                                api.delete(null, deleteIds).then(function (res) {
                                    _this.emitMainTableEvent("do_update_row_data", {
                                        opType: "remove",
                                        value: _this.tableModel.selectedDatas
                                    });
                                    _this.onTableDataLoaded();
                                    LIB.Msg.info(res.data + "条记录已经删除成功");
                                });
                            }
                        });
                    }
                });
            },
            doExportExcel: function () {
                this.exportModel.exportType = "0";
                this.exportModel.visible = true;
            },
            doExport: function () {
                this.exportModel.visible = false;
                var url = "/radomobser/exportExcel/" + this.exportModel.exportType + this._getExportURL() + '&_bizModule=todo';
                window.open(url);
            },
            changeExportType: function () {
                this.exportModel.exportType = this.exportModel.exportType == "0" ? "1" : "0";
            },
            _getExportURL: function () {
                var queryStr = LIB.urlEncode(this.$refs.mainTable.getCriteria());
                var originColumns = _.get(this.tableModel, "columns");
                var columns = window.localStorage.getItem("tb_code_" + this.moduleCode);
                var ret = [];

                if (columns) {
                    columns = JSON.parse(columns);
                    columns = _.filter(columns, function (col) {
                        return col.visible;
                    });
                    var _colsObj = _.indexBy(originColumns, 'title');
                    _.forEach(columns, function (col) {
                        var title = col.title;
                        var obj = _colsObj[title];
                        if (!title || title === "cb" || title === "radio") {
                            return;
                        }
                        if (!_.isPlainObject(obj) || obj.fieldType === 'tool') {
                            return;
                        }
                        ret.push({
                            title: col.title,
                            field: obj.dataDicKey || obj.fieldName
                        })
                    });
                } else {
                    ret = _.filter(originColumns, function (c) {
                        return c.title && c.title !== "cb" && c.title !== "radio" && c.fieldType !== 'tool';
                    })
                    ret = _.map(ret, function (column) {
                        return {
                            title: column.title,
                            field: column.dataDicKey || column.fieldName
                        }
                    });
                }
                var criteria = this.$refs.mainTable.getCriteria();
                if (!!criteria) {
                    var strValue = !!criteria['criteria.strValue'] ? JSON.parse(criteria['criteria.strValue']) : {};
                    _.extend(strValue, { _config: JSON.stringify(ret) });
                    var str = encodeURIComponent(JSON.stringify(strValue));
                    delete criteria['criteria.strValue'];
                    queryStr = LIB.urlEncode(criteria) + '&criteria.strValue=' + str;
                }
                return queryStr.replace("&", "?")
            },
        },
        events: {
            //edit框点击保存后事件处理
            "ev_convertColsed": function () {
                this.convertModel.show = false;
            }
        },
        init: function () {
            this.$api = api;
        },
        ready: function () {
            this.getBusinessSetting();
            if (!!this.$route.query.state) {
                var statusColumn = _.find(this.tableModel.columns, function (item) {
                    return item.fieldName === "status";
                });
                if (!!statusColumn) {
                    if (this.$route.query.state == 1) {
                        this.$refs.mainTable.doOkActionInFilterPoptip(null, statusColumn, ['1']);
                    }
                }
            }
            this.onTableDataLoaded();
            var _this = this;
            if (LIB.getBusinessSetByNamePath('radomObserSet.enableCheckLevel').result === '2') {
                _this.tableModel.columns.push({
                    title: "检查级别",
                    fieldName: "checkLevel",
                    orderName: "checkLevel",
                    fieldType: "custom",
                    filterType: "enum",
                    filterName: "criteria.intsValue.checkLevel",
                    popFilterEnum: LIB.getDataDicList("checkLevel"),
                    render: function (data) {
                        return LIB.getDataDic("checkLevel", data.checkLevel);
                    },
                    width: 100
                });
            }
            if (LIB.getBusinessSetByNamePath('radomObserSet.enableHSEType').result === '2') {
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
            if (LIB.getBusinessSetByNamePath('radomObserSet.enableCheckObj').result == '2') {
                _this.tableModel.columns.splice(5, 0, {
                    title: "检查对象",
                    orderName: "ifnull(e.check_object_id,e.equipment_id)",
                    fieldName: "checkObj.name",
                    filterType: "text",
                    width: 150
                })
            }
        },
        vuex: {
            actions: {
                setGoToInfoData: actions.updateGoToInfoData
            }
        }
    });

    return vm;
});
