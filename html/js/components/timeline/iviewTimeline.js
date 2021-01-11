define(function(require) {	

	var Vue = require("vue");

	
	var template = '<ul :class="classes">'+
				         '<slot></slot>'+
				     '</ul>';
			     
			     
	var prefixCls = 'ivu-timeline';

	var opts = {
		template :  template,
		props: {
            pending: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            classes: function  classes() {
                var obj ={};
                obj[prefixCls+'-pending']=this.pending;
                return [
                    prefixCls,
                    //{
                    //    [prefixCls+'-pending']: this.pending
                    //}
                ]
            }
        }
	};
	
	
	var component = Vue.extend(opts);
	Vue.component('timeline', component);

	return component;
});