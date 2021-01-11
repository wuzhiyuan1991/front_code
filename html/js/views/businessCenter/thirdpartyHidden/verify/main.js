define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    //右侧滑出详细页
    var detailComponent = require("../detail");
    //编辑弹框页面
    var verifyComponent = require("./dialog/verify");
    //Vue数据模型
    var dataModel = function(){
        var _this = this;
        var columsCfg = LIB.setting.fieldSetting["BC_HaG_HazR"] ? LIB.setting.fieldSetting["BC_HaG_HazR"] : [];

        var renderTableModel = _.bind(LIB.tableRenderMgr.renderModel, _this, columsCfg);
        return{

            moduleCode : LIB.ModuleCode.BC_HaT_HazV,
            tableModel: LIB.Opts.extendMainTableOpt(renderTableModel(
                {
                url: "tpapool/list{/curPage}{/pageSize}",
                selectedDatas: [],
                columns: [{
                    title: "",
                    fieldName: "id",
                    fieldType: "cb",
                }, {
                    //title: "标题",
                    title: this.$t("gb.common.code"),
                    fieldName: "title",
                    fieldType: "link",
                    filterName: "criteria.strValue.title",
                    filterType: "text",
                    width:'200px'
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
                    // {
                    //     //title: "信息来源",
                    //     title: this.$t("gb.common.infoSource"),
                    //     orderName: "infoSource",
                    //     fieldType: "custom",
                    //     filterType: "enum",
                    //     filterName: "criteria.intsValue.infoSource",
                    //     popFilterEnum: LIB.getDataDicList("info_source"),
                    //     render: function (data) {
                    //         return LIB.getDataDic("info_source", data.infoSource);
                    //     }
                    // }, {
                    //     //title: "体系要素",
                    //     title: this.$t("gb.common.systemElement"),
                    //     orderName: "systemElement",
                    //     fieldType: "custom",
                    //     filterType: "enum",
                    //     filterName: "criteria.intsValue.systemElement",
                    //     popFilterEnum: LIB.getDataDicList("system_element"),
                    //     render: function (data) {
                    //         return LIB.getDataDic("system_element", data.systemElement);
                    //     }
                    // },{
                    //     //title: "专业",
                    //     title: this.$t("gb.common.profession"),
                    //     orderName: "profession",
                    //     fieldType: "custom",
                    //     filterType: "enum",
                    //     filterName: "criteria.intsValue.profession",
                    //     popFilterEnum: LIB.getDataDicList("profession"),
                    //     render: function (data) {
                    //         return LIB.getDataDic("profession", data.profession);
                    //     }
                    // },
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
                    //title: "隐患等级",
                    title: this.$t("hag.hazc.hiddenGrade"),
                    orderName: "type",
                    fieldType: "custom",
                    filterType: "enum",
                    filterName: "criteria.strsValue.riskType",
                    popFilterEnum: LIB.getDataDicList("risk_type"),
                    render: function (data) {
                        return LIB.getDataDic("risk_type", data.riskType);
                    }
                },{
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
                    title: "设备设施",
                    orderName: "tpaboatequipment.id",
                    fieldName: "tpaBoatEquipment.name",
                    filterType: "text",
                    filterName: "criteria.strValue.tpaBoatEquipmentName"
                }],
                defaultFilterValue: {"status": "3"}
            }
            )),
            //控制全部分类组件显示
            mainModel: {
                //显示分类
                showCategory: false,
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: []
            },
            verifyModel: {
                //控制编辑组件显示
                title: "新增",
                //显示编辑弹框
                show: false,
                id: null
            },
            detailModel: {
                //控制右侧滑出组件显示
                show: false
            },
            //按钮权限控制
            buttonShow: {
                //导出按钮
                exportButton: false,
                //整改按钮
                pass: false,
                //整改受阻按钮
                nopass: false
            },
            poolId: null,
            exportModel : {
                url: "/tpapool/exportExcel"
            }
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
        components: {
            "verify-component": verifyComponent,
            "detail-component": detailComponent
        },
        data: dataModel,
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
            //验证
            doVerify: function () {
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量验证隐患");
                    return;
                }
                var row = rows[0];
                this.verifyModel.show = true;
                this.verifyModel.title = "验证";
                this.verifyModel.id = row.id;
                this.$broadcast('ev_verifyReload', row);
            },
            //合格
            doSuccess: function () {
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量验证隐患");
                    return;
                }
                var row = rows[0];
                this.verifyModel.show = true;
                this.verifyModel.title = "合格";
                this.verifyModel.id = row.id;
                this.$broadcast('ev_verifyReload', row, 100);
            },
            //不合格
            doFail: function () {
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量验证隐患");
                    return;
                }
                var row = rows[0];
                this.verifyModel.show = true;
                this.verifyModel.title = "不合格";
                this.verifyModel.id = row.id;
                this.$broadcast('ev_verifyReload', row, 2);
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
            doClose:function(){
                this.$broadcast('ev_verifyDelPlay');
            },
        },

        //响应子组件$dispatch的event
        events: {
            //verify框点击保存后事件处理
            "ev_verifyFinshed": function () {
                //重新加载数据
                this.emitMainTableEvent("do_update_row_data", {opType: "add"});
                this.verifyModel.show = false;
            },
            //edit框点击取消后事件处理
            "ev_verifyCanceled": function () {
                this.verifyModel.show = false;
            },
            //detail框点击关闭后事件处理
            "ev_detailColsed": function () {
                this.detailModel.show = false;
            }
        },
        route: {
            activate: function (transition) {
                var queryObj = transition.to.query;
                if(queryObj.id && queryObj.method == "detail" && queryObj.opt =="isClickPoolVerifyExecutBtn"){
                	this.detailModel.show = true;
                    this.$broadcast('ev_detailDataReload', queryObj.id);
                    window.isClickPoolVerifyExecutBtn = false;
                }
                transition.next();
            }
        }
    });

    return vm;
});