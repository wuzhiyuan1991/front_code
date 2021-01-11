define(function (require) {

    var LIB = require('lib');
    var dominationAreaSelectModal = require("componentsEx/selectTableModal/dominationAreaSelectModal");

    var template = require("text!./main.html");
    var api = require("./api");

    var types = [
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

    var columns2 = [
        {
            title: "",
            fieldName: "id",
            fieldType: "radio"
        },
        {
            //编码
            title: "编码",
            fieldName: "code",
            keywordFilterName: "criteria.strValue.keyWordValue_code",
            width: 150
        },
        {
            //名称
            title: "设备设施名称",
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
            //编码
            title: "编码",
            fieldName: "code",
            keywordFilterName: "criteria.strValue.keyWordValue_code",
            width: 150
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
            //编码
            title: "编码",
            fieldName: "code",
            keywordFilterName: "criteria.strValue.keyWordValue_code",
            width: 150
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
            //编码
            title: "编码",
            fieldName: "code",
            keywordFilterName: "criteria.strValue.keyWordValue_code",
            width: 150
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

    var urls = {
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
            title: '选择检查对象',
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
            checkObjectType: {
                type: String,
                default: ''
            },
            checkObjectId: {
                type: String,
                default: ''
            },
            showTypeBtn: {
                type: Boolean,
                default: true
            },
            orgId: {
                type: String,
                default: ''
            },
            dominationArea: {
                type: Object,
                default: function () {
                    return {
                        id: '',
                        name: ''
                    }
                }
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
                        return item.id === '2';
                    })
                }
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
            "mainModel.vo.compId": function (val) {
                if(!this.isInit) {
                    this.doQuery();
                    this.getTypes();
                    this.isInit = false;
                }
            },
            "mainModel.vo.orgId": function () {
                if(!this.isInit) {
                    this._getFirstArea();
                    this.isInit = false;
                }
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
            doClearDominationArea: function () {
                this.mainModel.vo.dominationArea = {id: '', name: ''};
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
                this.leftId = "";
                this.treeModel.selectedData = [];
                this.getTypes();
                this._setTableSetting();
                this.mainModel.selectedDatas = [];
                this.$nextTick(function () {
                    this.doQuery();
                    this.isInit = false;
                });
            },
            getTypes: function () {
                var params = {},
                    vo = this.mainModel.vo;

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
                this.treeData = [];
                var _this = this;
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
                if (this.showEquipment) {
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
                    keyWord: {
                        type: "save",
                        value: {
                            columnFilterName: "keyWordValue",
                            columnFilterValue: this.rightKey
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
                    disable: {
                        type: "save",
                        value: {
                            columnFilterName: "disable",
                            columnFilterValue: 0
                        }
                    },
                    stats: {
                        type: "save",
                        value: {
                            columnFilterName: "state",
                            columnFilterValue: 0
                        }
                    }
                };

                queryArr.push(conditions.disable);
                queryArr.push(conditions.stats);

                if (vo.compId) {
                    queryArr.push(conditions.compId);
                }
                if (vo.orgId) {
                    queryArr.push(conditions.orgId);
                }
                if (vo.dominationArea.id) {
                    queryArr.push(conditions.dominationArea);
                }
                if (this.rightKey) {
                    queryArr.push(conditions.kw);
                }

                if (this.showEquipment) {
                    if (this.leftId) {
                        queryArr.push(conditions.equipmentType);
                    }

                    this.$refs.table2.doCleanRefresh(queryArr);
                }

                else if (this.showChemical) {
                    queryArr.push(conditions.chemical);
                    if (this.leftId) {
                        queryArr.push(conditions.catalog)
                    }
                    this.$refs.table3.doCleanRefresh(queryArr);
                }

                else if (this.showRiskSource) {
                    this.$refs.table4.doCleanRefresh(queryArr);
                }

                else if (this.showProcess) {
                    if (this.leftId) {
                        queryArr.push(conditions.catalog)
                    }
                    this.$refs.table5.doCleanRefresh(queryArr);
                }
            },
            doTreeNodeClick: function (data) {
                var d = data.data;
                if(data.checked) {
                    this.leftId = d.id;
                } else {
                    this.leftId = '';
                }

                this.doQuery();
            },
            _getCheckObjType: function (lr, item) {

                return this.checkedType;
                /*
                // 重大危险源
                if (this.showRiskSource) {
                    return '5';
                }

                // 设备
                if (this.showEquipment) {

                    if (lr === 1) {
                        return '4'
                    }
                    return '3'
                }

                // 工艺
                if (this.showProcess) {
                    if (lr === 1) {
                        return '6'
                    }
                    return '10'
                }

                // 化学品
                if (lr === 0) {
                    return '9'
                }
                if (item.dateType === '2') {
                    return '7'
                }
                return '8'
                */
            },
            doSave: function () {
                var items = this.mainModel.selectedDatas;
                if (items.length === 0) {
                    return LIB.Msg.warning("请选择表格中的检查对象");
                }

                var type = this._getCheckObjType(1, items[0]);

                this.$emit("do-save", {
                    isItem: '1',
                    checkObj: items[0],
                    checkObjType: type
                })
            },
            doSaveType: function () {
                var type = this._getCheckObjType(0);
                var items = this.treeModel.selectedData;
                if (items.length === 0) {
                    return LIB.Msg.warning("请选择左侧的检查对象类型");
                }
                this.$emit("do-save", {
                    isItem: '0',
                    checkObj: items[0],
                    checkObjType: type
                })
            },
            _getFirstArea: function () {
                var _this = this;
                _this.mainModel.vo.dominationArea = {
                    id: "",
                    name: ""
                };
                _this.$nextTick(function () {
                    _this.doQuery();
                    _this.getTypes();
                })
                // if(!this.mainModel.vo.orgId) {
                //     this.mainModel.vo.dominationArea = {
                //         id: "",
                //         name: ""
                //     };
                //     this.$nextTick(function () {
                //         this.doQuery();
                //     });
                //     return;
                // }
                // api.getDominationAreaList({orgId: this.mainModel.vo.orgId}).then(function (res) {
                //     if(res.data.list && res.data.list.length > 0) {
                //         var item = res.data.list[0];
                //         _this.mainModel.vo.dominationArea = {
                //             id: item.id,
                //             name: item.name
                //         }
                //     } else {
                //         _this.mainModel.vo.dominationArea = {
                //             id: "",
                //             name: ""
                //         }
                //     }
                //     _this.$nextTick(function () {
                //         _this.doQuery();
                //     })
                // })
            },
            doClose: function () {
                this.visible = false;
            },
            init: function () {
                this.isInit = true;
                this.mainModel.vo = newVO;
                this.mainModel.vo.compId = this.compId;
                this.mainModel.vo.orgId = this.orgId;
                this.mainModel.vo.dominationArea = _.cloneDeep(this.dominationArea);
                this.doChangeType('2');
            },
            reset: function () {
                this.mainModel.vo.orgId = '';
                this.mainModel.vo.dominationArea = {id: '', name: ''};
                this.checkedType = -1;
            },
            displayFunc: function (data) {
                return data.name + "(" + data.dataCount + ")";
            },
            onDbClickCell: function () {
                this.doSave();
            }
        },
        ready: function () {
            this.isInit = false;
            this.enableMajorRiskSource = window.enableMajorRiskSource;
        }
    };

    var component = LIB.Vue.extend(opts);
    return component;
});