define(function (require) {

    var Vue = require("vue");


    var template = '<li :class="prefixCls + \'-wrap\'" v-show="!hidden">' +
        '<div :class="prefixCls+\'-title\'">{{ label }}</div>' +
        '<ul>' +
        '<li :class="prefixCls+\'\'" v-el:options><slot></slot></li>' +
        '</ul>' +
        '</li>';


    var prefixCls = 'ivu-select-group';

    var opts = {
        template: template,
        props: {
            label: {
                type: String,
                default: ''
            }
        },
        data: function () {
            return {
                prefixCls: prefixCls,
                hidden: false
            }
        },
        methods: {
            queryChange: function () {
                this.$nextTick(function () {
                    var options = this.$els.options.querySelectorAll('.ivu-select-item');
                    var hasVisibleOption = false;
                    for (var i = 0; i < options.length; i++) {
                        if (options[i].style.display !== 'none') {
                            hasVisibleOption = true;
                            break;
                        }
                    }
                    this.hidden = !hasVisibleOption;
                });
            }
        },
        events: {
            'on-query-change': function () {
                this.queryChange();
                return true;
            }
        }
    };


    var component = Vue.extend(opts);
    Vue.component('i-option-group', component);

});