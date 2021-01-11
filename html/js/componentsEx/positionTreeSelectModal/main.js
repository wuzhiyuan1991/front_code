define(function (require) {
    var LIB = require('lib');
    var template = require("text!./main.html");

    var positionColumns = [
        {
            title: "",
            fieldName: "id",
            fieldType: "cb"
        },
        {
            title: "岗位",
            fieldName:'name',
            width: 180
        },
        {
            title: '所属公司',
            fieldName: 'compId',
            render: function (data) {
                if (data.compId) {
                    return LIB.getDataDic("org", data.compId)["compName"];
                }
            },
            width: 180
        },
        {
            title: '所属部门',
            fieldName: 'orgId',
            render: function (data) {
                if (data.orgId) {
                    return LIB.getDataDic("org", data.orgId)["deptName"];
                }
            },
            width: 180
        }
    ];

    var hseColumns = [
        {
            title: "",
            fieldName: "id",
            fieldType: "cb"
        },
        {
            title: "安全角色",
            fieldName:'name',
            width: 180
        },
        {
            title: '所属公司',
            fieldName: 'compId',
            render: function (data) {
                if (data.compId) {
                    return LIB.getDataDic("org", data.compId)["compName"];
                }
            }
        }
    ];

    var initDataModel = function () {
        return {
            mainModel: {
                model: {
                    type: [Array, Object],
                    default: ''
                },
                title: '选择岗位'
            },
            treeModel: {
                data: [],
                selectedData: [],
                keyword: '',
                filterData: {id: ''},
                showLoading: false,
            },
            tableModel: {
                url: "position/list{/curPage}{/pageSize}",
                selectedDatas: [],
                keyword: '',
                columns: positionColumns,
                defaultFilterValue: {"criteria.orderValue": {fieldName: "modifyDate", orderType: "1"}}
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
            isSingleSelect: {
                type: Boolean,
                default: false
            },
            filterData: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            postType: {
                type: String,
                default: '0'
            }
        },
        computed: {
            title: function () {
                if(this.postType === '0'){
                    return '选择岗位'
                } else{
                    return '选择安全角色'
                }
            },
            placeholder: function () {
                if(this.postType === '0'){
                    return '岗位、公司、部门'
                } else{
                    return '安全角色、公司'
                }
            }
        },
        data: initDataModel,
        watch: {
            visible: function (val) {
                if (val) {
                    this.param = [];
                    for(var k in this.filterData) {
                        this.param.push({
                            type: 'save',
                            value: {
                                columnFilterName:  k,
                                columnFilterValue: this.filterData[k]
                            }
                        })
                    }

                    this.init();
                    this.$refs.table.doCleanRefresh(this.param);
                } else {
                    this.treeModel.keyword = "";
                    this.tableModel.keyword = "";
                }
            },
            postType: function (nVal, oVal) {
                if(nVal === '0') {
                    this.tableModel.columns = positionColumns;
                } else {
                    this.tableModel.columns = hseColumns;
                }
            }
        },
        methods: {
            doTreeNodeClick: function (obj) {
                var params = null;
                if (obj.data.id === this.treeModel.filterData.id) return;
                this.treeModel.filterData.id = obj.data.id;
                this.filterTreeType = obj.data.type;
                if (obj.data.type == "1") {
                    params = [{
                        type: 'save',
                        value: {
                            columnFilterName: 'compId',
                            columnFilterValue: this.treeModel.filterData.id
                        }
                    }, {
                        type: 'save',
                        value: {
                            columnFilterName: 'criteria.strValue',
                            columnFilterValue: {keyWordValue: this.tableModel.keyword}
                        }
                    }];
                } else {
                    params = [{
                        type: 'save',
                        value: {
                            columnFilterName: 'orgId',
                            columnFilterValue: this.treeModel.filterData.id
                        }
                    }, {
                        type: 'save',
                        value: {
                            columnFilterName: 'criteria.strValue',
                            columnFilterValue: {keyWordValue: this.tableModel.keyword}
                        }
                    }];
                }
                params = params.concat(this.param);

                this.$refs.table.doCleanRefresh(params);
            },
            onDbClickCell: function (data) {
                if (this.isSingleSelect) {
                    this.$emit('do-save', data.entry.data);
                    this.visible = false;
                }
            },
            doSave: function () {
                if (this.tableModel.selectedDatas.length === 0) {
                    LIB.Msg.warning("请选择数据");
                    return;
                }
                this.visible = false;
                if (this.isSingleSelect) {
                    this.$emit('do-save', this.tableModel.selectedDatas[0]);
                } else {
                    this.$emit('do-save', this.tableModel.selectedDatas);
                }
            },
            doFilterLeft: function (val) {
                this.treeModel.keyword = val;
            },
            doFilterRight: function () {
                var params = null;
                if (this.filterTreeType == "1") {
                    params = [{
                        type: 'save',
                        value: {
                            columnFilterName: 'compId',
                            columnFilterValue: this.treeModel.filterData.id
                        }
                    }, {
                        type: 'save',
                        value: {
                            columnFilterName: 'criteria.strValue',
                            columnFilterValue: {keyWordValue: this.tableModel.keyword}
                        }
                    }];
                } else {
                    params = [{
                        type: 'save',
                        value: {
                            columnFilterName: 'orgId',
                            columnFilterValue: this.treeModel.filterData.id
                        }
                    }, {
                        type: 'save',
                        value: {
                            columnFilterName: 'criteria.strValue',
                            columnFilterValue: {keyWordValue: this.tableModel.keyword}
                        }
                    }];
                }
                params = params.concat(this.param);
                this.$refs.table.doCleanRefresh(params);
            },

            init: function () {

                var isNeedRefreshData = false;
                if (this.orgListVersion != window.allClassificationOrgListVersion) {
                    this.orgListVersion = window.allClassificationOrgListVersion;
                    isNeedRefreshData = true;
                } else if (_.isEmpty(this.treeModel.data)) {
                    isNeedRefreshData = true;
                }
                if (isNeedRefreshData) {
                    //触发treeModel.data数据变化的事件， 必需先设置为空数据组
                    this.treeModel.data = [];
                    // 增加树加载提示
                    if (LIB.setting.orgList.length > 300) {
                        this.treeModel.showLoading = true;
                        var _this = this;
                        //延迟防止卡顿
                        var intervalId = setTimeout(function () {
                            _this.treeModel.data = LIB.setting.orgList;
                            clearTimeout(intervalId);
                            _this.treeModel.showLoading = false;
                        }, 300);
                    } else {
                        this.treeModel.data = LIB.setting.orgList;
                    }
                } else {
                    // 还原树组件状态
                    this.$nextTick(function () {
                        this.$els.mtree.scrollTop = 0;
                    });
                    this.treeModel.selectedData = [];
                }
            }
        },
        created: function () {
            this.orgListVersion = 1;
        }
    };
    var component = LIB.Vue.extend(opts);
    LIB.Vue.component('position-tree-select-modal', component);
});
