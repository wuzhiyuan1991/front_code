define(function (require) {

    var LIB = require('lib');
    var template = require("text!./cardSelectModal.html");

    var cardTypes = [
        {
            id: '1',
            value: '操作票'
        },
        // {
        //     id: '2',
        //     value: '维检修作业卡'
        // }
    ];

    var urls = {
        '1': 'opstdcard/list{/curPage}{/pageSize}',
        '2': 'opmaintcard/list{/curPage}{/pageSize}'
    };
    var sColumns = [
        {
            title: "cb",
            fieldName: "id",
            fieldType: "radio",
        },
        {
            title: "编码",
            fieldName: "attr1",
            width: 180,
            orderName: "attr1",
            keywordFilterName: "criteria.strValue.keyWordValue_attr1",
        },
        {
            //卡票名称
            title: "操作票名称",
            fieldName: "name",
            keywordFilterName: "criteria.strValue.keyWordValue_name",
            width: 260
        },
        {
            title: "流程操作名称",
            fieldName: "content",
            filterType: "text",
            width: 250,
            keywordFilterName: "criteria.strValue.keyWordValue_content",
        }
    ];
    var mColumns = [
        {
            title: "cb",
            fieldName: "id",
            fieldType: "radio",
        },
        {
            title: "编码",
            fieldName: "attr1",
            width: 180,
            orderName: "attr1",
            keywordFilterName: "criteria.strValue.keyWordValue_attr1",
        },
        {
            //卡票名称
            title: "维修卡名称",
            fieldName: "name",
            keywordFilterName: "criteria.strValue.keyWordValue_name",
            width: 260
        },
        {
            title: "设备名称",
            fieldName: "equipName",
            filterType: "text",
            width: 150,
            keywordFilterName: "criteria.strValue.keyWordValue_equip_name"
        }
    ];

    var columns = {
        '1': sColumns,
        '2': mColumns
    };

    var opts = {
        template: template,
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            //自定义初始化过滤条件
            defaultFilterValue: {
                type: Object
            },
            filterData: {
                type: Object
            },
            cardType: {
                type: String,
                default: '1'
            }
        },
        data: function () {
            return {
                mainModel: {
                    title: "选择票卡",
                    selectedDatas: [],
                    type: ''
                },
                tableModel: {
                    url: "",
                    selectedDatas: [],
                    columns: [],

                    defaultFilterValue: {
                        "criteria.orderValue": {fieldName: "modifyDate", orderType: "1"},
                        "disable": 0,
                        "status": 2
                    },
                    resetTriggerFlag: false
                },
                cardTypes: cardTypes
            };
        },
        watch: {
            visible: function (val) {
                if (val) {
                    this._init();
                }
            }
        },
        methods: {
            _init: function () {
                this.mainModel.type = this.cardType;
                this.tableModel.url = urls[this.cardType];
                this.tableModel.columns = columns[this.cardType];
                this.$nextTick(function () {
                    this.doCleanRefresh();
                });
            },
            doCleanRefresh: function () {
                var tableFilterDatas = [];
                var filterData = this.filterData;
                if (filterData) {
                    for (key in filterData) {
                        var value = filterData[key];
                        if (value && value.toString().trim() != "") {
                            var tableFilterData = {
                                type: "save",
                                value: {
                                    columnFilterName: key,
                                    columnFilterValue: value
                                }
                            };
                            tableFilterDatas.push(tableFilterData);
                        }
                    }
                }
                this.$refs.table.doCleanRefresh(tableFilterDatas);
            },
            doChangeCollect: function (data) {
                this.tableModel.url = urls[data];
                this.tableModel.columns = columns[data];
                this.$nextTick(function () {
                    this.doCleanRefresh();
                });
            },
            //双击关闭modal
            onDbClickCell: function () {
                this.visible = false;
                this.$emit('do-save', this.mainModel.selectedDatas, this.mainModel.type);
            },
            doSave: function () {
                if (_.isEmpty(this.mainModel.selectedDatas)) {
                    LIB.Msg.warning("请选择数据");
                    return
                }
                this.visible = false;
                this.$emit('do-save', this.mainModel.selectedDatas, this.mainModel.type);
            }
        },
        beforeCompile: function () {
            if (!!this.tableModel) {
                //增加弹窗列表选择框的默认过滤列查询条件criteria.strValue.keyWordValue
                this.tableModel.filterColumn = this.tableModel.filterColumn || [];
                this.tableModel.filterColumn = _.union(this.tableModel.filterColumn, ["criteria.strValue.keyWordValue"]);
            }
        }
    };

    var component = LIB.Vue.extend(opts);
    return component;
});