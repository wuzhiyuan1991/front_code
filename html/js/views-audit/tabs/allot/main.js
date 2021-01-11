define(function(require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = require("text!./main.html");

    // 审核要素
    var newFactorVO = function() {
        return {
            code: '',
            name: '',
            parentId: '',
            parentName: '',
            elementType: '2'
        }
    };
    var dataModel = {
        mainModel: {
            isReadOnly: true,
            emptyRules: {}
        },
        treeModel: {
            data: [],
            selectedData: []
        },
        factorModel: {
            vo: newFactorVO(),
        },
        selectModel: {
            visible: false
        },
        groups: {
            children: [],
            checked: false,
            halfChecked: false,
        },
        mode: 'update',
        auditUserId: '',
        tabKey: '0',
        tableFiles: [],
        fileList: null,
        hzList: [
            {
                id: '1',
                value: '每日'
            },
            {
                id: '2',
                value: '每月'
            },
            {
                id: '3',
                value: '每季'
            },
            {
                id: '5',
                value: '每半年'
            },
            {
                id: '4',
                value: '每年'
            },
            {
                id: '6',
                value: '每周'
            },
            {
                id: '7',
                value: '无频次'
            }
        ],
        elementFiles: null,
        tableName: ''
    };
    var vm = LIB.VueEx.extend({
        template: tpl,
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.safetyAudit],
        data: function() {
            return dataModel;
        },
        computed: {
            updateMode: function () {
                return this.mode !== 'show';
            },
            showAKey: function () {
                return this.auditUserId === LIB.user.id && this.mode !== 'show';
            }
        },
        methods: {
            doPreview: function (f) {
                if (f.fileExt !== 'pdf') {
                    window.open('preview.html?id=' + f.fileId);
                    return;
                }
                window.open(f.ctxPath);
            },
            doFileClick: function (f) {
                window.open("/file/down/" + f.fileId);
            },
            displayHzName: function (hz) {
                var o = _.find(this.hzList, "id", hz);
                return _.get(o, "value", "");
            },
            doRefresh: function () {
                var select = this.treeModel.selectedData;
                if (_.isArray(select) && select.length > 0) {
                    this._queryFolderList(select[0].auditElementId, true);
                }
            },
            doChangeKey: function(k) {
                this.tabKey = k;
            },
            // 获取文件目录
            _queryFolderList: function (id, flag) {
                var _this = this;
                api.queryFolderList({auditElementId: id, type: 0}).then(function (res) {
                    var list = _.map(res.data, function (item) {
                        return {
                            name: item.name,
                            id: item.id,
                            orderNo: item.orderNo,
                            frequencyType: item.frequencyType,
                            auditElementId: item.auditElementId,
                            auditTableId: item.auditTableId,
                            files: null,
                            show: true
                        }
                    })
                    list = _.sortBy(list, function (item) {
                        return item.orderNo * 1
                    })
                    _this.fileList = list;

                    var ids = _.map(list, "id");
                    ids.push(id);
                    if (ids.length > 0) {
                        _this._queryFileList(ids, id);
                    }
                    if (flag) {
                        LIB.Msg.success("刷新成功");
                    }
                })
            },
            _queryFileList: function (ids, id) {
                var _this = this;
                var params = {
                    "criteria.strsValue": JSON.stringify({recordId: ids})
                }
                api.listFile(params).then(function (res) {
                    var data = _.filter(res.data, "dataType", "S5");
                    data = _.map(data, function (f) {
                        return {
                            fileId: f.id,
                            name: f.orginalName,
                            fileExt: f.ext,
                            recordId: f.recordId,
                            time: f.createDate,
                            ctxPath: f.ctxPath
                        }
                    })
                    data = _.groupBy(data, "recordId");
                    _.forEach(_this.fileList, function (item) {
                        item.files = data[item.id] || []
                    });
                    _this.elementFiles = data[id] || [];
                })
            },
            arrowIconType: function (list) {
                return list.show ? 'arrow-down-b' : 'arrow-right-b';
            },
            toggleFolder: function (list) {
                list.show = !list.show;
            },
            initCheckedData: function() {
                this.checkedIds = [];
            },
            setTreeData: function() {
                // 取两层数据
                function buildChildren(array) {
                    var res = [];
                    if (_.isArray(array)) {
                        array.forEach(function(item) {
                            res.push(_.assign(item, { children: null }))
                        })
                    }
                    return res;
                }
                var res = [];
                _.cloneDeep(this.allData).forEach(function(item) {
                    res.push(_.assign(item, { children: buildChildren(item.children) }));
                });
                // 设置树数据
                this.treeModel.data = res;
                var children = _.get(res, "[0].children") || [];

                // 设置默认树选中数据
                this.treeModel.selectedData = children.slice(0, 1);

                var id = _.get(children, "[0].id");
                var auditElementId = _.get(children, "[0].auditElementId");
                this._queryFolderList(auditElementId);

                var parentId = _.get(children, "[0].elementParentId");
                this.getGroupData(id, parentId);

                this.tabKey = '0';
                // // 设置默认树选中数据
                // this.treeModel.selectedData = res.slice(0, 1);
                // this.getGroupData(this.allData[0].id, this.allData[0].auditElementId);
            },
            _filterOwnData: function (items) {
                var userId = LIB.user.id;
                var data = _.filter(items, function (level1) {
                    level1.children = _.filter(level1.children, function (level2) {
                        level2.children = _.filter(level2.children, function (level3) {
                            level3.children = _.filter(level3.children, function (item) {
                                return _.get(item, "user.id") === userId;
                            });
                            return !!level3.children.length;
                        });
                        return !!level2.children.length;
                    });
                    return !!level1.children.length;
                });
                return data;
            },
            getAllData: function() {
                var _this = this;
                this.$api.getData({ id: this.tableId, types: [] }).then(function(data) {
                    // mode == assign ||  auditPlanOwnerId = 当前登录人  时逻辑不变
                    // mode == transfer(指派)时， 一键分配 不显示，  “审核人 ！=  当前登录人” 的数据不显示
                    if (_this.mode === 'transfer' && _this.auditUserId !== LIB.user.id) {
                        _this.allData = _this._filterOwnData(data.data);
                    } else {
                        _this.allData = data.data;
                    }
                    if (_this.allData.length > 0) {
                        _this.setTreeData();
                    }
                })
            },
            // 获取审核要素数据
            getGroupData: function(id, elementId) {
                this.lastElementId = id;

                var groups = this.allData.filter(function(item) {
                    return item.auditElementId === elementId;
                });

                this.groups = {
                    id: id,
                    children: this._setChildren(id, groups[0].children),
                    elementId: elementId
                };
            },
            _setChildren: function(id, items) {
                return _.filter(items, function (item) {
                    return item.id === id;
                })
            },
            // 设置checkbox选中状态
            changeCheckedValue: function(groups, isChecked) {
                function fillValue(array) {
                    if(!_.isArray(array)) {
                        return;
                    }
                    array.forEach(function(arr) {
                        arr.checked = isChecked;
                        arr.halfChecked = false;
                        arr.user = arr.user || {};
                        if (arr.children && arr.children.length) {
                            fillValue(arr.children)
                        }
                    })
                }
                fillValue(groups);
                return groups;
            },
            doTreeNodeClick: function(data) {
                var item = data.data;
                if (item.elementType !== '3') {
                    return;
                }

                if (item.id !== this.lastElementId) {

                    // this.tabKey = '0';
                    this.getGroupData(item.id, item.elementParentId);

                    this._queryFolderList(item.auditElementId);
                    this.lastElementId = item.id;
                }
            },
            findParent: function(parentId) {
                if (parentId === this.groups.elementId) {
                    return this.groups
                }
                var parentArr = this.groups.children.filter(function(item) {
                    return item.auditElement.id === parentId
                })
                if (parentArr.length > 0) {
                    return parentArr[0]
                } else {
                    return null;
                }
            },
            // 修改父级选择框状态
            changeParentCheckedStatus: function(item) {
                if (!item) return;
                var _this = this;

                function changeParent(parent) {
                    var checkedLength = 0,
                        halfCheckedLength = 0,
                        grand = null;
                    parent.children.forEach(function(arr) {
                        if (arr.checked) {
                            checkedLength++;
                        }
                        if (arr.halfChecked) {
                            halfCheckedLength++;
                        }

                    });
                    if (checkedLength === parent.children.length) {
                        parent.halfChecked = false;
                        parent.checked = true;
                    } else if (checkedLength > 0 || halfCheckedLength > 0) {
                        parent.halfChecked = true;
                        parent.checked = false;
                    } else {
                        parent.halfChecked = false;
                        parent.checked = false;
                    }
                    if (parent.elementParentId) {
                        grand = _this.findParent(parent.elementParentId);
                        if (grand) {
                            changeParent(grand);
                        }
                    }
                }
                changeParent(item);
            },
            doChange: function(item, parent) {
                item.halfChecked = false;
                if (item.children && item.children.length) {
                    this.changeCheckedValue(item.children, item.checked)
                }
                this.changeParentCheckedStatus(parent);
            },
            // 获取选中项id集合
            getCheckedIds: function(groups) {
                var ids = [];

                function getIds(array) {
                    array.forEach(function(arr) {
                        if (arr.checked) {
                            ids.push(arr.id)
                        }
                        if (arr.children && arr.children.length) {
                            getIds(arr.children)
                        }
                    })
                }
                getIds(groups);
                return ids;
            },
            chooseMemberClick: function() {

                this.checkedIds = this.getCheckedIds(this.groups.children);
                if (this.checkedIds.length === 0) {
                    LIB.Msg.info("请至少选择一个审核项");
                    return;
                }
                this.isAllotAll = false;
                this.selectModel.visible = true;
            },
            changeOwner: function(user) {
                var _this = this;

                function change(array) {
                    _.forEach(array, function(arr) {
                        if (!arr.halfChecked && !arr.checked && !_this.isAllotAll) {
                            return;
                        }
                        if (arr.children && arr.children.length) {
                            change(arr.children)
                        }
                        if (arr.checked || _this.isAllotAll) {
                            arr.user = user;
                            arr.checked = false;
                        }
                        arr.halfChecked = false;
                    });
                    // return array
                }
                if (this.isAllotAll) {
                    change(this.allData);
                } else {
                    change(this.groups.children);
                }
                // this.groups.children = change(this.groups.children)
                this.groups.checked = false;
                this.groups.halfChecked = false;

            },
            allInOne: function() {
                this.isAllotAll = true;
                this.selectModel.visible = true;
            },
            doSaveMember: function(selectedDatas) {
                var member = selectedDatas[0];
                var _this = this;
                if (this.isAllotAll) {
                    var planId = !_.isEmpty(this.allData) && this.allData[0].auditPlanId;
                    this.$api.allotAll({ ownerId: member.id, auditPlanId: planId }).then(function(data) {
                        _this.changeOwner(member);
                        LIB.Msg.info("分配成功");
                    })
                    return;
                }
                var _this = this;
                var params = [];
                this.checkedIds.forEach(function(t) {
                    params.push({
                        ownerId: member.id,
                        id: t
                    })
                })
                this.$api.batchOwner(params).then(function(data) {
                    _this.initCheckedData();
                    _this.changeOwner(member)
                })
            },
            showOwnerName: function(item) {
                if (item.user) {
                    return item.user.name
                } else {
                    return ''
                }
            },
            showOwnerComp: function(item) {
                if (item.user) {
                    return LIB.LIB_BASE.getDataDic("org", item.user.compId)['compName']
                } else {
                    return ''
                }
            },
            showOwnerOrg: function(item) {
                if (item.user) {
                    return LIB.LIB_BASE.getDataDic("org", item.user.orgId)['deptName']
                } else {
                    return ''
                }
            },
            _getPlanInfo: function () {
                var _this = this;
                api.getPlan({id: this.tableId}).then(function (res) {
                    _this.tableName = _.get(res, "data.auditTable.name", "要素标准安全体系");
                })
            }
        },
        ready: function() {
            this.$api = api;
            this.tableId = this.$route.query.id;
            this.mode = this.$route.query.mode;
            this.auditUserId = this.$route.query.auditPlanOwnerId;
            this.getAllData()
            this._getPlanInfo();
        }
    });

    return vm;
});
