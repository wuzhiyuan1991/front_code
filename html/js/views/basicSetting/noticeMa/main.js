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
            moduleCode: "pushNotice",
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
                    url: "pushnotice/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [{
                        title: "",
                        fieldName: "id",
                        fieldType: "cb",
                    },
                        {
                            //唯一标识
                            title: "编码",
                            fieldName: "code",
                            fieldType: "link",
                            filterType: "text",
                            width: 160
                        },
                        {
                            //标题
                            title: "消息主题",
                            fieldName: "title",
                            filterType: "text",
                            width: 160
                        },
                        {
                            //内容
                            title: "消息内容",
                            fieldName: "content",
                            filterType: "text",
                            width: 240
                        },
                        {
                            title: this.$t("gb.common.state"),
                            fieldName: "disable",
                            dataDicKey:"modeler_type",
                            orderName: "disable",
                            fieldType: "custom",
                            render: function (data) {
                                return LIB.getDataDic("modeler_type", data.disable);
                            },
                            popFilterEnum: LIB.getDataDicList("modeler_type"),
                            filterType: "enum",
                            filterName: "criteria.intsValue.disable",
                            width: 100
                        },

                        {
                            //修改日期
                            title: "发送时间",
                            fieldName: "modifyDate",
                            filterName: "publishDate",
                            filterType: "date",
                            render: function (data) {
                                if (data.disable == 1) {
                                    return data.modifyDate;
                                } else {
                                    return "-";
                                }
                            },
                            width: 180
                        }
                    ]
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/pushnotice/importExcel"
            },
            exportModel: {
                url: "/pushnotice/exportExcel",
                withColumnCfgParam: true
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
