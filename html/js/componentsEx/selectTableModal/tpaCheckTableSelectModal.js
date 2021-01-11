define(function (require) {

    var LIB = require('lib');

    var initDataModel = function () {
        return {
            mainModel: {
                title: "选择",
                selectedDatas: [],
                collections: [
                    {
                        id: '1',
                        name: '全部'
                    },
                    {
                        id: '2',
                        name: '我的收藏'
                    }
                ]
            },
            tableModel: (
                {
                    url: "tpachecktable/list{/curPage}{/pageSize}",
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
                            fieldName: "code"
                        },
                        {
                            //检查表名称
                            title: "检查表名称",
                            fieldName: "name"
                        },
                        {
                            title: "分类",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.checkTableType) {
                                    return data.checkTableType.name;
                                }
                            }
                        },
                        {
                            //检查表类型 1计划检查,0日常检查
                            title: "检查表类型",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.type == 1) {
                                    return "计划检查";
                                } else {
                                    return "日常检查";
                                }
                            },
                        },
                        {
                            title: "创建时间",
                            fieldName: "createDate"
                        },
                        {
                            title: "状态",
                            fieldType: "custom",
                            render: function (data) {
                                return LIB.getDataDic("disable", data.disable);
                            },
                            filterName: "criteria.intsValue.disable"
                        }
//					 LIB.tableMgr.column.company,
////					 LIB.tableMgr.column.company,
////					{
//						//是否禁用 0启用,1禁用
//						title: "是否禁用",
//						fieldName: "disable",
//					},
//					{
//						//备注
//						title: "备注",
//						fieldName: "remarks",
//					},
//					{
//						//检查表类型 10 证书类 20 资料类
//						title: "检查表类型",
//						fieldName: "tableType",
//					},
//					{
//						//修改日期
//						title: "修改日期",
//						fieldName: "modifyDate",
//					},
//					{
//						//创建日期
//						title: "创建日期",
//						fieldName: "createDate",
//					},
                    ],

                    defaultFilterValue: {"criteria.orderValue": {fieldName: "modifyDate", orderType: "1"}},
                    resetTriggerFlag: false
                }
            ),
            selectModel: {
                collect: '1'
            }
        };
    };

    var opts = {
        mixins: [LIB.VueMixin.selectorTableModal],
        data: function () {
            var data = initDataModel();
            return data;
        },
        name: "tpaCheckTableSelectTableModal",
        methods: {
            doChangeCollect: function (value) {
                if (value === '1') {
                    this.tableModel.url = 'tpachecktable/list{/curPage}{/pageSize}';
                } else {
                    this.tableModel.url = 'collect/list{/curPage}{/pageSize}'
                }
                this.doCleanRefresh();
            }
        }
    };

    var component = LIB.Vue.extend(opts);
    return component;
//	var component = LIB.Vue.extend(opts);
//	LIB.Vue.component('checkplan-select-modal', component);
});