define(function(require) {
    var LIB = require('lib');
    var template = require("text!./chartFactory.html");
    var components = {
        "checker-chart": require("./charts/normal/checkerChart"),
        "equip-chart": require("./charts/normal/equipChart"),
        "check-item-chart": require("./charts/normal/checkItemChart"),
        "rectification-chart": require("./charts/normal/rectificationChart"),
        "taskPlan-actualExecution-chart": require("./charts/taskPlan/actualExecution/main"),
        "taskPlan-overPerformed-chart": require("./charts/taskPlan/overPerformed/main")
    };
    var chartMap = {
        "person":"checker-chart",
        "equip":"equip-chart",
        "checkItem":"check-item-chart",
        "rectification":"rectification-chart",
        "taskPlan-1":"taskPlan-actualExecution-chart",
        "taskPlan-2":"taskPlan-overPerformed-chart"
    };
    var dataModel = function(){
        return {
            show:false,
            qryParam:null,
            method:null
        }
    };

    var opts = {
        template:template,
        components:components,
        props:{
            echartStyle:{
                type:Object,
                'default':null
            },
            showHeader:{
                type:Boolean,
                'default':true
            },
            dataLimit:{
                type:Number,
                'default':10
            },
            isSelf: {
                type: Boolean,
                'default': false
            }
        },
        computed:{
            echartsCptName:function(){
                if(_.has(this.qryParam, "item")){
                    var items = _.deepExtend([],this.qryParam.item);
                    while (items.length > 0){
                        var chartKey = items.join("-");
                        if(_.has(chartMap,chartKey)){

                            return chartMap[chartKey];
                        }
                        //删除数组最后一个元素
                        items.pop();
                    }
                    throw "未找到匹配的报表组件";
                }
                return null;
            }
        },
        data:function(){
            return new dataModel();
        },
        methods:{
            changeMethod:function(val){
                this.$emit("change-method", val);
            },
            buildChartOpt:function(opt){
                this.$emit("build-chart-opt",opt);
            },
            doQry:function(qryParam){
                this.$set("qryParam", _.omit(qryParam, "method"));
                this.$set("method", qryParam.method);
                this.show = true;
            },
            doClear:function(){
                this.$set("qryParam", null);
                this.show = false;
            }
        }
    };
    var comp = LIB.Vue.extend(opts);
    return comp;
});