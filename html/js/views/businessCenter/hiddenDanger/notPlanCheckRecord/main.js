define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var editComponent = require("./detail-xl");
    //Vue数据模型
    var dataModel = function () {
        return {
            moduleCode: "BC_Hal_InsNR",
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "checkrecord/list{/curPage}{/pageSize}?type=0",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                        }, {
                            //title : "编码",
                            title: this.$t("gb.common.code"),
                            fieldName: "code",
                            width: 200,
                            orderName: "code",
                            fieldType: "link",
                            filterType: "text"
                        }, {
                            title: this.$t("gb.common.checkUser"),
                            orderName: "checkerId",
                            fieldName: "checkUser.username",
                            filterType: "text",
                            filterName: "criteria.strValue.username",
                            width: 120
                        },
                        // {
                        //     title: this.$t("gb.common.checkTime"),
                        //     fieldName: "checkDate",
                        //     filterType: "date",
                        //     width: 180
                        // },
                        {
                            title: this.$t("gb.common.CheckTableName"),
                            fieldName: "checkTable.name",
                            filterType: "text",
                            orderName: "checkTableId",
                            filterName: "criteria.strValue.checktableName",
                            width: 200
                        },
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        {
                            title: this.$t("bc.hal.source"),
                            orderName: "checkSource",
                            fieldName: "checkSource",
                            render: function (data) {
                                return LIB.getDataDic("checkSource", data.checkSource);
                            },
                            popFilterEnum: LIB.getDataDicList("checkSource"),
                            filterType: "enum",
                            filterName: "criteria.strsValue.checkSource",
                            width: 150
                        }, {
                            title: this.$t("gb.common.state") + '(' + this.$t("hag.hazv.qualify") + '/' + this.$t("hag.hazv.unqualify") + ')',
                            width: 200,
                            fieldName: "checkResultDetail",
                            filterType: "text",
                        }, {
                            title: this.$t("bd.ria.result"),
                            orderName: "checkResult",
                            fieldName: "checkResult",
                            filterType: "enum",
                            filterName: "criteria.strsValue.checkResult",
                            popFilterEnum: LIB.getDataDicList("checkResult"),
                            render: function (data) {
                                return LIB.getDataDic("checkResult", data.checkResult);
                            },
                            width: 100
                        },
                        {
                            title: '检查开始时间',
                            fieldName: "checkBeginDate",
                            filterType: "date",
                            width: 180
                        }, {
                            title: '检查结束时间',
                            fieldName: "checkEndDate",
                            filterType: "date",
                            width: 180
                        },
                        {
                            // 备注列
                            title: this.$t("gb.common.remarks"),
                            fieldName: "remarks",
                            filterType: "text",
                        }
                    ],
	                defaultFilterValue : {"criteria.orderValue" : {fieldName : "checkDate", orderType : "1"}},
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
                //控制右侧滑出组件显示
                show: false
            },
            exportModel: {
                url: "/checkrecord/exportExcel",
                singleUrl: "/checkrecord/{id}/exportExcel"
            },
            id: null
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
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: dataModel,
        components: {
            "editcomponent": editComponent
        },
        methods: {
            doCategoryChange: function (obj) {
            },
            //显示全部分类
            doShowCategory: function () {
                this.mainModel.showCategory = !this.mainModel.showCategory;
            }
        },
        events: {},
        init: function () {
            this.$api = api;
        },
        ready: function () {
            var _this = this;
            if(LIB.getBusinessSetByNamePath('common.enableCheckLevel').result === '2'){
                _this.tableModel.columns.push({
                    title: "检查级别",
                    fieldName: "checkLevel",
                    orderName: "checkLevel",
                    fieldType: "custom",
                    filterType: "enum",
                    filterName: "criteria.intsValue.checkLevel",
                    popFilterEnum : LIB.getDataDicList("checkLevel"),
                    render: function (data) {
                        return LIB.getDataDic("checkLevel",data.checkLevel);
                    },
                    width: 100
                });
            }
        }
    });


    return vm;
});