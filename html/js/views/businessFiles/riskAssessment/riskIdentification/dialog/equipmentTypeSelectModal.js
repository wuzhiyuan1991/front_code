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
            tableModelRight: ({
                url: 'equipment/list/{curPage}/{pageSize}',
                filterColumn: [],
                keyword: '',
                selectedDatas: [],
                isSingleSelect: false,
                pageSizeOpts: [100, 300, 500],
                currentPageIndex: 0,
                isSingleCheck: true,
                isCacheSelectedData: false,
                columns: [{
                        title: "",
                        fieldName: "id",
                        fieldType: "cb"
                    },
                    {
                        //设备编号
                        title: this.$t("bd.hal.equipmentCode"),
                        fieldName: "code",
                        filterType: "text",
                        width: 160
                    },
                    {
                        //名称
                        title: "设备名称",
                        fieldName: "name",
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    },
                    {
                        title: "属地",
                        fieldName: "dominationArea.name",
                        keywordFilterName: "criteria.strValue.keyWordValue_dominationArea_name"
                    },
                    {
                        title: "所属公司",
                        fieldType: "custom",
                        render: function (data) {
                            if (data.compId) {
                                return LIB.getDataDic("org", data.compId)["compName"];
                            }
                        },
                        keywordFilterName: "criteria.strValue.keyWordValue_comp"
                    },
                    {
                        title: "所属部门",
                        fieldType: "custom",
                        render: function (data) {
                            if (data.orgId) {
                                return LIB.getDataDic("org", data.orgId)["deptName"];
                            }
                        },
                        keywordFilterName: "criteria.strValue.keyWordValue_org"
                    }
                ],
                filterData: {

                },
                defaultFilterValue: {
                    "disable": "0",
                    "criteria.orderValue": {
                        fieldName: "modifyDate",
                        orderType: "1"
                    },
                    "state": 0,
                    "tabType": 2
                },
            }),
            isCacheSelectedData: true
        }
    };

    var opts = {
        template: template,
        name: "equipment-type-select-modal2",
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
                if (!this.isSingleSelect) {
                    return false
                }
                this.$emit('do-save', {
                    equipmentType: data.entry.data
                });
                this.visible = false;
            },
            doSave: function () {
                if (this.tableModel.selectedDatas.length === 0) {
                    LIB.Msg.warning("请选择数据");
                    return;
                }
                this.visible = false;
                this.$emit('do-save', {
                    equipmentType: this.tableModel.selectedDatas[0],
                    equipment: this.tableModelRight.selectedDatas
                });
                // this.$dispatch('sendRiskIdentificationEquipment')
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
            // 检索功能
            doFilterTableRight: function (filterValues) {
                if (!this.tableModel.selectedDatas.length) {
                    return LIB.Msg.warning("请选择设备类别");
                }
                // 判断查询框是否有值
                if (!this.tableModelRight.keyword || !this.tableModelRight.keyword.length) {
                    return this.tableModelRightReloadData(this.tableModel.selectedDatas)
                }
                var queryParams = [{
                    value: {
                        columnFilterName: "equipmentType.id",
                        columnFilterValue: this.tableModel.selectedDatas[0].id
                    },
                    type: "save"
                }, {
                    value: {
                        columnFilterName: "name",
                        columnFilterValue: this.tableModelRight.keyword
                    },
                    type: "save"
                }]
                this.$refs.table2.doCleanRefresh(queryParams)

            },
            init: function () {
                this.treeModel.data = [];
                var _this = this;
                api.getTypeList().then(function (res) {
                    _this.treeModel.data = _.filter(res.data, function (item) {
                        return !item.parentId;
                    })

                })
            },
            tableModelRightLoad: function (values) {
                if (!values || !values.length) {
                    return false
                }
                // if (values.length > this.tableModelRight.pageSizeOpts[this.tableModelRight.currentPageIndex]) {
                //     var newPageIndex = null
                //     this.tableModelRight.pageSizeOpts.every(function (pageSize, index) {
                //         if (pageSize > values.length) {
                //             newPageIndex
                //         }
                //         return pageSize > values.lengt
                //     })
                //     if (newPageIndex === null) {
                //         this.tableModelRight.pageSizeOpts = this.buildSuitCheckAllPageSizeOpt(values.length)
                //     }
                // }
                // console.log(this.$refs.table2)
                this.$refs.table2.checkAll = true
                this.tableModelRight.selectedDatas = values
            },
            // 重载数据
            tableModelRightReloadData: function (val) {
                this.$refs.table2.doCleanRefresh([{
                    value: {
                        columnFilterName: "equipmentType.id",
                        columnFilterValue: val[0].id
                    },
                    type: "save"
                }])
            },
            // buildSuitCheckAllPageSizeOpt: function (len) {
            //     var lenStr = len.toString()
            //     var strLen = lenStr.length
            //     var newPageSize = ''
            //     var pageSizes = []
            //     lenStr.forEach(function (item, index) {
            //         if (!index) newPageSize = lenStr[0]
            //         else newPageSize = newPageSize + '0'
            //     })
            //     pageSizes.push(parseInt(newPageSize), parseInt(newPageSize))
            // }
        },
        watch: {
            visible: function (val) {
                if (val) {
                    this.init();
                    this.$refs.table.doCleanRefresh([]);
                    this.$refs.table2.doClearData()
                    this.tableModelRight.selectedData = []
                    // this.$refs.table2.doCleanRefresh([]);
                } else {
                    this.treeModel.keyword = "";
                    this.tableModel.keyword = "";
                    this.tableModelRight.keyword = '';
                }
            },
            'tableModel.selectedDatas': function (val) {
                if (!val.length) {
                    // 当左侧表格没有选中之后
                    this.$refs.table2.checkAll = false
                    this.tableModelRight.selectedDatas = []
                    return this.$refs.table2.doClearData()
                }

                this.tableModelRightReloadData(val)
            }
            // {
            //     type: 'save',
            //     value: {
            //         columnFilterName: 'criteria.strValue',
            //         columnFilterValue: {
            //             keyWordValue: this.tableModel.keyword
            //         }
            //     }
        },
        created: function () {
            // console.log(this.tableModel.defaultFilterValue)
            if (this.isSingleSelect) {
                this.isCacheSelectedData = false;
            } else {
                this.isCacheSelectedData = true;
            }
        }
    };
    // var component = LIB.Vue.extend(opts);
    // LIB.Vue.component('equipment-type-select-modal', component);

    return opts;
})