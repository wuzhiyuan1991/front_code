define(function (require) {
    //基础js
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var template = LIB.renderHTML(require("text!./delegateBatch.html"));

    var components = {
        "user-select-modal": require("componentsEx/selectTableModal/userSelectModal"),
        "task-select-modal": require("./taskSelectModal")
    };

    var ways = [
        {
            id: '1',
            value: '选择单条/多条任务'
        },
        {
            id: '2',
            value: '选择时间范围内的任务'
        }
    ];
    var opType = {
        "delegate":"委托",
        "assign":"分派"
    }
    var newVO = function () {
        return {
            //委托原因
            reason: null,
            way: '1',
            tasks: [],
            //被委托人
            assignee: null,
            startDate: null,
            endDate: null
        }
    };

    var dataModel = function () {
        return {
            mainModel: {
                title: '批量委托',
                vo: newVO(),
                rules: {
                    "assignee.id": [
                        LIB.formRuleMgr.require("被委托人")
                    ],
                    "reason": [
                        LIB.formRuleMgr.require("委托原因"),
                        LIB.formRuleMgr.length(500)
                    ],
                    // "startDate": [
                    //     LIB.formRuleMgr.require("开始时间")
                    // ],
                    // "endDate": [
                    //     LIB.formRuleMgr.require("结束时间")
                    // ]
                }
            },
            userSelected: {
                visible: false,
                type: null,
                filterData: null,
                assignees: []
            },
            taskSelected: {
                visible: false,
                filterData: {}
            },
            ways: ways
        }
    };

    var opts = {
        template: template,
        components: components,
        props: {
            id: {
                type: String
            },
            visible: {
                type: Boolean,
                default: false
            },
            type: {
                type: String
            }
        },
        data: dataModel,
        watch: {
            "visible": function (val) {
                if(val) {
                    this._init();
                }
            },
            "mainModel.vo.startDate": function (val) {
                if(val && this.mainModel.vo.endDate) {
                    this._getTasksByDateRange();
                }
            },
            "mainModel.vo.endDate": function (val) {
                if(val && this.mainModel.vo.startDate) {
                    this._getTasksByDateRange();
                }
            }
        },
        computed: {
            'taskNum': function () {
                return this.mainModel.vo.tasks.length || 0;
            },
            assigneeLabel: function(){
                var opName = opType[this.type] ? opType[this.type] : "委托";
                return "被" + opName + "人";
            },
            reasonLabel: function(){
                var opName = opType[this.type] ? opType[this.type] : "委托";
                return opName + "原因";
            }
        },
        methods: {
            _init: function () {
                this.mainModel.vo = newVO();
                var opName = opType[this.type] ? opType[this.type] : "委托";
                this.mainModel.title = "批量" + opName;
                LIB.Vue.set(this.mainModel.rules, "assignee.id", [{required: true, message: "请选择被"+opName+"人"}]);
                LIB.Vue.set(this.mainModel.rules, "reason", [
                    LIB.formRuleMgr.require(opName + "原因"),
                    LIB.formRuleMgr.length(500)
                ]);
            },
            //弹框选择人员
            doSelectUsers: function () {
                this.userSelected.filterData = {compId: LIB.user.compId, "criteria.strsValue": JSON.stringify({excludeIds: [LIB.user.id]})};

                this.userSelected.visible = true;
            },
            //保存弹框选择的人员信息
            doSaveUser: function (selectedData) {
                if(_.isArray(selectedData) && selectedData.length > 0) {
                    this.mainModel.vo.assignee = selectedData[0];
                }
            },
            getFormData: function () {
                var reason = this.mainModel.vo.reason;
                var assignee = _.pick(this.mainModel.vo.assignee, 'id', 'name');
                var opType = this.type;
                var checkerIds = "";
                var tasks = _.map(this.mainModel.vo.tasks, function (item) {
                    checkerIds += item.checkerIds + ",";
                    return {
                        assignee: assignee,
                        reason: reason,
                        checkTaskGroupId: item.id,
                        opType:opType,

                    }
                })
                this.taskCheckerIds = checkerIds;
                return tasks;
            },
            doSave: function () {
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        var formData = _this.getFormData();
                        if(!_.isArray(formData) || formData.length === 0) {
                            LIB.Msg.error("任务条数不能为0");
                            return;
                        }
                        if(_this.type === 'delegate' && _this.taskCheckerIds.indexOf(_this.mainModel.vo.assignee.id) > -1) {
                            LIB.Msg.error("委托任务的执行人已经包括被委托人");
                            return;
                        }
                        api.createDelegateRecords(formData).then(function (res) {
                            if (res.data && res.error != '0') {
                                LIB.Msg.warning("操作失败");
                            } else {
                                _this.$dispatch("ev_single_delegate");
                                LIB.Msg.info("操作成功");
                                _this.visible = false;
                            }
                        });
                    }
                });
            },
            doSelectTasks: function () {
                var bizType = this.$route.query.bizType;
                if(bizType){
                    this.taskSelected.filterData.bizType = bizType;
                } else {
                    this.taskSelected.filterData.bizType = "default";
                }
                this.taskSelected.filterData["criteria.intValue.containFutureTask"] = 1;
                if(this.type === 'delegate'){
                    this.taskSelected.filterData.checkerId = LIB.user.id;
                }else if(this.type === 'assign'){
                    this.taskSelected.filterData.checkerId = "";
                }
                // this.taskSelected.filterData = {checkerId: LIB.user.id};
                this.taskSelected.visible = true;
            },
            doSaveTasks: function (selectedData) {
                this.mainModel.vo.tasks = _.map(selectedData, function (item) {
                    return {
                        id: item.id,
                        name: item.groupName + "#" + item.num,
                        checkerIds: item.checkerIds
                    }
                })
            },
            _getTasksByDateRange: function () {
                this.mainModel.vo.tasks = [];
                var _this = this;
                var start = this.mainModel.vo.startDate;
                var end = this.mainModel.vo.endDate;
                var params = {
                    curPage: 1,
                    // pageSize:10,
                    pageSize: 1000,
                    // checkerId:LIB.user.id,
                    'criteria.intsValue': JSON.stringify({status:[0,1,4]}),
                    'criteria.dateValue': JSON.stringify({startStartDate: start, endEndDate: end, })
                };
                var bizType = this.$route.query.bizType;
                if(bizType){
                    params.bizType = bizType;
                } else {
                    params.bizType = "default";
                }
                if(this.type === 'delegate'){
                    params.checkerId = LIB.user.id;
                }
if(!start || !end) return;
                api.list(params).then(function (res) {
                    _this.mainModel.vo.tasks = res.data.list;
                })
            },
            onWayChanged: function () {
                this.mainModel.vo.tasks = [];
                this.mainModel.vo.startDate = null;
                this.mainModel.vo.endDate = null;
            }
        }
    };

    return opts;
});