define(function (require) {
    //基础js
    var LIB = require('lib');
    //数据模型
    var api = require("../../vuex/api");
    var template = LIB.renderHTML(require("text!./poolTreatment.html"));
    var components = {
        "risk-model": require("views/basicSetting/basicFile/evaluationModel/dialog/riskModel"),
        "user-select-modal": require("componentsEx/selectTableModal/userSelectModal"),
        "multi-select-input": require("./multiSelectInput")
    };
    var formData = function () {
        return {
            //审批结果  1-无法整改 2-需要整改 3-无需整改 4-线下协调 5-驳回
            status: null,
            //审批意见
            approvalOpinion: null,
            //隐患等级
            riskType: null,
            //风险等级
            riskLevel: null,
            //整改要求
            dealDemand: null,
            //最大整改时间
            maxDealDate: null,
            //最大验证期限
            maxAcceptDate: null,
            //审批人
            auditUsers: [],
            //整改人
            dealCandidates: [],
            //验证人
            accepterCandidates: [],
            needVerify: '2', // 是否需要验证
            nestedOpCard: '1',
            causeAnalysis:null,
            //第二轮整改人
            secondDealCandidates:[],
            //第二轮整改期限
            maxSecondDealDate:null,
            rewardAmount:null,
            rewardNum:null
        }
    };
    var mapUsers = function (users) {
        return _.map(users, function (user) {
            return {id: user.id, name: user.name};
        });
    };
    //去重合并用户列表
    var concatUsers = function (target, source) {
        _.each(source, function (u1) {
            if (!_.some(target, function (u2) {
                    return u1.id === u2.id;
                })) {
                target.push(u1);
            }
        });
    };
    var evalTrueUsers = function (userMap, riskType) {
        var trueUsers = [];
        _.some(userMap, function (users, key) {
            var condition = key.replace(" or ", " || ").replace(" and ", " && ").replace(/\s*riskType([^a-zA-Z\d]*)/g, '"' + riskType + '"$1');
            if (eval(condition)) {
                trueUsers = users;
                return true;
            } else {
                return false;
            }
        });
        return trueUsers;
    };
    var userSelectModel = function () {
        return {
            visible: false,
            type: null,
            filterData: null,
            canUpdateVerifyUser: false,
            //审批人
            auditUsers: [],
            //整改人
            dealCandidates: [],
            //验证人
            accepterCandidates: [],
            //第二轮整改人
            secondDealCandidates:[],
        }
    };
    var riskModel = function () {
        return {
            id: null,
            opts: [],
            result: null
        }
    };
    var dataModel = function () {
        return {
            mainModel: {
                //能否指派
                canAssign: false,
                enableUpdateUsers: false,
                vo: new formData(),
                rules: null,
                selectModel: {
                    //审批结果
                    status: [],
                    //隐患类型
                    riskTypes: _.map(LIB.getDataDicList("risk_type"), function (d) {
                        return {id: d.id, name: d.value};
                    }),
                    //风险等级
                    riskModel: new riskModel(),
                    //用户列表
                    userSelected: new userSelectModel()
                }
            },
            needVerify: false,
            disableVerify: false,
            showOpCard: false,
            destinationId:null,
            isErpReform:false,//是否为erp工单整改
            isErpAssign:false,//是否为erp工单指派
            isRiskTypeRequiredWhenFirstAudit:false,//隐患审批时隐患等级是否必填
            isProcessRoleCrossComp: false,//处理人是否可以选择别的公司人员
            showRiskTypeWhenAudit:false,
            isFirstAudit:false,//是否为第一轮审批
        }
    };

    var opts = {
        template: template,
        components: components,
        mixins: [LIB.VueMixin.auth],
        props: {
            //表单类型  1-审批  2-指派
            formType: String,
            poolId: String
        },
        data: dataModel,
        computed: {
            //是否初始化指派内容
            canInitAssign: function () {
                return this.formType == 2 || (this.formType == 1 && this.mainModel.canAssign);
            },
            //是否显示指派信息
            showAssignModel: function () {
                return this.formType == 2 || (this.formType == 1 && this.mainModel.canAssign && this.destinationId && this.destinationId.includes("zhi_pai"));
            },
            canEditVerifyUser: function () {
                return this.hasAuth('editVerifyUser')
            },
            showCauseAnalysis:function () {
                var val = _.find(this.mainModel.selectModel.status,function (val) {
                    return val.value == '核实通过';
                });
                if (val) return true;
            }
        },
        watch: {
            poolId: function (nVal) {
                if (!_.isNull(nVal)) {
                    this.init();
                }
            },
            'mainModel.vo.status': function (newVal) {
                var settings = _.find(this.mainModel.selectModel.status, function (s) {
                    return newVal == s.id
                });
                if(!!settings) {
                    this.destinationId = settings.destinationId;
                }

                if (settings && settings.taskSettings && settings.taskSettings.enableUpdate) {
                    this.mainModel.enableUpdateUsers = true;
                    this.mainModel.selectModel.userSelected.auditUsers = mapUsers(settings.taskSettings.users);
                } else {
                    this.mainModel.enableUpdateUsers = false;
                }
                // ERP工单整改 bug:12815
                if (settings && settings.isErpReform === '1') {
                    this.isErpReform = true;
                    this._setERPFormRule();
                }else if ('11' == newVal || (this.destinationId && this.destinationId.includes("zhi_pai"))) {
                    this.initAssignFormRules();
                }
            },
            "mainModel.vo.riskType": function (nVal, oVal) {
                if (!_.isEmpty(this.mainModel.acceptersMap)) {
                    var accepterCandidates = evalTrueUsers(this.mainModel.acceptersMap, nVal);
                    this.mainModel.selectModel.userSelected.accepterCandidates = mapUsers(accepterCandidates);
                }
            }
        },
        methods: {
            showNoneTips: function () {
                LIB.Msg.info("正在加载数据，稍后重试");
            },
            _setERPFormRule: function () {
                var _this = this;
                var rules = {
                    status: [
                        {required: true, message: '请选择审批结果'}
                    ],
                    riskType: [LIB.formRuleMgr.require("隐患等级")],
                    "riskLevel": [
                        {
                            required: true, validator: function (rule, value, callback) {
                            var errors = [];
                            var riskModel = _this.mainModel.selectModel.riskModel;
                            if (_.isNull(riskModel) || _.isNull(_.propertyOf(riskModel)("id"))) {
                                errors.push("请选择风险等级");
                            }
                            callback(errors);
                        }
                        }
                    ],
                    erpDealCandidates: [
                        {
                            required: true, validator: function (rule, value, callback) {
                            if (_.isEmpty(_this.mainModel.selectModel.userSelected.dealCandidates)) {
                                callback('请选择ERP工单整改人');
                            } else {
                                callback();
                            }
                        }
                        }
                    ],
                    maxDealDate: [
                        {
                            required: true,
                            validator: function (rule, value, callback) {
                                if (_.isEmpty(_this.mainModel.vo.maxDealDate)) {
                                    callback('请输入ERP工单整改期限');
                                }else if(!_.isEmpty(_this.mainModel.vo.maxSecondDealDate) && _this.mainModel.vo.maxDealDate >= _this.mainModel.vo.maxSecondDealDate){
                                    callback('ERP工单整改期限必须小于站队整改期限');
                                }else if(!_.isEmpty(_this.mainModel.vo.maxAcceptDate) && _this.mainModel.vo.maxDealDate >= _this.mainModel.vo.maxAcceptDate){
                                    callback('ERP工单整改期限必须小于验证期限');
                                }else {
                                    callback();
                                }
                            }
                        }
                    ],
                    secondDealCandidates: [
                        {
                            required: true, validator: function (rule, value, callback) {
                            if (_.isEmpty(_this.mainModel.selectModel.userSelected.secondDealCandidates)) {
                                callback('请选择站队整改人');
                            } else {
                                callback();
                            }
                        }
                        }
                    ],
                    maxSecondDealDate: [{
                        required: true,
                        validator: function (rule, value, callback) {
                            if (_.isEmpty(_this.mainModel.vo.maxSecondDealDate)) {
                                callback('请输入站队整改期限');
                            }else if(!_.isEmpty(_this.mainModel.vo.maxDealDate) && _this.mainModel.vo.maxDealDate >= _this.mainModel.vo.maxSecondDealDate){
                                callback('站队整改期限必须大于ERP工单整改期限');
                            }else if(!_.isEmpty(_this.mainModel.vo.maxAcceptDate) && _this.mainModel.vo.maxSecondDealDate >= _this.mainModel.vo.maxAcceptDate){
                                callback('站队整改期限必须小于验证期限');
                            }else {
                                callback();
                            }
                        }
                    }],
                };
                if (!this.disableVerify) {
                    rules.maxAcceptDate = [
                        {
                            required: true,
                            validator: function (rule, value, callback) {
                                if (_.isEmpty(_this.mainModel.vo.maxAcceptDate)) {
                                    callback('请输入验证期限');
                                }else if(!_.isEmpty(_this.mainModel.vo.maxDealDate) && _this.mainModel.vo.maxDealDate >= _this.mainModel.vo.maxAcceptDate){
                                    callback('验证期限必须大于ERP工单整改期限');
                                }else if(!_.isEmpty(_this.mainModel.vo.maxSecondDealDate) && _this.mainModel.vo.maxSecondDealDate >= _this.mainModel.vo.maxAcceptDate){
                                    callback('验证期限必须大于站队整改期限');
                                }else {
                                    callback();
                                }
                            }
                        }
                    ];
                    rules.accepterCandidates = [
                        {
                            required: true, validator: function (rule, value, callback) {
                            if (_.isEmpty(_this.mainModel.selectModel.userSelected.accepterCandidates)) {
                                callback('请选择验证人');
                            } else {
                                callback();
                            }
                        }
                        }
                    ]
                }
                this.$set("mainModel.rules", rules);
            },
            /**
             * 初始化指派表单校验
             */
            initAssignFormRules: function () {
                if (this.showAssignModel) {
                    var _this = this;
                    var rules = {
                        "maxDealDate": [
                            {
                                required: true,
                                validator: function (rule, value, callback) {
                                    if (_.isEmpty(_this.mainModel.vo.maxDealDate)) {
                                        callback('请输入整改期限');
                                    }else if(!_.isEmpty(_this.mainModel.vo.maxAcceptDate) && _this.mainModel.vo.maxDealDate >= _this.mainModel.vo.maxAcceptDate){
                                        callback('整改期限必须小于验证期限');
                                    }else {
                                        callback();
                                    }
                                }
                            }
                        ],

                        "rewardAmount": [
                            {
                                validator: function (rule, value, callback) {
                                    if((value == '' || value ==null || value == undefined) ) return callback();
                                    if(value.toString().length>11){
                                        return callback("最多输入11个字符");
                                    }
                                    var value1 = _this.mainModel.vo.rewardNum;
                                    // if((value == '' || value ==null || value == undefined) && (value1 == '' || value1 ==null || value1 == undefined)) return callback();
                                    // if((value == '' || value ==null || value == undefined) && (value1 != '' && value1 !=null && value1 != undefined)) return callback('奖励金额');

                                    if((!isNaN(value)) && value%1 === 0){
                                        return callback();
                                    }
                                    return callback("请输入整数");
                                }
                            }
                        ],
                        "rewardNum": [
                            {
                                validator: function (rule, value, callback) {
                                    if((value == '' || value ==null || value == undefined) ) return callback();
                                    if(value.toString().length>11){
                                        return callback("最多输入11个字符");
                                    }
                                    var value1 = _this.mainModel.vo.rewardAmount;
                                    // if((value == '' || value ==null || value == undefined) && (value1 == '' || value1 ==null || value1 == undefined)) return callback();
                                    // if((value == '' || value ==null || value == undefined) && (value1 != '' && value1 !=null && value1 != undefined)) return callback('奖励人次');

                                    if((!isNaN(value)) && value%1 === 0){
                                        return callback();
                                    }
                                    return callback("请输入整数");
                                }
                            }
                        ],

                        "riskType": [
                            {required: true, message: '请输入隐患等级'}
                        ],
                        "dealDemand": [
                            {required: true, message: '请输入整改要求'},
                            LIB.formRuleMgr.length(500, 1)
                        ],
                        "riskLevel": [
                            {
                                required: true, validator: function (rule, value, callback) {
                                var errors = [];
                                var riskModel = _this.mainModel.selectModel.riskModel;
                                if (_.isNull(riskModel) || _.isNull(_.propertyOf(riskModel)("id"))) {
                                    errors.push("请选择风险等级");
                                }
                                callback(errors);
                            }
                            }
                        ],
                        dealCandidates: [
                            {
                                required: true, validator: function (rule, value, callback) {
                                if (_.isEmpty(_this.mainModel.selectModel.userSelected.dealCandidates)) {
                                    callback('请选择整改责任人');
                                } else {
                                    callback();
                                }
                            }
                            }
                        ]
                    };

                    if (!this.disableVerify) {
                        rules.maxAcceptDate = [
                            {
                                required: true,
                                validator: function (rule, value, callback) {
                                    if (_.isEmpty(_this.mainModel.vo.maxAcceptDate)) {
                                        callback('请输入验证期限');
                                    }else if(!_.isEmpty(_this.mainModel.vo.maxDealDate) && _this.mainModel.vo.maxDealDate >= _this.mainModel.vo.maxAcceptDate){
                                        callback('验证期限必须大于整改期限');
                                    }else {
                                        callback();
                                    }
                                }
                            }
                        ];
                        rules.accepterCandidates = [
                            {
                                required: true, validator: function (rule, value, callback) {
                                if (_.isEmpty(_this.mainModel.selectModel.userSelected.accepterCandidates)) {
                                    callback('请选择验证责任人');
                                } else {
                                    callback();
                                }
                            }
                            }
                        ]
                    }

                    this.$set("mainModel.rules", rules);
                }
            },
            /**
             * 初始化表单校验
             */
            initFormRules: function () {
                var _this = this;
                if (this.formType == 1) {//初始化审批表单校验
                    var rules = _.deepExtend({}, this.mainModel.rules, {
                        status: [
                            {required: true, message: '请选择审批结果'}
                        ],
                        "riskType2": [
                            {
                                required: true,
                                validator: function (rule, value, callback) {
                                    if (_this.isRiskTypeRequiredWhenFirstAudit && !_this.mainModel.vo.riskType) {
                                        callback("请选择隐患等级");
                                    }else{
                                        callback();
                                    }
                                }
                            }
                        ],
                        users: [
                            {
                                required: true, validator: function (rule, value, callback) {
                                if (_this.mainModel.enableUpdateUsers
                                    && _.isEmpty(_this.mainModel.selectModel.userSelected.auditUsers)) {
                                    callback("下一环节审批人不能为空");
                                } else {
                                    callback();
                                }
                            }
                            }
                        ],
                        remark: [
                            {required: true, message: '请输入审批意见'},
                            LIB.formRuleMgr.length(500, 1)
                        ]
                    });
                    this.$set("mainModel.rules", rules);
                } else if (this.formType == 2) {//初始化指派表单校验
                    this.initAssignFormRules();
                    this.doCheckIsErpAssign();
                }

            },
            doCheckIsErpAssign: function() {
                var _this = this;
                api.queryIsErpAssign({id:this.poolId}).then(function(res){
                    if(res.data) {
                        _this.isErpAssign = res.data;
                    }
                });
            },
            /**
             * 初始化表单数据
             */
            initData: function () {
                var _this = this;
                var poolId = this.poolId;
                this.mainModel.vo = new formData();
                this.mainModel.rules = {};
                this.mainModel.canAssign  = false;
                this.destinationId = null;
                this.mainModel.selectModel.riskModel = new riskModel();
                this.mainModel.selectModel.status = [];
                this.mainModel.selectModel.userSelected = new userSelectModel();
                this.showRiskTypeWhenAudit = false;
                this.isErpReform = false,//是否为erp工单整改
                this.isErpAssign = false,//是否为erp工单指派
                this.getPoolGovernConfig();

                api.get({id: this.poolId}).then(function (res) {
                    if (res.data.riskType){
                        _this.mainModel.vo.riskType = res.data.riskType;
                    }else{
                        _this.showRiskTypeWhenAudit = true;
                    }
                    if (res.data.riskLevel) {
                        _this.mainModel.selectModel.riskModel = JSON.parse(res.data.riskLevel);
                    }
                    if(res.data.causeAnalysis) {
                        _this.mainModel.vo.causeAnalysis = res.data.causeAnalysis;
                    }
                    _this.mainModel.vo.rewardAmount = res.data.rewardAmount;
                    _this.mainModel.vo.rewardNum = res.data.rewardNum;
                });

                if (this.formType == 1) {//初始化审批信息
                    api.approvalStatus({"id": poolId}).then(function (res) {
                        var data = res.data;
                        _this.mainModel.selectModel.status = data.approvalStatus;
                        _this.mainModel.canAssign = data.canAssign;
                        _this.isFirstAudit = data.isFirstAudit;
                        _this.initAssign();
                        _this.initDeadlineDays();
                    });
                } else {
                    this.initAssign();
                    this.initDeadlineDays();
                }
            },
            initDeadlineDays: function(){
                var _this = this;
                if(this.mainModel.selectModel.status.length > 0) {
                    _.each(this.mainModel.selectModel.status, function(item){
                        if(item.destinationId && item.destinationId.includes("zhi_pai")) {//有指派节点才请求整改期限
                            api.deadlineDate({id: _this.poolId}).then(function(res){
                                _this.mainModel.vo.maxDealDate = res.data.maxDeadlineDate4Deal;
                                _this.mainModel.vo.maxAcceptDate = res.data.maxDeadlineDate4Accept;
                                _this.mainModel.vo.maxSecondDealDate = res.data.maxDeadlineDate4SecondDeal;
                            });
                            return;
                        }
                    });
                }

            },
            initAssign: function(){
                var _this = this;
                if (this.canInitAssign) {//初始化指派信息
                    api.reformUsers({id: this.poolId}).then(function (res) {
                        //验证人 begin
                        var accepterCandidates = res.data.accepterCandidates;
                        if ("1" == accepterCandidates.type) {
                            _this.mainModel.selectModel.userSelected.accepterCandidates = mapUsers(accepterCandidates.userList);
                        } else {
                            _this.$set("mainModel.acceptersMap", accepterCandidates.userMap);
                        }
                        //验证人 end
                        //整改人 begin
                        var dealCandidates = res.data.dealCandidates;
                        if ("1" == dealCandidates.type) {
                            _this.mainModel.selectModel.userSelected.dealCandidates = mapUsers(dealCandidates.userList);
                        } else {
                            _this.$set("mainModel.dealsMap", dealCandidates.userMap);
                        }
                        //整改人 end

                        //获取erp工单整改处理人
                        api.erpDefaultCandidates({id: _this.poolId}).then(function (res) {
                            if(res.data) {
                                if(res.data.secondDeals && res.data.secondDeals.length > 0) {//第二轮整改人
                                    _this.mainModel.selectModel.userSelected.secondDealCandidates = mapUsers(res.data.secondDeals);
                                }
                                if(res.data.accepters && res.data.accepters.length > 0) {// 验证人
                                    _this.mainModel.selectModel.userSelected.accepterCandidates = mapUsers(res.data.accepters);
                                }
                            }
                        });
                    });
                }
            },
            doSelectMaxSecondDealDate: function() {
              if(!this.mainModel.vo.maxDealDate) {
                  LIB.Msg.warning("请先选择ERP工单整改期限");
              }
            },
            /**
             * 初始化，当poolId更改时执行
             */
            init: function () {
                this.$refs.ruleform.resetFields();
                this.initData();
                this.initFormRules();
                this.disableVerify = false;
            },
            //弹框选择人员
            doSelectUsers: function (type) {
                if (type === 3 && !this.canEditVerifyUser) {
                    return;
                }
                var userSelected = this.mainModel.selectModel.userSelected;
                userSelected.type = type;
                userSelected.visible = true;
                if(this.isProcessRoleCrossComp) {
                    userSelected.filterData = {};
                }else{
                    userSelected.filterData = {compId: LIB.user.compId};
                }
            },
            //保存弹框选择的人员信息
            doSaveUser: function (selectedData) {
                if (selectedData) {
                    var userSelected = this.mainModel.selectModel.userSelected;
                    if (1 == userSelected.type) {//审核人
                        concatUsers(userSelected.auditUsers, selectedData);
                    } else if (2 == userSelected.type) {//整改人
                        concatUsers(userSelected.dealCandidates, selectedData);
                    } else if (3 == userSelected.type) {//验证人
                        concatUsers(userSelected.accepterCandidates, selectedData);
                    } else if (4 == userSelected.type) {//整改人
                        concatUsers(userSelected.secondDealCandidates, selectedData);
                    }
                }
            },
            getFormData: function () {
                var formData = _.deepExtend({poolId: this.poolId}, this.mainModel.vo);
                if (this.mainModel.enableUpdateUsers) {//审批人列表
                    formData.auditUsers = this.mainModel.selectModel.userSelected.auditUsers;
                }
                if (this.showAssignModel) {//指派相关信息
                    //风险等级
                    formData.riskLevel = JSON.stringify(this.mainModel.selectModel.riskModel);
                    //整改人
                    formData.dealCandidates = this.mainModel.selectModel.userSelected.dealCandidates;
                    //验证人
                    formData.accepterCandidates = this.mainModel.selectModel.userSelected.accepterCandidates;
                    //第二轮整改
                    formData.secondDealCandidates = this.mainModel.selectModel.userSelected.secondDealCandidates;
                }
                if(formData.status && formData.status.includes("${")) {
                    formData.condition = formData.status;
                    formData.status = null;

                }

                return formData;
            },
            doSave: function () {
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        var formData = _this.getFormData();
                        api.processReform(formData).then(function (res) {
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
            },
            getPoolGovernConfig: function(){
                var _this = this;
                api.getPoolGovernConfig().then(function (res) {
                    var canUpdateVerifyUser = false,
                        needVerify = false,
                        showOpCard = false;
                    _.forEach(res.data.children, function (item) {
                        if (item.name === 'verifyUser') {
                            canUpdateVerifyUser = item.result === '2';
                        } else if (item.name === 'isVerify') {
                            needVerify = item.result === '2';
                            // _this.mainModel.vo.needVerify = item.result;
                        } else if(item.name === 'nestedOpCard') {
                            showOpCard = (item.result === '2');
                        } else if(item.name === 'isRiskTypeRequiredWhenFirstAudit') {
                            _this.isRiskTypeRequiredWhenFirstAudit = (item.result === '2');
                        } else if (item.name === 'isProcessRoleCrossComp') {
                            _this.isProcessRoleCrossComp = (item.result === '2');
                        }
                    });
                    _this.mainModel.selectModel.userSelected.canUpdateVerifyUser = canUpdateVerifyUser;
                    _this.needVerify = needVerify;
                    _this.showOpCard = showOpCard;
                })
            },
            changeVerify: function () {
                this.mainModel.vo.needVerify = this.mainModel.vo.needVerify === '1' ? '2' : '1';
                if (this.mainModel.vo.needVerify === '1') {
                    this.disableVerify = true
                } else {
                    this.disableVerify = false
                }
                this.initAssignFormRules();
            },
            changeOpCard: function () {
                this.mainModel.vo.nestedOpCard = this.mainModel.vo.nestedOpCard === '1' ? '2' : '1';
            }
        },
        init: function () {
            this.$api = api;
            this.__auth__ = this.$api.__auth__;
        }
    };

    return opts;
});