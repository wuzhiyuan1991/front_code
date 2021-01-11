define(function(require) {	

	var Vue = require("vue");
    var assist = require("./utils/assist");
	var Popper = require("./base/popper");
	

	
	var template = '<div :class="[prefixCls]" @mouseenter="handleShowPopper" @mouseleave="handleClosePopper">'+
					        '<div :class="[prefixCls + \'-rel\']" v-el:reference>'+
					    '<slot></slot>'+
					'</div>'+
					'<div :class="[prefixCls + \'-popper\']" ref="popper" transition="fade" v-el:popper v-show="!disabled && (visible || always)">'+
					    '<div :class="[prefixCls + \'-content\']">'+
					        '<div :class="[prefixCls + \'-arrow\']"></div>'+
					        '<div :class="[prefixCls + \'-inner\']"><slot name="content">{{ content }}</slot></div>'+
					    '</div>'+
					'</div>'+
					'</div>';
			     
			     
	var prefixCls = 'ivu-tooltip';

	var opts = {
		template :  template,
		mixins: [Popper],
        props: {
            placement: {
                validator : function(value) {
                    return assist.oneOf(value, ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end']);
                },
                default: 'bottom'
            },
            content: {
                type: [String, Number],
                default: ''
            },
            delay: {
                type: Number,
                default: 0
            },
            disabled: {
                type: Boolean,
                default: false,
            }
        },
        data:function() {
            return {
                prefixCls: prefixCls,
                visible : false
            }
        },
        methods: {
            handleShowPopper : function() {
            	var _this = this;
                this.timeout = setTimeout(function(){
                	_this.visible = true;
                }, this.delay);
            },
            handleClosePopper : function() {
            	var _this = this;
                clearTimeout(this.timeout);
                _this.visible = false;
            }
        }
	};
	
	
	var component = Vue.extend(opts);
	Vue.component('Tooltip', component);
    
});