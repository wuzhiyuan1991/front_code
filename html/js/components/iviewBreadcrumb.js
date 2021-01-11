define(function(require) {	

	var Vue = require("vue");
	
	var template = '<div :class="classes">'+
				        '<slot></slot>'+
				    '</div>'+
				    '';
	
	var prefixCls = 'ivu-breadcrumb';
	
	var opts = {
		template : template,
		props: {
	        separator: {
	            type: String,

	            default: '/'
	        }
	    },
	    computed: {
	        classes: function classes() {
	            return '' + prefixCls;
	        }
	    },
	    compiled: function compiled() {
	        this.updateChildren();
	    },

	    methods: {
	        updateChildren: function updateChildren() {
	            var _this = this;

	            this.$children.forEach(function (child) {
	                child.separator = _this.separator;
	            });
	        }
	    },
	    watch: {
	        separator: function separator() {
	            this.updateChildren();
	        }
	    }
	};
	
	
	var component = Vue.extend(opts);
	Vue.component('iv-breadcrumb', component);
	Vue.component('Breadcrumb', component);

	return component;
});



