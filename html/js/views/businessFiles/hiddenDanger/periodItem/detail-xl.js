define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");
    var risktypeSelectModal = require("componentsEx/selectTableModal/risktypeSelectModal");
    var riskModel = require("views/basicSetting/basicFile/evaluationModel/dialog/riskModel");
    var checkMethodSelectModal = require("componentsEx/selectTableModal/checkMethodSelectModal");
    var accidentCaseSelectModal = require("componentsEx/selectTableModal/accidentCaseSelectModal");
    // var checkBasisSelectModal = require("componentsEx/selectTableModal/checkBasisSelectModal");

    var checkBasisSelectModal = require("componentsEx/checkBasisSelectModal/checkBasisSelectModal");

    var checkMethodFormModal = require("componentsEx/formModal/checkMethodFormModal");
    var accidentCaseFormModal = require("componentsEx/formModal/accidentCaseFormModal");
    var checkBasisFormModal = require("componentsEx/checkBasisSelectModal/checkBasisFormModal");
    //初始化数据模型
    var newVO = function () {
        return {
            //ID
            id: null,
            //
            code: null,
            //检查项名称
            name: null,
            //类型 0 行为类   1 状态类  2 管理类
            type: null,
            //
            compId: null,
            //组织id
            orgId: null,
            //是否禁用，0启用，1禁用
            disable: "0",
            //是否被使用 0：未使用 1已使用
            isUse: null,
            //备注
            remarks: null,
            //修改日期
            modifyDate: null,
            //创建日期
            createDate: null,
            //检查分类
            riskType: {id: '', name: ''},
            //设备设施
            equipment: {id: '', name: ''},
            //检查项来源标识 0转隐患生成 1危害辨识生成  2手动生成
            category: "2",
            equipmentId: null,
            riskModelId: null,
            riskModel: null,
            hiddenDangerType:null,
            hiddenDangerLevel:null,
            bizType:'job'
        }
    };
    //风险等级模型选择对象
    var newRiskModel = function () {
        return {
            id: null,
            opts: [],
            latId: null,
            result: null
        };
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "",
            riskModel: newRiskModel,
            //验证规则
            rules: {
                //"code":[LIB.formRuleMgr.require("编码")]
                "code": [
                    LIB.formRuleMgr.require(""),
                    LIB.formRuleMgr.length()
                ],
                "name": [
                    LIB.formRuleMgr.require("检查项内容"),
                    LIB.formRuleMgr.length(500)
                ],
                "riskModel": [
                    {
                        required: true,
                        validator: function (rule, value, callback) {
                            var errors = [];
                            var riskModel = JSON.parse(value);
                            if (_.isNull(riskModel) || _.isNull(_.propertyOf(riskModel)("id"))) {
                                errors.push("请选择风险等级");
                            }
                            callback(errors);
                        }
                    }
                ],
                "type": [
                    {required: true, message: '请选择类型'},
                    LIB.formRuleMgr.length()
                ],
                "disable": [
                    {required: true, message: '请选择状态'},
                    LIB.formRuleMgr.length()
                ],
                //"riskType.id": [{required: true, message: '请选择风险分类'},
                //	LIB.formRuleMgr.length()
                //],
                "compId": [
                    {required: true, message: '请选择所属公司'},
                    LIB.formRuleMgr.length()
                ],
                "category": [LIB.formRuleMgr.length()],
                "disable": [LIB.formRuleMgr.length()],
                "isUse": [LIB.formRuleMgr.length()],
                "remarks": [LIB.formRuleMgr.length()],
                "modifyDate": [LIB.formRuleMgr.length()],
                "createDate": [LIB.formRuleMgr.length()],
                "hiddenDangerType":[LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
                "hiddenDangerLevel":[LIB.formRuleMgr.allowStrEmpty].concat(LIB.formRuleMgr.allowStrEmpty)
            }
        },
        tableModel: {
            checkMethodTableModel: LIB.Opts.extendDetailTableOpt({
                url: "checkitem/checkmethods/list/{curPage}/{pageSize}",
                columns: [
                    LIB.tableMgr.ksColumn.code,
                    {
                        title: "名称",
                        fieldName: "name"
                    },
                    {
                        title: "",
                        fieldType: "tool",
                        toolType: "edit,del"
                    }
                ]
            }),
            checkAccidentTableModel:  LIB.Opts.extendDetailTableOpt({
                url: "checkitem/accidentcases/list/{curPage}/{pageSize}",
                columns: [
                    LIB.tableMgr.ksColumn.code,
                    {
                        title: "内容说明",
                        fieldName: "name"
                    }, {
                        title: "",
                        fieldType: "tool",
                        toolType: "edit,del"
                    }]
            }),
            checkBasisTableModel: LIB.Opts.extendDetailTableOpt({
                url: "checkitem/legalregulations/list/{curPage}/{pageSize}",
                columns: [
                    {
                        title: "所属规范",
                        fieldType: "custom",
                        render: function (data) {
                            if (data.topType) {
                                return data.topType.name;
                            }

                        }

                    },
                    {
                        title: "依据内容",
                        fieldName: "name"

                    },
                    // {
                    //     title: "内容说明",
                    //     fieldName: "content"
                    // },
                    {
                        title: "",
                        fieldType: "tool",
                        toolType: "edit,del"
                    }
                ]
            })
        },
        formModel: {
            checkMethodFormModal:{
                show:false,
                queryUrl:'checkmethod/{id}'
            },
            accidentCaseFormModal:{
                show:false,
                queryUrl:'accidentcase/{id}'
            },
            checkBasisFormModal:{
                show:false,
                queryUrl:'legalregulation/{id}'
            }
        },
        cardModel: {
            checkMethodCardModel: {
                showContent: true
            },
            checkBasisTableModel: {
                showContent: true
            },
            checkAccidentcaseTableModel: {
                showContent: true
            }
        },
        riskTypeList: null,
        selectedDatas: [],
        //riskTypeId:null,
        riskTypeName: null,
        selectModel: {
            risktypeSelectModel: {
                visible: false
            },
            checkMethodSelectModel: {
                visible: false
            },
            accidentCaseSelectModel: {
                visible: false
            },
        },
       checkBasis: {
           visible: false,
           filterData: null
       }
    };
    //Vue组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *    el
     template
     components
     componentName
     props
     data
     computed
     watch
     methods
     events
     vue组件声明周期方法
     created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
        template: tpl,
        components: {
            "risktypeSelectModal": risktypeSelectModal,
            'riskModel': riskModel,
            "checkmethodSelectModal": checkMethodSelectModal,
            "accidentCaseSelectModal": accidentCaseSelectModal,
            "checkBasisSelectModal": checkBasisSelectModal,
            "checkMethodFormModal":checkMethodFormModal,
            "accidentCaseFormModal":accidentCaseFormModal,
            "checkBasisFormModal":checkBasisFormModal
        },
        data: function () {
            return dataModel;
        },

        computed: {
            //资源池
            type: function () {
                var edu = this.mainModel.vo.type;
                if (edu == 0) {
                    return "行为类";
                } else if (edu == 1) {
                    return "状态类";
                } else if (edu == 2) {
                    return "管理类";
                }
            }
        },
        methods: {
            newVO: newVO,
            doClearInput: function () {
                this.mainModel.vo.equipment.id = "";
            },
            doShowRisktypeSelectModel: function (param) {
                this.selectModel.risktypeSelectModel.visible = true;
            },
            doShowCheckMethodSelectModel: function (param) {
                this.selectModel.checkMethodSelectModel.visible = true;
            },
            doShowCheckMethodFormModel: function () {
                this.formModel.checkMethodFormModal.show = true;
                this.$refs.checkMethodFormModal.init("create");
            },
            doShowAccidentCaseFormModel: function () {
                this.formModel.accidentCaseFormModal.show = true;
                this.$refs.accidentCaseFormModal.init("create");
            },
            doShowCheckBasisFormModel: function () {
                this.formModel.checkBasisFormModal.show = true;
                this.$refs.checkBasisFormModal.init("create");
            },
            doShowCheckMethodFormModal4Update: function (param) {
                this.formModel.checkMethodFormModal.show = true;
                this.$refs.checkMethodFormModal.init("update", {id: param.entry.data.id});
            },
            doShowCheckBasisFormModal4Update: function (param) {
                this.formModel.checkBasisFormModal.show = true;
                this.$refs.checkBasisFormModal.init("update", {id: param.entry.data.id});
            },
            doShowAccidentCaseFormModal4Update: function (param) {
                this.formModel.accidentCaseFormModal.show = true;
                this.$refs.accidentCaseFormModal.init("update", {id: param.entry.data.id});
            },
            doShowAccidentCaseSelectModel: function (param) {
                this.selectModel.accidentCaseSelectModel.visible = true;
            },
            doShowCheckBasisSelectModel: function () {
                this.checkBasis.visible = true;
            },
            doSaveRisktype: function (selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.riskType = selectedDatas[0];
                }
            },
            doSaveCheckMethods: function (selectedDatas) {
                if (selectedDatas) {
                    var _this = this;
                    api.saveCheckMethods({id: dataModel.mainModel.vo.id}, selectedDatas).then(function () {
                        _this.refreshTableData(_this.$refs.checkmethodTable);
                    });
                }
            },
            doSaveCheckMethod: function (data) {
                if (data) {
                    var _this = this;
                    data.orgId = data.compId;
                    api.createCheckMethod({id: dataModel.mainModel.vo.id}, data).then(function () {
                        _this.refreshTableData(_this.$refs.checkmethodTable);
                    });
                }
            },
            doUpdateCheckMethod: function (data) {
                if (data) {
                    var _this = this;
                    api.updateCheckMethod(data).then(function () {
                        _this.refreshTableData(_this.$refs.checkaccidentcaseTable);
                    });
                }
            },
            doSaveAccidentCase: function (data) {
                if (data) {
                    var _this = this;
                    data.orgId = data.compId;
                    api.createAccidentCase({id: dataModel.mainModel.vo.id}, data).then(function () {
                        _this.refreshTableData(_this.$refs.checkaccidentcaseTable);
                    });
                }
            },
            doUpdateAccidentCase: function (data) {
                if (data) {
                    var _this = this;
                    api.updateAccidentcase(data).then(function () {
                        _this.refreshTableData(_this.$refs.checkaccidentcaseTable);
                    });
                }
            },
            doSaveCheckBasis: function (data) {
                if (data) {
                    var _this = this;
                    api.createCheckBasis({id: dataModel.mainModel.vo.id}, data).then(function () {
                        _this.refreshTableData(_this.$refs.checkbasisTable);
                    });
                }
            },
            doUpdateCheckBasis: function (data) {
                if (data) {
                    var _this = this;
                    api.updateLegalregulation(data).then(function () {
                        _this.refreshTableData(_this.$refs.checkaccidentcaseTable);
                    });
                }
            },
            // doSaveCheckBasis: function (selectedDatas) {
            //     if (selectedDatas) {
            //         var _this = this;
            //         api.saveCheckBasis({id: dataModel.mainModel.vo.id}, selectedDatas).then(function () {
            //             _this.refreshTableData(_this.$refs.checkbasisTable);
            //         });
            //     }
            // },
            doSaveAccident: function (selectedDatas) {
                if (selectedDatas) {
                    var _this = this;
                    api.saveAccident({id: dataModel.mainModel.vo.id}, selectedDatas).then(function () {
                        _this.refreshTableData(_this.$refs.checkaccidentcaseTable);
                    });
                }
            },
            doRemoveCheckMethods: function (item) {
                var _this = this;
                var data = item.entry.data;
                api.removeCheckMethods({id: this.mainModel.vo.id}, [{id: data.id}]).then(function () {
                    _this.$refs.checkmethodTable.doRefresh();
                });
            },
            afterInitData: function () {
                // this.$refs.checkmethodTable.doQuery({id: this.mainModel.vo.id});
                // this.$refs.checkbasisTable.doQuery({id: this.mainModel.vo.id});
                // this.$refs.checkaccidentcaseTable.doQuery({id: this.mainModel.vo.id});
                var _this = this;
                //设置风险等级模型选择对象
                if (this.mainModel.vo.riskModel) {
                    this.mainModel.riskModel = JSON.parse(this.mainModel.vo.riskModel);
                }

                //todo 暂时性的优化
                _this.riskTypeName = "";
                if (_.isEmpty(_this.riskTypeList)) {
                    api.listTableType().then(function (res) {
                        _this.riskTypeList = res.data;
                        _.each(_this.riskTypeList, function (item) {
                            if (_this.mainModel.vo.riskType.id === item.id) {
                                _this.riskTypeName = item.name;
                            }
                        });
                    });
                } else {
                    _.each(_this.riskTypeList, function (item) {
                        if (_this.mainModel.vo.riskType.id === item.id) {
                            _this.riskTypeName = item.name;
                        }
                    });
                }
            },
            beforeDoSave: function () {
                this.mainModel.vo.riskModel = JSON.stringify(this.mainModel.riskModel);
                this.mainModel.vo.orgId = this.mainModel.vo.compId;
            },
            afterDoSave: function (type) {
                //if(type.type="C"){
                this.mainModel.isReadOnly = false;
                var _this = this;
                _this.riskTypeName = "";
                _.each(_this.riskTypeList, function (item) {
                    if (_this.mainModel.vo.riskType.id === item.id) {
                        _this.riskTypeName = item.name;
                    }
                });
            },
            delCheckMethod: function (item) {
                var _this = this;
                var data = item.entry.data;
                LIB.Modal.confirm({
                    title: '确定删除数据?',
                    onOk: function () {
                        api.removeCheckMethods({id: _this.mainModel.vo.id}, [{id: data.id}]).then(function (res) {
                            _this.$refs.checkmethodTable.doRefresh();
                        });
                    }
                });

            },
            delCheckBasis: function (item) {
                var _this = this;
                var data = item.entry.data;
                LIB.Modal.confirm({
                    title: '确定删除数据?',
                    onOk: function () {
                        api.removeLegalregulation({id: _this.mainModel.vo.id}, [{id: data.id}]).then(function (res2) {
                            _this.$refs.checkbasisTable.doRefresh();
                        });
                    }
                });
            },
            delAccidentCase: function (item) {
                var _this = this;
                var data = item.entry.data;
                LIB.Modal.confirm({
                    title: '确定删除数据?',
                    onOk: function () {
                        api.removeAccidentCase({id: _this.mainModel.vo.id}, [{id: data.id}]).then(function (res2) {
                            _this.$refs.checkaccidentcaseTable.doRefresh();
                        });
                    }
                });

            },
            delEquipment: function (item) {
                var _this = this;
                var data = item.entry.data;
                api.removeEquipment({id: this.mainModel.vo.id}, [{id: data.id}]).then(function (res2) {
                    _this.$refs.checkaccidentcaseTable.doRefresh();
                });
            },
            beforeInit: function (data, opType) {
                // this.$refs.checkmethodTable.doClearData();
                // this.$refs.checkbasisTable.doClearData();
                // this.$refs.checkaccidentcaseTable.doClearData();
                this.selectedDatas = [];
                this.mainModel.riskModel = newRiskModel();
                if (opType.opType === 'create') {
                    //api.listTableType().then(function (res) {
                    //	dataModel.riskTypeList = res.data;
                    //});
                    //todo 暂时性的优化
                    var _this = this;
                    var t = setTimeout(function () {
                        clearTimeout(t);
                        if (_this.$parent.show) {
                            api.listTableType({bizType:"job"}).then(function (res) {
                                _this.riskTypeList = res.data;
                            });
                        }
                    }, 800);
                }
                if (opType.opType === "update" && this.mainModel.vo.riskType.id) {
                    this.selectedDatas.push(this.mainModel.vo.riskType);
                }
            },
            //编辑
            afterDoEdit: function () {
                //检查项分类
                this.selectedDatas.push(this.mainModel.vo.riskType);

            },
            doSaveLegalRegulations: function (selectedDatas) {
                if (selectedDatas) {
                    var param = _.map(selectedDatas, function (data) {
                        return {id: data.id}
                    });
                    var _this = this;
                    api.saveLegalregulations({id: dataModel.mainModel.vo.id}, param).then(function () {
                        _this.refreshTableData(_this.$refs.checkbasisTable);
                    });
                }
            },
            // doRiskInfo: function () {
            //     var _this = this;
            //     var _vo = this.mainModel.vo;
            //      if (_vo.riskAssessmentId) {
            //          api.getRiskAssessment({id:_vo.riskAssessmentId}).then(function (res) {
            //             //根据危害辨识类型进行跳转
            //              setTimeout(function(){
            //              var routerPart="/riskAssessment/businessFiles/xbgdRiskAssessment?method=select&id="+_vo.riskAssessmentId+"&code="+res.data.code;
            //              _this.$router.go(routerPart);
            //              }, 400);
            //          });
            //      } else {
            //          LIB.Msg.info("该检查项没有风险信息");
            //      }
            // },
            doRiskInfo: function () {
                var _this = this;
                var _vo = this.mainModel.vo;
                if (!_vo.riskAssessmentId) {
                    LIB.Msg.info("该工作项没有风险信息");
                    return;
                }
                var routerPart = "/riskAssessment/businessFiles/allRiskIdentification";
                api.getRiskIdentification({id: _vo.riskAssessmentId}).then(function (res) {
                    //根据危害辨识类型进行跳转
                    var router = LIB.ctxPath("/html/main.html#!");
                    routerPart = routerPart + "?method=detail&id=" + _vo.riskAssessmentId + "&code=" + res.data.code;
                    // window.open(router + routerPart);
                    setTimeout(function () {
                        _this.$router.go(routerPart);
                    }, 400);
                });
            }
        },
        init: function () {
            this.$api = api;
        },
    });

    return detail;
});