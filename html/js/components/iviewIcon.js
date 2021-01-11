define(function(require) {	

	var Vue = require("vue");

	
	var template = '<i :class="classes" :style="styles"><span><slot></slot></span></i>';
			     
			     
	var prefixCls = 'ivu-icon';

	var opts = {
		template :  template,
	    props: {
	        type: String,
	        size: [Number, String]
	    },
	    computed: {
	        classes: function classes() {
	            return prefixCls + ' ' + prefixCls + '-' + this.type;
	        },
	        styles: function styles() {
	            if (!!this.size) {
	                return {
	                    'font-size': this.size + 'px'
	                };
	            } else {
	                return {};
	            }
	        }
	    }
	};
	
	
	var component = Vue.extend(opts);
	Vue.component('iv-icon', component);
	Vue.component('icon', component);
    
});