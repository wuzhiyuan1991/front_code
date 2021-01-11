/**
 * https://github.com/freeze-component/vue-popper
 * */
define(function(require) {
    var Popper = require('popper');

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
        props: {
            placement: {
                type: String,
                'default': 'bottom'
            },
            boundariesPadding: {
                type: Number,
                'default': 5
            },
            reference: Object,
            popper: Object,
            offset: {
                'default': 0
            },
            value: Boolean,
            transition: String,
            options: {
                type: Object,
                'default': function() {
                    return {
                        gpuAcceleration: false,
                        boundariesElement: 'body'
                    }
                }
            },
            visible: {
                type: Boolean,
                'default': false
            },
            popperFixed:{
                type: Boolean,
                'default': true,
            }
        },
        watch: {
            value: {
                immediate: true,
                handler: function(val) {
                    this.visible = val;
                    this.$emit('input', val);
                }
            },
            visible: function(val) {
                val ? this.updatePopper() : this.destroyPopper();
                this.$emit('input', val);
            },
            // 固定表格滚动时动态计算位置
            placement: function() {
                this.createPopper();
            }
        },
        methods: {
            createPopper: function() {
                // if(document.body.clientWidth - ($(this.$el).offset().left + $(this.$el)[0].clientWidth) < 180) {
                // 对表单项的验证错误提示做特殊处理
                if(_.startsWith(this.$el.className, "el-form-item")) {
                    if(document.body.clientWidth - (getOffset(this.$el).left + this.$el.clientWidth) < 180) {
                        this.placement = "bottom";
                    }
                }


                if (!/^(top|bottom|left|right)(-start|-end)?$/g.test(this.placement)) {
                    return;
                }
                var options = this.options;
                var popper = this.popper || this.$els.popper;
                var reference = this.reference || this.$els.reference;

                if (!popper || !reference) return;

                if (this.popperJS && this.popperJS.hasOwnProperty('destroy')) {
                    this.popperJS.destroy();
                }

                options.placement = this.placement;
                options.offset = this.offset;
                options.isFixed=this.popperFixed;
                this.popperJS = new Popper(reference, popper, options);
                var _this = this;
                this.popperJS.onCreate(function(popper) {
                    _this.resetTransformOrigin(popper);
                    _this.$nextTick(_this.updatePopper);
                    _this.$emit('created', _this);
                });
            },
            updatePopper: function() {
                this.popperJS ? this.popperJS.update() : this.createPopper();
            },
            doDestroy: function() {
                if (this.visible) return;
                this.popperJS.destroy();
                this.popperJS = null;
            },
            destroyPopper: function() {
                if (this.popperJS) {
                    this.resetTransformOrigin(this.popperJS);
                }
            },
            resetTransformOrigin: function(popper) {
                var placementMap = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
                var placement = popper._popper.getAttribute('x-placement').split('-')[0];
                var origin = placementMap[placement];
                popper._popper.style.transformOrigin = ['top', 'bottom'].indexOf(placement) > -1 ? 'center ' + origin : origin + ' center';
            }
        },
        beforeDestroy: function() {
            if (this.popperJS) {
                this.popperJS.destroy();
            }
        }
    };
    return opts;
});