define(function (require) {
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./jobSign.html");
    var api = require("../vuex/api");
    var commonApi=require("../../api");
    //初始化数据模型
    var newVO = function () {
        return {
            //评审结果
            signResult: "1",
            //评审意见
            signOpinion: null,
        }
    };

    //Vue数据
    var dataModel = {
        modify: true,
        mainModel: {
            vo: newVO(),
            opType: 'create',
            isReadOnly: false,
            title: "作业批准人会签",
            //验证规则
            rules: {
                "signResult": [LIB.formRuleMgr.require("评审结果")],
                "signOpinion": [LIB.formRuleMgr.length(200)],
            },
            user: LIB.user,
            signImg: [],//签名的图片
            isStepClose:false,
        },
        timer: null,
        permitSign:{},//作业批准人对象 si

    };

    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
        template: tpl,
        props: {
            workPersonnel: Object,
            workcard: Object,
        },
        computed: {
            signImgQrcode: function () {
                return '/ptwworkpermit/$permitId/workpersonnel/$personId/qrcode'
                    .replace("$permitId", this.workPersonnel.workPermitId)
                    .replace("$personId", this.workPersonnel.id)
                //return '/ptwworkcard/$id/authorize/qrcode'.replace('id',this.mainModel.vo.id)
            },
            isCloseStep:function(){ //是否是关闭阶段
                return this.workcard.workPermit.versionNum>1;
            }
        },
        watch: {
            visible: function (val) {
                if (val) {
                    this.startTimer();
                    this.afterInitData();
                } else {
                    this.clearTimer();
                }
            },
        },
        data: function () {
            return dataModel;
        },
        created:function(){
            var _this=this;
            commonApi.getCatalogList({type:"5","criteria.intsValue":JSON.stringify({"signerType":[2]})}).then(function(data)  {
                _this.permitSign=data[0];
                _this.mainModel.title=_this.permitSign.name;
            })
        },
        methods: {
            newVO: newVO,
            beforeInit: function () {
                this.mainModel.vo = this.newVO();
            },
            afterInitData: function () {
                this.mainModel.vo.signResult = '1';
                this._getSignImg(true);
            },
            beforeDoSave:function(){
                var vo=this.mainModel.vo;
                if(vo.signResult=='1'&&(!this.mainModel.signImg||this.mainModel.signImg.length===0)){
                    LIB.Msg.error("请在APP端进行电子签名");
                    return false;
                }
                return true;
            },
            doChangesignResult:function(){
               if(this.mainModel.vo.signResult == '1'){
                   this.startTimer();
               }
               else{
                   this.clearTimer();
               }
            },
            doResign: function () {
                var me = this;
                //删除图片
                api.deleteFile(null,[this.mainModel.signImg[0].id]).then(function () {
                    me.mainModel.signImg = null;
                    me.startTimer();
                })

            },
            _getSignImg:function(setNull){
                var me=this;
                api.listFile({
                    dataType: "PTW9",
                    recordId: me.workPersonnel.id,
                }).then(function(res) {
                    if (res.data&&res.data.length>0) {
                        me.mainModel.signImg =res.data;
                        me.clearTimer();
                    }
                    else if(setNull){  me.mainModel.signImg =null}
                }).catch(function (error) {
                    console.log(error);
                    me.clearTimer();
                })
            },
            startTimer: function () {
                var me = this;
                if(this.mainModel.signImg&&this.mainModel.signImg.length>0){return;}
                this.timer = setInterval(function () {
                    me._getSignImg();
                    // try {

                    // }
                    // catch (e) {
                    //     throw e;
                    //     me.clearTimer();
                    // }
                }, 2000);//每两秒执行一次
            },
            clearTimer: function () {
                if (this.time !== null) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
            }
        },
        beforeDestroy: function () {
            this.clearTimer();
        },
    });
    return detail;
});