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
                    url: "logback/list",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                        }, {
                            title: "packageName (包名)",
                            width: 250,
                            fieldName: "name",
                            fieldType:'link',
                            fixed: true
                        },
                        {
                            title: "日志等级",
                            fieldName: "level",

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
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel
        },
        methods: {
            doTableCellClick: function(data) {
                if (!!this.showDetail && data.cell.fieldName == "name") {
                    this.showDetail(data.entry.data);
                } else {
                    (!!this.detailModel) && (this.detailModel.show = false);
                }
            }
        },
        events: {},
        ready: function () {
            this.$api = api;
        }
    });

    return vm;
});
