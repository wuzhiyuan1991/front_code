define(function (require) {
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./riskIdentificationFormModal.html");
    var riskModel = require("views/basicSetting/basicFile/evaluationModel/dialog/riskModel");
    var equipmentTypeSelectModal = require("componentsEx/equipmentTypeSelectModal/equipmentTypeSelectModal");
    var equipmentTypeSelectModalMix = require("views/businessFiles/riskAssessment/riskIdentification/dialog/equipmentTypeSelectModal");
    var dominationAreaSelectModal = require("componentsEx/selectTableModal/dominationAreaSelectModal");

    var api = require("views/businessFiles/riskAssessment/riskIdentification/vuex/api");
    LIB.registerDataDic("contro_type", [
        ["1", "技术措施"],
        ["2", "管理措施"],
        ["5", "防护措施"],
    ]);
    //初始化数据模型
    var newVO = function () {
        return {
            //角色编码
            code: null,
            //禁用标识 0未禁用，1已禁用
            disable: "0",
            //活动产品服务
            activeProductService: null,
            //
            aftermathAnalyze: null,
            //变更管理
            changeManage: null,
            //风险管控单位 1:基层单位,2:二级单位,3:公司机关
            controlUnit: null,
            //事件学习
            eventLearn: null,
            //存在状态 1:正常,2:异常,3:紧急
            existenceState: "2",
            //存在时态 1:过去,2:现在,3:将来
            existenceTense: "2",
            //四色安全评价
            fourColorEvaluation: null,
            //危害因素成因
            hazardCause: null,
            //危害因素种类
            hazardType: null,
            //是否危险重要 0:否,1:是
            isImportantDanger: "0",
            //编号
            number: null,
            //其他活动
            otherActive: null,
            //涉及岗位
            position: null,
            //区域
            region: null,
            //备注
            remark: null,
            //剩余风险评价等级
            residualRiskLevel: null,
            //残余风险等级模型
            residualRiskModel: null,
            //风险评价等级
            riskLevel: null,
            //风险等级模型
            riskModel: null,
            //控制措施
            riskIdentifiContMeasures: [],
            //风险评价记录
            riskIdentificationEvals: [],
            compId: null,
            orgId: null,
            bizType: null,
            evaluMethod: null,
            //设备设施类型
            equipmentType: {
                id: '',
                name: ''
            },
            contMeasures: {
                type: "1",
                name: null,
            },
            // 设施设备
            equipment: []
        }
    };

    //Vue数据
    var dataModel = {
        mainModel: {
            controlUnit: [],
            vo: newVO(),
            opType: 'create',
            isReadOnly: false,
            title: "添加",

            //验证规则
            rules: {
                "compId": [{
                    required: true,
                    message: '请选择所属公司'
                }],
                "activeProductService": [{
                    required: true,
                    message: '请输入活动产品服务'
                }, LIB.formRuleMgr.length(200)],
                "aftermathAnalyze": [{
                    required: true,
                    message: '请输入后果分析'
                }, LIB.formRuleMgr.length(100)],
                "changeManage": [LIB.formRuleMgr.length(200)],
                "controlUnit": [{
                    required: true,
                    message: '请选择风险管控单位'
                }, LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
                "eventLearn": [LIB.formRuleMgr.length(1000)],
                "existenceState": [{
                    required: true,
                    message: '请选择存在状态'
                }, LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
                "existenceTense": [{
                    required: true,
                    message: '请选择存在时态'
                }, LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
                "fourColorEvaluation": [{
                    required: true,
                    message: '请选择四色安全评价'
                }, LIB.formRuleMgr.length(50)],
                "hazardCause": [{
                    required: true,
                    message: '请输入危害因素成因'
                }, LIB.formRuleMgr.length(500)],
                "hazardType": [{
                    required: true,
                    message: '请选择危害因素种类'
                }, LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty)],
                "isImportantDanger": [{
                    required: true,
                    message: '请选择是否重要危险'
                }, LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
                "number": [{
                    required: true,
                    message: '请输入编号'
                }, LIB.formRuleMgr.length(20)],
                "otherActive": [LIB.formRuleMgr.length(200)],
                "position": [{
                    required: true,
                    message: '请输入涉及岗位'
                }, LIB.formRuleMgr.length(50)],
                "region": [{
                    required: true,
                    message: '请输入区域'
                }, LIB.formRuleMgr.length(500)],
                "remark": [LIB.formRuleMgr.length(500)],
                "residualRiskLevel": [LIB.formRuleMgr.length(200)],
                "riskLevel": [{
                    required: true,
                    message: '请选择风险评价'
                }, LIB.formRuleMgr.length(200)],
                'evaluMethod': [{
                    required: true,
                    message: '请选择评估方法'
                }],
                'hseType': [{
                    required: true,
                    message: '请选择HSE类型'
                }],
                "contMeasures.name": [{
                    required: true,
                    message: '请输入控制措施内容'
                }, LIB.formRuleMgr.length(1000)],
                "contMeasures.type": [{
                    required: true,
                    message: '控制措施类型'
                }, LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),

            },
            emptyRules: {},
            disableEquipmentTypeChange: false,
        },
        selectModel: {
            equipmentTypeSelectModel: {
                visible: false
            },
            dominationAreaSelectModel: {
                visible: false,
                filterData: {orgId: null}
            },
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
        riskIdentifiContMeasuresFormModal: {
            dataType: 1,
            bizType: 2,
            type: null,
            name: null,
            bizItemType: "3",
            orderNo: 1,
            pool: {
                id: null
            }
        },
        typeList: null,
        isCreateByPool: false,
        newActiveProductServiceName: "",
        activeProductServiceList: [],
        aftermathAnalyzeList: [],
        newAftermathAnalyzeName: "",
        hazardTypeList: [],
        newHazardTypeName: "",
    };

    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
        template: tpl,
        components: {
            'riskModel': riskModel,
            'equipmentTypeSelectModal': equipmentTypeSelectModal,
            'equipmentTypeSelectModalMix': equipmentTypeSelectModalMix,
            "dominationareaSelectModal": dominationAreaSelectModal,
        },

        props: {
            equipmentType: {
                type: Object,
                default: {
                    id: '',
                    name: ''
                }
            },
            pool: {
                type: Object,
                default: {
                    id: ''
                }
            },
            type: {
                type: String,
                default: false
            }
        },
        data: function () {
            return dataModel;
        },
        computed: {
            displayTypeName: function () {
                var id = this.mainModel.vo.equipmentType.id;
                if (!id) {
                    return ''
                }
                if (this.mainModel.vo.equipmentType.attr4) {
                    return this.mainModel.vo.equipmentType.attr4;
                } else {
                    return this.mainModel.vo.equipmentType.name;
                }
            },
        },
        watch: {
            "mainModel.vo.equipmentType.id": function (nval, oval) {
                var _this = this;
                if (nval != oval && nval) {
                    _this.mainModel.vo.region = "";
                    api.selectEquipmentList({
                        'equipmentType.id': _this.mainModel.vo.equipmentType.id
                    }).then(function (res) {
                        if (res.data && res.data.length) {
                            _this.mainModel.vo.region = _.uniq(_.map(res.data, "dominationArea.name")).join(",");
                        }
                    })
                }
            }
        },
        methods: {
            newVO: newVO,
            doSaveDominationArea: function (datas) {
                // mainModel.vo.region
                var arr = _.pluck(datas, "name");
                var _this = this;
                _.each(arr, function (item) {
                    if(_this.mainModel.vo.region && _this.mainModel.vo.region){
                        if(_this.mainModel.vo.region.indexOf(item)==-1){
                            _this.mainModel.vo.region += ','+item
                        }
                    }else{
                        _this.mainModel.vo.region = item
                    }
                })
            },
            doShowDominationAreaSelectModal: function () {
                this.selectModel.dominationAreaSelectModel.visible = true;
                this.selectModel.dominationAreaSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
            },
            doShowEquipmentTypeModal: function () {
                this.selectModel.equipmentTypeSelectModel.visible = true;
            },
            doSaveEquipmentType: function (data) {
                this.mainModel.vo.equipmentType = data.equipmentType;
                if (data.equipment && data.equipment.length) {
                    this.mainModel.vo.equipment = _.map(data.equipment, function (item) {
                        return {
                            id: item.id
                        }
                    })
                } else {
                    this.mainModel.vo.equipment = []
                }
            },
            doSave: function () {
                var _this = this;
                var _vo = this.mainModel.vo;
                _vo.controlUnit = this.mainModel.controlUnit.join(",");
                _vo.riskLevel = this.riskModel.result;
                _vo.residualRiskLevel = this.residualRiskModel.result;
                _vo.riskModelId = this.riskModel.id;
                _vo.residualRiskModelId = this.residualRiskModel.id;
                if (!_vo.orgId) {
                    _vo.orgId = _vo.compId;
                }
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        if (1 / parseInt(_vo.activeProductService) === Number.NEGATIVE_INFINITY) {
                            _vo.activeProductService = _this.newActiveProductServiceName;
                        }
                        if (1 / parseInt(_vo.aftermathAnalyze) === Number.NEGATIVE_INFINITY) {
                            _vo.aftermathAnalyze = _this.newAftermathAnalyzeName;
                        }
                        if (1 / parseInt(_vo.hazardType) === Number.NEGATIVE_INFINITY) {
                            _vo.hazardType = _this.newHazardTypeName;
                        }
                        if (_this.mainModel.opType == "create") {
                            _this.mainModel.vo.id = null;
                            //隐患界面创建的数据
                            if (_this.pool.id && _vo.contMeasures.type && _vo.contMeasures.name) {
                                _this.riskIdentifiContMeasuresFormModal.type = _vo.contMeasures.type;
                                _this.riskIdentifiContMeasuresFormModal.name = _vo.contMeasures.name;
                                _this.riskIdentifiContMeasuresFormModal.pool.id = _this.pool.id;
                                _vo.riskIdentifiContMeasures.push(_this.riskIdentifiContMeasuresFormModal);
                            }
                            api.create(_.extend(_vo, {
                                riskModel: JSON.stringify(_this.riskModel)
                            }, {
                                residualRiskModel: JSON.stringify(_this.residualRiskModel)
                            })).then(function (res) {
                                _this.$emit("do-save", res, 'create');
                                LIB.Msg.info("保存成功");
                            });
                        } else {
                            var obj = _.extend(_vo, {
                                riskModel: JSON.stringify(_this.riskModel)
                            }, {
                                residualRiskModel: JSON.stringify(_this.residualRiskModel)
                            });
                            api.update(obj).then(function (res) {
                                _this.$emit("do-save", _vo, 'update');
                                LIB.Msg.info("修改成功");
                            });
                        }
                    } else {
                        return false;
                    }
                });
            },
            _init: function () {
                var _this = this;
                this.$refs.ruleform.resetFields();
                this.mainModel.controlUnit = ["1"];
                var cascadeDataDicList = LIB.getCascadeDataDicList('risk_biz_source_type', this.mainModel.vo.bizType);
                if (cascadeDataDicList && cascadeDataDicList.length > 0) {
                    _.each(cascadeDataDicList, function (item) {
                        if (item.value === 'LEC') {
                            _this.$nextTick(function () {
                                _this.mainModel.vo.evaluMethod = item.id;
                            })

                        }
                    })
                }
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
                dataModel.riskModel = {
                    id: null,
                    opts: [],
                    result: null
                };
                dataModel.residualRiskModel = {
                    id: null,
                    opts: [],
                    result: null
                };
                dataModel.riskIdentifiContMeasuresFormModal.type = null;
                dataModel.riskIdentifiContMeasuresFormModal.name = null;
                dataModel.newActiveProductServiceName = "";
                dataModel.activeProductServiceList = LIB.getDataDicList("active_product_service");
                dataModel.newAftermathAnalyzeName = "";
                dataModel.aftermathAnalyzeList = LIB.getDataDicList("aftermath_analyze");
                dataModel.hazardTypeList = LIB.getDataDicList("ira_risk_identification_hazardtype");
                dataModel.newHazardTypeName = "";

            },
            _initUpdate: function (id) {
                var _this = this,
                    _vo = this.mainModel.vo;
                this.mainModel.opType = "update";
                api.get({
                    id: id
                }).then(function (res) {
                    var data = res.data;
                    _.deepExtend(_vo, data);
                    var activeProductService = _.find(_this.activeProductServiceList, function (item) {
                        return data.activeProductService === item.id;
                    });
                    if (!activeProductService) {
                        _this.activeProductServiceList.push({
                            id: data.activeProductService,
                            value: data.activeProductService
                        })
                    }
                    var aftermathAnalyze = _.find(_this.aftermathAnalyzeList, function (item) {
                        return data.aftermathAnalyze === item.id;
                    });
                    if (!aftermathAnalyze) {
                        _this.aftermathAnalyzeList.push({
                            id: data.aftermathAnalyze,
                            value: data.aftermathAnalyze
                        })
                    }

                    var hazardType = _.find(_this.hazardTypeList, function (item) {
                        return data.hazardType === item.id;
                    });
                    if (!hazardType) {
                        _this.hazardTypeList.push({
                            id: data.hazardType,
                            value: data.hazardType
                        })
                    }
                    if (data.controlUnit) {
                        _this.mainModel.controlUnit = _this.mainModel.vo.controlUnit.split(',');
                    }

                    if (data.riskModel) {
                        dataModel.riskModel = JSON.parse(data.riskModel);
                    }
                    if (data.residualRiskModel) {
                        dataModel.residualRiskModel = JSON.parse(data.residualRiskModel);
                    }
                });
            },
            _initCreate: function () {
                this.mainModel.opType = "create";
                this.mainModel.vo.compId = LIB.user.compId;
                if (this.pool.id) {
                    this.mainModel.vo.bizType = "3";
                }
                if (this.$route.query.bizType == '2') {
                    var _this = this;
                    api.selectMaxNo({
                        prefix: 'EAM-'
                    }).then(function (res) {


                        if (res.data) {
                            _this.mainModel.vo.number = res.data;
                        }
                    })
                }

            },
            doClearRiskModel: function () {
                this.residualRiskModel = {
                    id: null,
                    opts: [],
                    result: null
                };
            },
            _getTypeList: function () {
                var _this = this;
                api.getTypeList().then(function (res) {
                    _this.typeList = res.data;
                    if (_this.equipmentType && _this.equipmentType.id) {
                        var equipmentType = _.find(_this.typeList, "id", _this.equipmentType.id);
                        _.deepExtend(_this.mainModel.vo.equipmentType, {
                            id: equipmentType.id,
                            name: equipmentType.name
                        });
                    }
                })
            },
            disableEquipmentType: function (id) {
                var _this = this;
                api.queryRiskIdentifiContMeasures({
                    id: id,
                    pageNo: 1,
                    pageSize: 1
                }).then(function (res) {
                    if (res.data && res.data.list && res.data.list.length > 0) {
                        _this.mainModel.disableEquipmentTypeChange = true;
                    } else {
                        _this.mainModel.disableEquipmentTypeChange = false;
                    }
                })
            },
        },
        events: {
            "ev_editReload": function (nVal) {
                this._init();
                this.isCreated = true;
                //存在nVal则是update
                if (nVal) {
                    this.isInit = true;
                    this._initUpdate(nVal);
                    this.disableEquipmentType(nVal);
                } else {
                    var bizType = this.$route.query.bizType;
                    if (bizType) {
                        this.mainModel.vo.bizType = bizType;
                    } else {
                        this.mainModel.vo.bizType = "1";
                    }
                    this._initCreate();
                }
            }
        },
        created: function () {
            this._getTypeList();
        }
    });

    return detail;
});