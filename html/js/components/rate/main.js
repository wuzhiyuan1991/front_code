define(function (require) {
    var Vue = require("vue");

    var template = require("text!./main.html");

    var opts = {
        template: template,
        props: {
            count: {
                type: Number,
                default: 5
            },
            value: {
                type: Number,
                default: 0
            },
            allowHalf: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            showText: {
                type: Boolean,
                default: false
            }
        },
        data: function () {
            return {
                hoverIndex: -1,
                isHover: false,
                isHalf: false
            };
        },
        watch: {
            value: {
                immediate: true,
                handler: function (val) {
                    this.setHalf(val);
                }
            }
        },
        methods: {
            starCls: function (value) {
                var hoverIndex = this.hoverIndex;
                var currentIndex = this.isHover ? hoverIndex : this.value;
                var full = false;
                var isLast = false;
                if (currentIndex > value) full = true;
                if (this.isHover) {
                    isLast = currentIndex === value + 1;
                } else {
                    isLast = Math.ceil(this.value) === value + 1;
                }
                return [
                    {
                        'ivu-rate-star-full': (!isLast && full) || (isLast && !this.isHalf),
                        'ivu-rate-star-half': isLast && this.isHalf,
                        'ivu-rate-star-zero': !full
                    }
                ];
            },
            handleMousemove: function (value, event) {
                if (this.disabled) return;
                this.isHover = true;
                if (this.allowHalf) {
                    var type = event.target.getAttribute('type') || false;
                    this.isHalf = type === 'half';
                } else {
                    this.isHalf = false;
                }
                this.hoverIndex = value + 1;
            },
            handleMouseleave: function () {
                if (this.disabled) return;
                this.isHover = false;
                this.setHalf(this.value);
                this.hoverIndex = -1;
            },
            setHalf: function (val) {
                this.isHalf = val.toString().indexOf('.') >= 0;
            },
            handleClick: function (value) {
                if (this.disabled) return;
                value++;
                if (this.isHalf) value -= 0.5;
                this.value = value;
                this.$emit('on-change', value);
                this.$dispatch('on-form-change', value);
            }
        }
    };

    var comp = Vue.extend(opts);
    Vue.component('rate', comp);
});


