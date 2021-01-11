define(function(require) {
    var LIB = require('lib');
    var template = require("text!./index.html");

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
                defaultFilterValue: { "criteria.orderValue": { fieldName: "modifyDate", orderType: "1" } }
            }
        }
    };

    var opts = {
        template: template,
        name: "lTreeRTableModal",
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            idAttr: {
                type: String,
                default: 'id'
            },
            pidAttr: {
                type: String,
                default: 'pid'
            },
            displayAttr: {
                type: String,
                default: 'name'
            },
            treeData: {
                type: [Array, Object],
                default: null
            },
            filterKey: {
                type: String,
                default: 'type'
            },
            filterTypes: {
                // [{value: '1',name: 'compId'},{value:'2', name:'orgId'}]
                type: Array,
                default: function () {
                    return [{value: '1',name: 'compId'},{value:'2', name:'orgId'}]
                }
            },
            // table请求数据url
            url: {
                type: String,
                default: ''
            },
            // table列配置
            columns: {
                type: Array,
                default: null
            },
            singleSelect: {
                type: Boolean,
                default: true
            },
            title: {
                type: String,
                default: ''
            }
        },
        data: initDataModel,
        methods: {
            buildFilterParams: function () {
                var _this = this;
                var params = [
                    {
                        type: 'save',
                        value: {
                            columnFilterName: 'criteria.strValue',
                            columnFilterValue: { keyWordValue: this.tableModel.keyword }
                        }
                    }
                ];
                var _filter = this.filterTypes.filter(function (item) {
                    return item.value = _this.treeModel.filterData[_this.filterKey]
                })[0];
                if(_filter) {
                    params.push({
                        type: 'save',
                        value: {
                            columnFilterName: _filter.name,
                            columnFilterValue: this.treeModel.filterData.id
                        }
                    })
                }
                return params;
            },
            doTreeNodeClick: function(obj) {
                if (obj.data.id === this.treeModel.filterData.id) {
                    return;
                }
                this.treeModel.filterData = obj.data;
                // this.filterTreeType = obj.data.type;
                this.$refs.table.doCleanRefresh(this.buildFilterParams());
            },
            onDbClickCell: function(data) {
                this.$emit('do-save', [data.entry.data]);
                this.visible = false;
            },
            doSave: function() {
                if (this.tableModel.selectedDatas.length === 0) {
                    LIB.Msg.warning("请选择数据");
                    return;
                }
                this.visible = false;
                this.$emit('do-save', this.tableModel.selectedDatas);
            },
            // 过滤树形组件
            doFilterTree: function(val) {
                this.treeModel.keyword = val;
            },
            // 过滤表格
            doFilterTable: function() {
                this.$refs.table.doCleanRefresh(this.buildFilterParams());
            },

            init: function() {
                var isNeedRefreshData = false;
                if (_.isEmpty(this.treeModel.data)) {
                    isNeedRefreshData = true;
                }
                if (isNeedRefreshData) {
                    //触发treeModel.data数据变化的事件， 必需先设置为空数据组
                    this.treeModel.data = [];
                    // 增加树加载提示
                    if (this.treeData.length > 300) {
                        this.treeModel.showLoading = true;
                        var _this = this;
                        //延迟防止卡顿
                        var intervalId = setTimeout(function() {
                            _this.treeModel.data = _this.treeData;
                            clearTimeout(intervalId);
                            _this.treeModel.showLoading = false;
                        }, 300);
                    } else {
                        this.treeModel.data = this.treeData;
                    }
                } else {
                    // 还原树组件状态
                    this.$nextTick(function() {
                        this.$els.mtree.scrollTop = 0;
                    });
                    this.treeModel.selectedData = [];
                }
            }
        },
        watch: {
            visible: function(val) {
                if (val) {
                    this.init();
                    this.$refs.table.doCleanRefresh([]);
                } else {
                    this.treeModel.keyword = "";
                    this.tableModel.keyword = "";
                }
            }
        },
        created: function() {
            this.orgListVersion = 1;
        },
    };
    var component = LIB.Vue.extend(opts);
    LIB.Vue.component('l-tree-r-table-modal', component);
});
