define(function (require) {
    var template = require("text!./checkObjectSelect.html");
    var LIB = require('lib');
    var api = require("../vuex/api");

    var LIB = require('lib');

    var initDataModel = function () {
        return {
            mainModel: {
                title: "选择",
                selectedDatas: []
            },
            tableModel: (
                {
                    url: "checktaskgroup/list/{curPage}/{pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "",
                            fieldName: "id",
                            fieldType: "cb",
                        },
                        {
                            title: "工作任务",
                            filterType: "text",
                            render: function (data) {
                                return data.groupName + "#" + data.num;
                            },
                            width: 240
                        },
                        {
                            title: "工作表",
                            render: function (data) {
                                if (data.checkPlan) {
                                    return _.pluck(data.checkPlan.checkObjectTableBeans, 'checkTableName').join(', ')
                                }
                            },
                            width: 240
                        },
                        {
                            //任务序号
                            title: "任务状态",
                            fieldType: "custom",
                            //filterType: "enum",
                            width: '100px',
                            render: function (data) {
                                return LIB.getDataDic("check_status", data.status);
                            },
                            filterName: "criteria.intsValue.type"
                        },
                        {
                            //开始时间
                            title: "开始时间",
                            fieldName: "startDate",
                            width: '150px'
                        },
                        {
                            //结束时间
                            title: "结束时间",
                            fieldName: "endDate",
                            width: '150px'
                        }

                    ],
                    defaultFilterValue: {"criteria.orderValue": {fieldName: "checkplan.modify_date desc,user.username asc,e.num", orderType: "0"}},
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
        name: "checkTaskSelectTableModal"
    };

    var component = LIB.Vue.extend(opts);
    return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});