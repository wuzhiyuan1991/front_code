define(function (require) {

    var LIB = require('lib');
    var dominationAreaSelectModal = require("componentsEx/selectTableModal/dominationAreaSelectModal");

    var template = require("text!./task.html");
    var api = require("../vuex/api");

    var types = [
        {
            id: '1',
            name: '属&nbsp;&nbsp;&nbsp;&nbsp;地'
        },
        {
            id: '2',
            name: '设备设施'
        },
        {
            id: '1002',
            name: '重点化学品'
        },
        {
            id: '1003',
            name: '重点化学工艺'
        },
        {
            id: '1001',
            name: '重大危险源'
        }
    ];

    var checkObjTypes = [
        {
            id: '0',
            name: '全部'
        },
        {
            id: '1',
            name: '作业活动'
        },
        {
            id: '2',
            name: '设备设施'
        },
        {
            id: '3',
            name: '物品材料'
        },
        {
            id: '4',
            name: '遵法合规'
        },
        {
            id: '5',
            name: '作业环境'
        },
        {
            id: '6',
            name: '通用'
        }
    ];

    var columns1 = [
        {
            title: "",
            fieldName: "id",
            fieldType: "radio"
        },
        {
            //名称
            title: "属地名称",
            fieldName: "name",
            keywordFilterName: "criteria.strValue.keyWordValue_name"
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
    ];

    var columns2 = [
        {
            title: "",
            fieldName: "id",
            fieldType: "radio"
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
    ];

    var columns3 = [
        {
            title: "",
            fieldName: "id",
            fieldType: "radio"
        },
        {
            //名称
            title: "化学品名称",
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
    ];

    var columns4 = [
        {
            title: "",
            fieldName: "id",
            fieldType: "radio"
        },
        {
            //名称
            title: "重大危险源",
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
    ];

    var columns5 = [
        {
            title: "",
            fieldName: "id",
            fieldType: "radio"
        },
        {
            //名称
            title: "重大化学工艺名称",
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
    ];

    var checkTableColumns = [
        {
            title: "",
            fieldName: "id",
            fieldType: "radio"
        },
        {
            title: "检查表",
            fieldName: "name"
            // fieldType: "link",
            // pathCode: LIB.ModuleCode.BD_HaI_CheL,
        }
    ];

    var urls = {
        '1': 'dominationarea/list{/curPage}{/pageSize}',
        '2': 'equipment/list{/curPage}{/pageSize}',
        '3': 'checkobject/list/{curPage}/{pageSize}',
        '4': 'majorrisksource/list{/curPage}{/pageSize}',
        '5': 'majorchemicalprocess/list{/curPage}{/pageSize}'
    };

    var newVO = {
        compId: '',
        orgId: '',
        dominationArea: {
            id: '',
            name: ''
        }
    };

    var defaultModel = {
        mainModel: {
            title: '选择检查表',
            vo: newVO,
            selectedDatas: []
        },
        // types: types,
        dominationAreaSelectModel: {
            visible: false,
            filterData: {}
        },
        columns: [],
        url: '',
        checkedType: '1',
        treeData: [],
        treeModel: {
            selectedData: []
        },
        leftKey: '',
        rightKey: '',
        checkKey: '',
        checkTableModel: {
            url: 'checktable/checkobject/list/{curPage}/{pageSize}',
            columns: checkTableColumns,
            filterColumn: ["criteria.strValue.name"],
            selectedDatas: [],
            defaultFilterValue: ''
        },
        tableModel: {
            filterColumn: null,
            defaultFilterValue: null
        },
        checkObjType: '0',
        enableMajorRiskSource: true
    };

    var opts = {
        template: template,
        components: {
            "dominationareaSelectModal": dominationAreaSelectModal
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
            tableType: {
                type: String,
                default: ''
            },
            isCompDisable: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            types: function () {
                if(this.enableMajorRiskSource) {
                    return types;
                } else {
                    return _.filter(types, function (item) {
                        return item.id === '1' || item.id === '2';
                    })
                }
            },
            // 显示选择属地的表格
            showArea: function () {
                return '1' === this.checkedType;
            },
            // 显示选择设备的表格
            showEquipment: function () {
                return '2' === this.checkedType;
            },
            // 显示选择化学品的表格
            showChemical: function () {
                return '1002' === this.checkedType;
            },
            // 显示选择重大危险源的表格
            showRiskSource: function () {
                return '1001' === this.checkedType;
            },
            // 显示选择化学品工艺的表格
            showProcess: function () {
                return '1003' === this.checkedType;
            },
            checkObjTypes: function () {
                if(this.showEquipment) {
                    return _.filter(checkObjTypes, function (item) {
                        return _.includes(['0', '2', '6'], item.id);
                    });
                }
                if(this.showArea) {
                    return _.filter(checkObjTypes, function (item) {
                        return '2' !== item.id;
                    });
                }

                return checkObjTypes;
            }
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
            "mainModel.vo.orgId": function () {
                this._getFirstArea();
            },
            "mainModel.vo.compId": function (nv, ov) {
                this.getTypes();
                this.doQuery();
                this.$refs.checkTable.doClearData();
            }
        },
        methods: {
            doShowDominationAreaSelectModal: function () {
                this.dominationAreaSelectModel.filterData.orgId = this.mainModel.vo.orgId;
                this.dominationAreaSelectModel.filterData.compId = this.mainModel.vo.compId;
                this.dominationAreaSelectModel.visible = true;
            },
            doSaveDominationArea: function (items) {
                var item = items[0];
                this.mainModel.vo.dominationArea.id = item.id;
                this.mainModel.vo.dominationArea.name = item.name;
                this.getTypes();
                this.doQuery();
            },
            doChangeType: function (t) {
                if (this.checkedType === t) {
                    return;
                }
                this.checkedType = t;
                this.rightKey = "";
                this.leftKey = "";
                this.checkKey = "";
                this.leftId = "";
                this.checkObjType = '0';
                this.treeModel.selectedData = [];
                this.getTypes();
                this._setTableSetting();
                this.mainModel.selectedDatas = [];
                this.$nextTick(function () {
                    this.doQuery();
                })
                this.$refs.checkTable.doClearData();
            },
            getTypes: function () {
                var params = {},
                    _this = this,
                    vo = this.mainModel.vo;

                this.treeData = [];
                this.treeModel.selectedData = [];

                params["criteria.strValue"] = {};

                if(vo.compId) {
                    params["criteria.strValue"].compId = vo.compId;
                }
                if(vo.orgId) {
                    params["criteria.strValue"].orgId = vo.orgId;
                }
                if(vo.dominationArea.id) {
                    params["criteria.strValue"].dominationAreaId = vo.dominationArea.id;
                }

                if (this.showEquipment) {
                    api.getEquipmentType(params).then(function (res) {
                        _this.treeData = res.data;
                    })
                }
                else if (this.showChemical) {
                    api.getChemicalType(params).then(function (res) {
                        _this.treeData = res.data;
                    })
                }
                else if (this.showProcess) {
                    api.getProcessType(params).then(function (res) {
                        _this.treeData = res.data;
                    })
                }
            },
            _setTableSetting: function () {
                this.tableModel.filterColumn = null;
                if (this.showArea) {
                    this.tableModel.filterColumn = ["criteria.strValue.name"];
                    this.url = urls['1'];
                    this.columns = columns1;
                }
                else if (this.showEquipment) {
                    this.url = urls['2'];
                    this.columns = columns2;
                }
                else if (this.showChemical) {
                    this.url = urls['3'];
                    this.columns = columns3;
                }

                else if (this.showRiskSource) {
                    this.url = urls['4'];
                    this.columns = columns4;
                }

                else if (this.showProcess) {
                    this.url = urls['5'];
                    this.columns = columns5;
                }
            },
            doQuery: function () {
                this.$refs.checkTable.doClearData();

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
                    orgId: {
                        type: "save",
                        value: {
                            columnFilterName: "orgId",
                            columnFilterValue: vo.orgId
                        }
                    },
                    dominationArea: {
                        type: "save",
                        value: {
                            columnFilterName: "dominationArea.id",
                            columnFilterValue: vo.dominationArea.id
                        }
                    },
                    equipmentType: {
                        type: "save",
                        value: {
                            columnFilterName: "equipmentType.id",
                            columnFilterValue: this.leftId
                        }
                    },
                    chemical: {
                        type: "save",
                        value: {
                            columnFilterName: "criteria.intsValue",
                            columnFilterValue: {"dataType": [2]}
                        }
                    },
                    catalog: {
                        type: "save",
                        value: {
                            columnFilterName: "criteria.strValue",
                            columnFilterValue: {catalogId: this.leftId}
                        }
                    },
                    type: {
                        type: "save",
                        value: {
                            columnFilterName: "type",
                            columnFilterValue: this.tableType
                        }
                    },
                    id: {
                        type: "save",
                        value: {
                            columnFilterName: "id",
                            columnFilterValue: vo.dominationArea.id
                        }
                    },
                    tabType: {
                        type: "save",
                        value: {
                            columnFilterName: "tabType",
                            columnFilterValue: this.checkedType
                        }
                    },
                    disable: {
                        type: "save",
                        value: {
                            columnFilterName: "disable",
                            columnFilterValue: '0'
                        }
                    },
                    state: {
                        type: "save",
                        value: {
                            columnFilterName: "state",
                            columnFilterValue: '0'
                        }
                    },
                    kw: {
                        type: "save",
                        value: {
                            columnFilterName: "criteria.strValue",
                            columnFilterValue: {
                                'keyWordValue_join_': 'or',
                                'keyWordValue_code': this.rightKey,
                                'keyWordValue_comp': this.rightKey,
                                'keyWordValue_org': this.rightKey,
                                'keyWordValue_name': this.rightKey,
                                'keyWordValue_dominationArea': this.rightKey,
                                'keyWordValue': this.rightKey
                            }
                        }
                    },
                    kw2: {
                        type: "save",
                        value: {
                            columnFilterName: "criteria.strValue",
                            columnFilterValue: {
                                'keyWordValue_join_': 'or',
                                'keyWordValue_code': this.rightKey,
                                'keyWordValue_comp': this.rightKey,
                                'keyWordValue_org': this.rightKey,
                                'keyWordValue_name': this.rightKey,
                                'keyWordValue_dominationArea': this.rightKey,
                                'keyWordValue': this.rightKey,
                                catalogId: this.leftId
                            }
                        }
                    }
                };

                queryArr.push(conditions.disable);
                queryArr.push(conditions.state);
                queryArr.push(conditions.tabType);
                if (vo.compId) {
                    queryArr.push(conditions.compId);
                }
                if (vo.orgId) {
                    queryArr.push(conditions.orgId);
                }


                if (this.showArea) {
                    if (this.rightKey) {
                        queryArr.push(conditions.kw);
                    }
                    if (vo.dominationArea.id) {
                        queryArr.push(conditions.id);
                    }
                    // queryArr.push(conditions.checkObjType);
                    this.$refs.table1.doCleanRefresh(queryArr);
                    return;
                }

                if (vo.dominationArea.id) {
                    queryArr.push(conditions.dominationArea);
                }

                if (this.showEquipment) {
                    if (this.rightKey) {
                        queryArr.push(conditions.kw);
                    }
                    if (this.leftId) {
                        queryArr.push(conditions.equipmentType);
                    }

                    this.$refs.table2.doCleanRefresh(queryArr);
                }

                else if (this.showChemical) {
                    if(!this.leftId) {
                        return;
                    }

                    queryArr.push(conditions.chemical);

                    if (this.leftId && this.rightKey) {
                        queryArr.push(conditions.kw2);
                        // queryArr.push(conditions.catalog)
                    } else if(this.leftId) {
                        queryArr.push(conditions.catalog)
                    } else if(this.rightKey) {
                        queryArr.push(conditions.kw);
                    }
                    this.$refs.table3.doCleanRefresh(queryArr);
                }

                else if (this.showRiskSource) {
                    if (this.rightKey) {
                        queryArr.push(conditions.kw);
                    }
                    this.$refs.table4.doCleanRefresh(queryArr);
                }

                else if (this.showProcess) {
                    if(!this.leftId) {
                        return;
                    }
                    if (this.leftId && this.rightKey) {
                        queryArr.push(conditions.kw2);
                        // queryArr.push(conditions.catalog)
                    } else if(this.leftId) {
                        queryArr.push(conditions.catalog)
                    } else if(this.rightKey) {
                        queryArr.push(conditions.kw);
                    }
                    this.$refs.table5.doCleanRefresh(queryArr);
                }

            },
            doQueryCheckTable: function () {

                var params = [
                    {
                        type: "save",
                        value: {
                            columnFilterName: "type",
                            columnFilterValue: this.tableType
                        }
                    },
                    {
                        type: "save",
                        value: {
                            columnFilterName: "checkObjectId",
                            columnFilterValue: this.checkObjId
                        }
                    },
                    {
                        type: "save",
                        value: {
                            columnFilterName: "tabType",
                            columnFilterValue: this.checkedType
                        }
                    },
                    {
                        type: "save",
                        value: {
                            columnFilterName: "compId",
                            columnFilterValue: this.mainModel.vo.compId
                        }
                    }
                ];


                if(this.checkObjType !== '0') {
                    params.push({
                        type: "save",
                        value: {
                            columnFilterName: "checkObjType",
                            columnFilterValue: this.checkObjType
                        }
                    })
                }
                if(this.showEquipment && this.leftId){
                    params.push({
                        type: "save",
                        value: {
                            columnFilterName: "equipmentTypeId",
                            columnFilterValue: this.leftId
                        }
                    })
                }
                if(this.checkKey) {
                    params.push({
                        type: "save",
                        value: {
                            columnFilterName: "criteria.strValue",
                            columnFilterValue: {"keyWordValue": this.checkKey}
                        }
                    })
                }
                this.$refs.checkTable.doCleanRefresh(params);
            },
            onClickRow: function (obj) {
                if(this.showChemical || this.showProcess) {
                    this.checkObjId = obj.entry.data.catalog.id
                }
                else if(this.showEquipment) {
                    this.checkObjId = obj.entry.data.typeId;
                }
                else {
                    this.checkObjId = obj.entry.data.id;
                }
                this.doQueryCheckTable();
            },
            doTreeNodeClick: function (data) {
                var d = data.data;
                if (this.leftId === d.id) {
                    this.leftId = '';
                    if(this.showChemical){
                        this.$refs.table3.doClearData();
                    } else if(this.showProcess) {
                        this.$refs.table5.doClearData();
                    } else  if (this.showEquipment) {
                        this.doQuery();
                    }
                    return;
                }
                this.leftId = d.id;

                this.$refs.checkTable.doClearData();

                this.doQuery();
            },
            onTableLoaded: function (items) {
                if (items.length === 0) {
                    return;
                }
                var item = items[0];
                this.mainModel.selectedDatas = item;
            },
            _getCheckObjectType: function () {
                return this.checkedType;
                /*
                if (this.showRiskSource) {
                    return '5'
                }
                if (this.showEquipment) {
                    return '4'
                }
                if (this.showChemical) {
                    return '7'
                }
                if (this.showProcess) {
                    return '6'
                }
                if (this.checkedType === '1') {
                    return '1'
                }
                if (this.checkedType === '3') {
                    return '2'
                }
                if (this.checkedType === '4') {
                    return '12'
                }
                */
            },
            doSave: function () {

                if (this.mainModel.selectedDatas.length === 0) {
                    return LIB.Msg.warning("请选择检查对象");
                }
                if (this.checkTableModel.selectedDatas.length === 0) {
                    return LIB.Msg.warning("请选择检查表");
                }

                this.$emit("do-save", {
                    checkObj: this.mainModel.selectedDatas[0],
                    checkTable: this.checkTableModel.selectedDatas[0],
                    checkObjType: this._getCheckObjectType()
                })
            },
            onDbClickCell: function () {
                this.doSave();
            },
            // 跳转到检查表详情
            doCheckTableRowClick: function () {

            },
            displayFunc: function (data) {
                return data.name + "(" + data.dataCount + ")";
            },
            _getFirstArea: function () {
                var _this = this;
                if(!this.mainModel.vo.orgId) {
                    this.mainModel.vo.dominationArea = {
                        id: "",
                        name: ""
                    };
                    this.$nextTick(function () {
                        this.doQuery();
                        this.getTypes();
                    });
                    return;
                }
                api.getDominationAreaList({orgId: this.mainModel.vo.orgId}).then(function (res) {
                    if(res.data.list && res.data.list.length > 0) {
                        var item = res.data.list[0];
                        _this.mainModel.vo.dominationArea = {
                            id: item.id,
                            name: item.name
                        }
                    } else {
                        _this.mainModel.vo.dominationArea = {
                            id: "",
                            name: ""
                        }
                    }
                    _this.$nextTick(function () {
                        _this.doQuery();
                        _this.getTypes();
                    })
                })
            },
            doClearDominationArea: function () {
                this.mainModel.vo.dominationArea = {
                    id: '',
                    name: ''
                };
                this.getTypes();
                this.doQuery();
            },
            doClose: function () {
                this.visible = false;
            },
            init: function () {
                this.mainModel.vo = newVO;
                this.mainModel.vo.compId = this.compId;
                this.mainModel.vo.orgId = this.orgId;
                this.checkedType = '1';
                this.columns = columns1;
                this.url = urls['1'];
                this._getFirstArea();
            },
            reset: function () {
                this.rightKey = "";
                this.leftKey = "";
                this.checkKey = "";
                this.leftId = "";
                this.checkObjType = '0';
                this.mainModel.vo.dominationArea = {id: '', name: ''};
                this.checkedType = -1;
            }
        },
        ready: function () {
            this.enableMajorRiskSource = window.enableMajorRiskSource;
        }
    };

    var component = LIB.Vue.extend(opts);
    return component;
});