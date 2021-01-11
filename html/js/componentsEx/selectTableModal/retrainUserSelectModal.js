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
                    url: "traintask/retrainlist{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [{
                        title: "",
                        fieldName: "id",
                        fieldType: "cb",
                    },
                        {
                            //唯一标识
                            title: "编码",
                            fieldName: "code",
                        },
                        {
                            //姓名
                            title: "姓名",
                            fieldName: "user.name",
                            width: 120
                        },
                        {
                            //课程名称
                            title: "课程名称",
                            fieldName: "course.name",
                            width: 240
                        },
                        {
                            //课程类型
                            title: "课程类型",
                            fieldName: "course.attr1",
                            width: 100
                        },
                        {
                            //复培时间 培训时间加上课程复培周期
                            title: "复培时间",
                            fieldName: "expiredDate",
                        },
                    ],

                    defaultFilterValue : {"criteria.orderValue" : {fieldName : "modifyDate", orderType : "1"}},
                    resetTriggerFlag: false
                }
            )
        };
    }

    var opts = {
        mixins : [LIB.VueMixin.selectorTableModal],
        data:function(){
            var data = initDataModel();
            return data;
        },
        name:"retrainUserSelectModal"
    };

    var component = LIB.Vue.extend(opts);
    return component;
});