define(function (require) {
    //基础js
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var template = LIB.renderHTML(require("text!./multipleResult.html"));

    var userSelectModal = require("componentsEx/selectTableModal/trainUserSelectModal");
    var importProgress = require("componentsEx/importProgress/main");

    var newVO = function () {
        return {
            trainDate:null,
            passUsers: [], // 通过人员
            users: null // 未通过人员
        }
    };

    var dataModel = function () {
        return {
            mainModel: {
                title: '批量上报培训结果',
                vo: newVO(),
                rules: {
                    "trainDate": [
                        LIB.formRuleMgr.require("通过时间")
                    ],
                    "users": [
                        {   required:true,
                            validator: function (rule, value, callback) {
                                if(value.length > 0) {
                                    return callback();
                                }else {
                                    return callback(new Error('请选择通过员工'))
                                }
                            }
                        }
                    ],
                }
            },
            selectModel : {
                userSelectModel : {
                    visible : false,
                    filterData : {orgId : null}
                }
            },
            passChecked: false,
            otherChecked: false,
            taskLength: 0,
            importProgress: {
                show: false,
                uploadUrl: '/trainplan/{id}/importResult',
                downloadUrl: '/trainplan/resultFile/down'
            }
        }
    };

    var opts = {
        template: template,
        components: {
            "userSelectModal": userSelectModal,
            "importprogress": importProgress,
        },
        props: {
            id: {
                type: String
            },
            visible: {
                type: Boolean,
                default: false
            }
        },
        data: dataModel,
        computed: {
            unCheckedLength: function () {
                return Number(this.taskLength) - this.mainModel.vo.passUsers.length;
            }
        },
        watch: {
            "visible": function (val) {
                if(val) {
                    this._init();
                }
            }
        },
        methods: {
            doImport: function () {
                this.importProgress.show = true;
            },
            _init: function () {
                this.$broadcast("ev_update_url", '/trainplan/' + this.id + '/importResult');
                this.mainModel.vo = newVO();
                this.passChecked = false;
                this.otherChecked = false;
                this.taskLength = 0;
                this._getTasks();
            },
            _getTasks: function () {
                var _this = this;
                var param = {
                    pageNo: 1,
                    pageSize: 9999,
                    // "criteria.intsValue": '{"status":[0]}',
                    id: this.id
                };
                api.queryTrainTasks(param).then(function (res) {
                    var taskList = _.map(res.data.list, function (item) {
                        return {
                            id: item.id,
                            userId: item.userId,
                            name: item.user.name
                        }
                    });

                    _this.taskList = taskList;
                    _this.taskLength = res.data.total;
                })
            },
            changePassCheck: function () {
                this.otherChecked = false;
                this.mainModel.vo.users = [];
                this.mainModel.vo.passUsers = _.map(this.taskList, function (item) {
                    return {
                        id: item.id,
                        userId: item.userId,
                        name: item.name,
                        status: '2'
                    }
                })
            },
            _setRestToUsers: function () {
                var passIds = _.pluck(this.mainModel.vo.passUsers, "id");
                var restUsers = _.filter(this.taskList, function (item) {
                    return !_.includes(passIds, item.id)
                });
                this.mainModel.vo.users = _.map(restUsers, function (item) {
                    return {
                        id: item.id,
                        userId: item.userId,
                        name: item.name,
                        status: '1'
                    }
                })
            },
            changeOtherCheck: function () {
                if (this.otherChecked) {
                    this._setRestToUsers();
                }
            },
            doShowUserSelectModal : function(status) {
                this.status = status;
                var excludedUserId;
                if (status === '2') {
                    excludedUserId = _.pluck(this.mainModel.vo.users, "id");
                } else if (status === '1') {
                    excludedUserId = _.pluck(this.mainModel.vo.passUsers, "id");
                }
                this.selectModel.userSelectModel.visible = true;
                this.selectModel.userSelectModel.filterData = {
                    id : this.id,
                    "criteria.strsValue.excludedUserId": excludedUserId
                };
            },
            doSaveUsers: function (selectedDatas) {
                var status = this.status;
                var users = _.map(selectedDatas, function (item) {
                    return {
                        id: item.id,
                        userId: item.user.id,
                        name: item.user.name,
                        status: status
                    }
                });

                if (status === '2') {
                    this.mainModel.vo.passUsers = this.mainModel.vo.passUsers.concat(users);
                } else if (status === '1') {
                    this.mainModel.vo.users = this.mainModel.vo.users.concat(users);
                }
            },

            doSave : function() {
                var _this = this;
                var trainDate = this.mainModel.vo.trainDate;
                var passUsers = _.map(this.mainModel.vo.passUsers, function (item) {
                    return {
                        id: item.id,
                        status: item.status,
                        user: {id: item.userId},
                        trainDate: trainDate
                    }
                });
                var users = _.map(this.mainModel.vo.users, function (item) {
                    return {
                        id: item.id,
                        status: item.status,
                        user: {id: item.userId},
                        trainDate: trainDate
                    }
                });
                var param = passUsers.concat(users);

                if (_.isEmpty(param)) {
                    return LIB.Msg.error("请选择人员");
                }

                this.$refs.ruleform.validate(function(valid) {
                    if (valid) {
                        api.updateTrainTasks({id : _this.id}, param).then(function() {
                            _this.$emit("pass-batch");
                        });
                    }
                });
            },
            doUploadSuccess: function () {
                this.$emit("pass-batch");
            }
        },
        events: {
            "ev_upload_success": function () {
                this.importProgress.show = false;
                this.$emit("pass-batch");
            }
        }
    };

    return opts;
});