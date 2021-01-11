define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./edit.html");
    //var userFormModal = require("componentsEx/formModal/userFormModal");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");

    //初始化数据模型
    var newVO = function () {
        return {
            //组织机构ID
            id: null,
            //组织编码
            code: null,
            //机构名称
            name: null,
            //
            compId: null,
            //公司地址
            address: null,
            //经纬度
            coordinate: null,
            //是否禁用 0启用,1禁用
            disable: null,
            //机构等级
            level: null,
            //机构电话
            phone: null,
            //备注
            remarks: null,
            //机构类型 1:机构,2:部门
            type: 2,
            //修改日期
            modifyDate: null,
            //创建日期
            createDate: null,
            //人员
            users: [],
            parentId: null,
            disable:"0",

        }
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "",
            userList: [],
            parentDeptId: null,
            disabled: false,
            //验证规则
            rules: {
                //"code":[LIB.formRuleMgr.require("编码")]
                // "code": [LIB.formRuleMgr.require("部门编码"),
                //     LIB.formRuleMgr.length()
                // ],
                name: [
                    {required: true, message: '请输入部门名称'},
                    LIB.formRuleMgr.length(20, 1)
                    //{ min: 1, max: 20, message: '长度在 1 到 20 个字符'}
                ],
                compId: [
                    {required: true, message: '请选择所属公司'},
                ],
                orgId: [{required: true, message: '请选择所属部门'}],
                phone: [
                    {required: true, message: '只允许输入数字'},
                    {type: 'phone', required: true, message: '联系电话格式错误'}
                ]
            },
            emptyRules: {}
        },
        tableModel: {
            userTableModel: {
                url: "dept/users/list/{curPage}/{pageSize}?criteria.intsValue=%7B%22disable%22%3A%5B%220%22%5D%7D",
                columns: [
                    {
                        // title: "名称",
                        // fieldName: "name",
                        title: "名称",
                        fieldType: "custom",
                        pathCode: LIB.ModuleCode.BS_OrI_PerM,
                        render: function (data) {
                            if (data.name) {
                                return data.name;
                            }
                        },
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    },
                    //LIB.tableMgr.column.dept,
                    // {
                    //     title: "所属部门",
                    //     fieldType: "custom",
                    //     render: function (data) {
                    //         if (data.orgId) {
                    //             return LIB.getDataDic("org", data.orgId)["deptName"];
                    //         }
                    //     },
                    //     keywordFilterName: "criteria.strValue.keyWordValue_org"
                    // },
                    LIB.tableMgr.ksColumn.dept,
                    {
                        title: "手机",
                        fieldName: "mobile",
                        keywordFilterName: "criteria.strValue.keyWordValue_mobile"
                    }
                ],
                defaultFilterValue : {"criteria.intsValue": {"disable":["1"]}}
            }
        },
        formModel: {
            userFormModel: {
                show: false,
                queryUrl: "organization/{id}/user/{userId}"
            }
        },
        selectModel: {
            showUserSelectModel: {
                visible: false
            }
        }
        //showUserSelectModal : false,

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
            "userSelectModal": userSelectModal,

        },
        data: function () {
            return dataModel;
        },
        computed: {
            deptDisabled: function () {
                if (this.mainModel.opType != "create") {
                    var dept = this.mainModel.parentDeptId;
                    if (typeof dept == "string" && dept != '') {
                        return true
                    } else {
                        return false
                    }
                }
            }
        },
        methods: {
            newVO: newVO,
            doShowUserSelectModel: function () {
                this.selectModel.showUserSelectModel.visible = true;
            },
            doSaveUsers: function (selectedDatas) {
                if (selectedDatas) {
                    dataModel.mainModel.vo.users = selectedDatas;
                    var param = _.map(selectedDatas, function (data) {
                        return {id: data.id}
                    });
                    var _this = this;
                    api.saveUser({id: dataModel.mainModel.vo.id}, param).then(function () {
                        _this.refreshTableData(_this.$refs.userTable);
                    });
                }
            },
            doUpdateUser: function (data) {
                if (data) {
                    var _this = this;
                    api.updateUser({id: this.mainModel.vo.id}, data).then(function () {
                        _this.refreshTableData(_this.$refs.userTable);
                    });
                }
            },
            doRemoveUsers: function (item) {
                var _this = this;
                var data = item.entry.data;
                api.removeUsers({id: this.mainModel.vo.id}, [{id: data.id}]).then(function () {
                    LIB.Msg.info("删除人员成功！");
                    _this.$refs.userTable.doRefresh();
                });
            },
            afterDoCopy:function() {
                LIB.updateOrgCache(this.mainModel.vo);
            },
            //添加部门成功 修改登录的缓存信息
            afterDoSave: function (type) {
                LIB.updateOrgCache(this.mainModel.vo);
            },
            afterDoEdit: function () {
                var _this = this;
                var _vo = dataModel.mainModel.vo;
                if (_vo.parentId == _vo.compId) {
                    _this.mainModel.parentDeptId = "";
                } else {
                    _this.mainModel.parentDeptId = _vo.parentId;
                }
            },
            doSaveConfirm: function () {
                if (this.mainModel.action === 'copy') {
                    return this.doSave();
                }

                var _this = this;
                if (this.mainModel.opType === 'update' && this.__deptId__ !== this.mainModel.parentDeptId) {

                    LIB.Modal.confirm({
                        title: '所属部门变更会导致用户权限变化，\n' +
                        '部分用户的手机将会重新初始化数据，\n' +
                        '确认变更所属部门？',
                        onOk: function () {
                            if (!_this.mainModel.parentDeptId) {
                                _this.mainModel.vo.parentId = _this.mainModel.vo.compId;
                            } else {
                                _this.mainModel.vo.parentId = _this.mainModel.parentDeptId;
                            }
                            _this.doSave();
                        }
                    });

                } else {
                    if (!this.mainModel.parentDeptId) {
                        this.mainModel.vo.parentId = this.mainModel.vo.compId;
                    } else {
                        this.mainModel.vo.parentId = this.mainModel.parentDeptId;
                    }
                    this.doSave();
                }

            },
            afterInitData: function () {

                this.$refs.userTable.doQuery({id: this.mainModel.vo.id});
                var _this = this;
                var _vo = dataModel.mainModel.vo;
                this.$nextTick(function () {
                    if (_vo.parentId === _vo.compId) {
                        _this.mainModel.parentDeptId = "";
                    } else {
                        _this.mainModel.parentDeptId = _vo.parentId;
                    }

                    _this.__deptId__ = _this.mainModel.parentDeptId;
                });
                if (this.mainModel.action === 'copy') {
                    this.mainModel.vo.name += '（复制）';
                }
            },
            beforeInit: function () {
                var _data = dataModel.mainModel;
                var _vo = dataModel.mainModel.vo;
                dataModel.mainModel.parentDeptId = "";
                //清空数据
                this.$refs.dept.init();
                _data.disabled = false;
                this.$refs.userTable.doClearData();
            },
            doCancelCustom: function () {
                this.doCancel();
                var _vo = dataModel.mainModel.vo;
                if (_vo.parentId == _vo.compId) {
                    this.mainModel.parentDeptId = "";
                } else {
                    this.mainModel.parentDeptId = _vo.parentId;
                }
                // this.mainModel.parentDeptId = null;
            },
            afterDoDelete: function (vo) {
                LIB.updateOrgCache(vo, {type: "delete"});
            },

            doEnableDisable: function() {
                var _this = this;
                var data = _this.mainModel.vo;
                var params = {
                    id: data.id,
                    orgId: data.orgId,
                    disable: data.disable === "0" ? "1" : "0"
                };
                var disable = (data.disable == "0") ? "1" : "0";

                if (disable == "1") {//停用判断
                    api.countChildrenOrg({id:data.id}).then(function (res) {
                        var val = res.data;
                        if (val > 0) {
                            LIB.Modal.confirm({
                                title: data.name+'有子部门，请确认是否要停用？',
                                onOk: function () {
                                    _this.updateDisable(params,data);
                                }
                            });
                        } else {
                            _this.updateDisable(params,data);
                        }
                    })
                } else {
                    _this.updateDisable(params,data);
                }
            },

            updateDisable:function(params,data) {
                var _this = this;
                api.updateDisable(null, params).then(function (res) {
                    data.disable = (data.disable === "0") ? "1" : "0";
                    LIB.Msg.info((data.disable === "0") ? "启用成功" : "停用成功");
                    _this.$dispatch("ev_dtUpdate");
                });
            }
        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return detail;
});