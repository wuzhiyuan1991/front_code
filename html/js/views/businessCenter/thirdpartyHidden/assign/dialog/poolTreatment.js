define(function (require) {
    //基础js
    var LIB = require('lib');
    //数据模型
    var api = require("../../vuex/api");
    var template = LIB.renderHTML(require("text!./poolTreatment.html"));
    var components = {
        "risk-model":require("views/basicSetting/basicFile/evaluationModel/dialog/riskModel"),
        "user-select-modal":require("componentsEx/selectTableModal/userSelectModal"),
        "multi-select-input":require("./multiSelectInput")
    };
    var formData = function(){
        return {
            //审批结果  1-无法整改 2-需要整改 3-无需整改 4-线下协调 5-驳回
            status:null,
            //审批意见
            approvalOpinion : null,
            //隐患等级
            riskType:null,
            //风险等级
            riskLevel:null,
            //整改要求
            dealDemand:null,
            //最大整改时间
            maxDealDate:null,
            //最大验证期限
            maxAcceptDate:null,
            //审批人
            auditUsers : [],
            //整改人
            dealCandidates:[],
            //验证人
            accepterCandidates:[]
        }
    };
    var mapUsers = function(users){
        return _.map(users,function(user){
                        return {id:user.id, name:user.name};
                    });
    };
    //去重合并用户列表
    var concatUsers = function(target, source){
        _.each(source, function(u1){
            if(!_.some(target, function(u2){return u1.id === u2.id;})){
                target.push(u1);
            }
        });
    };
    var evalTrueUsers = function(userMap,riskType){
        var trueUsers = [];
        _.some(userMap, function(users, key){
            var condition = key.replace(" or "," || ").replace(" and "," && ").replace(/\s*riskType([^a-zA-Z\d]*)/g,'"'+riskType+'"$1');
            if(eval(condition)){
                trueUsers = users;
                return true;
            }else{
                return false;
            }
        });
        return trueUsers;
    };
    var userSelectModel = function(){
        return {
            visible:false,
            type:null,
            filterData:null,
            canUpdateVerifyUser:LIB.getSettingByNamePath("envBusinessConfig.poolGovern.verifyUser") != 0,
            //审批人
            auditUsers:[],
            //整改人
            dealCandidates:[],
            //验证人
            accepterCandidates:[]
        }
    };
    var riskModel = function(){
        return {
            id: null,
            opts: [],
            result: null
        }
    };
    var dataModel = function(){
        return {
            mainModel:{
                //能否指派
                canAssign:false,
                enableUpdateUsers:false,
                vo:new formData(),
                rules:null,
                selectModel:{
                    //审批结果
                    status:[],
                    //隐患类型
                    riskTypes: _.map(LIB.getDataDicList("risk_type"),function(d){return {id: d.id, name: d.value};}),
                    //风险等级
                    riskModel:new riskModel(),
                    //用户列表
                    userSelected:new userSelectModel()
                }
            }
        }
    };

    var opts = LIB.VueEx.extend({
        template: template,
        components: components,
        props:{
            //表单类型  1-审批  2-指派
            formType:String,
            poolId:String
        },
        data:dataModel,
        computed:{
            //是否初始化指派内容
            canInitAssign:function(){
                return this.formType == 2 || (this.formType == 1 && this.mainModel.canAssign);
            },
            //是否显示指派信息
            showAssignModel:function(){
                return this.formType == 2 || (this.formType == 1 && this.mainModel.canAssign && this.mainModel.vo.status == '11');
            }
        },
        watch:{
            poolId:function(nVal){
                if(!_.isNull(nVal)){
                    this.init();
                }
            },
            'mainModel.vo.status':function(newVal){
                var settings = _.find(this.mainModel.selectModel.status, function(s){return newVal == s.id});
                if(settings && settings.taskSettings && settings.taskSettings.enableUpdate){
                    this.mainModel.enableUpdateUsers = true;
                    this.mainModel.selectModel.userSelected.auditUsers = mapUsers(settings.taskSettings.users);
                }else{
                    this.mainModel.enableUpdateUsers = false;
                }
                if('11' == newVal){
                    this.initAssignFormRules();
                }
            },
            "mainModel.vo.riskType":function(nVal,oVal){
                if(!_.isEmpty(this.mainModel.acceptersMap)){
                    var accepterCandidates = evalTrueUsers(this.mainModel.acceptersMap, nVal);
                    this.mainModel.selectModel.userSelected.accepterCandidates = mapUsers(accepterCandidates);
                }
            }
        },
        methods:{
            /**
             * 初始化指派表单校验
             */
            initAssignFormRules:function(){
                if(this.showAssignModel){
                    var _this = this;
                    var rules = _.deepExtend({}, this.mainModel.rules, {
                                "maxDealDate": [
                                    {required: true, message: '请选择整改期限'}
                                ],
                                "maxAcceptDate": [
                                    {required: true, message: '请输入验证期限'}
                                ],
                                "riskType": [
                                    { required: true, message: '请输入隐患等级'}
                                ],
                                "dealDemand": [
                                    {required: true, message: '请输入整改要求'},
                                    LIB.formRuleMgr.length(500,1)
                                ],
                                "riskLevel": [
                                    {required: true, validator:function(rule, value, callback){
                                        var errors = [];
                                        var riskModel = _this.mainModel.selectModel.riskModel;
                                        if(_.isNull(riskModel) || _.isNull(_.propertyOf(riskModel)("id"))){
                                            errors.push("请选择风险等级");
                                        }
                                      callback(errors);
                                    }}
                                ],
                                dealCandidates: [
                                    {required: true, validator:function(rule,value,callback){
                                        if(_.isEmpty(_this.mainModel.selectModel.userSelected.dealCandidates)){
                                            callback('请选择整改责任人');
                                        }else{
                                            callback();
                                        }
                                    }}
                                ],
                                accepterCandidates: [
                                    {required: true, validator:function(rule,value,callback){
                                        if(_.isEmpty(_this.mainModel.selectModel.userSelected.accepterCandidates)){
                                            callback('请选择验证责任人');
                                        }else{
                                            callback();
                                        }
                                    }}
                                ]
                    });
                    this.$set("mainModel.rules", rules);
                }
            },
            /**
             * 初始化表单校验
             */
            initFormRules:function(){
                var _this = this;
                if(this.formType == 1){//初始化审批表单校验
                    var rules = _.deepExtend({}, this.mainModel.rules, {
                            status: [
                                {required: true, message: '请选择审批结果'}
                            ],
                            users:[
                                {required: true, validator:function(rule,value,callback){
                                    if(_this.mainModel.enableUpdateUsers
                                            && _.isEmpty(_this.mainModel.selectModel.userSelected.auditUsers)){
                                        callback("下一环节审批人不能为空");
                                    }else{
                                        callback();
                                    }
                                }}
                            ],
                            remark: [
                                {required: true, message: '请输入审批意见'},
                                LIB.formRuleMgr.length(500,1)
                            ]
                        });
                    this.$set("mainModel.rules", rules);
                }else if(this.formType == 2){//初始化指派表单校验
                    this.initAssignFormRules();
                }

            },
            /**
             * 初始化表单数据
             */
            initData:function(){
                var _this = this;
                var poolId = this.poolId;
                this.mainModel.vo = new formData();
                this.mainModel.rules = {};
                this.mainModel.selectModel.riskModel = new riskModel();
                this.mainModel.selectModel.status = [];
                this.mainModel.selectModel.userSelected = new userSelectModel();
                var initAssign = function(){
                    if(_this.canInitAssign){//初始化指派信息
                        api.get({id: poolId}).then(function (res) {
                            if (res.data.riskLevel) {
                                _this.mainModel.selectModel.riskModel = JSON.parse(res.data.riskLevel);
                            }
                        });
                        api.reformUsers({id: poolId}).then(function(res){
                            //验证人 begin
                            var accepterCandidates = res.data.accepterCandidates;
                            if("1" == accepterCandidates.type){
                                _this.mainModel.selectModel.userSelected.accepterCandidates = mapUsers(accepterCandidates.userList);
                            }else{
                                _this.$set("mainModel.acceptersMap", accepterCandidates.userMap);
                            }
                            //验证人 end
                            //整改人 begin
                            var dealCandidates = res.data.dealCandidates;
                            if("1" == dealCandidates.type){
                                _this.mainModel.selectModel.userSelected.dealCandidates = mapUsers(dealCandidates.userList);
                            }else{
                                _this.$set("mainModel.dealsMap", dealCandidates.userMap);
                            }
                            //整改人 end
                        });
                    }
                };
                if(this.formType == 1){//初始化审批信息
                    api.approvalStatus({"id":poolId}).then(function(res){
                        var data = res.data;
                        _this.mainModel.selectModel.status = data.approvalStatus;
                        _this.mainModel.canAssign = data.canAssign;
                        initAssign();
                    });
                }else{
                    initAssign();
                }
            },
            /**
             * 初始化，当poolId更改时执行
             */
            init:function(){
                this.$refs.ruleform.resetFields();
                this.initData();
                this.initFormRules();
            },
            //弹框选择人员
            doSelectUsers:function(type){
                var userSelected = this.mainModel.selectModel.userSelected;
                userSelected.type = type;
                userSelected.visible = true;
                userSelected.filterData ={compId : LIB.user.compId};
            },
            //保存弹框选择的人员信息
            doSaveUser:function(selectedData){
                if (selectedData) {
                    var userSelected = this.mainModel.selectModel.userSelected;
                    if(1 == userSelected.type){//审核人
                        concatUsers(userSelected.auditUsers, selectedData);
                    }else if(2 == userSelected.type){//整改人
                        concatUsers(userSelected.dealCandidates, selectedData);
                    }else if(3 == userSelected.type){//验证人
                        concatUsers(userSelected.accepterCandidates, selectedData);
                    }
                }
            },
            getFormData:function(){
                var formData = _.deepExtend({poolId:this.poolId},this.mainModel.vo);
                if(this.mainModel.enableUpdateUsers){//审批人列表
                    formData.auditUsers = this.mainModel.selectModel.userSelected.auditUsers;
                }
                if(this.showAssignModel){//指派相关信息
                    //风险等级
                    formData.riskLevel = JSON.stringify(this.mainModel.selectModel.riskModel);
                    //整改人
                    formData.dealCandidates = this.mainModel.selectModel.userSelected.dealCandidates;
                    //验证人
                    formData.accepterCandidates = this.mainModel.selectModel.userSelected.accepterCandidates;
                }
                return formData;
            },
            doSave:function(){
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        var formData = _this.getFormData();
                        api.processReform(formData).then(function(res){
                            if (res.data && res.error != '0') {
                                LIB.Msg.warning("处理失败");
                                return;
                            } else {
                                _this.$dispatch("ev_processedReform");
                                LIB.Msg.info("处理成功");
                            }
                        });
                    }
                });
            }
        }
    });

    return opts;
});