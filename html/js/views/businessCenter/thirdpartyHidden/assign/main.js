define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("../vuex/api");
    //右侧滑出详细页
    var detailComponent = require("../detail");
    //整改人弹框页面
    // var reformComponent = require("./dialog/reform");
    //隐患处理弹框页面
    var poolTreatmentComponent = require("./dialog/poolTreatment");


    //Vue数据模型
    var dataModel = function(){
        var _this = this;

        var columsCfg = LIB.setting.fieldSetting["BC_HaG_HazR"] ? LIB.setting.fieldSetting["BC_HaG_HazR"] : [];

        var renderTableModel = _.bind(LIB.tableRenderMgr.renderModel, _this, columsCfg);
        // moduleCode : LIB.ModuleCode.BC_HaT_HazR,
        //tableModel: LIB.Opts.extendMainTableOpt(renderTableModel(
        return{
            moduleCode : LIB.ModuleCode.BC_HaT_TasA,
            tableModel:LIB.Opts.extendMainTableOpt(renderTableModel(
                 {
                url: "tpapool/list{/curPage}{/pageSize}",
                selectedDatas: [],
                columns: [{
                    title: "",
                    fieldName: "id",
                    fieldType: "cb",
                },{
                    //title: "编码",
                    title: this.$t("gb.common.code"),
                    fieldName: "title",
                    width:'200px',
                    fieldType: "link",
                    filterName: "criteria.strValue.title",
                    filterType: "text"
                },
                //    {
                //    //title: "受检对象",
                //    title: this.$t("gb.common.subjectObj"),
                //    orderName:"checkObject.name",
                //    fieldName : "checkObject.name",
                //    filterType: "text",
                //    filterName : "criteria.strValue.name",
                //},
                    LIB.tableMgr.column.company,
                    LIB.tableMgr.column.dept,
                    {
                    //title: "类型",
                    title: this.$t("gb.common.type"),
                    orderName: "type",
                    fieldType: "custom",
                    filterType: "enum",
                    filterName: "criteria.intsValue.type",
                    popFilterEnum: LIB.getDataDicList("pool_type"),
                    render: function (data) {
                        return LIB.getDataDic("pool_type", data.type);
                    }
                },
                    {
                    //title: "问题描述",
                    title: this.$t("gb.common.problemDesc"),
                    fieldName: "problem",
                    filterName: "criteria.strValue.problem",
                    filterType: "text"
                }, {
                    //title: "建议措施",
                    title: this.$t("gb.common.recMeasure"),
                    fieldName: "danger",
                    filterName: "criteria.strValue.danger",
                    filterType: "text"
                }, {
                    //title: "登记日期",
                    title: this.$t("bc.hal.registratDate"),
                    fieldName: "registerDate",
                    filterType : "date"
                }, {
                    //title: "风险等级",
                    title: this.$t("gb.common.riskGrade"),
                    orderName: "riskLevel",
                    fieldType: "custom",
                    filterType: "text",
                    filterName: "criteria.strValue.riskLevel",
                    render: function (data) {
                        if (data.riskLevel) {
                            var riskLevel = JSON.parse(data.riskLevel);
                            if (riskLevel && riskLevel.result) {
                                return riskLevel.result;
                            } else {
                                return "无";
                            }
                        } else {
                            return "无";
                        }
                    }
                }, {
                    title: this.$t("gb.common.state"),
                    orderName: "status",
                    fieldType: "custom",
                    filterType: "enum",
                    filterName: "criteria.intsValue.status",
                    popFilterEnum: LIB.getDataDicList("pool_status"),
                    render: function (data) {
                        return LIB.getDataDic("pool_status", data.status);
                    }
                },
                {
                    title: this.$t("gb.common.check"),
                    orderName: "tpachecktable.id",
                    fieldName: "tpaCheckTable.name",
                    filterType: "text",
                    filterName: "criteria.strValue.checktableName"
                },
                {
                    title: "设备设施",
                    orderName: "tpaboatequipment.id",
                    fieldName: "tpaBoatEquipment.name",
                    filterType: "text",
                    filterName: "criteria.strValue.tpaBoatEquipmentName"
                }],
                defaultFilterValue: {"status": "11"}
            }
            )),
            //控制全部分类组件显示
            mainModel: {
                //显示分类
                showCategory: false,
                showHeaderTools: false,
            },
            reformModel: {
                //控制编辑组件显示
                title: "指派",
                //显示编辑弹框
                show: false,
                //编辑模式操作类型
                type: "reform",
                id: null
            },
            processReform:{
                title:"处理隐患",
                //显示编辑弹框
                show:false,
                formType:null,
                poolId:null
            },
            detailModel: {
                //控制右侧滑出组件显示
                show: false
            },

            //按钮权限控制
            buttonShow: {
                //导出按钮
                exportButton: false,
                //分配人员
                assignButton: false,
                //否军按钮
                cancelButton: false
            },
            poolId: null,
            exportModel : {
                url: "/tpapool/exportExcel"
            }
        }
    };
    var tpl = LIB.renderHTML(require("text!./main.html"));
    var vm = LIB.VueEx.extend({
        template: tpl,
        data: dataModel,
        components: {
            // "reform-component": reformComponent,
            "detail-component": detailComponent,
            "pool-treatment-component": poolTreatmentComponent
        },
        methods: {
            doCategoryChange: function (obj) {
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
            //分配人员
            doReform: function () {
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量分配人员");
                    return;
                }
                var row = rows[0];

                this.reformModel.show = true;
                this.reformModel.title = "分配人员";
                this.reformModel.type = "reform";
                this.$broadcast('ev_editReload', row.id);
            },
            doProcessReform:function(){
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量处理隐患");
                    return;
                }
                var row = rows[0];
                if("1" == row.status){//审批
                    this.processReform.formType="1"
                }else{//指派
                    this.processReform.formType="2"
                }
                this.processReform.poolId = row.id;
                this.processReform.show = true;
            },
            doCloseProcessReform:function(){
                this.processReform.poolId = null;
            }
        },
        //响应子组件$dispatch的event
        events: {
            //edit框点击保存后事件处理
            "ev_editFinshed": function () {
                //重新加载数据
                this.emitMainTableEvent("do_update_row_data", {opType: "add"});
                this.reformModel.show = false;
            },
            //处理隐患点击保存后事件处理
            "ev_processedReform":function(){
                //重新加载数据
                this.emitMainTableEvent("do_update_row_data", {opType: "add"});
                this.processReform.show = false;
            },
            ////edit框点击取消后事件处理
            //"ev_editCanceled": function () {
            //    this.reformModel.show = false;
            //},
            //detail框点击关闭后事件处理
            "ev_detailColsed": function () {
                this.detailModel.show = false;
            }
        },
        route: {
            activate: function (transition) {
                var queryObj = transition.to.query;
                if(queryObj.id && queryObj.method == "detail" && queryObj.opt=="isClickPoolAssignExecutBtn"){
                	this.detailModel.show = true;
                    this.$broadcast('ev_detailDataReload', queryObj.id);
                    window.isClickPoolAssignExecutBtn = false;
                }
                transition.next();
            }
        }
    });
    return vm;
});