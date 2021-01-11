define(function (require) {
    //基础js
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var template = LIB.renderHTML(require("text!./poolDelegate.html"));
    var components = {
        "user-select-modal": require("componentsEx/selectTableModal/userSelectModal"),
        "multi-select-input": require("../assign/dialog/multiSelectInput")
    };
    var formData = function () {
        return {
            //委托原因
            reason: null,
            //被委托人
            assignees: []
        }
    };
    //去重合并用户列表
    var concatUsers = function (target, source) {
        _.each(source, function (u1) {
            if (!_.some(target, function (u2) {
                    return u1.id === u2.id;
                })) {
                target.push(u1);
            }
        });
    };
    var userSelectModel = function () {
        return {
            visible: false,
            type: null,
            filterData: null,
            assignees: []
        }
    };
    var dataModel = function () {
        return {
            mainModel: {
                vo: new formData(),
                rules: {
                    "assignees": [
                        {required: true, type: 'array', message: "请选择被委托人"}
                    ],
                    "reason": [
                        LIB.formRuleMgr.require("委托原因"),
                        LIB.formRuleMgr.length(500)
                    ]
                },
                selectModel: {
                    //用户列表
                    userSelected: userSelectModel()
                },
            },
            curCandidates: []//当前任务候选人
        }
    };

    var opts = {
        template: template,
        components: components,
        props: {
            poolId: String
        },
        data: dataModel,
        computed: {},
        watch: {
            poolId: function (nVal) {
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
                var _this = this;
                var poolId = this.poolId;
                this.mainModel.vo = formData();
                this.mainModel.selectModel.userSelected = new userSelectModel();
                this.curCandidates = [];
                api.getTaskCandidate({id: this.poolId}).then(function (res) {
                    if (res.data) {
                        _this.curCandidates = _.map(res.data, function (user) {
                            return {id: user.id, name: user.name};
                        });
                    }
                });
            },
            /**
             * 初始化，当poolId更改时执行
             */
            init: function () {
                this.$refs.ruleform.resetFields();
                this.initData();
                if(LIB.getBusinessSetStateByNamePath("poolGovern.requirePoolAssignReason")){
                    this.mainModel.rules["reason"] = [LIB.formRuleMgr.require("委托原因")].concat(LIB.formRuleMgr.length(500));
                }else{
                    this.mainModel.rules["reason"] = [LIB.formRuleMgr.length(500)];
                }
            },
            //弹框选择人员
            doSelectUsers: function () {
                var userSelected = this.mainModel.selectModel.userSelected;
                userSelected.visible = true;
                var excludeIds = [];
                if (this.curCandidates.length > 0) {
                    excludeIds = _.map(this.curCandidates, function (user) {
                        return user.id;
                    });
                }
                if (this.mainModel.vo.assignees.length > 0) {
                    _.each(this.mainModel.vo.assignees, function (user) {
                        excludeIds.push(user.id);
                    })
                }
                userSelected.filterData = {compId: LIB.user.compId, "criteria.strsValue": JSON.stringify({excludeIds: excludeIds})};
            },
            //保存弹框选择的人员信息
            doSaveUser: function (selectedData) {
                if (selectedData) {
                    concatUsers(this.mainModel.vo.assignees, selectedData);
                }
            },
            getFormData: function () {
                var formData = _.deepExtend({poolId: this.poolId}, this.mainModel.vo);
                return formData;
            },
            doSave: function () {
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        var formData = _this.getFormData();
                        api.delegate(formData).then(function (res) {
                            if (res.data && res.error != '0') {
                                LIB.Msg.warning("委托失败");
                                return;
                            } else {
                                _this.$dispatch("ev_delegate");
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