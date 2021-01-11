define(function (require) {
    var LIB = require('lib');
    var template = require("text!./equipmentTypeSelectModal.html");
    var api = require("views/businessFiles/equipment/equipmentType/vuex/api");
    var initDataModel = function () {
        return {
            mainModel: {
                model: {
                    type: [Array, Object],
                    default: ''
                },
                title: '选择设备设施类型'
            },
            treeModel: {
                data: [],
                selectedData: [],
                keyword: '',
                filterData: {
                    id: ''
                },
                showLoading: false,
            },
            tableModel: ({
                url: "equipmenttype/list{/curPage}{/pageSize}",
                selectedDatas: [],
                columns: [{
                        title: "",
                        fieldName: "id",
                        fieldType: "cb",
                        width: 40,
                    },
                    {
                        //设备设施类型名
                        title: "设备设施类型名",
                        fieldName: "attr4",
                        width: 200,
                        render: function (data) {
                            if (data && data.attr4) {
                                return data.attr4;
                            } else if (data) {
                                return data.name;
                            } else {
                                return "";
                            }

                        }
                    },
                    {
                        //编码
                        title: "编码",
                        fieldName: "code",
                        width: 100,
                    },
                ],
                defaultFilterValue: {
                    "disable": "0",
                    "criteria.orderValue": {
                        fieldName: "modifyDate",
                        orderType: "1"
                    },
                    "criteria.intValue": {
                        isLeaf: 1
                    }
                },
                resetTriggerFlag: false
            }),
            isCacheSelectedData: true
        }
    };

    var opts = {
        template: template,
        name: "equipment-type-select-modal",
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            isSingleSelect: {
                type: Boolean,
                default: true
            }
        },
        data: initDataModel,
        methods: {
            doTreeNodeClick: function (obj) {
                if (obj.data.id === this.treeModel.filterData.id) return;
                this.treeModel.filterData.id = obj.data.id;
                var params = [{
                    type: 'save',
                    value: {
                        columnFilterName: 'criteria.strValue.topParentId',
                        columnFilterValue: this.treeModel.filterData.id
                    }
                }, {
                    type: 'save',
                    value: {
                        columnFilterName: 'criteria.strValue',
                        columnFilterValue: {
                            keyWordValue: this.tableModel.keyword
                        }
                    }
                }];
                this.$refs.table.doCleanRefresh(params);
            },
            onDbClickCell: function (data) {
                if (this.isSingleSelect) {
                    this.$emit('do-save', [data.entry.data]);
                    this.visible = false;
                }
            },
            doSave: function () {
                if (this.tableModel.selectedDatas.length === 0) {
                    LIB.Msg.warning("请选择数据");
                    return;
                }
                this.visible = false;
                this.$emit('do-save', this.tableModel.selectedDatas);
            },
            doFilterLeft: function (val) {
                this.treeModel.keyword = val;
            },
            doFilterRight: function () {
                var params = [{
                    type: 'save',
                    value: {
                        columnFilterName: 'criteria.strValue.topParentId',
                        columnFilterValue: this.treeModel.filterData.id
                    }
                }, {
                    type: 'save',
                    value: {
                        columnFilterName: 'criteria.strValue',
                        columnFilterValue: {
                            keyWordValue: this.tableModel.keyword
                        }
                    }
                }];
                this.$refs.table.doCleanRefresh(params);
            },
            init: function () {
                this.treeModel.data = [];
                var _this = this;
                api.getTypeList().then(function (res) {
                    _this.treeModel.data = _.filter(res.data, function (item) {
                        return !item.parentId;
                    })

                })
            }
        },
        watch: {
            visible: function (val) {
                if (val) {
                    this.init();
                    this.$refs.table.doCleanRefresh([]);
                } else {
                    this.treeModel.keyword = "";
                    this.tableModel.keyword = "";
                }
            }
        },
        created: function () {
            if (this.isSingleSelect) {
                this.isCacheSelectedData = false;
            } else {
                this.isCacheSelectedData = true;
            }
        }
    };
    var component = LIB.Vue.extend(opts);
    LIB.Vue.component('equipment-type-select-modal', component);

    return opts;
})