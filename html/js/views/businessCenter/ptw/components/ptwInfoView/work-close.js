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

            getTimeExtens: function (item, vo) {
                var t = new Date(item).getTime()/1000;
                if(vo.extensionUnit == '1'){
                   var  count = vo.extensionTime * 3600;
                }else {
                   var  count =  vo.extensionTime * 3600 *24;
                }

                return timestampToTime(t+count);

                function timestampToTime(timestamp) {
                    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                    var Y = date.getFullYear() + '-';
                    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                    var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
                    var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
                    var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
                    var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
                    return Y+M+D+h+m+s;
                }
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

            getTimeFn: function (time) {
                if(time) return time.slice(0,16)
            },

            getFiles:function (data,type) {
                var files = [];
                _.each(data,function (item) {
                    if(item.dataType==type) {
                        files.push(LIB.convertFileData(item));
                    }
                });
                return files;
            },

            getStuffList: function (item) {
                var list = this.model.workStuffs.filter(function (stuff) {
                    return stuff.workPersonnelId == item.id && stuff.type=='11'
                });
                return list;
            },
            getItemName: function (item) {
                return item.name || item.content;
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
                    _this.personList = [];
                    _this.$set('personList', arrList);


                });
return;
            },
        },
        watch: {
            'model': function () {
                this.initData();
            }
        }
    })
})
