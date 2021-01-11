define(function(require) {	

	var Vue = require("vue");
	var prefixCls = 'ivu-tag';
    var iconPrefixCls = 'ivu-icon';
    var template =  '<div v-if="!closed" :class="classes" transition="fade">'+
				         '<span :class="textClasses"><slot></slot></span>'+
				         '<Icon v-if="closable" type="ios-close-empty" @click="close"></Icon>'+
				     '</div>';
//    template =  '<button :type="htmlType" :class="classes" :disabled="disabled"><slot></slot></button>';
//    template =  '<button><slot></slot></button>';

    var Icon = require("./iviewIcon");
    var assist = require("./utils/assist");
    
    
    var opts = {
    	template : template,
        components: { Icon : Icon  },
	    props: {
	        closable: {
	            type: Boolean,
	            default: false
	        },
	        color: {
	            validator: function validator(value) {
	                return assist.oneOf(value, ['blue', 'green', 'red', 'yellow']);
	            }
	        }
	    },
	    data: function data() {
	        return {
	            closed: false
	        };
	    },

	    computed: {
	        classes: function classes() {
				var obj = {};
				obj[prefixCls + '-'+this.color] = !!this.type;
	            return [
					prefixCls,obj
	                    //{
	                    //    [prefixCls + '-'+this.color]: !!this.type
	                    //}
                	]
		    },
	        textClasses: function textClasses() {
	            return prefixCls + '-text';
	        }
		    
	    },
	    methods: {
		        close: function close(e) {
		            this.closed = true;
		            this.$emit('on-close', e);
		        }
		    }
    };

	var component = Vue.extend(opts);
	Vue.component('vi-tag', component);
	Vue.component('Tag', component);
	return component;
    
});