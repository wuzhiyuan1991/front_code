define(function(require) {
	var Vue = require("vue");
	var template = require("text!./iviewCaspanel.html");
	var Casitem = require('./iviewCasitem');
	var oneOf = require('../utils/assist').oneOf;

    var opts = {
        name: 'Caspanel',
        template: template,
        components: { 'Casitem':Casitem },
        props: {
            data: {
                type: Array,
                'default': function() {
                    return []
                }
            },
            sublist: {
                type: Array,
                'default': function() {
                    return []
                }
            },
            disabled: Boolean,
            changeOnSelect: Boolean,
            trigger: String,
            prefixCls: String
        },
        data: function() {
            return {
                tmpItem: {},
                result: []
            }
        },
        methods: {
            handleClickItem : function(item) {
                if (this.trigger !== 'click' && item.children) return;
                this.handleTriggerItem(item);
            },
            handleHoverItem : function(item) {
                if (this.trigger !== 'hover' || !item.children) return;
                this.handleTriggerItem(item);
            },
            handleTriggerItem : function(item, fromInit) {
            	fromInit = fromInit || false
                if (item.disabled) return;

                // return value back recursion
                var backItem = this.getBaseItem(item);
                this.tmpItem = backItem;
                this.emitUpdate([backItem]);

                if (item.children && item.children.length){
                    this.sublist = item.children;
                    this.$dispatch('on-result-change', false, this.changeOnSelect, fromInit);
                } else {
                    this.sublist = [];
                    this.$dispatch('on-result-change', true, this.changeOnSelect, fromInit);
                }
            },
            updateResult : function(item) {
                this.result = [this.tmpItem].concat(item);
                this.emitUpdate(this.result);
            },
            getBaseItem : function(item) {
                var backItem = Object.assign({}, item);
                if (backItem.children) {
                    delete backItem.children;
                }

                return backItem;
            },
            emitUpdate : function(result) {
                if (this.$parent.$options.name === 'Caspanel') {
                    this.$parent.updateResult(result);
                } else {
                    this.$parent.$parent.updateResult(result);
                }
            }
        },
        watch: {
            data: function() {
                this.sublist = [];
            }
        },
        events: {
            'on-find-selected': function(val) {
            	var _this = this;
                var value = _.clone(val);
                for (var i = 0; i < value.length; i++) {
                    for (var j = 0; j < this.data.length; j++) {
                        if (value[i] === this.data[j].value) {
                            this.handleTriggerItem(this.data[j], true);
                            value.splice(0, 1);
                            this.$nextTick(function(){
                            	_this.$broadcast('on-find-selected', value);
                            });
                            return false;
                        }
                    }
                }
            },
            'on-clear': function() {
                this.sublist = [];
                this.tmpItem = {};
            }
        }
    }
    var component = Vue.extend(opts);
//	Vue.component('calendar', component);
    return component;
});