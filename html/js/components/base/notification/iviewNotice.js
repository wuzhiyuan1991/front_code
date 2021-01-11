define(function(require) {	

	var Vue = require("vue");

	var template = 
				    '<div :class="classes"' +
                    '" :style="style" :transition="transitionName">'+
				        '<div :class="baseClass+\'-content\'" v-el:content   :style="closable?\'padding: 8px 30px;\':\'\'" >{{{ content }}}</div>'+
				        '<a  style="position:absolute;right:50%;top:10px;color:#666" :class="baseClass+\'-close\'" @click="close" v-if="closable">'+
				            // '<i class="ivu-icon ivu-icon-ios-close-empty"></i>'+
        '<Icon type="close-round"  style="font-size: 12px;"></Icon>'+
				        '</a>'+
				   '</div>'+
					'';

	var opts = {
		template : template,
		props: {
            prefixCls: {
                type: String,
                default: ''
            },
            duration: {
                type: Number,
                default: 2.5
            },
            content: {
                type: String,
                default: ''
            },
            style: {
                type: Object,
                default: function() {
                    return {
                        right: '50%'
                    }
                }
            },
            closable: {
                type: Boolean,
                default: false
            },
            className: {
                type: String
            },
            key: {
                type: String,
                required: true
            },
            onClose: {
                type: Function
            },
            transitionName: {
                type: String
            }
        },
        computed: {
            baseClass: function baseClass() {
                return this.prefixCls + '-notice';
            },
            classes:function classes () {
            	
	        	var obj = {};
	        	obj[this.baseClass + '-closable'] = this.closable;
	        	obj[this.className] = !!this.className;
                return [
                        this.baseClass,
                        //{
                        //	[this.baseClass + '-closable'] : this.closable,
            	        	//[this.className] : !!this.className
                        //
                        //}
                ]
            },
            contentClasses: function contentClasses() {
                return this.baseClass + '-content';
            }
        },
        methods: {
            clearCloseTimer: function clearCloseTimer() {
                if (this.closeTimer) {
                    clearTimeout(this.closeTimer);
                    this.closeTimer = null;
                }
            },
            close: function  close() {
                this.clearCloseTimer();
                this.onClose();
                this.$parent.close(this.key);
            }
        },
        compiled: function compiled() {
            this.clearCloseTimer();

            if (this.duration !== 0) {
            	var _this = this;
//                this.closeTimer = setTimeout(() => {
//                    this.close();
//                }, this.duration * 1000)
                this.closeTimer = setTimeout(function () {
                	_this.close();
	            }, this.duration * 1000);
            }
        },
        beforeDestroy: function beforeDestroy() {
            this.clearCloseTimer();
        }
	};
	
	
	var component = Vue.extend(opts);
	Vue.component('notice', component);
    
});
