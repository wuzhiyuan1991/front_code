define(function (require) {
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./opEmerStepItemFormModal.html");
    // var opEmerStepSelectModal = require("componentsEx/selectTableModal/opEmerStepSelectModal");

    //初始化数据模型
    var newVO = function () {
        return {
            //唯一标识
            code: null,
            //禁用标识 0未禁用，1已禁用
            disable: '0',
            //负责人
            principal: null,
            //序号
            // orderNo : null,
            //现场处置
            content: null,
            //修改日期
            // modifyDate : null,
            // 创建日期
            // createDate : null,
            //应急处置步骤
            // opEmerStep : {id:'', name:''},
        }
    };

    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'create',
            isReadOnly: false,
            title: "添加",

            //验证规则
            rules: {
                //"code":[LIB.formRuleMgr.require("编码")]
                "principal": [LIB.formRuleMgr.require("负责人"),
                    LIB.formRuleMgr.length(20)
                ],
                "content": [LIB.formRuleMgr.require("现场处置"),
                    LIB.formRuleMgr.length(1000)
                ]
            },
            emptyRules: {}
        }

    };

    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
        template: tpl,
        data: function () {
            return dataModel;
        },
        methods: {
            newVO: newVO
        }
    });

    return detail;
});