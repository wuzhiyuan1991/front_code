define(function (require) {
    var Vue = require("vue");
    var LIB=require("lib");
    var template = require("text!./ppe.html");
    var api=require("../../api");
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
        data: function () {
            return {
                load:false,
                ppeList:[],
                enablePPEs:[],
                imageStyle:'height:20px;width:auto;margin-bottom:0;',
                allPPEList:[],
                curePPEList:[],
                verNumList: [],
                selectVerNum: null
            }
        },
        methods: {
            getPPEItems:function(data){
                var list = this.model.workStuffs.filter(function (item) {
                    return  item.type==6&&item.ppeCatalogId==data.id;
                });
                return  list;
            },
            deelList:function () {
                var list = this.model.workStuffs.filter(function (item) {
                    return item.type == 6;
                });
                // var list2 = this.model.cardTpl.ptwCardStuffs.filter(function (item) {
                //     return item.stuffType == 6;
                // });
                // _.each(list, function (item1) {
                //     item1.select = true;
                // });
                // _.each(list2,function (item2) {
                //     if(!_.find(list, function (item1) {
                //             return item1.id == item2.stuffId
                //         })){
                //         list.push({name:item2.ptwStuff.name,ppeCatalogId:item2.ptwStuff.ppeCatalogId})
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
            displayFn: function (val) {
                return "#"+val.value;
            },
            getItemName:function (item) {
                var _this = this;
                if(item.isExtra == '1'){
                    if(this.selectVerNum==-1)
                        return "其他（" + item.content +"）";
                    else{
                        var obj = _.find(item.verList, function (item) {
                            return item.verNum == _this.selectVerNum
                        });
                        return "其他（" + obj.content +"）";
                    }

                }else{
                    return item.name;
                }
            },
            getFiles:function (data,type) {
                var _this = this;
                var files = [];
                _.each(data,function (item) {
                    if(item.dataType==type && (item.version==_this.selectVerNum || _this.selectVerNum==-1 )) {
                        files.push(LIB.convertFileData(item));
                    }
                });
                return files;
            },

            initData:function () {
                var _this=this;
                // api.getPPETypes().then(function (data) {
                //     data.forEach(function (item) {
                //         if(_this.model && _this.model.workTpl &&_this.model.workTpl.ppeCatalogSetting){
                //             item.enable=!!_this.model.workTpl.ppeCatalogSetting.match(new RegExp(item.id));
                //         }
                //         else{
                //             item.enable=false;
                //         }
                //         return item;
                //     });
                //     var list = _this.deelList();
                //     _.each(data,function (item1) {
                //         if(item1.enable){
                //             var arr =  _.filter(list,function (item2) {
                //                 return item2.ppeCatalogId == item1.id;
                //             });
                //             item1.lists = arr;
                //             // if( !_.find( arr,function (item) {return item.isExtra == '1'} ) )
                //             // {
                //             //     item1.lists.push({name:'其他'});
                //             // }
                //         }
                //     });
                //
                //     // 将其他的选项放到最后
                //     for(var i=0; i<data.length; i++){
                //         if(data[i].lists && data[i].lists.length>0){
                //             for(var j=0; j<data[i].lists.length; j++){
                //                 if(data[i].lists[j].isExtra == '1'){
                //                     var temp  = data[i].lists[j];
                //                     data[i].lists[j] = data[i].lists[data[i].lists.length-1];
                //                     data[i].lists[data[i].lists.length-1] = temp;
                //                 }
                //             }
                //         }
                //     }
                //     _this.ppeList=data;
                //
                //     var list = [];
                //     var obj = null;
                //     _.each(_this.ppeList, function (ppeListItem) {
                //         _.each(ppeListItem.lists, function (ppe) {
                //             if(ppe.isExtra != '1')
                //                 list.push(ppe);
                //             else obj = ppe;
                //         })
                //     });
                //     list.push(obj);
                //
                //     _this.allPPEList = list;
                //     _this.getVersionList(_this.allPPEList)
                //
                // })

                this.allPPEList = _.filter(this.model.workStuffs, function (item) {
                    return item.type == 6;
                });

                this.getVersionList(this.allPPEList);
            },
            getVersionList: function (list) {

                this.verNumList = [];
                var list = _.filter(this.model.verificationVerList, function (item) {
                    return item.verifyType == '3';
                }) || [];
                var sortList = [];
                if (list.length > 0) {
                    sortList = list.sort(function (a, b) {
                        return b.verNum - a.verNum;
                    });
                    this.selectVerNum = sortList[0].verNum || -1;
                    this.verNumList = sortList;
                } else {
                    this.selectVerNum = -1;
                    this.verNumList = [];
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

        },
        watch:{
            'model':function (val) {
                this.initData();
            }
        }
    })
})
