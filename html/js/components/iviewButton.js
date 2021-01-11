define(function(require) {	

	var Vue = require("vue");
    var Icon = require("./iviewIcon");
    var assist = require("./utils/assist");
	
    var template =  '<button :type="htmlType" :class="classes" :disabled="disabled">'+
				         '<i :class="loadingIconClasses" v-if="loading"></i>'+
				         '<i :class="typeIconClasses" v-if="icon && !loading"></i>'+
				         '<span v-if="showSlot" style="font-weight: normal;" v-el:slot><slot></slot></span>'+
				     '</button>'+
				     '';
    
	var prefixCls = 'ivu-btn';
    var iconPrefixCls = 'ivu-icon';

    
    var opts = {
    	template : template,
        components: { Icon : Icon },
        props: {
            type: {
                validator : function(value) {
                    //return assist.oneOf(value, ['primary', 'ghost']);
                    return assist.oneOf(value, ['primary', 'ghost', 'dashed', 'text', 'info', 'success', 'warning', 'error']);
                    //return (0, _assist.oneOf)(value, ['primary', 'ghost', 'dashed', 'text', 'info', 'success', 'warning', 'error']);
                }
            },
            shape: {
                validator : function(value) {
                    return assist.oneOf(value, ['circle', 'circle-outline']);
                }
            },
            size: {
                validator: function(value) {
                    return assist.oneOf(value, ['small', 'large']);
                }
            },
            loading: Boolean,
            disabled: Boolean,
            htmlType: {
                default: 'button',
                validator: function(value) {
                    return assist.oneOf(value, ['button', 'submit', 'reset']);
                }
            },
            icon: String,
            long: {
                type: Boolean,
                default: false
            }
        },
        data:function () {
            return {
                showSlot: true
            }
        },
        computed: {
        	 classes: function() {

                 var obj = {};
                 obj[prefixCls + '-'+this.type] = !!this.type;
                 obj[prefixCls+'-long']= this.long,
                 obj[prefixCls + '-'+this.shape] = !!this.shape;
                 obj[prefixCls + '-'+this.size] = !!this.size;
                 obj[prefixCls + '-loading'] =  this.loading != null && this.loading;
                 obj[prefixCls+'-icon-only']= !this.showSlot && (!!this.icon || this.loading);
                return [
                    prefixCls,obj
                    //{
                    //    [prefixCls + '-'+this.type]: !!this.type,
                    //    [prefixCls + '-'+this.shape]: !!this.shape,
                    //    [prefixCls + '-'+this.size]: !!this.size,
                    //    [prefixCls + '-loading']: this.loading != null && this.loading
                    //}
                    //    [`${prefixCls}-${this.type}`]: !!this.type,
                    // [`${prefixCls}-long`]: this.long,
                    // [`${prefixCls}-${this.shape}`]: !!this.shape,
                    // [`${prefixCls}-${this.size}`]: !!this.size,
                    // [`${prefixCls}-loading`]: this.loading != null && this.loading,
                    // [`${prefixCls}-icon-only`]: !this.showSlot && (!!this.icon || this.loading)
                ]
            },
            loadingIconClasses: function() {
                return iconPrefixCls + ' ivu-load-loop ' +  iconPrefixCls + '-load-c';
            },
            typeIconClasses: function() {
                var opt ={};
                opt[iconPrefixCls + '-'+this.icon] = !!this.icon;
                return [
                    iconPrefixCls,opt
                    //{
                    //    [prefixCls + '-'+this.type]: !!this.icon
                    //}
                ]
            },
            compiled: function() {
                this.showSlot = this.$els.slot.innerHTML.replace(/\n/g, '').replace(/<!--[\w\W\r\n]*?-->/gmi, '') !== '';
    }
        }
    };

	var comp = Vue.extend(opts);
	Vue.component('vi-button', comp);
    Vue.component('iv-button', comp);
    
});