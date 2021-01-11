define(function (require) {
    var LIB = require('lib');
    var videoHelper = require("tools/videoHelper");
    require("components/select/Select");
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./viewDetail.html");

    var dataModel = {
        mainModel: {
            tabName: "1"
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
        picList: null,
        videoList: null,
        content: ''
    };


    //声明detail组件
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
        data: function () {
            return dataModel;
        },
        methods: {
            convertPicPath: LIB.convertPicPath,
            doPic: function (fileId) {
                this.picModel.show = true;
                this.picModel.id = fileId;
            },
            convertPath: LIB.convertPath,
            doPlay: function (fileId) {
                this.playModel.show = true;
                setTimeout(function () {
                    videoHelper.create("player", fileId);
                }, 50);
            },
            changeTab: function (tabEle) {
                this.mainModel.tabName = tabEle.key;
            },
            doClose: function () {
                this.$dispatch("ev_viewDetailClose")
            },
            _init: function (id) {
                this.mainModel.tabName = "1";
                var _this = this;
                //初始化图片
                api.listFile({recordId: id}).then(function (res) {
                    _this.picList = [];
                    _this.videoList = [];

                    var fileData = res.data;
                    //初始化图片数据
                    _.each(fileData, function (pic) {
                        if (pic.dataType === "X1") {//E1隐患图片
                            _this.picList.push({fileId: pic.id});
                        }
                        else if (pic.dataType === "X2") {//E2隐患视频
                            _this.videoList.push({fileId: pic.id});
                        }
                    });
                });
            }
        },
        events: {
            //数据加载
            "ev_viewDetailReload": function (id, content) {
                this.content = content;
                this._init(id);
            }
        }
    });

    return detail;
});