define(function(require) {
	var Vue = require("vue");
	var Icon = require("../iviewIcon");
//	var iButton = require("../iviewButton");
	var template = '<div :class="prefixCls + \'-operation\'">'
    +'<iv-button type="primary" size="small" :disabled="!rightActive" @click="moveToLeft">'
    +'<Icon type="ios-arrow-left"></Icon> {{ operations[0] }}'
    +'</iv-button>'
    +'<iv-button type="primary" size="small" :disabled="!leftActive" @click="moveToRight">'
    +'{{ operations[1] }} <Icon type="ios-arrow-right"></Icon>'
    +'</iv-button>'
    +'</div>';
	var opts = {
			template : template,
	        components: { "Icon":Icon },
	        props: {
	            prefixCls: String,
	            operations: Array,
	            leftActive: Boolean,
	            rightActive: Boolean
	        },
	        methods: {
	            moveToLeft : function() {
					if(this.$parent.moveTo){
						this.$parent.moveTo('left');
					}else{
						this.$emit("moveleft")
					}
	            },
	            moveToRight : function() {
					if(this.$parent.moveTo){
						this.$parent.moveTo('right');
					}else{
						this.$emit("moveright")
					}
	            }
	        }
	    }
	var component = Vue.extend(opts);
	return component;
});