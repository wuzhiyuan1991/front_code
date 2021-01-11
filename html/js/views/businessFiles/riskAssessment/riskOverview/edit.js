define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("./vuex/api");
    var tpl = require("text!./edit.html");
    var editOpt = require("./edit-opt");
    var checkItemSelectModal = require("componentsEx/selectTableModal/checkItemSelectModal");
    var riskModel = require("views/basicSetting/basicFile/evaluationModel/dialog/riskModel");
    var equipmentSelectModal = require("componentsEx/selectTableModal/equipmentSelectModal");
    var columsCfg = LIB.setting.fieldSetting["BC_RiA_HazI"] ? LIB.setting.fieldSetting["BC_RiA_HazI"] : [];
    var columsCfg1 = columsCfg;
    columsCfg = _.groupBy(columsCfg, "formItemGroup");
    var customTpl = '';
    var map = {
        "enum": require("text!componentsEx/template/enum.html"),
        "string": require('text!componentsEx/template/string.html'),
        'risk': require('text!componentsEx/template/riskModel.html'),
        'checkRadio': require('text!componentsEx/template/radioModel.html'),
        'text': require('text!componentsEx/template/string-areatext.html')
    };
    var renderTpl = function (type) {
        if (type === 'checkRadio') {
            return map.checkRadio;
        } else if (type === 'refer') {
            return map.risk;
        }
    }
    customTpl = LIB.formRenderMgr.renderHtml(map, columsCfg, renderTpl);
    tpl = tpl.replace('$hook', customTpl);

    var newCheckItem = function () {
        return {
            id: null,
            name: null,
            type: null,
            riskTypeId: null,
        }
    };
    var newVO = function () {
        return LIB.dataRenderMgr.renderVO({
            id: null,
            riskLevel: null,
            controlMeasures: null,
            riskModelId: null,
            residualRiskModelId: null,
            state: 0,
            scene: null,
            orgId: null,
            code: null,

            markup: 1,
            riskType: {
                id: null
            },
            equipment: {id: null, name: null},
            equipmentId: null,
            hazardFactor: {},
            checkItem: newCheckItem(),
            typeOfCtrlMeas: null,//控制措施-类型
            hierOfCtrlMeas: null,//控制措施-层级
            scoreOfCtrlMeas: null,//控制措施-分值
            levelOfControl: null //管控等级

        }, columsCfg1)
    };

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO(),
            isReadOnly: true,
            checkItem: {
                name: null,
                id: null,
            },
            //当前的操作类型， create：创建， update ：更新， 影响'保存'按钮的事件处理
            opType: "",
            typeList: [{id: "0", name: "行为类"}, {id: "1", name: "状态类"}, {id: "2", name: "管理类"}],
            checkItemId: null,
            checkItemName: null,
            checkItemType: null,
            showItemSelectModal: false,
            showEquipmentSelectModal: false
        },
        riskModel: {
            id: null,
            opts: [],
            result: null
        },
        residualRiskModel: {
            id: null,
            opts: [],
            result: null
        },
        checkItemRiskTypeList: [],
        riskTypeList: [],
        hazardFactorList: [],
        positionList: [],
        selectedDataRisk: [],
        selectedDataHazard: [],
        orgList: [],
        selectedOrg: [],
        selectedCheckItem: [],
        selectedPosition: [],
        isCreated: true,
        emergencyPlanYes: true,
        emergencyPlanNo: false,
        rules: {
        }
    };

    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, editOpt],
        template: tpl,
        components: {
            'riskModel': riskModel,
            // "itemComponent":itemComponent,
            'checkitemSelectModal': checkItemSelectModal,
            'equipmentSelectModal': equipmentSelectModal
        },
        data: function () {
            var columsCfg = LIB.setting.fieldSetting["BC_RiA_HazI"] ? LIB.setting.fieldSetting["BC_RiA_HazI"] : []
            var renderRules = _.bind(LIB.dataRenderMgr.renderRules, this, columsCfg);
            var _this = this;
            var rules = renderRules({
                orgId: [
                    {required: true, message: '请选择所属公司'},
                ],
                scene: [
                    {required: true, message: '请输入风险场景'},
                ],
                riskLevel: [
                    {required: true, message: '请选择风险等级'},
                ],
                controlMeasures: [
                    LIB.formRuleMgr.length(1000)
                ],
                'riskType.id': [
                    {required: true, message: '请选择风险类别'},
                ],
                'hazardFactor.id': [
                    {required: true, message: '请选择危害因素分类'},
                ],
                'levelOfControl': [
                    {required: true, message: '请选择管控等级'},
                ],
                controlMeasures: [{
                    validator: function (rule, value, callback) {
                        var typeOfCtrlMeas = _this.mainModel.vo.typeOfCtrlMeas;
                        var hierOfCtrlMeas = _this.mainModel.vo.hierOfCtrlMeas;
                        var error = [];
                        if (!(_.isEmpty(typeOfCtrlMeas) && _.isEmpty(hierOfCtrlMeas))) {
                            if (_.isEmpty(value)) {
                                error.push("请输入控制措施内容");
                            }
                        }
                        callback(error);
                    }
                }],
                typeOfCtrlMeas: [{
                    validator: function (rule, value, callback) {
                        var hierOfCtrlMeas = _this.mainModel.vo.hierOfCtrlMeas;
                        var controlMeasures = _this.mainModel.vo.controlMeasures;
                        var error = [];
                        if (!(_.isEmpty(hierOfCtrlMeas) && _.isEmpty(controlMeasures))) {
                            if (_.isEmpty(value)) {
                                error.push("请选择控制措施类型");
                            }
                        }
                        callback(error);
                    }
                }],
                hierOfCtrlMeas: [{
                    validator: function (rule, value, callback) {
                        var typeOfCtrlMeas = _this.mainModel.vo.typeOfCtrlMeas;
                        var controlMeasures = _this.mainModel.vo.controlMeasures;
                        var error = [];
                        if (!(_.isEmpty(typeOfCtrlMeas) && _.isEmpty(controlMeasures))) {
                            if (_.isEmpty(value)) {
                                error.push("请选择控制措施层级");
                            }
                        }
                        callback(error);
                    }
                }]
            });
            dataModel.rules = _.extend(rules, dataModel.rules);
            return dataModel;
        },
        methods: {
            doClearInput: function () {
                this.mainModel.checkItem = {
                    id: '',
                    name: ''
                }
            },
            doSaveEquipment: function (selectedDatas) {
                if (selectedDatas) {
                    var equipment = selectedDatas[0];
                    this.mainModel.vo.equipmentId = equipment.id;
                    this.mainModel.vo.equipment.name = equipment.name;
                    this.mainModel.vo.equipment.id = equipment.id;
                }
            },
        },
        events: {
            //edit框数据加载
            "ev_editReload": _.debounce(function (nVal) {
                this.$refs.ruleform.resetFields();
                var _data = dataModel.mainModel;
                var _vo = _data.vo,
                    _this = this;
                this.isCreated = true;
                //清空数据
                _.extend(_vo, newVO());
                dataModel.selectedOrg = new Array();
                dataModel.selectedDataRisk = new Array();
                dataModel.selectedDataHazard = new Array();
                dataModel.selectedCheckItem = new Array();
                dataModel.mainModel.checkItem = {
                    name: null,
                    id: null
                };
                dataModel.riskModel = {
                    id: null,
                    opts: [],
                    result: null
                };
                _.each(_this.rules, function (value, name) {
                    if (name == 'checkItem.name') {
                        // value = [] ;
                        value.splice(0, value.length);
                    }
                    ;
                    if (name == 'checkItem.type') {
                        // value = [];
                        value.splice(0, value.length);
                    }
                });
                //存在nVal则是update
                if (nVal != null) {
                    _data.opType = "update";
                    api.get({id: nVal}).then(function (res) {
                        _.deepExtend(_vo, res.data);
                        if (res.data.checkItem) {

                            _.extend(_vo.checkItem, res.data.checkItem);
                        } else {
                            // _.extend(_vo.checkItem,null);
                        }
                        if (res.data.emergencyPlan) {
                            dataModel.emergencyPlanYes = true;
                            dataModel.emergencyPlanNo = false;
                        } else {
                            dataModel.emergencyPlanYes = false;
                            dataModel.emergencyPlanNo = true;
                        }

                        _vo.hazardFactor = res.data.hazardFactor;
                        dataModel.riskModel = JSON.parse(res.data.riskModel);
                        if (res.data.residualRiskModel) {
                            dataModel.residualRiskModel = JSON.parse(res.data.residualRiskModel);
                        }

                        dataModel.selectedOrg.push({"id": res.data.orgId});
                        if (res.data.riskType) {
                            dataModel.selectedDataRisk.push(res.data.riskType);
                        } else {
                            dataModel.mainModel.vo.riskType = {
                                id: null
                            }
                        }
                        ;
                        dataModel.selectedDataHazard.push(res.data.hazardFactor);

                        if (res.data.checkItem) {
                            dataModel.selectedCheckItem.push(res.data.checkItem);
                            dataModel.mainModel.checkItem.id = res.data.checkItem.id;
                            dataModel.mainModel.checkItem.name = res.data.checkItem.name;
                        }
                        ;


                    });
                } else {
                    _data.opType = "create";
                    dataModel.residualRiskModel = {};

                }
                //初始化风险类型
                api.getRiskType().then(function (res) {
                    dataModel.riskTypeList = res.data;
                });
                api.getHazardFactor().then(function (res) {
                    dataModel.hazardFactorList = res.data;
                });
            }, 10)

        }
    });
    return detail;
});