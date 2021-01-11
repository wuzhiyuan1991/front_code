define(function (require) {
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./activityFormModal.html");
    var leadAccStateSelectModal = require("componentsEx/selectTableModal/leadAccStateSelectModal");
    var intentionAccStateSelectModal = require("componentsEx/selectTableModal/intentionAccStateSelectModal");

    //初始化数据模型
    var newVO = function () {
        return {
            //id
            id: null,
            //内容
            content: null,
            //类型
            type: null
        }
    };

    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'create',
            isReadOnly: false,
            title: "添加",
            showLeadAccStateSelectModal: false,
            showIntentionAccStateSelectModal: false,
            type:[{type:"0",name:"电话"},{type:"1",name:"网络沟通"},{type:"2",name:"拜访"},{type:"3",name:"邮件"},{type:"4",name:"其他"}],

            //验证规则
            rules: {
                //"code":[LIB.formRuleMgr.require("编码")]
                "code": [LIB.formRuleMgr.length()],
                "name": [LIB.formRuleMgr.length()],
                "content": [LIB.formRuleMgr.length()],
                "disable": [LIB.formRuleMgr.length()],
                "state": [LIB.formRuleMgr.length()],
                "time": [LIB.formRuleMgr.length()],
                "type": [LIB.formRuleMgr.length()],
                "username": [LIB.formRuleMgr.length()],
                "modifyDate": [LIB.formRuleMgr.length()],
                "createDate": [LIB.formRuleMgr.length()],
            },
            emptyRules: {}
        }
    };

    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
        template: tpl,
        components: {
            "leadaccstateSelectModal": leadAccStateSelectModal,
            "intentionaccstateSelectModal": intentionAccStateSelectModal,

        },
        data: function () {
            return dataModel;
        },
        methods: {
            newVO: newVO,
            doSaveLeadAccState: function (selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.leadAccState = selectedDatas[0];
                }
            },
            doSaveIntentionAccState: function (selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.intentionAccState = selectedDatas[0];
                }
            },

        }
    });

    return detail;
});