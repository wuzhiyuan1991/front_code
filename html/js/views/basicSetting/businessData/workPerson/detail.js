define(function(require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail.html");
    var roleSelectModal = require("componentsEx/selectTableModal/roleSelectModal");
    var positionSelectModal = require("componentsEx/selectTableModal/positionSelectModal");
    var hseroleSelectModal = require("componentsEx/selectTableModal/hseroleSelectModal");
    var editPsdComponent = require("./dialog/edit-psd");

    //初始化数据模型
    var newVO = function() {
        return {
            id: null,
            name: null,
            username: null,
            mobile: null,
            isRandomPeople: false,
            email: null,
            code: null,
            leaderId: null,
            disable: '0',
            orgId: null,
            parentId: null,
            compId: null,
            loginName: null,
            userDetail: {
                id: null,
                idcard: null,
                nativePlace: null,
                address: null,
                education: null,
                sex: null,
                maritalStatushuan: null,
                emergencyTelephone: null,
                emergencyPeople: null
            },
            org: {
                name: null
            },
            leader: {
                id:'',
                name: '',
                username: null
            },
            remarks: null,
            postType: null,
            userList: [],
            deptList: [],
            positionList: [],
            roleList: [],
            postList: [],
            hseRoleList: [],
            isLocked:null
        }
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            //是否抽检人
            isRandomPeople:false,
            opType: 'view',
            userId: null,
            userList: [],
            isReadOnly: true,
            sexList: [{
                    value: "0",
                    label: "女"
                },
                {
                    value: "1",
                    label: "男"
                }
            ],
            leaderData: null,
            educationList: [{
                value: "5",
                label: "初中"
                },
                {
                    value: "0",
                    label: "高中"
                },
                {
                    value: "6",
                    label: "大专"
                },
                {
                    value: "1",
                    label: "本科"
                },
                {
                    value: "2",
                    label: "研究生"
                },
                {
                    value: "3",
                    label: "博士"
                },
                {
                    value: "4",
                    label: "其他"
                }
            ],
            maritalList: [{
                    value: "0",
                    label: "未婚"
                },
                {
                    value: "1",
                    label: "已婚"
                }
            ],
            rules: {
                // code: [
                //     { required: true, message: '请输入编码' },
                //     LIB.formRuleMgr.length(20, 1)
                // ],
                username: [
                    { required: true, message: '请输入名称' },
                    LIB.formRuleMgr.length(20, 1)
                ],
                mobile: [
                    { required: true, message: '请输入手机号' },
                    { required: true, message: '联系电话格式错误' },
                    LIB.formRuleMgr.length(15, 1)
                ],
                // email: [
                //     {required: true, message: '请输入邮箱'},
                //     {type: 'email', required: true, message: '电子邮箱格式错误'}
                // ],
                compId: [{ required: true, message: '请选择所属公司' },
                    {
                        validator: function (rule, value, callback) {
                            var error = [];
                            if (_.isEmpty(LIB.getDataDic('org', value)['compName'])) {
                                error.push("请选择所属公司");
                            }
                            callback(error);
                        }
                    }
                ],
                orgId: [{ required: true, message: '请选择所属部门' },
                    {
                        validator: function (rule, value, callback) {
                            var error = [];
                            if (_.isEmpty(LIB.getDataDic('org', value)['deptName'])) {
                                error.push("请选择所属部门");
                            }
                            callback(error);
                        }
                    }
                ],
                "userDetail.idcard": [
                    { type: 'card', message: '身份证号码格式错误' }
                ],
                nativePlace: [
                    LIB.formRuleMgr.length(20, 1)
                ],
                address: [
                    LIB.formRuleMgr.length(20, 1)
                ],
                loginName: [
                    { required: true, message: '请输入登录名' },
                    LIB.formRuleMgr.length(20, 1)
                ]
            },
        },

        emptyRules: {},

        tableModel: {
            roleTableModel : {
                columns: [
                    {
                        title: "权限编码",
                        fieldType: "custom",
                        pathCode: LIB.ModuleCode.BS_OrI_AutM,
                        render: function(data) {
                            if (data.code) {
                                return data.code;
                            }
                        }
                    },
                    {
                        title: "权限名称",
                        fieldType: "custom",
                        render: function(data) {
                            if (data.name) {
                                return data.name;
                            }
                        }
                    },
                    _.defaults({ filterType: null }, LIB.tableMgr.column.company),
                    {
                        title: "",
                        fieldType: "tool",
                        toolType: "del"
                    }
                ]
            },
            positionTableModel : {
                columns: [
                    {
                        title: "岗位编码",
                        fieldType: "custom",
                        pathCode: LIB.ModuleCode.BS_OrI_PosM,
                        render: function(data) {
                            if (data.code) {
                                return data.code;
                            }
                        }
                    },
                    {
                        title: "岗位名称",
                        fieldName: "name"
                    },
                    _.defaults({ filterType: null, width: 150 }, LIB.tableMgr.column.company),
                    _.defaults({ filterType: null, width: 150 }, LIB.tableMgr.column.dept),
                    {
                        title: "",
                        fieldType: "tool",
                        toolType: "del"
                    }
                ]
            },
            hseRoleTableModel : {
                columns : [
                     {
                        title: "安全角色编码",
                        fieldType: "custom",
                        pathCode: LIB.ModuleCode.BS_OrI_RolM,
                        render: function(data) {
                            if (data.code) {
                                return data.code;
                            }
                        }
                    },
                    {
                        title: "安全角色名称",
                        fieldType: "custom",
                        render: function(data) {
                            if (data.name && data.postType == 1) {
                                return data.name;
                            }
                        }
                    },
                    _.defaults({ filterType: null }, LIB.tableMgr.column.company),
                    //LIB.tableMgr.column.company,
                    {
                        title: "",
                        fieldType: "tool",
                        toolType: "del"
                    }
                ]
            }
        },
        // personColumns: [{
        //         title: "权限编码",
        //         fieldType: "custom",
        //         pathCode: LIB.ModuleCode.BS_OrI_AutM,
        //         render: function(data) {
        //             if (data.code) {
        //                 return data.code;
        //             }
        //         }
        //     },
        //     {
        //         title: "权限名称",
        //         fieldType: "custom",
        //         render: function(data) {
        //             if (data.name) {
        //                 return data.name;
        //             }
        //         }
        //     },
        //     _.defaults({ filterType: null }, LIB.tableMgr.column.company),
        //     {
        //         title: "",
        //         fieldType: "tool",
        //         toolType: "del"
        //     }
        // ],
        // postColumns: [{
        //         title: "岗位编码",
        //         fieldType: "custom",
        //         pathCode: LIB.ModuleCode.BS_OrI_PosM,
        //         render: function(data) {
        //             if (data.code) {
        //                 return data.code;
        //             }
        //         }
        //     },
        //     {
        //         title: "岗位名称",
        //         fieldName: "name"
        //     },
        //     _.defaults({ filterType: null, width: 150 }, LIB.tableMgr.column.company),
        //     _.defaults({ filterType: null, width: 150 }, LIB.tableMgr.column.dept),
        //     {
        //         title: "",
        //         fieldType: "tool",
        //         toolType: "del"
        //     }
        // ],
        // roleColumns: [{
        //         title: "安全角色编码",
        //         fieldType: "custom",
        //         pathCode: LIB.ModuleCode.BS_OrI_RolM,
        //         render: function(data) {
        //             if (data.code) {
        //                 return data.code;
        //             }
        //         }
        //     },
        //     {
        //         title: "安全角色名称",
        //         fieldType: "custom",
        //         render: function(data) {
        //             if (data.name && data.postType == 1) {
        //                 return data.name;
        //             }
        //         }
        //     },
        //     _.defaults({ filterType: null }, LIB.tableMgr.column.company),
        //     //LIB.tableMgr.column.company,
        //     {
        //         title: "",
        //         fieldType: "tool",
        //         toolType: "del"
        //     }
        // ],
        orgIdData: null,
        orgName: null,
        selectModel: {
            roleSelectModel: {
                visible: false,
                filterData: {
                    compId: null,
                }
            },
            positionSelectModel: {
                visible: false
            },
            hseroleSelectModel: {
                visible: false
            },
            memberSelectModel: {
                visible: false
            }
        },
        resetPsd: {
            //控制组件的显示
            title:"重置密码",
            //显示编辑弹框
            show:false,
            id:null
        },
        copyModel: {
            visible: false,
            title: "复制",
            isNeedCopyRole: false,
            isNeedCopyPosition: false,
            isNeedCopyHse: false
        }
        //showRoleSelectModal : false,
        //showPositionSelectModal : false,
        //showHseroleSelectModal : false,
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
        data: function() {
            return dataModel;
        },
        components: {
            "roleSelectModal": roleSelectModal,
            "positionSelectModal": positionSelectModal,
            "hseroleSelectModal": hseroleSelectModal,
            "editpsdcomponent":editPsdComponent,
        },
        computed: {
            doSex: function() {
                if (this.mainModel.vo.userDetail.sex == 0) {
                    return "女";
                } else if (this.mainModel.vo.userDetail.sex == 1) {
                    return "男";
                }

            },
            doMaritalStatushuan: function() {
                if (this.mainModel.vo.userDetail.maritalStatushuan == 1) {
                    return "已婚";
                } else if (this.mainModel.vo.userDetail.maritalStatushuan == 0) {
                    return "未婚";
                }

            },
            doEducation: function() {
                var edu = this.mainModel.vo.userDetail.education;
                if (edu == 0) {
                    return "高中";
                } else if (edu == 1) {
                    return "本科";
                } else if (edu == 2) {
                    return "研究生";
                } else if (edu == 3) {
                    return "博士";
                } else if (edu == 4) {
                    return "其他";
                } else if (edu == 5) {
                    return "初中";
                } else if (edu == 6) {
                    return "大专";
                }
            },
            styleObj: function () {
                var obj = {
                    color: '#fff',
                    padding: '4px 10px'
                };
                if(this.mainModel.vo.disable === '0') {
                    obj.backgroundColor = "#aacd03";
                } else if(this.mainModel.vo.disable === '1'){
                    obj.backgroundColor = "#f03";
                }
                return obj;
            },
            styleLock: function () {
                var obj = {
                    color: '#fff',
                    padding: '4px 10px'
                };
                if(this.mainModel.vo.isLocked) {
                    obj.backgroundColor = "#f03";
                } else {
                    obj.backgroundColor = "#aacd03";
                }
                return obj;
            }
        },
        methods: {
            newVO: newVO,
           /* doClearSelectSex:function(){
                this.mainModel.vo.userDetail.sex = "";
            },
            doClearSelectMs:function(){
                this.mainModel.vo.userDetail.maritalStatushuan = "";
            },
            doClearSelectEducation:function(){
                this.mainModel.vo.userDetail.education = "";
            },*/
            afterDoCancel:function(){
                if(this.mainModel.vo.isRandomPeople==1){
                    this.mainModel.isRandomPeople = true;
                }else{
                    this.mainModel.isRandomPeople = false;
                }
            },
            doUnLock:function(){
                var _this = this;
                var updateIds = [];
                updateIds.push(this.mainModel.vo.id)
                api.unlock(updateIds).then(function(){
                    _this.mainModel.vo.isLocked = false;
                    _this.$dispatch("ev_dtUpdate");
                    LIB.Msg.info("已解除锁定!");
                })
            },
            doShowMemberSelectModal: function() {
                this.selectModel.memberSelectModel.visible = true;
            },
            doSaveLeader: function (selectedDatas) {
                if (selectedDatas) {

                    this.mainModel.vo.leader = selectedDatas[0];
                    this.mainModel.vo.leaderId = selectedDatas[0].id;
                }
            },
            doClearLeader: function () {
                this.mainModel.vo.leader = {
                    id:'',
                    name: '',
                    username: null
                };
                this.mainModel.vo.leaderId = '';
            },
            doSaveRoles: function(selectedDatas) {
                if (selectedDatas) {
                    dataModel.mainModel.vo.roles = selectedDatas;
                    var _this = this;
                    api.saveRoles({ id: dataModel.mainModel.vo.id }, selectedDatas).then(function() {
                        api.get({ id: dataModel.mainModel.vo.id }).then(function(data) {
                            dataModel.mainModel.vo.roleList = data.body.roleList;
                        });
                    });
                }
            },
            doSavePositions: function(selectedDatas) {
                if (selectedDatas) {
                    dataModel.mainModel.vo.positions = selectedDatas;
                    var _this = this;
                    api.savePositions({ id: dataModel.mainModel.vo.id }, selectedDatas).then(function() {
                        api.get({ id: dataModel.mainModel.vo.id }).then(function(data) {
                            dataModel.mainModel.vo.positionList = data.body.positionList;
                            _this.afterInitData();
                            _this.$dispatch("ev_dtUpdate");
                        });
                    });
                }
            },
            doSaveHseroles: function(selectedDatas) {
                if (selectedDatas) {
                    dataModel.mainModel.vo.positions = selectedDatas;
                    var _this = this;
                    api.savePositions({ id: dataModel.mainModel.vo.id }, selectedDatas).then(function() {
                        api.get({ id: dataModel.mainModel.vo.id }).then(function(data) {
                            dataModel.mainModel.vo.positionList = data.body.positionList;
                            _this.afterInitData();
                            _this.$dispatch("ev_dtUpdate");
                        });
                    });
                }
            },
            doRemoveRoles: function(item) {
                var _this = this;
                var data = item.entry.data;
                api.removeRoles({ id: this.mainModel.vo.id }, [{ id: data.id }]).then(function() {
                    _this.$refs.roleTable.doRefresh();
                });
            },
            afterInitData: function() {
                //給公司賦值
                var _vo = dataModel.mainModel.vo;
                var postList = _.partition(_vo.positionList, function(obj) {
                    return obj.postType == 0;
                });
                _vo.postList = postList[0];
                _vo.hseRoleList = postList[1];

                //给是否抽检人赋值
                this.mainModel.isRandomPeople = _vo.isRandomPeople == '1';
                if (this.mainModel.action === 'copy') {
                    this.mainModel.vo.username += "（复制）";
                    if (!this.copyModel.isNeedCopyRole) {
                        this.mainModel.vo.roleList = [];
                    }
                    if (!this.copyModel.isNeedCopyPosition) {
                        this.mainModel.vo.postList = [];
                    }
                    if (!this.copyModel.isNeedCopyHse) {
                        this.mainModel.vo.hseRoleList = [];
                    }
                }
            },
            beforeInit: function(data, opType) {
                var _vo = dataModel.mainModel.vo;
                this.$refs.roleTable.doClearData();
                //清空数据
                this.mainModel.vo.roleList = [];
                this.mainModel.vo.positionList = [];
                this.mainModel.vo.postList = [];
                this.mainModel.vo.hseRoleList = [];
                if (opType.opType == 'create') {
                    // api.listTree().then(function(res) {
                    //     dataModel.mainModel.userList = res.data;
                    // });
                }
            },
            doEntLeaveOff: function() {
                var _this = this;
                var rows = [];
                rows.push(this.mainModel.vo);
                var disable = rows[0].disable;
                var updateIds = _.map(rows, function(row) {
                    return row.id
                });
                if (disable == '0') {
                    api.updateDisable(updateIds).then(function(res) {
                        _.each(rows, function(row) {
                            row.disable = '1';
                        });
                        _this.$emit("do-detail-update", rows);
                        LIB.Msg.info("离职成功!");
                    });
                } else {
                    api.updateStartup(updateIds).then(function(res) {
                        _.each(rows, function(row) {
                            row.disable = '0';
                        });
                        _this.$dispatch("do-detail-update", rows);
                        LIB.Msg.info("复职成功!");
                    });
                }
            },
            doDelPos: function(obj) {
                var _this = this;
                var posId = obj.entry.data.id;
                api.delPos({ userId: _this.mainModel.vo.id, posId: posId }).then(function() {
                    api.get({ id: _this.mainModel.vo.id }).then(function(res) {
                        if (res) {
                            _.deepExtend(_this.mainModel.vo, res.body);
                            var postList = _.partition(res.body.positionList, function(obj) {
                                return obj.postType == 0;
                            });
                            _this.mainModel.vo.postList = postList[0];
                            _this.mainModel.vo.hseRoleList = postList[1];
                        }
                    });
                    _this.$dispatch("ev_dtUpdate");
                    if (obj.entry.data.postType == 0) {
                        LIB.Msg.info("删除岗位成功！");
                    } else {
                        LIB.Msg.info("删除角色成功！");
                    }
                });
            },

            doDelRole: function(obj) {
                var _this = this;
                var roleId = obj.entry.data.id;
                api.delRole({ userId: _this.mainModel.vo.id, roleId: roleId }).then(function() {
                    LIB.Msg.info("删除角色成功！");
                    var index = -1;
                    _.each(_this.mainModel.vo.roleList, function(item, i) {
                        if (item.id == roleId) {
                            index = i;
                            return;
                        }
                    })
                    if (index != -1) {
                        _this.mainModel.vo.roleList.splice(index, 1);
                    }
                    _this.$dispatch("ev_RefreshFinshed", _this.mainModel.vo);

                });
            },
            //添加权限
            doAddRole: function() {
                this.selectModel.roleSelectModel.visible = true;
                this.selectModel.roleSelectModel.filterData ={compId : this.mainModel.vo.compId,attr1 : "1"};
            },
            //添加岗位
            doAddPosition: function() {
                this.selectModel.positionSelectModel.visible = true;
                //dataModel.mainModel.showPositionSelectModal = true;
            },
            //添加安全角色
            doAddHserole: function() {
                this.selectModel.hseroleSelectModel.visible = true;
                //dataModel.mainModel.showHseroleSelectModal = true;
            },
            beforeDoSave: function() {
                //对是否抽检人赋值
                this.mainModel.vo.isRandomPeople = this.mainModel.isRandomPeople ? '1' : '0';
                ///防止idcard为空字符创时的校验
                this.mainModel.vo.userDetail.idcard = this.mainModel.vo.userDetail.idcard == "" ? null : this.mainModel.vo.userDetail.idcard;

            },
            //保存时候用
            afterDoSave: function(param) {
                var _vo = dataModel.mainModel.vo;
                var _this = this;
                //判断是否含有上级领导id
                if (_this.mainModel.vo.leaderId) {
                    _.each(dataModel.mainModel.userList, function(item) {
                        if (_this.mainModel.vo.leaderId == item.id) {
                            _this.mainModel.vo.leader.username = item.name;
                        }
                    })
                }
                this.$api.get({ id: _this.mainModel.vo.id }).then(function(res) {
                    var data = res.data;
                    _.deepExtend(_this.mainModel.vo, data);
                });
            },
            convertPicPath: LIB.convertPicPath,
            doChangePsd:function(){
                this.resetPsd.show = true;
                this.resetPsd.title = "重置密码";
                this.resetPsd.id = this.mainModel.vo.id;
                this.$broadcast('ev_editReload_psd', this.mainModel.vo.mobile);
            },
            doPsdFinshed:function(data){
                // this.emitMainTableEvent("do_update_row_data", {value: data});
                this.resetPsd.show = false;
            },
            doAdd4Copy2: function () {
                this.copyModel.isNeedCopyRole = false;
                this.copyModel.isNeedCopyPosition = false;
                this.copyModel.isNeedCopyHse = false;
                this.copyModel.visible = true;
            },
            doSaveCopy: function () {
                this.$broadcast("ev_set_copy_parameter", this.copyModel.isNeedCopyRole, this.copyModel.isNeedCopyPosition, this.copyModel.isNeedCopyHse);
                this.copyModel.visible = false;
                this.doAdd4Copy();
            },
            buildSaveData: function () {
                var param = this.mainModel.vo;
                if (this.mainModel.action === 'copy') {
                    param.isNeedCopyRole = (this.copyModel.isNeedCopyRole ? 1 : 0);
                    param.isNeedCopyPosition = (this.copyModel.isNeedCopyPosition ? 1 : 0);
                    param.isNeedCopyHse = (this.copyModel.isNeedCopyHse ? 1 : 0);
                }
                return param;
            }
        },
        events: {
            "ev_set_copy_parameter": function (isNeedCopyRole,isNeedCopyPosition,isNeedCopyHse) {
                this.copyModel.isNeedCopyRole = isNeedCopyRole;
                this.copyModel.isNeedCopyPosition = isNeedCopyPosition;
                this.copyModel.isNeedCopyHse = isNeedCopyHse;
            }
        },
        init: function(){
            this.$api = api;
        },
        created: function () {
            _.last(this.tableModel.roleTableModel.columns).visible = this.hasAuth("grantRole");
            _.last(this.tableModel.positionTableModel.columns).visible = this.hasAuth("grantPosition");
            _.last(this.tableModel.hseRoleTableModel.columns).visible = this.hasAuth("grantHseRole");
        },

    });

    return detail;
});