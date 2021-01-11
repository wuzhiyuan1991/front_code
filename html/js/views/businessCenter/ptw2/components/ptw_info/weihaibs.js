define(function (require) {
    var Vue = require("vue");
    var template = require("text!./weihaibs.html");
    var formItemRow=require("./form-item-row");
    var propMixins=require("./mixins");
    return Vue.extend({
        mixins:[propMixins],
        template: template,
        components:{
            "formItemRow":formItemRow,
        },
        data: function () {
            return {
                selAll:false,
                weihaibsList:[],
            }
        },
        watch:{
            'permitModel':function(){
                this.initData();
            },
        },
        methods: {
            initData:function(){
                this.selAll=false;
                this.weihaibsList=this.permitModel.tempWorkStuffs.weihaibsList;
            },
            changeTpl:function(){
                this.initData();
            },
            doChangeAll:function(checked){
                if(checked){
                    for (var i=0;i<this.weihaibsList.length-1;i++){
                        var item=this.weihaibsList[i];
                        item.attr1="1";
                    }
                }
                else{
                    for (var i=0;i<this.weihaibsList.length-1;i++){
                        var item=this.weihaibsList[i];
                        item.attr1="0";
                    }
                }
            },
            doCustomContent:function(type){
                this.$emit("on-custom-content",{type:type});
            }
        }
    })
})
