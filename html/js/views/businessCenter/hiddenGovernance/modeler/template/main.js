define(function(require) {
    var LIB = require('lib');
    var template = require("text!./main.html");

    var initDataModel = function() {
        return {
            mainModel: {
                title: '选择模版'
            },
            tableModel: {
                selectedDatas: [],
                keyword: '',
                defaultFilterValue: { "criteria.orderValue": { fieldName: "modifyDate", orderType: "1" } }
            },
            standardModel: {
                url: '/activitimodeler/template/list/{curPage}/{pageSize}',
                columns: [
                    {
                        title: '',
                        fieldName: "id",
                        fieldType: "radio"
                    },
                    {
                        title: '编码',
                        fieldName: 'code'
                    },
                    {
                        title: '名称',
                        fieldName: 'name'
                    },
                    {
                        title: '类型',
                        fieldName: 'type',
                        render: function (data) {
                            return LIB.getDataDic("workflow_type", data.type);
                        }
                    },
                    {
                        title: '描述',
                        fieldName: 'description'
                    }
                ]
            },
            customModel: {
                url: '/activitimodeler/list/{curPage}/{pageSize}',
                columns: [
                    {
                        title: '',
                        fieldName: "id",
                        fieldType: "radio"
                    },
                    {
                        title: '编码',
                        fieldName: 'code',
                        width: 120
                    },
                    {
                        title: '名称',
                        fieldName: 'name',
                        width: 120
                    },
                    _.omit(LIB.tableMgr.column.company, "filterType"),
                    {
                        title: '状态',
                        fieldName: 'status',
                        render: function (data) {
                            return LIB.getDataDic("modeler_type", data.status);
                        },
                        width: 100
                    },
                    {
                        title: '类型',
                        fieldName: 'type',
                        render: function (data) {
                            return LIB.getDataDic("workflow_type", data.type);
                        },
                        width: 100
                    },
                    {
                        title: '描述',
                        fieldName: 'description',
                        width: 180
                    },
                    {
                        title: '更新时间',
                        fieldName: 'modifyDate',
                        width: 180
                    },
                    {
                        title: '创建时间',
                        fieldName: 'createDate',
                        width: 180
                    }

                ]
            },
            templateType: 'standard'
        }
    };

    var opts = {
        template: template,
        props: {
            visible: {
                type: Boolean,
                default: false
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
                
                return params;
            },
            changeType: function (t) {
                this.templateType = t;
                this.tableModel.keyword = "";
                this.tableModel.selectedDatas = [];
                if(t === 'standard') {
                    this.$refs.standardTable.doCleanRefresh([]);
                } else {
                    this.$refs.customTable.doCleanRefresh([]);
                }
            },
            onDbClickCell: function(data) {
                this.$emit('do-save', data.entry.data);
                this.visible = false;
            },
            doSave: function() {
                if (this.tableModel.selectedDatas.length === 0) {
                    LIB.Msg.warning("请选择数据");
                    return;
                }
                this.visible = false;
                this.$emit('do-save', this.tableModel.selectedDatas[0]);
            },
            // 过滤表格
            doFilterTable: function() {
                if(this.templateType === 'standard') {
                    this.$refs.standardTable.doCleanRefresh(this.buildFilterParams());
                } else {
                    this.$refs.customTable.doCleanRefresh(this.buildFilterParams());
                }
            },
            init: function() {
                this.templateType = 'standard';
                this.tableModel.keyword = "";
                this.tableModel.selectedDatas = [];
                this.$refs.standardTable.doCleanRefresh([]);
            }
        },
        watch: {
            visible: function(val) {
                if (val) {
                    this.init();
                } else {
                    this.tableModel.keyword = "";
                }
            }
        }
    };
    var component = LIB.Vue.extend(opts);
    return component;
});
