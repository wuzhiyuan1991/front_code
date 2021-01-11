define(function(require) {	

	var Vue = require("vue");
	
	var template = '<div :class="classes"> <Icon v-if="showClose" type="close-circled" @click.stop.prevent="doClose"></Icon>'+
				        '<slot></slot>'+
				    '</div>';
			     
			     
	var prefixCls = 'lite-box';

	var opts = {
		template :  template,
        props: {
        	showClose : {
        		type : Boolean,
        		default : true
        	},
            shape: {
        	    type: String,
                default: 'square'
            }
        },
        data: function data(){
            return {
                showHead: true,
                showExtra: true
            }
        },
        computed: {
            classes: function classes() {
                var oot ={};
                oot[prefixCls + '-bordered']=this.bordered && !this.shadow;
                oot[prefixCls + '-dis-hover']=this.disHover || this.shadow;
                oot[prefixCls + '-shadow']=this.shadow;
                oot[prefixCls + '-rect'] = this.shape === 'rect';
                oot[prefixCls] = this.shape !== 'rect'
                return [
                     oot
                ]
            }
        },
        methods: {
        	doClose : function() {
        		this.$emit("on-close");
        	}
        }
	};
	
	var component = Vue.extend(opts);
	Vue.component('lite-box', component);
    
});