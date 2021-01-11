define(function (require) {

    var LIB = require('lib');

    var template = require("text!./groupPartial.html");

    var opts = {
        template: template,
        props: {
            index: {
                type: Number,
                default: 0
            },
            group: {
                type: Object
            },
            editable: {
                type: Boolean,
                default: true
            },
            showGroupIndex: {
                type: Boolean,
                default: false
            },
            showMoreButton:{
                type: Boolean,
                default: true
            }
        },
        data: function () {
            return {}
        },
        computed: {

        },
        methods: {
            doShowItemFormModal4Create: function (group, index) {
                this.$emit('do-create-item', {
                    entry: group,
                    index: index
                });
            },
            doMove: function (offset, group, index) {
                this.$emit('do-move', {
                    entry: group,
                    index: index,
                    offset: offset
                });
            },
            doShowGroupFormModal4Update: function (group, index) {
                this.$emit('do-update-group', {
                    entry: group,
                    index: index
                });
            },
            doRemove: function (group, index) {
                this.$emit('do-remove', {
                    entry: group,
                    index: index
                });
            }
        },
        ready: function () {
        }
    };

    var component = LIB.Vue.extend(opts);
    LIB.Vue.component('group-partial', component);

    return component;
});