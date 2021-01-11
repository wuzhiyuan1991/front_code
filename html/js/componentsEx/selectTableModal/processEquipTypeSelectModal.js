define(function (require) {

    var LIB = require('lib');

    var initDataModel = function () {
        return {
            mainModel: {
                title: "选择设备类型",
                selectedDatas: []
            },
            tableModel: (
                {
                    url: "majorchemicalprocess/equipmenttypes/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "radio"
                        },
                        {
                            //设备编号
                            title: "编码",
                            fieldName: "code",
                            width: 180
                        },
                        {
                            //设备设施名称
                            title: "设备类型名称",
                            fieldName: "name"
                        }
                    ],
                    defaultFilterValue: {"criteria.orderValue": {fieldName: "modifyDate", orderType: "1"}},
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
        }
    };

    var component = LIB.Vue.extend(opts);
    return component;
});