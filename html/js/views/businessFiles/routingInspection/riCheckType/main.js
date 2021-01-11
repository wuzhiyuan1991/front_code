define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");

    var initDataModel = function () {
        return {
            moduleCode: "riCheckType",
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
                    url: "richecktype/list{/curPage}{/pageSize}",
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
                            title: "巡检类型名称",
                            fieldName: "name",
                            width: 300,
                            fieldType: "link",
                            filterType: "text",
                            fixed: true
                        },
                        LIB.tableMgr.column.disable,
                        LIB.tableMgr.column.modifyDate,
                        LIB.tableMgr.column.createDate,
                        {
                            title : "操作",
                            fieldType : "tool",
                            toolType : "move"
                        }
                    ],
                    defaultFilterValue : {"criteria.orderValue" : {fieldName : "orderNo", orderType : "0"}}
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/richecktype/importExcel"
            },
            exportModel: {
                url: "/richecktype/exportExcel",
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
        methods: {
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
            }
        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
