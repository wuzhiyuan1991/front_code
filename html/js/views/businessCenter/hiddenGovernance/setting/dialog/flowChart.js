define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./flowChart.html");


    var newVO = function () {
        return {
            flowChartUrl:null,
            showChart:true
        }
    };

    //数据模型
    var dataModel = {
        mainModel: {
            vo: newVO(),
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
            doSave: function () {
                this.$dispatch("ev_detailClose");
            },
        },
        events: {
            //edit框数据加载
            "ev_ChartReload":function(val) {
                if(val){
                    this.mainModel.vo.showChart = true
                    this.mainModel.vo.flowChartUrl = LIB.convertWatermarkPicPath(val);
                }else{
                    this.mainModel.vo.showChart = false
                }

            }
        }
    });

    return detail;
});