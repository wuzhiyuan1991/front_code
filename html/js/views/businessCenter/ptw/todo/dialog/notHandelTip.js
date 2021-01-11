define(function (require) {
    var Vue = require("vue");
    var template = require("text!./notHandelTip.html");
    return Vue.extend({
        props:{
            visible:Boolean,
            load:Boolean,
        },
        template: template,
        data: function () {
            return {}
        },
        methods: {
            close:function () {
                this.visible=false;
            }
        },
        watch:{
            visible:function (val) {
                if(val&&!this.load){
                    this.load=true;
                }
            }
        }
    })
})