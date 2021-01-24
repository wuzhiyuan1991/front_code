define(function (require) {

    var LIB = require('lib');
    var template = '<iv-input :value.sync="value" :disabled="disabled" :placeholder="placeholder" @on-focus="onFocus" @on-blur="onBlur" :class="codeClass" :textonly="textonly"></iv-input>'
    var opts = {
        template: template,
        data: function () {
            return {
                isFocus: false
            };
        },
        props: {
            value: {
                type: String,
                required: true
            },
            disabled: {
                type: Boolean,
                default: false
            },
            textonly: {
                type: Boolean,
                default: false
            },
            //是否显示title
            showTip: {
                type: Boolean,
                default: false
            },
            allowEmpty: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            placeholder: function () {
                if (!this.allowEmpty) {
                    return this.$t('gb.common.import.tsgca')
                }
                return this.$t('gb.common.pleaseInput')
            },
            codeClass: function () {
                if (this.allowEmpty) {
                    return '';
                }
                if (this.value) {
                    return ''
                }
                if (this.isFocus) {
                    return ''
                }
                return 'bg-gray'
            }
        },
        watch: {

        },
        methods: {
            onFocus: function () {
                this.isFocus = true;
            },
            onBlur: function () {
                this.isFocus = false;
            }
        },
        ready: function () {

        }
    };

    var component = LIB.Vue.extend(opts);
    LIB.Vue.component('code-input', component);
});