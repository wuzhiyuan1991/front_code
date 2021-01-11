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
        data:function () {
            return {
                imageStyle:'height:20px;width:auto;margin-bottom:0;',
                verNumList: [],
                selectVerNum: null
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
                for(var i=0; i<list.length; i++) {
                    if(list[i].isExtra && list[i].isExtra=='1'){
                        var temp = list[i];
                        list[i] = list[list.length-1];
                        list[list.length-1] = temp;
                        break;
                    }
                }
                this.verNumList = [];
                var list1 = _.filter(this.model.verificationVerList, function (item) {
                    return item.verifyType == '1';
                }) || [];
                var sortList = [];
                if (list1.length > 0) {
                    sortList = list1.sort(function (a, b) {
                        return b.verNum - a.verNum;
                    });
                    this.selectVerNum = sortList[0].verNum || -1;
                    this.verNumList = sortList;
                } else {
                    this.selectVerNum = -1;
                    this.verNumList = [];
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
            // getItemName:function (item) {
            //     if(item.isExtra == '1'){
            //         return "其他（" + item.content +"）"
            //     }else{
            //         return item.name;
            //     }
            // },
            getFiles:function (data,type) {
                var _this = this;
                var files = [];
                _.each(data,function (item) {
                    if(item.dataType==type && (item.version==_this.selectVerNum || _this.selectVerNum==-1  )) {
                        // files.push(LIB.convertFileData(item));
                        files.push(item)
                    }
                });
                return files;
            },
            displayFn: function (val) {
                return "#"+val.value;
            },
            getItemName:function (item) {
                var _this = this;
                if(item.isExtra == '1'){
                    if(this.selectVerNum==-1)
                        return "其他（" + (item.content || '') +"）";
                    else{
                        var obj = _.find(item.verList, function (item) {
                            return item.verNum == _this.selectVerNum
                        });
                        return "其他（" + (obj.content || '') +"）";
                    }
                }else{
                    return item.name;
                }
            },
            getCheckResult: function (item) {
                var _this = this;
                if(this.selectVerNum == -1){
                    var check = (item.attr1=='1' && item.checkResult=='0') || (item.checkResult=='2');
                    return check;
                }
                var obj = _.find(item.verList, function (opt) {
                    return opt.verNum == _this.selectVerNum;
                });
                return obj.checkResult == '2';
            }
        }
    })
})
