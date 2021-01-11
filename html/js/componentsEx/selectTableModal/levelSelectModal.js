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
                    url: "riskjudgmentunit/nextunits{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [{
                        title: "",
                        fieldName: "id",
                        fieldType: "cb",
                        width:60
                    },
                        {
                            //部门名称
                            title: "研判单位",
                            fieldName: "name",
                            width: 760
                        },
                    ],
                    resetTriggerFlag:false
                }
            )
        };
    }

    var opts = {
        mixins : [LIB.VueMixin.selectorTableModal],
        props:["id", "levelId"],
        data: function () {
            var data = initDataModel();
            return data;
        },
        name: "levelSelectTableModal"
    };

    var component = LIB.Vue.extend(opts);
    return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});