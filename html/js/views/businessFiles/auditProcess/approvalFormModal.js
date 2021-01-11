define(function (require) {
    //基础js
    var LIB = require('lib');
    //数据模型
    var api = require("./vuex/api");
    var template = LIB.renderHTML(require("text!./approvalFormModal.html"));
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var deptSelectModal = require("componentsEx/selectTableModal/deptSelectModal");

    var newVO = function() {
        return {
            id : null,
            //唯一标识
            code : null,
            name: null,
            orderNo: null,
            //审批类型(pojoName)
            type: null,
            //禁用标识 0:未禁用,1:已禁用
            disable: '0',
            //签署方式 1:或签,2:会签
            signWay: '1',
            auditRoles: []
        }
    };

    var newItemVO = function() {
        return {
            id: null,
            //编码
            code : null,
            //禁用标识 0:启用,1:禁用
            disable : "0",
            //审批对象所属部门id
            orgId : null,
            auditorId: null,
            auditorName: null,
            auditorOrgId: null
        }
    };

    var userColumns = [
        {
            title: "人员",
            fieldName: "user.name"
        },
        {
            title: "人员所属部门",
            render: function (data) {
                return LIB.getDataDic("org", data.user.orgId)['deptName']
            }
        },
        {
            title: "审核部门",
            render: function (data) {
                return _.pluck(data.organizations, "name").join("、")
            }
        },
        {
            title: "选择",
            event: true,
            width: "65px",
            render: function () {
                return '<a data-action="SELECT_D_FOR_U" href="javascript:void(0);" style="color: blue;">选择部门</a>'
            }
        }
    ];

    var departmentColumns = [
        {
            title: "所属部门",
            fieldName:"organization.name"
        },
        {
            title: "审批负责人",
            render: function (data) {
                return _.pluck(data.users, "name").join("、")
            }
        },
        {
            title: "条件",
            event: true,
            width: "65px",
            render: function () {
                return '<a data-action="SELECT_U_FOR_D" href="javascript:void(0);" style="color: blue;">选择人员</a>'
            }
        }
    ];

    var dataModel = {
        title: "设置审批节点",
        mainModel: {
            vo: newVO(),
            //验证规则
            rules: {
                name: [LIB.formRuleMgr.require("节点名称"), LIB.formRuleMgr.length(50)]
            }
        },
        deptSelectModel: {
            visible: false,
            filterData: {compId: null}
        },
        userSelectModel: {
            visible: false,
            filterData: {}
        },
        values: null,
        columns: userColumns,
        allAdminNotice: false,
        currentMode: 'user',
        selectedCompId: LIB.user.compId,
        processId: null,
        deleteUserIds:[],
        deleteOrgIds:[],
    };

    var component = LIB.Vue.extend({
        template: template,
        components: {
            "deptSelectModal": deptSelectModal,
            "userSelectModal": userSelectModal
        },
        props: {
            id: {
                type: String
            },
            visible: {
                type: Boolean,
                default: false
            },
            type: {
                type: String,
                default: ''
            },
            hasAuth: {
                type: Boolean,
                default: false
            }
        },
        data: function () {
            return dataModel;
        },
        watch:{
          'selectedCompId': function(val, oldVal) {
              var _this = this;
              LIB.Modal.confirm({
                  title: '请确认当前所做的操作都已经保存，是否确认？',
                  onOk: function () {
                      _this.deleteUserIds = [];
                      _this.deleteOrgIds = [];
                      _this._getAuditRoles(_this.processId);
                  },
                  onCancel: function() {
                      _this.selectedCompId = oldVal;
                  }
              });

          }
        },
        methods: {

            init: function (action, param) {
                this.currentMode = 'user';
                this.columns = userColumns;
                var _this = this;
                this.mainModel.vo = newVO();
                this.values = [];
                this.allAdminNotice = false;
                this.action = action;
                _this.flatList = [];
                this.processId = param;
                this.deleteUserIds = [];
                this.deleteOrgIds = [];

                if (action === 'create') {
                    this.mainModel.vo.orderNo = param + 1;
                    this.mainModel.vo.type = this.type;
                } else if (action === 'update') {
                    api.get({id: param}).then(function (res) {
                        _.deepExtend(_this.mainModel.vo, res.data);
                        _this._getAuditRoles(res.data.id);
                    })
                }
            },

            _getAuditRoles: function (id) {
                var _this = this;
                api.queryAuditRoles({pageNo: 1, pageSize: 999, id: id, 'criteria.strValue': {userCompId: this.selectedCompId}}).then(function (res) {
                    _this.flatList = res.data.list; // 一一对应的数据源，方便转为 人员视图 和 部门视图
                    _this._normalizeValues();
                })
            },


            // 点击“选择部门”或者“选择人员”
            onRowClicked: function (item, ev) {
                var el = ev.target;
                var action = _.get(el, "dataset.action");

                this.selectedRow = item;
                if (action === 'SELECT_D_FOR_U') {
                    this.select4Type = 4;
                    this.deptSelectModel.visible = true;
                    this.deptSelectModel.filterData = {compId: this.selectedCompId, disable:0}
                } else if(action === 'SELECT_U_FOR_D') {
                    this.select4Type = 2;
                    this.userSelectModel.visible = true;
                    this.userSelectModel.filterData = {compId: this.selectedCompId, disable:0}
                }
            },

            _normalizeUserValues: function () {
                var _values = [];
                var groupList = _.groupBy(this.flatList, "auditorId");
                _.forEach(groupList, function (v, k) {
                    if (!k || k === 'undefined') {
                        return;
                    }
                    var item = v[0];
                    var value = {
                        user: {id:item.auditorId, name:item.auditorName, orgId: item.auditorOrgId},
                        organizations: _.map(v, function(i){
                            return {id: i.orgId, name: LIB.getDataDic("org", i.orgId)['deptName']}
                        })
                    };
                    _values.push(value);
                });
                this.values = _values;
            },
            _normalizeDeptValues: function () {
                var _values = [];
                var groupList = _.groupBy(this.flatList, "orgId");
                _.forEach(groupList, function (v, k) {
                    if (!k || k === 'undefined') {
                        return;
                    }
                    var item = v[0];
                    var value = {
                        orgId: item.orgId,
                        organization: {id: item.orgId, name: LIB.getDataDic("org", item.orgId)['deptName']},
                        users: _.map(v, function(i){
                            return {id: i.auditorId, name: i.auditorName}
                        })
                    };
                    _values.push(value);
                });
                this.values = _values;
            },
            _normalizeValues: function () {

                if (this.currentMode === 'user') {
                    this._normalizeUserValues();
                } else if (this.currentMode === 'dept') {
                    this._normalizeDeptValues();
                }
            },

            // 选择人员
            doShowUserSelectModal: function () {
                this.select4Type = 1;
                this.userSelectModel.visible = true;
                this.userSelectModel.filterData = {compId: this.selectedCompId, disable:0}
            },
            doSaveUsers: function (rows) {
                var _this = this;
                var selectedRow = this.selectedRow;
                var users = _.map(rows, function (row) {
                    return {
                        id: row.id,
                        name: row.name,
                        orgId: row.orgId
                    }
                });

                if (this.select4Type === 1) {
                    var existUserIds = _.pluck(this.values, "user.id");
                    users = _.filter(users, function (item) {
                        return !_.includes(existUserIds, item.id);
                    });
                    _.forEach(users, function (item) {
                        var vo = newItemVO();
                        vo.user = item;
                        vo.auditorId = item.id;
                        vo.auditorName = item.name;
                        vo.auditorOrgId = item.orgId;
                        _this.flatList.push(vo)
                    });
                } else if (this.select4Type === 2) {
                    var existUserIds = [];
                    _.each(this.flatList, function(item){
                        if(item.orgId == selectedRow.organization.id && !!item.auditorId) {
                            existUserIds.push(item.auditorId);
                        }
                    });

                    if(existUserIds.length == 0) {//没有选择人员说明是新添加的部门，删除这一行后续遍历所选人员补充回来
                        var index = _.findIndex(this.flatList, "orgId", selectedRow.organization.id);
                        this.flatList.splice(index, 1);
                    }
                    var newRows = [];
                    _.each(users, function (item) {
                        if(!existUserIds.includes(item.id)) {//排除已选人员
                            var vo = newItemVO();
                            vo.organization = selectedRow.organization;
                            vo.orgId = selectedRow.organization.id;
                            vo.auditorId = item.id;
                            vo.auditorName = item.name;
                            vo.auditorOrgId = item.orgId;
                            newRows.push(vo);
                        }
                    });
                    this.flatList = this.flatList.concat(newRows);
                }

                this._normalizeValues();
            },
            doRemoveUser: function (item) {
                var index = _.findIndex(this.values, "user.id", item.user.id);
                this.values.splice(index, 1);
                this.deleteUserIds.push(item.user.id);
                this.flatList = _.filter(this.flatList, function (v) {
                    return item.user.id !== v.auditorId;
                })
            },


            // 选择部门
            doShowDeptSelectModal: function () {
                this.select4Type = 3;
                this.deptSelectModel.visible = true;
                this.deptSelectModel.filterData = {compId: this.selectedCompId, disable:0}
            },
            doSaveDepts: function (rows) {
                var _this = this;
                var selectedRow = this.selectedRow;

                var organizations = _.map(rows, function (row) {
                    return {
                        id: row.id,
                        name: row.name
                    }
                });

                if (this.select4Type === 4) {
                    var existOrganizationIds = [];//人员已选的审核部门
                    _.each(this.flatList, function(item){
                        if(item.auditorId == selectedRow.user.id && !!item.orgId) {
                            existOrganizationIds.push(item.orgId);
                        }
                    });
                    if(existOrganizationIds.length == 0) {//没有选择部门说明是新添加的人员，删除这一行后续遍历所选部门补充回来
                        var index = _.findIndex(this.flatList, "auditorId", selectedRow.user.id);
                        this.flatList.splice(index, 1);
                    }
                    var newRows = [];
                    _.each(organizations, function (item) {
                        if(!existOrganizationIds.includes(item.id)) {//排除已经选了的部门
                            var vo = newItemVO();
                            vo.user = selectedRow.user;
                            vo.orgId = item.id;
                            vo.organization = item;
                            vo.auditorId = selectedRow.user.id;
                            vo.auditorName = selectedRow.user.name;
                            vo.auditorOrgId = selectedRow.user.orgId;
                            newRows.push(vo);
                        }
                    });
                    this.flatList = this.flatList.concat(newRows);

                } else if (this.select4Type === 3) {
                    var existOrganizationIds = _.pluck(this.values, "orgId");
                    organizations = _.filter(organizations, function (item) {
                        return !_.includes(existOrganizationIds, item.id);
                    });
                    _.forEach(organizations, function (item) {
                        var vo = newItemVO();
                        vo.organization = item;
                        vo.orgId = item.id;
                        _this.flatList.push(vo)
                    });
                }

                this._normalizeValues();
            },
            doRemoveDept: function (item) {
                var index = _.findIndex(this.values, "organization.id", item.organization.id);
                this.values.splice(index, 1);
                this.deleteOrgIds.push(item.organization.id);
                this.flatList = _.filter(this.flatList, function (v) {
                    return item.organization.id !== v.orgId;
                })
            },


            doShowSelectModal: function () {
                if (this.currentMode === 'user') {
                    this.doShowUserSelectModal();
                } else if (this.currentMode === 'dept') {
                    this.doShowDeptSelectModal();
                }
            },
            changeMode: function (mode) {
                if (this.currentMode === mode) {
                    return;
                }
                this.currentMode = mode;
                if (mode === 'user') {
                    this.columns = userColumns;
                } else if (mode === 'dept') {
                    this.columns = departmentColumns;
                }

                this._normalizeValues();
            },
            doRemove: function (item) {
                if (this.currentMode === 'user') {
                    this.doRemoveUser(item)
                } else if (this.currentMode === 'dept') {
                    this.doRemoveDept(item);
                }
            },


            doSave: function (exit) {
                var param = _.cloneDeep(this.mainModel.vo);
                param.auditRoles = this.flatList;
                param.criteria = {strsValue:{deleteUserIds:this.deleteUserIds, deleteOrgIds:this.deleteOrgIds}}
                var _this = this;
                this.$refs.ruleform.validate(function(valid) {
                    if (valid) {
                        if (_this.action === 'create') {
                            api.create(param).then(function (res) {
                                LIB.Msg.success("保存成功");
                                _this.$emit("do-save", exit)
                            })
                        } else if (_this.action === 'update') {
                            api.update(param).then(function (res) {
                                LIB.Msg.success("保存成功");
                                _this.$emit("do-save", exit)
                            });
                        }
                    }
                })
            },

        }
    });

    return component;
});