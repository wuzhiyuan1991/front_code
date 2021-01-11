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
                    url: "majorrisksource/mrsequipments/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [{
                        title: "",
                        fieldName: "id",
                        fieldType: "cb",
                    },
                        // {
                        //     //唯一标识
                        //     title: "编码",
                        //     fieldName: "code",
                        // },
                        {
                            //姓名
                            title: "名称",
                            fieldName: "name",
                        },
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
            var data = initDataModel();
            return data;
        },
        name: "retrainUserSelectModal"
    };

    var component = LIB.Vue.extend(opts);
    return component;
});