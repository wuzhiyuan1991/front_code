define(function(require){
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./assessmentTask.html");
    var api = require("../vuex/api");

    //初始化数据模型
    var newVO = function() {
        return {
            //预案或方案要求
            demand : null,
            //演练时间（默认演练方案时间）
            exerciseDate : null,
            //评估项目(默认为演练方案的演练科目)
            subjects : null,
            // //演练方案
            // exerciseScheme : {id:'', name:''},
            //评估人
            estimator:null,
            //评估详情
            exerciseEstimateDetails : [],
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
                "demand" : [LIB.formRuleMgr.require("预案或方案要求"),
                    LIB.formRuleMgr.length(2000)
                ],
                "exerciseDate" : [LIB.formRuleMgr.require("演练时间"),
                    LIB.formRuleMgr.length(2000)
                ],
                "subjects" : [LIB.formRuleMgr.require("评价项目"),
                    LIB.formRuleMgr.length(200)
                ],
                "exerciseScheme" : [LIB.formRuleMgr.require("评估项目"),
                    LIB.formRuleMgr.length(200)
                ],
                "estimator" : [LIB.formRuleMgr.require("评估人"),
                    LIB.formRuleMgr.length(2000)
                ],
                // "name" : [LIB.formRuleMgr.require("名称"),
                //     LIB.formRuleMgr.length(50)
                // ],
            }
        },
        oldVo:null,
        isCheck:true,

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
            vo:{
                type:Object,
            },
            isEdit:{
                type: Boolean,
                default: false
            }
        },
        watch:{
            visible:function(val){
                val && this._init()
            }
        },

        data:function(){
            return dataModel;
        },

        methods:{

            getTime:function (val) {
                if(val){
                    return (val + '').substr(0,16);
                }
                return ''
            },
            doAddRow:function () {
                var obj = {
                    //客观记录
                    objectiveRecord : null,
                    //存在问题
                    problem : null,
                    //评价内容
                    content : null,
                    //改进建议
                    suggestion : null,
                };
                this.mainModel.vo.exerciseEstimateDetails.push(obj);
            },

            doDelRow:function (index) {
                this.mainModel.vo.exerciseEstimateDetails.splice(index,1);
            },

            doItemEdit:function () {
                this.oldVo = _.cloneDeep(this.mainModel.vo);
                this.mainModel.isReadOnly = false;
            },
            doCancelEdit:function () {
                this.mainModel.vo = this.oldVo;
                this.mainModel.isReadOnly = true;
            },

            // exerciseEstimateDetails
            checkexErciseEstimateDetails:function () {
                var isTrue = true;
                var count = -1;

                if(this.mainModel.vo.exerciseEstimateDetails.length == 0){
                    isTrue = false;
                    LIB.Msg.error("请填写评价内容，客观记录，存在问题，改进建议等信息");
                    return false;
                }

                for(var i=0; i<this.mainModel.vo.exerciseEstimateDetails.length; i++){
                    var obj = this.mainModel.vo.exerciseEstimateDetails[i];
                    for(var key in obj){
                        if(key == "objectiveRecord" || key == "problem" ||key == "content" ||key == "suggestion"){
                            if(obj[key] && isTrue){
                                if(obj[key].length>2000){
                                    isTrue = false;
                                    count = 1;
                                }
                            }else{
                                isTrue = false;
                                count == 0;
                            }
                        }
                    }
                }
                if(count == 0){
                    LIB.Msg.error("信息未填写完整");
                }
                if(count == 1){
                    LIB.Msg.error("请输入的字符限制在2000个字以内")
                }

                return isTrue;
            },

            doSave:function () {
                this.mainModel.vo.exerciseScheme ={id:this.vo.id,name:null};

                var _this = this;

                // 去除方案
                this.clearScheme();
                this.$refs.ruleform.validate(function (valid) {
                    if(valid){
                        if(!_this.checkexErciseEstimateDetails()){
                            // LIB.Msg.error("信息未填写完整");
                            _this.isCheck = false;
                            return ;
                        }
                        if(_this.vo.exerciseEstimate){
                            api.updateExerciseestimate(_this.mainModel.vo).then(function (res) {
                                _this.$emit("updateassessment", _this.mainModel.vo);
                                _this.mainModel.isReadOnly = true;
                                LIB.Msg.info("保存成功");
                            });
                            _this.isCheck = true;
                            _this.isEdit = !_this.isEdit;
                            return ;
                        }
                        api.saveExerciseestimate(_this.mainModel.vo).then(function (res) {
                            _this.mainModel.vo.id = res.data.id;
                            _this.$emit("updateassessment", _this.mainModel.vo);
                            _this.mainModel.isReadOnly = true;
                            LIB.Msg.info("保存成功");
                        })
                        _this.isEdit = !_this.isEdit;
                    }
                });
            },

            // 去除方案
            clearScheme:function () {
                _.each(this.mainModel.vo.exerciseEstimateDetails,function (item) {
                    item.exerciseEstimate =  null;
                })
            },

            _init:function () {
                this.isCheck = true;
                if(this.vo.exerciseEstimate){
                    this.mainModel.vo = _.cloneDeep(this.vo.exerciseEstimate);
                    this.mainModel.isReadOnly = true;
                }else{
                    this.mainModel.vo = newVO();
                    this.doAddRow();
                    this.mainModel.isReadOnly = true;
                    this.mainModel.vo.estimator = LIB.user.name;
                    this.mainModel.vo.exerciseDate = this.vo.exerciseDate;
                    this.mainModel.vo.subjects = this.vo.subjects;
                    this.oldVo = _.cloneDeep(this.mainModel.vo);
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