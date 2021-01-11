define(function (require) {
    var Vue = require("vue");
    var template = require("text!./security-measures.html");
    return Vue.extend({
        template: template,
        props:{
            model:{
                type:Object,
                required:true,
            },
            vo:{
                type:Object,
                required:true,
            }
        },
        computed:{
            kongzhicsList:function () {
                // var list =  this.model.workStuffs.filter(function (item) {
                //     return  item.type==4&&!item.gasType;
                // });

                var list = this.model.workStuffs.filter(function (item) {
                    return item.type==4 &&!item.gasType
                });
                // var list2 = this.model.cardTpl.ptwCardStuffs.filter(function (item) {
                //     return item.stuffType == 4;
                // });
                if(!_.find(list,function (item) {
                        return item.isExtra == '1'
                    })){
                    list.push({name:'其他'});
                }
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
                return list;
            },
            getStatusExt:function () {
                var temp = true;
                if(this.vo.workHistories && this.vo.workHistories.length>0){
                    var obj = _.find(this.vo.workHistories,function (item) {
                        return item.workStatus == '5'
                    });
                    var len  = this.vo.workHistories.length;
                    if(this.vo.workHistories[len-1].workStatus == '4' && obj){
                        temp = false;
                    }
                }
                return temp;
            }
        },
        methods: {
            getItemName:function (item) {
                if(item.isExtra == '1'){
                    if(this.getStatusExt)
                        return "其他（" + item.content +"）";
                    else return "其他";
                }else{
                    return item.content || item.name + '';
                }
            },
            getFiles:function (data,type) {
                var files=data.filter(function (item) {
                    return   item.dataType==type
                });
                return files;
            },
        }
    })
})
