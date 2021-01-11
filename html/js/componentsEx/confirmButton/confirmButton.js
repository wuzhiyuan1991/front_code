/**
 * Created by yyt on 2017/5/20.
 */
define(function (require) {
    var LIB = require('lib');
    var Vue = require("vue");
    var tpl = require("text!./confirmButton.html");
    var Modal = require("components/modal/Modal");
    var opts = {
        template: tpl,
        components: {
            Modal: Modal
        },
        data: function () {
            return {
                inputValue: '',
                visible: false
            };
        },
        props: {
            text: {
                type: String,
                default: '删除'
            },
            okText: {
                type: String,
                default: '确定'
            },
            cancelText: {
                type: String,
                default: '取消'
            },
            title: {
                type: String,
                default: '删除当前数据?'
            },
            input: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            onClick: function () {
                if (this.input) {
                    this.inputValue = '';
                    this.visible = true;
                    return;
                }

                var _this = this;
                LIB.Modal.confirm({
                    title: _this.title,
                    okText: _this.okText,
                    cancelText: _this.cancelText,
                    onOk: function() {
                        _this.$emit("on-ok");
                    }
                });
            },
            onSure: function () {
                this.visible = false;
                this.$emit("on-ok", this.inputValue);
            },
            onCancel: function () {
                this.visible = false;
            }
        }
    };
    var component = Vue.extend(opts);
    Vue.component('confirm-button', component);
});