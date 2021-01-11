define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    //右侧滑出详细页
    var detailComponent = require("../detail");
    //回转风险库弹框页面
    var riskComponent = require("./dialog/risk-bjtrq");
    var mainOpt = require("./main-opt");
    //Vue数据模型
    var dataModel = function(){
        var _this = this;
        var columsCfg = LIB.setting.fieldSetting["BC_HaG_HazR"] ? LIB.setting.fieldSetting["BC_HaG_HazR"] : [];

        var renderTableModel = _.bind(LIB.tableRenderMgr.renderModel, _this, columsCfg);
        return{

            moduleCode : LIB.ModuleCode.BC_HaG_HazT,
            tableModel:  LIB.Opts.extendMainTableOpt(renderTableModel(
                {
                    url: "pool/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [{
                        title: "",
                        fieldName: "id",
                        fieldType: "cb",
                    }, {
                        //title: "编号",
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
                        },{
                            title: "来源",
                            orderName: "sourceType",
                            fieldType: "custom",
                            filterType: "enum",
                            filterName: "criteria.intsValue.sourceType",
                            popFilterEnum: LIB.getDataDicList("pool_sourceType"),
                            render: function (data) {
                                return LIB.getDataDic("pool_sourceType", data.sourceType);
                            }
                        }]
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
            riskModel: {
                //控制编辑组件显示
                title: "回转风险库",
                //显示编辑弹框
                show: false,
                //编辑模式操作类型
                type: "create",
                id: null
            },
            detailModel: {
                //控制右侧滑出组件显示
                show: false
            },
            poolId: null,
            exportModel : {
                url: "/pool/exportExcel"
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
        mixins : [LIB.VueMixin.auth,LIB.VueMixin.mainPanel,mainOpt],
        template: tpl,
        components: {
            "detail-component": detailComponent,
            "risk-component": riskComponent
        },
        data:dataModel,
        ready : function () {
            this.$refs.categorySelector.setDisplayTitle({type:"org", value : LIB.user.orgId});
        }
    });

    return vm;
});