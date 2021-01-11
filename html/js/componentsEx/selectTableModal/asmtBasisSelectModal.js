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
                    url: "asmtbasis/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                            width: 60
                        },
                        {
                            //编码
                            title: "编码",
                            fieldName: "code",
                            width: 150
                        },
                        {
                            title: "依据名称",
                            fieldName: "name",
                            width: 450
                        },
                        _.extend({}, _.omit(LIB.tableMgr.column.company, "filterType"), {width: 180})
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
        name:"asmtBasisSelectTableModal"
    };

    var component = LIB.Vue.extend(opts);
    return component;
});