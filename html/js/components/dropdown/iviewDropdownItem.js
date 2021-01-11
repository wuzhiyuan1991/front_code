///**
// * Created by yyt on 2016/12/12.
// */

define(function(require) {

    var Vue = require("vue");
    var template =  '<li :class="classes" @click="handleClick"><slot></slot></li>' ;


    var prefixCls = 'ivu-dropdown-item';

    var opt = {
        template: template,

        props: {
            key: {
                type: [String, Number]
            },
            disabled: {
                type: Boolean,
                default: false
            },
            selected: {
                type: Boolean,
                default: false
            },
            divided: {
                type: Boolean,
                default: false
            }

        },
        computed: {
            //classes () {
            //    return [
            //                `${prefixCls}`,
            //        {
            //            [`${prefixCls}-disabled`]: this.disabled,
            //            [`${prefixCls}-selected`]: this.selected,
            //            [`${prefixCls}-divided`]: this.divided
            //        }
            //    ]
            //}
            classes :function() {
                var obj = {};
                obj[prefixCls + '-' + 'disabled'] = this.disabled;
                obj[prefixCls + '-' + 'selected'] = this.selected;
                obj[prefixCls + '-' + 'divided'] = this.divided;
                return [prefixCls, obj];

            }
        },
        methods: {
            handleClick :function() {
                var _this = this;
                var $parent = this.$parent.$parent;
                var hasChildren = this.$parent && this.$parent.$options.name === 'iv-dropdown';

                    if (this.disabled) {
                        this.$nextTick(function() {
                            $parent.visible = true;
                    });
                } else if (hasChildren) {
                    this.$parent.$emit('on-haschild-click');
                } else {
                    if ($parent && $parent.$options.name === 'iv-dropdown') {
                        $parent.$emit('on-hover-click');
                    }
                }
                $parent.$emit('on-click', _this.key);
            }
        }
    }

    var component = Vue.extend(opt);
    Vue.component('iv-dropdown-item', component);
    Vue.component('DropdownItem', component);

})
