define(function (require) {
    //基础js
    var LIB = require('lib');
    //数据模型
    var api = require("./vuex/api");
    var template = LIB.renderHTML(require("text!./auditFormModal.html"));

    var newVO = function() {
        return {
            //签署方式 1:通过,2:退回
            result: '1',
            remark: ''
        }
    };


    var dataModel = {
        title: "审批",
        mainModel: {
            vo: newVO(),
            //验证规则
            rules: {
                name: [LIB.formRuleMgr.require("节点名称"), LIB.formRuleMgr.length(50)]
            }
        },
    };

    var component = LIB.Vue.extend({
        template: template,
        props: {
            id: {
                type: String
            },
            visible: {
                type: Boolean,
                default: false
            },
            type: {
                type: String,
                default: ''
            }
        },
        data: function () {
            return dataModel;
        },
        watch: {
            visible: function (nVal) {
                nVal && this.init();
            }
        },
        methods: {

            init: function () {
                this.mainModel.vo = newVO();
            },



            doSave: function () {
                var param = _.cloneDeep(this.mainModel.vo);
                var _this = this;
                this.$refs.ruleform.validate(function(valid) {
                    if (valid) {
                        _this.$emit("do-save", param)
                    }
                })
            },

        }
    });

    return component;
});