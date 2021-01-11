define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("./detail-xl");

    var isEmer = 0;

    var initDataModel = function () {
        return {
            moduleCode: "coursetrainfile",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
//                detailPanelClass : "middle-info-aside"
                detailPanelClass: "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "traintask/statistic/course/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                        },
                        {
                            //课程编码
                            title: "课程编码",
                            fieldName: "code",
                            fieldType: "link",
                            filterType: "text",
                            orderName: "e.code",
                            width: 160
                        },
                        {
                            //课程名称
                            title: "课程名称",
                            fieldName: "name",
                            filterType: "text",
                            orderName: "e.name",
                            width: 240
                        },
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        {
                            //课程类型
                            title: "课程类型",
                            fieldName: "attr1",
                            filterType: "text",
                            orderName: "e.attr1",
                            width: 240
                        },
//					LIB.tableMgr.column.company,
                        {
                            //title : "培训方式",
                            title: this.$t("bd.trm.trainingMode"),
                            fieldType: "custom",
                            render: function (data) {
                                return LIB.getDataDic("course_type", data.type);
                            },
                            filterType: "enum",
                            filterName: "criteria.intsValue.type",
                            orderName: "e.type",
                            popFilterEnum: LIB.getDataDicList("course_type"),
                            width: 100
                        },
                        {
                            //培训人数
                            title: "培训次数",
                            fieldName: "total",
                            filterType: "number",
                            width: 120
                        },
                        {
                            //取消人数
                            title: "取消次数",
                            fieldName: "cancel",
                            filterType: "number",
                            width: 120
                        },
                        {
                            //通过人数
                            title: "通过次数",
                            fieldName: "pass",
                            filterType: "number",
                            width: 120
                        },
                        {
                            //通过率
                            title: "通过率",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.total > 0) {
                                    return data.percent + "%";
                                } else {
                                    return "-";
                                }
                            },
                            filterType: "text",
                            filterName: "percent",
                            orderName: "percent",
                            width: 100
                        },
                    ],
                    defaultFilterValue: {"criteria.orderValue": {fieldName: "e.modify_date", orderType: "1"}, "criteria.intValue": {isEmer: isEmer}},
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: ""
            },
            exportModel: {
                url: "/traintask/exportExcel/course",
                singleUrl: "/traintask/{id}/exportExcel/coursedetail"
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
            doExportDetail: function () {
                var rows = this.tableModel.selectedDatas;
                if (rows.length > 1) {
                    LIB.Msg.warning("无法批量操作数据");
                    return;
                }

                window.open(this.exportModel.singleUrl.replace("\{id\}", rows[0].id));

            },
        },
        events: {},
        init: function () {
        isEmer = 0;
        this.isEmer = false;
        if(this.$route.path.indexOf("/emer") == 0) {
            this.$api = require("../../emerMa/trainingCourseFile/vuex/api");
            isEmer = 1;
            this.isEmer = true;
        } else{
            this.$api = api;
        }
    },
    });

    return vm;
});
