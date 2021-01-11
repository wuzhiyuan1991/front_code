/**
 * Created by yyt on 2017/5/18.
 */
/**
 *  请统一使用以下顺序配置Vue参数，方便codeview
 *    el
 template
 components
 componentName
 props
 data
 computed
 watch
 methods
 events
 vue组件声明周期方法
 created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
 **/
define(function (require) {
    var LIB = require('lib');
    var tpl = require("text!./importing.html");

    //数据模型
    var dataModel = {
        rs: null, // 导入完成后后端返回的结果
        hasError: true,
        bar: {
            percent: 0,
            status: 'active',
            done: false
        }
    };

    var component = LIB.Vue.extend({
        template: tpl,
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            initFun:{
                type:Function,
            },
        },
        data: function () {
            return dataModel;
        },
        watch: {
            visible: function (nVal) {
                if (nVal) {
                    this._beginBar();
                }
            }
        },
        methods: {
            doClose: function () {
                this.visible = false;
                if (!this.hasError) {
                    this.$dispatch("ev_editCanceled");
                    if(this.initFun && this.initFun()==false) {
                            return ;
                    }
                    window.location.reload();
                }
            },
            doHide: function () {
                this.visible = false;
                // this.$dispatch("ev_editCanceled");
            },

            _beginBar: function () {
                this.rs = null;
                this.bar.percent = 0;
                this.bar.status = 'active';
                this.bar.done = false;
                this._interval();
            },

            _interval: function () {
                var _this = this;
                this.timer = setInterval(function () {
                    if (_this.bar.percent < 50) {
                        _this.bar.percent += 3;
                    } else if (_this.bar.percent <= 97) {
                        _this.bar.percent += 2;
                    } else {
                        clearInterval(_this.timer);
                    }
                }, 200)
            },

            _importDone: function (rs) {
                this.rs = rs.content;

                if (_.isArray(this.rs) && this.rs.length > 0) {
                    this.hasError = true;
                    this.bar.percent = 99.9;
                    this.bar.status = 'wrong';
                } else {
                    this.hasError = false;
                    this.bar.percent = 100;
                    this.bar.status = 'success';
                }

                this.bar.done = true;
                clearInterval(this.timer);

            },
            _importError: function () {
                this.hasError = true;
                clearInterval(this.timer);
                this.bar.percent = 99.9;
                this.bar.done = true;
                this.bar.status = 'wrong';

                this.rs = ['导入文件格式不正确!']
            }
        },

        events: {
            "ev_importDone": function (rs) {
                this._importDone(rs);
            },
            "ev_importError": function () {
                this._importError();
            }
        }
    });
    return component;
});