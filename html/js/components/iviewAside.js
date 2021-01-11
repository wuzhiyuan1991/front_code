define(function (require) {

    var Vue = require("vue");

    var assist = require("./utils/assist");

    var helper = require("./iviewAsideHelper");

    var template = '<div :class="countClasses"' +
        'v-bind:style="{width:width}"' +
        //				        'v-bind:class="{'+
        //				        'left:placement === \'left\','+
        //				        'right:placement === \'right\''+
        //				        '}"'+
        'v-show="show"' +
        ':transition="(this.placement === \'left\') ? \'slideleft\' : \'slideright\'">' +
        '<div class="aside-dialog">' +
        '<div class="aside-content">' +
        '<div class="aside-header">' +
        '<button type="button" class="close" @click=\'close\'><span>&times;</span></button>' +
        '<h4 class="aside-title">' +
        '<slot name="header">' +
        '{{ header }}' +
        '</slot>' +
        '</h4>' +
        '</div>' +
        '<div class="aside-body">' +
        '<slot></slot>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';


    var prefixCls = 'aside';

    var opts = {
        template: template,
        props: {
            show: {
                type: Boolean,
// coerce: _utils.coerce.boolean,
                required: true,
                twoWay: true
            },
            placement: {
                type: String,
                default: 'right'
            },
            header: {
                type: String
            },
            width: {
// type: Number,
// coerce: _utils.coerce.number,
// default: 320
                type: String,
                size: [Number, String]
            },
            class: String,
            escClose: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            countClasses: function countClasses() {
                var obj = {};
                obj[this.class] = !!this.class;
                obj["left"] = this.placement === 'left';
                obj["right"] = this.placement === 'right';

                return [prefixCls, obj];
            }
        },
        watch: {
            show: function show(val) {
                var _this = this;

                var body = document.body;
                var scrollBarWidth = assist.getScrollBarSize();
                if (val) {
                    helper.hideAll();
                    // modify by anson start
                    // 解决多重遮罩问题
                    var arr = document.getElementsByClassName("aside-backdrop in");
                    var isNotExistMask = arr.length == 0;
                    // 解决多重遮罩问题
                    // modify by anson end
                    if (!isNotExistMask) {
                        this._backdrop = arr[0];
                    }// 解决多重遮罩问题
                    if (!this._backdrop) {
                        this._backdrop = document.createElement('div');
                    }
                    // modify by anson start

                    // 解决多重遮罩问题
                    // modify by anson end
                    this._backdrop.className = 'aside-backdrop';
                    body.appendChild(this._backdrop);
                    body.classList.add('modal-open');
                    if (scrollBarWidth !== 0) {
                        // 解决菜单多了个小样式问题
                        // body.style.paddingRight = scrollBarWidth + 'px';
                    }
                    // request property that requires layout to force a layout
                    var x = this._backdrop.clientHeight;
                    this._backdrop.classList.add('in');
// (0, _NodeList2.default)(this._backdrop).on('click', function () {
                    $(_this._backdrop).on('click', function () {
                        return _this.close();
                    });
                    helper.showAll(this._uid);
                } else {
                    if (_this._backdrop) {

                        // (0, _NodeList2.default)(this._backdrop).on('transitionend', function () {
                        $(_this._backdrop).on('transitionend', function () {
                            // (0, _NodeList2.default)(_this._backdrop).off();
                            $(_this._backdrop).off();
                            try {
                                body.classList.remove('modal-open');
                                body.style.paddingRight = '0';
                                body.removeChild(_this._backdrop);
                                _this._backdrop = null;
                            } catch (e) {
                            }
                        });
                        this._backdrop.className = 'aside-backdrop';
                    }
                }
            }
        },
        methods: {
            close: function close() {
                this.show = false;
                this.$emit('on-close');
            }
        },
        ready: function () {
            helper.registerInstance(this._uid, this);
        },
        destroyed: function () {
            helper.unRegisterInstance(this._uid);
        },

        attached: function () {
            //比如给 打开详情 在切换路由 页面上面会出现一层遮罩
            //增加这个props 就是用来去掉这个遮罩
            var _this = this;
            var body = document.body;
            var arr = document.getElementsByClassName("aside-backdrop in");
            this._backdrop = arr[0];
            if (_this._backdrop) {
                try {
                    //this.show  = false;
                    body.classList.remove('modal-open');
                    body.style.paddingRight = '0';
                    body.removeChild(_this._backdrop);
                    _this._backdrop = null;
                } catch (e) {
                }
            }
        }
    };


    var component = Vue.extend(opts);
    Vue.component('aside', component);

});