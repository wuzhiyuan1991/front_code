define(function (require) {
    var Vue = require("vue");
    var template = require("text!./security-measures.html");
    var formItemRow=require("./form-item-row");
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
            kongzhicsList:function () {
                return  this.model.ptwCardStuffs.filter(function (item) {
                    return  item.type==4&&!item.gasType;
                })
            }
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
            },
        }
    })
})
