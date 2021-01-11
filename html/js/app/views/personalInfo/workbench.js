/**
 * Created by yyt on 2017/6/16.
 */
define(function (require) {
    var LIB = require('lib');

    ////右侧滑出详细页
    var tpl = require("text!./workbench.html");
    //初始化数据模型
    var newVO = function () {
        return {
            id:null
        }
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            detailShow:false,
            showTabs: false
        }
    };
//Vue组件
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
        components: {
        },
        data: function () {
            return dataModel;
        },
        methods: {
            //关闭
            doClose: function () {
                this.$dispatch("ev_detailShutDown");
            }
        },
        events: {
            "ev_detailContactsReload": function () {
                var _this = this;
                _this.mainModel.detailShow = true;
            }
        },
        ready : function() {
        }
    });

    return detail;
})