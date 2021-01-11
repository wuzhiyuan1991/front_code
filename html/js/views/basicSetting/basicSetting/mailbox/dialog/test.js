define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./test.html");

    var newVO = function () {
        return {}
    };

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO(),
            //当前的操作类型， create：创建， update ：更新， 影响'保存'按钮的事件处理
            opType: "",
            showConnect: false,
            showSearchServer: false,
            showLoginError: false,
            showLoginSuccess: false
        }

    };

    //声明detail组件
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
    var detail = LIB.Vue.extend({
        template: tpl,
        data: function () {
            return dataModel;
        },
        methods: {
            doCancel: function () {
                    this.mainModel.showConnect = false,
                    this.mainModel.showSearchServer = false,
                    this.mainModel.showLoginError = false,
                    this.mainModel.showLoginSuccess = false
                    //this.$dispatch("ev_editCanceled");
                    this.$emit("do-test-canceled");
            }
        },
        events: {
            //edit框数据加载
            "ev_editEmail": function (nVal) {
                var _this = this;
                _this.mainModel.showLoginError = false;
                _this.mainModel.showLoginSuccess = false;
                //存在nVal则是update
                if (nVal == "-1") {
                    _this.mainModel.showConnect = true;
                    _this.mainModel.showSearchServer = true;
                    _this.mainModel.showLoginError = true;

                } else {
                    _this.mainModel.showConnect = true;
                    _this.mainModel.showSearchServer = true;
                    _this.mainModel.showLoginSuccess = true;
                }

            }
        }
    });

    return detail;
});