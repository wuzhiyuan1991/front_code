define(function(require) {	

	var Vue = require("vue");

	
	var template = '<span v-if="dot" :class="classes" v-el:badge>'+
				        '<slot></slot>'+
				        '<sup :class="dotClasses" v-show="badge"></sup>'+
				    '</span>'+
				    '<span v-else :class="classes" v-el:badge>'+
				        '<slot></slot>'+
				        '<sup v-if="count" :class="countClasses" v-show="badge">{{ finalCount }}</sup>'+
				    '</span>';
			     
			     
	var prefixCls = 'ivu-badge';

	var opts = {
		template :  template,
	    props: {
	        count: [Number, String],
	        dot: {
	            type: Boolean,
	            default: false
	        },
	        overflowCount: {
	            type: [Number, String],
	            default: 99
	        },
	        class: String
	    },
	    computed: {
	        classes: function classes() {
	            return '' + prefixCls;
	        },
	        dotClasses: function dotClasses() {
	            return prefixCls + '-dot';
	        },
	        countClasses: function countClasses() {
                var obj = {};
                obj[this.class] = !!this.class;
                obj[prefixCls] = this.alone;

	            return [prefixCls + '-count',
	                    obj
	                    ];
	        },
	        finalCount: function finalCount() {
	            return parseInt(this.count) >= parseInt(this.overflowCount) ? this.overflowCount + '+' : this.count;
	        },
	        badge: function badge() {
	            var status = false;

	            if (this.count) {
	                status = !(parseInt(this.count) === 0);
	            }

	            if (this.dot) {
	                status = true;
	                if (this.count) {
	                    if (parseInt(this.count) === 0) {
	                        status = false;
	                    }
	                }
	            }

	            return status;
	        }
	    },
	    data: function data() {
	        return {
	            alone: false
	        };
	    },
	    compiled: function compiled() {
	        var child_length = this.$els.badge.children.length;
	        if (child_length === 1) {
	            this.alone = true;
	        }
	    }
	};
	
	
	var component = Vue.extend(opts);
	Vue.component('badge', component);

	return component;
});