define(function(require) {

	var Vue = require("vue");
    var Button = require("./iviewButton");
    var assist = require("./utils/assist");
	var clickoutside = require("./directives/clickoutside");
	var Popper = require("./base/popper");



	var template = '<div '+
				        ':class="classes" '+
				            '@mouseenter="handleMouseenter" '+
				            '@mouseleave="handleMouseleave" '+
				            'v-clickoutside="handleClose"> '+
				            '<div '+
				                ':class="[prefixCls + \'-rel\']" '+
				                'v-el:reference '+
				                '@click="handleClick" '+
				                '@mousedown="handleFocus" '+
				                '@mouseup="handleBlur"> '+
				                '<slot></slot> '+
				            '</div> '+
				            '<div :class="[prefixCls + \'-popper\']" :style="styles" transition="fade" v-el:popper v-show="visible"> '+
				                '<div :class="[prefixCls + \'-content\']"  :style="{ \'margin-top\': scrolled + \'px\' }"> '+
				                    '<div :class="[prefixCls + \'-arrow\']"></div> '+
				                    '<div :class="[prefixCls + \'-inner\']" v-if="confirm"> '+
				                        '<div :class="[prefixCls + \'-body\']"> '+
				                            '<i class="ivu-icon ivu-icon-help-circled"></i> '+
				                            '<div :class="[prefixCls + \'-body-message\']"><slot name="title">{{ title }}</slot></div> '+
				                        '</div> '+
				                        '<div :class="[prefixCls + \'-footer\']"> '+
				                            '<vi-button type="ghost" size="small" @click="cancel">{{ cancelText }}</vi-button> '+
				                            '<vi-button type="primary" size="small" @click="ok">{{ okText }}</vi-button> '+
				                        '</div> '+
				                    '</div> '+
				                    '<div :class="[prefixCls + \'-inner\']" v-if="!confirm"> '+
				                        '<div :class="[prefixCls + \'-title\']" v-if="showTitle" v-el:title><slot name="title">{{ title }}</slot></div> '+
				                        '<div :class="[prefixCls + \'-body\']"> '+
				                            '<div :class="[prefixCls + \'-body-content\']" @click="handleContentClick"><slot name="content">{{ content }}</slot></div> '+
				                        '</div> '+
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
            trigger: {
                validator : function(value) {
                    return assist.oneOf(value, ['click', 'focus', 'hover']);
                },
                default: 'click'
            },
            placement: {
                validator : function(value) {
                    return assist.oneOf(value, ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end']);
                },
                default: 'top'
            },
            title: {
                type: [String, Number]
            },
            content: {
                type: [String, Number],
                default: ''
            },
            width: {
                type: [String, Number]
            },
            confirm: {
                type: Boolean,
                default: false
            },
            okText: {
                type: String,
                default: '确定'
            },
            cancelText: {
                type: String,
                default: '取消'
            },
            //anson tag
            hideTrigger: {
                type: Number,
            	default: false
            },
            dropdownMenu: {
            	type : Boolean,
            	default : false
            },
            scrolled: {
                type: Number,
                default: false
            },
            autoFocusInput: {
                type: Boolean,
                default: false
            }
        },
        data : function() {
            return {
                prefixCls: prefixCls,
                showTitle: true,
                visible: false
            }
        },
        computed: {
            classes : function() {
            	var obj = {};
            	obj[prefixCls + '-confirm'] = this.confirm;
                return [
                    '' + prefixCls,
                    obj
                ]
            },
            styles : function() {
                var style = {};
                if (!!this.width) {
                    style.width = this.width + 'px';
                }
                return style;
            }
        },
        methods: {
            handleClick : function() {
                if (this.confirm) {
                    this.visible = !this.visible;
                    return true;
                }
                if (this.trigger !== 'click') {
                    return false;
                }
                this.visible = !this.visible;
                if(this.visible && this.autoFocusInput) {
                    this.$nextTick(function () {
                        var input = this.$el.querySelector("input");
                        if(input && !input.parentNode.classList.contains("ivu-date-picker-editor")) {
                            input.focus({preventScroll:true});
                        }
                    })
                }
            },
            handleContentClick : function() {
                if (this.dropdownMenu) {
                    this.visible = false;
                    return false;
                }
            },
            handleClose : function() {
                if (this.confirm) {
                    this.visible = false;
                    return true;
                }
                if (this.trigger !== 'click') {
                    return false;
                }
                this.visible = false;
            },
            handleFocus : function() {
                if (this.trigger !== 'focus' || this.confirm) {
                    return false;
                }
                this.visible = true;
            },
            handleBlur : function() {
                if (this.trigger !== 'focus' || this.confirm) {
                    return false;
                }
                this.visible = false;
            },
            handleMouseenter : function() {
                if (this.trigger !== 'hover' || this.confirm) {
                    return false;
                }
                this.visible = true;
            },
            handleMouseleave : function() {
                if (this.trigger !== 'hover' || this.confirm) {
                    return false;
                }
                this.visible = false;
            },
            cancel : function() {
                this.visible = false;
                this.$emit('on-cancel');
            },
            ok : function() {
                this.visible = false;
                this.$emit('on-ok');
            }
        },
        //anson tag
        watch : {
        	hideTrigger : function(val) {
                this.visible = false;
        	}
        },
        ready : function() {
            if (!this.confirm) {
                this.showTitle = this.$els.title.innerHTML != '';
            }
            this.$on("close", this.handleClose);
        }
	};


	var component = Vue.extend(opts);
	Vue.component('poptip', component);

});