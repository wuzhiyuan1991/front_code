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
            moduleCode: "asmtShare",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass: "middle-info-aside"
                //detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "asmtshare/list/{curPage}/{pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb"
                        },
                        {
                            //编码
                            title: "编码",
                            fieldName: "code",
                            fieldType: "link",
                            filterType: "text",
                            width: 160
                        },
                        {
                            title: "分享人",
                            fieldName: "publisherName",
                            filterType: "text"
                        },
                        LIB.tableMgr.column.company,
                        {
                            title: "反馈内容",
                            fieldName: "content",
                            filterType: "text"
                        },
                        {
                            title: "自评项",
                            fieldName: "projectInfo",
                            filterType: "text",
                            orderName: "asmtitem.name"
                        },
                        {
                            title: "分享时间",
                            fieldName: "createDate",
                            filterType: "date"
                        },
                        {
                            title: "分享反馈",
                            fieldName: "praises",
                            render: function (data) {
                                return '<img src="images/good_up.png" width="20px" height="20px"><span style="margin-left: 7px;vertical-align: sub;">' + data.praises + '</span>';
                            },
                            filterType: "number"
                        }
                    ]
                }
            ),
            detailModel: {
                show: false
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
        methods: {},
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
