define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("./detail-xl");
    // 编辑弹框页面
    var editComponent = require("./edit-modal");
    var mainOpt = require("./main-opt");
    //导入
    var importProgress = require("componentsEx/importProgress/main");

    var initDataModel = function () {
        var _this = this;

        var columsCfg = LIB.setting.fieldSetting["BC_RiA_HazI"] ? LIB.setting.fieldSetting["BC_RiA_HazI"] : [];
        _.each(columsCfg, function (data) {
            if (data.fieldType === 'checkRadio') {//制定紧急预定方案渲染是枚举值
                data.fieldType = 'enum';
            }
        })
        var renderTableModel = _.bind(LIB.tableRenderMgr.renderModel, _this, columsCfg);
        return {
            moduleCode: LIB.ModuleCode.BC_RiA_Hazl,
            categoryModel: {
                config: [{
                    NodeEdit: true,
                    title: "业务分类",
                    url: "risktype/list",
                    type: "business"
                }]
            },
            height: 'calc(100% - 60px)',//收起展开时控制table的高度
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                showFilter: true,
                riskShow: false,
                //当前grid所选中的行
                selectedRow: [],
                operate: '收起',
                //detailPanelClass : "middle-info-aside"
                detailPanelClass: "large-info-aside",
                showOperateBtn: false,
                riskModelResultMap: {},
                bizType:null
            },
            filterList: [
                {
                    interName: 'introducer',
                    name: '引导词',
                    show: false,
                    filter: -1,
                    list: LIB.getDataDicList("introducer")
                }, {
                    interName: 'subIntroducer',
                    name: '分引导词',
                    show: false,
                    filter: -1,
                    list: LIB.getDataDicList("sub_introducer")
                }, {
                    interName: 'hazardousElementsSenior',
                    name: '危害因素小分类',
                    show: false,
                    filter: -1,
                    list: LIB.getDataDicList("hazardous_elements_senior")
                }, {
                    interName: 'hazardousElementsJunior',
                    name: '危害因素小分类',
                    show: false,
                    filter: -1,
                    list: LIB.getDataDicList("hazardous_elements_junior")
                }, {
                    interName: 'riskLevel',
                    name: '风险等级',
                    show: false,
                    filter: -1,
                    list: []
                }, {
                    interName: 'checkFrequency',
                    name: '频次',
                    show: false,
                    filter: -1,
                    list: LIB.getDataDicList("check_frequency")
                },
            ],
            filterTable: {
                filterData: {
                    riskLevel: null,
                    introducer: null,//引导词
                    subIntroducer: null,//分类引导词
                    hazardousElementsSenior: null,//大分类
                    hazardousElementsJunior: null,//小分类
                    checkFrequency: null,//频次
                }
            },
            tableModel: LIB.Opts.extendMainTableOpt(renderTableModel(
                {
                    code: "riskAssessment",
                    url: "riskassessment/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                            filterType: 'text'
                        }, {
                            //
                            title: this.$t("gb.common.code"),
                            fieldName: "code",
                            fieldType: "link",
                            filterType: 'text',
                            width: 160
                        },
                        {
                            title: this.$t("gb.common.state"),
                            fieldType: "custom",
                            orderName: "state",
                            filterType: 'enum',
                            render: function (data) {
                                if (data.state) {
                                    return LIB.getDataDic("risk_state", [data.state]);
                                }
                            },
                            popFilterEnum: LIB.getDataDicList("risk_state"),
                            filterName: "criteria.intsValue.state",
                            width: 100
                        },
                        {
                            title: "属地",
                            fieldName: "dominationArea.name",
                            orderName: "dominationarea.name",
                            filterName: "criteria.strValue.dominationAreaName",
                            filterType: "text"
                        },
                        {
                            title: "风险点",
                            fieldName: "riskPoint",
                            filterType: "text"
                        },
                        {
                            title: "风险点类型",
                            orderName: "checkObjType",
                            fieldType: "custom",
                            render: function (data) {
                                return LIB.getDataDic("check_obj_risk_type", data.checkObjType);
                            },
                            popFilterEnum: LIB.getDataDicList("check_obj_risk_type"),
                            filterType: "enum",
                            filterName: "criteria.intsValue.checkObjType",
                            width: 150
                        },
                        {
                            title: "风险数据来源",
                            orderName: "bizType",
                            fieldType: "custom",
                            render: function (data) {
                                return LIB.getDataDic("risk_biz_source_type", data.bizType);
                            },
                            popFilterEnum: LIB.getDataDicList("risk_biz_source_type"),
                            filterType: "enum",
                            filterName: "criteria.intsValue.bizType",
                            width: 150
                        },
                        {
                            title: this.$t("bc.ria.scene"),
                            fieldName: "scene",
                            filterType: 'text',
                            width: 160
                        },
                        //{
                        //    title: this.$t("gb.common.riskClass"),
                        //    fieldType: "custom",
                        //    fieldName: "riskTypeName",
                        //    orderName: "risktypealias.name",
                        //    render: function (data) {
                        //        if (data.riskType) {
                        //            return data.riskType.name;
                        //        }
                        //    },
                        //    filterType: "text",
                        //    filterName: "criteria.strValue.riskTypeName",
                        //    width: 160
                        //},
                        {
                            title: this.$t("gb.common.riskGrade"),
                            fieldName: "riskLevel",
                            orderName: "riskLevel",
                            filterType: 'text',
                            width: 120,
                            fieldType: "custom",
                            showTip: false,
                            render: function (data) {
                                var resultColor = _.propertyOf(JSON.parse(data.riskModel))("resultColor");
                                if (resultColor) {
                                    return "<span style='background:\#" + resultColor + ";color:\#" + resultColor + ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + data.riskLevel;
                                } else {
                                    return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + data.riskLevel;
                                }

                                //if(_this.mainModel.riskModelResultMap){
                                //    var resultId = _.propertyOf(JSON.parse(data.riskModel))("latId");
                                //    var color = _.propertyOf(_this.mainModel.riskModelResultMap[resultId])("colorMark");
                                //    if(color){
                                //        return "<span style='background:\#"+color+";color:\#"+color+";margin-right: 5px;'>12</span>"+data.riskLevel;
                                //    }else{
                                //        return "<span style='background:#000;color:#000;opacity: 1;margin-right: 5px;'>12</span>"+data.riskLevel;
                                //    }
                                //
                                //}
                            },
                        },

                        {
                            title: this.$t("gb.common.controlMeasures"),
                            fieldName: "controlMeasures",
                            orderName: "controlMeasures",
                            width: 200,
                            'renderClass': "textarea",
                            filterType: 'text',
                        },
                        {
                            title: this.$t("gb.common.checkItemName"),
                            //fieldType : "custom",
                            fieldName: "checkItem.name",
                            orderName: "checkitem.name",
                            filterType: 'text',
                            'renderClass': "textarea",
                            width: 240,
                            //render: function(data){
                            //	if(data.checkItem){
                            //		return data.checkItem.name;
                            //	}
                            //},

                            filterName: "criteria.strValue.checkItemName"
                        },
                        {
                            title: this.$t("gb.common.dataSources"),
                            fieldType: "custom",
                            orderName: "markup",
                            filterType: 'enum',
                            render: function (data) {
                                if (data.markup) {
                                    return LIB.getDataDic("risk_markup", [data.markup]);
                                }
                            },
                            popFilterEnum: LIB.getDataDicList("risk_markup"),
                            filterName: "criteria.intsValue.markup",
                            width: 120
                        },
                        {
                            title: "隐患等级",
                            orderName: "type",
                            fieldType: "custom",
                            filterType: "enum",
                            filterName: "criteria.strsValue.hiddenDangerLevel",
                            popFilterEnum: LIB.getDataDicList("risk_type"),
                            render: function (data) {
                                return LIB.getDataDic("risk_type", data.hiddenDangerLevel);
                            },
                            width: 120
                        },
                        {
                            title: "隐患类别",
                            orderName: "type",
                            fieldType: "custom",
                            filterType: "enum",
                            filterName: "criteria.intsValue.hiddenDangerType",
                            popFilterEnum: LIB.getDataDicList("hidden_danger_type"),
                            render: function (data) {
                                return LIB.getDataDic("hidden_danger_type", data.hiddenDangerType);
                            },
                            width: 120
                        },
                        LIB.tableMgr.column.dept,
                        LIB.tableMgr.column.company //为了排序时兼容没有compId的页面
                    ],
                    defaultFilterValue: {"criteria.orderValue": {fieldName: "createDate", orderType: "1"}}
                }
            )),
            editModel: {
                // 控制编辑组件显示
                title: "新增",
                // 显示编辑弹框
                show: false,
                // 编辑模式操作类型
                type: "create",
                id: null
            },
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/checktable/riskassessment/item/importExcel"
            },
            exportModel: {
                url: "/riskassessment/exportExcel"
            },
            templete: {
                url: "/riskassessment/file/down"
            },
            importProgress: {
                show: false
            },
            auditModal: {
                show: false
            },
            box: null,
        };

    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel, mainOpt],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
            "editComponent": editComponent
        },
        methods: {
            doImport:function(){
                var url = "/checktable/riskassessment/item/importExcel?bizType=1";//默认是HSE风险
                if (this.mainModel.bizType) {
                    url = "/checktable/riskassessment/item/importExcel?bizType=" + this.mainModel.bizType;
                }
                this.$broadcast("ev_update_url",url);
                this.importProgress.show = true;
            },
        },
        init: function () {
            this.$api = api;
        },
        ready: function () {
            var _this = this
            api.getRiskModel().then(function (res) {
                _.each(_this.filterList, function (item) {
                    if (item.interName == 'riskLevel') {
                        item.list = res.data;
                    }
                })
            });
            var columsCfg = LIB.setting.fieldSetting["BC_RiA_HazI"] ? LIB.setting.fieldSetting["BC_RiA_HazI"] : [];
            var num = 0;
            _.each(columsCfg, function (data) {
                _.each(_this.filterList, function (item) {
                    if (data.fieldName == item.interName) {
                        item.show = true;
                        num++;
                    }
                })
            });
            if (num > 0) {
                _.each(_this.filterList, function (item) {
                    if ('riskLevel' == item.interName) {
                        item.show = true;
                        num++;
                    }
                })
                _this.mainModel.showOperateBtn = true;
                _this.mainModel.showFilter = true;
                _this.height = 'calc(100% - 240px)';
            } else {
                _this.mainModel.showFilter = false;
                _this.height = 'calc(100% - 60px)';
            }
        },
        route: {
            activate: function (transition) {
                var queryObj = transition.to.query;
                if (queryObj.method) {
                    if (queryObj.id && queryObj.method === "select") {
                        this.$broadcast('ev_dtReload', "view", queryObj.id);
                        this.detailModel.show = true;
                    }
                }
                transition.next();
            }
        }
    });

    return vm;
});
