define(function (require) {
    var Vue = require("vue");
    var LIB = require("lib");
    var template = require("text!./gelifh.html");
    var commonApi = require("../../api");
    var videoHelper = require("tools/videoHelper");

    function getBlindPlatePic(arr, type, rolType , ptwType) {
        var list = _.filter(arr,function (item) {
            return item.type == type;
        } ) || [];
        var newList = [];
        var personLists = []
        if(list.length>0){
            _.each(list, function (listItems) {
                personLists = _.filter(listItems.workPersonnels,function (item) {
                    return item.type == rolType;
                }) || [];
                _.each(personLists, function (person) {
                    newList = newList.concat(_.filter(person.cloudFiles || [], function (person) {
                        return person.dataType == ptwType
                    }) || [])
                })

            })
        }

        _.each(newList, function (item) {
            item.fileId = item.id;
        });
        // console.log(newList,list,personLists, type, rolType , ptwType)
        return newList;
    }
    function getOptionTime(arr, type) {
        return _.find(arr, 'type' , type) || {};
    }

    return Vue.extend({
        template: template,
        components: {},
        props: {
            model: {
                type: Object,
                required: true,
            }
        },

        data:function(){
           return  {
                dataType:{
                    view:"PTW5",
                    isolate:"PTW6",
                    disisolate:"PTW7"
                },
               playModel: {
                   title: "视频播放",
                   show: false,
                   id: null
               },
               fileNormalList:[],
               tableModel:{
                   values:[],
                   columns: [
                       //  LIB.tableMgr.column.cb,
                       //  LIB.tableMgr.column.code,
                       //  LIB.tableMgr.column.disable,
                       {
                           title: "管道设备",
                           fieldName: "pipeName",
                           // orderName: "riskPointType",
                           // renderClass: 'riskPointType textarea1',
                           renderClass: 'textarea1',
                           width: 100
                       },
                       {
                           //风险点
                           title: "介质",
                           fieldName: "medium",
                           renderClass: 'textarea1',
                           width: 75
                       },
                       {
                           title: "温度",
                           fieldName: "temperature",
                           renderClass: 'textarea1',
                           width: 75
                       },
                       {
                           title: "压力",
                           fieldName: "pressure",
                           renderClass: 'textarea1',
                           width: 75
                       },
                       {
                           title: "盲板",
                           width: 240,
                           "children": [
                               {
                                   title: "材质",
                                   fieldName: "texture",
                                   width: 75,
                                   renderClass: 'textarea1',


                               },
                               {
                                   title: "规格",
                                   fieldName: "specification",
                                   width: 75,
                                   renderClass: 'textarea1',


                               },
                               {
                                   title: "编号",
                                   fieldName: "number",
                                   width: 75,
                                   renderClass: 'textarea1',

                               },
                           ]
                       },
                       {
                           title: "实施时间",
                           width: 160,
                           "children": [
                               {
                                   title: "堵",
                                   fieldName: "texture",
                                   width: 75,
                                   renderClass: 'textarea1',
                                   render: function (data) {
                                       var item = getOptionTime(data.blindPlateOperations1, '1');
                                       return item.operateTime || '';
                                   },

                               },
                               {
                                   title: "抽",
                                   fieldName: "specification",
                                   renderClass: 'textarea1',
                                   width: 75,
                                   render: function (data) {
                                       var item = getOptionTime(data.blindPlateOperations1, '2');
                                       return item.operateTime || '';
                                   }
                               }
                           ]
                       },
                       {
                           title: "作业人",
                           width: 160,
                           "children": [
                               {
                                   title: "堵",
                                   fieldName: "texture",
                                   width: 75,
                                   render:function (data) {
                                       // LIB.convertImagePath(image, 'scale')
                                       // return getBlindPlatePic(data.blindPlateOperations, '1', '11', 'PTW32')
                                       var signLists = getBlindPlatePic(data.blindPlateOperations1, '1', '11', 'PTW36') || [];
                                       var str = '';
                                       _.each(signLists, function (signs) {
                                           str+= '<img style="height: 21px;width:auto;" src="'+LIB.convertImagePath(signs, 'scale')+'" />'
                                       })
                                       return str;
                                   },
                                   showTip:false,
                                   renderClass: 'textarea1',


                               },
                               {
                                   title: "抽",
                                   fieldName: "specification",
                                   width: 75,
                                   renderClass: 'textarea1',
                                   render:function (data) {
                                       // LIB.convertImagePath(image, 'scale')
                                       // return getBlindPlatePic(data.blindPlateOperations, '1', '11', 'PTW32')
                                       var signLists = getBlindPlatePic(data.blindPlateOperations1, '2', '13', 'PTW36') || [];
                                       var str = '';
                                       _.each(signLists, function (signs) {
                                           str+= '<img style="height: 21px;width:auto;" src="'+LIB.convertImagePath(signs, 'scale')+'" />'
                                       })
                                       return str;
                                   },
                                   showTip:false
                               }
                           ]
                       },
                       {
                           title: "监护人",
                           width: 160,
                           "children": [
                               {
                                   title: "堵",
                                   fieldName: "texture",
                                   width: 75,
                                   renderClass: 'textarea1',
                                   render:function (data) {
                                       // LIB.convertImagePath(image, 'scale')
                                       // return getBlindPlatePic(data.blindPlateOperations, '1', '11', 'PTW32')
                                       var signLists = getBlindPlatePic(data.blindPlateOperations1, '1', '12', 'PTW36') || [];
                                       var str = '';
                                       _.each(signLists, function (signs) {
                                           str+= '<img style="height: 21px;width:auto;" src="'+LIB.convertImagePath(signs, 'scale')+'" />'
                                       })
                                       return str;
                                   },
                                   showTip:false
                               },
                               {
                                   title: "抽",
                                   fieldName: "specification",
                                   width: 75,
                                   render:function (data) {
                                       // LIB.convertImagePath(image, 'scale')
                                       // return getBlindPlatePic(data.blindPlateOperations, '1', '11', 'PTW32')
                                       var signLists = getBlindPlatePic(data.blindPlateOperations1, '2', '14', 'PTW36') || [];
                                       var str = '';
                                       _.each(signLists, function (signs) {
                                           str+= '<img style="height: 21px;width:auto;" src="'+LIB.convertImagePath(signs, 'scale')+'" />'
                                       })
                                       return str;
                                   },
                                   renderClass: 'textarea1',
                                   showTip:false
                               }
                           ]
                       },
                       {
                           title: "",
                           width: 75,
                           render: function () {
                               return '<span style="color:#33a6ff;cursor: pointer;">详情</span>'
                           }
                       }
                   ]
               },
               vo:{},
               detailModelShow:false
           }
        },
        methods:{
            convertPath: LIB.convertPath,
            getBlindPlatePic:function (arr, type, rolType , ptwType) {
                var personType = '';
                if(type == '1' && rolType=='1'){
                    personType = '11'
                }
                if(type == '1' && rolType=='2'){
                    personType = '12'
                }
                if(type == '2' && rolType=='1'){
                    personType = '13'
                }
                if(type == '2' && rolType=='2'){
                    personType = '14'
                }
                var newList = [];
                var list = _.filter(arr, 'type', personType) || [];

                _.each(list, function (item) {
                   var files = _.filter(item.cloudFiles, 'dataType', ptwType);
                  newList =  newList.concat(files || []);
               });
                return newList;
            },
            doClickCell: function (obj) {
                if(obj.cell && obj.cell.colId == '13'){
                    if(obj.entry && obj.entry.data){
                        this.vo = obj.entry.data;
                        this.detailModelShow = true;
                    }
                }
            },
            getFiles:function(data,type){
                var files = [];
                _.each(data, function(item){
                   if(item.dataType == type)  {
                       files.push(LIB.convertFileData(item));
                   }
                });
                return files;
            },
            convertFilePath: LIB.convertFilePath,
            getFilesNormal:function (data, type) {
                var files = [];
                _.each(data, function(item){
                    if(item.mime){
                        if(item.dataType==type && item.mime.indexOf("image")==-1 && item.mime.indexOf("video")==-1){
                            files.push(LIB.convertFileData(item));
                        }
                    }else if(item.ext != "mp3"){
                        files.push(LIB.convertFileData(item));
                    }

                });
                return files;
            },
            getFileImgs:function (data, type) {
                var files = [];
                _.each(data, function(item){
                    if(item.mime && item.dataType==type && item.mime.indexOf("image")>-1){
                        files.push(LIB.convertFileData(item));
                    }
                });
                return files;
            },
            getFileVideos:function (data, type) {
                var files = [];
                data.filter(function (item) {
                    if(item.dataType==type && ((item.mime && item.mime.indexOf("video")>-1) || item.ext == "mp3")){
                        files.push(LIB.convertFileData(item));
                    }
                });
                return files;
            },

            // 播放
            doPlay: function (file) {
                this.playModel.show = true;
                console.log(file)
                setTimeout(function () {
                    videoHelper.create("player", file);
                }, 50);
            },
            
            getName: function (arr) {
                var list = '';
                _.each(arr, function (item) {
                    list += item.name + ','
                });
                if(list.length >0)
                    return list.slice(0, list.length-1);
                return '';
            },
            rowClass: function () {
                return 'bg-white'
            }
        },
        computed: {
            tableList: function () {
                var list = [];
                if(this.model.blindPlates){
                    for(var i=0; i<this.model.blindPlates.length; i++){
                        var blindPlateOperations = this.model.blindPlates[i].blindPlateOperations;
                        for(var j=blindPlateOperations.length-1; j>=0; j){
                            var item = _.clone(this.model.blindPlates[i]);
                            if(!item.blindPlateOperations1){
                                item.blindPlateOperations1 = []
                            }
                            if(blindPlateOperations[j]){
                                item.blindPlateOperations1.push(blindPlateOperations[j])
                                if(j == blindPlateOperations.length-1 && blindPlateOperations[j].type == '2'){
                                    list.push(item);
                                    j-=1;
                                    continue;
                                }
                            }
                            if(blindPlateOperations[j-1] && blindPlateOperations[j-1].type != blindPlateOperations[j].type){
                                item.blindPlateOperations1.push(blindPlateOperations[j-1]) // 抽堵一组 需合并
                                list.push(item);
                                j-=2;
                                continue;
                            }
                            list.push(item);
                            j-=1;
                        }
                        if(blindPlateOperations.length == 0) list.push(this.model.blindPlates[i]);
                    }
                    if(list.length == 0){
                        return this.model.blindPlates;
                    }
                }
                return list;
            },
            geliffList :function () {
                // var list= this.model.workStuffs.filter(function (item) {
                //     return item.type ==5;
                // });

                var list = this.model.workStuffs.filter(function (item) {
                    return item.type == 5;
                });
                var list2 = this.model.cardTpl.ptwCardStuffs.filter(function (item) {
                    return item.stuffType == 5;
                });
                _.each(list, function (item1) {
                    item1.select = true;
                });
                _.each(list2,function (item2) {
                    if(!_.find(list, function (item1) {
                            return item1.stuffId == item2.stuffId
                        })){
                        list.push({name:item2.ptwStuff.name})
                    }
                });
                return list;
            },
            gelifunName: function () {
                var fun= this.model.workStuffs.filter(function (item) {
                    return item.type ==5&&item.checkResult==2;
                })[0];
                return fun.name;
            },
            //隔离类型 1:工艺隔离,2:机械隔离,3:电气隔离,4:系统屏蔽
            process: function () {
                var obj = _.findWhere(this.model.workIsolations, {type: "1"});
                return obj;
            },
            mechanical: function () {
                return _.findWhere(this.model.workIsolations, {type: "2"});
            },
            electric: function () {
                return _.findWhere(this.model.workIsolations, {type: "3"});
            },
            systemMask: function () {
                return _.findWhere(this.model.workIsolations, {type: "4"});
            },
            imageStyle:function () {
                return 'height:20px;width:auto;'
            }

        }

    })
})
