define(function (require) {
    //基础js
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var template = LIB.renderHTML(require("text!./remindFormModal.html"));
    var baseUserSelectModal = require('componentsEx/selectTableModal/baseUserSelectModal');

    var newVO = function() {
        return {
            id : null,
            //唯一标识
            code : null,
            //提醒类别 1:复培提醒,2:人员证书到期提醒,3:企业证书到期提醒
            remindType : '3',
            //web站内通知是否启用 0:否,1:是
            webMessage : '0',
            //禁用标识 0未禁用，1已禁用
            disable : "0",
            //是否重复提醒 0:否,1:是
            isLoop : '0',
            //手机短信是否启用 0:否,1:是
            smsNotice : '0',
            //提醒时间类型 1:提前第×天/月,2:提前×天/月每×天/月,3:过期后第×天/月,4:过期后每×天/月
            timeType : '1',
            //是否通知管理员 0:不通知,1:通知
            toAdmin : '0',
            //app通知是否启用 0:否,1:是
            appNotice : '0',
            //是否通知讲师 0:不通知,1:通知
            toTeacher : '0',
            //周期
            cycle : null,
            //周期时间单位 1:天,2:月
            cycleUnit : '1',
            //提前/过期时间
            time : null,
            //提前/过期时间单位 1:天,2:月
            unit : '1',
        }
    };

    var dataModel = {
        title: "设置提醒规则",
        mainModel: {
            vo: newVO(),
            //验证规则
            rules: {
                "appNotice": [
                    {
                        validator: function (rule, value, callback) {
                            var vo = dataModel.mainModel.vo;
                            if (vo.smsNotice !== '1' && vo.appNotice !== '1') {
                                return callback(new Error('请选择通知方式'));
                            } else {
                                return callback();
                            }
                        }
                    }
                ],
                "time": [
                    {required: true, message: '请填写通知频率'},
                    {
                        validator: function (rule, value, callback) {
                            var vo = dataModel.mainModel.vo;
                            if (vo.timeType === '2' && !vo.cycle) {
                                return callback(new Error('请输入周期通知频率'));
                            } else {
                                return callback();
                            }
                        }
                    }
                ],
            }
        },
        timeTypes: [
            {
                id: '1',
                value: '提前，第'
            },
            {
                id: '2',
                value: '提前'
            },
            {
                id: '3',
                value: '过期后，第'
            },
            {
                id: '4',
                value: '过期后，每'
            }
        ],
        units: [
            {
                id: '1',
                value: '天'
            },
            {
                id: '2',
                value: '月'
            }
        ],
        adminLength: 0,
        adminSelectModel: {
            visible: false
        },
        users: [],
        allAdminNotice: false
    };

    var component = LIB.Vue.extend({
        template: template,
        components: {
            "baseUserSelectModal": baseUserSelectModal
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
        data: function () {
            return dataModel;
        },
        watch: {
            visible: function (nVal) {
                if (nVal) {
                    this.init();
                }
            }
        },
        computed: {
        },
        methods: {

            _getAdmins: function () {
                var _this = this;
                api.getAdmins().then(function (res) {
                    _this.adminLength = _.get(res.data, "total", 0);
                    _this.allAdministrators = _.map(res.data.list, function (item) {
                        return {
                            id: item.userId,
                            name: item.user.name
                        }
                    })
                })
            },
            init: function () {
                this.mainModel.vo = newVO();
                this.users = [];
                this.allAdminNotice = false;

                this._getAdmins();
            },

            changeAllAdminNotice: function () {
                this.users = _.cloneDeep(this.allAdministrators);
            },
            doShowUserSelectModal: function () {
                this.adminSelectModel.visible = true;
            },
            doSaveUsers: function (rows) {
                this.users = _.map(rows, function (row) {
                    return {
                        id: row.userId,
                        name: row.user.name
                    }
                })
            },
            doRemoveUser: function () {
                this.allAdminNotice = false;
            },

            doSave: function () {
                var param = _.cloneDeep(this.mainModel.vo);

                param.users = this.users;
                if (param.timeType === '4') {
                    param.cycle = param.time;
                    param.cycleUnit = param.unit;
                }
                if (_.isArray(param.users) && !_.isEmpty(param.users)) {
                    param.toAdmin = '1';
                } else {
                    param.admin = '0';
                }
                var _this = this;
                this.$refs.ruleform.validate(function(valid) {
                    if (valid) {
                        api.createRemindset(param).then(function (res) {
                            LIB.Msg.success("保存成功");
                            _this.$emit("do-save")
                        })
                    }
                })
            },
            changeSms: function (checked) {
                this.mainModel.vo.smsNotice = checked ? '1' : '0';
            },
            changeApp: function (checked) {
                this.mainModel.vo.appNotice = checked ? '1' : '0';
            },
            changeTeacher: function (checked) {
                this.mainModel.vo.toTeacher = checked ? '1' : '0';
            }

        }
    });

    return component;
});