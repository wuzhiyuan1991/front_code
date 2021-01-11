define(function (require) {
    var Vue = require("vue");
    var template = require("text!./weihaibs.html");
    return Vue.extend({
        template: template,
        props:{
            model:{
                type:Object,
                required:true,
            }
        },
        computed:{
            weihaibsList:function () {
                var list = _.filter(this.model.workStuffs,function (item) {
                    return item.type == 3;
                });
                // var list2 = this.model.cardTpl.ptwCardStuffs.filter(function (item) {
                //     return item.stuffType == 3;
                // });
                // _.each(list, function (item1) {
                //     item1.select = true;
                // });
                // _.each(list2,function (item2) {
                //     if(!_.find(list, function (item1) {
                //             return item1.id == item2.stuffId
                //         })){
                //         list.push({name:item2.ptwStuff.name})
                //     }
                // });
                for(var i=0; i<list.length; i++){
                    if(list[i].isExtra && list[i].isExtra=='1'){
                        var temp = list[i];
                        list[i] = list[list.length-1];
                        list[list.length-1] = temp;
                        break;
                    }
                }
                return  list;
            },
            // kongzhicsList:function () {
            //     return  this.model.workStuffs.filter(function (item) {
            //         return  item.type==4&&!item.gasType;
            //     })
            // }
        },
        methods:{
            getItemName:function (item) {
                if(item.isExtra == '1'){
                    return "其他（" + item.content +"）"
                }else{
                    return item.name;
                }
            },
        }
    })
})
