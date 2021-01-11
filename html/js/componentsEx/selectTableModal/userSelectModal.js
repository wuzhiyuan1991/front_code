define(function (require) {

    var LIB = require('lib');
    var memberSelect = require("./memberSelectModal")

    var initDataModel = function () {
        return {
            mainModel: {
                title: "选择人员",
                selectedDatas: []
            },
            // tableModel: (
            //     {
            //         //url: "user/list{/curPage}{/pageSize}?disable=0",
            //         url: "user/posHseList{/curPage}{/pageSize}?disable=0",
            //         selectedDatas: [],
            //         columns: [{
            //             fieldType: "cb"
            //         },
            //             {
            //                 title: "姓名",
            //                 fieldName: "username",
            //                 width: 100
            //             },
            //
            //             _.extend(_.omit(LIB.tableMgr.column.company, "filterType"), {width: 200}),
            //             _.extend(_.omit(LIB.tableMgr.column.dept, "filterType"), {width: 140}),
            //             {
            //                 title: "岗位",
            //                 fieldType: "custom",
            //                 render: function (data) {
            //                     if (data.positionList) {
            //                         var posNames = "";
            //                         data.positionList.forEach(function (e) {
            //                             if (e.postType == 0 && e.name) {
            //                                 posNames += (e.name + ",");
            //                             }
            //                         });
            //                         posNames = posNames.substr(0, posNames.length - 1);
            //                         return posNames;
            //
            //                     }
            //                 },
            //                 width: 120
            //             },
            //
            //             {
            //                 title: "安全角色",
            //                 fieldType: "custom",
            //                 render: function (data) {
            //                     if (data.positionList) {
            //                         var roleNames = "";
            //                         data.positionList.forEach(function (e) {
            //                             if (e.postType == 1 && e.name) {
            //                                 roleNames += (e.name + ",");
            //                             }
            //                         });
            //                         roleNames = roleNames.substr(0, roleNames.length - 1);
            //                         return roleNames;
            //
            //                     }
            //                 },
            //                 width: 120
            //             },
            //             {
            //                 title: "手机",
            //                 fieldName: "mobile",
            //                 width: 120
            //             }
            //         ],
            //         defaultFilterValue: {"criteria.orderValue": {fieldName: "modifyDate", orderType: "1"}},
            //         resetTriggerFlag: false
            //     }
            // )
        };
    }

    var opts = {
        // mixins: [LIB.VueMixin.selectorTableModal],
        mixins:[memberSelect],
        data: function () {
            var data = initDataModel();
            return data;
        },
        name: "userSelectTableModal"
    };

    var component = LIB.Vue.extend(opts);
    return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});