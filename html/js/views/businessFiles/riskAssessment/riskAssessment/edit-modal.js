define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("./vuex/api");
    var tpl = require("text!./edit-modal.html");
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
            focusType: '',
            hazardFactor: {},

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
            markup: 1,
            typeOfCtrlMeas: null,//控制措施-类型
            hierOfCtrlMeas: null,//控制措施-层级
            levelOfControl: null, //管控等级
            hiddenDangerType:null,
            hiddenDangerLevel:null,
        };
    };

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO(),
            isReadOnly: true,
            //当前的操作类型， create：创建， update ：更新， 影响'保存'按钮的事件处理
            opType: "",
            showItemSelectModal: false,
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
                {required: true, message: '请选择所属部门'},
                {
                    validator: function (rule, value, callback) {
                        var error = [];
                        if (!!dataModel.mainModel.vo.orgId && dataModel.mainModel.vo.orgId == dataModel.mainModel.vo.compId) {
                            error.push("请选择所属部门");
                        }
                        callback(error);
                    }
                }
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
                {required: true, message: '请填写检查项内容'},
                LIB.formRuleMgr.length(500)
            ],
            "checkItem.type": [
                {required: true, message: '请选择检查项分类'}
            ],
            scene: [
                {required: true, message: '请输入风险场景'},
                LIB.formRuleMgr.length(1000)
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
            ],
            "hiddenDangerType":[LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
            "hiddenDangerLevel":[LIB.formRuleMgr.allowStrEmpty].concat(LIB.formRuleMgr.allowStrEmpty)
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
        watch: {
            'mainModel.vo.orgId': function (val) {
                if(this.isInit && val) {
                    this.isInit = false;
                } else {
                    this._getFirstArea();
                }
            },
            'mainModel.vo.compId': function (val) {
                if(val){
                    this._getHazardFactor();
                }
            }
        },
        methods: {
            beforeDoSave: function () {
                var _this = this;
                var obj = _.find(this.hazardFactorList, function (item) {
                    return item.id == _this.mainModel.vo.hazardFactor.id
                }) || null;

                if(!obj) _this.mainModel.vo.hazardFactor = {};
            },
            _getHazardFactor: function () {
                var _this = this;
                api.getHazardFactor({compId: this.mainModel.vo.compId}).then(function (res) {
                    _this.hazardFactorList = res.data;
                });
            },
            _getFirstArea: function () {
                var _this = this;
                // orgId == compId 代表 所属部门不存在
                if(!this.mainModel.vo.orgId || this.mainModel.vo.orgId == this.mainModel.vo.compId) {
                    this.mainModel.vo.dominationArea = {
                        id: "",
                        name: ""
                    };
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
                })
            },
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
            // 清空检查项
            doClearInput: function () { 
                this.mainModel.vo.checkItem = {
                    id: '',
                    name: '',
                    type: '0'
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

                var _vo = _this.mainModel.vo;

                //清空数据
                //通过判断属性是否有get方法来判断是否是双向绑定的属性, 如果不是则清空
                for (var key in _vo) {
                    if (!Object.getOwnPropertyDescriptor(_vo, key).get) {
                        _vo[key] = null;
                    }

                    if (_.isPlainObject(_vo[key])) {
                        var objValue = _vo[key];
                        //为了性能考虑暂时只做2层对象属性处理，多级处理请重写afterInit单独处理
                        for (var objValuekey in objValue) {
                            if (!Object.getOwnPropertyDescriptor(objValue, objValuekey).get) {
                                //对象属性为声明的值直接删除
                                delete objValue[objValuekey];
                            }
                        };
                    }
                };

                //清空数据
                _.deepExtend(this.mainModel.vo, newVO());
                this.selectedDataHazard = [];
                this.hazardFactorList = [];

                this.riskModel = {
                    id: null,
                    opts: [],
                    result: null
                };
                if(this.mainModel.vo.compId){
                    api.getHazardFactor({compId: this.mainModel.vo.compId}).then(function (res) {
                        _this.hazardFactorList = res.data;
                    });
                }

            },
            _initCreate: function () {
                this.mainModel.opType = "create";
                this.mainModel.vo.compId = LIB.user.compId;
                this.mainModel.vo.hazardFactor = {};
                this._getHazardFactor();
            },
            _initUpdate: function (id) {
                var _this = this,
                    _vo = this.mainModel.vo;
                this.mainModel.opType = "update";
                api.get({id: id}).then(function (res) {
                    if(_vo.compId == res.data.compId){
                        _this._getHazardFactor();
                    }
                    _.deepExtend(_vo, res.data);

                    _vo.hazardFactor = res.data.hazardFactor;
                    _this.riskModel = JSON.parse(res.data.riskModel);

                    _this.selectedDataHazard.push(res.data.hazardFactor);


                });
            },

            doSave: function () {
                var _this = this;
                this.mainModel.vo.riskLevel = this.riskModel.result;
                this.mainModel.vo.riskModelId = this.riskModel.id;
                this.beforeDoSave();
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {

                        var params =  _this.mainModel.vo;
                        params.riskModel = JSON.stringify(_this.riskModel);

                        if (_this.mainModel.opType === "create") {
                            api.create(params).then(function (res) {
                                _this.$emit("do-save", res, 'create');
                                LIB.Msg.info("保存成功");
                            });
                        } else {
                            api.update(params).then(function (res) {

                                _this.$emit("do-save", params, 'update');
                                LIB.Msg.info("修改成功");
                            });
                        }
                    }
                });
            }
        },
        events: {
            //edit框数据加载
            "ev_editReload": function (nVal) {
                this._init();
                this.isCreated = true;
                //存在nVal则是update
                if (nVal) {
                    this.isInit = true;
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
