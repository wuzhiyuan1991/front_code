/**
 * Created by yyt on 2017/2/20.
 */
define(function(require){
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./detail.html");

    var newVO = function() {
        return {
            show:false
        }
    };
    var dataModel = {
        mainModel : {
            vo : newVO(),
            tabName:"1"
        }
    };
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *	el
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
        props: {
            img: String
        },
        data:function(){
            return dataModel;
        },
        methods:{

        },
        events : {
            //数据加载
        },
		ready:function(){
		}
    });

    return detail;
});