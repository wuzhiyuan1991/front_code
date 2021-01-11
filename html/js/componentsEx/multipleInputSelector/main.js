define(function (require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var clickoutside = require("components/directives/clickoutside");
    var opts = {
        name: "multipleSelectInput",
        template: template,
        directives: {clickoutside: clickoutside},
        data: function () {
            return {
                hover: false
            };
        },
        props: {
            readonly: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            selectedMultiple: {
                type: Array,
                required: true
            },
            idField: {
                type: String,
                default: "id"
            },
            displayField: {
                type: String,
                default: "name"
            },
            textonly: {
                type: Boolean,
                default: false
            },
            typeStyle: {
                type: String,
                default: ''
            }
        },
        computed: {
            inputClazz: function () {
                var oot = {
                    'multiple-select-selection': true
                };
                oot['isReadonly'] = this.readonly;
                oot['ivu-select-hover'] = this.hover;
                oot['ivu-input-disabled'] = this.disabled;
                return ['ivu-select-selection', oot];
            },
            displayText: function () {
                var texts = _.pluck(this.selectedMultiple, this.displayField);
                return texts.join("、");
            }
        },
        methods: {
            //鼠标移入 移出
            doMouseEnter: function () {
                this.hover = true;
            },
            doMouseLeave: function () {
                this.hover = false;
            },
            toggleMenu: function () {
                if (this.disabled || this.readonly) {
                    return false;
                }
                this.$emit('on-click');
            },
            showLabel: function (item){
                return item[this.displayField];
            },
            removeTag: function removeTag(index) {
                if (this.disabled) {
                    return false;
                }
                var removedItem = this.selectedMultiple.splice(index, 1);
                this.$emit("on-remove", removedItem[0]);
            },
            handleClose: function () {
                this.visible = false;
            }
        }
    };

    var component = LIB.Vue.extend(opts);
    LIB.Vue.component('multiple-input-select', component);
    return component;
});