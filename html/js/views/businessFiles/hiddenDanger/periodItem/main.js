define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("./detail-xl");
    //导入
    var importProgress = require("componentsEx/importProgress/main");



    var initDataModel = function () {
        return {
            moduleCode: "PeriodItem",
            categoryModel: {
                config: [{
                    NodeEdit: true,
                    title: "业务分类",
                    url: "risktype/list",
                    type: "business"
                }]
            },
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                //  detailPanelClass : "middle-info-aside"
                detailPanelClass: "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "checkitem/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            //title : "名称",
                            title: "工作项内容",
                            fieldName: "name",
                            orderName: "name",
                            filterType: "text",
                            width: 450,
                            'renderClass': "textarea",
                        },{
                            title: this.$t("gb.common.riskGrade"),
                            fieldName: "criteria.strValue.riskLevel",
                            filterType: 'text',
                            width: 120,
                            fieldType: "custom",
                            showTip: false,
                            sortable :false,
                            render: function (data) {
                                var resultColor = _.propertyOf(JSON.parse(data.riskModel))("resultColor");
                                if (resultColor) {
                                    return "<span style='background:\#" + resultColor + ";color:\#" + resultColor + ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + _.propertyOf(JSON.parse(data.riskModel))("result");
                                } else {
                                    return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + _.propertyOf(JSON.parse(data.riskModel))("result");
                                }
                            }
                        },{
                            //title : "风险分类",
                            title: "工作项分类",
                            //fieldType : "custom",
                            orderName: "risktype.name",
                            fieldName: "riskType.name",
                            //render: function(data){
                            //	if(data.riskType){
                            //		return data.riskType.name;
                            //	}
                            //},
                            filterType: "text",
                            filterName: "criteria.strValue.riskTypeName",
                            width: 160
                        },
                        {
                            //title : "类型",
                            title: this.$t("gb.common.type"),
                            fieldName: "type",
                            fieldType: "custom",
                            orderName: "type",
                            filterType: "enum",
                            render: function (data) {
                                return LIB.getDataDic("pool_type", [data.type]);
                            },
                            popFilterEnum: LIB.getDataDicList("pool_type"),
                            filterName: "criteria.intsValue.type",
                            width: 80
                        },
                        // {
                        //     title: "隐患等级",
                        //     orderName: "type",
                        //     fieldType: "custom",
                        //     filterType: "enum",
                        //     filterName: "criteria.strsValue.hiddenDangerLevel",
                        //     popFilterEnum: LIB.getDataDicList("risk_type"),
                        //     render: function (data) {
                        //         return LIB.getDataDic("risk_type", data.hiddenDangerLevel);
                        //     },
                        //     width: 120
                        // },
                        // {
                        //     title: "隐患类别",
                        //     orderName: "type",
                        //     fieldType: "custom",
                        //     filterType: "enum",
                        //     filterName: "criteria.intsValue.hiddenDangerType",
                        //     popFilterEnum: LIB.getDataDicList("hidden_danger_type"),
                        //     render: function (data) {
                        //         return LIB.getDataDic("hidden_danger_type", data.hiddenDangerType);
                        //     },
                        //     width: 120
                        // },
                        LIB.tableMgr.column.disable,
                        LIB.tableMgr.column.company,
                        {
                            //title : "描述",
                            title: this.$t('gb.common.remarks'),
                            fieldName: "remarks",
                            orderName: "remarks",
                            filterType: "text",
                            width: 240
                        },
                        LIB.tableMgr.column.createDate,
                        LIB.tableMgr.column.modifyDate
                    ],
                    defaultFilterValue : {"bizType" : 'job'}
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/checkitem/importExcel"
            },
            exportModel: {
                url: "/checkitem/exportExcel"
            },
            templete: {
                url: "/checkitem/file/down"
            },
            importProgress: {
                show: false
            }
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
            doImport: function () {
                var _this = this;
                this.importProgress.show = true;
            },
            doCategoryChange: function (obj) {
                var data = {};
                //条件 后台搜索的 属性
                data.columnFilterName = "riskType.id";
                //条件 后台搜索的 值
                data.columnFilterValue = obj.nodeId;
                this.emitMainTableEvent("do_query_by_filter", {type: "save", value: data});
            },
            //启用停用
            // doEnableDisable: function () {
            //     var _this = this;
            //     var rows = _this.tableModel.selectedDatas;
            //     if (rows.length > 1) {
            //         LIB.Msg.warning("无法批量操作");
            //         return
            //     }
            //     var checkObject = rows[0];
            //     //0启用，1禁用
            //     checkObject.disable = (checkObject.disable == "0")?"1":"0";
            //     api.update(null, _.pick(checkObject, "id","disable")).then(function (res) {
            //         _this.refreshMainTable();
            //         LIB.Msg.info((checkObject.disable == "0")?"停用成功":"启用成功");
            //     });
            // },
            doDetailFinshed: function () {
                this.refreshMainTable();
            }
        },
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
