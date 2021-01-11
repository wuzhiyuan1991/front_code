
define(function(require) {

    var Vue = require("vue");

    var template = require('text!./textarea.html');

    var opt = {
        template: template,

        props: {
            value: {
                type: String,
                default: ''
            },
            placeholder: {
                type: String,
                default: ''
            },
            maxLength: {
                type: Number
            },
            disabled: {
                type: Boolean,
                default: false
            },
            autoSize: {
                type: Boolean,
                default: false
            },
            rows: {
                type: Number,
                default: 3
            },
            readonly: {
                type: Boolean,
                default: false
            },
            autoFocus: {
                type: Boolean,
                default: false
            },
            width: {
                type: [Number,String],
                default: 260
            },
        },
        data: function () {
            return {
                textareaStyles: {}
            }
        },
        computed: {
        },
        methods: {
            handleFocus: function () {
                this.$emit('on-focus');
            },
            handleBlur: function () {
                this.$emit('on-blur');
                this.$dispatch('on-form-blur', this.value);
            },
            handleChange : function(event) {
                this.$emit('on-change', event);
                this.$dispatch('on-form-change', this.value);
            }
        },

        watch: {
        },
        ready:function(){
        }

    };

    var component = Vue.extend(opt);
    Vue.component('iv-textarea', component);

});
