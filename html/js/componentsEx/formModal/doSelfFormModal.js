define(function(require){
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./doSelfFormModel.html");
    var emerResourceSelectModal = require("componentsEx/selectTableModal/emerResourceSelectModal");
    var exerciseSchemeSelectModal = require("componentsEx/selectTableModal/exerciseSchemeSelectModal");
    var maxValues = 0;
    //初始化数据模型
    var newVO = function() {
        return {
            selfEvaluationMode:null,
            selfEvaluatorNum:0
        }
    };

    //Vue数据
    var dataModel = {
        modify:true,
        mainModel : {
            maxValues:0,
            vo : newVO(),
            opType : 'create',
            isReadOnly : false,
            title:"添加",

            //验证规则
            rules:{
                "selfEvaluationMode" : [LIB.formRuleMgr.require("自评参与模式"),
                    LIB.formRuleMgr.length(50)
                ],

                "selfEvaluatorNum":[
                    {required:true,validator:function(rule, value, callback){

                        if(!/^\d+$/.test(value)){
                            return callback(new Error("请输入正整数"))
                        }
                        if(isNaN(value)){
                            return callback(new Error("请输入正整数"))
                        }

                        if(value <= 0){
                            return callback(new Error("请输入大于0的数"));
                        }

                        return callback();

                    }}
                ],
            },
            emptyRules:{}
        },
        selectModel : {
            emerResourceSelectModel : {
                visible : false,
                filterData : {orgId : null}
            },
            exerciseSchemeSelectModel : {
                visible : false,
                filterData : {orgId : null}
            },
        },

    };

    var detail = LIB.Vue.extend({
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
        template: tpl,
        components : {
            "emerresourceSelectModal":emerResourceSelectModal,
            "exerciseschemeSelectModal":exerciseSchemeSelectModal,
        },
        watch:{
            visible:function (val) {
                val && this.afterInitData();
            }
        },
        props:{
           vo:{
               default:null
           }
        },
        data:function(){
            return dataModel;
        },
        methods:{
            newVO : newVO,
            afterInitData:function () {
                var _this = this;
                this.mainModel.vo.selfEvaluatorNum = this.vo.selfEvaluatorNum;
                this.mainModel.vo.selfEvaluationMode = this.vo.selfEvaluationMode;
                var resource  = this.$resource("exercisescheme/exerciseparticipants/list/1/10");
                var param = {"criteria.intsValue": JSON.stringify({"type":["2"],"isInsider":["1"]}),id:this.vo.id};
                resource.get(param).then(function (res) {
                    _this.mainModel.maxValues = res.data.total;
                    _this.mainModel.vo.selfEvaluatorNum = res.data.total;
                })
            },
            doSaveInfo:function () {
                var _this = this;
                if(this.mainModel.maxValues < this.mainModel.vo.selfEvaluatorNum){
                    return;
                }
                this.$refs.ruleform.validate(function (valid) {
                    if(valid){
                        _this.$emit("do-update", _this.mainModel.vo);
                        _this.visible = false;
                    }
                })
            }
        }
    });

    return detail;
});