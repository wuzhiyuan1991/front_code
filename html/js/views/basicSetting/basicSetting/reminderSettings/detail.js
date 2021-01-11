define(function(require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail.html");

    //选择角色组件
    var roleComponent = require("./roleComponent");
    //弹窗选人
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    //初始化数据模型
    var newVO = function() {
        return {
            id: null,
            remindName: null,
            remindType: 0,
            remindWay: null,
            lookupId: null,
            remindExpress: null,
            createDate: null,
            remindEventType: null,
            lookup: {
                attr1: null
            },
            rmList: [],
            userList: [],
            rcList: [],
            roleList: [],
            orgId: null,
            code: null,
            compId: null
        }
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            isReadOnly: true,
            timeRules: {
                "vo.code": [
                    { required: true, message: '请输入编码' },
                    LIB.formRuleMgr.length(25, 1)
                ],
                "vo.remindName": [
                    { required: true, message: '请输入提醒名称' },
                    LIB.formRuleMgr.length(25, 1)
                ],
                "vo.orgId": [
                    { required: true, message: '请选择所属公司' },
                    LIB.formRuleMgr.length(25, 1)
                ],
                "vo.lookupId": [
                    { required: true, message: '请选择操作对象' },
                    LIB.formRuleMgr.length(25, 1)
                ],
                timeWay: [
                    { required: true, type: "array", message: '请选择提醒方式', min: 1 }
                ],
                "vo.remindExpress": [
                    { required: true, message: '请输入规则' },
                    LIB.formRuleMgr.length(200, 1)
                ],
                "vo.rcList": [
                    { required: true, type: "array", message: '请至少添加条件', min: 1 }
                ]
            },
            emptyRules: {},
            addShow: false,
            vo: newVO(),
            tabsShow: false,
            opType: null,
            conditionList: [],
            lookupList: [],
            orgList: [],
            uList: [],
            tabsType: null,
            selectedRole: [],
            selectedUser: [],
            timeCondition: [],
            valueCondition: [{
                    value: 'equals',
                    label: "等于"
                },
                {
                    value: 'notEquals',
                    label: "不等于"
                },
                {
                    value: 'isNull',
                    label: "为空"
                },
                {
                    value: 'isNotNull',
                    label: "不为空"
                }
            ],
            dateCondition: [{
                    value: 'beforeDate',
                    label: "早于"
                },
                {
                    value: 'afterDate',
                    label: "晚于"
                },
                {
                    value: 'betweenDate',
                    label: "区间"
                },
                {
                    value: 'isNull',
                    label: "为空"
                },
                {
                    value: 'isNotNull',
                    label: "不为空"
                }
            ],
            showRcList: [],
            eventType: [{
                    value: "INSERT",
                    label: "新增"
                },
                {
                    value: "UPDATE",
                    label: "修改"
                },
                {
                    value: "DELETE",
                    label: "删除"
                }
            ],
            timeWay: [],
            dateValues: ["8", "54", "50", "45", "43", "41", "38", "34", "26", "20", "18", "14", "1", "31", "32"],
            modelValues: ["2", "5", "6", "7", "12", "15", "22", "23", "24", "27", "30", "35", "36", "37", "39", "42", "51", "52", "53"]
        },
        showModal: false,
        roleModel: {
            show: false,
            title: '选择角色',
            role: {
                id: null,
                name: null
            },
            orgId: ''
        },
        roleTitle:"角色",
        userTitle:"员工"
    };
    //Vue组件
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
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
        template: tpl,
        components: {
            "role-component": roleComponent,
            "userSelectModal": userSelectModal
        },
        data: function() {
            return dataModel;
        },
        computed: {
            doRemindType: function() {
                var value = this.mainModel.vo.remindType;
                if (value == 0) {
                    return "时间提醒";
                } else if (value == 1) {
                    return "事件提醒";
                } else {
                    return "审批提醒";
                }
            },
            doRemindWay: function() {
                var value = this.mainModel.vo.remindWay;
                var str = "";
                if (value) {
                    var t = value.split(',');
                    for (var i = 0; i < t.length; i++) {
                        if (t[i] == "0") {
                            str = str + "系统,";
                        } else if (t[i] == "1") {
                            str = str + "邮箱,";
                        } else if (t[i] == "2") {
                            str = str + "短信,";
                        } else if (t[i] == "3") {
                            str = str + "APP,";
                        }
                    }
                    str = str.substring(0, str.length - 1);
                }
                return str;
            }
        },
        methods: {
            newVO: newVO,
            doClose: function() {
                this.$dispatch("ev_dtClose");
            },
            // doClose:function () {
            //     this.$dispatch("ev_detailColsed");
            // },
            //doDelete:function () {
            //    this.$dispatch("ev_detailColsed");
            //},
            doCancel: function() {
                var _this = this;
                if (_this.mainModel.vo.id) {
                    this.$api.get({ id: _this.mainModel.vo.id }).then(function(res) {
                        var data = res.data;
                        _this.mainModel.vo = newVO();
                        _.deepExtend(_this.mainModel.vo, data);
                    });
                }
                // _this.mainModel.isReadOnly = true;
                _this.afterInitData && _this.afterInitData();
                this.changeView("view");
            },
            doDel: function(item,index){
                var _vo = dataModel.mainModel.vo;
                if(this.mainModel.opType=="view"){
                    api.remove({id:dataModel.mainModel.vo.id},[{id: item.id}]).then(function(res) {
                        if (res.status == 200) {
                            _vo.rmList.splice(index,1);
                            LIB.Msg.info("删除成功");
                            api.get({id: dataModel.mainModel.vo.id}).then(function(res1) {
                                _vo.roleList = res1.body.roleList;
                                _vo.userList = res1.body.userList;
                            })
                        }
                    });
                }else{
                    _vo.rmList.splice(index,1)
                    LIB.Msg.info("删除成功");
                }
            },

            doDelete: function() {
                var _vo = this.mainModel.vo;
                var _this = this;

                api.delete(null, [_vo.id]).then(function() {
                    _this.afterDoDelete();
                    _this.$dispatch("ev_dtDelete");
                    LIB.Msg.info("删除成功");
                });
            },
            doChangeNodesAndExpress: function() {
                var _model = this.mainModel;
                var express = "";
                var index = 0;
                _.each(_model.vo.rcList, function(c) {
                    if (c.lookupItemId) {
                        if (index > 0) {
                            express = express + " and " + (index + 1);
                        } else {
                            express = "1";
                        }
                        index++;
                    }
                });
                _model.vo.remindExpress = express;
            },
            doChangeTimeValue: function(val) {

            },
            doAddCondition: function() {
                this.mainModel.vo.rcList.push({
                    lookupItemId: null,
                    conditionNodes: null,
                    conditionValueDate: null,
                    conditionValueEndDate: null
                });
            },
            doDeleteCondition: function(i) {
                var _model = this.mainModel;
                var express = "";
                var index = 0;
                _model.vo.rcList.splice(i, 1);
                _.each(_model.vo.rcList, function(c) {
                    if (c.lookupItemId) {
                        if (index > 0) {
                            express = express + " and " + (index + 1);
                        } else {
                            express = "1";
                        }
                        index++;
                    }
                });
                _model.vo.remindExpress = express;
            },
            doChangeDataByTime: function(data) {
                var _mainModel = this.mainModel;
                if (_mainModel.opType == "create") {
                    api.generate(_.pick(_mainModel.vo, "id", "lookupId")).then(function(res) {
                        _mainModel.vo.code = res.body;
                    });
                };
                api.listLookupItem({ lookupId: data, attr2: "1" }).then(function(res) {
                    _.deepExtend(_mainModel.timeCondition = res.data);
                });
            },
            doAddPerson: function() {
                this.showModal = true;
            },
            //添加角色
            doAddRole: function() {
                this.roleModel.show = true;
                var roleList = [];
                _.each(this.mainModel.vo.rmList, function(r) {
                    if (r.type == 1) {
                        roleList.push(r);
                    }
                });
                this.$broadcast('ev_roleReloadData', roleList);
            },
            //人员保存
            doSaveSelect: function(val) {
                var _vo = this.mainModel.vo;
                var isExist = false;
                _.each(_vo.rmList, function(u) {
                    if (u.type == 0 && u.relId == val[0].id) {
                        isExist = true;
                    }
                });
                if (!isExist) {
                    _vo.rmList.push({ type: 0, relId: val[0].id, name: val[0].username });
                }
            },
            doRoleSaved: function(nVal) {
                var _vo = this.mainModel.vo;
                // 清除所有角色
                var tmpList = [];
                var num = 0;
                _.extend(tmpList, _vo.rmList);
                _.each(tmpList, function(r, i) {
                    if (r.type == 1) {
                        _vo.rmList.splice(i - num, 1);
                        num++;
                    }
                });
                _.each(nVal, function(val) {
                    _vo.rmList.push({ type: 1, relId: val.id, name: val.name });
                });

                this.roleModel.show = false;
            },
            doSearchModelType: function(val) {
                if (val == 0) {
                    return "员工";
                }
                return "角色";
            },
            formatData: function(time, format) {
                if (time) {
                    var t = new Date(time);
                    var tf = function(i) { return (i < 10 ? '0' : '') + i };
                    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
                        switch (a) {
                            case 'yyyy':
                                return tf(t.getFullYear());
                                break;
                            case 'MM':
                                return tf(t.getMonth() + 1);
                                break;
                            case 'mm':
                                return tf(t.getMinutes());
                                break;
                            case 'dd':
                                return tf(t.getDate());
                                break;
                            case 'HH':
                                return tf(t.getHours());
                                break;
                            case 'ss':
                                return tf(t.getSeconds());
                                break;
                        }
                    })
                }
            },
            doChangeDataFormat: function() {
                var _vo = dataModel.mainModel.vo;
                var _data = dataModel.mainModel;

                _data.showRcList = [];
                _data.timeWay = [];

                // 转义所有 && 与 ||
                _vo.remindExpress = _vo.remindExpress.replace(/\|\|/g, 'or');
                _vo.remindExpress = _vo.remindExpress.replace(/&&/g, 'and');
                _data.timeWay = _vo.remindWay.split(',');

                _vo.rmList = [];
                // 获取所有提醒对象
                if (_vo.roleList) {
                    _.each(_vo.roleList, function(val) {
                        _vo.rmList.push({ type: 1, relId: val.id, name: val.name });
                    });
                }

                if (_vo.userList) {
                    _.each(_vo.userList, function(val) {
                        _vo.rmList.push({ type: 0, relId: val.id, name: val.username });
                    });
                }

                _.each(_vo.rcList, function(rc) {
                    if (rc.conditionNodes == "equals") {
                        if (rc.attr2) {
                            _data.showRcList.push(rc.lookupItem.name + " 等于 " + rc.attr2);
                        } else {
                            _data.showRcList.push(rc.lookupItem.name + " 等于 " + rc.conditionValue);
                        }
                    } else if (rc.conditionNodes == "notEquals") {
                        if (rc.attr2) {
                            _data.showRcList.push(rc.lookupItem.name + " 不等于 " + rc.attr2);
                        } else {
                            _data.showRcList.push(rc.lookupItem.name + " 不等于 " + rc.conditionValue);
                        }
                    } else if (rc.conditionNodes == "equals") {
                        _data.showRcList.push(rc.lookupItem.name + " 等于 " + rc.conditionValue);
                    } else if (rc.conditionNodes == "isNull") {
                        _data.showRcList.push(rc.lookupItem.name + " 为空 ");
                    } else if (rc.conditionNodes == "isNotNull") {
                        _data.showRcList.push(rc.lookupItem.name + " 不为空 ");
                    } else if (rc.conditionNodes == "beforeDate") {
                        _data.showRcList.push(rc.lookupItem.name + " 早于 " + rc.conditionValueDate);
                    } else if (rc.conditionNodes == "afterDate") {
                        _data.showRcList.push(rc.lookupItem.name + " 晚于 " + rc.conditionValueDate);
                    } else if (rc.conditionNodes == "betweenDate") {
                        _data.showRcList.push(rc.lookupItem.name + " 介于 " + rc.conditionValueDate + " - " + rc.conditionValueEndDate);
                    }
                });
            },
            beforeDoSave: function() {
                var _this = this;
                var rmList = [];
                if (_this.mainModel.vo.rcList.length > 0) {
                    _.each(_this.mainModel.vo.rcList, function(item) {
                        if (item.conditionValueDate) {
                            item.conditionValueDate = _this.formatData(item.conditionValueDate, "yyyy-MM-dd HH:mm:ss");
                        }
                        if (item.conditionValueEndDate) {
                            item.conditionValueEndDate = _this.formatData(item.conditionValueEndDate, "yyyy-MM-dd HH:mm:ss");
                        }
                    })
                }
                _.each(_this.mainModel.vo.rmList, function(r) {
                    rmList.push({ relId: r.relId, type: r.type });
                });
                _this.mainModel.vo.rmList = rmList;
                _this.mainModel.vo.remindWay = _this.mainModel.timeWay.join(",");
            },
            afterDoSave: function() {
                this.doClose();
                // this.doChangeDataFormat();
            },
            buildSaveData: function() {
                return _.omit(this.mainModel.vo, "lookup", "userList");
            },
            beforeInit: function(oVal, opt) {
                var _mainModel = this.mainModel;
                var _vo = dataModel.mainModel.vo;
                _.extend(_vo, newVO());
                this.mainModel.showRcList = [];
                this.mainModel.timeWay = [];
                if (opt.opType === 'update') {
                    api.listLookupItem({ lookupId: oVal.lookupId, attr2: "1" }).then(function(res) {
                        _.deepExtend(_mainModel.timeCondition = res.data);
                    });
                }
            },
            afterDoEdit: function() {
                var _mainModel = this.mainModel;
                api.listLookupItem({ lookupId: _mainModel.vo.lookupId, attr2: "1" }).then(function(res) {
                    _.deepExtend(_mainModel.timeCondition = res.data);
                });
            },
            afterInitData: function() {
                this.doChangeDataFormat();
            }
        },
        events: {},
        ready: function() {
            var _data = dataModel.mainModel;
            // 加载组织机构
            api.listOrg({ type: 1 }).then(function(res) {
                _data.orgList = res.data;
            });
            // 加载时间操作对象
            api.listLookup({ attr2: 1 }).then(function(res) {
                _data.lookupList = res.data;
            });
        },
        init: function () {
            this.$api = api;
        }

    });

    return detail;
});