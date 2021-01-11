/**
 * Created by yyt on 2016/12/27.
 */
define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"))
    //编辑弹框页面
    var detailPanel = require("./detail");
    var initDataModel = function () {
        return {
            moduleCode: "i18n_moduleCode",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: []
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "i18n/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                        }, {
                            title: this.$t("gb.common.code"),
                            width: 220,
                            fieldName: "code",
                            fieldType: "link",
                            filterType: "text"

                        }, {
                            title: this.$t("gb.common.chinese"),
                            fieldName: "zhValue",
                            filterType: "text",
                            width: 180
                        }, {
                            title: this.$t("gb.common.english"),
                            fieldName: "enValue",
                            filterType: "text",
                            width: 200
                        }, {
                            title: this.$t("gb.common.model"),
                            fieldName: "moduleName",
                            filterType: "text",
                            width: 120
                        }, {
                            title: this.$t("gb.common.createTime"),
                            fieldName: "createDate",
                            filterType: "date",
                            width: 180
                        }, {
                            title: this.$t("gb.common.modifyTime"),
                            fieldName: "modifyDate",
                            filterType: "date",
                            width: 180
                        }, {
                            title: this.$t("gb.common.remarks"),
                            fieldName: "remarks",
                            filterType: "text",
                            width: 360
                        }
                    ]
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/i18n/importExcel"
            },
            exportModel: {
                url: "/i18n/exportExcel",
                withColumnCfgParam: true
            }
        };
    }

    var vm = LIB.VueEx.extend({
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel
        },
        methods: {},
        events: {},
        ready: function () {
            this.$api = api;
        }
    });

    return vm;
});
