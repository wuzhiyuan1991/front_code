define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    //右侧滑出详细页
    // var detailComponent = require("../detail");
    // //回转风险库弹框页面
    // var riskComponent = require("./dialog/risk");
    //
    // //Vue数据模型
    // var dataModel = function(){
    //     var _this = this;
    //     var columsCfg = LIB.setting.fieldSetting["BC_HaG_HazR"] ? LIB.setting.fieldSetting["BC_HaG_HazR"] : [];
    //
    //     var renderTableModel = _.bind(LIB.tableRenderMgr.renderModel, _this, columsCfg);
    //     return{
    //
    //         moduleCode : LIB.ModuleCode.BC_HaG_HazT,
    //         tableModel:  LIB.Opts.extendMainTableOpt(renderTableModel(
    //             {
    //                 url: "pool/list{/curPage}{/pageSize}",
    //                 selectedDatas: [],
    //                 columns: [{
    //                     title: "",
    //                     fieldName: "id",
    //                     fieldType: "cb",
    //                 }, {
    //                     //title: "编号",
    //                     title: this.$t("gb.common.code"),
    //                     fieldName: "title",
    //                     width:'200px',
    //                     fieldType: "link",
    //                     filterName: "criteria.strValue.title",
    //                     filterType: "text"
    //                 },
    //                     //    {
    //                     //    //title: "受检对象",
    //                     //    title: this.$t("gb.common.subjectObj"),
    //                     //    orderName:"checkObject.name",
    //                     //    fieldName : "checkObject.name",
    //                     //    filterType: "text",
    //                     //    filterName : "criteria.strValue.name",
    //                     //},
    //                     LIB.tableMgr.column.company,
    //                     LIB.tableMgr.column.dept,
    //                     {
    //                         //title: "类型",
    //                         title: this.$t("gb.common.type"),
    //                         orderName: "type",
    //                         fieldType: "custom",
    //                         filterType: "enum",
    //                         filterName: "criteria.intsValue.type",
    //                         popFilterEnum: LIB.getDataDicList("pool_type"),
    //                         render: function (data) {
    //                             return LIB.getDataDic("pool_type", data.type);
    //                         }
    //                     },
    //                     // {
    //                     //     //title: "信息来源",
    //                     //     title: this.$t("gb.common.infoSource"),
    //                     //     orderName: "infoSource",
    //                     //     fieldType: "custom",
    //                     //     filterType: "enum",
    //                     //     filterName: "criteria.intsValue.infoSource",
    //                     //     popFilterEnum: LIB.getDataDicList("info_source"),
    //                     //     render: function (data) {
    //                     //         return LIB.getDataDic("info_source", data.infoSource);
    //                     //     }
    //                     // }, {
    //                     //     //title: "体系要素",
    //                     //     title: this.$t("gb.common.systemElement"),
    //                     //     orderName: "systemElement",
    //                     //     fieldType: "custom",
    //                     //     filterType: "enum",
    //                     //     filterName: "criteria.intsValue.systemElement",
    //                     //     popFilterEnum: LIB.getDataDicList("system_element"),
    //                     //     render: function (data) {
    //                     //         return LIB.getDataDic("system_element", data.systemElement);
    //                     //     }
    //                     // },{
    //                     //     //title: "专业",
    //                     //     title: this.$t("gb.common.profession"),
    //                     //     orderName: "profession",
    //                     //     fieldType: "custom",
    //                     //     filterType: "enum",
    //                     //     filterName: "criteria.intsValue.profession",
    //                     //     popFilterEnum: LIB.getDataDicList("profession"),
    //                     //     render: function (data) {
    //                     //         return LIB.getDataDic("profession", data.profession);
    //                     //     }
    //                     // },
    //                     {
    //                         //title: "问题描述",
    //                         title: this.$t("gb.common.problemDesc"),
    //                         fieldName: "problem",
    //                         filterName: "criteria.strValue.problem",
    //                         filterType: "text"
    //                     }, {
    //                         //title: "建议措施",
    //                         title: this.$t("gb.common.recMeasure"),
    //                         fieldName: "danger",
    //                         filterName: "criteria.strValue.danger",
    //                         filterType: "text"
    //                     }, {
    //                         //title: "登记日期",
    //                         title: this.$t("bc.hal.registratDate"),
    //                         fieldName: "registerDate",
    //                         filterType : "date"
    //                     }, {
    //                         //title: "风险等级",
    //                         title: this.$t("gb.common.riskGrade"),
    //                         orderName: "riskLevel",
    //                         fieldType: "custom",
    //                         filterType: "text",
    //                         filterName: "criteria.strValue.riskLevel",
    //                         render: function (data) {
    //                             if (data.riskLevel) {
    //                                 var riskLevel = JSON.parse(data.riskLevel);
    //                                 if (riskLevel && riskLevel.result) {
    //                                     return riskLevel.result;
    //                                 } else {
    //                                     return "无";
    //                                 }
    //                             } else {
    //                                 return "无";
    //                             }
    //                         }
    //                     }, {
    //                         title: this.$t("gb.common.state"),
    //                         orderName: "status",
    //                         fieldType: "custom",
    //                         filterType: "enum",
    //                         filterName: "criteria.intsValue.status",
    //                         popFilterEnum: LIB.getDataDicList("pool_status"),
    //                         render: function (data) {
    //                             return LIB.getDataDic("pool_status", data.status);
    //                         }
    //                     },{
    //                         title: "来源",
    //                         orderName: "sourceType",
    //                         fieldType: "custom",
    //                         filterType: "enum",
    //                         filterName: "criteria.intsValue.sourceType",
    //                         popFilterEnum: LIB.getDataDicList("pool_sourceType"),
    //                         render: function (data) {
    //                             return LIB.getDataDic("pool_sourceType", data.sourceType);
    //                         }
    //                     }]
    //             }
    //         )),
    //         //控制全部分类组件显示
    //         mainModel: {
    //             //显示分类
    //             showCategory: false,
    //             showHeaderTools: false,
    //             //当前grid所选中的行
    //             selectedRow: []
    //         },
    //         riskModel: {
    //             //控制编辑组件显示
    //             title: "回转风险库",
    //             //显示编辑弹框
    //             show: false,
    //             //编辑模式操作类型
    //             type: "create",
    //             id: null
    //         },
    //         detailModel: {
    //             //控制右侧滑出组件显示
    //             show: false
    //         },
    //         poolId: null,
    //         exportModel : {
    //             url: "/pool/exportExcel/total"
    //         }
    //     }
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
    // var tpl = LIB.renderHTML(require("text!./main.html"));
    var vm ={
        // template: tpl,
        // components: {
        //     "detail-component": detailComponent,
        //     "risk-component": riskComponent
        // },
        // data:dataModel,
        methods: {
            doCategoryChange: function (obj) {
//            	if(obj.categoryType == "xxx") {
//            	}
            },
            doTableCellClick: function (data) {
                if (data.cell.fieldName == "title") {
                    this.showDetail(data.entry.data);
                }else{
                    this.detailModel.show = false;
                }
            },
            //显示详情
            showDetail: function (row) {
                this.detailModel.show = true;
                this.$broadcast('ev_detailDataReload', row.id);
            },
            //显示全部分类
            doShowCategory: function () {
                this.mainModel.showCategory = !this.mainModel.showCategory;
            },
            //回转风险库方法
            doRisk: function () {
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量操作数据");
                    return;
                }
                if (rows[0].isRotationRisk == '1'){
                    LIB.Msg.warning("此数据已回转");
                    return;
                }
                if (rows[0].status != 100){
                    LIB.Msg.warning("该条隐患记录没有整改完成，无法回转风险库");
                    return;
                }
                var row = rows[0];
                this.riskModel.show = true;
                this.riskModel.id = row.id;
                this.$broadcast('ev_riskReload', row.id);
            },
            //删除方法
            doDelete: function () {
                var _this = this;
                var deleteIds = _.map(this.tableModel.selectedDatas, function (row) {
                    return row.id
                });
                if(deleteIds.length > 1){
                    LIB.Msg.warning("无法批量删除隐患记录");
                    return;
                }
                LIB.Modal.confirm({
                    title: '删除选中数据?',
                    onOk: function () {
                        api.delete(null, deleteIds).then(function (data) {
                            if (data.data && data.error != '0') {
                                LIB.Msg.warning("删除失败");
                                return;
                            } else {
                                _this.mainModel.showHeaderTools = false;
                                _this.emitMainTableEvent("do_update_row_data", {
                                    opType: "remove",
                                    value: _this.tableModel.selectedDatas
                                });
                                LIB.Msg.success("删除成功");
                            }
                        });
                    }
                });
            },
        },
        //响应子组件$dispatch的event
        events: {
            //edit框点击保存后事件处理
            "ev_riskFinshed": function (data) {
                this.emitMainTableEvent("do_update_row_data", {opType:"add"});
                this.riskModel.show = false;
            },
            //edit框点击取消后事件处理
            "ev_riskCanceled": function () {
                this.riskModel.show = false;
            },
            //detail框点击关闭后事件处理
            "ev_detailColsed": function () {
                this.detailModel.show = false;
            }
        },
        route: {
            activate: function (transition) {
                var queryObj = transition.to.query;
                if(queryObj.id && queryObj.method == "detail" && queryObj.opt == "isClickPoolTotalExecutBtn"){
                	this.detailModel.show = true;
                    this.$broadcast('ev_detailDataReload', queryObj.id);
                    window.isClickPoolTotalExecutBtn = false;
                }
                transition.next();
            }
        }
    };

    return vm;
});