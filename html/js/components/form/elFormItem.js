define(function (require) {
    var Vue = require("vue");
//	var emitter = require("./emitter");//暂不使用
    var AsyncValidator = require("../async-validator/indexform");
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
            label: String,
            labelWidth: String,
            labelClass: {
                type: String,
                'default': 'dialogLable'
            },
            prop: String,
            required: Boolean,
            placement: {
                type: String,
                'default': 'right'
            },
            rules: [Object, Array]
        },
        computed: {
            labelStyle: function () {
                var ret = {};
                var labelWidth = this.labelWidth || this.form.labelWidth;
                if (labelWidth) {
                    ret.width = labelWidth;
                }
                return ret;
            },
            contentStyle: function () {
                var ret = {};
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
                validator: {},
                isRequired: false
            };
        },
        methods: {
            validate: function (trigger, cb) {
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
                });
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
                    model[this.prop] = this.initialValue;
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
            }
        },
        attached: function () {
            if (this.prop) {
                this.$dispatch('el.form.addField', this);
                Object.defineProperty(this, 'initialValue', {
                    value: this.form.model[this.prop]
                });

                var rules = this.getRules();

                if (rules.length) {
                    var _this = this;
                    rules.every(function (rule) {
                        if (rule.required) {
                            _this.isRequired = true;
                            return false;
                        }
                    });
                    this.$on('el.form.blur', this.onFieldBlur);
                    this.$on('el.form.change', this.onFieldChange);
                }
            }
        },
        beforeDestroy: function () {
            this.$dispatch('el.form.removeField', this);
        }
    }
    var comp = Vue.extend(opts);
    Vue.component('el-form-item', comp);
});