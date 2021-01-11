define(function (require) {

    var LIB = require('lib');

    var initDataModel = function () {
        return {
            mainModel: {
                title: "选择隐患",
                selectedDatas: []
            },
            tableModel: (
                {
                    url: "pool/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        LIB.tableMgr.ksColumn.cb,
                        {
                            title: "编码",
                            fieldName: "title",
                            width: 180,
                            fieldType: "link",
                            filterName: "title",
                            filterType: "text"
                        },
                        {
                            title: "问题描述",
                            fieldName: "problem",
                            filterName: "criteria.strValue.problem",
                            filterType: "text",
                            renderClass: "textarea",
                            width: 320
                        },
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                        {
                            title: "检查人",
                            orderName: "attr1",
                            fieldName: "user.name",
                            filterType: "text",
                            filterName: "criteria.strValue.checkUserName",
                            width: 100
                        },
                        {
                            title: "隐患等级",
                            orderName: "type",
                            fieldType: "custom",
                            filterType: "enum",
                            filterName: "criteria.strsValue.riskType",
                            popFilterEnum: LIB.getDataDicList("risk_type"),
                            render: function (data) {
                                return LIB.getDataDic("risk_type", data.riskType);
                            },
                            width: 120
                        },
                        {
                            title: "状态",
                            orderName: "status",
                            fieldType: "custom",
                            filterType: "enum",
                            filterName: "criteria.intsValue.status",
                            popFilterEnum: LIB.getDataDicList("pool_status"),
                            render: function (data) {
                                return LIB.getDataDic("pool_status", data.status);
                            },
                            width: 120
                        },
                    ],
                    defaultFilterValue: {"disable":"0", "criteria.orderValue": {fieldName: "modifyDate", orderType: "1"}},
                    resetTriggerFlag: true
                }
            )
        };
    };

    var opts = {
        mixins: [LIB.VueMixin.selectorTableModal],
        data: function () {
            var data = initDataModel();
            return data;
        },
        name: "poolSelectTableModal"
    };
    var component = LIB.Vue.extend(opts);
    return component;
});