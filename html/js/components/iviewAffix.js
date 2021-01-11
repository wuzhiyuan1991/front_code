define(function(require) {	

	var Vue = require("vue");
	
	var template = '<div>'+
					        '<div :class="classes" :style="styles">'+
					    '<slot></slot>'+
					'</div>'+
					'</div>';
			     
			     
	var prefixCls = 'ivu-affix';

	
	function getScroll(target, top) {
        var prop = top ? 'pageYOffset' : 'pageXOffset';
        var method = top ? 'scrollTop' : 'scrollLeft';

        var ret = target[prop];

        if (typeof ret !== 'number') {
            ret = window.document.documentElement[method];
        }
        return ret;
    }

    function getOffset(element) {
        var rect = element.getBoundingClientRect();

        var scrollTop = getScroll(window, true);
        var scrollLeft = getScroll(window);

        var docEl = window.document.body;
        var clientTop = docEl.clientTop || 0;
        var clientLeft = docEl.clientLeft || 0;

        return {
            top: rect.top + scrollTop - clientTop,
            left: rect.left + scrollLeft - clientLeft
        }
    }
    
	var opts = {
		template :  template,
        props: {
            offsetTop: {
                type: Number,
                default: 0
            },
            offsetBottom: {
                type: Number
            }
        },
        data : function() {
            return {
                affix: false,
                styles: {}
            }
        },
        computed: {
            offsetType : function() {
                var type = 'top';
                if (this.offsetBottom >= 0) {
                    type = 'bottom';
                }

                return type;
            },
            classes : function() {
            	var obj = {};
            	obj[prefixCls] = this.affix;
                return [
                    obj
                ]
            }
        },
        ready : function() {
            window.addEventListener('scroll', this.handleScroll, false);
            window.addEventListener('resize', this.handleScroll, false);
        },
        beforeDestroy : function() {
            window.removeEventListener('scroll', this.handleScroll, false);
            window.removeEventListener('resize', this.handleScroll, false);
        },
        methods: {
            handleScroll : function() {
                var affix = this.affix;
                var scrollTop = getScroll(window, true);
                var elOffset = getOffset(this.$el);
                var windowHeight = window.innerHeight;
                var elHeight = this.$el.getElementsByTagName('div')[0].offsetHeight;

                // Fixed Top
                if ((elOffset.top - this.offsetTop) < scrollTop && this.offsetType == 'top' && !affix) {
                    this.affix = true;
                    this.styles = {
                        top: this.offsetTop + 'px',
                        left: elOffset.left + 'px',
                        width: this.$el.offsetWidth + 'px'
                    };

                    this.$emit('on-change', true);
                } else if ((elOffset.top - this.offsetTop) > scrollTop && this.offsetType == 'top' && affix) {
                    this.affix = false;
                    this.styles = null;

                    this.$emit('on-change', false);
                }

                // Fixed Bottom
                if ((elOffset.top + this.offsetBottom + elHeight) > (scrollTop + windowHeight) && this.offsetType == 'bottom' && !affix) {
                    this.affix = true;
                    this.styles = {
                        bottom: this.offsetBottom+ 'px',
                        left: elOffset.left + 'px',
                        width: this.$el.offsetWidth + 'px'
                    };

                    this.$emit('on-change', true);
                } else if ((elOffset.top + this.offsetBottom + elHeight) < (scrollTop + windowHeight) && this.offsetType == 'bottom' && affix) {
                    this.affix = false;
                    this.styles = null;
                    
                    this.$emit('on-change', false);
                }
            }
        }
	};
	
	
	var component = Vue.extend(opts);
	Vue.component('affix', component);
    
});