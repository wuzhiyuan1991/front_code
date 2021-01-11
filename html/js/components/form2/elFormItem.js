define(function (require) {
    var Vue = require("vue");
//	var emitter = require("./emitter");//暂不使用
    var AsyncValidator = require("../async-validator/index");
    var transition = require("./transition");
    var template = require("text!./elFormItem.html");
    var elFormError = require("./elFormError");
    //TODO 规则：使用“.”号进行分割
    //定义获取对象指定属性值方法
    var getProperty = function (model, propName) {
        var temps = propName.split('.');
        var value = model;
        for (var i in temps) {
            if (value == null) return null;
            value = _.propertyOf(value)(temps[i]);
        }
        return value;
    }
    var opts = {
        template: template,
        components: {formError: elFormError},
//			 mixins: [emitter], //Vue2.0迁移方案
        props: {
            'class': {
                type: String,
                'default': ''
            },
            isLabelVertical: {
                type: Boolean,
                'default': null
            },
            label: String,
            labelWidth: String,
            prop: String,
            required: {
                type: Boolean,
                'default': false
            },
            placement: {
                type: String,
                'default': 'right'
            },
            rules: [Object, Array]
        },
        computed: {
            isVertical: function () {
                return _.isNull(this.isLabelVertical) ? this.form.isLabelVertical : this.isLabelVertical;
            },
            isRequired: function () {
                var _this = this;
                var rules = this.getRules();
                return _.some(rules, function (rule) {
                    return rule.required;
                })
                // var isRequired = _.clone(this.required);
                // if (rules.length) {
                //     var _this = this;
                //     rules.every(function (rule) {
                //         if (rule.required) {
                //             isRequired = true;
                //             return false;
                //         }
                //     });
                // }
                // return isRequired;
            },
            formItemClass: function () {
                var clz = [];
                if (this.isVertical) {
                    clz[clz.length] = 'el-form-item_vertical';
                } else {
                    clz[clz.length] = 'el-form-item';
                }
                if (this.error !== '') {
                    clz[clz.length] = 'is-error';
                }
                if (this.validating) {
                    clz[clz.length] = 'is-validating';
                }
                if (this.isRequired) {
                    clz[clz.length] = 'is-required';
                }
                if(this['class']){
                var classes=this['class'].split(/\s/g);
                    classes.forEach(function(item){
                    clz[clz.length] =item;
                    });
                }
                return clz;
            },
            labelClass: function () {
                return this.isVertical ? 'el-form-item__vertical_label' : 'el-form-item__label';
            },
            labelStyle: function () {
                var ret = {};
                var labelWidth = this.labelWidth || this.form.labelWidth;
                if (labelWidth) {
                    ret.width = labelWidth;
                }
                return ret;
            },
            contentClass: function () {
                return this.isVertical ? 'el-form-item__vertical_content' : 'el-form-item__content';
            },
            contentStyle: function () {
                var ret = {};
                if (this.isVertical) return ret;
                var labelWidth = this.labelWidth || this.form.labelWidth;
                if (labelWidth) {
                    ret.marginLeft = labelWidth;
                }
                return ret;
            },
            form: function () {
                var parent = this.$parent;
                while (parent.$options.name !== 'el-form') {
                    parent = parent.$parent;
                }
                return parent;
            },
            fieldValue: {
                cache: false,
                get: function () {
                    var model = this.form.model;
                    if (!model || !this.prop) {
                        return;
                    }
//			          var temp = this.prop.split(':');
//
//			          return temp.length > 1
//			            ? model[temp[0]][temp[1]]
//			            : model[this.prop];
                    //TODO 修改：允许对象属性嵌套获取值
                    return getProperty(model, this.prop);
                }
            }
        },
        data: function () {
            return {
                valid: true,
                error: '',
                validateDisabled: false,
                validating: false,
                validator: {}
            };
        },
        methods: {
            validate: function (trigger, cb,formdata) {
                var rules = this.getFilteredRule(trigger);
                if (!rules || rules.length === 0) {
                    cb && cb();
                    return true;
                }

                this.validating = true;

                var descriptor = {};
                descriptor[this.prop] = rules;
                var validator = new AsyncValidator(descriptor);
                var model = {};

                model[this.prop] = this.fieldValue;
                var _this = this;
                validator.validate(model, {firstFields: true}, function (errors, fields) {
                    _this.valid = !errors;
                    _this.error = errors ? errors[0].message : '';
                    cb && cb(errors);
                    _this.validating = false;
                },formdata);
            },
            resetField: function () {
                this.valid = true;
                this.error = '';

                var model = this.form.model;
                var value = this.fieldValue;

                if (Array.isArray(value) && value.length > 0) {
                    this.validateDisabled = true;
                    model[this.prop] = [];
                } else if (value) {
                    this.validateDisabled = true;
//			          model[this.prop] = this.initialValue;
                }
            },
            getRules: function () {
                var formRules = this.form.rules;
                var selfRuels = this.rules;

                formRules = formRules ? formRules[this.prop] : [];

                return [].concat(selfRuels || formRules || []);
            },
            getFilteredRule: function (trigger) {
                var rules = this.getRules();

                return rules.filter(function (rule) {
                    return !rule.trigger || rule.trigger.indexOf(trigger) !== -1;
                });
            },
            onFieldBlur: function () {
                this.validate('blur');
            },
            onFieldChange: function () {
                if (this.validateDisabled) {
                    this.validateDisabled = false;
                    return;
                }

                this.validate('change');
            },
            destroyItem: function () {
                var _this = this;
                var destroyMethod = _.once(function () {
                    _this.$dispatch('el.form.removeField', _this);
                });
                return destroyMethod;
            }
        },
        /**
         * 事件配置说明：销毁方法(beforeDestroy)必须在插入DOM方法(attached)之前执行,不然表单组件保存的item对象有问题.
         * 添加删除DOM方法(detached),处理一级路由切换时,不执行销毁方法,只执行attached和detached方法,导致表单校验不执行回调bug.
         */
        attached: function () {
            if (this.prop) {
                var _this = this;
                this.$dispatch('el.form.addField', this);

                /**
                 * TODO 一级路由模块切换时，未清除js状态对应，导致代码重复调用，
                 * configurable值默认为false导致报错,设置为true就行
                 * 此处代码主要功能是表单提供数据重置功能，具体重置机制不适用于集团版前端路由结构，暂不开启
                 */
//					if(!this.initialValue) {
                // Object.defineProperty(this, 'initialValue', {
                // 	value: this.form.model[this.prop]
                // });
//					}

                var rules = this.getRules();

                if (rules.length) {
                    rules.every(function (rule) {
                        if (rule.required) {
                            _this.required = true;
                            return false;
                        }
                    });
                    this.$on('el.form.blur', this.onFieldBlur);
                    this.$on('el.form.change', this.onFieldChange);
                }
                //TODO 创建销毁方法一次性调用句柄，给销毁事件使用
                this.destroyItem = _.once(function () {
                    _this.$dispatch('el.form.removeField', _this);
                });
            }
        },
        detached: function () {
            this.destroyItem();
        },
        beforeDestroy: function () {
            this.destroyItem();
        }
    }
    var comp = Vue.extend(opts);
    Vue.component('el-form-item', comp);
});