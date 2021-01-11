define(function(require) {	

	var Vue = require("vue");

	
	var template = '<div :class="classes">'+
				        '<div :class="headClasses" v-if="showHead" v-el:head><slot name="title"></slot></div>'+
				        '<div :class="extraClasses" v-if="showExtra" v-el:extra><slot name="extra"></slot></div>'+
				        '<div :class="bodyClasses" v-show="showContent"><slot></slot></div>'+
				    '</div>';
			     
			     
	var prefixCls = 'ivu-card';

	var opts = {
		template :  template,
        props: {
            bordered: {
                type: Boolean,
                'default': true
            },
            disHover: {
                type: Boolean,
                'default': false
            },
            shadow: {
                type: Boolean,
                'default': false
            },
            showContent: {
                type: Boolean,
                'default': true
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
                oot[prefixCls + '-shadow']=this.shadow
                return [
                     prefixCls, oot
                    //{
                    //    [prefixCls + '-bordered']: this.bordered && !this.shadow,
                    //    [prefixCls + '-dis-hover']: this.disHover || this.shadow,
                    //    [prefixCls + '-shadow']: this.shadow
                    //}
                ]
            },
            headClasses:function headClasses() {
                return prefixCls + '-head';
            },
            extraClasses: function extraClasses() {
                return prefixCls + '-extra';
            },
            bodyClasses : function bodyClasses() {
                return prefixCls + '-body';
            }
        },
        compiled: function  compiled() {
            this.showHead = this.$els.head.innerHTML != '';
            this.showExtra = this.$els.extra.innerHTML != '';
        }
	};
	
	
	var component = Vue.extend(opts);
	Vue.component('card', component);
    
});