define(function (require) {
    var LIB = require("lib");
    var Vue = require("vue");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var equipmentSelectModal = require("componentsEx/selectTableModal/majorRiskSourceEquipmentSelectModal");
    var inputMultiSelector = require("componentsEx/multiInputSelector/main");
    var template = require("text!./modelFormRecord.html");
    var api = require("../../vuex/api");
    var model = require("../../model");


    return Vue.extend({
        template: template,
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        components: {
            userSelectModal: userSelectModal,
            inputMultiSelector: inputMultiSelector,
            equipmentSelectModal: equipmentSelectModal,
        },
        props: {
            isSafetyMonitor: {
                type: Boolean,
                default: false,
            },
            visible: Boolean,
            model: Object,
            title: String,
            parentData: [Object, Array]
        },
        data: function () {
            var _this = this;
            return {
                load: false,
                type: "",//edit,add模式
                typeName: {
                    add: "新增",
                    edit: "修改",
                },
                label: {
                    name: "",
                    operateTime: "",
                    quantity: null,
                    operators: "",
                    operateTime: "",
                    operationContent: "",
                    checkResult:"",
                },
                rules: {},
                enum: model.enum,
                selectModel: {
                    user: {
                        show: false,
                    },
                    equipment: {
                        show: false,
                        filterData: {
                            'id': undefined,
                            'criteria.intsValue': {
                                type: [1]
                            }
                        },
                    }
                },
                selAllQuantity: false,//维护/保养数量 是否被全选
                quantityMax: ['', 0, 0, 0],//表示设备，管道，监控设置的最大数量  1:设备,2:管道,3:监控系统
            }
        },
        computed: {
            isNormal: function () {
                return this.model.phase != 3;
            },
            maxQuantity: function () {
                var index = this.selectModel.equipment.filterData['criteria.intsValue'].type[0];
                var max = this.quantityMax[index];
                return max;
            }
        },
        methods: {
            getLabel: function (key) {
                var _this = this;
                return {
                    //作业阶段 1:检修抢修,2:维护保养,3:检验检测
                    name: function () {
                        return _this.model.mrsEquipmentType=="2"?"管道" : "设备";
                    },
                    operateTime: function () {
                        return _this.enum.workPhase[_this.model.phase] + "日期";
                    },
                    quantity: function () {
                        return _this.enum.workPhase[_this.model.phase] + "数量";
                    },
                    operators: function () {
                        return _this.enum.workPhase[_this.model.phase] + "人员";
                    },
                    operationContent: function () {
                        return _this.enum.workPhase[_this.model.phase] + "内容";
                    },
                    checkResult:function () {
                        return _this.enum.workPhase[_this.model.phase] + "结果";
                    }
                }
            },
            initLabel: function () {
                this.label.name = this.getLabel().name();
                this.label.operateTime = this.getLabel().operateTime();
                this.label.operateTime = this.getLabel().operateTime();
                this.label.quantity = this.getLabel().quantity();
                this.label.operators = this.getLabel().operators();
                this.label.operationContent = this.getLabel().operationContent();
                this.label.checkResult=this.getLabel().checkResult();
            },
            initRule: function () {
                var _this=this;
                var rules = {
                    "mrsEquipment.id": [{required: true, message: '请选择一个' + this.label.name}],
                    "operateTime": [LIB.formRuleMgr.require(this.label.operateTime)],
                    "quantity": [ LIB.formRuleMgr.require(this.label.quantity),{
                        validator: function (rule, val, callback) {
                            var index = _this.selectModel.equipment.filterData['criteria.intsValue'].type[0];
                            var max = _this.quantityMax[index];
                            if (val > max) {
                                callback(_this.label.quantity+"量不能超过现有" + (index == 2 ? "管道" :"设备" ) + "的数量");
                                return;
                            }
                            callback();
                        }
                    }].concat(LIB.formRuleMgr.range(1)),
                    "operators": {
                        validator: function (rule, val, callback) {
                            if (this.operationType == 1 && (!this.users || this.users.length === 0)) {
                                callback("请选择" + _this.label.operators);
                                return;
                            } else if (this.operationType == 2 && !this.operators) {
                                callback("请填写" + _this.label.operators);
                                return;
                            }
                            else if (this.operationType == 2 && this.operators.length>100) {
                                callback(_this.label.operators+"长度请不要超过100");
                                return;
                            }
                            callback()
                        }
                    },
                    "operationContent": [LIB.formRuleMgr.require(this.label.operationContent), LIB.formRuleMgr.length(500)]
                };
                if(this.model.phase==3){
                    _.extend(rules,{
                        "inspectOrgan": [LIB.formRuleMgr.require("检测机构"),LIB.formRuleMgr.length(200)],
                        "operators": [LIB.formRuleMgr.require("检验检测人员")],
                    })
                }
                this.rules=rules;
            },
            show: function (title) {
                this.title = title;
                this.visible = true;
            },
            initData: function () {
                this.initLabel();
                //先initLabel在Rule,rule里面需要用到label
                this.initRule();
            },
            init: function (type, model, parentData) {
                //修改model 来达到修噶model的下沟哦
                // this._handleModel(model);
                this.model = model;
                this.type = type;
                this.title = this.typeName[type];
                this.visible = true;
                this.parentData = parentData;
                //初始化其他参数
                this.selectModel.equipment.filterData.id = parentData.id;
                // if(this.isSafetyMonitor){
                //     this.selectModel.equipment.filterData['criteria.intsValue'].type[0]=3;
                // }
                this.selectModel.equipment.filterData['criteria.intsValue'].type[0] = this.model.mrsEquipmentType;
                this.initData();
                this._setQuantityMax();

            },
            _handleModel: function (model) {
                if (model.operationType == "1") {
                    Vue.set(model, "tempUsers", model.users || []);
                    // model.tempUsers=
                } else {
                    Vue.set(model, "tempUsers", model.operators || []);
                    //model.tempUsers=
                }
            },
            _resoveModel: function () {
                var model = JSON.parse(JSON.stringify(this.model));
                if (this.isNormal && model.operationType == "1") {
                    // model.users=model.tempUsers;
                    delete model.operators;
                } else {
                    // model.operators=model.tempUsers;
                    delete model.users;
                }
                // delete  model.tempUsers;
                model.mrsEquipmentId = model.mrsEquipment.id;
                if (!this.isNormal) {
                    delete model.operationType;
                }
                return model;
            },

            doSaveUser: function (users) {
                this.model.users = users;
            },
            doSaveEquipment: function (equipments) {
                var temp = equipments[0];
                this.model.mrsEquipment = {id: temp.id, name: temp.name};
            },
            doChangeEquipmentType: function (val) {
                this.selectModel.equipment.filterData['criteria.intsValue'].type[0] = val;
                this.model.mrsEquipment = {id: "", name: ""};
            },
            doSave: _.debounce(function () {
                var _this = this;
                this.$refs.form.validate(function (vali) {
                    if (vali) {
                        var apiFun = _this.type === "add" ? api.saveMrsEquipMaintRecord : api.updateMrsEquipMaintRecord;
                        apiFun({id: _this.$parent.model.id}, _this._resoveModel()).then(function () {
                            LIB.Msg.success("保存成功", 1);
                            _this.$emit("on-success", _this.model);
                            _this.visible = false;
                        })
                    }
                })
            }, 100),
            doCancel: function () {
                this.visible = false;
            },
            _setQuantityMax: function () {
                this.quantityMax = [null, 0, 0, 0];
                var _this = this;
                api.queryMrsEquipments(this.parentData.id, ['1', '2', '3']).then(function (res) {
                    res.data.forEach(function (item) {
                        _this.quantityMax[item.type]++;
                    })
                })
            },
            doToggleSelAllQuantity: function (checked) {
                if (checked) {
                    var index = this.selectModel.equipment.filterData['criteria.intsValue'].type[0];
                    this.model.quantity = this.quantityMax[index] + "";
                }
            },

        },
        created: function () {

        },
        watch: {
            visible: function (val) {
                if (val && !this.load) {
                    this.initRule();
                    this.load = true;

                } else {
                    this.load = false;
                }
            },
            'model.quantity': function (val) {
                if (val != this.maxQuantity && this.selAllQuantity) {
                    this.selAllQuantity = false;
                }
            }
        }
    })
})