define(function (require) {

    var Vue = require("vue");
    var Popper = require("popper");

    var template = '<div class="ivu-select-dropdown"><slot></slot></div>';

    var opts = {
        template: template,
        props: {
            placement: {
                type: String,
                default: 'bottom-start'
            },
            popperFixed: {
                type:Boolean,
                default:true,
            }
        },
        data: function data() {
            return {
                popper: null
            };
        },

        methods: {
            update: function () {
                var _this = this;
                if (this.popper) {
                    this.$nextTick(function () {
                        this.popper.update();
                    });
                } else {
                    this.$nextTick(function () {
                        this.popper = new Popper(this.$parent.$els.reference, this.$el, {
                            gpuAcceleration: false,
                            placement: this.placement,
                            boundariesPadding: 0,
                            forceAbsolute: true,
                            boundariesElement: 'body',
                            isFixed:this.popperFixed,
                        });
                        this.popper.onCreate(function (popper) {
                            _this.resetTransformOrigin(popper);
                        });
                    });
                }
            },
            destroy: function () {
                var _this = this;
                if (this.popper) {
                    this.resetTransformOrigin(this.popper);
                    setTimeout(function () {
                        _this.popper.destroy();
                        _this.popper = null;
                    }, 300);
                }
            },
            resetTransformOrigin: function (popper) {
                var placementMap = {top: 'bottom', bottom: 'top'};
                var placement = popper._popper.getAttribute('x-placement').split('-')[0];
                var origin = placementMap[placement];
                popper._popper.style.transformOrigin = 'center ' + origin;
            }
        },
        ready: function () {
            this.$on('on-update-popper', this.update);
            this.$on('on-destroy-popper', this.destroy);
        },
        beforeDestroy: function () {
            if (this.popper) {
                this.popper.destroy();
            }
        }
    };


    var component = Vue.extend(opts);
    Vue.component('dropdown', component);

});