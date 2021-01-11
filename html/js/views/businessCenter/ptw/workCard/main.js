define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var selTplModal = require("../components/modal-sel-cardtpl");
    var commonApi = require("../api");
    var pwtFill = require("../components/ptw_info/main");
    var model = require("../model");
    var Validate = require("components/async-validator/index");
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"
    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");//修改 detailPanelClass : "large-info-aside"

    //Legacy模式
//	var ptwWorkCardFormModal = require("componentsEx/formModal/ptwWorkCardFormModal");

    LIB.registerDataDic("iptw_work_card_enable_reservation", [
        ["0", "否"],
        ["1", "是"]
    ]);

    LIB.registerDataDic("iptw_work_card_audit_result", [
        ["1", "通过"],
        ["2", "不通过"]
    ]);


    var vm = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        //Legacy模式
//		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainLegacyPanel],
        template: tpl,
        components: {
            "userSelectModal": userSelectModal,
            "selTplModal": selTplModal,
            "pwtFill": pwtFill,
        },
        data: function () {
            return {
                moduleCode: "ptwWorkCard",
                title: "作业票预约",
                enableOrder: 0,//是否开启了预约
                workCatalogList: [],
                selectedWorLevelId: "",
                selWorkCatalogIndex: 0,
                dateRange: [],//预约里面的作业开始介素时间
                showUserSelectModal: false,
                formOrder: {
                    workStartTime: null,
                    workEndTime: null,
                    workLevel: {id: ''},
                    workCatalog: {id: ''},
                    workPlace: null,
                    workEquipment: null,
                    workContent: null,
                    enableReservation: "1",
                    auditor: {id: '', name: ''},
                },
                tplModel: model.cardTpl(),
                permitModel: model.permitDetail(),


            }
        },
        computed: {
            currentWorkCatalog: function () {
                return this.workCatalogList[this.selWorkCatalogIndex];
            }
        },
        methods: {
            doSaveUser: function (selectedDatas) {
                if (selectedDatas) {
                    var user = selectedDatas[0];
                    _.extend(this.formOrder.auditor, {
                        id: user.id,
                        name: user.name
                    })
                }
            },
            doSelectedTpl: function (item) {
                var _this = this;
                api.tplDetail(item.tplId).then(function (data) {
                    _this.tplModel = data;
                    _this.permitModel.cardTpl.id = item.tplId;
                    _this.permitModel.workCatalog.id = item.workCardCatalogId;
                    _this.permitModel.workLevelId = item.workLevelId;

                    if (_this.enableOrder !== false) {
                        _this.enableOrder = false;
                        _this.title = "作业票填报";
                    }
                });

            },
            //预约提交
            doFormOrderSubmit: function () {
                var _this = this;

                // var formOrderVali = new Validate({
                //     workStartTime: {required: true, message: "请选择作业时间"},
                //     workEndTime: {
                //         test:function(){
                //             debugger;
                //             return false;
                //         },
                //         // validator:function () {
                //         //     return false;
                //         //     // var data = arguments[3];
                //         //     // var  m= !(_this.currentWorkCatalog.levelList && _this.currentWorkCatalog.levelList.length > 1 && !data.workLevel.id)
                //         //     // debugger;
                //         //     // return m;
                //         // },
                //         message: "请选择作业等级"
                //     },
                //     workPlace: {required: true, range: {max: 200}, message: "请填写作业地点,且不要超过200个字符"},
                //
                //     auditor: {id: {required: true, message: "请选择审批人"}}
                // });
                _this.formOrder.workCatalog.id = _this.currentWorkCatalog.id;
                _this.formOrder.workLevelId = _this.selectedWorLevelId;
                var data = _this.formOrder;
                if (!data.workStartTime) {
                    LIB.Msg.error("请选择作业时间", 1);
                    return;
                }
                if (_this.currentWorkCatalog.levelList && _this.currentWorkCatalog.levelList.length > 1 && !data.workLevelId) {
                    LIB.Msg.error("请选择作业等级", 1);
                    return;
                }
                if (!data.workPlace || data.workPlace.length > 200) {
                    LIB.Msg.error("请填写作业地点,且不要超过200个字符", 1);
                    return;
                }
                if (data.workEquipment && data.workEquipment.length > 200) {
                    LIB.Msg.error("作业所在的设备不要超过200个字符", 1);
                    return;
                }
                if (!data.workContent || data.workContent.length > 500) {
                    LIB.Msg.error("请填作业内容,且不要超过500个字符", 1);
                    return;
                }
                if (!data.auditor.id) {
                    LIB.Msg.error("请选择审批人", 1);
                    return;
                }
                api.create(_this.formOrder).then(function () {
                    LIB.Msg.success("预约成功", 1, function () {
                        _this.$router.go("/ptw/businessCenter/ptwTodo");
                    });
                })

            },
            doFillSubmit: function () {
                var _this = this;
                var data = model.getPermitDetail(this.permitModel);
                api.submitWorkPermit(data).then(function (result) {
                    LIB.Msg.success("提交成功", 1, function () {
                        _this.$router.go("/ptw/businessCenter/ptwFinish");
                    });
                })
            },
            doFillSave: function () {
                var _this = this;
                var data = model.getPermitDetail(this.permitModel);
                api.saveWorkPermit(data).then(function (result) {
                    LIB.Msg.success("保存成功");
                    if (!_this.permitModel.id) {
                        _this.permitModel.id = result.data.id;
                    }
                })
            }

        },
        events: {},
        init: function () {
            var _this = this;

        },
        created: function () {
            var _this = this;
            _this.permitModel.selworkPersonnels["1"].push({user:{id:LIB.user.id,name:LIB.user.name},type:"1"});
            var enable = LIB.getBusinessSetByNamePath("ptw.enableReservation");
            if (enable.result != '2') {
                _this.$nextTick(function () {
                    _this.$refs.modalSelTpl.init();
                })
            } else {
                _this.enableOrder = true;
                commonApi.getWorkCatalogLevelList().then(function (data) {
                    _this.workCatalogList = data;
                    _this.$nextTick(function () {
                        _this.$refs.radioGroup.updateModel();
                    })
                });
            }
            api.getUUID().then(function (res) {
                _this.permitModel.id = res.data;
            });

        },
        watch: {
            dateRange: function (val) {
                if (val[0]) {
                    _.extend(this.formOrder, {
                        workStartTime: val[0].Format("yyyy-MM-dd hh:mm:ss"),
                        workEndTime: val[1].Format("yyyy-MM-dd 23:59:59")
                    });
                }
            },
            selWorkCatalogIndex: function (val) {
                var item = this.workCatalogList[val];
                if (item.levelList && item.levelList.length > 0) {
                    this.selectedWorLevelId = item.levelList[0].id;
                } else {
                    this.selectedWorLevelId = undefined;
                }
            }
        },
        route: {
            activate: function () {
                if (this.enableOrder !== true) {
                    this.$refs.modalSelTpl.init();
                }
            },
            deactivate: function () {
                if (this.enableOrder !== true) {
                    this.enableOrder = 0;
                } else {
                    this.dateRange=[];
                    this.selectedWorLevelId="";
                    this.selWorkCatalogIndex=0;
                    _.extend(this.formOrder, {
                        workStartTime: null,
                        workEndTime: null,
                        workLevel: {id: ''},
                        workCatalog: {id: ''},
                        workPlace: null,
                        workEquipment: null,
                        workContent: null,
                        enableReservation: "1",
                        auditor: {id: '', name: ''}
                    })
                }
            }
        }
    });

    return vm;
});
