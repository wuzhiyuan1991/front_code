define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
	var detailPanel = require("./detail-xl");

    var initDataModel = function () {
        return {
            moduleCode: "SDSEDIT",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "richeckresult/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        {
                            //巡检结果名称
                            title: "名称",
                            fieldName: "name",
                            // filterType: "text",
                            width: 300,
                            fieldType: "link",
                            fixed: true
                        },
                        {
                            title: "产品类型",
                            fieldName: "isRight",
                            fieldType: "custom",
                            render: function (data) {
                                return LIB.getDataDic("iri_check_result_is_right", data.isRight);
                            },
                            width: 120
                        },
                        {
                            //是否默认选项 0:否,1:是
                            title: "供应商名称",
                            fieldName: "supplier",
                            width: 200
                        },
                        {
                            title: "用途",
                            fieldName: "usage"
                        },
                        {
                            title: "运输类型"
                        },
                        {
                            title: "UN编号",
                            fieldName: "unNumber"
                        },
                        {
                            title: "运输名称"
                        }

                    ],
                    defaultFilterValue : {"criteria.orderValue" : {fieldName : "orderNo", orderType : "0"}},
                    values: [
                        {
                            name: "炭黑",
                            supplier: "中联橡胶股份有限公司",
                            usage: "用作橡胶和塑料制品中的填料，着色剂/颜料，渗碳剂和还原剂以及耐火材料添加剂",
                            unNumber: "不适用"
                        }
                    ]
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/riCheckResult/importExcel"
            },
            exportModel: {
                url: "/riCheckResult/exportExcel"
            },
            resultKey: '1'
        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel
        },
        methods: {

            _refreshTable: function () {
                var param = [];
                param.push({
                    type: "save",
                    value : {
                        columnFilterName : "isRight",
                        columnFilterValue : this.resultKey
                    }
                });
                this.$refs.mainTable.doQueryByFilter(param);
            },
            doChangeKey: function (key) {
                this.resultKey = key;
                this._refreshTable();
            },
            doMoveRow: function(item) {
                var _this = this;
                var data = item.entry.data;
                var param = {
                    id : data.id
                };
                _.set(param, "criteria.intValue.offset", item.offset);
                api.order(null, param).then(function() {
                    _this.$refs.mainTable.doRefresh('noScrollToTop');
                });
            },
            doTableCellClick: function(data) {
                if (!!this.showDetail && data.cell.fieldName === "name") {
                    this.showDetail(data.entry.data);
                } else {
                    (!!this.detailModel) && (this.detailModel.show = false);
                }
            },
            //新增方法,滑出新增页面
            doAdd: function() {
                this.$broadcast('ev_dtReload', "create", null, {isRight: this.resultKey});
                this.detailModel.show = true;
            },
        },
        events: {},
        init: function () {
            this.$api = api;
        },
        ready: function () {
        }
    });

    return vm;
});
