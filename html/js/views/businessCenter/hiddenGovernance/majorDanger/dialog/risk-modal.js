define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../../vuex/api");
    var tpl = require("text!./risk-modal.html");
    var riskModel = require("views/basicSetting/basicFile/evaluationModel/dialog/riskModel");
    var dominationAreaSelectModal = require("componentsEx/selectTableModal/dominationAreaSelectModal");
    var checkItemSelectModal = require("componentsEx/selectTableModal/checkItemSelectModal");
    
    var newVO = function () {
        return {
            id: null,
            code: null,
            compId: '',
            orgId: null,
            dominationArea: {id: '', name: ''},
            riskPoint: '',
            checkObjType: '',
            hazardFactor: {},
            focusType: '',
            checkItem: {
                id: '',
                name: '',
                type: '0'
            },

            riskLevel: null,
            controlMeasures: null,
            riskModelId: null,
            state: 0,
            scene: null,
            markup: 0,
            typeOfCtrlMeas: null,//控制措施-类型
            hierOfCtrlMeas: null,//控制措施-层级
            levelOfControl: null //管控等级

        };
    };

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO(),
            isReadOnly: true,
            //当前的操作类型， create：创建， update ：更新， 影响'保存'按钮的事件处理
            opType: "",
            showItemSelectModal: false
        },
        riskModel: {
            id: null,
            opts: [],
            result: null
        },
        checkItemRiskTypeList: [],
        hazardFactorList: [], // 危害因素列表
        selectedDataHazard: [],
        selectedPosition: [],
        rules: {
            compId: [
                {required: true, message: '请选择所属公司'}
            ],
            orgId: [
                {required: true, message: '请选择所属部门'}
            ],
            "dominationArea.id": [
                {required: true, message: '请选择属地'}
            ],
            "riskPoint": [
                {required: true, message: '请选择风险点'},
                LIB.formRuleMgr.length(500)
            ],
            "checkObjType": [
                {required: true, message: '请选择风险点类型'}
            ],
            "checkItem.name": [
                {required: true, message: '请选择检查项内容'},
                LIB.formRuleMgr.length(500)
            ],
            "checkItem.type": [
                {required: true, message: '请选择检查项分类'}
            ],
            scene: [
                {required: true, message: '请输入风险场景'}
            ],
            riskLevel: [
                {required: true, message: '请选择风险等级'}
            ],
            'hazardFactor.id': [
                {required: true, message: '请选择危害因素分类'}
            ],
            'levelOfControl': [
                {required: true, message: '请选择管控等级'}
            ],
            controlMeasures: [
                LIB.formRuleMgr.length(1000),
                {
                    validator: function (rule, value, callback) {
                        var typeOfCtrlMeas = dataModel.mainModel.vo.typeOfCtrlMeas;
                        var hierOfCtrlMeas = dataModel.mainModel.vo.hierOfCtrlMeas;
                        var error = [];
                        if (!(_.isEmpty(typeOfCtrlMeas) && _.isEmpty(hierOfCtrlMeas))) {
                            if (_.isEmpty(value)) {
                                error.push("请输入控制措施内容");
                            }
                        }
                        callback(error);
                    }
                }
            ],
            typeOfCtrlMeas: [
                {
                    validator: function (rule, value, callback) {
                        var hierOfCtrlMeas = dataModel.mainModel.vo.hierOfCtrlMeas;
                        var controlMeasures = dataModel.mainModel.vo.controlMeasures;
                        var error = [];
                        if (!(_.isEmpty(hierOfCtrlMeas) && _.isEmpty(controlMeasures))) {
                            if (_.isEmpty(value)) {
                                error.push("请选择控制措施类型");
                            }
                        }
                        callback(error);
                    }
                }
            ],
            hierOfCtrlMeas: [
                {
                    validator: function (rule, value, callback) {
                        var typeOfCtrlMeas = dataModel.mainModel.vo.typeOfCtrlMeas;
                        var controlMeasures = dataModel.mainModel.vo.controlMeasures;
                        var error = [];
                        if (!(_.isEmpty(typeOfCtrlMeas) && _.isEmpty(controlMeasures))) {
                            if (_.isEmpty(value)) {
                                error.push("请选择控制措施层级");
                            }
                        }
                        callback(error);
                    }
                }
            ]
        },
        dominationAreaSelectModel: {
            visible: false,
            filterData: null
        },
        isCreated: true,
        selectedCheckItem: [],
        enableMajorRiskSource: true
    };

    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic],
        template: tpl,
        components: {
            'riskModel': riskModel,
            'checkitemSelectModal': checkItemSelectModal,
            dominationAreaSelectModal: dominationAreaSelectModal
        },
        data: function () {
            return dataModel;
        },
        methods: {
            doShowDominationAreaSelectModal: function () {
                if (!this.mainModel.vo.orgId) {
                    return LIB.Msg.warning("请先选中所属部门");
                }
                this.dominationAreaSelectModel.filterData = {orgId: this.mainModel.vo.orgId};
                this.dominationAreaSelectModel.visible = true;
            },
            doSaveDominationArea: function (items) {
                var item = items[0];
                this.mainModel.vo.dominationArea = {
                    id: item.id,
                    name: item.name
                }
            },
            doSaveItemTable : function(obj){
                this.mainModel.showItemSelectModal = false;
                this.selectedCheckItem = [];
                this.selectedCheckItem.push(obj[0]);
                this.mainModel.vo.checkItem.id = obj[0].id;
                this.mainModel.vo.checkItem.name = obj[0].name;
            },
            doCreate:function(){
                var _this = this;
                this.isCreated=false;
                _.each(_this.rules,function(value,name){
                    if(name == 'checkItem.name'){
                        value.push( { required: true, message: '请输入检查项内容'})
                    };
                    if(name == 'checkItem.type'){
                        value.push( { required: true, message: '请选择检查项分类'})
                    }
                });
            },
            doSelect:function(){
                var _this = this;
                this.isCreated=true;
                _.each(_this.rules,function(value,name){
                    if(name == 'checkItem.name'){
                        value.splice(0,value.length);
                    };
                    if(name == 'checkItem.type'){
                        value.splice(0,value.length);
                    }
                });
            },

            _init: function () {
                var _this = this;
                this.$refs.ruleform.resetFields();
                //清空数据
                _.extend(this.mainModel.vo, newVO());
                this.selectedDataHazard = [];

                this.riskModel = {
                    id: null,
                    opts: [],
                    result: null
                };
                api.getHazardFactor().then(function (res) {
                    _this.hazardFactorList = res.data;
                });
            },
            _initCreate: function () {
                this.mainModel.opType = "create";
                this.mainModel.vo.compId = LIB.user.compId;
            },
            _initUpdate: function (id) {
                var _this = this,
                    _vo = this.mainModel.vo;
                this.mainModel.opType = "update";
                api.get({id: id}).then(function (res) {
                    _.deepExtend(_vo, res.data);
                    _vo.poolId=id;
                    _vo.hazardFactor = res.data.hazardFactor;
                    _this.riskModel = JSON.parse(res.data.riskModel);

                    _this.selectedDataHazard.push(res.data.hazardFactor);

                });
            },

            doSave: function () {
                var _this = this;
                this.mainModel.vo.riskLevel = this.riskModel.result;
                this.mainModel.vo.riskModelId = this.riskModel.id;

                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {

                        var params = _.deepExtend({
                                markup:0//隐患回转记录
                             },_this.mainModel.vo);
                        params.riskModel = JSON.stringify(_this.riskModel);

                        api.createRisk(params).then(function (res) {
                            _this.$dispatch("ev_riskFinshed");
                            LIB.Msg.info("回转成功");
                        });

                    }
                });
            }
        },
        events: {
            //edit框数据加载
            "ev_riskReload": function (nVal) {
                this._init();
                this.isCreated = true;
                //存在nVal则是update
                if (nVal) {
                    this._initUpdate(nVal);
                } else {
                    this._initCreate();
                }
            }

        },
        created: function () {
            this.enableMajorRiskSource = window.enableMajorRiskSource;
        }
    });
    return detail;
});