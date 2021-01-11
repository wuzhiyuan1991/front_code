define(function (require) {
    var Vue = require("vue");
    var LIB = require("lib");
    var template = require("text!./gelifh.html");
    var commonApi = require("../../api");
    var videoHelper = require("tools/videoHelper");

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
               fileNormalList:[]
            }
        },
        methods:{
            convertPath: LIB.convertPath,
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
                setTimeout(function () {
                    videoHelper.create("player", file);
                }, 50);
            },
        },
        computed: {
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
                            return item1.id == item2.stuffId
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
                return _.findWhere(this.model.workIsolations, {type: "1"});
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
