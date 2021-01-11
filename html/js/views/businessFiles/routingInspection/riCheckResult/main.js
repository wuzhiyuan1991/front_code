define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");
//    var ivCheckbox=require('components/iviewCheckbox');
    var initDataModel = function () {
        return {
            moduleCode: "riCheckResult",
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
                    url: "richeckresult/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        // _.extend(LIB.tableMgr.column.code, {filterType: null}),
                        // {
                        //     //序号
                        //     title: "序号",
                        //     fieldName: "orderNo"
                        // },
                        {
                            //巡检结果名称
                            title: "巡检结果名称",
                            fieldName: "name",
                             filterType: "text",
                            width: 300,
                            fieldType: "link",
                            fixed: true
                        },
                        LIB.tableMgr.column.disable,
                        // {
                        //     //是否正确 0:错误,1:正确
                        //     title: "是否正确",
                        //     fieldName: "isRight",
                        //     fieldType: "custom",
                        //     render: function (data) {
                        //         return LIB.getDataDic("iri_check_result_is_right", data.isRight);
                        //     },
                        //     width: 120,
                        //      orderName: "isRight",
                        //      filterName: "criteria.intsValue.isRight",
                        //      filterType: "enum",
                        //      popFilterEnum: LIB.getDataDicList("iri_check_result_is_right"),
                        // },
                        {
                            //是否默认选项 0:否,1:是
                            title: "是否默认选项",
                            fieldName: "isDefault",
                            fieldType: "custom",
                            render: function (data) {
                                var val=LIB.getDataDic("iri_check_result_is_default", data.isDefault);
                                var checked=val==="是";
                                return LIB.getCheckbox(checked);
                                // var checkbox=new ivCheckbox();
                                // checkbox.selected=val==="是";
                                // var $checkbox=checkbox.$mount();
                                // return   $checkbox.$el.outerHTML;
                            },
                             width: 200,
                             orderName: "isDefault",
                             filterName: "criteria.intsValue.isDefault",
                             filterType: "enum",
                             popFilterEnum: LIB.getDataDicList("iri_check_result_is_default"),
                        },
                        {
                            title: "操作",
                            fieldType: "tool",
                            toolType: "move"
                        }

                    ],
                    defaultFilterValue : {"criteria.orderValue" : {fieldName : "orderNo", orderType : "0"}}
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/richeckresult/importExcel"
            },
            exportModel: {
                url: "/richeckresult/exportExcel",
                withColumnCfgParam: true
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
            this._refreshTable();
        }
    });

    return vm;
});
