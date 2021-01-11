define(function(require){
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./selfEvaluationDetails.html");
    var api = require("../vuex/api");

    //初始化数据模型
    var newVO = function () {
        return {
            id : null,
            //编码
            code : null,
            //状态 0:未提交,1:已提交
            status : null,
            //禁用标识 0:启用,1:禁用
            disable : "0",
            //所属公司id
            compId : null,
            //所属部门id
            orgId : null,
            //提交时间
            submitTime : null,
            //自评人
            user : {id:'', name:''},
            //演练方案
            exerciseScheme : {id:'', name:''},
            //自评详情
            selfEvaluationDetails : [],
        }
    };

    var detail = LIB.Vue.extend({
        computed:{
            getList:function () {
                var arr = this.getDataDicList('iem_emer_plan_status');
                var list = [];
                var _this = this;
                if(parseInt(this.vo.type) === 3){
                    _.each(arr, function (item, index) {
                        if(index !== 3 && index!==4 && index < parseInt(_this.vo.status)){
                            list.push(item);
                        }
                    })
                }else{
                    _.each(arr, function (item, index) {
                        if(index < parseInt(_this.vo.status)){
                            list.push(item);
                        }
                    })
                }
                return list;
            }
        },
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
                // default:''
            },
            orgId:{
                type:String,
                default:''
            }
        },
        watch:{
            // visible:function(val){
            //     val && this._init()
            // }
        },

        data:function(){
            return {
                nodeFlag: {

                }, // 编辑框相关插入操作记录
                mainModel : {
                    title:"详情",
                    vo:newVO(),
                    isReadOnly:true,
                    selfEvaluationQuestions:null,
                    selfEvaluationDetails:null,
                },
                picFile:null, // 签名文件
                fromVo:null,
                showPic:false
            };
        },

        methods:{
            doClose:function () {
                this.visible =  false;
            },

            getLabelName:function (item, index) {
                return  ((index+1 + '、') + item.content);
            },

            getOperateTime:function (val) {
                var str  = (val + "").substr(0, 16);
                return str;
            },
            //    获取文件
            //    this.getFileList(this.uploadModel.params.recordId);

            getBgColor:function (index) {
                if(!isNaN(index) && parseInt(index)%2==0){
                    return "bgf91"
                }
                return "bgff1"
            },

            selfInit:function (data) {
                var _this = this;
                this.showPic = true;
                this.mainModel.vo = newVO();
                api.getTask({id:data.id}).then(function (res) {
                    if(res.data){
                        _this.mainModel.vo = res.data;
                        _this.getSelfEvaluationDetails();
                        if(_this.mainModel.vo.status == '0'){
                            _this.mainModel.isReadOnly = false;
                        }
                    }
                });
            },

            _init:function (id) {
                var param = '';
                var _this = this;
                this.showPic = true;
                this.mainModel.vo = newVO();
                this.mainModel.isReadOnly = true;
                api.getTask({id:id}).then(function (res) {
                    if(res.data){
                        _this.mainModel.vo = res.data;
                        _this.getSelfEvaluationDetails();
                    }
                });

                this.getFileList(id);
            },

            getFileList:function(id){
                var _this = this;
                api.getFileList({recordId:id, dateType:'SE1'}).then(function (res) {
                    _this.picFile = res.data;
                })
            },

            doSubmitDetail:function (val) {
                var _this = this;
                var temp = true;
                _.each(this.mainModel.selfEvaluationQuestions, function (item) {
                    if(_.isEmpty(item.values)){
                        temp = false;
                    }
                });
                if(!temp){
                    LIB.Msg.info("信息未填写完成");
                    return ;
                }

                // {
                //     //自评答案(选择题为选项id，问答题手填)
                //     answer : null,
                //         //自评任务
                //         selfEvaluationTask : {id:''},
                //     //自评问卷问题
                //     selfEvaluationQuestion : {id:''},
                // }

                var params  = {
                    id:this.mainModel.vo.id,
                    orgId:this.mainModel.vo.orgId,
                    selfEvaluationDetails:[]
                };
                _.each(this.mainModel.selfEvaluationQuestions, function (item) {
                    if(item.type == '1' || item.type == '3'){
                        params.selfEvaluationDetails.push({
                            //自评答案(选择题为选项id，问答题手填)
                            answer : item.values,
                            // //自评任务
                            // selfEvaluationTask : {id:_this.mainModel.vo.id},
                            //自评问卷问题
                            selfEvaluationQuestion : {id:item.id},
                        });
                    }else{
                        params.selfEvaluationDetails.push({
                            //自评答案(选择题为选项id，问答题手填)
                            answer : item.values.join(","),
                            // //自评任务
                            // selfEvaluationTask : {id: _this.mainModel.vo.id},
                            //自评问卷问题
                            selfEvaluationQuestion : {id:item.id},
                        });
                    }
                });
                // 0 提交
                if(val == 0){
                    api.submitTask(params).then(function (res) {
                        LIB.Msg.info("提交成功,请到app进行签名确认");
                        _this.afterDoSave({ type: "U" }, res.body);
                        _this.changeView("view");
                        _this.$dispatch("ev_dtUpdate");
                        _this.storeBeforeEditVo();
                        _this.doClose();
                    });
                }else {
                    // 1 保存
                    api.saveTask(params).then(function (res) {
                        LIB.Msg.info("保存成功");
                        _this.afterDoSave({ type: "U" }, res.body);
                        _this.changeView("view");
                        _this.$dispatch("ev_dtUpdate");
                        _this.storeBeforeEditVo();
                    });
                }
            },


            getSelfEvaluationDetails:function () {
                // 获取值
                var _this = this;
                _.each(this.mainModel.vo.selfEvaluationQuestions,function (item) {
                    if(item.type == "1"){
                        item.values = null;
                    }else if(item.type == '2'){
                        item.values = [];
                    }else{
                        item.values = '';
                    }
                });
                this.mainModel.selfEvaluationQuestions = this.mainModel.vo.selfEvaluationQuestions;
                this.mainModel.selfEvaluationDetails = this.mainModel.vo.selfEvaluationDetails;

                this.mainModel.selfEvaluationQuestions = [].concat(this.mainModel.vo.selfEvaluationQuestions);

                if(this.mainModel.selfEvaluationDetails && this.mainModel.selfEvaluationDetails.length>0){
                    _.each(_this.mainModel.selfEvaluationDetails, function (item) {
                        _.each(_this.mainModel.selfEvaluationQuestions, function (opt) {
                            if(opt.id == item.questionId){
                                if(opt.type == '2'){
                                    opt.values = item.answer.split(",")
                                }else{
                                    opt.values = item.answer;
                                    // opt.values = item.split(",")[1];
                                }
                            }
                        });
                    });
                }
            },

            doSaveInfo:function () {
                var _this = this;
                this.$refs.ruleform.validate(function (val) {
                    if(val){
                        _this.mainModel.vo.compId = _this.orgId;
                        api.createEnterpriseGrade(_this.mainModel.vo).then(function (res) {
                            _this.visible = false;
                            _this.$emit("change");
                        })
                    }
                })
            },

            doClose:function () {
                this.visible = false;
            },
            doShowCargoPoint:function () {
                this.selectModel.cargoPointSelectModel.filterData.id = this.id;
                this.selectModel.cargoPointSelectModel.visible = true;
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