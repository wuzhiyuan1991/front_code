define(function (require) {
    var LIB = require('lib');
    var api = require("../../vuex/api");
    //数据模型
    var tpl = require("text!./itemFormModal.html");
    // var riCheckItemParamSelectModal = require("componentsEx/selectTableModal/riCheckItemParamSelectModal");

    //初始化数据模型
    var newVO = function () {
        return {
            //编码
            code: null,
            //巡检内容
            name: null,
            //禁用标识 0:未禁用,1:已禁用
            disable: '0',
            attr2:"1",
            //巡检依据
            checkBasis: null,
            //适用设备状态 0:在用,1:备用,2:维修, 默认选中0:在用
            equipmentStates: ['0'],
            riCheckItemEquipmentStateRels : [],
            //是否读取现场参数值 0:不需要,1:需要
            isMeterReadingNeeded: '0',
            //关联类型 1:自身,2:设备设施
            refType: null,
            //巡检项参数
            riCheckItemParam: {id: '', value1: '', value2: '', value3: '', value4: '', value5: '', unit: ''},
            riCheckTypes: [],
            riCheckResults: [],
            rightResult: '',
            wrongResult: '',
            isQualifiedRemarkWrite: '0',
            riCheckItem: {attr2: '1'}
        }
    };

    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'create',
            isReadOnly: false,
            title: "添加巡检项",

            //验证规则
            rules: {
                "code": [LIB.formRuleMgr.length()],
                "name": [
                    LIB.formRuleMgr.require("巡检内容"),
                    LIB.formRuleMgr.length(500)
                ],
                "checkBasis": [
                    LIB.formRuleMgr.length(500)
                ],
                "equipmentStates": [
                    {type: "array", required: true, message: "请选择适用设备状态"}
                ],
                "rightResult": [
                    LIB.formRuleMgr.require("巡检结果(正确)")
                ],
                "wrongResult": [
                    LIB.formRuleMgr.require("巡检结果(错误)")
                ],
                "riCheckItemParam.value1": [LIB.formRuleMgr.require("最大值"),
                    {
                        validator: function(rule, value, callback) {
                            var value5 = dataModel.mainModel.vo.riCheckItemParam.value5;
                            if(value5 && Number(value) <= Number(value5)) {
                                return callback(new Error("最大值必须大于最大值"))
                            }
                            return callback();
                        }
                    }
                ].concat(LIB.formRuleMgr.range(-9999, 9999, 2)),
                "riCheckItemParam.value5": [LIB.formRuleMgr.require("最小值")].concat(LIB.formRuleMgr.range(-9999, 9999, 2)),
                "riCheckItemParam.value2": [LIB.formRuleMgr.require("较大值"),
                    {
                        validator: function(rule, value, callback) {
                            var value1 = dataModel.mainModel.vo.riCheckItemParam.value1;
                            if(value1 && Number(value) >= Number(value1)) {
                                return callback(new Error("较大值必须小于最大值"))
                            }
                            return callback();
                        }
                    }
                ].concat(LIB.formRuleMgr.range(-9999, 9999, 2)),
                "riCheckItemParam.value4": [
                    LIB.formRuleMgr.require("较小值"),
                    {
                        validator: function(rule, value, callback) {
                            var value5 = dataModel.mainModel.vo.riCheckItemParam.value5;
                            if(value5 && Number(value) <= Number(value5)) {
                                return callback(new Error("较小值必须大于最小值"))
                            }
                            return callback();
                        }
                    }
                ].concat(LIB.formRuleMgr.range(-9999, 9999, 2)),
                "riCheckItemParam.unit": [LIB.formRuleMgr.require("单位"), LIB.formRuleMgr.length(10)],
                "riCheckItemParam.value3": [LIB.formRuleMgr.require("标准值")].concat(LIB.formRuleMgr.range(-9999, 9999, 2))
            }
        },
        selectModel: {
            riCheckItemParamSelectModel: {
                visible: false,
                filterData: {orgId: null}
            }
        },
        checkTypes: [],
        rightResults: [],
        wrongResults: [],
        isMeterReadingNeeded: false,
        showEquipmentState: false,
        newRightResultName: '',
        newErrorResultName: ''
    };

    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic],
        template: tpl,
        components: {},
        props: {
            visible: {
                type: Boolean,
                default: false
            }
        },
        data: function () {
            return dataModel;
        },
        watch: {
            visible : function(val) {
                //当影藏组件时清空当前数据
                if(!val) {
                    _.deepExtend(this.mainModel.vo, this.newVO());
                    this.mainModel.opType = "create";
                }
            },
            "mainModel.vo.attr2": function () {
                this._setFormRules();
            }
        },
        computed: {
            showValue1: function () {
                var attr2 = this.mainModel.vo.attr2;
                return attr2 === '2' || attr2 === '4' || attr2 === '5'
            },
            showValue2: function () {
                var attr2 = this.mainModel.vo.attr2;
                return attr2 === '5'
            },
            showValue3: function () {
                var attr2 = this.mainModel.vo.attr2;
                return attr2 === '1' || attr2 === '4' || attr2 === '5'
            },
            showValue5: function () {
                var attr2 = this.mainModel.vo.attr2;
                return attr2 === '3' || attr2 === '4' || attr2 === '5'
            },
            showValue6: function () {
                var attr2 = this.mainModel.vo.attr2;
                return attr2 === '6' ? false : true;
            }
        },
        methods: {
            newVO: newVO,
            _setFormRules: function () {
                var attr2 = this.mainModel.vo.attr2;

                this.mainModel.rules["riCheckItemParam.value3"] = [LIB.formRuleMgr.require("标准值")].concat(LIB.formRuleMgr.range(-9999, 9999, 2));

                if (attr2 === '4') {
                    this.mainModel.rules["riCheckItemParam.value3"] =[].concat(LIB.formRuleMgr.range(-9999, 9999, 2));
                    this.mainModel.rules["riCheckItemParam.value3"].push({
                        validator: function(rule, value, callback) {
                            if(value === ""){
                                return callback();
                            }
                            var value5 = dataModel.mainModel.vo.riCheckItemParam.value5;
                            var value1 = dataModel.mainModel.vo.riCheckItemParam.value1;
                            if(value5 && Number(value) <= Number(value5)) {
                                return callback(new Error("标准值必须大于最小值"))
                            }
                            if (value1 && Number(value) >= Number(value1)) {
                                return callback(new Error("标准值必须小于最大值"))

                            }
                            return callback();
                        }
                    })
                } else if (attr2 === '5') {
                    this.mainModel.rules["riCheckItemParam.value3"] =[].concat(LIB.formRuleMgr.range(-9999, 9999, 2));
                    this.mainModel.rules["riCheckItemParam.value3"].push({
                        validator: function(rule, value, callback) {
                            if(value === ""){
                                return callback();
                            }
                            var value4 = dataModel.mainModel.vo.riCheckItemParam.value4;
                            var value2 = dataModel.mainModel.vo.riCheckItemParam.value2;
                            if(value4 && Number(value) <= Number(value4)) {
                                return callback(new Error("标准值必须大于较小值"))
                            }
                            if (value2 && Number(value) >= Number(value2)) {
                                return callback(new Error("标准值必须小于较大值"))

                            }
                            return callback();
                        }
                    })
                }else if(attr2 === '6'){
                    // this.mainModel.vo.isQualifiedRemarkWrite = '0';
                }
            },

            toggleSelectWay: function (isRight) {
                if(isRight === '1') {
                    this.selectRight = !this.selectRight;
                    if(this.selectRight) {
                        this.newRightResultName = '';
                    }
                } else {
                    this.selectError = !this.selectError;
                    if(this.selectError) {
                        this.newErrorResultName = '';
                    }
                }
            },
            /**
             * 如果检查结果是输入的，则将输入的值赋给对应的变量，以防止表单验证通不过
             */
            beforeDoSave:function(){},
            doSave : function() {
                //当beforeDoSave方法明确返回false时,不继续执行doSave方法, 返回undefine和true都会执行后续方法
                if(this.beforeDoSave() === false) {
                    return;
                }
                var _this = this;
                this.$refs.ruleform.validate(function (valid){
                    if (valid) {
                        var data = {};
                        _.deepExtend(data, _this.mainModel.vo);
                        data.riCheckItemEquipmentStateRels = [];
                        data.riCheckResults = [];

                        // 处理是否读取现场参数值字段
                        data.isMeterReadingNeeded = Number(_this.isMeterReadingNeeded);

                        // 设备状态
                        _.forEach(data.equipmentStates, function (item) {
                            data.riCheckItemEquipmentStateRels.push({
                                equipmentState: item
                            })
                        });

                        // 巡检类型
                        data.riCheckTypes = _.map(data.riCheckTypes, function (item) {
                            return {id: item};
                        });

                        // 处理检查结果字段
                        if(!data.isMeterReadingNeeded) {
                            if(1/parseInt(data.rightResult) === Number.NEGATIVE_INFINITY) {
                                data.riCheckResults.push({
                                    name: _this.newRightResultName,
                                    isRight: '1',
                                    isDefault: '0'
                            })
                            } else {
                                data.riCheckResults.push({id: data.rightResult})
                            }
                            if(1/parseInt(data.wrongResult) === Number.NEGATIVE_INFINITY) {
                                data.riCheckResults.push({
                                    name: _this.newErrorResultName,
                                    isRight: '0',
                                    isDefault: '0'
                                })
                            } else {
                                data.riCheckResults.push({id: data.wrongResult})
                            }

                        }

                        data = _.omit(data, ['rightResult', 'wrongResult', 'equipmentStates']);
                        if(data.attr2 === '6'){
                            data.isQualifiedRemarkWrite = '0';
                        }
                        if(_this.operationtype === 'create') {
                            api.createRiCheckItem({id: _this.pointId}, data).then(function (res) {
                                LIB.Msg.success("保存成功");
                                _this.$emit("do-save");
                            })
                        } else if(_this.operationtype === 'update') {
                            api.updateRiCheckItem(data).then(function (res) {
                                LIB.Msg.success("保存成功");
                                _this.$emit("do-save");
                            })
                        }

                    }
                });
            },
            doShowRiCheckItemParamSelectModal: function () {
                this.selectModel.riCheckItemParamSelectModel.visible = true;
            },
            doSaveRiCheckItemParam: function (selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.riCheckItemParam = selectedDatas[0];
                }
            },
            _getTypes: function () {
                var _this = this;
                api.queryCheckTypes({curPage:1, pageSize: 100, disable: 0}).then(function (res) {
                    _this.checkTypes = res.data.list;
                })
            },
            _getResults: function (obj) {
                var setDefault = _.get(obj, "setDefault");
                var _this = this;
                api.queryResults({curPage:1, pageSize: 100, isRight: 1, disable: 0}).then(function (res) {
                    _this.rightResults = res.data.list;

                    // 设置默认值
                    var defaultResult = _.find(_this.rightResults, function (item) {
                        return item.isDefault === '1'
                    });
                    if(setDefault && defaultResult) {
                        _this.mainModel.vo.rightResult = defaultResult.id;
                    }
                });
                api.queryResults({curPage:1, pageSize: 100, isRight: 0, disable: 0}).then(function (res) {
                    _this.wrongResults = res.data.list;

                    // 设置默认值
                    var defaultResult = _.find(_this.wrongResults, function (item) {
                        return item.isDefault === '1'
                    });
                    if(setDefault && defaultResult) {
                        _this.mainModel.vo.wrongResult = defaultResult.id;
                    }
                })
            },

            _initCreate: function () {
                this.mainModel.vo = newVO();
                this.isMeterReadingNeeded = Boolean(Number(this.mainModel.vo.isMeterReadingNeeded));
                this._getResults({setDefault: true});
            },
            _initUpdate: function (item) {
                this._getResults({setDefault: false});
                var vo = newVO();
                _.deepExtend(vo, item);
                // 处理数据格式
                vo.riCheckTypes = _.map(vo.riCheckTypes, function (item) {
                    return item.id
                });
                _.forEach(vo.riCheckResults, function (item) {
                    if(!item) {
                        return;
                    }
                    if(item.isRight === '1') {
                        vo.rightResult = item.id
                    }
                    else if(item.isRight === '0') {
                        vo.wrongResult = item.id;
                    }
                });
                vo.equipmentStates = _.map(vo.riCheckItemEquipmentStateRels, function (item) {
                    return item.equipmentState
                })
                this.isMeterReadingNeeded = Boolean(Number(vo.isMeterReadingNeeded));
                this.mainModel.vo = vo;
            }
        },
        ready: function () {
        },
        events: {
            'do-point-item': function (type, pointId, pointType, item) {
                this.pointId = pointId;
                this.operationtype = type;
                this._getTypes();

                this.newRightResultName = '';
                this.newErrorResultName = '';

                if(pointType === '1') {
                    this.showEquipmentState = false
                } else {
                    this.showEquipmentState = true
                }

                if(type === 'create') {
                    this._initCreate();
                } else if(type === 'update') {
                    this._initUpdate(item)
                }
            }
        }
    });

    return detail;
});