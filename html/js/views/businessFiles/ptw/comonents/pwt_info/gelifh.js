define(function (require) {
    var Vue = require("vue");
    var LIB=require("lib");
    var template = require("text!./gelifh.html");
    var commonApi=require("../../api");
    return Vue.extend({
        template: template,
        components:{
        },
        props:{
            model:{
                type:Object,
                required:true,
            }
        },
        computed:{
            geliffList:function () {
                return  this.model.ptwCardStuffs.filter(function (item) {
                    return  item.type==5;
                })
            },

        },
        data: function () {
            return {
                stuffMap:null,
                columns:[]
            }
        },
        methods: {
            doCustomContent:function(type){
                this.$emit("on-custom-content",{type:type});
            }
        }
    })
})
