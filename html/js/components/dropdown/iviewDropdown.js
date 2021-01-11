///**
// * Created by yyt on 2016/12/12.
// */

define(function (require) {

    var Vue = require("vue");
    var assist = require("../utils/assist");
    var clickoutside = require("../directives/clickoutside");
    var template = '<div ' +
        ':class="[prefixCls]" ' +
        'v-clickoutside="handleClose" ' +
        ' @mouseenter="handleMouseenter" ' +
        '@mouseleave="handleMouseleave"> ' +
        '<div :class="[prefixCls-rel]" v-el:reference @click="handleClick"><slot></slot></div> ' +
        '<dropdown v-show="visible" :placement="placement" :transition="transition" v-ref:dropdown><slot name="list"></slot></dropdown> ' +
        '</div>';


    var prefixCls = 'ivu-dropdown';

    var opt = {
        template: template,
        directives: {clickoutside: clickoutside},
        props: {
            trigger: {
                validator: function (value) {
                    return assist.oneOf(value, ['click', 'hover', 'none']);
                },
                default: 'hover'
            },
            placement: {
                validator: function (value) {
                    return assist.oneOf(value, ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end']);
                },
                default: 'bottom'
            }

        },
        computed: {
            transition: function () {
                return ['bottom-start', 'bottom', 'bottom-end'].indexOf(this.placement) > -1 ? 'slide-up' : 'fade';
            }
        },
        data: function () {
            return {
                prefixCls: prefixCls,
                visible: false
            }
        },
        methods: {
            handleClick: function () {
                if (this.trigger !== 'click') {
                    return false;
                }
                this.visible = !this.visible;
            },
            handleMouseenter: function () {
                var _this = this;
                if (this.trigger !== 'hover') {
                    return false;
                }
                clearTimeout(this.timeout);
                this.timeout = setTimeout(function () {
                    _this.visible = true;
                }, 250);
            },
            handleMouseleave: function () {
                var _this = this;
                if (this.trigger !== 'hover') {
                    return false;
                }
                clearTimeout(this.timeout);
                this.timeout = setTimeout(function () {
                    _this.visible = false;
                }, 150);
            },
            handleClose: function () {
                if (this.trigger !== 'click') {
                    return false;
                }
                this.visible = false;
            },
            hasParent: function () {
                var $parent = this.$parent.$parent;
                if ($parent && $parent.$options.name === 'iv-dropdown') {
                    return $parent;
                } else {
                    return false;
                }
            }
        },

        watch: {
            visible: function (val) {
                this.$emit("visible-changed", val);
                if (val) {
                    this.$refs.dropdown.update();
                } else {
                    this.$refs.dropdown.destroy();
                }
            }
        },
        events: {
            'on-click': function (key) {
                var $parent = this.hasParent();
                if ($parent) $parent.$emit('on-click', key);
            },
            'on-hover-click': function () {
                var $parent = this.hasParent();
                if ($parent) {
                    this.$nextTick(function () {
                        this.visible = false;
                    });
                    $parent.$emit('on-hover-click');
                } else {
                    this.$nextTick(function () {
                        this.visible = false;
                    });
                }
            },
            'on-haschild-click': function () {
                this.$nextTick(function () {
                    this.visible = true;
                });
                var $parent = this.hasParent();
                if ($parent) $parent.$emit('on-haschild-click');
            }
        }

    }

    var component = Vue.extend(opt);
    Vue.component('iv-dropdown', component);
    Vue.component('Dropdown', component);

})
