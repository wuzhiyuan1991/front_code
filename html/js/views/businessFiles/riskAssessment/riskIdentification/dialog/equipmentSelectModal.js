define(function (require) {

    var LIB = require('lib');
    var dominationAreaSelectModal = require("componentsEx/selectTableModal/dominationAreaSelectModal");
    var template = require("text!./equipmentSelectModal.html");
    var api = require("../vuex/api");

    var newVO = {
        compId: '',
        orgId: '',
        dominationArea: {
            id: '',
            name: ''
        },
        equipmentTypeId: ''
    };

    var defaultModel = {
        mainModel: {
            title: '选择设备设施',
            vo: newVO,
            selectedDatas: []
        },
        dominationAreaSelectModel: {
            visible: false,
            filterData: {}
        },
        columns: [{
                title: "",
                fieldName: "id",
                fieldType: "cb"
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
        ],
        url: 'equipment/list{/curPage}{/pageSize}',
        treeData: [],
        treeModel: {
            selectedData: []
        },
        leftKey: '',
        rightKey: '',
        leftId: ''
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
            equipmentTypeId: {
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
        computed: {},
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
                if (!this.isInit) {
                    this.doQuery();
                    this.getTypes();
                    this.isInit = false;
                }
            },
            "mainModel.vo.orgId": function () {
                if (!this.isInit) {
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
                this.mainModel.vo.dominationArea = {
                    id: '',
                    name: ''
                };
                this.getTypes();
                this.doQuery();
            },
            getTypes: function () {
                var params = {},
                    vo = this.mainModel.vo;
                this.treeModel.selectedData = [];
                params["criteria.strValue"] = {};
                if (vo.compId) {
                    params["criteria.strValue"].compId = vo.compId;
                }
                if (vo.orgId && vo.compId != vo.orgId) {
                    params["criteria.strValue"].orgId = vo.orgId;
                }
                if (vo.dominationArea.id) {
                    params["criteria.strValue"].dominationAreaId = vo.dominationArea.id;
                }
                if (vo.equipmentTypeId) {
                    params["criteria.strValue"].typeId = vo.equipmentTypeId;
                    this.leftId = vo.equipmentTypeId;
                }

                this.treeData = [];
                var _this = this;
                api.getEquipmentType(params).then(function (res) {
                    _this.treeData = res.data;
                })
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
                            columnFilterValue: {
                                "dataType": [2]
                            }
                        }
                    },
                    catalog: {
                        type: "save",
                        value: {
                            columnFilterName: "criteria.strValue",
                            columnFilterValue: {
                                catalogId: this.leftId
                            }
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
                if (this.leftId) {
                    queryArr.push(conditions.equipmentType);
                }
                this.$refs.equipmentTable.doCleanRefresh(queryArr);
            },
            doTreeNodeClick: function (data) {
                var d = data.data;
                if (data.checked) {
                    this.leftId = d.id;
                } else {
                    this.leftId = '';
                }

                this.doQuery();
            },
            doSave: function () {
                var items = this.mainModel.selectedDatas;
                if (items.length === 0) {
                    return LIB.Msg.warning("请选择设备设施");
                }
                this.$emit("do-save", {
                    isItem: '1',
                    equipment: items,
                })
            },
            doSaveType: function () {
                var items = this.treeModel.selectedData;
                if (items.length === 0) {
                    return LIB.Msg.warning("请选择左侧的设备类型");
                }
                this.$emit("do-save", {
                    isItem: '0',
                    equipmentType: items,
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
            },
            doClose: function () {
                this.visible = false;
            },
            init: function () {
                this.isInit = true;
                this.mainModel.vo = newVO;
                this.mainModel.vo.compId = this.compId;
                this.mainModel.vo.orgId = this.orgId;
                this.mainModel.vo.equipmentTypeId = this.equipmentTypeId;
                this.mainModel.vo.dominationArea = _.cloneDeep(this.dominationArea);
                this.rightKey = "";
                this.leftKey = "";
                this.leftId = "";
                this.treeModel.selectedData = [];
                this.mainModel.selectedDatas = [];
                this.getTypes();
                this.$nextTick(function () {
                    this.doQuery();
                    this.isInit = false;
                });
            },
            reset: function () {
                this.mainModel.vo.orgId = '';
                this.mainModel.vo.dominationArea = {
                    id: '',
                    name: ''
                };
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
        }
    };

    var component = LIB.Vue.extend(opts);
    return component;
});