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
                    url: "majorrisksource/equipments/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "radio"
                        },
                        {
                            //设备编号
                            title: "设备编号",
                            fieldName: "code",
                            width: 180
                        },
                        {
                            //设备设施名称
                            title: "设备设施名称",
                            fieldName: "name",
                            width: 180
                        },
                        {
                            title: "分类",
                            fieldName: "equipmentType.name",
                            width: 160
                        },
                        _.omit(LIB.tableMgr.column.company, "filterType"),
                        _.omit(LIB.tableMgr.column.dept, "filterType"),
                        {
                            title: "属地",
                            fieldName: "dominationArea.name"
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