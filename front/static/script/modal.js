
/**
 * modal
 * alert、confirm、tips
 * Created by linx on 16/10/28.
 */
(function (factory) {
    if (typeof define === "function" && (define.cmd || define.amd)) {
        define(factory);
    } else {
        window.Modal = factory();
    }
}(function (require) {
    var $, Template;
    if (typeof define === "function" && (define.cmd || define.amd)) {
        $ = require('lib/zepto.min');
        Template = require('lib/template-native');
    } else {
        $ = window.Zepto || window.jQuery;
        Template = window.template;
    }
    Template && Template.config("escape", false);

    var UI = {
        warpper: '<div class="modal-container"></div>',
        dialog: '<div class="modal-component dialog">\
                <div class="bg-mask"></div>\
                <div class="modal-warpper">\
                    <div class="ui-modal">\
                        <div class="modal-content"><%= content %></div>\
                        <div class="modal-buttons">\
                            <% for (var i in buttons) { %>\
                            <button type="button" class="<%= buttons[i].className %>"><%= buttons[i].label %></button>\
                            <% } %>\
                        </div>\
                    </div>\
                </div>\
            </div>',
        tips: '<div class="ui-modal tips-component <%= className %>">\
                    <div class="ui-tips-warp">\
                        <div class="ui-tips">\
                            <div class="tips-content"><%= content %></div>\
                        </div>\
                    </div>\
                </div>',
        loading: '<div class="ui-modal loading-component loading thr-ld">\
                <% if (isShowMask) { %>\
                <div class="bg-mask"></div>\
                <% } %>\
                <div class="loading-warpper">\
                    <div class="loader"></div>\
                </div>\
            </div> '
    }

    /**
     * 属性继承
     * @param target
     * @param source
     * @returns {*}
     */
    function extend(target, source) {
        var arr = target;
        for (var key in source) {
            if (typeof source[key] ===  'object' && typeof target[key] !== 'undefined') {   // 二级属性继承
                target[key] = extend(target[key], source[key])
            } else if(typeof source[key] !== 'undefined' && source[key] !== '') {           // 一级属性继承
                arr[key] = source[key];
            }
        }
        return arr;
    }

    /**
     * Modal 组件
     * @param setting
     * @constructor
     */
    var Modal = function (setting) {
        var defaultOpt = {
            type: 'dialog',                 // alert、confirm、tips、dialog
            warpper: '.modal-container',    // 默认存放
            title: '',                      // #标题
            content: '',
            activeClassName: null,  // transition动画触发类名
            direction: 'vertical middle',   // #展示位置,默认垂直居中
            isShowMask: true,              // #是否使用遮罩
            buttons: [{
                label: '确定',
                className: '',
                onClick: function () {}
            }],
            $warpper: null,
            $component: null,
            onClose: function () {},                         // 组件移除后调用函数
            onInitComplete: function ($component, modal) {}, // 初始化完成触发函数
        }

        this.opt = extend(defaultOpt, setting);
        this.init();
    };
    /**
     * 初始化组件
     */
    Modal.prototype.init = function () {
        this._setWapper();
        this.render();
    };
    /**
     * 初始化容器
     * @private
     */
    Modal.prototype._setWapper = function () {
        var $warpper = $(this.opt.warpper);
        if(!$warpper.length) {
            this._setComponentStyle();
            this.opt.$warpper = $(UI.warpper);
            $('body').append(this.opt.$warpper);
        } else {
            this.opt.$warpper = $warpper;
        }
    };
    /**
     * 初始化组件样式
     * @private
     */
    Modal.prototype._setComponentStyle = function () {
        var styleNode = $('<style></style>');
        var styleText = document.createTextNode(".modal-component{display:none;position:fixed;top:0;left:0;width:100%;height:100%;text-align:center;z-index:88;-webkit-transition:all .6s cubic-bezier(.58,.03,.59,1.04)}.modal-component .bg-mask{position:inherit;width:inherit;height:inherit;opacity:0;background:rgba(0,0,0,.4);z-index:-1;-webkit-transition:all .3s cubic-bezier(.58,.03,.59,1.04)}.modal-warpper{width:300px;height:auto;opacity:0;margin-top:-80px;background:#fff;border:1px solid #eee;-webkit-transition:all .2s cubic-bezier(.58,.03,.59,1.04) .1s}.modal-component:after,.modal-warpper{display:inline-block;vertical-align:middle}.modal-component:after{content:'';height:100%;margin-left:-.25em}.modal-show .bg-mask{opacity:.5}.modal-show .modal-warpper{opacity:1;margin-top:0}.modal-component .ui-modal{padding:0}.modal-component .modal-content{min-height:56px;font-size:1.12rem;color:#666;display:box;display:-webkit-box;-webkit-box-pack:center;box-pack:center;-webkit-box-align:center;margin:0 15px}.modal-component .modal-buttons{height:auto;display:flex;display:-webkit-flex;border-top:1px solid #f6f6f6}.modal-component .modal-buttons button{flex:1;height:auto;border:0;font-size:1.1rem;border-radius:3px;background:#fff;padding:12px 0;border-right:1px solid #f6f6f6}.modal-component .modal-buttons button:last-child{border-right:0}.tips-component{position:fixed;bottom:110px;left:0;width:100%;opacity:0;z-index:88;text-align:center;-webkit-transition:all .6s cubic-bezier(.58,.03,.59,1.04)}.tips-component.tips-show{opacity:1;bottom:90px}.tips-component .ui-tips-warp{display:inline-block;max-width:70%;padding:0 20px;height:auto}.tips-component .ui-tips{min-width:20%;min-height:32px;padding:0 25px;display:flex;display:-webkit-flex;align-items:center;background:#fff;color:#ccc;-webkit-border-radius:50px;border-radius:50px;border:1px solid transparent;box-shadow:1px 1px 5px #ccc}.tips-component .tips-content{flex:auto;padding:8px 0;font-size:1rem}.tips-component.tips-default .ui-tips{color:#fff;background:rgba(0,0,0,.4);box-shadow:1px 1px 3px rgba(0,0,0,.4)}.loading-component{position:fixed;bottom:100px;left:0;opacity:0;width:100%;text-align:center;transition:opacity,bottom .5s,.5s cubic-bezier(.68,-.55,.265,1.55),cubic-bezier(.68,-.55,.265,1.55);-webkit-transition:opacity,bottom .5s,.5s cubic-bezier(.68,-.55,.265,1.55),cubic-bezier(.68,-.55,.265,1.55)}.loading-component.loading-show{opacity:1;bottom:90px}.loading-component .ui-loading{display:inline-block;color:#fff;min-width:20%;min-height:32px;padding:3px 20px;border-radius:50px;-webkit-border-radius:50px;border:1px solid transparent}.loading-component img{vertical-align:middle;margin-right:5px}.thr-ld .loading-warpper{display:inline-block;width:100px;height:3em;border:0 solid red}.thr-ld .loader,.thr-ld .loader:after,.thr-ld .loader:before{border-radius:50%;width:1em;height:1em;-webkit-animation-fill-mode:both;animation-fill-mode:both;-webkit-animation:amThrLd 1.3s infinite ease-in-out;animation:amThrLd 1.3s infinite ease-in-out}.thr-ld .loader{margin:0 auto;font-size:10px;position:relative;text-indent:-9999em;-webkit-animation-delay:-.2s;animation-delay:-.2s}.thr-ld .loader:before{left:-1.2em;-webkit-animation-delay:-.4s;animation-delay:-.4s}.thr-ld .loader:after{left:1.2em}.loader:after,.thr-ld .loader:before{content:'';position:absolute;top:0}@-webkit-keyframes amThrLd{0%,100%,80%{box-shadow:0 1em 0 -.4em #3dce3d}40%{box-shadow:0 1em 0 0 #3dce3d}}@keyframes amThrLd{0%,100%,80%{box-shadow:0 1em 0 -.4em #3dce3d}40%{box-shadow:0 1em 0 0 #3dce3d}}");
        styleNode.append(styleText)
        $('head').append(styleNode);
    };
    /**
     * 绑定事件
     */
    Modal.prototype._bindEvent = function () {
        var _this = this;
        if (this.opt.type === 'alert' ||
            this.opt.type === 'confirm' ||
            this.opt.type === 'dialog' ) {
            this.opt.$component.find('.modal-buttons button').each(function (i, dom) {
                $(dom).on('click',function () {
                    var res = _this.opt.buttons[i].onClick();
                    if (res || res === undefined) { // 函数没有返回值或者返回true执行关闭
                        _this.close();
                    }
                })
            })
        }
    };
    /**
     * 渲染component
     */
    Modal.prototype.render = function () {
        if(this.opt.type && UI[this.opt.type]) {
            var tc = Template.compile(UI[this.opt.type]);
            this.opt.$component =  $(tc({
                type: this.opt.type,
                content: this.opt.content,
                buttons: this.opt.buttons,
                className: this.opt.className,
                isShowMask: this.opt.isShowMask
            }));
            this.opt.$warpper.append(this.opt.$component);
            this.show();
            this._bindEvent();
            this.initComplete();
        }
    };
    /**
     * 初始化完成事件
     * @param callback
     */
    Modal.prototype.initComplete = function (callback) {
        if (callback && typeof callback === 'function')
            callback.call(this.opt.onInitComplete, this.opt.$component, this); // 外部引用initComplete时同时触发事件
        else
            this.opt.onInitComplete(this.opt.$component, this);
    };
    /**
     * 展示
     */
    Modal.prototype.show = function () {
        this.opt.$component.show();
        var _this = this;
        window.setTimeout(function () {
            _this.opt.$component.addClass(_this.opt.activeClassName)
        }, 10)
    };
    /**
     * 展示
     */
    Modal.prototype.hide = function () {
        this.opt.$component.hide();
    };
    /**
     * 增加组件样式
     * @param className
     */
    Modal.prototype.addClass = function (className) {
        this.opt.$component.addClass(className);
    };
    /**
     * 移除组件样式
     * @param className
     */
    Modal.prototype.removeClass = function (className) {
        this.opt.$component.removeClass(className);
    };
    /**
     * 动画结束触发事件
     * @param callback
     */
    Modal.prototype.transitionEnd = function (callback) {
        this.opt.$component.on('transitionend', function () {
            callback && callback();
        });
    };
    /**
     * 移除modal组件
     */
    Modal.prototype.close = function () {
        var _this = this, active = this.opt.activeClassName;
        this.opt.onClose && this.opt.onClose(this.opt.$component); // 关闭前触发事件
        if (active && this.opt.$component.hasClass(active)) {       // 是否有动画
            this.transitionEnd(function () {
                _this.opt.$component.remove();
            })
            this.removeClass(active);
        } else {
            this.opt.$component.remove();
        }
    };

    return {
        /**
         * alert
         * @param content
         * @param confirmFun
         * @param closeFun
         * @returns {Modal}
         */
        alert: function(content) {
            var opt = {
                content: '',
                label: '确定',
                activeClassName: 'modal-show',
                className: 'btn-confirm',
                onClick: function () {},
                onClose: function () {},
                buttons: [{}]
            }
            if (arguments.length == 1 && Object.prototype.toString.call(content) === '[object Object]') { // 存在一个参数且为对象
                opt = extend(opt, content)
                opt.buttons.push({
                    label: opt.label,
                    className: opt.className,
                    onClick: opt.onClick
                })
            } else {                                        // 第一个参数不为对象
                opt.content = content;
                opt.buttons[0].label = opt.label;
                opt.buttons[0].className = opt.className;
                opt.buttons[0].onClick = arguments[1] || function () {};  // 第二个参数, 点击确定后触发的回调函数
                opt.onClose = arguments[2];             // 第三个参数,为关闭后触发的回调函数
            }
            return new Modal(opt)
        },
        /**
         * confirm
         * @param content
         * @param confirmFun
         * @param cancelFun
         * @param closeFun
         * @returns {Modal}
         */
        confirm: function (content) {
            var opt = {
                content: '',
                activeClassName: 'modal-show',
                buttons: [{
                    label: '确定',
                    className: 'btn-cancel',
                    onClick: function () {}
                }, {
                    label: '取消',
                    className: 'btn-confirm',
                    onClick: function () {}
                }]
            };
            if (arguments.length == 1 && Object.prototype.toString.call(content) === '[object Object]') { // 存在一个参数且为对象
                opt = extend(opt, content)
            } else { // 第一个参数不为对象
                opt.content = content;
                opt.buttons[0].onClick = arguments[2] || function () {}; // 第三个参数, 点击取消后触发的回调函数
                opt.buttons[1].onClick = arguments[1] || function () {}; // 第二个参数, 点击确定后触发的回调函数
                opt.onClose = arguments[3];    // 第四个参数,为关闭后触发的回调函数
            };
            return new Modal(opt);
        },
        /**
         * tips
         * @param content
         * @param time    停留时间，单位：ms
         * @returns {Modal}
         */
        tips: function (content, time) {
            var opt = {
                type: 'tips',
                className: 'tips-default',
                activeClassName: 'tips-show',
                content: content,
                time: time || 3000, // 默认停留3s
                onInitComplete: function ($component, Tips) {
                    window.setTimeout(function () {
                        Tips.close();
                    }, opt.time)
                }
            }
            return new Modal(opt);
        },
        /**
         * loading
         * option {} || boolean     参数配置或是否显示背景
         * @returns {{show: show, hide: hide}}
         */
        loading: function (options) {
            var opt = {
                type: 'loading',
                isShowMask: false,
                onInitComplete: function ($component, Tips) {
                    Tips.addClass('loading-show');
                }
            }
            if (Object.prototype.toString.call(options) === '[object Object]') {
                opt = extend(opt, options)
            } else if (Object.prototype.toString.call(options) === '[object Boolean]') {
                opt.isShowMask = options; // 当第一个参数为boolean值时为配置是否显示遮罩层
            }
            return new Modal(opt);
        },
        /**
         * dialog
         * @param setting
         * @returns {Modal}
         */
        dialog: function (setting) {
            var opt = {
                content: '',
                buttons: [{
                        label: '取消',
                        className: 'btn-cancel',
                        onClick: function () {}
                    },
                    {
                        label: '确定',
                        className: 'btn-confirm',
                        onClick: function () {}
                    }]
            };
            opt = extend(opt, setting)
            return new Modal(opt)
        }
    }
}))
