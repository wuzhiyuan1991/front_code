define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    var detailPanel = require("./detail-xl");

    var initDataModel = function () {
        return {
            moduleCode: "emergencyPlan",
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
                            title: "预案编号",
                            fieldName: "code",
                            // filterType: "text",
                            fieldType: "link",
                            fixed: true
                        },
                        {
                            //巡检结果名称
                            title: "预案名称",
                            fieldName: "name",
                            // filterType: "text",
                            fixed: true
                        },
                        {
                            title: "总指挥",
                            fieldName: "isRight",
                            width: 120
                        },
                        {
                            //是否默认选项 0:否,1:是
                            title: "副总指挥",
                            fieldName: "supplier",
                            width: 200
                        },
                        {
                            title: "指挥部成员",
                            fieldName: "usage"
                        },
                        {
                            title: "办公机构"
                        },
                        {
                            title: "办公机构负责人",
                            fieldName: "unNumber"
                        },
                        {
                            title: "办公机构成员"
                        },
                        {
                            title: "事故报案常用电话"
                        }
                    ],
                    defaultFilterValue : {"criteria.orderValue" : {fieldName : "orderNo", orderType : "0"}},
                    values: []
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
