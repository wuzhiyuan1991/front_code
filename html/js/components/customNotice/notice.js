define(function (require) {
    var Vue = require("vue");
    var template = require("text!./notice.html");

    var opts = {
        template: '<div class="ivu-notice-notice" transition="move-right">' +
        '    <div class="ivu-notice-notice-content">' +
        '        <div class="ivu-notice-custom-content">' +
        '            <div class="ivu-notice-title">{{title}}</div>' +
        '            <div class="ivu-notice-desc"><slot></slot></div>' +
        '        </div>' +
        '    </div>' +
        '    <a href="javascript:;" class="ivu-notice-notice-close" @click="remove"><i class="ivu-icon ivu-icon-ios-close-empty"></i></a>' +
        '</div>',
        props: {
            title: {
                type: String,
                default: ''
            },
            key: {
                type: String,
                required: true
            }
        },
        methods: {
            remove: function () {
                this.$emit("on-remove", this.key);
            }
        }
    };
    var component = Vue.extend(opts);
    Vue.component('custom-notice', component);
});
