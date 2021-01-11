define(function (require) {
    var LIB = require('lib');
	var videoHelper = require("tools/videoHelper");
    var api = require("../vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./baseInfo.html");
    //初始化数据模型
    var newVO = function () {
        return {
            id: null,
            createDate: null,
            createBy: null,
            checkObjectId: null,
            checkObject: {
                name: null
            },
            danger: null,
            isRectification: null,
            lastReformId: null,
            principalId: null,
            principalName: null,
            problem: null,
            registerDate: null,
            remark: null,
            riskType: null,
            riskLevel: null,
            sourceType: null,
            status: null,
            title: null,
            type: null,
            reformerId: null,
            reformerName: null,
            reformDate: null,
            verifierId: null,
            verifierName: null,
            verifyDate: null,
            cloudFiles: [],
            pictures: [],
            videos: []
        }
    };
    //来源类型, 0:手动登记, 1:检查记录, 2:随即观察, 3:分享
    var sourceTypeMap = {0: '手动登记', 1: '检查记录', 2: '随机观察', 3: '分享'};
    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO()
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
        props: ['baseData'],
        mixins: [LIB.VueMixin.dataDic],
        data: function () {
            return dataModel;
        },
        computed: {
            sourceType : function(){
                return this.mainModel.vo != null ? sourceTypeMap[this.mainModel.vo.sourceType] : "";
            }
        },
        watch: {
            "baseData": function () {
                this.initData();
            }
        },
        methods: {
            doClose: function () {
                this.$dispatch("ev_detailColsed");
                LIB.Msg.info("关闭");
            },
            initData: function () {
                if (this.baseData) {
                    //封装数据
                    this.mainModel.vo = this.baseData;
                }
            },
            doPic: function (fileId) {
                this.picModel.show = true;
                this.picModel.id = fileId;
            },
            doPlay: function (fileId) {
                this.playModel.show = true;
                setTimeout(function () {
                	videoHelper.create("player",fileId);
                }, 50);
            },
            //背景图片
            backgroundStyle : function(fileId){
                return "url("+this.convertPicPath(fileId,'watermark')+"),url("+LIB.ctxPath()+"/html/images/default.png)"
            },
            convertPicPath: LIB.convertPicPath,
            convertPath: LIB.convertPath,
        },
        ready: function () {
            this.initData();
        }

    });

    return detail;
});