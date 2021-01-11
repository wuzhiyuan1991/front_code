define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");
    var positionInventoryGroupFormModal = require("./dialog/positionInventoryGroupFormModal");
    var positionInventoryItemFormModal = require("./dialog/positionInventoryItemFormModal");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var positionSelectModal = require("componentsEx/selectTableModal/positionSelectModal");
    var deptSelectModal = require("componentsEx/selectTableModal/deptSelectModal");
    var signTableModal = require("./dialog/signTableModal");
    var taskTableModal = require("./dialog/taskTableModal");

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
            //责任对象1:岗位,2:部门
            type: '1',
            //
            year: null,
            //岗位安全清单任务
            positionInventoryTasks: [],
            //执行组
            positionInventoryGroups: [],
            //责任人
            users: [],
            positionId:null,//岗位id
            position:{id:"",name:""},
            cloudFiles: []
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
                "disable": LIB.formRuleMgr.require("状态"),
                "compId": [LIB.formRuleMgr.require("所属公司")],
                "orgId": [LIB.formRuleMgr.length(10)],
                // "formulateDate": [LIB.formRuleMgr.allowStrEmpty],
                "remark": [LIB.formRuleMgr.length(500)],
                // "status": [LIB.formRuleMgr.allowIntEmpty],
                "type": [LIB.formRuleMgr.require("责任对象类型")],
                "year": [LIB.formRuleMgr.require("时间范围")],
                users: [{required: true, type: 'array', message: "请选择责任人"}],
                "cloudFiles": [{required: true, type: "array", message: "请上传附件"}]

            }
        },
        tableModel: {
            positionInventoryGroupTableModel: LIB.Opts.extendDetailTableOpt({
                url: "positioninventory/positioninventorygroups/list/{curPage}/{pageSize}?criteria.orderValue.fieldName=orderNo&criteria.orderValue.orderType=0",
                columns: [
                    {
                        title: "工作项",
                        fieldName: "content"
                    },
                    {
                        title: "标准",
                        fieldName: "standard",
                        width: "350px"
                    },
                    {
                        title: "工作落实结果",
                        fieldName: "result",
                        width: "350px"
                    },
                    {
                        title: "分值",
                        fieldName: "score",
                        width: "100px"
                    },
                    {
                        title: "周期",
                        render: function (data) {
                            return LIB.getDataDic("isr_position_inventory_frequencyType", data.frequencyType);
                        },
                        width: "100px"
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
                        width: "200px"
                    },
                    {
                        title: "考核结束时间",
                        fieldName: "endDate",
                        width: "200px"
                    },
                    {
                        title: "完成时间",
                        fieldName: "completeDate",
                        width: "200px"
                    },
                    {
                        title: "考核任务状态",
                        render: function (data) {
                            return data.isComplete === '2' ? '<a href="javascript:;" data-action="VIEWCOMPLETE" style="color: blue;">已办</a>' : '未办'
                        },
                        event: true,
                        width: "150px"
                    }
                ]
            }
        },
        formModel: {
            positionInventoryGroupFormModel: {
                show: false,
                hiddenFields: ["positionInventoryId"],
                queryUrl: "positioninventory/{id}/positioninventorygroup/{positionInventoryGroupId}"
            },
            positionInventoryItemFormModel: {
                show: false,
                queryUrl: 'positioninventoryitem/{id}'
            }
        },
        selectModel: {
            userSelectModel: {
                visible: false,
                filterData: {orgId: null}
            },
            positionSelectModel: {
                visible: false,
                filterData: {orgId: null}
            },
            departmentSelectModel: {
                visible: false,
                filterData: {orgId: null}
            },
            signViewModel: {
                visible: false
            },
            taskViewModel: {
                visible: false
            }
        },
        completeList:completeList,
        groups: null,
        currentTaskList: null,
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
        checkedCompleteIndex: 0,
        checkedUserIndex: 0,
        userList: null,
        frequencyList: null,
        checkedFrequencyIndex: 0,
        uploadModel: {
            params: {
                recordId: null,
                dataType: 'GWQD0',
                fileType: 'GWQD'
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
            "positionInventoryGroupFormModal": positionInventoryGroupFormModal,
            "userSelectModal": userSelectModal,
            "positionInventoryItemFormModal": positionInventoryItemFormModal,
            "positionSelectModal": positionSelectModal,
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
            changeYear: function (year) {
                this.mainModel.vo.year = year;
            },
            onTaskClicked: function (item, e) {
                if(e.target.dataset && e.target.dataset.action === 'VIEWCOMPLETE') {
                    this.selectModel.taskViewModel.visible = true;
                    this.$refs.taskTableModal.init(item.id)
                }
            },
            onTypeChanged: function () {
                this.mainModel.vo.position = {id: "", name: ""};
                this.mainModel.vo.positionId = "";
                this.mainModel.vo.users = [];
            },
            doShowObjectModal: function () {
                if (this.mainModel.isReadOnly) {
                    return;
                }
                if (this.mainModel.vo.type === '1') {
                    this.selectModel.positionSelectModel.visible = true;
                    this.selectModel.positionSelectModel.filterData = {compId : this.mainModel.vo.compId};
                } else if (this.mainModel.vo.type === '2') {
                    this.selectModel.departmentSelectModel.visible = true;
                    this.selectModel.departmentSelectModel.filterData = {compId : this.mainModel.vo.compId};
                }
            },

            doSavePositions: function (rows) {
                this.mainModel.vo.position = rows[0];
                this.mainModel.vo.positionId = rows[0].id;
                this.mainModel.vo.users = [];

                var _this = this;
                var param = {};

                if (this.mainModel.vo.type === '1') {
                    param.posId = this.mainModel.vo.positionId;
                } else if (this.mainModel.vo.type === '2') {
                    param.orgId = this.mainModel.vo.positionId;
                }

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
            doShowUserSelectModal: function () {
                this.selectModel.userSelectModel.visible = true;
                var param;
                if (this.mainModel.vo.type === '1') {
                    param = {posId: this.mainModel.vo.positionId}
                } else if (this.mainModel.vo.type === '2') {
                    param = {orgId: this.mainModel.vo.positionId};
                }
                this.selectModel.userSelectModel.filterData = param;
            },
            doSaveUsers: function (selectedDatas) {
                this.mainModel.vo.users = _.map(selectedDatas, function (row) {
                    return {
                        id: row.id,
                        name: row.name
                    }
                });
            },


            _getGroupList: function () {
                var container = this.$els.container;
                var top = container.scrollTop;
                var _this = this;
                api.getGroupList({id: this.mainModel.vo.id}).then(function (res) {
                    var groups = _.map(res.data.PositionInventoryGroup, function (item) {
                        return {
                            id: item.id,
                            name: item.name,
                            orderNo: item.orderNo,
                            showInput: false,
                            keyWord: ""
                        }
                    });
                    var items = res.data.PositionInventoryItem;
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


            // ------------------ 分组 --------------------------------
            doShowPositionInventoryGroupFormModal4Update: function (param) {
                this.formModel.positionInventoryGroupFormModel.show = true;
                this.$refs.positioninventoryGroupFormModal.init("update", {id: this.mainModel.vo.id, positionInventoryGroupId: param.id});
            },
            doShowPositionInventoryGroupFormModal4Create: function (param) {
                this.formModel.positionInventoryGroupFormModel.show = true;
                this.$refs.positioninventoryGroupFormModal.init("create");
            },
            doSavePositionInventoryGroup: function (data) {
                if (data) {
                    var _this = this;
                    api.savePositionInventoryGroup({id: this.mainModel.vo.id}, data).then(function () {
                        _this._getGroupList();
                    });
                }
            },
            doUpdatePositionInventoryGroup: function (data) {
                if (data) {
                    var _this = this;
                    api.updatePositionInventoryGroup({id: this.mainModel.vo.id}, data).then(function () {
                        _this._getGroupList();
                    });
                }
            },
            doDeleteGroup: function (item) {
                var _this = this;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function () {
                        api.removePositionInventoryGroups({id: _this.mainModel.vo.id}, [{id: data.id}]).then(function () {
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
                api.movePositionInventoryGroups({id: this.mainModel.vo.id}, param).then(function () {
                    _this._getGroupList();
                });
            },

            // ----------------------- 项 ------------------------------
            doShowCommitmentItemFormModal4Create: function (group) {
                this._currentGroupId = group.id;
                this.formModel.positionInventoryItemFormModel.show = true;
                this.$refs.positioninventoryItemFormModal.init("create");
            },
            doShowCommitmentItemFormModal4Update: function (row) {
                this._currentGroupId = row.groupId;
                this.formModel.positionInventoryItemFormModel.show = true;
                this.$refs.positioninventoryItemFormModal.init("update", {id: row.id});
            },
            doSaveItem: function (data) {
                var _this = this;
                data.positionInventoryId = this.mainModel.vo.id;
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
            doTabClick: function (id) {
                this.activeTabId = id;
            },
            _getTaskList: function () {
                var _this = this;
                api.getTaskList({"positionInventory.id": this.mainModel.vo.id}).then(function (res) {
                    _this.allTaskList = res.data;
                    _this.currentTaskList = res.data;
                });

                this.checkedCompleteIndex = 0;
                this.checkedFrequencyIndex = 0;
                this.checkedUserIndex = 0;

                var userList = _.map(this.mainModel.vo.users, function (item) {
                    return {
                        id: item.id,
                        name: item.name
                    }
                });
                this.userList = [{id: '', name: '全部'}].concat(userList);

                this.frequencyList = [{id: '', name: '全部'}].concat(_.map(LIB.getDataDicList('isr_position_inventory_frequencyType'), function (item) {
                    return {
                        id: item.id,
                        name: item.value
                    }
                }));
            },
            _setCurrentTaskList: function () {
                var list = this.allTaskList;
                var u = this.userList[this.checkedUserIndex];
                var f = this.frequencyList[this.checkedFrequencyIndex];
                var c = this.completeList[this.checkedCompleteIndex];
                if (u.id) {
                    list = _.filter(list, "userId", u.id);
                }
                if (f.id) {
                    list = _.filter(list, "frequencyType", f.id);
                }
                if (c.id) {
                    list = _.filter(list, "isComplete", c.id)
                }
                this.currentTaskList = list;
            },
            doSelectFrequency: function (index) {
                this.checkedFrequencyIndex = index;
                this._setCurrentTaskList();
            },
            doSelectUser: function (index) {
                this.checkedUserIndex = index;
                this._setCurrentTaskList();
            },
            doSelectDone: function (index) {
                this.checkedCompleteIndex = index;
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

            // ----------------------  周期 --------------------------
            afterInitData: function () {
                var _this = this;
                this._getGroupList();
                if (this.mainModel.vo.status === '4')  {
                    this._getTaskList();
                }
                this.uploadModel.params.recordId = this.mainModel.vo.id;
                if (this.mainModel.vo.type === '2') {
                    this.mainModel.vo.positionId = this.mainModel.vo.orgId;
                    this.mainModel.vo.position = {
                        id: this.mainModel.vo.orgId,
                        name: this.getDataDic('org', this.mainModel.vo.orgId)['deptName']
                    };
                }
                api.listFile({recordId: this.mainModel.vo.id}).then(function (res) {
                    _this.mainModel.vo.cloudFiles = res.data;
                });
                if (this.mainTableRowStatus !== this.mainModel.vo.status) {
                    this.$dispatch("ev_dtUpdate");
                }
            },
            beforeInit: function (transferVO) {
                this.mainModel.vo.cloudFiles = [];
                this.groups = null;
                this.activeTabId = '1';
                this.checkedCompleteIndex = 0;
                this.checkedUserIndex = 0;
                this.checkedFrequencyIndex = 0;
                this.mainTableRowStatus = _.get(transferVO, "status", null); // bug 12755
            },
            afterInit: function () {
                var _this = this;
                var vo = this.mainModel.vo;
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
            buildSaveData: function () {
                var params = _.cloneDeep(this.mainModel.vo);
                if (params.formulateDate.length === 10) {
                    params.formulateDate += ' 00:00:00';
                }
                if (params.year.length === 4) {
                    params.year += '-01-01 00:00:00';
                }
                if (params.type === '2') {
                    params.orgId = params.positionId;
                    params.positionId = '';
                    params.position = {id: "", name: ""};
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
            doDelete: function() {
                if (this.beforeDoDelete() === false) {
                    return;
                }
                var _vo = {id:this.mainModel.vo.id};
                var _this = this;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function() {
                        _this.$api.remove(null, _vo).then(function() {
                            _this.afterDoDelete(_vo);
                            _this.$dispatch("ev_dtDelete");
                            LIB.Msg.info("删除成功");
                        });
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