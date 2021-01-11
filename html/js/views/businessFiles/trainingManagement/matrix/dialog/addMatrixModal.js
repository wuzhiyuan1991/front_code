define(function(require) {
    var LIB = require('lib');
    var api = require("../vuex/api");
    var template = require("text!./addMatrixModal.html");

    var initDataModel = function() {
        return {
            mainModel: {
                model: {
                    type: [Array, Object],
                    default: ''
                },
                title: '新增矩阵'
            },
            treeModel: {
                data: [],
                selectedDatas: [],
                keyword: '',
                filterData: { id: '' },
                showLoading: false,
            },
            tableModel: {
                url: "position/list{/curPage}{/pageSize}",
                selectedDatas: [],
                excludeIds: [], // 要过滤岗位安全角色ID
                keyword: '',
                columns: [{
                        title: "",
                        fieldName: "id",
                        fieldType: "cb"
                    }, {
                        title: "名称",
                        fieldName: "name"
                    },
                    _.omit(LIB.tableMgr.column.company, "filterType"),
                    _.omit(LIB.tableMgr.column.dept, "filterType"),
                    {
                        //title : "培训方式",
                        title: "类型",
                        fieldType: "custom",
                        render: function (data) {
                            return LIB.getDataDic("management_role", data.postType);
                        },
                        popFilterEnum: LIB.getDataDicList("management_role")
                    }
                ],
                //defaultFilterValue: { "criteria.orderValue": { fieldName: "modifyDate", orderType: "1" } }
            }
        }
    }

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
                default: false
            }
        },
        data: initDataModel,
        methods: {
            doTreeNodeClick: function(obj) {
                var params = null;
                var _this = this;
                api.list({courseId: obj.data.id}).then(function (resp) {
                    _this.tableModel.excludeIds = _.map(resp.body, function(data){return data.positionId});
                    _this.doFilterPositionAndRole();
                })
                // if (this.filterTreeType == "1") {
                //     params = [{
                //         type: 'save',
                //         value: {
                //             columnFilterName: 'criteria.strValue',
                //             columnFilterValue: {
                //                 keyWordValue: this.tableModel.keyword
                //             }
                //         }
                //     }];
                // } else {
                //     params = [{
                //         type: 'save',
                //         value: {
                //             columnFilterName: 'name',
                //             columnFilterValue: this.tableModel.keyword
                //         }
                //     }];
                // }
                // this.$refs.table.doCleanRefresh(params);

                // 保存课程
                // if (obj.checked) this.treeModel.selectedDatas = obj.data;
                // else this.treeModel.selectedDatas = {};
            },
            onDbClickCell: function(data) {
                if(this.isSingleSelect) {
                    this.$emit('do-save', data.entry.data);
                    this.visible = false;
                }
            },
            doSave: function() {
                if (this.treeModel.selectedDatas.length < 1) {
                    LIB.Msg.warning("请选择课程");
                    return;
                }
                if (this.tableModel.selectedDatas.length < 1) {
                    LIB.Msg.warning("请选择岗位/安全角色");
                    return;
                }
                this.visible = false;
                if(this.isSingleSelect) {
                    this.$emit('do-save', this.treeModel.selectedDatas[0], this.tableModel.selectedDatas[0]);
                }else {
                    this.$emit('do-save', this.treeModel.selectedDatas[0], this.tableModel.selectedDatas);
                }
            },
            doFilterLeft: function(val) {
                this.treeModel.keyword = val;

            },

            doFilterPositionAndRole: function() {
                var params = [{
                    type: 'save',
                    value: {
                        columnFilterName: 'criteria.strValue',
                        columnFilterValue: {
                            keyWordValue: this.tableModel.keyword,
                        }
                    }
                },{
                    type: 'save',
                    value: {
                        columnFilterName: 'criteria.strsValue',
                        columnFilterValue: {
                            excludeIds: this.tableModel.excludeIds
                        }
                    }
                }];
                this.$refs.table.doCleanRefresh(params);
            },

            init: function() {
                var _this = this;

                // 初始化课程树
                if (_this.treeModel.data.length) {
                    this.$nextTick(function() {
                        this.$els.mtree.scrollTop = 0;
                    });
                    this.treeModel.selectedDatas = [];
                } else {
                    this.treeModel.showLoading = true;
                    api.listcourse({disable:0}).then(function (resp) {
                        _this.treeModel.showLoading = false;
                        _this.treeModel.data = resp.body;
                    })
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
                    this.tableModel.excludeIds = [];
                }
            }
        },
        created: function() {
            this.orgListVersion = 1;
        },
    };
    var component = LIB.Vue.extend(opts);
    LIB.Vue.component('add-matrix-modal', component);
})
