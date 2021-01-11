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
        auditUserId: ''
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
                return this.mode !== 'show';
            }
        },
        methods: {
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
                // 设置默认树选中数据
                this.treeModel.selectedData = res.slice(0, 1);
                this.getGroupData(this.allData[0].id, this.allData[0].auditElementId);
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
                this.$api.getData({ id: this.tableId, types: []}).then(function(data) {
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
                this.lastElementId = elementId;
                var groups = this.allData.filter(function(item) {
                    return item.id === id;
                })
                this.groups = {
                    checked: false,
                    halfChecked: false,
                    id: id,
                    children: this.changeCheckedValue(groups[0].children, false),
                    elementId: elementId
                };
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
                data = data.data;
                if (data.elementType === '1') {
                    if (data.auditElementId !== this.lastElementId) {
                        this.factorModel.vo = _.deepExtend({}, data);
                        this.getGroupData(data.id, data.auditElementId);
                    }
                    this.doContentScrollTo(0);

                } else {
                    if (data.elementParentId !== this.lastElementId) {
                        var parent = this.allData.filter(function(item) {
                            return item.auditElementId === data.elementParentId;
                        })
                        this.getGroupData(parent[0].id, data.elementParentId);
                        this.doContentScrollTo(0);

                    } else {
                        var top = document.getElementById(data.id).offsetTop;
                        this.doContentScrollTo(top);

                    }
                }
                this.initCheckedData();
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
        },
        ready: function() {
            this.$api = api;
            this.tableId = this.$route.query.id;
            this.mode = this.$route.query.mode;
            this.auditUserId = this.$route.query.auditPlanOwnerId;
            this.getAllData()
        }
    });

    return vm;
});
