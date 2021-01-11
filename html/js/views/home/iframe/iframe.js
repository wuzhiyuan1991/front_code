define(function (require) {
    var LIB = require('lib');
    var template = require("text!./iframe.html");

    //首页效果
    var iframe = LIB.Vue.extend({
        template: template,
        data: function () {
            return {
                src: ''
            }
        },
        methods: {
            _onload: function () {
                // var iframe = this.$els.iframe;
                // var iframeCallbackContent = localStorage.getItem('iframeCallback');
                // if (iframeCallbackContent) {
                //     eval(iframeCallbackContent);
                // }
                // iframe.addEventListener('load', function (e) {
                //     window.iframeCallback(iframe.contentWindow, iframe.contentWindow.document);
                // })
            }
        },
        attached: function () {
            this.src = this.$route.query.src;
            if (!this.src) {
                this.$router.go("/home/work");
            }
            this._onload();
        }
    });
    return iframe;
});
