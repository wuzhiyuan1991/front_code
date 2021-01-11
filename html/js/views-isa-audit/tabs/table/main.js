define(function(require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = require("text!./main.html");

    // 审核要素分组
    var newFactorVO = function() {
        return {
            code: '',
            name: '',
            //weight: '',
            type: '',
            elementType: '1'
        }
    };
    // 审核要素
    var newFactorGroupVO = function() {
        return {
            code: '',
            name: '',
            parentId: '',
            auditElement: {
                name: ''
            },
            elementType: '3'
        }
    };
    // 审核项分组
    var newItemGroupVO = function() {
        return {
            code: '',
            name: '',
            parentId: '',
            elementType: '5'
        }
    };
    // 审核项
    var newItemVO = function() {
        return {
            code: '',
            name: '',
            remark: '',
            score: '',
            auditCriterion: '',
            parentId: '',
            elementType: '10'
        }
    };
    var dataModel = {
        mainModel: {
            isReadOnly: true,
            emptyRules: {}
        },
        // 显示vo
        factorVo: {},
        factorGroupVo: {},
        // 表单vo
        factorModel: {
            vo: newFactorVO(),
            rules: {
                "name": [
                    LIB.formRuleMgr.require("要素名称"),
                    LIB.formRuleMgr.length(50),
                ],
                //"weight": [
                //    LIB.formRuleMgr.require("权重"),
                //    {type:'integer', min:1, max: 100, message: '请输入1-100之间的整数'},
                //    {
                //        validator: function(rule, value, callback) {
                //            var r = /^[0-9]*[1-9][0-9]*$/g;
                //            var isNegative = r.test(value);
                //            return isNegative ? callback() : callback(new Error("请输入1-100之间的整数"));
                //        }
                //    }
                //]
            }
        },
        factorGroupModel: {
            vo: newFactorGroupVO(),
            rules: {
                "name": [
                    LIB.formRuleMgr.require("要素分组名称"),
                    LIB.formRuleMgr.length()
                ]
            }
        },
        itemGroupModel: {
            vo: newItemGroupVO(),
            rules: {
                "name": [
                    LIB.formRuleMgr.require("分组名称"),
                    LIB.formRuleMgr.length()
                ]
            }
        },
        itemModel: {
            vo: newItemVO(),
            criterionList: [
                { id: "1", name: "打分项" },
                { id: "5", name: "加分项" },
                { id: "10", name: "减分项" },
                { id: "15", name: "否决项" },
            ],
            rules: {
                "name": [
                    LIB.formRuleMgr.require("审核项内容"),
                    LIB.formRuleMgr.length(500, 1)
                ],
                "score": [
                    LIB.formRuleMgr.require("分值"),
                    LIB.formRuleMgr.length(),
                    {
                        required: true,
                        validator: function (rule, value, callback) {
                            if (dataModel.itemModel.vo.auditCriterion != 15) {
                                if (value <= 0) {
                                    return callback(new Error("请填写大于0的数"));
                                } else if (!value) {
                                    return callback(new Error("请输入分值"));
                                } else{
                                    return callback();
                                }
                            }
                        }
                    }
                ],
                "auditCriterion": [
                    LIB.formRuleMgr.require("评分标准"),
                    LIB.formRuleMgr.length()
                ]
            },
        },
        treeModel: {
            data: [],
            selectedData: []
        },
        displayModel: {
            showRight: 'factor',
            // 审核表名称
            auditTableName: '',
            // 是否显示审核分组
            showItemInfo: true,
            factorModalVisible: false,
            factorGroupModalVisible: false,
            itemGroupModalVisible: false,
            itemModalVisible: false
        },
        // factor 要素; checkItem 检查项
        showRight: 'factor',
        groups: [],
        auditTableName: '',
        showItemInfo: true,
        usedWeight: 0
    };
    var vm = LIB.VueEx.extend({
        template: tpl,
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        data: function() {
            return dataModel;
        },
        computed: {
            //displayWeight: function() {
            //    return this.factorVo.weight ? this.factorVo.weight + '%' : '0%';
            //},
            //displayUnusedWeight: function() {
            //    return (100 - this.usedWeight) + '%';
            //}
        },
        methods: {
            newFactorVO: newFactorVO,
            newFactorGroupVO: newFactorGroupVO,
            newItemGroupVO: newItemGroupVO,
            newItemVO: newItemVO,
            displayCriterion: function(type) {
                var filterRes = this.itemModel.criterionList.filter(function(t) {
                    return t.id === type;
                });
                if (filterRes.length) {
                    return filterRes[0].name
                } else {
                    return this.itemModel.criterionList[0].name
                }
            },
            doEdit: function() {
                this.mainModel.beforeEditVo = {};
                if (this.showRight === 'factor') {
                    _.deepExtend(this.mainModel.beforeEditVo, this.factorVo);
                    var vo = _.cloneDeep(this.factorVo);
                    //vo.weight = parseInt(vo.weight) + '';
                    _.deepExtend(this.factorModel.vo, vo);
                    this.displayModel.factorModalVisible = true;
                } else {
                    _.deepExtend(this.mainModel.beforeEditVo, this.factorGroupVo);
                    _.deepExtend(this.factorGroupModel.vo, this.factorGroupVo);
                    this.displayModel.factorGroupModalVisible = true;
                }
                this.mainModel.isReadOnly = false;
                this.isCreate = false;
            },
            doCancel: function() {
                if (this.isCreate) {
                    if (this.beforeCreateCache) {
                        this.showRight = this.beforeCreateCache.showRight;
                        this.factorGroupModel.vo = this.beforeCreateCache.factorGroupVO;
                    } else {
                        this.showRight = 'factor';
                    }
                } else {
                    if (this.showRight === 'factor') {
                        !_.isEmpty(this.mainModel.beforeEditVo) && _.deepExtend(this.factorModel.vo, this.mainModel.beforeEditVo);
                    } else {
                        !_.isEmpty(this.mainModel.beforeEditVo) && _.deepExtend(this.factorGroupModel.vo, this.mainModel.beforeEditVo);
                    }
                }
                this.mainModel.isReadOnly = true;
            },
            doClose: function() {
                window.close();
            },
            doDelete: function(item, index) {
                var _this = this;
                var id;
                if (this.showRight === 'factor') {
                    id = this.factorVo.id;
                } else if (index != null) {
                    id = item.id
                } else {
                    id = this.factorGroupVo.id;
                }
                LIB.Modal.confirm({
                    title: '确定删除数据?',
                    onOk: function() {
                        _this.$api.remove(null, { id: id }).then(function(data) {
                            _this._updateLocalStorage();
                            if (index != null) {
                                _this.getGroupData(_this.factorGroupVo.id)
                            } else {
                                _this.getTreeList({ reselect: true });
                            }
                        })
                    }
                });

            },
            getTreeList: function(opt) {
                var _this = this;
                this.$api.getTreeData({ id: this.tableId, types: [1, 3] }).then(function(data) {
                    _this.treeModel.data = data.data;
                    // 树默认选择第一个要素
                    // 设置创建新要素后树的状态
                    if (data.data.length > 0 && opt) {
                        if (opt.reselect) {
                            _this.treeModel.selectedData = data.data.slice(0, 1);
                            _this.showRight = 'factor';
                            _this.factorVo = _.deepExtend({}, _this.treeModel.selectedData[0]);

                        } else if (opt.id && opt.type === 'factor') {
                            _this.treeModel.selectedData = data.data.filter(function(item) {
                                return item.id === opt.id;
                            });
                            _this.showRight = 'factor';
                            _this.factorVo = _.deepExtend({}, _this.treeModel.selectedData[0]);

                        } else if (opt.id && opt.type === 'factorGroup') {
                            _this.showRight = 'checkItem';
                            var parent = data.data.filter(function(item) {
                                return item.id === opt.parentId;
                            });
                            _this.treeModel.selectedData = parent[0].children.filter(function(item) {
                                return item.id === opt.id;
                            });
                            _this.factorGroupVo = _.deepExtend({}, _this.treeModel.selectedData[0]);
                        }
                    }
                })
            },
            getGroupData: function(id) {
                var _this = this;
                this.$api.getChildren({ id: id }).then(function(data) {
                    _this.groups = data.data.children || [];
                })
            },
            doContentScrollTo: function(top) {
                var div = this.$els.rightContent;
                div && (div.scrollTop = 0);
            },
            doTreeNodeClick: function(data) {
                data = data.data;
                var _this = this;
                if (data.elementType === '1') {
                    this.showRight = 'factor';
                    this.factorVo = _.deepExtend({}, data);
                } else {
                    this.showRight = 'checkItem';
                    this.factorGroupVo = _.deepExtend({}, data);
                    this.getGroupData(data.id);
                    this.$nextTick(function() {
                        _this.doContentScrollTo(0);
                    })
                }
                this.mainModel.isReadOnly = true;
                this.showItemInfo = true;
            },

            // 添加要素
            addFactor: function() {
                this.displayModel.factorModalVisible = true;
                // 缓存添加前的页面状态
                this.beforeCreateCache = {
                    showRight: this.showRight,
                    factorVO: _.cloneDeep(this.factorModel.vo)
                };
                // this.showRight = 'factor';
                // this.mainModel.isReadOnly = false;
                this.factorModel.vo = _.deepExtend({}, this.newFactorVO(), {
                    auditTableId: this.tableId,
                    compId: this.auditTable.compId,
                    orgId: this.auditTable.orgId
                });
                this.isCreate = true;
            },
            doSaveFactor: function() {
                var _this = this;
                this.$refs.factorform.validate(function(valid) {
                    if (valid) {
                        if (_this.isCreate) {
                            _this.$api.create(_.omit(_this.factorModel.vo, ['auditElement', 'auditTable', 'children'])).then(function(data) {
                                _this._updateLocalStorage();
                                _this.getTreeList(_.assign({ type: 'factor' }, data.data));
                                _this.displayModel.factorModalVisible = false;
                                _this.beforeCreateCache = null;
                                _this.getWeight();
                            })
                        } else {
                            _this.$api.update(_.omit(_this.factorModel.vo, ['auditElement', 'auditTable', 'children'])).then(function(data) {
                                _this._updateLocalStorage();
                                _this.getTreeList();
                                _this.factorVo = _this.factorModel.vo;
                                _this.displayModel.factorModalVisible = false;
                                _this.getWeight();
                            })
                        }
                    }
                })
            },

            // 添加要素分组
            doAddFactorGroup: function() {
                // this.showRight = 'checkItem';
                this.displayModel.factorGroupModalVisible = true;
                this.mainModel.isReadOnly = false;
                this.factorGroupModel.vo = _.deepExtend({}, this.newFactorGroupVO(), {
                    parentId: this.factorVo.id,
                    auditElement: {
                        name: this.factorVo.name
                    },
                    auditTableId: this.tableId,
                    compId: this.auditTable.compId,
                    orgId: this.auditTable.orgId
                });
                this.isCreate = true;
            },
            // 保存要素分组
            doSaveFactorGroup: function() {
                var _this = this;
                this.$refs.factorgroupform.validate(function(valid) {
                    if (valid) {
                        if (_this.isCreate) {
                            _this.$api.create(_.omit(_this.factorGroupModel.vo, ['auditElement', 'auditTable', 'children'])).then(function(data) {
                                _this.getTreeList(_.assign({ type: 'factorGroup', parentId: _this.factorGroupModel.vo.parentId }, data.data));
                                _this.mainModel.isReadOnly = true;
                                _this.displayModel.factorGroupModalVisible = false;
                                _this.groups = [];
                            })
                        } else {
                            _this.$api.update(_.omit(_this.factorGroupModel.vo, ['auditElement', 'auditTable', 'children'])).then(function(data) {
                                _this.getTreeList();
                                _this.mainModel.isReadOnly = true;
                                _this.factorGroupVo = _this.factorGroupModel.vo;
                                _this.displayModel.factorGroupModalVisible = false;
                            })
                        }
                    }
                })

            },

            // 添加审核项分组
            addItemGroup: function() {
                this.itemGroupModel.vo = _.deepExtend({}, this.newItemGroupVO(), {
                    parentId: this.factorGroupVo.id,
                    auditTableId: this.tableId,
                    compId: this.auditTable.compId,
                    orgId: this.auditTable.orgId,
                    order: this.groups.length
                });
                this.isCreate = true;
                this.displayModel.itemGroupModalVisible = true;
            },
            doEditItemGroup: function(item) {
                this.itemGroupModel.vo = _.deepExtend({}, item, {
                    auditTableId: item.auditElement.auditTableId,
                    compId: item.auditElement.compId,
                    orgId: item.auditElement.orgId
                });
                this.isCreate = false;
                this.displayModel.itemGroupModalVisible = true;
            },
            doSaveItemGroup: function() {
                var _this = this;
                this.$refs.itemgroupform.validate(function(valid) {
                    if (valid) {
                        if (_this.isCreate) {
                            _this.$api.create(_.omit(_this.itemGroupModel.vo, ['auditElement', 'auditTable', 'children'])).then(function(data) {
                                _this.displayModel.itemGroupModalVisible = false;
                                _this.getGroupData(_this.factorGroupVo.id);
                            })
                        } else {
                            _this.$api.update(_.omit(_this.itemGroupModel.vo, ['auditElement', 'auditTable', 'children'])).then(function(data) {
                                _this.displayModel.itemGroupModalVisible = false;
                                _this.getGroupData(_this.factorGroupVo.id);
                            })
                        }
                    }
                });
            },


            // 添加审核项
            addItem: function(item, index, isSet) {
                this.itemModel.vo = _.deepExtend({}, this.newItemVO(), {
                    parentId: item.id,
                    auditTableId: this.tableId,
                    compId: this.auditTable.compId,
                    orgId: this.auditTable.orgId,
                    elementType: item.elementType === '10' ? '15' : '10',
                    order: item.children ? item.children.length : 0,
                    auditCriterion: isSet ? item.auditCriterion : '1',
                    disabled: isSet ? true : false
                });
                this.displayModel.itemModalVisible = true;
                this.isCreate = true;
            },
            doEditItem: function(items, item, index) {
                this.itemModel.vo = _.deepExtend({}, item, {
                    disabled: item.elementType === '15'
                });
                this.displayModel.itemModalVisible = true;
                this.isCreate = false;
            },
            // 保存审核项
            doSaveItem: function() {
                var _this = this;
                this.$refs.itemform.validate(function(valid) {
                    if (valid) {
                        if (_this.isCreate) {
                            _this.$api.create(_.omit(_this.itemModel.vo, ['auditElement', 'auditTable', 'children'])).then(function(data) {
                                _this._updateLocalStorage();
                                _this.displayModel.itemModalVisible = false;
                                _this.getGroupData(_this.factorGroupVo.id);
                            })
                        } else {
                            _this.$api.update(_.omit(_this.itemModel.vo, ['auditElement', 'auditTable', 'children'])).then(function(data) {
                                _this._updateLocalStorage();
                                _this.displayModel.itemModalVisible = false;
                                _this.getGroupData(_this.factorGroupVo.id);
                            })
                        }

                    }
                })

            },
            doSort: function(type, items, item, index) {
                if (!_.isArray(items)) {
                    items = items.children || []
                }
                var _this = this,
                    params = [],
                    length = items.length;
                if (length === 1) {
                    return;
                }

                if (type === 'up') {
                    if (index === 0) {
                        return;
                    }
                    params.push({
                        id: item.id,
                        order: index - 1
                    });
                    params.push({
                        id: items[index - 1].id,
                        order: index
                    })
                } else {
                    if (index + 1 === length) {
                        return;
                    }
                    params.push({
                        id: item.id,
                        order: index + 1
                    });
                    params.push({
                        id: items[index + 1].id,
                        order: index
                    })
                }
                this.$api.changeOrder(params).then(function(data) {
                    _this.getGroupData(_this.factorGroupVo.id);
                })
            },
            getAuditTableInfo: function() {
                var _this = this
                this.$api.getAuditTable({ id: this.tableId }).then(function(data) {
                    _this.auditTable = data.data;
                    _this.auditTableName = _this.auditTable.name;
                })
            },
            replaceReturnKey: function(name) {
                return name.replace(/[\r\n]/g, '<br/>');
            },
            _updateLocalStorage: function () {
                window.localStorage.setItem("auditTableChangeTime", Date.now() + '');
            }
        },
        ready: function() {
            this.$api = api;
            this.tableId = this.$route.query.id;
            this.getAuditTableInfo();
            this.getTreeList({ reselect: true })
        }
    })

    return vm;
})
