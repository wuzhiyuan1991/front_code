define(function (require) {
    //基础js
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var template = LIB.renderHTML(require("text!./delegateSingle.html"));
    var components = {
        "user-select-modal": require("componentsEx/selectTableModal/userSelectModal"),
    };
    var formData = function () {
        return {
        	checkTaskGroupId:null,
            //委托原因
            reason: null,
            //被委托人
            assignee: {id:null,name:null}
        }
    };
    var userSelectModel = function () {
        return {
            visible: false,
            type: null,
            filterData: null,
        }
    };
    var dataModel = function () {
        return {
            mainModel: {
                title: '委托',
                vo: new formData(),
                rules: {
                    "assignee.id": [
                        {required: true, message: "请选择被委托人"}
                    ],
                    "reason": [
                        LIB.formRuleMgr.require("委托原因"),
                        LIB.formRuleMgr.length(500)
                    ]
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
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
        components: components,
        props: {
            id: String
        },
        data: dataModel,
        computed: {},
        methods: {
            newVO: formData,
            //弹框选择人员
            doSelectUsers: function () {
                var userSelected = this.mainModel.selectModel.userSelected;
                userSelected.visible = true;
                userSelected.filterData = {compId: LIB.user.compId, "criteria.strsValue": JSON.stringify({excludeIds: [LIB.user.id]})};
            },
            //保存弹框选择的人员信息
            doSaveUser: function (selectedData) {
                if (selectedData) {
                    this.mainModel.vo.assignee.id = selectedData[0].id;
                    this.mainModel.vo.assignee.name = selectedData[0].name;
                }
            },
            doSave: function () {
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        api.saveDelegateRecord({id:_this.id},_this.mainModel.vo).then(function (res) {
                            if (res.data && res.error != '0') {
                                LIB.Msg.warning("委托失败");
                                return;
                            } else {
                                _this.$dispatch("ev_single_delegate");
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