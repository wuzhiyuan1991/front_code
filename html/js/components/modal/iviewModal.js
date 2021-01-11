define(function(require) {	

	var Vue = require("vue");
	var Button = require("../iviewButton");
	var Icon = require("../iviewIcon");
    var assist = require("../utils/assist");

	var _caches = [];
	var template =
					'<div :class="wrapClasses">'+
					    '<div :class="maskClasses" v-show="visible" @click="mask"></div>'+
					    '<div :class="classes" :style="styles" v-show="visible">'+
					        '<div :class="prefixCls+\'-content\'">'+
					            '<a :class="prefixCls+\'-close\'" v-if="closable" @click="close">'+
					                '<slot name="close">'+
					                    '<Icon type="ios-close-empty"></Icon>'+
					                '</slot>'+
					            '</a>'+
					            '<div :class="prefixCls+\'-header\'" v-if="showHead" v-el:head><slot name="header"><p>{{ title }}</p></slot></div>'+
					            '<div :class="prefixCls+\'-body\'" class="model-center-box"><slot></slot></div>'+
					            '<div :class="prefixCls+\'-footer\'" v-if="!footerHide">'+
					                '<slot name="footer">'+
					                    '<vi-Button type="ghost" size="large" @click="cancel">{{ cancelText }}</vi-Button>'+
					                    '<vi-Button type="primary" size="large" :loading="buttonLoading" @click="ok">{{ okText }}</vi-Button>'+
					                '</slot>'+
					            '</div>'+
					        '</div>'+
					    '</div>'+
					'</div>';
			     

	var prefixCls = 'ivu-modal';

	var opts = {
		template : template,
	    components: { Icon:Icon, Button:Button},
	    props: {
	        visible: {
	            type: Boolean,
	            default: false
	        },
	        closable: {
	            type: Boolean,
	            default: true
	        },
	        maskClosable: {
	            type: Boolean,
	            default: false
	        },
	        title: {
	            type: String
	        },
	        width: {
	            type: [Number, String],
	            default: 520
	        },
	        okText: {
	            type: String,
	            default: '确定'
	        },
	        cancelText: {
	            type: String,
	            default: '取消'
	        },
	        loading: {
	            type: Boolean,
	            default: false
	        },
	        style: {
	            type: Object
	        },
	        className: {
	            type: String
	        },
	        // for instance
	        footerHide: {
	            type: Boolean,
	            default: false
	        },
			escClose: {
	        	type: Boolean,
				default: true
			}
	    },
	    data: function data() {
	        return {
	            prefixCls: prefixCls,
	            wrapShow: false,
	            showHead: true,
	            buttonLoading: false
	        };
	    },

	    computed: {
	        wrapClasses: function wrapClasses() {
	        	var obj = {};
	        	obj[prefixCls + '-hidden'] = !this.wrapShow;
	        	obj[this.className] = !!this.className;
	            return [
		                    prefixCls + '-wrap', obj
		                    //{
		                    //	[prefixCls + '-hidden'] : !this.wrapShow,
		        	        	//[this.className] : !!this.className
		                    //}
	                    ];
	        },
	        maskClasses: function maskClasses() {
	            return prefixCls + '-mask';
	        },
	        classes: function classes() {
	            return '' + prefixCls;
	        },
	        styles: function styles() {
	            var style = {};

	            var styleWidth = {
	                width: this.width + 'px'
	            };

	            var customStyle = !!this.style ? this.style : {};

//	            (0, _assign2.default)(style, styleWidth, customStyle);
	            _.extend(style, styleWidth, customStyle);

	            return style;
	        }
	    },
	    methods: {
	        close: function close() {
	            this.visible = false;
	            this.$emit('on-cancel');
	        },
	        mask: function mask() {
	            if (this.maskClosable) {
	                this.close();
	            }
	        },
	        cancel: function cancel() {
	            this.close();
	        },
	        ok: function ok() {
	            if (this.loading) {
	                this.buttonLoading = true;
	            } else {
	                this.visible = false;
	            }
	            this.$emit('on-ok');
	        },
	        EscClose: function EscClose(e) {
	        	var comp;
	            if (this.visible && this.escClose) {
	                if (e.keyCode === 27) {
	                	// 但图片查看器弹出时，关闭图片查看器，而不是弹窗
	                	if (document.body.classList.contains("viewer-open")) {
	                		return;
						}
                        comp = _.last(_caches);
						if(comp === this) {
	                    	this.close();
                        	this.$emit('on-close');
                            _caches.pop();
						}
	                }
	            }
	        },
	        checkScrollBar: function checkScrollBar() {
	            var fullWindowWidth = window.innerWidth;
	            if (!fullWindowWidth) {
	                // workaround for missing window.innerWidth in IE8
	                var documentElementRect = document.documentElement.getBoundingClientRect();
	                fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
	            }
	            this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
	            if (this.bodyIsOverflowing) {
	                this.scrollBarWidth = (0, assist.getScrollBarSize)();
	            }
	        },
	        setScrollBar: function setScrollBar() {
	            if (this.bodyIsOverflowing && this.scrollBarWidth !== undefined) {
	                document.body.style.paddingRight = this.scrollBarWidth + 'px';
	            }
	        },
	        resetScrollBar: function resetScrollBar() {
	            document.body.style.paddingRight = '';
	        },
	        addScrollEffect: function addScrollEffect() {
	            this.checkScrollBar();
	            this.setScrollBar();
	            document.body.style.overflow = 'hidden';
	        },
	        removeScrollEffect: function removeScrollEffect() {
	            document.body.style.overflow = '';
	            this.resetScrollBar();
	        }
	    },
	    ready: function ready() {
	        if (this.visible) {
	            this.wrapShow = true;
	        }

	        var showHead = true;

	        if (this.$els.head && this.$els.head.innerHTML == '<p></p>' && !this.title) {
	            showHead = false;
	        }

	        this.showHead = showHead;

	        // ESC close
	        document.addEventListener('keydown', this.EscClose);
	    },
	    beforeDestroy: function beforeDestroy() {
	        document.removeEventListener('keydown', this.EscClose);
	    },

	    watch: {
	        visible: function visible(val) {
	            var _this = this;

	            if (val === false) {
	                this.buttonLoading = false;
	                setTimeout(function () {
	                    _this.wrapShow = false;
	                }, 300);
	                this.removeScrollEffect();
	            } else {
	                this.wrapShow = true;
	                this.addScrollEffect();
	                _caches.push(this);
	            }
	        }
	    }
	};
	
	
	var component = Vue.extend(opts);
//	Vue.component('Modal', component);
	Vue.component('modal', component);
    
});