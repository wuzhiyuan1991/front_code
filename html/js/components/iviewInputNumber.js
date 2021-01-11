define(function (require) {
    var Vue = require("vue");
    var LIB = require("lib");
    var oneOf = require("./utils/assist").oneOf;

    var template = '<div :class="wrapClasses" :style="styleObj">'
        + '<div v-if="textonly" :title="showTip ? value : null">{{value}}</div>'
        + '<div :class="handlerClasses" v-show="!readonly" v-if="!textonly">'
        + '<a @click="up" @mouse.down="preventDefault" :class="upClasses">'
        + '<span :class="innerUpClasses" @click="preventDefault"></span>'
        + '</a>'
        + '<a @click="down" @mouse.down="preventDefault" :class="downClasses">'
        + '<span :class="innerDownClasses" @click="preventDefault"></span>'
        + '</a>'
        + '</div>'
        + '<div :class="inputWrapClasses" v-if="!textonly">'
        + '<input type="number" :class="inputClasses" :readonly="readonly" :disabled="disabled" autocomplete="off" @focus="focus" @blur="blur" @keydown.stop="keyDown" @change="change" @input="onInput" :value="value">'
        + '</div>'
        + '</div>';
    var prefixCls = 'ivu-input-number';
    var iconPrefixCls = 'ivu-icon';

    function isValueNumber(value) {
        return (/(^-?[0-9]+\.{1}\d+$)|(^-?[1-9]?[0-9]*$)/).test(value + '');
    }

    function addNum(num1, num2) {
        var sq1, sq2, m;
        try {
            sq1 = num1.toString().split(".")[1].length;
        }
        catch (e) {
            sq1 = 0;
        }
        try {
            sq2 = num2.toString().split(".")[1].length;
        }
        catch (e) {
            sq2 = 0;
        }
        m = Math.pow(10, Math.max(sq1, sq2));
        return (num1 * m + num2 * m) / m;
    }

    var opt = {
        template: template,
        props: {
            max: {
                type: [Number, String],
                'default': Infinity
            },
            min: {
                type: [Number, String],
                'default': -Infinity
            },
            step: {
                type: [Number, String],
                'default': 1
            },
            value: {
                type: [Number, String],
                'default': ''
            },
            size: {
                validator: function (value) {
                    return oneOf(value, ['small', 'large']);
                }
            },
            readonly: {
                type: Boolean,
                'default': false
            },
            textonly: {
                type: Boolean,
                'default': false
            },
            disabled: {
                type: Boolean,
                'default': false
            },
            // 是否限制输入整数
            isInteger: {
                type: Boolean,
                'default': false
            },
            // 在输入错误后是否自动更正
            isAutoCorr: {
                type: Boolean,
                'default': true
            },
            // 是否显示错误信息
            isShowErr: {
                type: Boolean,
                'default': true
            }
        },
        data: function () {
            return {
                focused: false,
                upDisabled: false,
                downDisabled: false
            }
        },
        computed: {
            styleObj: function () {
                var obj = {};
                if(this.textonly) {
                    obj.border = 'none';
                }
                return obj;
            },
            wrapClasses: function () {
                var obj = {};
                obj[prefixCls + '-' + this.size] = !!this.size;
                obj[prefixCls + '-disabled'] = !!this.disabled;
                obj[prefixCls + '-focused'] = !!this.focused;

                return [prefixCls, obj];
            },
            handlerClasses: function () {
                return prefixCls + '-handler-wrap';
            },
            upClasses: function () {
                var obj = {};
                obj[prefixCls + '-handler-up-disabled'] = this.upDisabled;
                return [prefixCls + '-handler', prefixCls + '-handler-up', obj];
            },
            innerUpClasses: function () {
                return prefixCls + '-handler-up-inner ' + iconPrefixCls + ' ' + iconPrefixCls + '-ios-arrow-up';
            },
            downClasses: function () {
                var obj = {};
                obj[prefixCls + '-handler-down-disabled'] = this.downDisabled;
                return [prefixCls + '-handler', prefixCls + '-handler-down', obj];
            },
            innerDownClasses: function () {
                return prefixCls + '-handler-down-inner ' + iconPrefixCls + ' ' + iconPrefixCls + '-ios-arrow-down';
            },
            inputWrapClasses: function () {
                return prefixCls + '-input-wrap';
            },
            inputClasses: function () {
                return prefixCls + '-input';
            }
        },
        methods: {
            preventDefault: function (e) {
                e.preventDefault();
            },
            up: function () {
                if (this.upDisabled) {
                    return false;
                }
                this.changeStep('up');
            },
            down: function () {
                if (this.downDisabled) {
                    return false;
                }
                this.changeStep('down');
            },
            changeStep: function (type) {
                if (this.disabled) {
                    return false;
                }

                var val = Number(this.value);
                var step = Number(this.step);
                if (isNaN(val)) {
                    return false;
                }

                if (type === 'up') {
                    val = addNum(val, step);
                } else if (type === 'down') {
                    val = addNum(val, -step);
                }
                this.setValue(val);
            },
            setValue: function (val) {
                if (!!this.isInteger) val = parseInt(val)
                this.$nextTick(function () {
                    this.value = val;
                });

                this.$emit('on-change', val);
            },
            focus: function () {
                this.focused = true;
            },
            blur: function () {
                this.focused = false;
            },
            keyDown: function (e) {
                if(_.includes([69, 187, 189], e.keyCode)){
                    e.preventDefault();
                }

                var val = e.target.value,
                    arr = val.split('.'),
                    decimal = arr[1];
                if(this.isInteger && e.keyCode === 190) {
                    e.preventDefault();
                }
                // 只允许一个点
                if(val.indexOf('.') > -1 && e.keyCode === 190) {
                    e.preventDefault();
                }
                // 保留两位小数
                if(decimal && decimal.length === 2) {
                    if((e.keyCode >= 96 && e.keyCode <= 105) || (e.keyCode >= 48 && e.keyCode <= 57)){
                        e.preventDefault();
                    }
                }

                if (e.keyCode === 38) {
                    e.preventDefault();
                    this.up()
                } else if (e.keyCode === 40) {
                    e.preventDefault();
                    this.down()
                }
            },
            change: function (event) {
                var val = event.target.value.trim();

                var max = Number(this.max);
                var min = Number(this.min);

                if (isValueNumber(val)) {
                    val = Number(val);
                    this.value = val;

                    if (val > max) {
                        if (this.isShowErr) LIB.Msg.error("所填数值必须不大于" + max);
                        if (this.isAutoCorr) this.setValue(max.valueOf());
                    } else if (val < min) {
                        if (this.isShowErr) LIB.Msg.error("所填数值必须不小于" + min);
                        if (this.isAutoCorr) this.setValue(min.valueOf());
                    } else {
                        this.setValue(val);
                    }
                } else {
                    event.target.value = this.value;
                }
            },
            changeVal: function (val) {
                if (isValueNumber(val) || val === 0) {
                    val = Number(val);
                    var step = new Number(this.step);

                    this.upDisabled = val + step > new Number(this.max);
                    this.downDisabled = val - step < new Number(this.min);
                } else {
                    this.upDisabled = true;
                    this.downDisabled = true;
                }
            }
        },
        ready: function () {
            this.changeVal(this.value);
        },
        watch: {
            value: function (val) {
                this.changeVal(val);
            }
        }
    };
    var component = Vue.extend(opt);
    Vue.component('iv-input-number', component);
});