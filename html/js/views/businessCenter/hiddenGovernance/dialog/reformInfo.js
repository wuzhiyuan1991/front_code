define(function (require) {
    var LIB = require('lib');
    var videoHelper = require("tools/videoHelper");
    //右侧滑出详细页
    var tpl = require("text!./reformInfo.html");

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
            reformType: String,
            verifyDate:String,
            verifierName:String
        },
        data: function () {
            return {
                items: [],
                reform: {},
                verify:{},
                mainModel: {
                	isShowContent : false,
                	activeReformId : '',
                    reforms : [],
                    enableRespOrgId: false
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
                }
            };
        },
        watch: {
            reforms: function () {
                this.init(this.reforms);
            },
            reform: function () {
                this._getFormConfig()
                console.log(this.reform)
            }
        },
        methods: {
            doClose: function () {
                this.$dispatch("ev_detailColsed");
            },
            toggleOpen: function () {
                this.reform.open = !this.reform.open;
            },
            toggleVerifyOpen: function () {
                this.verify.open = !this.verify.open;
            },
            calcBackground: function () {

                // 判断节点是否完成
                if (this.reform.date) {
                    return 'hidden-complete-rect';
                }
                return 'hidden-processing';
            },
            briefBackground: function () {
                if (this.reform.open) {
                    return ''
                }
                return this.calcBackground();
            },
            briefVerifyBackground: function () {
                if (this.verify.open) {
                    return ''
                }
                return 'hidden-verify';
            },
            init: function () {
                var item;
                var _this = this;
                if(!this.reforms || this.reforms.length < 1) {
                    return;
                }
                item = this.reforms[0];
                this.reform = {
                    date: item.dealDate,
                    open: false,
                    dealName: item.dealName,
                    // dealStep: item.dealStep,
                    // emergencyStep: item.emergencyStep,
                    // schedule: item.schedule,
                    images: _.filter(item.cloudFiles, function (item) {
                        return item.dataType === "E11";
                    }),
                    videos: _.filter(item.cloudFiles, function (item) {
                        return item.dataType === 'E12'
                    }),
                    docs: _.filter(item.cloudFiles, function (item) {
                        return item.dataType === 'E111'
                    }),
                    result: item.vaildReformResult
                };
                this.verify = {
                    date: _this.verifyDate,
                    open: false,
                    dealName: _this.verifierName,
                    images: _.filter(item.cloudFiles, function (item) {
                        return item.dataType === "E21";
                    }),
                }

                // if(items && items[0]) {
                //
                //     this.reform = this.reforms[0];
                //     console.log(this.reform);
                //
                // 	this.mainModel.activeReformId = items[0].id;
                //     this.mainModel.isShowContent = true;
                // }
                //
                // _.each(items, function (item) {
                //     var reform = _.deepExtend({},item,{scheduleList:[]});
                //     if (item.schedule != null) {
                //         reform.scheduleList = JSON.parse(item.schedule);
                //     }
                //     _this.mainModel.reforms.push(reform);
                //     var reformPics = [];
                //     var verifyPics = [];
                //     var reformVideos = [];
                //     var verifyVideos = [];
                //     var reformFiles = [];
                //     var verifyFiles = [];

                    // _.each(item.cloudFiles, function (pic) {
                    //     if (pic.dataType === "E11") {
                    //         reformPics.push({fileId: pic.id});
                    //     } else if (pic.dataType === "E12") {
                    //         reformVideos.push({fileId: pic.id});
                    //     } else if (pic.dataType === "E21") {
                    //         verifyPics.push({fileId: pic.id});
                    //     } else if (pic.dataType === "E22") {
                    //         verifyVideos.push({fileId: pic.id});
                    //     } else if (pic.dataType === "E111") {
                    //         reformFiles.push({fileId: pic.id,orginalName:pic.orginalName});
                    //     } else if (pic.dataType === "E211") {
                    //         verifyFiles.push({fileId: pic.id,orginalName:pic.orginalName});
                    //     }
                    // });
                    //
                    // _this.reformPic.show.push(reformPics&&reformPics.length>0?true:false);
                    // _this.reformVideo.show.push(reformVideos&&reformVideos.length>0?true:false);
                    // _this.verifyPic.show.push(verifyPics&&verifyPics.length>0?true:false);
                    // _this.verifyVideo.show.push(verifyVideos&&verifyVideos.length>0?true:false);
                    // _this.reformFile.show.push(reformFiles&&reformFiles.length>0?true:false);
                    // _this.verifyFile.show.push(verifyFiles&&verifyFiles.length>0?true:false);
                    //
                    // _this.reformPic.reformPics.push(reformPics);
                    // _this.reformVideo.reformVideos.push(reformVideos);
                    // _this.verifyPic.verifyPics.push(verifyPics);
                    // _this.verifyVideo.verifyVideos.push(verifyVideos);
                    // _this.reformFile.reformFiles.push(reformFiles);
                    // _this.verifyFile.verifyFiles.push(verifyFiles);
                // });
            },
            doPic: function (file, fileExt) {
                if (fileExt === 'mp4') {
                    this.playModel.show = true;
                    setTimeout(function () {
                        videoHelper.create("player", LIB.convertFileData(file));
                    }, 50);
                    return;
                }
                this.picModel.show = true;
                this.picModel.file = LIB.convertFileData(file);
            },
            doPlay: function (fileId) {
                this.playModel.show = true;
                setTimeout(function () {
                    videoHelper.create("player", fileId);
                }, 50);
            },
            convertPath: LIB.convertPath,
            convertPicPath: LIB.convertImagePath,
            convertFilePath: LIB.convertFilePath,
            backgroundStyle: function (file) {
                return "url(" + this.convertPicPath(LIB.convertFileData(file)) + "),url(" + LIB.ctxPath() + "/html/images/default.png)"
            },
            videoBackgroundStyle: function () {
                return "url(" + this.convertPath() + "),url(" + LIB.ctxPath() + "/html/images/default.png)"
            },
            _getFormConfig: function ()  {
                this.mainModel.enableRespOrgId = LIB.getBusinessSetStateByNamePath("poolGovern.enableRespOrgId");
            },
        },
        ready: function () {
            this.init();
        }
    });
    return detail;
})
;