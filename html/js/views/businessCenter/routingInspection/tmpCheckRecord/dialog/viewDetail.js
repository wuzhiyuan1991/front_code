define(function (require) {
    var LIB = require('lib');
    var videoHelper = require("tools/videoHelper");
    require("components/select/Select");
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./viewDetail.html");

    var newVO = function () {
        return {
            checkRecordDetailId: null,
            name: null,
            type: null,
            problem: null,
            remark: null,
            talkResult: null,
            suggestStep: null,
            vedioList: [],
            picList: [],
            audioList: [],
            attachmentList: [],
            show: false,
            checkResult: null,
            latentDefect: null,
            attr1:null
        }
    };
    var dataModel = {
        mainModel: {
            vo: newVO(),
            tabName: "1"
        },
        playModel: {
            title: "视频播放",
            show: false,
            id: null
        },
        audioModel: {
            visible: false,
            path: null
        }

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
            convertPath: LIB.convertPath,
            doPlay: function (file) {
                this.playModel.show = true;
                setTimeout(function () {
                    videoHelper.create("player", file);
                }, 50);
            },
            changeTab: function (tabEle) {
                this.mainModel.tabName = tabEle.key;
            },
            doClose: function () {
                this.$dispatch("ev_viewDetailClose")
            },
            doPlayAudio: function (path) {
                this.audioModel.path = path;
                this.audioModel.visible = true;
            }
        },
        events: {
            //数据加载
            "ev_viewDetailReload": function (obj) {
                //注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
                var _vo = dataModel.mainModel.vo;
                //清空数据
                _.extend(_vo, newVO());
                //初始化数据
                _.deepExtend(_vo, obj);
                //现实tab 并加载
                this.mainModel.vo.show = true;

                this.mainModel.tabName = "1";
//				this.$nextTick(function(){
//					this.mainModel.tabName = "1";
//				});
                //初始化图片
                api.listFile({recordId: _vo.checkRecordDetailId}).then(function (res) {
                    _vo.picList = [];
                    _vo.vedioList = [];
                    _vo.audioList = [];
                    _vo.attachmentList = [];

                    var fileData = res.data;
                    //初始化图片数据
                    _.each(fileData, function (pic) {
                        if (pic.dataType === "N1") {//N1隐患图片
                            _vo.picList.push(LIB.convertFileData(pic));
                        }
                        else if (pic.dataType === "N2") {//N2隐患视频
                            _vo.vedioList.push(LIB.convertFileData(pic));
                        }
                        else if(pic.dataType === "N5") {
                            _vo.audioList.push(LIB.convertFileData(pic));
                        }
                        else if(pic.dataType === "N6") {
                            _vo.attachmentList.push(LIB.convertFileData(pic));
                        }
                    });
                });
            }
        }
//		,
//		ready:function(){
//			var _vo = dataModel.mainModel.vo;
//		}
    });

    return detail;
});