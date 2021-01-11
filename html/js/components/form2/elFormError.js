define(function(require) {	

	var Vue = require("vue");
    var Button = require("../iviewButton");
    var assist = require("../utils/assist");
	var clickoutside = require("../directives/clickoutside");
	var Popper = require("../base/popper");
	

	
	var template = '<div> '+
				            '<div '+
				                ':class="[prefixCls + \'-rel\']" @mouseover="showInfo"'+
				                'v-el:reference > '+
				                '<slot></slot> '+
				            '</div> '+
				            '<div v-if="!readonly" :class="[prefixCls + \'-popper\']" :style="styles" transition="fade" v-el:popper v-show="visible"> '+
				                '<div :class="[prefixCls + \'-content\']"> '+
				                    '<div :class="[prefixCls + \'-arrow\']"></div> '+
				                    '<div :class="[prefixCls + \'-inner\']"> '+
			                            '<div style="color: red;text-align: center;padding:3px 0;" :class="[prefixCls + \'-body-content\']"><slot name="content">{{ content }}</slot></div> '+
				                    '</div> '+
				                '</div> '+
				            '</div> '+
				        '</div>';
			     
			     
	var prefixCls = 'ivu-poptip';

	var opts = {
		template :  template,
		mixins: [Popper],
        directives: { clickoutside:clickoutside },
        components: { Button:Button },
        props: {
			readonly:{
				type : Boolean,
				'default':false
			},
        	isError : {
        		type : Boolean,
        		'default':false
        	},
            placement: {
                validator : function(value) {
                    return assist.oneOf(value, ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end']);
                },
                'default': 'top'
            },
            title: {
                type: [String, Number]
            },
            content: {
                type: [String, Number],
                'default': ''
            },
            width: {
                type: [String, Number]
            }
        },
        data : function() {
            return {
                prefixCls: prefixCls,
                visible:false,
                hideInfoDelay:1000,//延迟隐藏错误信息,默认1s;
                showTitle: true
            }
        },
        computed: {
            styles : function() {
                var style = {};
                if (!!this.width) {
                    style.width = this.width + 'px';
                }
                return style;
//            },
//            errorStyles : function(){
//            	return this.isError ? "border: solid 1px #D90000; border-radius: 6px;" : ""; 
            }
        },
        watch:{
        	isError : function(){
        		if(this.isError) {
        			this.visible = true;
        		}
        	},
        	visible : function(){
        		if(this.visible){
        			var _this = this;
        			var target = setTimeout(function(){
        				_this.visible = false;
        			},this.hideInfoDelay);
        		}
        	}
        },
        methods:{
        	showInfo:function(){
        		if(this.isError) {
        			this.visible = true;
        		}
        	}
        }
	};
	
	
	var component = Vue.extend(opts);
	return component;
});