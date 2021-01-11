define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail.html");
    //弹窗选人
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var specialitySelectModal = require("./dialog/specialitySelectModal");
    var newVO = function () {
        return {
            //权限ID
            id: null,
            //岗位编码
            code: null,
            //岗位名称
            name: null,
            orgId: null,
            //
            compId: null,
            //是否禁用，0启用，1禁用
            disable: null,
            //是否是领导岗位 0：否  1：是
            isLead: null,
            //排序
            orderNo: null,
            //岗位类型 0普通岗位 1hse岗位
            postType: 0,
            //备注
            remarks: null,
            //修改日期
            modifyDate: null,
            //创建日期
            createDate: null,
            //用户
            users: [],
            disable: "0",
        }
    };

    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "",

            //验证规则
            rules: {
                // "code": [LIB.formRuleMgr.require("岗位编码"),
                //     LIB.formRuleMgr.length()
                // ],
                name: [{
                        required: true,
                        message: '请输入岗位名称'
                    },
                    LIB.formRuleMgr.length(20, 1)
                    //{ min: 1, max: 20, message: '长度在 1 到 20 个字符'}
                ],
                compId: [{
                    required: true,
                    message: '请选择所属公司'
                }, ],
                orgId: [{
                    required: true,
                    message: '请选择所属部门'
                }]
            }
            //	        emptyRules:{}
        },
        tableModel: {
            userTableModel: {
                url: "position/users/list/{curPage}/{pageSize}",
                columns: [{
                        // title : "名称",
                        // fieldName : "name"
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
                    {
                        title: "所属部门",
                        fieldType: "custom",
                        render: function (data) {
                            if (data.orgId) {
                                return LIB.getDataDic("org", data.orgId)["deptName"];
                            }
                        },
                        keywordFilterName: "criteria.strValue.keyWordValue_org"
                    },
                    {
                        title: "手机",
                        fieldName: "mobile",
                        keywordFilterName: "criteria.strValue.keyWordValue_mobile"
                    },
                    {
                        title: "",
                        fieldType: "tool",
                        toolType: "del"
                    }
                ]
            },
            specialityTableTableModel: {
                useEquipmentSpecialityPositionUserToReform: false,
                url: "position/speciality/list/{curPage}/{pageSize}",
                columns: [{
                        title: "专业",
                        fieldName: "name",
                        keywordFilterName: "criteria.strValue.keyWordValue_mobile"
                    },
                    {
                        title: "",
                        fieldType: "tool",
                        toolType: "del"
                    }
                ]
            }
        },
        formModel: {},
        selectModel: {
            userSelectModel: {
                visible: false
            },
            specialitySelectModel: {
                visible: false
            }
        },
        copyModel: {
            visible: false,
            title: "复制",
            isNeedCopyUser: false
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
            "specialitySelectModal": specialitySelectModal,

        },
        data: function () {
            return dataModel;
        },
        methods: {
            newVO: newVO,
            doShowUserSelectModel: function () {
                this.selectModel.userSelectModel.visible = true;
            },
            doSaveUsers: function (selectedDatas) {
                if (selectedDatas) {
                    dataModel.mainModel.vo.users = selectedDatas;
                    var param = _.map(selectedDatas, function (data) {
                        return {
                            id: data.id
                        }
                    });
                    var _this = this;
                    api.saveUsers({
                        id: dataModel.mainModel.vo.id
                    }, param).then(function () {
                        _this.refreshTableData(_this.$refs.userTable);
                    });
                }
            },
            filterPositionUserToReform: function (typoWord) {
                if (!typoWord || !typoWord.length) return this.$refs.specialityTable.doRefresh();
                // console.log(data)
                var filterAfter = []
                this.$refs.specialityTable.values && this.$refs.specialityTable.values.forEach(function (row) {
                    row.name.indexOf(typoWord) !== -1 ? filterAfter.push(row) : null
                })
                this.$refs.specialityTable.values = filterAfter
            },
            doRemoveUsers: function (item) {
                var _this = this;
                var data = item.entry.data;
                api.removeUsers({
                    id: this.mainModel.vo.id
                }, [{
                    id: data.id
                }]).then(function (res) {
                    LIB.Msg.info("删除员工成功！");
                    _this.$refs.userTable.doRefresh();
                });
            },
            doShowSpecialitySelectModel: function () {
                this.selectModel.specialitySelectModel.visible = true;
            },
            doSaveSpeciality: function (selectedDatas) {
                if (selectedDatas) {
                    dataModel.mainModel.vo.specialitys = selectedDatas;
                    var param = _.map(selectedDatas, function (data) {
                        return {
                            id: data.id
                        }
                    });
                    var _this = this;
                    api.saveSpeciality({
                        id: dataModel.mainModel.vo.id
                    }, param).then(function () {
                        _this.refreshTableData(_this.$refs.specialityTable);
                    });
                }
            },
            doRemoveSpeciality: function (item) {
                var _this = this;
                var data = item.entry.data;
                api.removeSpeciality({
                    id: this.mainModel.vo.id
                }, [{
                    id: data.id
                }]).then(function (res) {
                    LIB.Msg.info("删除专业成功！");
                    _this.$refs.specialityTable.doRefresh();
                });
            },
            afterInitData: function () {
                if (this.mainModel.action === 'copy') {
                    this.mainModel.vo.name += "（复制）";
                    if (!this.copyModel.isNeedCopyUser) {
                        return;
                    }
                }
                this.$refs.userTable.doQuery({
                    id: this.mainModel.vo.id
                });
                this.$refs.specialityTable.doQuery({
                    id: this.mainModel.vo.id
                });
            },
            beforeInit: function () {
                this.$refs.userTable.doClearData();
                this.$refs.specialityTable && this.$refs.specialityTable.doClearData();
            },
            doAdd4Copy2: function () {
                this.copyModel.isNeedCopyUser = false;
                this.copyModel.visible = true;
            },
            doSaveCopy: function () {
                this.$broadcast("ev_set_copy_parameter", this.copyModel.isNeedCopyUser);
                this.copyModel.visible = false;
                this.doAdd4Copy();
            },
            buildSaveData: function () {
                var param = this.mainModel.vo;
                if (this.mainModel.action === 'copy') {
                    param.isNeedCopyUser = (this.copyModel.isNeedCopyUser ? 1 : 0)
                }
                return param;
            }
        },
        events: {
            "ev_set_copy_parameter": function (isNeedCopyUser) {
                this.copyModel.isNeedCopyUser = isNeedCopyUser;
            }
        },
        init: function () {
            this.$api = api;
        },
        created: function () {
            this.tableModel.specialityTableTableModel.useEquipmentSpecialityPositionUserToReform = LIB.getBusinessSetStateByNamePath("poolGovern.useEquipmentSpecialityPositionUserToReform")
        }
    });

    return detail;
});