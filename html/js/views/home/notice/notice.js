define(function (require) {
    var LIB = require('lib');
    var template = require("text!./notice.html");
    var api = require("./vuex/api");

    var dataModel = {

    };

    //首页效果
    var notice = LIB.Vue.extend({
        mixins: [LIB.VueMixin.auth],
        template: template,
        data: function () {
            return dataModel;
        },
        props: {
            item: {
                type: Object,
                default: function () {
                    return {}
                }
            }
        },
        methods: {
            convertFilePath: function(file) {
                return LIB.convertFilePath(LIB.convertFileData(file))
            },
            doDelete: function () {
                this.$emit("do-delete", this.item);
            },
            replaceReturnKey: function(content) {
                return content.replace(/[\r\n]/g, '<br/>');
            }
        },
        init: function () {
            this.$api = api;
            this.__auth__ = this.$api.__auth__;
        },
        events: {

        }
    });
    return notice;
});
