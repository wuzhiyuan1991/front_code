/**
 * Created by yyt on 2016/11/8.
 */

define(function(require) {

    var Vue = require("vue");

    var template =  ' <label :class="wrapClasses">'+
                    ' <span :class="radioClasses">'+
                    '<span :class="innerClasses"></span>'+
                    '<input'+
                    ' type="radio"'+
                    ':class="inputClasses"'+
                    ':disabled="disabled"'+
                    ' :checked="selected"'+
                   ' :value="value"'+
                    '@change="change">'+
                    '</span>'+
                    '<slot>{{ value }}</slot>'+
                    '</label>';
    var prefixCls = 'ivu-radio';

    var opt = {
        template : template,
        props: {
            checked: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            value: {
                type: [String, Number]
            }
        },
        data: function data() {
            return {
                model: [],
                selected: false,
                group: false
            };
        },
        computed: {
            wrapClasses: function wrapClasses() {
                var _ref;
                var obj ={};
                obj[prefixCls + '-group-item'] = this.group;
                obj[prefixCls + '-wrapper-checked'] = this.selected;
                obj[prefixCls + '-wrapper-disabled'] = this.disabled;

                return [prefixCls + '-wrapper',obj];
            },
            radioClasses: function radioClasses() {
                var _ref2;
                var oot ={};
                oot[prefixCls + '-checked'] = this.selected;
                oot[prefixCls + '-disabled'] = this.disabled;
                return ['' + prefixCls,oot]
            },
            innerClasses: function innerClasses() {
                return prefixCls + '-inner';
            },
            inputClasses: function inputClasses() {
                return prefixCls + '-input';
            }
        },
        ready: function ready() {
            if (this.group) {
                this.updateModel();
            }
        },
        methods: {
            change: function change(event) {
                if (this.disabled) {
                    return false;
                }

                this.selected = event.target.checked;
                this.checked = this.selected;

                if (this.group && this.checked) {
                    this.$parent.change({
                        value: this.value,
                        checked: this.checked
                    });
                }
            },
            updateModel: function updateModel() {
                this.selected = this.checked;
            }
        },
        watch: {
            checked: function checked() {
                this.updateModel();
            }
        }
    };


    var component = Vue.extend(opt);
    Vue.component('business-radio', component);

});
