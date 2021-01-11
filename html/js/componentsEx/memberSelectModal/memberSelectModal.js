define(function(require) {
    var LIB = require('lib');
    var template = require("text!./memberSelectModal.html");

    var initDataModel = function() {
        return {
            mainModel: {
                model: {
                    type: [Array, Object],
                    default: ''
                },
                title: '选择人员'
            },
            treeModel: {
                data: [],
                selectedData: [],
                keyword: '',
                filterData: { id: '' },
                showLoading: false,
            },
            tableModel: {
                url: "user/posHseList{/curPage}{/pageSize}?disable=0",
                selectedDatas: [],
                keyword: '',
                columns: [{
                        title: "",
                        fieldName: "id",
                        fieldType: "cb"
                    }, {
                        title: "编码",
                        fieldName: "code"
                    }, {
                        title: "员工姓名",
                        fieldName: "username"
                    },
                    _.omit(LIB.tableMgr.column.company, "filterType"),
                    _.omit(LIB.tableMgr.column.dept, "filterType"),
                    {
                        title: "岗位",
                        fieldType: "custom",
                        render: function(data) {
                            if (data.positionList) {
                                var posNames = "";
                                data.positionList.forEach(function(e) {
                                    if (e.postType == 0 && e.name) {
                                        posNames += (e.name + "/");
                                    }
                                });
                                posNames = posNames.substr(0, posNames.length - 1);
                                return posNames;

                            }
                        }
                    },
                    {
                        title:"安全角色",
                        fieldType:"custom",
                        render: function(data){
                            if(data.positionList){
                                var roleNames = "";
                                data.positionList.forEach(function (e) {
                                    if(e.postType == 1 && e.name){
                                        roleNames += (e.name + ",");
                                    }
                                });
                                roleNames = roleNames.substr(0, roleNames.length - 1);
                                return roleNames;

                            }
                        },
                        width : 120
                    }
                ],
                defaultFilterValue: { "criteria.orderValue": { fieldName: "modifyDate", orderType: "1" } }
            },
            isCacheSelectedData: true
        }
    };

    // var buildGroupData = function (itemsObj,rootNodes) {
    //     function spread(nodes) {
    //         nodes.forEach(function (node) {
    //             if(itemsObj[node.id] !== undefined){
    //                 node.children = itemsObj[node.id];
    //                 spread(itemsObj[node.id])
    //             }
    //         })
    //     }
    //     spread(rootNodes);
    //     return rootNodes;
    // }
    var opts = {
        template: template,
        name: "memberSelectModal",
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
            doTreeNodeClick: function(obj) {
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
                            columnFilterValue: { keyWordValue: this.tableModel.keyword }
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
                            columnFilterValue: { keyWordValue: this.tableModel.keyword }
                        }
                    }];
                }

                this.$refs.table.doCleanRefresh(params);
            },
            onDbClickCell: function(data) {
                if(this.isSingleSelect) {
                    this.$emit('do-save', [data.entry.data]);
                    this.visible = false;
                }
            },
            doSave: function() {
                if (this.tableModel.selectedDatas.length === 0) {
                    LIB.Msg.warning("请选择数据");
                    return;
                }
                this.visible = false;
                if(this.isSingleSelect) {
                    this.$emit('do-save', this.tableModel.selectedDatas);
                }else {
                    this.$emit('do-save', this.tableModel.selectedDatas);
                }
            },
            doFilterLeft: function(val) {
                this.treeModel.keyword = val;
            },
            doFilterRight: function() {
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
                            columnFilterValue: { keyWordValue: this.tableModel.keyword }
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
                            columnFilterValue: { keyWordValue: this.tableModel.keyword }
                        }
                    }];
                }
                this.$refs.table.doCleanRefresh(params);
            },
            init: function() {

                var isNeedRefreshData = false;
                if (this.orgListVersion != window.allClassificationOrgListVersion) {
                    this.orgListVersion = window.allClassificationOrgListVersion;
                    isNeedRefreshData = true;
                } else if (_.isEmpty(this.treeModel.data)) {
                    isNeedRefreshData = true;
                }
                if (isNeedRefreshData) {
                    var orgList = _.filter(LIB.setting.orgList, function (item) {
                        return item.disable !== '1'
                    });
                    //触发treeModel.data数据变化的事件， 必需先设置为空数据组
                    this.treeModel.data = [];
                    // 增加树加载提示
                    if (orgList > 300) {
                        this.treeModel.showLoading = true;
                        var _this = this;
                        //延迟防止卡顿
                        var intervalId = setTimeout(function() {
                            _this.treeModel.data = _.sortBy(orgList, "type");
                            clearTimeout(intervalId);
                            _this.treeModel.showLoading = false;
                        }, 300);
                    } else {
                        this.treeModel.data = _.sortBy(orgList, "type");
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
                    // this.queryCompanyData();
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
            if(this.isSingleSelect) {
                this.isCacheSelectedData = false;
            } else {
                this.isCacheSelectedData = true;
            }
        }
    };
    var component = LIB.Vue.extend(opts);
    LIB.Vue.component('member-select-modal', component);

    return component;
})
