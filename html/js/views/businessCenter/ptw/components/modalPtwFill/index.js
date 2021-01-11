define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("../../workCard/vuex/api");
    var tpl = LIB.renderHTML(require("text!./index.html"));
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var selTplModal = require("../modal-sel-cardtpl");
    var ptwFill = require("../ptw_info/main");
    var commonApi = require("../../api");
    var workCardApi = require("../../workCard/vuex/api");
    var modelContactPtw = require("./contactPtw/contactPtw");
    var contactTip = require("./contactPtw/contactTip");
    var model = require("../../model");
    var vm = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        template: tpl,
        components: {
            "userSelectModal": userSelectModal,
            "selTplModal": selTplModal,
            "ptwFill": ptwFill,
            "modelContactPtw": modelContactPtw,
            "contactTip": contactTip,
        },
        props: {
            disabled: {//作业类是否启用选择
                // type:Boolean,
                default: false,
            },
        },
        watch: {
            show: function (val) {
                this.$broadcast('changeShowSelect', val);
                if (!val) {
                    if (this.pms.seledTpl && this.enableReservation) {//取消的需要清除cardtpl
                        this.$parent.clearTplOrder();
                    }
                    this.load = false;
                }
            }
        },
        data: function () {
            return {
                pms: {},//init传过来的数据
                load: false,
                show: false,
                model: model.cardTpl(),
                permitModel: model.permitDetail(),
                enableReservation: undefined,
                mainModelVo: {},
                changeTpl: false,
                selTplModel: {
                    show: false
                },
                poptipShow: false,
                tableModel: {
                    contactPtw: LIB.Opts.extendDetailTableOpt({
                        columns: [{
                            title: "序号",
                            fieldType: "sequence",
                            width: 70,
                        },
                        {
                            title: "安全评价单位",
                            fieldName: "evaluateUnit",
                        },
                        {
                            title: "安全评价单位",
                            fieldName: "evaluateUnit",
                        },
                        ],
                        values: [],
                    })
                },
            }
        },
        methods: {
            doUpdateContact: function () {
                this.$refs.contactTip.loadContactData();
            },
            doSetContact: function () {
                this.$refs.contactPtw.init(this.mainModelVo);
            },
            loadContactData: function () {
                var _this = this;
                workCardApi.queryWorkCardRelations({ id: this.mainModelVo.id }).then(function (res) {
                    _this.tableModel.contactPtw.values = res.data;
                })
            },
            showBox: function () {
                if (!this.load) {
                    this.load = true;
                }
                this.show = true;
            },
            init: function (model, permitModel, enableReservation, mainModelVo, pms) {
                var _this = this;
                this.pms = pms || {};
                this._handleInitData(model, permitModel);
                if (!this.load) {
                    this.load = true;
                }
                if (enableReservation) {
                    this.enableReservation = enableReservation == 1;
                }
                if (mainModelVo) {
                    this.mainModelVo = mainModelVo;
                }
                this.$nextTick(function () {
                    _this.$refs.ptwFill.init(model, permitModel, pms);
                    _this.show = true;
                });
                if (pms.type != 'create') {
                    this.loadContactData();
                }
                LIB.globalLoader.hide()
            },
            _handleInitData: function (model, permitModel) {
                this.model = model;
                this.permitModel = permitModel;
            },
            doChangeTpl: function () {
                var pms = {
                    workLevelId: this.permitModel.workLevelId,
                    workCatalogId: this.permitModel.workCatalog.id,
                    disabled: this.enableReservation,
                    id: this.permitModel.cardTplId
                };
                this.selTplModel.show = true;
                this.changeTpl = true;
                this.$refs.selTplModal.init(pms);
            },
            doSelectedTpl: function (item) {
                var _this = this;
                workCardApi.tplDetail(item.tplId).then(function (data) {
                    // var _model = model.cardTpl();
                    var _model = _.extend({}, _this.model, model.cardTpl(), data);
                    _this._changeTplReset();
                    model.permitHandler(_this.permitModel, _model, true, true);
                    delete _this.permitModel.workTpl;
                    LIB.globalLoader.hide()
                    //var permitModel = model.permitDetail();
                    _this.permitModel.cardTpl.id = item.tplId;
                    _this.permitModel.cardTpl.name = item.tplName;
                    _this.permitModel.cardTplId = item.tplId;
                    _this.permitModel.workCatalog.id = item.workCardCatalogId;
                    _this.permitModel.workLevelId = item.workLevelId;
                    _this.changeTpl = false;

                    _this.permitModel.pms.requiredJSA = true;
                    _this.permitModel.cardTpl.id = item.tplId;
                    _this.permitModel.workCatalog.id = item.workCardCatalogId;
                    _this.permitModel.workLevelId = item.workLevelId;
                    _this.permitModel.enableOperatingType = item.enableOperatingType; // enableSuperviseRecord
                    _this.permitModel.enableSuperviseRecord = item.enableSuperviseRecord;
                    _this.permitModel.enableSafetyEducator = item.enableSafetyEducator;
                    _this.permitModel.extensionType = item.extensionType;
                    _this.permitModel.extensionTime = item.extensionTime;
                    _this.permitModel.extensionUnit = item.extensionUnit;
                    _this.permitModel.gasDetectionRoleId = _model.gasDetectionRoleId;
                    _this.permitModel.enableGasDetection = _model.enableGasDetection;
                    _this.permitModel.enableGasDetectionSigner = _model.enableGasDetectionSigner;

                    _this.permitModel.enableCtrlMeasureRemark = _model.enableCtrlMeasureRemark;
                    _this.permitModel.enableCtrlMeasureSign = _model.enableCtrlMeasureSign;
                    _this.permitModel.enableCtrlMeasureGroup = _model.enableCtrlMeasureGroup;
                    _this.permitModel.enableCtrlMeasureVerifier = _model.enableCtrlMeasureVerifier;
                    _this.permitModel.enableUncheckedMeasureSign = _model.enableUncheckedMeasureSign;
                    _this._handleInitData(_model, _this.permitModel);
                    _this.$refs.ptwFill.changeTpl(_model);

                });
            },
            _changeTplReset: function () {
                this.permitModel.workStuffs = [];
                this.permitModel.tempWorkStuffs = {//用来缓存workSutff 的，保存的时候将这里面的合并
                    equipmentList: [],
                    certificateList: [],
                    weihaibsList: [],
                    kongzhicsList: [],
                    ppes: [],
                    gas: [],
                    operateList: []
                };
                this.permitModel.workIsolations.forEach(function (item) {

                    if (item.isolators) { item.isolators = []; }
                    if (item.disisolators) { item.disisolators = []; }
                })
                this.permitModel.workPersonnels = this.permitModel.workPersonnels.filter(function (item) {
                    return ["8", "9", "10"].indexOf(item.type) === -1;
                })
                // this.permitModel.workPersonnels=[];
                _.extend(this.permitModel, {
                    enableMechanicalIsolation: "0",
                    enableProcessIsolation: "0",
                    enableElectricIsolation: "0",
                    enableSystemMask: "0",
                    gasCheckType: "1",
                    //作业中定期气体检测频率
                    gasCheckCycle: null,
                    //作业中定期气体检测频率单位 1:小时,2:分钟
                    gasCheckCycleUnit: "1",
                    //气体检测方式 1:不按照部位检查,2:按照部位检查
                    gasCheckMethod: "1",
                    //作业中定期气体检测到期提醒提前分钟数
                    gasCheckNoticeTime: null,
                    //气体检查部门  1：上部 2：中部 3：下部
                    gasCheckPosition: [],
                    enableGasDetection: "0",
                    gasInspector: { id: '', name: '' },
                })
            },
            doSaveUser: function (selectedDatas) {
                if (selectedDatas) {
                    var user = selectedDatas[0];
                    _.extend(this.formOrder.auditor, {
                        id: user.id,
                        name: user.name
                    })
                }
            },
            doFillSubmit: function () {
                var _this = this;
                this.$broadcast("setInputValue");
                var errMsg = model.valiSubmitPermit(this.permitModel, this.model);
                if (errMsg) {
                    LIB.Msg.error(errMsg, 4);
                    return;
                }
                var data = model.getPermitDetail(this.permitModel, this.model);
                api.submitWorkPermit(data).then(function (result) {
                    LIB.Msg.success("提交成功", 1, function () {
                        _this.show = false;
                        if (_this.$parent.detailModel) { _this.$parent.detailModel.show = false; }
                        setTimeout(function () {
                            _this.$router.go("/ptw/businessCenter/ptwFinish");
                        }, 500)
                    });
                })
            },
            doFillSave: function () {
                var _this = this;
                this.$broadcast("setInputValue");
                var errMsg = model.valiSavePerimit(this.permitModel, this.model);
                if (errMsg) {
                    LIB.Msg.error(errMsg, 4);
                    return;
                }
                var data = model.getPermitDetail(this.permitModel, this.model);
                api.saveWorkPermit(data).then(function (result) {
                    LIB.Msg.success("保存成功");
                    _this.$dispatch("ev_dtUpdate");
                    _this.$dispatch("ev_dtClose");
                    if (!_this.permitModel.id) {
                        _this.permitModel.id = result.data.id;
                    }
                    _this.pms.seledTpl = false;
                    _this.$parent.$refs.detailPanel.refreshPwtInfoView();
                    // _this.permitModel.workTpl = result.data.workTpl;  // 有workTple就存在
                    _this.permitModel.workPersonnels = [];
                    _this.permitModel.workTpl = result.data.workTpl;

                    // 保存过后就要设置id
                    var signRoles = _this.permitModel.signRoles;
                    _.each(result.data.workPersonnels, function (item) {
                        if (item && item.type == '1') {
                            var obj = _.find(signRoles, function (roles) {
                                return roles.id == item.attr2 || roles.attr2 == item.attr2;
                            });
                            if (obj) {
                                obj.id = item.id;
                                obj.attr2 = item.attr2;
                            }
                        }
                    })
                    var groupList = _.filter(result.data.workStuffs, function (item) {
                        return item.stuffType == '4'
                    });
                    _this.permitModel.tempWorkStuffs.kongzhicsList = _.map(groupList, function (item) {
                        var pms = {
                            id: item.stuffId,
                            type: item.gasCatalog ? "4" : item.stuffType,//4 是为了查询其气体的接口
                            ppeCatalogId: item.ppeCatalogId,
                            gasType: item.gasCatalog ? item.gasCatalog.gasType : undefined,
                            name: item.gasCatalog ? item.gasCatalog.name : (item.ptwStuff ? item.ptwStuff.name : (item.name || '')),
                            attr1: item.attr1 || "0"
                        };
                        if (item.children && item.stuffType == '4') {
                            pms.children = item.children;
                            pms.name = item.name;
                            pms.id = item.id;
                            pms.type = 4;
                        }
                        return pms;
                    });

                    _.each(_this.permitModel.groupItemModel.list, function (item) {
                        var obj = _.find(groupList, function (group) {
                            return item.id == group.id || item.id == group.stuffId;
                        });
                        if (obj) { item.id = obj.id }
                    })
                })
            },
            doCancel: function () {
                this.show = false;
            }
        },
        init: function () {
            var _this = this;
        },
        created: function () {


        },
    });

    return vm;
});
