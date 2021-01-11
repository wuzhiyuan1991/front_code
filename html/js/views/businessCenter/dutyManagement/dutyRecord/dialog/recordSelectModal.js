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
                    url: "dutyprocesstemplate/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.column.cb,
                        LIB.tableMgr.column.code,
                        {
                            //计划名
                            title: "模板名称",
                            fieldName: "name",
                            filterType: "text"
                        },
                        {
                            title: "模板类型",
                            fieldName: "type",
                            filterType: "text"
                        },
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                    ],

                    defaultFilterValue : {"criteria.orderValue" : {fieldName : "modifyDate", orderType : "1"}},
                    resetTriggerFlag:false
                }
            )
        };
    }

    var opts = {
        mixins : [LIB.VueMixin.selectorTableModal],
        data: initDataModel,
        name: "deptSelectTableModal"
    };

    var component = LIB.Vue.extend(opts);
    return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});