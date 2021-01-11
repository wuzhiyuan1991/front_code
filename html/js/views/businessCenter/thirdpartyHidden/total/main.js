define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var mainOpt = require("./main-opt");
    //右侧滑出详细页
    var detailComponent = require("../detail");
    //回转风险库弹框页面
    var riskComponent = require("./dialog/risk");

    var evaluations  = [{id : "1", value: "好评"},{id : "2", value: "中评"},{id : "3", value: "差评"}];
    //Vue数据模型
    var dataModel = function(){
        var _this = this;
        var columsCfg = LIB.setting.fieldSetting["BC_HaG_HazR"] ? LIB.setting.fieldSetting["BC_HaG_HazR"] : [];

        var renderTableModel = _.bind(LIB.tableRenderMgr.renderModel, _this, columsCfg);
        return{

            moduleCode : LIB.ModuleCode.BC_HaG_HazT,
            tableModel:  LIB.Opts.extendMainTableOpt(renderTableModel(
                {
                url: "tpapool/list{/curPage}{/pageSize}",
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
                        title: "设备设施",
                        orderName: "tpaboatequipment.id",
                        fieldName: "tpaBoatEquipment.name",
                        filterType: "text",
                        filterName: "criteria.strValue.tpaBoatEquipmentName"
                    },
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
                },{
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
                },
                {
                    title: "评价",
                    orderName: "tpacheckrecord.attr1",
                    fieldType:"custom",
                    showTip: false,
                    render: function(data){
                        var _tpaCheckRecord = data.tpaCheckRecord;
                        var value = "";
                        if (!_tpaCheckRecord) {
                            return value;
                        } else {
                            if (_tpaCheckRecord.attr1 === "1") {
                                value = '好评';
                            } else if (_tpaCheckRecord.attr1 === "2") {
                                value = '中评';
                            } else if (_tpaCheckRecord.attr1 === "3") {
                                value = '差评';
                            } else {
                                return value;
                            }
                            if (_tpaCheckRecord.attr2 === "1") {
                                return value+' <i style="font-size: 14px;cursor: pointer;" class="ivu-icon ivu-icon-ios-information"></i>'
                            } else {
                                return value;
                            }
                        }
                    },
                    popFilterEnum : evaluations,
                    filterType : "enum",
                    filterName : "criteria.strsValue.checkRecordAttr1"
                }],
                    defaultFilterValue : {"orgId" : LIB.user.orgId}
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
                url: "/tpapool/exportExcel"
            },
            evaluateModal: {
                show: false
            },
        }
    };

    var actions = require("app/vuex/actions");

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
        },
        methods: {
            findText: function (value) {
                return _.result(_.find(evaluations, function (item) {
                    return item.id === value;
                }), 'value')
            },
            doTableCellClick: function (data) {
                var _this = this;
                if (data.event.target.classList.contains('ivu-icon-ios-information')) {
                    api.getPoptipContent({checkRecordId: data.entry.data.tpaCheckRecord.id}).then(function (res) {
                        var html = '';
                        if (res.data.length > 0) {
                            _.each(res.data, function (item) {
                                html += '<div style="padding: 5px 0;">';
                                html += '<p>更改后评价：' + _this.findText(item.afterContent) +'</p>' +
                                    '<p>更改前评价：' + _this.findText(item.beformContent) +'</p>' +
                                    '<p>更改时间：' + item.createDate +'</p>' +
                                    '<p>更改人：' + item.user.username +'</p></div>';
                            })
                        }
                        _this.updatePoptipData({
                            html: html,
                            position: {
                                x: data.event.clientX,
                                y: data.event.clientY,
                                width: data.event.target.offsetWidth,
                                height: data.event.target.offsetHeight
                            }
                        })
                    })
                } else {
                    if (!!this.showDetail && data.cell.fieldName == "title") {
                        this.showDetail(data.entry.data);
                    } else {
                        (!!this.detailModel) && (this.detailModel.show = false);
                    }
                }
            }
        },
        vuex: {
            actions: {
                updatePoptipData: actions.updatePoptipData
            }
        }
    });

    return vm;
});