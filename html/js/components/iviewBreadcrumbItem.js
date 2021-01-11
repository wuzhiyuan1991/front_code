define(function(require) {	

	var Vue = require("vue");
	
	var template = '<span>'+
			         '<a v-if="href" :href="href" :class="linkClasses">'+
			             '<slot></slot>'+
			         '</a>'+
			         '<span v-else :class="linkClasses">'+
			             '<slot></slot>'+
			         '</span>'+
			         '<span :class="separatorClasses">'+
			             '<slot name="separator">{{{ separator }}}</slot>'+
			         '</span>'+
			     '</span>'+
				    '';
	
	var prefixCls = 'ivu-breadcrumb-item';
	
	var opts = {
		template : template,
		props: {
	        href: {
	            type: String
	        },
	        separator: {
	            type: String,
	            default: '/'
	        }
	    },
	    computed: {
	        linkClasses: function linkClasses() {
	            return prefixCls + '-link';
	        },
	        separatorClasses: function separatorClasses() {
	            return prefixCls + '-separator';
	        }
	    }
	};
	
	
	var component = Vue.extend(opts);
	Vue.component('breadcrumb-item', component);

	return component;
});



