define(function(require){
    var LIB = require('lib');
    var api = require("../vuex/api");
    //数据模型
    var tpl = require("text!./editModal.html");

    //初始化数据模型
    var newVO = function() {
        return {
            name:"",
            type:null,
            id:null
        }
    };

    //Vue数据
    var dataModel = {
        mainModel : {
            vo : newVO(),
            title:"添加",
            type:'',
            inputLabel:null,
            //验证规则
            rules:{
                "code" : [LIB.formRuleMgr.length(100)],
                "name" : [LIB.formRuleMgr.length(200)],
                // "retrialDate" : [LIB.formRuleMgr.require("预定复审时间")],
                // "result" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("复审结果")),
                // "uploadDate" : [LIB.formRuleMgr.allowStrEmpty],
                // "cert.id" : [LIB.formRuleMgr.require("证书")],
                // "uploader.id" : [LIB.formRuleMgr.allowStrEmpty],
            },
        },

    };

    var detail = LIB.Vue.extend({
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
        template: tpl,
        components : {},
        props: {
            visible:{
                type:Boolean,
                default:false
            }
        },
        data:function(){
            return dataModel;
        },
        methods:{
            newVO : newVO,
            init:function(obj){
                var rules=[LIB.formRuleMgr.length(200)];
                this.type = obj.type;
                _.extend(this.mainModel.vo, obj)
                if(this.type == 6){
                    this.mainModel.inputLabel = "作业取消声明";
                    rules.push(LIB.formRuleMgr.require("作业取消声明"));
                    this.mainModel.rules["name"]=rules;
                }else if(this.type == 7){
                    this.mainModel.inputLabel = "作业完成声明";
                    rules.push(LIB.formRuleMgr.require("作业完成声明"));
                    this.mainModel.rules["name"] =rules
                }
            },
            doCancel:function () {
                this.visible = false;
            },
            doSave : function() {
                //当beforeDoSave方法明确返回false时,不继续执行doSave方法, 返回undefine和true都会执行后续方法
                if(this.beforeDoSave() === false) {
                    return;
                }
                var _this = this;
                this.$refs.ruleform.validate(function (valid){
                    if (valid) {
                        var data = {};

                        var _vo = _this.buildSaveData() || _this.mainModel.vo;

                        _.deepExtend(data, _vo);

                        //_.deepExtend(_this.mainModel.vo, newVO());
                        if(_this.autoHide) {
                            _this.visible = false;
                        }

                        _this.$emit("do-save", data);

                    }
                });
            },
        }
    });

    return detail;
});