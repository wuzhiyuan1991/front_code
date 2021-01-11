define(function (require) {
    var LIB = require('lib');
    var api = require("./api");
    var template = require("text!./checkBasisSelectModal.html");


    var columns = [
        {
            title: "cb",
            fieldName: "id",
            fieldType: "cb",
            fixed: true
        },
        // LIB.tableMgr.ksColumn.code,
        // {
        //     title: "所属规范",
        //     fieldName: "topType.name",
        // },
        // {
        //     title: "名称",
        //     // fieldName: "secType.name",
        //     fieldType: "custom",
        //     render: function (data) {
        //         if(data.secType && data.secType.name){
        //             return data.secType.name
        //         }else if(data.topType && data.topType.name){
        //             return data.topType.name
        //         }
        //     },
        // },
        {
            //章节名称
            title: "依据内容",
            fieldName: "name",
            keywordFilterName: "criteria.strValue.keyWordValue_name"
        },
        {
            title: "分类",
            //fieldName: "legalRegulationType.name",
            fieldName: "attr4",
            filterType: "text",
        },
        // {
        //     //内容
        //     title: "内容",
        //     fieldName: "content",
        //     keywordFilterName: "criteria.strValue.keyWordValue_content"
        // }
    ];

    var initDataModel = function () {
        return {
            mainModel: {
                model: {
                    type: [Array, Object],
                    default: ''
                },
                title: '选择检查依据'
            },
            treeModel: {
                data: [],
                selectedData: [],
                keyword: '',
                filterData: {id: ''},
                showLoading: false
            },
            tableModel: {
                url: "legalregulation/list{/curPage}{/pageSize}?disable=0",
                selectedDatas: [],
                keyword: '',
                columns: [],
                defaultFilterValue: {"criteria.orderValue": {fieldName: "modifyDate", orderType: "1"}}
            }
        };
    };

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
            },
            filterData: {
                type: Object
            }
        },
        data: initDataModel,
        methods: {
            doTreeNodeClick: function (obj) {
                // if (obj.data.id === this.treeModel.filterData.id) return;
                if (obj.checked) {
                    this.treeModel.filterData.id = obj.data.id;
                } else {
                    this.treeModel.filterData.id = '';
                }
                this._queryTableData();
            },
            onDbClickCell: function (data) {
                if (this.isSingleSelect) {
                    this.$emit('do-save', [data.entry.data]);
                    this.visible = false;
                }
            },

            doFilterLeft: function (val) {
                this.treeModel.keyword = val;
            },
            doFilterRight: function () {
                this._queryTableData();
            },

            doSave: function () {
                if (this.tableModel.selectedDatas.length === 0) {
                    LIB.Msg.warning("请选择数据");
                    return;
                }
                this.visible = false;
                this.$emit('do-save', this.tableModel.selectedDatas);
            },

            init: function () {
                this._setTableColumns();
                this._getTreeData();
                this.treeModel.selectedData = [];
                this.$nextTick(function () {
                    this.$els.mtree.scrollTop = 0;
                });
                this._queryTableData();

                // 增加树加载提示
                // if (LIB.setting.orgList.length > 300) {
                //     this.treeModel.showLoading = true;
                //     var _this = this;
                //     //延迟防止卡顿
                //     var intervalId = setTimeout(function () {
                //         _this.treeModel.data = LIB.setting.orgList;
                //         clearTimeout(intervalId);
                //         _this.treeModel.showLoading = false;
                //     }, 300);
                // }

            },
            _queryTableData: function () {
                var params = this._getFilterParameters();
                this.$refs.table.doCleanRefresh(params);
            },
            _getFilterParameters: function () {
                var params = [];
                if (this.filterData) {
                    for (var key in this.filterData) {
                        var value = this.filterData[key];
                        if (_.trim(value)) {
                            var tableFilterData = {
                                type: "save",
                                value: {
                                    columnFilterName: key,
                                    columnFilterValue: value
                                }
                            };
                            params.push(tableFilterData);
                        }
                    }
                }

                var filterValue = {};

                if (this.treeModel.filterData.id) {
                    filterValue.typeId =  this.treeModel.filterData.id;
                }
                if (_.trim(this.tableModel.keyword)) {
                    filterValue.keyWordValue_name = this.tableModel.keyword;
                    filterValue.keyWordValue_join_ = "or";
                }

                if (!_.isEmpty(filterValue)) {
                    params.push({
                        type: 'save',
                        value: {
                            columnFilterName: 'criteria.strValue',
                            columnFilterValue: filterValue
                        }
                    })
                }
                // if (this.treeModel.filterData.id) {
                //     params.push({
                //         type: 'save',
                //         value: {
                //             columnFilterName: 'criteria.strValue',
                //             columnFilterValue: {typeId: this.treeModel.filterData.id}
                //         }
                //     })
                // }
                // if (_.trim(this.tableModel.keyword)) {
                //     params.push({
                //         type: 'save',
                //         value: {
                //             columnFilterName: 'criteria.strValue',
                //             columnFilterValue:  {
                //                 keyWordValue_name: this.tableModel.keyword,
                //                 keyWordValue_join_: "or"
                //             }
                //         }
                //     })
                // }
                return params;
            },
            _setTableColumns: function () {
                if (!_.isEmpty(this.tableModel.columns)) {
                    return;
                }
                this.$nextTick(function () {
                    this.tableModel.columns = columns;
                });
            },
            _getTreeData: function () {
                var _this = this;
                if (!_.isEmpty(this.treeModel.data)) {
                    return;
                }
                api.queryLegalTypes().then(function (res) {
                    _this.treeModel.data = res.data.list;
                });
            }
        },
        watch: {
            visible: function (nVal) {
                if (nVal) {
                    this.init();
                } else {
                    this.treeModel.keyword = "";
                    this.tableModel.keyword = "";
                }
            }
        }
    };
    var component = LIB.Vue.extend(opts);
    return component;
})
