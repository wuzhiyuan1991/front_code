define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");

    var initDataModel = function () {
        return {
            moduleCode: "teacher",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "middle-info-aside"
//				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "teacher/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                        },
                        {
                            //唯一标识
                            title: this.$t("gb.common.code"),
                            fieldName: "code",
                            fieldType: "link",
                            filterType: "text",
                            width: 160
                        },
                        {
                            //教师名称
                            title: "讲师姓名",
                            fieldName: "name",
                            filterType: "text",
                            width: 120
                        },
                        LIB.tableMgr.column.company,
                        {
                            //title : "讲师类型",
                            title: "讲师类型",
                            fieldType: "custom",
                            render: function (data) {
                                return LIB.getDataDic("teacher_type", data.source);
                            },
                            filterType: "enum",
                            filterName: "criteria.intsValue.source",
                            orderName: "source",
                            popFilterEnum: LIB.getDataDicList("teacher_type"),
                            width: 100
                        },
                        {
                            //手机号码
                            title: "手机号码",
                            fieldName: "mobile",
                            filterType: "text",
                            width: 160
                        },

                        {
                            //邮箱
                            title: "电子邮箱",
                            fieldName: "email",
                            filterType: "text",
                            width: 200
                        },

                        {
                            //创建日期
                            title: "创建时间",
                            fieldName: "createDate",
                            filterType: "date",
                            width: 180
                        },
                    ]
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/teacher/importExcel"
            },
            exportModel: {
                url: "/teacher/exportExcel"
            }
        };
    }

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel
        },
        methods: {

        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
