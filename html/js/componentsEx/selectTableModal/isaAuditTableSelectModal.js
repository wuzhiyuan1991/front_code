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
                    url: "isaaudittable/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            title:"",
                            fieldName:"id",
                            fieldType:"radio"
                        },
                        {
                            title:"审查表名称",
                            fieldName:"name",
                            width: 180
                        },
                        {
                            title:"总分",
                            fieldName:"score",
                            width: 80
                        },
                        _.extend(_.omit(LIB.tableMgr.column.company, "filterType"), {width: 200}),

                        _.extend(_.omit(LIB.tableMgr.column.dept, "filterType"), {width: 140}),

                        {
                            title:"创建时间",
                            fieldName:"createDate",
                            width: 160
                        },
                       /* {
                            title:"状态",
                            fieldType:"custom",
                            render: function(data){
                                return LIB.getDataDic("disable",data.disable);
                            }
                        }*/
                    ],
                    defaultFilterValue: {
                        "criteria.orderValue" : {
                            fieldName : "modifyDate",
                            orderType : "1"
                        },
                        disable : 0,
                        isComplete: '5'
                    },
                    resetTriggerFlag:false
                }
            )
        };
    }

    var opts = {
        mixins : [LIB.VueMixin.selectorTableModal],
        data: initDataModel,
        name: "auditTableSelectTableModal"
    };

    var component = LIB.Vue.extend(opts);
    return component;
});