define(function(require) {

    var LIB = require('lib');
    var tpl = require("text!./resultFormModal.html");

    var component = {
        template: tpl,
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        props: {
            visible: {
                type: Boolean,
                default: false
            }
        },
        watch : {
            visible : function(val) {

            }
        },
        data: function () {
            return {}
        },
        methods : {
            doSave : function() {
                //当beforeDoSave方法明确返回false时,不继续执行doSave方法, 返回undefine和true都会执行后续方法
                if(this.beforeDoSave() === false) {
                    return;
                }
                var _this = this;
                this.$refs.ruleform.validate(function (valid){
                    if (valid) {
                        var data = {};
                        _.deepExtend(data, _this.mainModel.vo);
                        //_.deepExtend(_this.mainModel.vo, newVO());
                        if(_this.autoHide) {
                            _this.visible = false;
                        }
                        if (_this.mainModel.opType === "create") {
                            _this.$emit("do-save", data);
                        } else if (_this.mainModel.opType === "update") {
                            _this.$emit("do-update", data);
                        }
                    }
                });
            },
        },
    };

    return component;
});