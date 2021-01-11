define(function (require) {
    var Vue = require("vue");
    var LIB=require("lib");
    var template = require("text!./license-issue.html");
    var commonApi=require("../../api");
    var model=require("../../model");
    var videoHelper = require("tools/videoHelper");

    return Vue.extend({
        template: template,
        props:{
            model:{
                type:Object,
                required:true,
            },
            vo:{
                type:Object,
                require:true
            }
        },
        data: function () {
            return {
                signRoles: [],
                playModel: {
                    title: "视频播放",
                    show: false,
                    id: null
                },
            }
        },
        created:function(){
            var _this=this;
            this.initData();
        },
        methods: {
            convertPath:LIB.convertPath,
            initData:function(){
                var _this = this;
                var signPersonnels = [];
                _this.signRoles = [];
                // var signPersonnels=this.vo.firstUsedPermit.workPersonnels.filter(function (item) {

                if(this.vo.firstUsedPermit && this.vo.firstUsedPermit.workPersonnels.length>0){
                    var signPersonnels=this.vo.firstUsedPermit.workPersonnels.filter(function (item) {
                        return item.type=="1";
                    });
                    _.each(signPersonnels, function (item) {
                        var obj = {isShow:false};
                          

                         

                        _this.signRoles.push(_.extend(obj, item));
                    });
                
                }
            },
            getStatus:function (val) {
                if(val == 1) return '<span style="color:green;">已审批</span>';
                if(val == 0) return '<span style="color:grey;">待审批</span>';
                if(val == 2) return '<span style="color:red;">已否决</span>';
            },
            changeStatus:function (item) {
                item.isShow = !item.isShow;
            },
            getFiles:function (data,type) {
                var files=data.filter(function (item) {
                    return   item.dataType==type
                });
                return files;
            },
            // 播放
            doPlay: function (file) {
                this.playModel.show = true;
                setTimeout(function () {
                    videoHelper.create("player", LIB.convertFileData(file));
                }, 50);
            },
        },
        watch:{
            'model':function (val) {
                this.initData();
            }
        }
    })
})
