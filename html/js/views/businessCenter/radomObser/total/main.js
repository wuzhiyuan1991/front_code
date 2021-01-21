define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("../vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");

    var initDataModel = function () {
        return {
            moduleCode: LIB.ModuleCode.BC_Hal_RanO,
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "middle-info-aside"
                //				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "radomobser/list{/curPage}{/pageSize}",
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
                            width: 115
                        },
                        //{
                        //    title: this.$t("gb.common.checkTime"),
                        //    fieldName: "checkDate",
                        //    filterType: "date",
                        //    width: 140
                        //},
                        LIB.tableMgr.column.dept,
                        {
                            title: "属地",
                            orderName: "dominationAreaId",
                            fieldName: "dominationArea.name",
                            filterType: "text",
                            width: 120
                        },
                        {
                            title: "检查对象",
                            orderName: "ifnull(e.check_object_id,e.equipment_id)",
                            fieldName: "checkObj.name",
                            filterType: "text",
                            width: 150
                        },
                        {
                            title: this.$t("gb.common.checkTime"),
                            fieldName: "checkDate",
                            filterType: "date",
                            width: 140
                        },
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
                        },
                        {
                            title: "审批人",
                            orderName: "attr3",
                            fieldName: "auditor.name",
                            filterType: "text",
                            filterName: "criteria.strValue.auditorName",
                            width: 80
                        },
                        {
                            title: "审批时间",
                            fieldName: "auditDate",
                            filterType: "date",
                            width: 140
                        },
                        {
                            title: "审批意见",
                            orderName: "remarks",
                            fieldName: "remarks",
                            filterType: "text",
                            renderClass: "textarea",
                            width: 250
                        },
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
            convertModel: {
                //控制转隐患组件显示
                title: "转隐患",
                //显示转隐患弹框
                show: false,
                id: null
            },
            exportModel: {
                url: "/radomobser/exportExcel",
                withColumnCfgParam: true,
                visible: false,
                title: '导出',
                exportType: "0"
            },
            filterTabId: "all"

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
            doFilterBySpecial: function (status) {
                this.filterTabId = status;
                this._normalizeFilterParam(status);
            },
            _normalizeFilterParam: function (status) {
                if (status == "all") {
                    status = null;
                } else {
                    status = [status];
                }
                var params = [{
                    value: {
                        columnFilterName: "criteria.intsValue.tabStatus",
                        columnFilterValue: status
                    },
                    type: "save"
                }];
                this.$refs.mainTable.doQueryByFilter(params);
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
                var url = "/radomobser/exportExcel/" + this.exportModel.exportType + this._getExportURL();
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
        init: function () {
            this.$api = api;
        },
        ready: function () {
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
            var _this = this;
            if (LIB.getBusinessSetByNamePath('common.enableCheckLevel').result === '2') {
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
        }
    });

    return vm;
});
