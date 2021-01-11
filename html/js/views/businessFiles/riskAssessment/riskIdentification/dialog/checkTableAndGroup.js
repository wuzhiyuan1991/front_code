define(function (require) {

    var LIB = require('lib');
    var template = require("text!./checkTableAndGroup.html");
    var api = require("../vuex/api");

    var newVO = {
        compId: '',
        orgId: '',
    };

    var defaultModel = {
        mainModel: {
            title: '选择分组',
            vo: newVO,
        },
        checkTableKey: '',
        groupKey: '',
        checkTableId: null,
        checkTableModel: ({
            url: "checktable/list{/curPage}{/pageSize}",
            columns: [{
                    title: "",
                    fieldName: "id",
                    fieldType: "radio"
                },
                {
                    title: "工作表名称",
                    fieldName: "name",
                    width: 200,
                },
                _.omit(LIB.tableMgr.column.company, "filterType"),
                {
                    title: "分类",
                    fieldType: "custom",
                    render: function (data) {
                        if (data.checkTableType) {
                            return data.checkTableType.name;
                        }
                    },
                    width: 180
                },
                {
                    title: "类型",
                    fieldType: "custom",
                    render: function (data) {
                        return LIB.getDataDic("checkTable_type", data.type);
                    },
                    filterName: "criteria.intsValue.type",
                    width: 140
                },
            ],
            selectedDatas: [],
            defaultFilterValue: {
                "criteria.orderValue": {
                    fieldName: "modifyDate",
                    orderType: "1"
                }
            },
            resetTriggerFlag: false
        }),
        groupModel: {
            columns: [{
                    title: "",
                    fieldName: "groupId",
                    fieldType: "cb",
                },
                {
                    title: "分组名称",
                    fieldName: "groupName"
                },
                // {
                //     title: "巡检区域",
                //     fieldName: "dominationArea.name"
                // }
            ],
            selectedDatas: [],
            groupList: []
        },
    };

    var opts = {
        template: template,
        components: {

        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            compId: {
                type: String,
                default: ''
            },
            orgId: {
                type: String,
                default: ''
            },
            filterData: {
                type: Object,
                default: {
                    bizType: null
                }
            },
        },
        data: function () {
            return defaultModel;
        },
        watch: {
            visible: function (nVal) {
                if (nVal) {
                    this.init();
                } else {
                    this.reset();
                }
            },
            "checkTableModel.selectedDatas": function (val) {
                var _this = this;
                if (val && val.length > 0) {
                    if (this.checkTableId && this.checkTableId === val[0].id) {
                        return;
                    }
                    this.checkTableId = val[0].id;
                    _this.groupModel.groupList = [];
                    api.getCheckTable({
                        id: val[0].id
                    }).then(function (res) {
                        if (_this.filterData.bizType === 'job' && res.data.tirList.length == 0) {
                            _this.groupModel.groupList = [{
                                groupName: "分组一"
                            }];
                            return;
                        }
                        _this.groupModel.groupList = res.data.tirList;
                    })
                }
            }

        },
        methods: {
            doQueryCheckTable: function () {
                var _this = this;
                var queryArr = [],
                    vo = this.mainModel.vo;
                var conditions = {
                    compId: {
                        type: "save",
                        value: {
                            columnFilterName: "compId",
                            columnFilterValue: vo.compId
                        }
                    },
                    bizType: {
                        type: "save",
                        value: {
                            columnFilterName: "bizType",
                            columnFilterValue: _this.filterData.bizType
                        }
                    },
                    kw: {
                        type: "save",
                        value: {
                            columnFilterName: "criteria.strValue",
                            columnFilterValue: {
                                'keyWordValue_join_': 'or',
                                'keyWordValue_name': this.checkTableKey,
                                'keyWordValue': this.checkTableKey
                            }
                        }
                    }
                };
                if (this.checkTableKey) {
                    queryArr.push(conditions.kw);
                }
                if (_this.filterData.bizType) {
                    queryArr.push(conditions.bizType);
                }
                this.$refs.checkTable.doCleanRefresh(queryArr);
            },

            doSave: function () {
                if (this.groupModel.selectedDatas.length === 0) {
                    return LIB.Msg.warning("请选择分组");
                }
                var checkTable = this.checkTableModel.selectedDatas[0];
                var group = this.groupModel.selectedDatas[0];
                checkTable.group = {
                    id: group.groupId,
                    name: group.groupName,
                    dominationAreaId: group.dominationArea ? group.dominationArea.id : null
                };
                this.$emit("do-save", {
                    id: group.groupId,
                    checkTable: checkTable,
                });
            },

            doClose: function () {
                this.visible = false;
            },
            reset: function () {
                this.checkTableKey = "";
                this.groupKey = "";
                this.checkTableId = null;
                this.$refs.checkTable.doClearData();
                this.$refs.groupTable.doClearData();
            },
            init: function () {
                this.mainModel.vo = newVO;
                this.mainModel.vo.compId = this.compId;
                this.mainModel.vo.orgId = this.orgId;
                if (this.filterData.bizType === 'inspect') {
                    this.checkTableModel.columns[1].title = '检查表名称';
                    if (!this.groupModel.columns[2]) {
                        this.groupModel.columns.push({
                            title: "巡检区域",
                            fieldName: "dominationArea.name"
                        });
                    }

                } else if (this.filterData.bizType === 'job') {
                    this.checkTableModel.columns[1].title = '工作表名称';
                    this.groupModel.columns.splice(2, 1);
                }
                this.$refs.checkTable.refreshColumns();
                this.doQueryCheckTable();
            },
            onRightDataLoaded: function (values) {
                if (values.length) {
                    this.$nextTick(function () {
                        this.groupModel.selectedDatas.push(values[0])
                        this.$refs.groupTable.ds = [{
                            data: this.groupModel.selectedDatas[0],
                            rowCheck: true
                        }]
                        // console.log(this.groupModel.selectedDatas)
                    })

                } else {
                    this.groupModel.selectedDatas = []
                }
            }
        },
    };

    var component = LIB.Vue.extend(opts);
    return component;
});