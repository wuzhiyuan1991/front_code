define(function (require) {

    var LIB = require('lib');

    var initDataModel = function () {
        return {
            mainModel: {
                title: "选择",
                selectedDatas: []
            },
            tableModel: (
                {
                    url: "opemercard/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.ksColumn.cb,
                        {
                            title: "编码",
                            fieldName: "attr1",
                            width: 180,
                            orderName: "attr1",
                            keywordFilterName: "criteria.strValue.keyWordValue_attr1",
                        },
                        {
                            //卡票名称
                            title: "应急处置卡名称",
                            fieldName: "name",
                            keywordFilterName: "criteria.strValue.keyWordValue_name",
                        }
                    ],

                    defaultFilterValue: {
                        "criteria.orderValue": {fieldName: "modifyDate", orderType: "1"},
                        "disable": 0,
                        "status": 2
                    },
                    resetTriggerFlag: false
                }
            )
        };
    };

    var opts = {
        mixins: [LIB.VueMixin.selectorTableModal],
        data: function () {
            var data = initDataModel();
            return data;
        },
        name: "opEmerCardSelectTableModal"
    };

    var component = LIB.Vue.extend(opts);
    return component;
});