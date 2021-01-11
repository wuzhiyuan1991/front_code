define(function(require) {
    var LIB = require('lib');
    var api = require("../vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./remind.html");

    var remindFormModal = require("./remindFormModal");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");

    var timeTypes = {
        '1': '提前，第',
        '2': '提前',
        '3': '过期后，第',
        '4': '过期后，每'
    };


    var units = {
        '1': '天',
        '2': '月'
    };

    var newVO = function() {

    };
    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "自动提醒设置"
        },
        tableModel: {
            adminModel: {
                url: 'bizuserrel/list/{curPage}/{pageSize}?type=2',
                columns:  [
                    {
                        title: "人员名称",
                        fieldName: "user.name"
                    },
                    _.extend({}, LIB.tableMgr.column.company, {filterType: null}),
                    _.extend({}, LIB.tableMgr.column.dept, {filterType: null}),
                    {
                        title : "",
                        fieldType : "tool",
                        toolType : "del"
                    }
                ]
            },
            remindModel: {
                url: 'remindset/list/{curPage}/{pageSize}?remindType=2',
                columns: [
                    {
                        title: "提醒周期",
                        render: function (data) {
                            var str = '';
                            str += timeTypes[data.timeType];
                            if(data.timeType !== '4') {
                                str += data.time;
                                str += units[data.unit];
                            }
                            if (data.timeType === '2') {
                                str += '，每';
                                str += data.cycle;
                                str += units[data.cycleUnit];
                            }
                            if (data.timeType === '4') {
                                str += data.cycle;
                                str += units[data.cycleUnit];
                            }
                            return str;
                        }
                    },
                    {
                        title: "提醒人",
                        render: function (data) {
                            var arr = [];
                            if (data.toTeacher === '1') {
                                arr.push('课程教师');
                            }
                            if (data.toAdmin === '1') {
                                arr.push('证书管理员');
                            }
                            return arr.join('、');
                        }
                    },
                    {
                        title: "提醒方式",
                        render: function (data) {
                            var arr = [];
                            if (data.smsNotice === '1') {
                                arr.push('手机短信');
                            }
                            if (data.appNotice === '1') {
                                arr.push('App通知');
                            }
                            return arr.join('、');
                        }
                    },
                    {
                        title : "",
                        fieldType : "tool",
                        toolType : "del"
                    }
                ]
            }
        },
        remindFormModel: {
            visible: false
        },
        userSelectModel: {
            visible: false
        },
        autoSendNotice: false
    };
    //Vue组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *	el
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
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        template: tpl,
        components: {
            remindFormModal: remindFormModal,
            "userSelectModal": userSelectModal
        },
        data: function() {
            return dataModel;
        },
        methods: {
            newVO: newVO,
            doClose: function() {
                this.$dispatch("ev_dtClose2");
            },
            appendRule: function () {
                this.remindFormModel.visible = true;
            },
            doSaveRemind: function () {
                this.remindFormModel.visible = false;
                this.$refs.remindTable.doRefresh();
            },
            doRemoveRemind: function (data) {
                var _this = this;
                var id = data.entry.data.id;
                LIB.Modal.confirm({
                    title: '确定删除数据吗？',
                    onOk: function() {
                        api.deleteRemind(null, {id: id}).then(function () {
                            LIB.Msg.success("删除成功");
                            _this.$refs.remindTable.doRefresh();
                        })
                    }
                });
            },

            appendAdmin: function () {
                this.userSelectModel.visible = true;
            },
            doSaveAdmins: function (rows) {
                var _this = this;
                var params = _.map(rows, function (row) {
                    return {
                        userId: row.id,
                        orgId: row.orgId,
                        compId: row.compId,
                        type: '2' // 1 课程管理员 2 证书管理员
                    }
                });

                api.addAdmin(params).then(function (res) {
                    _this.$refs.adminTable.doRefresh();
                })
            },
            doRemoveAdmin: function (data) {
                var _this = this;
                var id = data.entry.data.id;
                LIB.Modal.confirm({
                    title: '确定删除数据吗？',
                    onOk: function() {
                        api.deleteAdmin(null, {id: id}).then(function () {
                            LIB.Msg.success("删除成功");
                            _this.$refs.adminTable.doRefresh();
                        })
                    }
                });
            },
            changeAutoSend: function (checked) {
                var val = checked ? '1' : '0';
                this.lookup.value = val;
                api.updateLookupItem({id: this.lookup.lookupId}, this.lookup).then(function (res) {
                    LIB.Msg.success("修改成功");
                })
            },
            _init: function () {
                this.$refs.adminTable.doCleanRefresh();
                this.$refs.remindTable.doCleanRefresh();

                var _this = this;
                api.querySendNotice().then(function (res) {
                    _this.lookup = _.find(_.get(res.data, "[0].lookupItems"), "name", "itm_user_cert_expire");
                    _this.autoSendNotice = (_.get(_this.lookup, "value") === '1');
                })
            },

        },
        events: {
            "ev_dtReload2": function () {
                this._init();
            }
        },
        init: function () {
            this.$api = api;
        }
    });

    return detail;
});
