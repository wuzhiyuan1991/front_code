define(function (require) {
    var Vue = require("vue");
    var LIB=require("lib");
    var template = require("text!./weihaibs.html");
    var formItemRow=require("./form-item-row");
    var commonApi=require("../../api");
    return Vue.extend({
        template: template,
        components:{
            "formItemRow":formItemRow,
        },
        props:{
            model:{
                type:Object,
                required:true,
                default:function () {
                }
            }
        },
        computed:{
            weihaibsList:function () {
                return  this.model.ptwCardStuffs.filter(function (item) {
                    return  item.type==3;
                })
            },
            // kongzhicsList:function () {
            //     return  this.model.ptwCardStuffs.filter(function (item) {
            //         return  item.type==4&&!item.gasType;
            //     })
            // }
        },
        data: function () {
            return {
                stuffMap:null,
            }
        },
        created:function(){
            
        },
        methods: {
            doCustomContent:function(type){
                this.$emit("on-custom-content",{type:type});
            }
        }
    })
})
