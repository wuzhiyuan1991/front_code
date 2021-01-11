define(function(require) {	

	var Vue = require("vue");

	
	var template = '<li :class="classes" @click.stop="select" :title="showTitle" @mouseout.stop="blur"><slot>{{{ showLabel }}}</slot></li>';
			     
			     
	var prefixCls = 'ivu-select-item';

	var opts = {
		template :  template,
		props: {
            value: {
                type: [String, Number],
                required: true
            },
            label: {
                type: [String, Number]
            },
            disabled: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ''
            }
        },
        componentName: 'select-item',
        data : function() {
            return {
                selected: false,
                index: 0,    // for up and down to focus
                isFocus: false,
                hidden: false,    // for search
                searchLabel: '',    // the value is slot,only for search
                displayText: ''
            }
        },
        computed: {
            classes:function classes() {
                var obj ={};
                obj[prefixCls+'-disabled']=this.disabled;
                obj[prefixCls+'-selected']=this.selected;
                obj[prefixCls+'-focus']=this.isFocus;
                return [
                    prefixCls,obj
                    //{
                    //    [prefixCls+'-disabled']: this.disabled,
                    //    [prefixCls+'-selected']: this.selected,
                    //    [prefixCls+'-focus']: this.isFocus
                    //}
                ]
            },
            showLabel:function showLabel () {
                return (!!this.label) ? this.label : this.value;
            },
            showTitle: function () {
                return this.title || this.displayText;
            }
        },
        methods: {
            select:function select () {
                if (this.disabled) {
                    return false;
                }

                this.$dispatch('on-select-selected', this.value, this.searchLabel);
            },
            blur:function blur () {
                this.isFocus = false;
            },
            queryChange: function (val) {
                var parsedQuery = val.replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g, '\\$1');
                this.hidden = !new RegExp(parsedQuery, 'i').test(this.searchLabel);
            }
        },
        compiled: function () {
            this.searchLabel = this.$el.innerHTML;
            this.displayText = this.$el.textContent;
        },
        events: {
            'on-select-close':function () {
                this.isFocus = false;
            },
            'on-query-change': function(val) {
                this.queryChange(val);
            }
        }
	};
	
	
	var component = Vue.extend(opts);
	Vue.component('i-option', component);
    
});