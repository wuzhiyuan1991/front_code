define(function (require) {
    var LIB = require('lib');
    var videoHelper = require("tools/videoHelper");
    var api = require("../vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./reformInfo.html");
    //初始化数据模型
    var newVO = function () {
        return {
            id: null,
            acceptDate: null,
            maxAcceptDate: null,
            acceptRemark: null,
            accepterId: null,
            accepterName: null,
            dealDate: null,
            dealDemand: null,
            dealId: null,
            dealName: null,
            dealRemark: null,
            dealStep: null,
            emergencyStep: null,
            maxDealDate: null,
            reviewUserIds: null,
            poolId: null,
            cloudFiles: [],
            schedule:null,
            scheduleList:[],
        }
    };

    //Vue组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *    el
     template
     components
     componentName
     props
     data
     computed
     watch
     methods
     events
     vue组件声明周期方法
     created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var detail = LIB.Vue.extend({
        template: tpl,
        props: {
            reforms: [Array],
            reformType: String
        },
        computed: {
            isNormalReform:function(){
                return "0" != this.reformType;
            }
        },
        data: function () {
            return {
                mainModel: {
                	isShowContent : false,
                	activeReformId : '',
                    vo: newVO(),
                    reforms : []
                },
                reformPic: {
                    reformPics: [],
                    show: []
                },
                reformVideo: {
                    reformVideos: [],
                    show: []
                },
                verifyPic: {
                    verifyPics:  [],
                    show: []
                },
                verifyVideo: {
                    verifyVideos: [],
                    show: []
                },
                playModel: {
                    title: "视频播放",
                    show: false,
                    id: null
                },
                picModel: {
                    title: "图片显示",
                    show: false,
                    id: null
                },
                itemColumns:[
                    {
                        title:"时间",
                        fieldName:"date"
                    },
                    {
                        title:"整改详情",
                        fieldName:"detail"
                    }
                    ]
            };
        },
        watch: {
            reforms: function () {
                this.initMainModel(this.reforms);
            }
        },
        methods: {
            doClose: function () {
                this.$dispatch("ev_detailColsed");
            },
            doShowCardContent:function(reformId) {
                if(this.mainModel.isShowContent == false || this.mainModel.activeReformId == reformId) {
                    this.mainModel.isShowContent = !this.mainModel.isShowContent;
                }
                this.mainModel.activeReformId = reformId;
            },
            initMainModel: function () {
                var items = this.reforms;
                var _this = this;
                if(items && items[0]) {
                	this.mainModel.activeReformId = items[0].id;
                    this.mainModel.isShowContent = true;
                }
                
                _.each(items, function (item) {
                    var reform = _.deepExtend({},item,{scheduleList:[]});
                    if (item.schedule != null) {
                        reform.scheduleList = JSON.parse(item.schedule);
                    }
                    _this.mainModel.reforms.push(reform);
                    var reformPics = [];
                    var verifyPics = [];
                    var reformVideos = [];
                    var verifyVideos = [];
                    // if (item.schedule) {
                    //     _this.mainModel.vo.scheduleList.push(JSON.parse(item.schedule));
                    //     debugger
                    // }
                    _.each(item.cloudFiles, function (pic) {
                        if (pic.dataType == "E11") {
                            reformPics.push({fileId: pic.id});
                        } else if (pic.dataType == "E12") {
                            reformVideos.push({fileId: pic.id});
                        } else if (pic.dataType == "E21") {
                            verifyPics.push({fileId: pic.id});
                        } else if (pic.dataType == "E22") {
                            verifyVideos.push({fileId: pic.id});
                        }
                    });

                    _this.reformPic.show.push(reformPics&&reformPics.length>0?true:false);
                    _this.reformVideo.show.push(reformVideos&&reformVideos.length>0?true:false);
                    _this.verifyPic.show.push(verifyPics&&verifyPics.length>0?true:false);
                    _this.verifyVideo.show.push(verifyVideos&&verifyVideos.length>0?true:false);

                    _this.reformPic.reformPics.push(reformPics);
                    _this.reformVideo.reformVideos.push(reformVideos);
                    _this.verifyPic.verifyPics.push(verifyPics);
                    _this.verifyVideo.verifyVideos.push(verifyVideos);

                });
            },
            doPic: function (fileId) {
                this.picModel.show = true;
                this.picModel.id = fileId;
            },
            doDeleteFile: function (fileId, index, arrays) {
                var ids = [];
                ids[0] = fileId;
                api._deleteFile(null, ids).then(function (data) {
                    if (data.data && data.error != '0') {
                        LIB.Msg.warning("删除失败");
                        return;
                    } else {
                        arrays.splice(index, 1);
                        LIB.Msg.success("删除成功");
                    }
                });
            },
            doPlay: function (fileId) {
                this.playModel.show = true;
                setTimeout(function () {
                    videoHelper.create("player", fileId);
                }, 50);
            },
            //背景图片
            backgroundStyle : function(fileId){
                return "url("+this.convertPicPath(fileId,'watermark')+"),url("+LIB.ctxPath()+"/html/images/default.png)"
            },
            convertPicPath: LIB.convertPicPath,
            convertPath: LIB.convertPath
        },
        ready: function () {
            this.initMainModel();
        }
    });

    return detail;
})
;