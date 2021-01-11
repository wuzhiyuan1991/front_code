define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../../vuex/api");
    var tpl = require("text!./reform.html");
    //风险评估模型
    var riskModel = require("views/basicSetting/basicFile/evaluationModel/dialog/riskModel");
//input弹窗选人
   var userSelect = require("../../../../../componentsEx/userSelect/userSelect");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var multiSelectInput = require("./multiSelectInput");
    var canUpdateVerifyUser = LIB.getSettingByNamePath("envBusinessConfig.poolGovern.verifyUser") != 0;

    var newVO = function () {
        return {
            poolId: null,
            //dealId: null,
            maxDealDate: null,
            dealDemand: null,
            //accepterId: null,
            riskType: null,
            riskLevel: null,
            maxAcceptDate: null,
            //整改人name
            //userNames:[],
            //userNames:null,
            //验证人name
            //accepterName:null,
            compId:null,
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

    //数据模型
    var dataModel = {
        canUpdateVerifyUser : canUpdateVerifyUser,
        mainModel: {
            vo: newVO(),
            //当前的操作类型， create：创建， update ：更新， 影响'保存'按钮的事件处理
            opType: "",
            //用户选择类型 1-整改人 2-验证人
            selectUserType:1,
            //隐患类型
            riskType: _.map(LIB.getDataDicList("risk_type"),function(d){return {id: d.id, name: d.value};}),
            //优先级
            priorities: [{id: "0", name: "低"}, {id: "1", name: "中"}, {id: "2", name: "高"}],
            //整改候选人列表
            dealCandidates:[],
            dealsMap:{},
            //验证候选人列表
            accepterCandidates:[],
            acceptersMap:{}
        },
        //验证规则
        rules: {
            //"userNames.id": [
            //    {required: true, message: '请选择整改责任人'}
            //],
            dealCandidates: [
                {required: true, type:"array", min:1, message: '请选择整改责任人'}
            ],
            accepterCandidates: [
                {required: true, type:"array", min:1, message: '请选择验证责任人'}
            ],
            "vo.maxDealDate": [
                {required: true, message: '请选择整改期限'}
            ],
            //accepterId: [
            //    {required: true, message: '请选择验证责任人'}
            //],
            "vo.maxAcceptDate": [
                {required: true, message: '请输入验证期限'}
            ],
            "vo.riskType": [
                { required: true, message: '请输入隐患等级'}
            ],
            "vo.riskLevel": [
                {required: true, validator:function(rule, value, callback, source, options){
                    var errors = [];
                    if(_.isNull(value)){
                        errors.push("请选择风险等级");
                    }else{
                        var riskModel = JSON.parse(value);
                        if(_.isNull(_.propertyOf(riskModel)("id"))){
                            errors.push("请选择风险等级");
                        }
                    }
                  // test if email address already exists in a database
                  // and add a validation error to the errors array if it does
                  callback(errors);
                }}
            ],
            "vo.dealDemand": [
                {required: true, message: '请输入整改要求'},
                LIB.formRuleMgr.length(500,1)
                //{min: 1, max: 500, message: '长度在 1 到 500 个字符'}
            ]
        },
        riskModel: {
            id: null,
            opts: [],
            result: null
        },
        selectModal : {
            userSelectModal: {
                filterData: {
                    compId: null,
                }
            },
            userSelectModel : {
                visible : false
            },
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
        components: {
            'risk-model': riskModel,
            "userSelect":userSelect,
            "userSelectModal":userSelectModal,
            "multiSelectInput":multiSelectInput
        },
        data: function () {
            return dataModel;
        },
        watch: {
            "mainModel.vo.riskType":function(nVal,oVal){
                if(!_.isEmpty(this.mainModel.acceptersMap)){
                    var accepterCandidates = evalTrueUsers(this.mainModel.acceptersMap, nVal);
                    this.mainModel.accepterCandidates = mapUsers(accepterCandidates);
                }
            }
        },
        methods: {
            doSave: function () {
                var _this = this;
                this.mainModel.vo.riskLevel = JSON.stringify(this.riskModel);
                var vo = _.extend(_.pick(_this.mainModel.vo, "poolId", "maxDealDate", "dealDemand", "maxAcceptDate", "riskType", "riskLevel"),{
                    "deals":this.mainModel.dealCandidates,
                    "accepters":this.mainModel.accepterCandidates
                });
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        api.reform(null, vo).then(function (res) {
                            _this.$dispatch("ev_editFinshed");
                            LIB.Msg.info("指派成功");
                        });
                    }
                });
            },
            doSaveUser:function(selectedDatas){
                if (selectedDatas) {
                    if(1 == this.mainModel.selectUserType){//整改人
                        concatUsers(this.mainModel.dealCandidates, selectedDatas);
                    }else if(2 == this.mainModel.selectUserType){//验证人
                        concatUsers(this.mainModel.accepterCandidates, selectedDatas);
                    }
                }
            },
            doShowUserTableSelectModal:function(type){
                this.mainModel.selectUserType = type;
                this.selectModal.userSelectModel.visible = true;
                this.mainModel.vo.compId = LIB.user.compId;
                this.selectModal.userSelectModal.filterData ={compId : this.mainModel.vo.compId};
            },
            doSaveSelect:function(selectedDatas){
                var _this = this;
                var userIds;
                var userNames = [];
                _this.mainModel.selectedDatas=selectedDatas
                _.each(_this.mainModel.selectedDatas,function(data){
                    userIds=data.id;
                    userNames.push(data.username);
                });
                var param = {};
                param.userIds = userIds;
                param.userNames = userNames;
                _this.$dispatch("ev_selectUserFinished",param);
            }
        },
        events: {
            //edit框数据加载
            "ev_editReload": function (nVal) {
                //注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
                //清空数据
                var _this = this;
                _.extend(dataModel.mainModel.vo, newVO());
                dataModel.mainModel.acceptersMap = {};
                dataModel.mainModel.accepterCandidates = [];
                this.riskModel = {
                    id: null,
                    opts: [],
                    result: null
                };
                dataModel.mainModel.vo.poolId = nVal;
                //监听riskType时保证acceptersMap
                var callback = function(){
                    api.get({id: nVal}).then(function (res) {
                        if (res.data.riskLevel) {
                            _this.riskModel = JSON.parse(res.data.riskLevel);
                        }
                        if (res.data.riskType) {
                            _this.mainModel.vo.riskType = res.data.riskType;
                        }
                    });
                }
                api.reformUsers({id: nVal}).then(function(res){
                    //验证人 begin
                    var accepterCandidates = res.data.accepterCandidates;
                    if("1" == accepterCandidates.type){
                        _this.mainModel.accepterCandidates = mapUsers(accepterCandidates.userList);
                    }else{
                        _this.$set("mainModel.acceptersMap", accepterCandidates.userMap);
                    }
                    //验证人 end
                    //整改人 begin
                    var dealCandidates = res.data.dealCandidates;
                    if("1" == dealCandidates.type){
                        _this.mainModel.dealCandidates = mapUsers(dealCandidates.userList);
                    }else{
                        _this.$set("mainModel.dealsMap", dealCandidates.userMap);
                    }
                    //整改人 end
                    callback();
                });
            },
            "ev_selectUserFinished" : function(param){
                var _vo = dataModel.mainModel.vo;
                _vo.dealId = param.userIds;
                _vo.userNames = param.userNames.join(",");
            },
            //"ev_selectVerify" : function(param){
            //    var _vo = dataModel.mainModel.vo;
            //    _vo.poolId = param.userIds;
            //    _vo.accepterId = param.accepterId.join(",");
            //},
            "ev_selectElfrom" : function(param){
                var _this = this;
                var _vo = dataModel.mainModel.vo;
                _vo.accepterId = param.accepterId;
                _vo.accepterName = param.accepterName.join(",");
            },
        },
        ready: function () {
        }
    });

    return detail;
});