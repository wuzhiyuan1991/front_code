define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");
    var riskAssessGroupFormModal = require("./dialog/riskAssessGroupFormModal");
    var riskAssessItemFormModal = require("./dialog/riskAssessItemFormModal");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var deptSelectModal = require("componentsEx/selectTableModal/deptSelectModal");
    var signTableModal = require("./dialog/signTableModal");
    var taskTableModal = require("./dialog/taskTableModal");

    //初始化数据模型
    var newVO = function () {
        return {
            id: null,
            //
            code: null,
            //禁用标识 0未禁用，1已禁用
            disable: "0",
            //所属公司id
            compId: null,
            //所属部门id
            orgId: null,
            //控制层级 1:班组级,2:工段级,3:车间级,4:厂级,5公司级
            controlRank: '1',
            //制定时间
            formulateDate: null,
            formulateOrgId: null,
            //额定完成时间
            ratedCompleteDate: null,
            //备注
            remark: null,
            //状态 1:制定中,2:已下发,3:已承诺,4:已发布,5:已取消
            status: '1',
            //年份
            year: null,
            //安全风险研判任务
            riskAssessTasks: [],
            //执行组
            riskAssessGroups: [],
            //责任人
            users: [],
            depts: [],
            cloudFiles: []
        }
    };
    var completeList = [
        {
            id: '',
            name: '全部'
        },
        {
            id: '2',
            name: '已办'
        },
        {
            id: '1',
            name: '未办'
        }
    ];
    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "",

            //验证规则
            rules: {
                "code": [LIB.formRuleMgr.require(""),
                    LIB.formRuleMgr.length(100)
                ],
                "disable": LIB.formRuleMgr.require("状态"),
                "compId": [LIB.formRuleMgr.require("所属公司")],
                "orgId": [LIB.formRuleMgr.length(10)],
                "controlRank": [ LIB.formRuleMgr.require("管控层级")],
                "formulateDate": [LIB.formRuleMgr.allowStrEmpty],
                "ratedCompleteDate": [LIB.formRuleMgr.require("额定完成时间")],
                "remark": [LIB.formRuleMgr.length(200)],
                "status": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
                "year": [LIB.formRuleMgr.require("时间范围")],
                depts: [{required: true, type: 'array', message: "请选择责任部门"}],
                users: [{required: true, type: 'array', message: "请选择责任人"}],
                "cloudFiles": [{required: true, type: "array", message: "请上传附件"}]
            }
        },
        tableModel: {
            riskAssessGroupTableModel: LIB.Opts.extendDetailTableOpt({
                url: "riskassess/riskassessgroups/list/{curPage}/{pageSize}?criteria.orderValue.fieldName=orderNo&criteria.orderValue.orderType=0",
                columns: [
                    {
                        title: "研判项",
                        fieldName: "content"
                    },
                    {
                        title: "标准",
                        fieldName: "standard",
                        width: "350px"
                    },
                    {
                        title: "落实结果",
                        fieldName: "result",
                        width: "350px"
                    }
                ]
            }),
            taskTableModel: {
                columns: [
                    {
                        title: "人员",
                        fieldName: "user.name"
                    },
                    {
                        title: "考核开始时间",
                        fieldName: "startDate",
                        width: "220px"
                    },
                    {
                        title: "考核结束时间",
                        fieldName: "endDate",
                        width: "220px"
                    },
                    {
                        title: "完成时间",
                        fieldName: "completeDate",
                        width: "220px"
                    },
                    {
                        title: "考核任务状态",
                        render: function (data) {
                            return data.isComplete === '2' ? '<a href="javascript:;" data-action="VIEWCOMPLETE" style="color: blue;">已办</a>' : '未办'
                        },
                        width: "100px",
                        event: true
                    },
                ]
            }
        },
        formModel: {
            riskAssessGroupFormModel: {
                show: false,
                hiddenFields: ["riskAssessId"],
                queryUrl: "riskassess/{id}/riskassessgroup/{riskAssessGroupId}"
            },
            riskAssessItemFormModel: {
                show: false,
                queryUrl: 'riskassessitem/{id}'
            }
        },
        selectModel: {
            userSelectModel: {
                visible: false,
                filterData: {orgId: null}
            },
            deptSelectModel: {
                visible: false,
                filterData: {compId: null}
            },
            signViewModel: {
                visible: false
            },
            taskViewModel: {
                visible: false
            }
        },
        groups: null,
        activeTabId: '1',
        tabs: [
            {
                id: '1',
                name: "明细内容"
            },
            {
                id: '2',
                name: '考核任务'
            }
        ],
        completeList: completeList,
        checkedCompleteIndex: 0,
        userList: null,
        checkedUserIndex: 0,
        departmentList: null,
        checkedDepartmentIndex: 0,
        currentTaskList: null,
        uploadModel: {
            params: {
                recordId: null,
                    dataType: 'FXYP0',
                    fileType: 'FXYP'
            },
            filters: {
                max_file_size: '10mb',
                    mime_types: [{ title: "files", extensions: "pdf,doc,docx,xls,xlsx,jpg,jpeg,png,ppt,pptx"}]
            }
        },
        images: []
    };
    //Vue组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *     el
     template
     components
     componentName
     props
     data
     computed
     watch
     methods
     _XXX                //内部方法
     doXXX                //事件响应方法
     beforeInit        //初始化之前回调
     afterInit            //初始化之后回调
     afterInitData        //请求 查询 接口后回调
     afterInitFileData  //请求 查询文件列表 接口后回调
     beforeDoSave        //请求 新增/更新 接口前回调，返回false时不进行保存操作
     afterFormValidate    //表单rule的校验通过后回调，，返回false时不进行保存操作
     buildSaveData        //请求 新增/更新 接口前回调，重新构造接口的参数
     afterDoSave        //请求 新增/更新 接口后回调
     beforeDoDelete        //请求 删除 接口前回调
     afterDoDelete        //请求 删除 接口后回调
     events
     vue组件声明周期方法
     init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
        template: tpl,
        components: {
            "riskAssessGroupFormModal": riskAssessGroupFormModal,
            "userSelectModal": userSelectModal,
            "riskAssessItemFormModal": riskAssessItemFormModal,
            "deptSelectModal": deptSelectModal,
            "signTableModal": signTableModal,
            "taskTableModal": taskTableModal
        },
        computed: {
            isDepartmentEmpty: function () {
                return _.isEmpty(this.mainModel.vo.depts);
            },
            isEditRel: function () {
                return this.mainModel.opType !== 'create';
            },
            isFormulate: function () {
                return this.mainModel.vo.status === '1';
            },
            toolColumn: function () {
                return this.isFormulate ? ['move', 'update', 'del'] : []
            },
            displayYearText: function () {
                var vo = this.mainModel.vo;
                var year = _.get(vo, "year", "");
                var yearText = year.substr(0, 4) + "年";
                return yearText;
            },
            displayFormulateDateText: function () {
                return this.mainModel.vo.formulateDate.substr(0, 10);
            }
        },
        data: function () {
            return dataModel;
        },
        filters: {
            itemFilter: function (value, k) {
                var _this = this;
                if (!k || _.isEmpty(value)) {
                    return value;
                }
                return _.filter(value, function (item) {
                    return _this.doItemFilter(item, k.trim());
                })
            }
        },
        methods: {
            newVO: newVO,
            toggleItemInput: function (tir, value) {
                tir.showInput = value;
                if (!value) {
                    tir.keyWord = '';
                    tir._keyWord = '';
                }
            },
            setFilterValue: function (val, index) {
                this.groups[index].keyWord = val;
            },
            doItemFilter: function (item, k) {
                if (item.content.indexOf(k) > -1) {
                    return true;
                }
                if (item.result && item.result.indexOf(k) > -1) {
                    return true;
                }
                if (item.standard && item.standard.indexOf(k) > -1) {
                    return true;
                }
                return false;
            },
            doShowSignModal: function () {
                this.selectModel.signViewModel.visible = true;
            },
            onTaskClicked: function (item, e) {
                if(e.target.dataset && e.target.dataset.action === 'VIEWCOMPLETE') {
                    this.selectModel.taskViewModel.visible = true;
                    this.$refs.taskTableModal.init(item.id)
                }
            },
            changeYear: function (year) {
                this.mainModel.vo.year = year;
            },
            doTabClick: function (id) {
                this.activeTabId = id;
            },
            changeRatedCompleteDate: function (time) {
                this.mainModel.vo.ratedCompleteDate = time;
            },
            doShowDepartmentSelectModal: function () {
                this.selectModel.deptSelectModel.filterData = {compId: this.mainModel.vo.compId};
                this.selectModel.deptSelectModel.visible = true;
            },
            doSaveBizOrgRels: function (rows) {
                var _this = this;
                this.mainModel.vo.depts = _.map(rows, function (row) {
                    return {
                        id: row.id,
                        name: row.name
                    }
                });
                var param = {
                    "criteria.strsValue": JSON.stringify({orgIds: _.pluck(rows, "id")})
                };
                api.getUsersByDepts(param).then(function (res) {
                    _this.mainModel.vo.users = _.map(res.data.list, function (row) {
                        return {
                            id: row.id,
                            name: row.name,
                            orgId: row.orgId
                        }
                    })
                })
            },
            doRemoveDepartment: function () {
                var ids = _.pluck(this.mainModel.vo.depts, "id");
                this.mainModel.vo.users = _.filter(this.mainModel.vo.users, function (item) {
                    return _.includes(ids, item.orgId)
                })
            },

            doShowUserSelectModal: function () {
                var orgIds = _.pluck(this.mainModel.vo.depts, "id");
                this.selectModel.userSelectModel.visible = true;
                this.selectModel.userSelectModel.filterData = {
                    "criteria.strsValue": {orgIds: orgIds}
                };
            },
            doSaveUsers: function (selectedDatas) {
                this.mainModel.vo.users = _.map(selectedDatas, function (row) {
                    return {
                        id: row.id,
                        name: row.name,
                        orgId: row.orgId
                    }
                });
            },

            // 获取分组数据
            _getGroupList: function () {
                var container = this.$els.container;
                var top = container.scrollTop;
                var _this = this;
                api.getGroupList({id: this.mainModel.vo.id}).then(function (res) {
                    var groups = _.map(res.data.RiskAssessGroup, function (item) {
                        return {
                            id: item.id,
                            name: item.name,
                            orderNo: item.orderNo,
                            showInput: false,
                            keyWord: ""
                        }
                    });
                    var items = res.data.RiskAssessItem;
                    _this._convertData(groups, items);
                    _this.$nextTick(function () {
                        container.scrollTop = top;
                    })
                })
            },
            _convertData: function (groups, items) {
                // 组按orderNo排序
                var _groups = _.sortBy(groups, function (group) {
                    return parseInt(group.orderNo);
                });
                // 项按stepId分组
                var _items = _.groupBy(items, "groupId");
                // 项按orderNo排序, 并将项添加到对应的组中
                _.forEach(_groups, function (group) {
                    group.items = _.sortBy(_items[group.id], function (item) {
                        return parseInt(item.orderNo);
                    });
                });

                this.groups = _groups;
            },

            // ----------------------- 分组 -------------------------------
            doShowRiskAssessGroupFormModal4Update: function (param) {
                this.formModel.riskAssessGroupFormModel.show = true;
                this.$refs.riskassessgroupFormModal.init("update", {id: this.mainModel.vo.id, riskAssessGroupId: param.id});
            },
            doShowRiskAssessGroupFormModal4Create: function (param) {
                this.formModel.riskAssessGroupFormModel.show = true;
                this.$refs.riskassessgroupFormModal.init("create");
            },
            doSaveRiskAssessGroup: function (data) {
                if (data) {
                    var _this = this;
                    api.saveRiskAssessGroup({id: this.mainModel.vo.id}, data).then(function () {
                        _this._getGroupList();
                    });
                }
            },
            doUpdateRiskAssessGroup: function (data) {
                if (data) {
                    var _this = this;
                    api.updateRiskAssessGroup({id: this.mainModel.vo.id}, data).then(function () {
                        _this._getGroupList();
                    });
                }
            },
            doDeleteGroup: function (data) {
                var _this = this;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function () {
                        api.removeRiskAssessGroups({id: _this.mainModel.vo.id}, [{id: data.id}]).then(function () {
                            _this._getGroupList();
                        });
                    }
                });

            },
            doMoveGroup: function (offset, data) {
                var _this = this;
                var param = {
                    id: data.id,
                    // commitmentId: this.mainModel.vo.id
                };
                _.set(param, "criteria.intValue.offset", offset);
                api.moveRiskAssessGroups({id: this.mainModel.vo.id}, param).then(function () {
                    _this._getGroupList();
                });
            },

            // -------------------- 项 ---------------------------------
            doShowCommitmentItemFormModal4Create: function (group) {
                this._currentGroupId = group.id;
                this.formModel.riskAssessItemFormModel.show = true;
                this.$refs.riskassessitemFormModal.init("create");
            },
            doShowCommitmentItemFormModal4Update: function (row) {
                this._currentGroupId = row.groupId;
                this.formModel.riskAssessItemFormModel.show = true;
                this.$refs.riskassessitemFormModal.init("update", {id: row.id});
            },
            doSaveItem: function (data) {
                var _this = this;
                data.riskAssessId = this.mainModel.vo.id;
                api.saveGroupItem({id: this._currentGroupId}, data).then(function (res) {
                    _this._getGroupList();
                })
            },
            doUpdateItem: function (data) {
                var _this = this;
                api.updateGroupItem({id: this._currentGroupId}, data).then(function (res) {
                    _this._getGroupList();
                })
            },
            doItemDelete: function (row) {
                var _this = this;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function () {
                        api.deleteGroupItem({id: row.groupId}, [{id: row.id}]).then(function () {
                            _this._getGroupList();
                        })
                    }
                });

            },
            doItemMove: function (data) {
                var offset = data.offset;
                var index = data.index;
                var item = data.item;
                if (index === 0 && offset === -1) {
                    return;
                }
                if (offset === 1 && index === (data.items.length - 1)) {
                    return;
                }
                var _this = this;
                var param = {
                    id: item.id
                };
                _.set(param, "criteria.intValue.offset", offset);
                api.orderGroupItem({id: item.groupId}, param).then(function () {
                    _this._getGroupList();
                    LIB.Msg.success("移动成功");
                });
            },


            doCancelPlan: function() {
                var _this = this;
                LIB.Modal.confirm({
                    title: '确定取消计划?',
                    onOk: function () {
                        api.cancelPlan({id: _this.mainModel.vo.id}).then(function () {
                            LIB.Msg.success("计划已取消");
                            _this.mainModel.vo.status = '5';
                            _this.$dispatch("ev_dtUpdate");
                        });
                    }
                });
            },
            doSignature: function () {
                var _this = this;
                api.sign({id: this.mainModel.vo.id}).then(function (res) {
                    LIB.Msg.success("已下发签名");
                    _this.mainModel.vo.status = '2';
                    _this.$dispatch("ev_dtUpdate");
                })
            },
            doPublish: function () {
                var _this = this;
                api.publish({id: this.mainModel.vo.id}).then(function (res) {
                    LIB.Msg.success("已发布");
                    _this.mainModel.vo.status = '4';
                    _this._getTaskList();
                    _this.$dispatch("ev_dtUpdate");
                })
            },
            _getTaskList: function () {
                var _this = this;
                api.getTaskList({"riskAssess.id": this.mainModel.vo.id}).then(function (res) {
                    _this.allTaskList = res.data;
                    _this.currentTaskList = res.data;
                });

                this.departmentList = [{id: null, name: '全部'}].concat(this.mainModel.vo.depts);
                this.checkedDepartmentIndex = 0;
                this.checkedCompleteIndex = 0;
                this.checkedUserIndex = 0;

                var userList = _.map(this.mainModel.vo.users, function (item) {
                    return {
                        id: item.id,
                        name: item.name,
                        orgId: item.orgId
                    }
                });

                this.userList = [{id: '', name: '全部'}].concat(userList);
            },
            _setCurrentTaskList: function () {
                var list = this.allTaskList;
                var d = this.departmentList[this.checkedDepartmentIndex];
                var c = this.completeList[this.checkedCompleteIndex];
                var u = this.userList[this.checkedUserIndex]
                if (d.id) {
                    list = _.filter(list, "orgId", d.id)
                }
                if (c.id) {
                    list = _.filter(list, "isComplete", c.id)
                }
                if (u.id) {
                    list = _.filter(list, "userId", u.id)
                }
                this.currentTaskList = list;
            },
            doSelectDepartment: function (index) {
                this.checkedDepartmentIndex = index;
                this._setCurrentTaskList();
            },
            doSelectComplete: function (index) {
                this.checkedCompleteIndex = index;
                this._setCurrentTaskList();
            },
            doSelectUser: function (index) {
                this.checkedUserIndex = index;
                this._setCurrentTaskList();
            },

            // ------------------- 文件 ---------------------
            uploadClicked: function () {
                this.$refs.uploader.$el.firstElementChild.click();
            },
            doUploadBefore: function () {
                LIB.globalLoader.show();
            },
            doUploadSuccess: function (param) {
                var con = param.rs.content;
                this.mainModel.vo.cloudFiles.push(con);
                LIB.globalLoader.hide();
            },
            onUploadComplete: function () {
                LIB.globalLoader.hide();
            },
            removeFile: function (fileId, index) {
                var _this = this;
                LIB.Modal.confirm({
                    title: "确定删除文件？",
                    onOk: function() {
                        api.deleteFile(null, [fileId]).then(function () {
                            _this.mainModel.vo.cloudFiles.splice(index, 1);
                        })
                    }
                });
            },
            doClickFile: function (index) {
                var files = this.mainModel.vo.cloudFiles;
                var file = files[index];
                var _this = this;
                var images;
                // 如果是图片
                if (_.includes(['png', 'jpg', 'jpeg'], file.ext)) {
                    images = _.filter(files, function (item) {
                        return _.includes(['png', 'jpg', 'jpeg'], item.ext)
                    });
                    this.images = _.map(images, function (content) {
                        return {
                            fileId: content.id,
                            name: content.orginalName,
                            fileExt: content.ext
                        }
                    });

                    setTimeout(function () {
                        _this.$refs.imageViewer.view(_.findIndex(images, "id", file.id));
                    }, 100);
                } else {
                    window.open("/file/down/" + file.id)
                }
            },

            // ---------------- 周期 ------------------------------------
            beforeInit: function (transferVO) {
                this.groups = null;
                this.mainModel.vo.cloudFiles = [];
                this.activeTabId = '1';
                this.checkedCompleteIndex = 0;
                this.checkedUserIndex = 0;
                this.checkedDepartmentIndex = 0;
                this.mainTableRowStatus = _.get(transferVO, "status", null); // bug 12755
            },
            afterInit: function () {
                var vo = this.mainModel.vo;
                var _this = this;
                if (this.mainModel.opType === 'create') {
                    vo.compId = LIB.user.compId;
                    vo.formulateDate = new Date().Format("yyyy-MM-dd");
                    vo.formulateOrgId = LIB.user.orgId;
                    vo.year = new Date().getFullYear() + '';
                    api.getUUID().then(function (res) {
                        vo.id = res.data;
                        _this.uploadModel.params.recordId = res.data;
                    })
                }
            },
            afterInitData: function () {
                var _this = this;
                this._getGroupList();
                this.uploadModel.params.recordId = this.mainModel.vo.id;
                this.mainModel.vo.depts = _.map(this.mainModel.vo.bizOrgRels, function (item) {
                    return {
                        id: item.orgId,
                        name: _this.getDataDic('org', item.orgId)['deptName']
                    }
                });
                if (this.mainModel.vo.status === '4')  {
                    this._getTaskList();
                }
                api.listFile({recordId: this.mainModel.vo.id}).then(function (res) {
                    _this.mainModel.vo.cloudFiles = res.data;
                });
                if (this.mainTableRowStatus !== this.mainModel.vo.status) {
                    this.$dispatch("ev_dtUpdate");
                }
            },
            buildSaveData: function () {
                var params = _.cloneDeep(this.mainModel.vo);
                if (params.formulateDate.length === 10) {
                    params.formulateDate += ' 00:00:00';
                }
                if (params.year.length === 4) {
                    params.year += '-01-01 00:00:00';
                }
                if (params.ratedCompleteDate.length === 5) {
                    params.ratedCompleteDate += ":00"
                }
                params = _.omit(params, "cloudFiles");
                return params
            },
            doSave: function() {

                if(this.mainModel.action === "copy") {
                    this.doSave4Copy();
                    return;
                }

                //当beforeDoSave方法明确返回false时,不继续执行doSave方法, 返回undefine和true都会执行后续方法
                if (this.beforeDoSave() === false) {
                    return;
                }

                var _this = this;
                var _data = this.mainModel;

                this.$refs.ruleform.validate(function(valid) {
                    if (valid) {
                        if (_this.afterFormValidate && !_this.afterFormValidate()) {
                            return;
                        }
                        var _vo = _this.buildSaveData() || _data.vo;
                        if (_data.opType === 'create') {
                            _this.$api.create(_vo).then(function(res) {
                                //清空数据
                                LIB.Msg.info("保存成功");
                                _data.vo.id = res.data.id;
                                _this._getResultCodeByRequest(res.data.id);
                                _this.afterDoSave({ type: "C" }, res.body);
                                _this.changeView("view");
                                _this.$dispatch("ev_dtCreate");
                                _this.storeBeforeEditVo();
                            });
                        } else {
                            _vo = _this._checkEmptyValue(_vo);
                            _this.$api.update(_vo).then(function(res) {
                                LIB.Msg.info("保存成功");
                                _this.afterDoSave({ type: "U" }, res.body);
                                _this.changeView("view");
                                _this.$dispatch("ev_dtUpdate");
                                _this.storeBeforeEditVo();
                            });
                        }
                    } else {
                        //console.error('doSave error submit!!');
                    }
                });
            },
        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return detail;
});