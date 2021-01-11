define(function(require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var dataModel = {
        itemIndex:-1
    }

//首页效果
    var vm = LIB.Vue.extend({
        // mixins : [LIB.VueMixin.dataDic],
        template: template,
        components : {

        },
        data:function(){
            return dataModel;
        },
        methods:{
            // views/home/riskBaiduMap/main
            ///riskMap/riskMapSumary/riskMap4
            //views/home/KindergartenMap/main
            doChangeImg :function(val){
                console.log("金额俩啊哈哈", val)
                this.itemIndex = val;
            }
        },
        events : {
        },
        //初始化
        ready:function() {

        }

    })
    return vm;
});
