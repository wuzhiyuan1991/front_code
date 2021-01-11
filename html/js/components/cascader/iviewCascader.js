define(function(require) {
	var Vue = require("vue");
	var template = require("text!./iviewCascader.html");
	require('../iviewInput');
    var Dropdown = require('../select/iviewDropDown');
    var Icon = require( '../iviewIcon');
    var Caspanel = require('./iviewCaspanel');
    var clickoutside = require('../directives/clickoutside');
    var oneOf = require('../utils/assist').oneOf;

    var prefixCls = 'ivu-cascader';

    var opts = {
    	template: template,
        components: { 'Caspanel':Caspanel },
        directives: { "clickoutside":clickoutside },
        props: {
            data: {
                type: Array,
                'default': function() {
                    return []
                }
            },
            value: {
                type: Array,
                'default': function() {
                    return []
                }
            },
            disabled: {
                type: Boolean,
                'default': false
            },
            clearable: {
                type: Boolean,
                'default': true
            },
            placeholder: {
                type: String,
                'default': '请选择'
            },
            size: {
                validator: function(value) {
                    return oneOf(value, ['small', 'large']);
                }
            },
            trigger: {
                validator: function(value) {
                    return oneOf(value, ['click', 'hover']);
                },
                'default': 'click'
            },
            changeOnSelect: {
                type: Boolean,
                'default': false
            },
            renderFormat: {
                type: Function,
                'default': function(label) {
                    return label.join(' / ');
                }
            }
        },
        data: function() {
            return {
                prefixCls: prefixCls,
                visible: false,
                selected: [],
                tmpSelected: []
            }
        },
        computed: {
            classes: function() {
            	var obj = {};
            	obj[prefixCls+'-show-clear'] = this.showCloseIcon;
            	obj[prefixCls+'-visible'] = this.visible;
            	obj[prefixCls+'-disabled'] = this.disabled;
                return [
                        prefixCls,obj
                ]
            },
            showCloseIcon: function() {
                return this.value && this.value.length && this.clearable;
            },
            displayRender: function() {
                var label = [];
                for (var i = 0; i < this.selected.length; i++) {
                    label.push(this.selected[i].label);
                }

                return this.renderFormat(label, this.selected);
            }
        },
        methods: {
            clearSelect: function() {
                var oldVal = JSON.stringify(this.value);
                this.value = this.selected = this.tmpSelected = [];
                this.handleClose();
                this.emitValue(this.value, oldVal);
                this.$broadcast('on-clear');
            },
            handleClose: function() {
                this.visible = false;
            },
            onFocus: function() {
                this.visible = true;
                if (!this.value.length) {
                    this.$broadcast('on-clear');
                }
            },
            updateResult: function(result) {
                this.tmpSelected = result;
            },
            updateSelected: function(init) {
            	init = init || false;
                if (!this.changeOnSelect || init) {
                    this.$broadcast('on-find-selected', this.value);
                }
            },
            emitValue: function(val, oldVal) {
                if (JSON.stringify(val) !== oldVal) {
                    this.$emit('on-change', this.value, JSON.parse(JSON.stringify(this.selected)));
                }
            }
        },
        ready: function() {
            this.updateSelected(true);
        },
        events: {
            // lastValue: is click the final val
            // fromInit: is this emit from update value
            'on-result-change' : function(lastValue, changeOnSelect, fromInit) {
                if (lastValue || changeOnSelect) {
                    var oldVal = JSON.stringify(this.value);
                    this.selected = this.tmpSelected;

                    var newVal = [];
                    this.selected.forEach(function(item){
                        newVal.push(item.value);
                    });

                    if (!fromInit) {
                        this.value = newVal;
                        this.emitValue(this.value, oldVal);
                    }
                }
                if (lastValue && !fromInit) {
                    this.handleClose();
                }
            }
        },
        watch: {
            visible: function(val) {
                if (val) {
                    if (this.value.length) {
                        this.updateSelected();
                    }
                }
            },
            value:function(){
                if (this.value) {
                	if(this.value.length > 0){
                		this.updateSelected();
                	}else{//清空
                		this.selected = this.tmpSelected = [];
                        this.handleClose();
                        this.$broadcast('on-clear');
                	}
                }
            }
        }
    }
    var component = Vue.extend(opts);
//	Vue.component('calendar', component);
    return component;
});