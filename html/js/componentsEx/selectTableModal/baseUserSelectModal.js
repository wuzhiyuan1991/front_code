define(function (require) {

    var LIB = require('lib');

    var initDataModel = function () {
        return {
            mainModel: {
                title: "选择人员",
                selectedDatas: []
            },
            tableModel: (
                {
                    url: "1",//"bizuserrel/list{/curPage}{/pageSize}?type=1",
                    selectedDatas: [],
                    columns: [{
                        fieldType: "cb"
                    },
                        {
                            title: "姓名",
                            fieldName: "user.name",
                            width: 150,
                            keywordFilterName: "criteria.strValue.keyWordValue_username"
                        },
                        LIB.tableMgr.ksColumn.company,
                        LIB.tableMgr.ksColumn.dept
                        // _.extend(_.omit(LIB.tableMgr.column.company, "filterType"), {width: 320}),
                        // _.extend(_.omit(LIB.tableMgr.column.dept, "filterType"), {width: 310}),
                    ],
                    defaultFilterValue: {"criteria.orderValue": {fieldName: "modifyDate", orderType: "1"}},
                    resetTriggerFlag: false
                }
            )
        };
    }

    var opts = {
        mixins: [LIB.VueMixin.selectorTableModal],
        data: function () {
            return initDataModel()
        },
        props: {
            url: {
                type: String,
                default: ""
            },
        },
        watch : {
            url : function(val) {
                val && (this.tableModel.url = val);
            }
        },
        created:function () {
            this.tableModel.url = this.url;
        }
    };

    var component = LIB.Vue.extend(opts);
    return component;
});