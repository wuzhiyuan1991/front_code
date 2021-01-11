define(function (require) {
    //基础js
    var BASE = require('base');
    var LIB = require('lib');
    var api = require("../vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./pic.html");
    //初始化数据模型
    var newVO = function () {
        return {
            id: null,
            createDate: null,
            createBy: null,
            modifyDate: null,
            deleteFlag: null,
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
            transferDate: null,
            transferId: null,
            transferName: null,
            type: null,
            cloudFiles: [],
            pictures: [],
            videos: []
        }
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            pictures: []
        },
        picModel: {
            title: "图片显示",
            show: false,
            id: null
        },
        processPic:null
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
        data: function () {
            return dataModel;
        },
        props: {
            poolId: [String]
        },
        computed:{
            //processPic:function(){
            //    if (this.poolId) {
            //        return BASE.SwConfig.url + "/pool/pic/" + this.poolId+"?"+Math.random();
            //    }else{
            //        return "";
            //    }
            //}
        },
        methods: {
            doPic: function (fileId) {
                this.picModel.show = true;
                this.picModel.id = fileId;
            },
            doClose: function () {
                this.$dispatch("ev_detailColsed");
                LIB.Msg.info("关闭");
            }
        },
        events:{
            init:function(){
                if (this.poolId) {
                    this.processPic = BASE.SwConfig.url + "/pool/pic/" + this.poolId+"?"+Math.random();
                }else{
                    this.processPic = "";
                }
            }
        }
    });

    return detail;
});