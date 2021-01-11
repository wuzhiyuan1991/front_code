define(function (require) {

    var LIB = require('lib');
    var dominationAreaSelectModal = require("componentsEx/selectTableModal/dominationAreaSelectModal");

    var template = require("text!./main.html");
    var api  =require("./api");

    var types = [
        {
            id: '1',
            name: '作业环境'
        },
        {
            id: '2',
            name: '设备'
        },
        {
            id: '3',
            name: '作业活动'
        },
        {
            id: '4',
            name: '物料'
        },
        {
            id: '5',
            name: '一般/重大化学品'
        },
        {
            id: '6',
            name: '重大危险源'
        },
        {
            id: '7',
            name: '重大化学品工艺'
        }
    ];

    var columns1 = [
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
            //编码
            title: "编码",
            fieldName: "code",
            keywordFilterName: "criteria.strValue.keyWordValue_code",
            width: 150
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
            title: '选择检查对象',
            vo: newVO,
            selectedDatas: []
        },
        types: types,
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
        rightKey: ''
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
            dominationArea: {
                type: Object,
                default: function () {
                    return {
                        id: '',
                        name: ''
                    }
                }
            }
        },
        computed: {
            // 显示选择属地的表格
            showArea: function () {
                return _.includes(['1', '3', '4'], this.checkedType);
            },
            // 显示选择设备的表格
            showEquipment: function () {
                return '2' === this.checkedType;
            },
            // 显示选择化学品的表格
            showChemical: function () {
                return '5' === this.checkedType;
            },
            // 显示选择重大危险源的表格
            showRiskSource: function () {
                return '6' === this.checkedType;
            },
            // 显示选择化学品工艺的表格
            showProcess: function () {
                return '7' === this.checkedType;
            }
        },
        data: function () {
            return defaultModel;
        },
        watch: {
            visible: function (nVal) {
                if(nVal) {
                    this.init();
                } else {
                    this.reset();
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
            },
            doChangeType: function (t) {
                if(this.checkedType === t) {
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
                })
            },
            getTypes: function () {
                var params = {};

                this.treeData = [];
                var _this = this;
                if(this.showEquipment) {
                    params["criteria.intValue"] = {isDataReferenced:1};
                    api.getEquipmentType(params).then(function (res) {
                        _this.treeData = res.data;
                    })
                }
                else if(this.showChemical) {

                    api.getChemicalType().then(function (res) {
                        _this.treeData = res.data;
                    })
                }
                else if(this.showProcess) {
                    params["criteria.intValue"] = {isDataReferenced:1};
                    api.getProcessType().then(function (res) {
                        _this.treeData = res.data;
                    })
                }
            },
            _setTableSetting: function () {
                if(this.showArea) {
                    this.url = urls['1'];
                    this.columns = columns1;
                }
                else if(this.showEquipment) {
                    this.url = urls['2'];
                    this.columns = columns2;
                }
                else if(this.showChemical) {
                    this.url = urls['3'];
                    this.columns = columns3;
                }

                else if(this.showRiskSource) {
                    this.url = urls['4'];
                    this.columns = columns4;
                }

                else if(this.showProcess) {
                    this.url = urls['5'];
                    this.columns = columns5;
                }
            },
            doQuery: function () {
                var query = {},
                    vo = this.mainModel.vo;

                if(vo.compId) {
                    query.compId = vo.compId;
                }
                if(vo.orgId) {
                    query.orgId = vo.orgId
                }
                if(vo.dominationArea.id) {
                    query.dominationAreaId = vo.dominationArea.id
                }
                if(this.rightKey) {
                    query["criteria.strValue"] = {keyWordValue: this.rightKey};
                }

                if(this.showArea) {
                    this.$refs.table1.doQuery(query);
                }

                else if(this.showEquipment) {
                    if(this.leftId) {
                        query["equipmentType.id"] = this.leftId;
                    }
                    this.$refs.table2.doQuery(query);
                }

                else if(this.showChemical) {
                    query["criteria.intsValue"] = {"dataType":[2,3]};
                    if(this.leftId) {
                        if(query["criteria.strValue"]) {
                            query["criteria.strValue"]["catalogId"] = this.leftId;
                        } else {
                            query["criteria.strValue"] = {catalogId: this.leftId};
                        }
                    }
                    this.$refs.table3.doQuery(query);
                }

                else if(this.showRiskSource) {
                    this.$refs.table4.doQuery(query);
                }

                else if(this.showProcess) {
                    if(this.leftId) {
                        if(query["criteria.strValue"]) {
                            query["criteria.strValue"]["catalogId"] = this.leftId;
                        } else {
                            query["criteria.strValue"] = {catalogId: this.leftId};
                        }
                    }
                    this.$refs.table5.doQuery(query);
                }
            },
            doTreeNodeClick: function (data) {
                var d = data.data;
                if(this.leftId === d.id) {
                    return;
                }
                this.leftId = d.id;

                this.doQuery();
            },
            doSave: function () {
                var type;
                if(this.mainModel.selectedDatas.length === 0) {
                    return LIB.Msg.warning("请选择表格中的检查对象");
                }
                if(this.showArea) {
                    type = 1
                } else {
                    type = 0
                }

                // this.$emit("do-save", {
                //     compId: this.mainModel.vo.compId,
                //     orgId: this.mainModel.vo.orgId,
                //     dominationArea: this.mainModel.vo.dominationArea,
                //     checkObj: this.mainModel.selectedDatas[0]
                // })
                this.$emit("do-save", this.mainModel.selectedDatas[0], type)
            },
            onDbClickCell: function () {
                this.doSave();
            },
            init: function () {
                this.mainModel.vo = newVO;
                this.mainModel.vo.compId = this.compId;
                this.mainModel.vo.orgId = this.orgId;
                this.mainModel.vo.dominationArea = _.cloneDeep(this.dominationArea);
                this.checkedType = '1';
                this.columns = columns1;
                this.url = urls['1'];
                this.$nextTick(function () {
                    this.doQuery();
                })
            },
            reset: function () {
                
            }
        }
    };

    var component = LIB.Vue.extend(opts);
    return component;
});