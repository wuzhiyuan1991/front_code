define(function(require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var dataModel = {
        itemIndex:0
    }

//首页效果
    var vm = LIB.Vue.extend({
        // mixins : [LIB.VueMixin.dataDic],
        template: template,
        components : {

        },
        data:function(){
            return {
                itemIndex:0
            }
        },
        methods:{
            changeStyle:function (val) {
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
