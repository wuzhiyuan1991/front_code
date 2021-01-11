define(function (require) {
    var Vue = require("vue");
    var template = '<div :class="formClass">'
        + '<slot></slot>'
        + '</div>';
    var opts = {
        template: template,
        props: {
            model: {
                type: Object,
                required: true
            },
            rules: Object,
            isLabelVertical: {
                type: Boolean,
                'default': false
            },
            labelPosition: String,
            labelWidth: {
                type: String,
                'default': '110px'
            },
            labelSuffix: {
                type: String,
                'default': ''
            },
            readonly: {
                type: Boolean,
                'default': false
            }
        },
        data: function () {
            return {
                fields: {},
                fieldLength: 0
            };
        },
        computed: {
            formClass: function () {
                var clz = [];
                if (this.isLabelVertical) {
                    clz[clz.length] = 'el-form_vertical';
                } else {
                    clz[clz.length] = 'el-form';
                }
                if (this.labelPosition) {
                    clz[clz.length] = 'el-form--label-' + this.labelPosition;
                }
//		    		return this.isLabelVertical ? 'el-form_vertical' : 'el-form';
                return clz;
            }
        },
        created: function () {
            this.$on('el.form.addField', function (field) {
                this.fields[field.prop] = field;
                this.fieldLength++;
            });
            /* istanbul ignore next */
            this.$on('el.form.removeField', function (field) {
                if (this.fields[field.prop]) {
                    delete this.fields[field.prop];
                    this.fieldLength--;
                }
            });
        },
        methods: {
            resetFields: function () {
                for (var prop in this.fields) {
                    var field = this.fields[prop];
                    field.resetField();
                }
            },
            validate: function (callback) {
                var count = 0;
                var valid = true;
                for (var prop in this.fields) {
                    var _this = this;
                    var field = this.fields[prop];
                    field.validate('',function (errors) {
                        if (errors) {
                            valid = false;
                        }

                        if (++count === _this.fieldLength) {
                            callback(valid);
                        }
                    },this.model);
                }
            },
            validateField: function (prop, cb) {
                var field = this.fields[prop];
                if (!field) {
                    throw new Error('must call validateField with valid prop string!');
                }

                field.validate('', cb);
            }
        }
    };
    var comp = Vue.extend(opts);
    Vue.component('el-form', comp);
});