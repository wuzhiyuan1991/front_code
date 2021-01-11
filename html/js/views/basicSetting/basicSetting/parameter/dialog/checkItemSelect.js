define(function(require) {
    var LIB = require('lib');
    var template = require("text!./checkItemSelect.html");
    var api = require("../vuex/api");

    var initDataModel = function() {
        return {
            treeModel: {
                data: [],
                selectedData: [],
                keyword: '',
                filterData: { id: '' },
                showLoading: false
            },
            tableModel: {
                selectedDatas: [],
                keyword: '',
                url: 'checkitem/list{/curPage}{/pageSize}',
                columns: [
                    {
                        title: "checkbox",
                        fieldName: "id",
                        fieldType: "cb"
                    },
                    {
                        title: "检查项名称",
                        fieldName: "name",
                        width: 240
                    },
                    {
                        title: "分类",
                        fieldType: "custom",
                        render: function (data) {
                            if (data.riskType) {
                                return data.riskType.name;
                            }
                        },
                        width: 160
                    },
                    {
                        title: "类型",
                        fieldType: "custom",
                        width: 80,
                        render: function (data) {
                            if (data.type === '2') {
                                return "管理类";
                            } else if (data.type === '1') {
                                return "状态类";
                            } else if (data.type === '0') {
                                return "行为类";
                            }
                        }
                    },
                    {
                        title: "状态",
                        fieldType: "custom",
                        width: 80,
                        render: function (data) {
                            if (data.disable === '0') {
                                return "启用";
                            } else if (data.disable === '1') {
                                return "停用";
                            }
                        }
                    },
                    {
                        title: "设备设施",
                        fieldType: "custom",
                        render: function (data) {
                            return data.equipment == null ? "" : data.equipment.name;
                        },
                        width: 200
                    }
                ],
                defaultFilterValue: { "criteria.orderValue": { fieldName: "modifyDate", orderType: "1" } }
            }
        }
    };

    var opts = {
        template: template,
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            compId: {
                type: String,
                default: ''
            },
            pidAttr: {
                type: String,
                default: 'pid'
            }
        },
        data: initDataModel,
        methods: {
            buildFilterParams: function () {
                var params = [
                    {
                        type: 'save',
                        value: {
                            columnFilterName: 'criteria.strValue.keyWordValue',
                            columnFilterValue: this.tableModel.keyword
                        }
                    }
                ];
                if(_.isEmpty(this.treeModel.filterData.children)) {
                    params.push({
                        type: 'save',
                        value: {
                            columnFilterName: 'criteria.strValue.checkTableId',
                            columnFilterValue: this.treeModel.filterData.id
                        }
                    })
                }
                return params;
            },
            doTreeNodeClick: function(obj) {
                if(_.isEmpty(obj.data.compId)){
                    return;
                }
                if (obj.data.id === this.treeModel.filterData.id) {
                    return;
                }
                this.treeModel.filterData = obj.data;
                this.$refs.table.doCleanRefresh(this.buildFilterParams());
            },
            onDbClickCell: function(data) {
                this.$emit('do-save', [data.entry.data], this.treeModel.filterData.id);
                this.visible = false;
            },
            doSave: function() {
                if (this.tableModel.selectedDatas.length === 0) {
                    LIB.Msg.warning("请选择数据");
                    return;
                }
                this.$emit('do-save', this.tableModel.selectedDatas, this.treeModel.filterData.id);
                this.visible = false;
            },
            // 过滤树形组件
            doFilterTree: function(val) {
                var items;
                if(!val) {
                    this.buildTreeData(this.backupCheckTables);
                } else {
                    items = _.filter(this.backupCheckTables, function (item) {
                        return item.name.indexOf(val) > -1;
                    });
                    this.buildTreeData(items);
                }
            },
            // 过滤表格
            doFilterTable: function() {
                this.$refs.table.doCleanRefresh(this.buildFilterParams());
            },
            init: function () {
                this.treeModel.selectedData = [];
                this.tableModel.selectedDatas = [];
                this.treeModel.filterData = [];
                this.$refs.table.doClearData();
            },
            // 获取检查表
            getCheckTables: function () {
                var _this = this;
                api.getCheckTables({compId: this.compId}).then(function (res) {
                    var items = _.map(res.data.list, function (item) {
                        return {
                            compId: item.compId,
                            id: item.id,
                            name: item.name,
                            type: item.type
                        }
                    });
                    _this.backupCheckTables = items;
                    _this.buildTreeData(items);
                })
            },
            buildTreeData: function(items) {
                var root = {
                    id: "-1",
                    name: '全部',
                    children: []
                };
                var groups = _.groupBy(items, 'type');
                var child;
                _.each(groups, function (val, key) {
                    if (key === '0') {
                        child = {
                            id: key,
                            name: '非计划检查',
                            children: val
                        }
                    } else if (key === '1') {
                        child = {
                            id: key,
                            name: '计划检查',
                            children: val
                        }
                    } else {
                        child = {
                            id: key,
                            name: '通用',
                            children: val
                        }
                    }
                    root.children.push(child);
                });
                this.treeModel.data = root;
                // 还原树组件状态
                this.$nextTick(function() {
                    this.$els.mtree.scrollTop = 0;
                });
                this.treeModel.selectedData = [];
            }
        },
        watch: {
            visible: function(val) {
                if (val) {
                    this.init();
                    this.getCheckTables();
                    // this.$refs.table.doCleanRefresh();
                } else {
                    this.treeModel.keyword = "";
                    this.tableModel.keyword = "";
                }
            }
        },
        created: function() {
            this.orgListVersion = 1;
        }
    };
    var component = LIB.Vue.extend(opts);
    return component;
});
