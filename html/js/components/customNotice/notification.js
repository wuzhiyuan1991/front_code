define(function (require) {
    var LIB = require("lib");
    var Vue = require("vue");
    var template = '<div class="ivu-notice" style="top: 24px;right: 0;"><slot></slot></div>';

    var opts = {
        template: template,
        props: {

        },
        computed: {

        },
        data: function () {
            return {

            }
        },
        methods: {
            remove: function (key) {
                var notices = this.notices;

                for (var i = 0; i < notices.length; i++) {
                    if (notices[i].key === key) {
                        this.notices.splice(i, 1);
                        break;
                    }
                }
            }
        },
        ready: function () {

        }
    };

    var component = Vue.extend(opts);
    Vue.component('custom-notification', component);
});
