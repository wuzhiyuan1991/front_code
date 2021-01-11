define(function(require) {

    var LIB = require('lib');

    var initDataModel = function () {
        return {
            mainModel:{
                title:"选择",
                selectedDatas:[]
            },
            tableModel: (
                {
                    url: "asmttable/list{/curPage}{/pageSize}",
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
                            width: 160
                        },
                        {
                            title: "自评表名称",
                            fieldName: "name",
                            width: 240
                        },
                        _.omit(LIB.tableMgr.column.company, "filterType")
                    ],
                    defaultFilterValue : {"criteria.orderValue" : {fieldName : "modifyDate", orderType : "1"}},
                    resetTriggerFlag:false
                }
            )
        };
    };

    var opts = {
        mixins : [LIB.VueMixin.selectorTableModal],
        data:function(){
            var data = initDataModel();
            return data;
        },
        name:"asmtTableSelectTableModal"
    };

    var component = LIB.Vue.extend(opts);
    return component;
});