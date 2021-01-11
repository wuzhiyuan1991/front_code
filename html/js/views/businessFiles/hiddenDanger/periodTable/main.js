define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var detailComponent = require("./detail-xl");
    //导入
    var importProgress = require("componentsEx/importProgress/main");

    var checkTableSelectModal = require("componentsEx/selectTableModal/checkTableSelectModal");

    //Vue数据模型
    var dataModel = function () {
        return {
            moduleCode: "PeriodTable",
            categoryModel: {
                config: [{
                    NodeEdit: true,
                    title: "业务分类",
                    url: "checktabletype/list",
                    type: "business"
                }]
            },
            editResult: false,
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "checktable/list{/curPage}{/pageSize}",
                    selectedDatas: [],

                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                         {
                            //title : "检查表名称",
                            title: "工作表名称",
                            orderName: "name",
                            fieldName: "name",
                            filterType: "text",
                            width: 200
                        }, {
                            //title : "分类",
                            title: "工作表分类",
                            orderName: "checktabletype.name",
                            fieldName: "checkTableType.name",
                            //fieldType:"custom",
                            //render: function(data){
                            //	if(data.checkTableType){
                            //		return data.checkTableType.name;
                            //	}
                            //},
                            filterType: "text",
                            filterName: "criteria.strValue.checkTableTypeName",
                            width: 160
                        }, {
                            //title : "类型",
                            title: this.$t("gb.common.type"),
                            orderName: "type",
                            fieldType: "custom",
                            render: function (data) {
                                return LIB.getDataDic("checkTable_type", data.type);
                            },
                            popFilterEnum: LIB.getDataDicList("checkTable_type"),
                            filterType: "enum",
                            filterName: "criteria.strsValue.type",
                            width: 120
                        },
                        LIB.tableMgr.column.disable,
                        LIB.tableMgr.column.company,
                        {
                            title : "风险点类型",
                            orderName: "checkObjType",
                            fieldType: "custom",
                            render: function (data) {
                                return LIB.getDataDic("check_obj_risk_type", data.checkObjType);
                            },
                            popFilterEnum: LIB.getDataDicList("check_obj_risk_type"),
                            filterType: "enum",
                            filterName: "criteria.strsValue.checkObjType",
                            width: 150
                        },
                        LIB.tableMgr.column.createDate,
                        LIB.tableMgr.column.modifyDate
                    ],
                    defaultFilterValue : {"bizType" : 'job'},
                }
            ),
            //控制全部分类组件显示
            mainModel: {
                //显示分类
                showCategory: false,
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: []
            },
            detailModel: {
                //控制编辑组件显示
                title: "新增",
                //显示编辑弹框
                show: false,
                //编辑模式操作类型
                type: "create",
                id: null
            },
            selectModel: {
                checkTableSelectModel: {
                    visible: false
                }
            },
            uploadModel: {
                url: "/checktable/importExcel"
            },
            exportModel: {
                url: "/checktable/exportExcel"
            },
            templete: {
                url: "/checktable/file/down"
            },
            importProgress: {
                show: false
            },
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
        data: dataModel,
        components: {
            "detailcomponent": detailComponent,
            "importprogress": importProgress,
            "checkTableSelectModal" : checkTableSelectModal
        },
        methods: {
            doShowCheckTableSelectModal: function () {
                this.selectModel.checkTableSelectModel.visible = true;
            },
            doSaveEmerTables: function(selectedDatas) {
                if (selectedDatas) {
                    var _this = this;
                    var data = _.map(selectedDatas, function(table){
                       return {checkTable: {id: table.id}};
                    });
                    this.$api.addToEmer(data).then(function(res){
                        _this.refreshMainTable();
                    });
                }
            },
            doRemoveFromEmer: function() {
                var _this = this;
                var rows = _this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量移除数据");
                    return
                }
                var ids = _.map(rows, function(table){
                    return table.id;
                });
                this.$api.removeFromEmer(null, ids).then(function(res){
                    _this.refreshMainTable();
                });
            },
            doImport: function () {
                this.importProgress.show = true;
            },
            //根据分类查询
            doCategoryChange: function (obj) {
                //根据业务分类查询
                var data = {};
                data.columnFilterName = "checkTableTypeId";
                data.columnFilterValue = obj.nodeId;
                this.emitMainTableEvent("do_query_by_filter", {type: "save", value: data});

            },
            doEnableDisable: function () {
                var _this = this;
                var rows = _this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量启用停用数据");
                    return
                }
                var updateIds = rows[0].id, disable = rows[0].disable;
                //0启用，1禁用
                if (disable == 0) {
                    api.batchDisable(null, [updateIds]).then(function (res) {
                        // _.each(rows, function (row) {
                        //     row.disable = '1';
                        // });
                        // _this.emitMainTableEvent("do_update_row_data", {opType: "update", value: rows});
                        _this.refreshMainTable();
                        LIB.Msg.info("停用成功!");
                    });
                } else {
                    api.batchEnable(null, [updateIds]).then(function (res) {
                        // _.each(rows, function (row) {
                        //     row.disable = '0';
                        // });
                        // _this.emitMainTableEvent("do_update_row_data", {opType: "update", value: rows});
                        _this.refreshMainTable();
                        LIB.Msg.info("启用成功!");
                    });
                }
            },
        },
        //响应子组件$dispatch的event
        events: {},
        init: function () {
           this.$api = api;
        },
    });

    return vm;
});