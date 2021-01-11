define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");
    var commitmentGroupFormModal = require("./dialog/commitmentGroupFormModal");
    var commitmentItemFormModal = require("./dialog/commitmentItemFormModal");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var deptSelectModal = require("componentsEx/selectTableModal/deptSelectModal");
    var signTableModal = require("./dialog/signTableModal");
    var taskTableModal = require("./dialog/taskTableModal");

    var halfYearList = [
        {
            id: '1',
            value: '上半年'
        },
        {
            id: '2',
            value: '下半年'
        }
    ];

    var quarterList = [
        {
            id: '1',
            value: '第一季度'
        },
        {
            id: '2',
            value: '第二季度'
        },
        {
            id: '3',
            value: '第三季度'
        },
        {
            id: '4',
            value: '第四季度'
        }
    ];
    var currentYear = new Date().getFullYear() + '';

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

    //初始化数据模型
    var newVO = function () {
        return {
            id: null,
            //
            code: null,
            //承诺书名称
            name: null,
            //禁用标识 0未禁用，1已禁用
            disable: "0",
            //所属公司id
            compId: null,
            //所属部门id
            orgId: null,
            //制定时间
            formulateDate: null,
            formulateOrgId: null,
            //备注
            remark: null,
            //状态 1:制定中,2:已下发,3:已承诺,4:已发布,5:已取消
            status: '1',
            //承诺书类别(待定)
            type: null,
            //设置 type: 1:年，2:半年, 3:季度  halfYear: 1: 上半年, 2: 下半年 quarter： 1.第一季度 2： 第二季度 3：第三季度 4：第四季度
            commitmentSetting: {id:null,type: '1', year: currentYear, halfYear: '1', quarter: '1', startDate: null, endDate: null},
            //安全承诺书任务
            commitmentTasks: [],
            //执行组
            commitmentGroups: [],
            //责任人
            users: [],
            // 责任部门
            // bizOrgRels: [],
            depts: [],
            cloudFiles: [],
            uploadFiles:[],
            delFiles:[],
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
                "code": [LIB.formRuleMgr.require(""),
                    LIB.formRuleMgr.length(100)
                ],
                "name": [LIB.formRuleMgr.require("承诺书名称"), LIB.formRuleMgr.length(100)],
                "disable": LIB.formRuleMgr.require("状态"),
                "compId": [LIB.formRuleMgr.require("所属公司")],
                "orgId": [LIB.formRuleMgr.length(10)],
                "formulateDate": [LIB.formRuleMgr.allowStrEmpty],
                "remark": [LIB.formRuleMgr.length(200)],
                "status": [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
                "type": LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
                "commitmentSetting.type": [LIB.formRuleMgr.require("时间计划")],
                "commitmentSetting.year": [LIB.formRuleMgr.require("时间范围")],
                depts: [{required: true, type: 'array', message: "请选择责任部门"}],
                users: [{required: true, type: 'array', message: "请选择责任人"}],
                "cloudFiles": [{required: true, type: "array", message: "请上传附件"}]
            }
        },

        tableModel: {
            commitmentGroupTableModel: LIB.Opts.extendDetailTableOpt({
                url: "commitment/commitmentgroups/list/{curPage}/{pageSize}?criteria.orderValue.fieldName=orderNo&criteria.orderValue.orderType=0",
                columns: [
                    {
                        title: "量化考核内容",
                        fieldName: "content",
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    },
                    {
                        title: "考核标准",
                        fieldName: "standard",
                        width: "360px",
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    },
                    {
                        title: "考核落实结果",
                        fieldName: "result",
                        keywordFilterName: "criteria.strValue.keyWordValue_name",
                        width: "360px"
                    },
                    {
                        title: "分值",
                        fieldName: "score",
                        width: "80px",
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    }
                ]
            }),
            taskTableModel: {
                columns: [
                    {
                        title: "部门",
                        render: function (data) {
                            return LIB.getDataDic("org", data.orgId)['deptName']
                        },
                        width: "250px"
                    },
                    {
                        title: "岗位",
                        render: function (data) {
                            return _.pluck(data.positions, "name").join("、");
                        }
                    },
                    {
                        title: "人员",
                        fieldName: "user.name",
                        width: "150px"
                    },
                    {
                        title: "考核任务状态",
                        render: function (data) {
                            return data.isComplete === '2' ? '<a href="javascript:;" data-action="VIEWCOMPLETE" style="color: blue;">已办</a>' : '未办'
                        },
                        width: "100px",
                        event: true
                    },
                    {
                        title: "完成时间",
                        width: "150px",
                        fieldName: "completeDate"
                    }
                ]
            }
        },
        formModel: {
            commitmentGroupFormModel: {
                show: false,
                queryUrl: "commitment/{id}/commitmentgroup/{commitmentGroupId}"
            },
            commitmentItemFormModel: {
                show: false,
                queryUrl: 'commitmentitem/{id}'
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
        halfYearList: halfYearList,
        quarterList: quarterList,
        groups: null, // 分组
        currentTaskList: null,
        departments: null,
        checkedDepartmentIndex: 0,
        completeList: completeList,
        checkedDoneIndex: 0,
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
        activeTabId: '1',
        uploadModel: {
            params: {
                recordId: null,
                dataType: 'AQCN0',
                fileType: 'AQCN'
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{ title: "files", extensions: "pdf,doc,docx,xls,xlsx,jpg,jpeg,png,ppt,pptx"}]
            }
        },
        images: [],
        totalScore: 0
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
            "commitmentgroupFormModal": commitmentGroupFormModal,
            "commitmentItemFormModal": commitmentItemFormModal,
            "userSelectModal": userSelectModal,
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
                var type = _.get(vo, "commitmentSetting.type", "1");
                var year = _.get(vo, "commitmentSetting.year", "");
                var halfYear = _.get(vo, "commitmentSetting.halfYear", "1");
                var quarter = _.get(vo, "commitmentSetting.quarter", "1");
                var halfMap = {
                    "1": "上半年",
                    "2": "下半年"
                };
                var quarterMap = {
                    "1": "第一季度",
                    "2": "第二季度",
                    "3": "第三季度",
                    "4": "第四季度"
                };
                var yearText = year.substr(0, 4) + "年";
                if (type === '1') {
                    return yearText;
                } else if (type === '2') {
                    return yearText + halfMap[halfYear];
                } else if (type === '3') {
                    return yearText + quarterMap[quarter];
                }

                return "";
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
            doTabClick: function (id) {
                this.activeTabId = id;
            },
            changeYear: function (year) {
                this.mainModel.vo.commitmentSetting.year = year;
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
                    var groups = _.map(res.data.CommitmentGroup, function (item) {
                        return {
                            id: item.id,
                            name: item.name,
                            orderNo: item.orderNo,
                            showInput: false,
                            keyWord: ""
                        }
                    });
                    var items = res.data.CommitmentItem;
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
                this._calculateTotalScore();
            },
            _calculateTotalScore: function () {
                var total = 0;
                _.forEach(this.groups, function (group) {
                    _.forEach(group.items, function (item) {
                        total = total + (Number(item.score) || 0)
                    })
                });
                this.totalScore = total;
            },

            // -------------- 分组 ----------------------------
            doShowCommitmentGroupFormModal4Update: function (param) {
                this.formModel.commitmentGroupFormModel.show = true;
                this.$refs.commitmentgroupFormModal.init("update", {id: this.mainModel.vo.id, commitmentGroupId: param.id});
            },
            doShowCommitmentGroupFormModal4Create: function (param) {
                this.formModel.commitmentGroupFormModel.show = true;
                this.$refs.commitmentgroupFormModal.init("create");
            },
            doSaveCommitmentGroup: function (data) {
                if (data) {
                    var _this = this;
                    api.saveCommitmentGroup({id: this.mainModel.vo.id}, data).then(function () {
                        _this._getGroupList();
                    });
                }
            },
            doUpdateCommitmentGroup: function (data) {
                if (data) {
                    var _this = this;
                    api.updateCommitmentGroup({id: this.mainModel.vo.id}, data).then(function () {
                        _this._getGroupList();
                    });
                }
            },
            doDeleteGroup: function (data) {
                var _this = this;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function () {
                        api.removeCommitmentGroups({id: _this.mainModel.vo.id}, [{id: data.id}]).then(function () {
                            _this._getGroupList();
                        });
                    }
                });

            },
            doMoveGroup: function (offset, data) {
                var _this = this;
                var param = {
                    id: data.id,
                    commitmentId: this.mainModel.vo.id
                };
                _.set(param, "criteria.intValue.offset", offset);
                api.moveCommitmentGroups({id: this.mainModel.vo.id}, param).then(function () {
                    _this._getGroupList();
                });
            },

            // ----------------- 项 ----------------------------
            doShowCommitmentItemFormModal4Create: function (group) {
                this._currentGroupId = group.id;
                this.formModel.commitmentItemFormModel.show = true;
                this.$refs.commitmentItemFormModal.init("create");
            },
            doShowCommitmentItemFormModal4Update: function (row) {
                this._currentGroupId = row.groupId;
                this.formModel.commitmentItemFormModel.show = true;
                this.$refs.commitmentItemFormModal.init("update", {id: row.id});
            },
            doSaveItem: function (data) {
                var _this = this;
                data.commitmentId = this.mainModel.vo.id;
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
                api.deleteGroupItem({id: row.groupId}, [{id: row.id}]).then(function () {
                    _this._getGroupList();
                })
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
                    _this.$dispatch("ev_dtUpdate");
                    _this._getTaskList();
                })
            },
            _getTaskList: function () {
                var _this = this;
                api.getTaskList({"commitment.id": this.mainModel.vo.id}).then(function (res) {
                    _this.allTaskList = res.data;
                    _this.currentTaskList = res.data;
                });

                this.departments = [{id: null, name: '全部'}].concat(this.mainModel.vo.depts);
                this.checkedDepartmentIndex = 0;
                this.checkedDoneIndex = 0;
            },
            _setCurrentTaskList: function () {
                var list = this.allTaskList;
                var d = this.departments[this.checkedDepartmentIndex];
                var c = this.completeList[this.checkedDoneIndex];
                if (d.id) {
                    list = _.filter(list, "orgId", d.id)
                }
                if (c.id) {
                    list = _.filter(list, "isComplete", c.id)
                }
                this.currentTaskList = list;
            },
            doSelectDepartment: function (index) {
                this.checkedDepartmentIndex = index;
                this._setCurrentTaskList();
            },
            doSelectDone: function (index) {
                this.checkedDoneIndex = index;
                this._setCurrentTaskList();
            },


            // ------------------- 文件 ---------------------
            uploadClicked: function () {
                this.$refs.uploader.$el.firstElementChild.click();
            },
            doUploadBefore: function () {
                // LIB.globalLoader.show();
            },
            doUpload:function(up, files){//應為采用非自动上传
                var file = files[0];
                this.mainModel.vo.cloudFiles.push({
                    id:null,
                    orginalName:file.name
                })

            },
            doUploadSuccess: function (param) {
                var con = param.rs.content;
                this.mainModel.vo.cloudFiles.pop();
                this.mainModel.vo.cloudFiles.push(con);
                LIB.globalLoader.hide();

            },
            onUploadComplete: function () {
                LIB.globalLoader.hide();
                this.uploadComplete()
            },
            afterDoEdit:function(){
                this.mainModel.vo.delFiles=[];
                this.mainModel.vo.uploadFiles=[];
            },
            removeFile: function (fileId, index) {
                var _this = this;
                LIB.Modal.confirm({
                    title: "确定删除文件？",
                    onOk: function() {
                        var deleteFile=_this.mainModel.vo.cloudFiles.splice(index, 1)[0];
                        if(deleteFile.id){
                            _this.mainModel.vo.delFiles.push(deleteFile.id);
                        }
                        _this.$refs.uploader.fileUploader.splice(index, 1);
                    }
                });
            },
            doClickFile: function (index) {
                var files = this.mainModel.vo.cloudFiles;
                var file = files[index];
                var _this = this;
                var images;

                if(!this.mainModel.isReadOnly) return ;

                // 如果是图片
                if (_.includes(['png', 'jpg', 'jpeg'], file.ext)) {
                    images = _.filter(files, function (item) {
                        return _.includes(['png', 'jpg', 'jpeg'], item.ext)
                    });
                    this.images = _.map(images, function (content) {
                        return LIB.convertFileData(content);
                    });

                    setTimeout(function () {
                        _this.$refs.imageViewer.view(_.findIndex(images, "id", file.id));
                    }, 100);
                } else {
                    window.open(LIB.convertFilePath(LIB.convertFileData(file)));
                }
            },

            // ----------------- 周期 ---------------
            beforeInit: function (transferVO) {
                this.groups = null;
                this.activeTabId = '1';
                this.checkedDepartmentIndex = 0;
                this.checkedDoneIndex = 0;
                this.mainModel.vo.cloudFiles = [];
                this.mainTableRowStatus = _.get(transferVO, "status", null); // bug 12755
            },
            afterInit: function () {
                var vo = this.mainModel.vo;
                var _this = this;
                if (this.mainModel.opType === 'create') {
                    vo.compId = LIB.user.compId;
                    vo.formulateDate = new Date().Format("yyyy-MM-dd");
                    vo.formulateOrgId = LIB.user.orgId;
                    api.getUUID().then(function (res) {
                        vo.id = res.data;
                        _this.uploadModel.params.recordId = res.data;
                    })
                }
            },
            afterInitData: function () {
                this._getGroupList();
                var _this = this;
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
                })

                if (this.mainTableRowStatus !== this.mainModel.vo.status) {
                    this.$dispatch("ev_dtUpdate");
                }
            },

            uploadComplete:function () {
                var _this = this;
                var _data = this.mainModel;
                var filesList = _this.mainModel.vo.cloudFiles;

                var _vo = _this.buildSaveData() || _data.vo;
                if (_data.opType === 'create') {
                    setTimeout(function() {
                        _this.$api.create(_vo).then(function (res) {
                            //清空数据
                            LIB.Msg.info("保存成功");
                            _data.vo.id = res.data.id;
                            _this.initData({id: res.data.id});
                            _this.afterDoSave({type: "C"}, res.body);
                            _this.changeView("view");
                            _this.$dispatch("ev_dtCreate");
                            _this.storeBeforeEditVo();
                            _this.mainModel.vo.cloudFiles = filesList;

                            if (_this.mainModel.vo.delFiles.length > 0) {
                                setTimeout(function () {
                                    api.deleteFile(null, _this.mainModel.vo.delFiles)
                                }, 300)
                            }
                        });
                    }, 300);
                }else if (_data.opType === 'update') {
                    _vo = _this._checkEmptyValue(_vo);
                    setTimeout(function() {
                        _this.$api.update(_vo).then(function(res) {
                            LIB.Msg.info("保存成功");
                            _this.afterDoSave({ type: "U" }, res.body);
                            _this.changeView("view");
                            _this.$dispatch("ev_dtUpdate");
                            _this.storeBeforeEditVo();
                            if( _this.mainModel.vo.delFiles.length > 0){
                                setTimeout(function () {
                                    api.deleteFile(null, _this.mainModel.vo.delFiles)
                                },300)
                            }
                        });
                    }, 300);
                }
            },

            buildSaveData: function () {
                var params = _.cloneDeep(this.mainModel.vo);
                if (params.formulateDate.length === 10) {
                    params.formulateDate += ' 00:00:00';
                }
                if (params.commitmentSetting.year.length === 4) {
                    params.commitmentSetting.year += '-01-01 00:00:00';
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
                this.$refs.ruleform.validate(function(valid) {
                    if (valid) {
                        if (_this.afterFormValidate && !_this.afterFormValidate()) {
                            return;
                        };
                        if(_this.$refs.uploader.fileUploader.files.length > 0) {
                            _this.$broadcast("doUploadStart");//向上传播，调用上传附件的方法
                        }else {
                            _this.uploadComplete();
                        }
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