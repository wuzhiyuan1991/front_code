define(function (require) {

    var LIB = require('lib');

    var initDataModel = function () {
        return {
            mainModel: {
                title: "选择属地",
                selectedDatas: []
            },
            tableModel: (
                {
                    url: "dominationarea/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.ksColumn.cb,
                        LIB.tableMgr.ksColumn.code,
                        {
                            //名称
                            title: "属地名称",
                            fieldName: "name",
                            keywordFilterName: "criteria.strValue.keyWordValue_name"
                        },
                        _.omit(LIB.tableMgr.ksColumn.company, "filterType"),
                        _.omit(LIB.tableMgr.ksColumn.dept, "filterType")
                    ],

                    defaultFilterValue: {"disable":"0", "criteria.orderValue": {fieldName: "modifyDate", orderType: "1"}},
                    resetTriggerFlag: true
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
        name: "dominationAreaSelectTableModal"
    };

    var component = LIB.Vue.extend(opts);
    return component;
});