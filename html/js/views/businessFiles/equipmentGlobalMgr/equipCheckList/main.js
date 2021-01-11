define(function (require) {

    var mainOpt = require("views/businessFiles/hiddenDanger/checkList/main");
    // //基础js
    var LIB = require('lib');
    // var api = require("./vuex/api");
    // //右侧滑出详细页
    var detailComponent = require("./detail-xl");
    // //导入
    var importProgress = require("componentsEx/importProgress/main");

    //Vue数据模型
    var dataModel = function () {
        return {
            moduleCode: "Equipment_CT",
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
                            title: this.$t("gb.common.CheckTableName"),
                            orderName: "name",
                            fieldName: "name",
                            filterType: "text",
                            width: 200
                        }, {
                            //title : "分类",
                            title: this.$t("bd.hal.checkTableClass"),
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
                    ]
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
            }
        }

    };

    //
    // //Vue数据模型
    // var dataModel = mainOpt.options.data;
    // dataModel.tableModel = LIB.Opts.extendMainTableOpt(
    //         {
    //             url: "checktable/list{/curPage}{/pageSize}",
    //             selectedDatas: [],
    //
    //             columns: [
    //                 LIB.tableMgr.column.cb,
    //                 LIB.tableMgr.column.code,
    //                  {
    //                     //title : "检查表名称",
    //                     title: this.$t("gb.common.CheckTableName"),
    //                     orderName: "name",
    //                     fieldName: "name",
    //                     filterType: "text",
    //                     width: 200
    //                 }
    //                 LIB.tableMgr.column.disable,
    //                 LIB.tableMgr.column.company,
    //                 LIB.tableMgr.column.createDate,
    //                 LIB.tableMgr.column.modifyDate
    //             ]
    //         }
    //     );

    // var dataModel = function () {
    //
    //     return mainOpt.options.data;
    // };

        // return {
        //     moduleCode: LIB.ModuleCode.BD_HaI_CheL,
        //     categoryModel: {
        //         config: [{
        //             NodeEdit: true,
        //             title: "业务分类",
        //             url: "checktabletype/list",
        //             type: "business"
        //         }]
        //     },
        //     editResult: false,
        //     tableModel: LIB.Opts.extendMainTableOpt(
        //         {
        //             url: "checktable/list{/curPage}{/pageSize}",
        //             selectedDatas: [],
        //
        //             columns: [
        //                 LIB.tableMgr.column.cb,
        //                 LIB.tableMgr.column.code,
        //                  {
        //                     //title : "检查表名称",
        //                     title: this.$t("gb.common.CheckTableName"),
        //                     orderName: "name",
        //                     fieldName: "name",
        //                     filterType: "text",
        //                     width: 200
        //                 }, {
        //                     //title : "分类",
        //                     title: this.$t("bd.hal.checkTableClass"),
        //                     orderName: "checktabletype.name",
        //                     fieldName: "checkTableType.name",
        //                     //fieldType:"custom",
        //                     //render: function(data){
        //                     //	if(data.checkTableType){
        //                     //		return data.checkTableType.name;
        //                     //	}
        //                     //},
        //                     filterType: "text",
        //                     filterName: "criteria.strValue.checkTableTypeName",
        //                     width: 160
        //                 }, {
        //                     //title : "类型",
        //                     title: this.$t("gb.common.type"),
        //                     orderName: "type",
        //                     fieldType: "custom",
        //                     render: function (data) {
        //                         return LIB.getDataDic("checkTable_type", data.type);
        //                     },
        //                     popFilterEnum: LIB.getDataDicList("checkTable_type"),
        //                     filterType: "enum",
        //                     filterName: "criteria.strsValue.type",
        //                     width: 120
        //                 },
        //                 LIB.tableMgr.column.disable,
        //                 LIB.tableMgr.column.company,
        //                 LIB.tableMgr.column.createDate,
        //                 LIB.tableMgr.column.modifyDate
        //             ]
        //         }
        //     ),
        //     //控制全部分类组件显示
        //     mainModel: {
        //         //显示分类
        //         showCategory: false,
        //         showHeaderTools: false,
        //         //当前grid所选中的行
        //         selectedRow: []
        //     },
        //     detailModel: {
        //         //控制编辑组件显示
        //         title: "新增",
        //         //显示编辑弹框
        //         show: false,
        //         //编辑模式操作类型
        //         type: "create",
        //         id: null
        //     },
        //     uploadModel: {
        //         url: "/checktable/importExcel"
        //     },
        //     exportModel: {
        //         url: "/checktable/exportExcel"
        //     },
        //     templete: {
        //         url: "/checktable/file/down"
        //     },
        //     importProgress: {
        //         show: false
        //     }
        // }

    // };

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
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel, mainOpt],
        data: dataModel,
        components: {
            "detailcomponent": detailComponent,
            "importprogress": importProgress
        },
        methods: {
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
            initData: function () {
                var bizType = this.$route.query.bizType;
                if(bizType){
                    this.templete.url = "/checktable/file/down" + "?bizType="+ bizType;
                    this.uploadModel.url = "/checktable/importExcel" + "?bizType="+ bizType;
                }
                this.mainModel.equipBizType = this.$route.query.equipBizType;

                var params = [];
                //大类型
                params.push({
                    value : {
                        columnFilterName : "bizType",
                        columnFilterValue : bizType
                    },
                    type : "save"
                });

                //大类型
                params.push({
                    value : {
                        columnFilterName : "checkTableTypeId",
                        columnFilterValue : this.mainModel.equipBizType
                    },
                    type : "save"
                });

                this.$refs.mainTable.doQueryByFilter(params);

            },
            // //防止重复调用
            // queryOnServerLazyFunc: _.debounce(function (_this){
            //     if(_this._isReady) {
            //         _this._normalizeFilterParam();
            //     }
            // }),
            //
            // initData : function () {
            //     this.queryOnServerLazyFunc(this);
            //     return false;
            // }

        },
        // //响应子组件$dispatch的event
        // events: {},
        created: function () {
            _.assign(this.$data.tableModel,
                {
                    columns : [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            //title : "检查表名称",
                            title: this.$t("gb.common.CheckTableName"),
                            orderName: "name",
                            fieldName: "name",
                            filterType: "text",
                            width: 200
                        },
                        // {
                        //         //title : "分类",
                        //         title: this.$t("bd.hal.checkTableClass"),
                        //         orderName: "checktabletype.name",
                        //         fieldName: "checkTableType.name",
                        //         //fieldType:"custom",
                        //         //render: function(data){
                        //         //	if(data.checkTableType){
                        //         //		return data.checkTableType.name;
                        //         //	}
                        //         //},
                        //         filterType: "text",
                        //         filterName: "criteria.strValue.checkTableTypeName",
                        //         width: 160
                        //     },
                        // {
                        //         //title : "类型",
                        //         title: this.$t("gb.common.type"),
                        //         orderName: "type",
                        //         fieldType: "custom",
                        //         render: function (data) {
                        //             return LIB.getDataDic("checkTable_type", data.type);
                        //         },
                        //         popFilterEnum: LIB.getDataDicList("checkTable_type"),
                        //         filterType: "enum",
                        //         filterName: "criteria.strsValue.type",
                        //         width: 120
                        //     },
                        LIB.tableMgr.column.disable,
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.createDate,
                        LIB.tableMgr.column.modifyDate
                    ],
                    defaultFilterValue: {"criteria.strsValue": {"checkObjType":["2"]}}
                }
            )
