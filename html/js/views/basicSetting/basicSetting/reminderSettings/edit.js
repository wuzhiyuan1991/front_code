/**
 * Created by yyt on 2016/11/2.
 */
define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./edit.html");
    var editModelComponent = require("./dialog/edit");
    //选择角色组件
    var roleComponent = require("./roleComponent");
    //弹窗选人
    var userSelectModal = require("../../../../componentsEx/userSelect/userSelectModal");
    //初始化数据模型
    var newVO = function () {
        return {
            id: null,
            remindName: null,
            remindType: null,
            remindWay: null,
            lookupId: null,
            orgId: null,
            attr1: null,
            remindExpress: null,
            remindEventType: null,
            lookup: {
                attr1: null
            },
            rmList: [],
            userList: [],
            rcList: []
        }
    };

    var newTimeVO = function () {
        return {
            id: null,
            remindName: null,
            remindType: 0,
            remindWay: null,
            lookupId: null,
            orgId: null,
            code: null,
            attr1: null,
            remindExpress: null,
            remindEventType: null,
            lookup: {
                attr1: null
            },
            rmList: [],
            userList: [],
            rcList: [],
            compId:null
        }
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            isReadOnly:true,
            timeRules: {
                "timeVo.code":[
                    {required: true, message: '请输入编码'},
                    LIB.formRuleMgr.length(25, 1)
                ],
                "timeVo.remindName": [
                    {required: true, message: '请输入提醒名称'},
                    LIB.formRuleMgr.length(25, 1)
                ],
                "timeVo.orgId": [
                    {required: true, message: '请选择所属公司'},
                    LIB.formRuleMgr.length(25, 1)
                ],
                "timeVo.lookupId": [
                    {required: true, message: '请选择操作对象'},
                    LIB.formRuleMgr.length(25, 1)
                ],
                timeWay: [
                    {required: true, type: "array", message: '请选择提醒方式', min: 1}
                ],
                "timeVo.remindExpress": [
                    {required: true, message: '请输入规则'},
                    LIB.formRuleMgr.length(200, 1)
                ],
                "timeVo.rcList": [
                    {required: true, type: "array", message: '请至少添加条件', min: 1}
                ]
            },
            emptyRules:{},
            addShow:false,
            vo: newVO(),
            timeVo: newTimeVO(),
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
            valueCondition: [
                {
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
            dateCondition: [
                {
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
            eventType: [
                {
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
        chooiseModel: {
            //控制编辑组件显示
            title: "新增",
            //显示编辑弹框
            show: false,
            //编辑模式操作类型
            type: "create",
            id: null
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
    };
    //Vue组件
    var edit = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
        template: tpl,
        data: function () {
            return dataModel;
        },
        components: {
            "chooisemodelcomponent": editModelComponent,
            "role-component": roleComponent,
            "userSelectModal":userSelectModal
        },
        computed: {},
        props: {
            show: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            show: function (val) {
                this.mainModel.tabsShow = val;
            },

        },
        methods: {
            //页签切换
            test: function () {
                var result = false;
                // ...
                return result;
            },
            doEdit:function(){
                this.mainModel.opType = "update";
                this.mainModel.isReadOnly = true
            },
            doCancel:function(){
                var _this = this;
                if(_this.mainModel.vo.id) {
                    api.get({id : _this.mainModel.vo.id}).then(function(res){
                        var data = res.data;
                        _this.mainModel.vo = newVO();
                        _.deepExtend(_this.mainModel.vo, data);
                    });
                }
                _this.mainModel.isReadOnly = false;
                _this.afterInitData && _this.afterInitData();
            },
            doChangeDataByTime: function (data) {
                var _mainModel = this.mainModel;
                if (_mainModel.opType == "create") {
                    api.generate(_.pick(_mainModel.timeVo, "id", "lookupId")).then(function (res) {
                        _mainModel.timeVo.code = res.body;
                    });
                }
                ;
                api.listLookupItem({lookupId: data, attr2: "1"}).then(function (res) {
                    _.deepExtend(_mainModel.timeCondition = res.data);
                });
            },
            doChangeUser: function (val) {
                var _model = this.mainModel;
                api.listUser({orgId: val.data.id}).then(function (res) {
                    _model.eventUserList = res.data;
                });
            },
            doDel : function(item,index) {
                var _model = this.mainModel;
                LIB.Msg.info("删除成功");
                _model.timeVo.rmList.splice(index,1)
            },
            doDelete:function(){
                var _vo = this.mainModel.timeVo;
                var _this = this;
                LIB.Modal.confirm({
                    title:'删除当前数据?',
                    onOk:function(){
                        api.delete(null,[_vo.id]).then(function(){
                            _this.afterDoDelete();
                            _this.$dispatch("ev_dtDelete");
                            LIB.Msg.info("删除成功");
                        });
                    }
                });
            },
            doChangeNodesAndExpress: function () {
                var _model = this.mainModel;
                var express = "";
                var index = 0;
                _.each(_model.timeVo.rcList, function (c) {
                    if (c.lookupItemId) {
                        if (index > 0) {
                            express = express + " and " + (index + 1);
                        } else {
                            express = "1";
                        }
                        index++;
                    }
                });
                _model.timeVo.remindExpress = express;
            },
            doChangeTimeValue: function (val) {

            },
            doAddCondition: function () {
                this.mainModel.timeVo.rcList.push({
                    lookupItemId: null,
                    conditionNodes: null,
                    conditionValueDate: null,
                    conditionValueEndDate: null
                });
            },
            doSearchModelType: function (val) {
                if (val == 0) {
                    return "员工";
                }
                return "角色";
            },
            doSaveEventRemind: function () {
            },
            // 保存时间提醒
            doSave: function () {
                var _this = this;
                var rmList = [];
                //return this.formatData(this.selectedDate,"yyyy-MM-dd");
                if(_this.mainModel.timeVo.rcList.length > 0){
                    _.each(_this.mainModel.timeVo.rcList,function(item){
                        if(item.conditionValueDate){
                            item.conditionValueDate = _this.formatData(item.conditionValueDate,"yyyy-MM-dd HH:mm:ss");
                        }
                        if(item.conditionValueEndDate){
                            item.conditionValueEndDate = _this.formatData(item.conditionValueEndDate,"yyyy-MM-dd HH:mm:ss");
                        }
                    })
                }
                var callback = function (data) {
                    //_this.$dispatch("ev_editFinished", data);
                    _this.$emit("do-edit-finished", data);
                    _this.mainModel.timeWay = [];
                    LIB.Msg.info("保存成功");
                    _this.doClose();
                };
                _this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        if (_this.mainModel.timeVo.rmList.length <= 0) {
                            LIB.Msg.error("请至少添加一个提醒对象");
                            return;
                        }
                        _.each(_this.mainModel.timeVo.rmList, function (r) {
                            rmList.push({relId: r.relId, type: r.type});
                        });
                        _this.mainModel.timeVo.rmList = rmList;
                        _this.mainModel.timeVo.remindWay = _this.mainModel.timeWay.join(",");
                        if (_this.mainModel.opType == "create") {

                            api.create(_.omit(_this.mainModel.timeVo, "lookup", "userList")).then(callback(_this.mainModel.timeVo));
                        } else {
                            api.update(_.omit(_this.mainModel.timeVo, "lookup", "userList")).then(callback(_this.mainModel.timeVo));
                        }
                    }
                });

            },
            formatData:function(time, format){
                if(time){
                    var t = new Date(time);
                    var tf = function(i){return (i < 10 ? '0' : '') + i};
                    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
                        switch(a){
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
            doDeleteCondition: function (i) {
                var _model = this.mainModel;
                var express = "";
                var index = 0;
                _model.timeVo.rcList.splice(i,1);
                _.each(_model.timeVo.rcList, function (c) {
                    if (c.lookupItemId) {
                        if (index > 0) {
                            express = express + " and " + (index + 1);
                        } else {
                            express = "1";
                        }
                        index++;
                    }
                });
                _model.timeVo.remindExpress = express;
            },
            //doCancel: function () {
            //    this.$dispatch("ev_editCanceled");
            //},
            //添加人员
            doAddPerson: function () {
                this.showModal = true;
            },
            //人员保存
            doSaveSelect: function (val) {
                var _vo = this.mainModel.timeVo;
                var isExist = false;
                _.each(_vo.rmList, function (u) {
                    if (u.type == 0 && u.relId == val[0].id) {
                        isExist = true;
                    }
                });
                if (!isExist) {
                    _vo.rmList.push({type: 0, relId: val[0].id, name: val[0].username});
                }
            },
            //添加角色
            doAddRole: function () {
                this.roleModel.show = true;
                var roleList = [];
                _.each(this.mainModel.timeVo.rmList, function (r) {
                    if (r.type == 1) {
                        roleList.push(r);
                    }
                });
                this.$broadcast('ev_roleReloadData', roleList);
            },
            //审批阶段
            doApprovalStage: function () {

            },
            doRoleSaved:function(nVal){
                var _vo = this.mainModel.timeVo;
                // 清除所有角色
                var tmpList = [];
                var num = 0;
                _.extend(tmpList, _vo.rmList);
                _.each(tmpList, function (r, i) {
                    if (r.type == 1) {
                        _vo.rmList.splice(i - num, 1);
                        num++;
                    }
                });
                _.each(nVal, function (val) {
                    _vo.rmList.push({type: 1, relId: val.id, name: val.name});
                });

                this.roleModel.show = false;
            },
        },
        events: {
            //edit框数据加载
            //"ev_editModelCanceled": function (nVal, type) {
            //    this.chooiseModel.show = false;
            //},
            // 角色添加
            //"ev_roleSaved": function (nVal) {
            //    var _vo = this.mainModel.timeVo;
            //    // 清除所有角色
            //    var tmpList = [];
            //    var num = 0;
            //    _.extend(tmpList, _vo.rmList);
            //    _.each(tmpList, function (r, i) {
            //        if (r.type == 1) {
            //            _vo.rmList.splice(i - num, 1);
            //            num++;
            //        }
            //    });
            //    _.each(nVal, function (val) {
            //        _vo.rmList.push({type: 1, relId: val.id, name: val.name});
            //    });
            //
            //    this.roleModel.show = false;
            //},
            //修改数据加载
            "ev_editReload": function (nVal, type) {
                var _timeVo = dataModel.mainModel.timeVo;
                var _data = dataModel.mainModel;
                // 控制tab显示
                _data.tabsType = type;
                // 清空提醒方式
                _data.timeWay = [];
                // 清空数据
                _.extend(_timeVo, newTimeVO());
                if (nVal != null) {
                    _data.opType = "update";
                    // 加载详细信息
                    api.get({id: nVal}).then(function (res) {
                        _.extend(_timeVo, res.body);
                        // 转义所有&& 与 ||
                        _timeVo.remindExpress = _timeVo.remindExpress.replace(/\|\|/g, 'or');
                        _timeVo.remindExpress = _timeVo.remindExpress.replace(/&&/g, 'and');
                        _data.timeWay = _timeVo.remindWay.split(',');

                        // 获取所有提醒对象
                        if (_timeVo.roleList) {
                            _.each(_timeVo.roleList, function (val) {
                                _timeVo.rmList.push({type: 1, relId: val.id, name: val.name});
                            });
                        }

                        if (_timeVo.userList) {
                            _.each(_timeVo.userList, function (val) {
                                _timeVo.rmList.push({type: 0, relId: val.id, name: val.username});
                            });
                        }

                    });
                    this.mainModel.addShow = false;
                } else {
                    _data.opType = "create";
                    this.mainModel.addShow = true;
                }
            }
        },
        ready: function () {
            var _data = dataModel.mainModel;
            // 加载组织机构
            api.listOrg({type: 1}).then(function (res) {
                _data.orgList = res.data;
            });
            // 加载时间操作对象
            api.listLookup({attr2: 1}).then(function (res) {
                _data.lookupList = res.data;
            });
        }

    });

    return edit;
})
;