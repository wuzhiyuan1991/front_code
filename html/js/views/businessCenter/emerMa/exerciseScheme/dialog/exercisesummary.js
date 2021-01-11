define(function(require){
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./exercisesummary.html");
    var api = require("../vuex/api");

    //初始化数据模型
    var newVO = function() {
        return {
            //演习前的准备
            preparation : null,
            //演习的改进建议
            suggestionSummary : null,
            //演习经过简述(默认演练方案的步骤)
            processDesc : null,
            //
            revelation : null,
            //演习的不足之处
            shortcomings : null,
            //演习的评估情况
            estimateSummary : null,
            //备注
            remarks : null,
            //演练总结
            exerciseScheme : {id:'', name:''},
        }
    };



    //Vue数据
    var dataModel = {
        mainModel : {
            vo : newVO(),
            opType : 'view',
            isReadOnly : false,
            title:"",

            //验证规则
            rules:{
                "preparation" : [LIB.formRuleMgr.require("演习前的准备"), LIB.formRuleMgr.length(2000)],
                "suggestionSummary" : [LIB.formRuleMgr.require("演习的改进建议"), LIB.formRuleMgr.length(2000)],
                "processDesc" : [LIB.formRuleMgr.require("演习经过简述"), LIB.formRuleMgr.length(2000)],
                "revelation" : [LIB.formRuleMgr.require("演习的启示"), LIB.formRuleMgr.length(2000)],
                "shortcomings" : [LIB.formRuleMgr.require("演习的不足之处"), LIB.formRuleMgr.length(2000)],
                "estimateSummary" : [LIB.formRuleMgr.require("演习的评估情况"), LIB.formRuleMgr.length(2000)],
                "remarks" : [LIB.formRuleMgr.length(2000)],
            }
        },
        oldVo:null,
        vo:null,
        isShowIcon:false

    };

    var detail = LIB.Vue.extend({

        mixins : [LIB.VueMixin.dataDic],
        template: tpl,
        components:{
        },

        props: {
            visible: {
                type: Boolean,
                default: false
            },
            isEdit:{
                type: Boolean,
                default: false
            }
            // vo:{
            //     type:Object,
            // },
        },
        watch:{

        },

        data:function(){
            return dataModel;
        },

        methods:{

            doItemEdit:function () {
                this.oldVo = _.cloneDeep(this.mainModel.vo);
                this.mainModel.isReadOnly = false;
            },
            doCancelEdit:function () {
                this.mainModel.vo = this.oldVo;
                this.mainModel.isReadOnly = true;
            },
            doSave:function () {
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if(valid){
                        _this.mainModel.vo.exerciseScheme = {id:_this.vo.id, name:null}
                        if(_this.vo.exerciseSummary){
                            api.updateExercisesummary(_this.mainModel.vo).then(function (res) {
                                _this.$emit("updatesummary", _this.mainModel.vo);
                                _this.mainModel.isReadOnly = true;
                            });
                            _this.isEdit = !_this.isEdit;
                            return ;
                        }
                        api.saveExercisesummary(_this.mainModel.vo).then(function (res) {
                            _this.mainModel.vo.id  = res.data.id;
                            _this.$emit("updatesummary", _this.mainModel.vo);
                            _this.mainModel.isReadOnly = true;
                            _this.isEdit = !_this.isEdit;
                        });
                    }
                });
            },

            copyShortComings:function () {
                var _this = this;
                if(this.vo.exerciseEstimate && this.vo.exerciseEstimate.exerciseEstimateDetails && this.vo.exerciseEstimate.exerciseEstimateDetails.length>0){
                    var str = '';
                    _.each(this.vo.exerciseEstimate.exerciseEstimateDetails, function (item) {
                        str+= item.problem + "\n";
                    })
                }
                if(this.mainModel.vo.shortcomings){
                    LIB.Modal.confirm({
                        title: '“演习的不足”已经存在内容，是否覆盖？',
                        onOk: function () {
                            _this.mainModel.vo.shortcomings = str;
                        }
                    })
                }else{
                    this.mainModel.vo.shortcomings = str;
                }
            },
            _init:function (vo) {
                this.vo = vo;
                // 判断是否显示覆盖按钮
                if(this.vo.exerciseEstimate && this.vo.exerciseEstimate.exerciseEstimateDetails && this.vo.exerciseEstimate.exerciseEstimateDetails.length>0&&this.vo.exerciseEstimate.exerciseEstimateDetails[0].problem){
                    this.isShowIcon = true;
                }  else{
                    this.isShowIcon = false;
                }
                if(this.vo.exerciseSummary){
                    this.mainModel.vo = _.cloneDeep(this.vo.exerciseSummary);
                    this.mainModel.isReadOnly = true;
                }else{
                    this.mainModel.vo = newVO();
                    this.mainModel.vo.processDesc = this.vo.executionStep;
                    this.oldVo = _.cloneDeep(this.mainModel.vo);
                    this.mainModel.isReadOnly = true;
                }
            },

            doClose:function () {
                this.visible = false;
            },
            getUUId:function () {
                api.getUUID().then(function(res){
                    var group={};
                    group.id = res.data;

                });
            },
        },
        init: function(){
            this.$api = api;
        }

    });

    return detail;
});