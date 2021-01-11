define(function (require) {
    var Vue = require("vue");
    var template = require("text!./work-close.html");
    var model = require("../../model");
    var LIB = require("lib");
    return Vue.extend({
        props: {
            model: {
                type: Object,
                required: true,
            },
            workcard:Object,//现在存的是detail-x 页面存的1个对象，现在存的是mainModel

        },
        template: template,
        computed: {
            reasonStr: function () {
                return this.model.workStuffs.filter(function (item) {
                    return item.type == 7&&item.checkResult==2;
                })[0].name;
            },
            reasonList: function () {
                var list  = this.model.workStuffs.filter(function (item) {
                    return item.type == 7;
                });

                // var list = this.model.workStuffs.filter(function (item) {
                //     return item.type == 7;
                // });
                // var list2 = this.model.cardTpl.ptwCardStuffs.filter(function (item) {
                //     return item.stuffType == 7;
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
                return list;
            },
            vo:function () {
                return this.workcard.vo;
            },


        },
        data: function () {
            return {
                workResultType: model.workResultType,
                currentWorkResult: "",
                isWorkClose: false,
                personnel:{
                    "1":null,
                    "7":null,
                    "8":null,
                },
                postponeTime:"",
                imageStyle:"height:20px;width:auto;",
                personList:[]
            }
        },
        methods: {
            getExtensionTime:function (start1, end1, type) {
                var d1 = new Date(start1.toString()).getTime()/1000;
                var d2 = new Date(end1.toString()).getTime()/1000;

                if(type == '1'){
                    var str = parseInt((d2-d1)/3600);
                }else{
                    var str = parseInt((d2-d1)/3600/24);
                }
                return str;
            },

            getName:function (item) {
                return item.isExtra=='1'?item.content:item.name;
            },

            isApplyPerson:function(arr){
                var obj = null;
                if(arr.isArray){
                    arr.forEach(function (item) {
                        if(["1"].indexOf(item.signCatalog.signerType)>-1){
                            obj = item;
                        }
                    });
                    return obj;
                }
               return null;
            },

            _getPersonels:function(type){
                var m=this.model.workPersonnels.filter(function (item) {
                   return item.type==type;
                });
                var m=JSON.parse((JSON.stringify(m)));

                //没有ptw10 类型
                // m.forEach(function (item) {
                //     item.cloudFiles=item.cloudFiles.filter(function (item) {
                //         return item.dataType=="PTW10"
                //     })
                // });
                return m;
            },

            getList:function (arr, type) {
              return arr.filter(function (item) {
                  return item.type == type;
              })
            },
            convertFileData: function(cloudFiles) {
                return _.map(cloudFiles, function(item){
                    return LIB.convertFileData(item);
                });
            },
            getList2:function (arr, type) {
                var list =  arr.filter(function (item) {
                    return item.type == '10';
                });
                var list2 = arr.filter(function (item) {
                    return item.type == '1';
                });

                list.forEach(function (item) {
                    list2.forEach(function (item2) {
                        if(item.signCatalogId == item2.signCatalogId){
                            item.cloudFiles = item2.cloudFiles;
                        }
                    })
                })

                console.log(list, list2);
                return list;
            },

            initData: function () {
                // status状态 1:填报作业票,2:现场落实,3:作业会签,4:作业批准,
                // 5:作业监测,6:待关闭,7:作业取消,
                // 8:作业完成,9:作业续签,10:被否决

                //result 作业结果 1:作业完成,2:作业取消,3:作业续签4:作业

                var _this=this;
                _this.personList = [];
                _this.isWorkClose = false;
                if(!this.vo.renewedWorkPermits) return ;
                var len = this.vo.renewedWorkPermits.length;
                var xuqian = false;
                this.vo.renewedWorkPermits.forEach(function (item) {

                   if(["7", "8", "9", "11"].indexOf(item.status) > -1) {
                       _this.isWorkClose = true;
                   }
                    if((["7", "8", "9", "11"].indexOf(item.status) > -1)) {
                        if(item.versionNum > 1) {
                            if(item.extensionType == '1')
                                _this.personList.push({type:'postpone',list:_this.getList(item.workPersonnels, "1"),vo:item});
                            else
                                _this.personList.push({type:'delay',list:_this.getList(item.workPersonnels, "1"),vo:item});
                        }
                        if(item.result=='1'){
                            _this.personList.push({type:'success',list:_this.getList(item.workPersonnels, "8"),vo:item});
                        }else if(item.result == '2'){
                            _this.personList.push({type:'cancel',list:_this.getList(item.workPersonnels, "9"),vo:item});
                        }
                    }else{
                       if(len ==1 ){
                           _this.personList.push({type:'success',list:_this.getList(item.workPersonnels, "8"),vo:item});
                           _this.personList.push({type:'cancel',list:_this.getList(item.workPersonnels, "9"),vo:item});
                           if(item.extensionType == '1'){
                               if(item.versionNum > 1)
                                   _this.personList.push({type:'postpone',list:_this.getList(item.workPersonnels, "1"),vo:item});
                               else
                                   _this.personList.push({type:'postpone',list:_this.getList(item.workPersonnels, "10"),vo:item});
                           }else {
                               if(item.versionNum > 1)
                                   _this.personList.push({type:'delay',list:_this.getList(item.workPersonnels, "1"),vo:item});
                               else
                                   _this.personList.push({type:'delay',list:_this.getList(item.workPersonnels, "10"),vo:item});
                           }
                       }else if(len >1){
                           if(item.extensionType == '1'){
                               _this.personList.push({type:'postpone',list:_this.getList(item.workPersonnels, "1"),vo:item});
                           }else {
                               _this.personList.push({type:'delay',list:_this.getList(item.workPersonnels, "1"),vo:item});
                           }
                       }
                    }

                    var obj = {};
                    _this.personList.forEach(function (item) {
                        if(obj[item.type]){
                            obj[item.type].push(item);
                        } else{
                            obj[item.type] = [];
                            item.isOne = true;
                            obj[item.type].push(item);
                        }
                    });
                    var arrList = []
                    for(var key  in obj){
                        arrList = arrList.concat(obj[key])
                    };
                    _this.personList = arrList;
                });

                // if(_this.isWorkClose == false){
                //     this.vo.renewedWorkPermits.forEach(function (item) {
                //         _this.personList.push({type:'success',list:_this.getList(item.workPersonnels, "8"),vo:item});
                //         _this.personList.push({type:'cancel',list:_this.getList(item.workPersonnels, "9"),vo:item});
                //         if(_this.vo.workPermit.extensionType == '1'){
                //             _this.personList.push({type:'postpone',list:_this.getList(item.workPersonnels, "1"),vo:item});
                //         }else{
                //             _this.personList.push({type:'delay',list:_this.getList(item.workPersonnels, "1"),vo:item});
                //         }
                //     })
                // }

return;

                this.isWorkClose =["6","7", "8", "9"].indexOf(this.model.status) > -1;
                //this.isWorkClose =["7", "8", "9"].indexOf(this.model.status) > -1;
                this.vo.renewedWorkPermits.forEach(function (item) {

                });
                if (this.isWorkClose) {
                    var typeObj = {"1": "success", "2": "cancel", "3": "postpone"};
                    this.currentWorkResult =typeObj[this.model.result];
                    if("success,cancel".indexOf(this.currentWorkResult)>-1){
                        this.personnel["9"]=this._getPersonels("9"); // 取消签字人员
                        this.personnel["10"]=this._getPersonels("10"); // 作业续签或者延期
                        this.personnel["8"]=this._getPersonels("8"); //完成签字人员
                    }


                    if("postpone".indexOf(this.currentWorkResult)>-1){
                        var id=this.model.id;
                        var index=_.findIndex(this.workcard.versionPermitList,{id:id});
                        if(index!=undefined){
                            var item=this.workcard.versionPermitList[index+1];
                            this.postponeTime=item.permitStartTime+"到"+item.permitEndTime;
                        }
                    }
                }
            },
        },
        watch: {
            'model': function () {
                this.initData();
            }
        }
    })
})
