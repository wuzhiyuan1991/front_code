define(function (require) {
    //基础js
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var template = LIB.renderHTML(require("text!./workPlanDelegate.html"));
    var components = {
        "user-select-modal": require("componentsEx/selectTableModal/userSelectModal"),
        //"multi-select-input": require("../assign/dialog/multiSelectInput")
    };
    var formData = function () {
        return {
            //委托原因
            // reason: null,
            //被委托人
            assigne: null
        }
    };

    var userSelectModel = function () {
        return {
            visible: false,
            type: null,
            filterData: null,
            assigne: null
        }
    };
    var dataModel = function () {
        return {
            mainModel: {
                vo: new formData(),
                rules: {
                    "assigne.id": [
                        {required: true, message: "请选择被委托人"}
                    ],
                    // "reason": [
                    //     LIB.formRuleMgr.require("委托原因"),
                    //     LIB.formRuleMgr.length(500)
                    // ]
                },
                selectModel: {
                    //用户列表
                    userSelected: userSelectModel()
                }
            },
        }
    };

    var opts = {
        template: template,
        components: components,
        props: {
            workPlanId: String
        },
        data: dataModel,
        computed: {},
        watch: {
            workPlanId: function (nVal) {
                if (nVal) {
                    this.init();
                }
            },

        },
        methods: {
            /**
             * 初始化表单数据
             */
            initData: function () {
                this.mainModel.vo = formData();
                this.mainModel.selectModel.userSelected = new userSelectModel();
            },
            /**
             * 初始化，当workPlanId更改时执行
             */
            init: function () {
                this.$refs.ruleform.resetFields();
                this.initData();
            },
            //弹框选择人员
            doSelectUser: function () {
                var userSelected = this.mainModel.selectModel.userSelected;
                userSelected.visible = true;
                var excludeIds = [];
                excludeIds.push(LIB.user.id);
                userSelected.filterData = {compId: LIB.user.compId, "criteria.strsValue": JSON.stringify({excludeIds: excludeIds})};
            },
            //保存弹框选择的人员信息
            doSaveUser: function (selectedData) {
                if (selectedData) {
                    this.mainModel.vo.assigne= selectedData[0];
                }
            },
            doSave: function () {
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        var formData = {workPlanId: _this.workPlanId,assigneId:_this.mainModel.vo.assigne.id};
                        api.delegate(formData).then(function (res) {
                            if (res.data && res.error != '0') {
                                LIB.Msg.warning("委托失败");
                                return;
                            } else {
                                _this.$dispatch("ev_delegate",_this.mainModel.vo.assigne.id);
                                LIB.Msg.info("委托成功");
                            }
                        });
                    }
                });
            },
        }
    };

    return opts;
});