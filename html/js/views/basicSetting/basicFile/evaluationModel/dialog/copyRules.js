define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./copyRules.html");

    var newVO = function () {
        return {
            compId: null,//所属公司id
            name: '',
            state: '1',
            description: ''
        }
    };
    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO(),
            //验证规则
            rules: {
                "compId": [LIB.formRuleMgr.require("所属公司")],
                "name": [LIB.formRuleMgr.require("评估模型名称")]
            }
        }
    };

    var detail = LIB.Vue.extend({
        template: tpl,
        props: {
            riskModelId: {
                type: String
            },
            visible: {
                type: Boolean,
                default: false
            },
            name: {
                type: String,
                default: ''
            },
            description: {
                type: String,
                default: ''
            }
        },
        data: function () {
            return dataModel;
        },
        watch: {
            visible: function (val) {
                if(val) {
                    this.mainModel.vo = newVO();
                    this.mainModel.vo.name = this.name;
                    this.mainModel.vo.description = this.description;
                } else {
                    this.mainModel.vo = newVO();
                }

            }
        },
        methods: {
            doSave: function () {
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        var formData = {
                            id: _this.riskModelId,
                            compId: _this.mainModel.vo.compId,
                            name: _this.mainModel.vo.name,
                            description: _this.mainModel.vo.description,
                            state: '1'
                        };
                        api.copyRiskModel(formData).then(function (res) {
                            _this.$emit("copy-succeeded");
                        });
                    }
                });
            }
        }
    });
    return detail;
});