/**

            this.$data.tableModel.columns = [
                    LIB.tableMgr.column.cb,
                    LIB.tableMgr.column.code,
                     {
                        //title : "检查表名称",
                        title: this.$t("gb.common.CheckTableName"),
                        orderName: "name",
                        fieldName: "name",
                        filterType: "text",
                        width: 200
                    },
                // {
                //         //title : "分类",
                //         title: this.$t("bd.hal.checkTableClass"),
                //         orderName: "checktabletype.name",
                //         fieldName: "checkTableType.name",
                //         //fieldType:"custom",
                //         //render: function(data){
                //         //	if(data.checkTableType){
                //         //		return data.checkTableType.name;
                //         //	}
                //         //},
                //         filterType: "text",
                //         filterName: "criteria.strValue.checkTableTypeName",
                //         width: 160
                //     },
                // {
                //         //title : "类型",
                //         title: this.$t("gb.common.type"),
                //         orderName: "type",
                //         fieldType: "custom",
                //         render: function (data) {
                //             return LIB.getDataDic("checkTable_type", data.type);
                //         },
                //         popFilterEnum: LIB.getDataDicList("checkTable_type"),
                //         filterType: "enum",
                //         filterName: "criteria.strsValue.type",
                //         width: 120
                //     },
                    LIB.tableMgr.column.disable,
                    LIB.tableMgr.column.company,
                    LIB.tableMgr.column.createDate,
                    LIB.tableMgr.column.modifyDate
                ];
            // console.log(mainOpt);
            // console.log(mainOpt.options.data.apply(this, null));

            // debugger;
            // if(this.$route.path.indexOf("/randomInspection") == 0) {
            //     this.$api = require("./vuex/randomInspection-api");
            // }else{
            //     this.$api = api;
            // }
 **/
        },
        attached: function () {
            // this.queryOnServerLazyFunc(this);
        }

    });

    return vm;
});