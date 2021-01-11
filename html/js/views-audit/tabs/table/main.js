define(function(require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = require("text!./main.html");

    // 审核要素分组
    var newFactorVO = function() {
        return {
            code: '',
            name: '',
            weight: '',
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
    var newFolderVO = function () {
        return {
            name: '',
            auditElementId: '',
            frequencyType: '1',
            auditTableId: ''
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
                    LIB.formRuleMgr.length()
                ],
                // "weight": [
                //     LIB.formRuleMgr.require("权重"),
                //     {type:'integer', min:1, max: 100, message: '请输入1-100之间的整数'},
                //     {
                //         validator: function(rule, value, callback) {
                //             var r = /^[0-9]*[1-9][0-9]*$/g;
                //             var isNegative = r.test(value);
                //             return isNegative ? callback() : callback(new Error("请输入1-100之间的整数"));
                //         }
                //     }
                // ]
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
                { id: "1", name: "否定项" },
                { id: "5", name: "是否项" },
                { id: "10", name: "比例给分项" },
                { id: "15", name: "问题扣分项" },
                { id: "20", name: "加分项" }
            ],
            rules: {
                "name": [
                    LIB.formRuleMgr.require("审核项内容"),
                    LIB.formRuleMgr.length(500, 1)
                ],
                "score": [
                    LIB.formRuleMgr.require("分值"),
                    LIB.formRuleMgr.length()
                ],
                "auditCriterion": [
                    LIB.formRuleMgr.require("评分标准"),
                    LIB.formRuleMgr.length()
                ]
            },
        },
        folderModel: {
            vo: newFolderVO(),
            rules: {
                "name": [
                    LIB.formRuleMgr.require("文件夹名称"),
                    LIB.formRuleMgr.length()
                ]
            },
            visible: false,
            opType: 'create'
        },
        treeModel: {
            data: [],
            selectedData: []
        },
        displayModel: {
            showRight: 'factor',
            // 安全体系名称
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
        usedWeight: 0,
        tabKey: '1',
        files: [],
        fileModel: {
            params: {
                recordId: null,
                dataType: 'S5',
                fileType: 'S'
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{ title: "files", extensions: "pdf,doc,docx,xls,xlsx" }]
            }
        },
        filePreviewModel: {
            params: {
                recordId: null,
                dataType: 'S5',
                fileType: 'S'
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{ title: "files", extensions: "pdf" }]
            }
        },
        isUploading: false,
        isCreator: false,
        fileList: null,
        hzList: [
            {
                id: '1',
                value: '每日'
            },
            {
                id: '6',
                value: '每周'
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
                id: '7',
                value: '无频次'
            },
        ],
        elementFiles: null,
        totalLength: 1,
        successLength: 0
    };
    var vm = LIB.VueEx.extend({
        template: tpl,
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        data: function() {
            return dataModel;
        },
        computed: {
            displayWeight: function() {
                return this.factorVo.weight ? this.factorVo.weight + '%' : '0%';
            },
            displayUnusedWeight: function() {
                return (100 - this.usedWeight) + '%';
            },
            uploadPercent: function () {
                return Math.round(this.successLength / this.totalLength * 100);
            }
        },
        methods: {
            newFactorVO: newFactorVO,
            newFactorGroupVO: newFactorGroupVO,
            newItemGroupVO: newItemGroupVO,
            newItemVO: newItemVO,

            doChangeKey: function(k) {
                this.tabKey = k;
            },
            createFolder: function () {
                this.folderModel.opType = 'create';
                this.folderModel.vo = newFolderVO();
                this.folderModel.vo.auditElementId = this.secondLevelId;
                this.folderModel.vo.auditTableId = this.tableId;
                this.folderModel.visible = true;
            },
            doSaveFolderName: function () {
                var _this = this;
                if (this.folderModel.opType === 'create') {
                    api.createFolder(this.folderModel.vo).then(function (res) {
                        var item = res.data;
                        _this.folderModel.visible = false;
                        LIB.Msg.success("保存成功");
                        _this.fileList.push({
                            name: item.name,
                            id: item.id,
                            orderNo: item.orderNo,
                            frequencyType: item.frequencyType,
                            auditElementId: item.auditElementId,
                            auditTableId: item.auditTableId,
                            files: [],
                            show: true
                        })
                    })
                }
                else if (this.folderModel.opType === 'update') {
                    api.updateFolder(_.omit(this.folderModel.vo, 'files')).then(function (res) {
                        _this.folderModel.visible = false;
                        _this._updateFolder.frequencyType = _this.folderModel.vo.frequencyType;
                        _this._updateFolder.name = _this.folderModel.vo.name;
                        LIB.Msg.success("保存成功");
                    })
                }

            },
            doFolderMove: function (offset, index, folder) {
                var _this = this;
                if (offset === -1 && index === 0) {
                    return
                }
                if (offset === 1 && index === (this.fileList.length - 1)){
                    return;
                }
                var param = {
                    id: folder.id,
                    auditElementId: this.secondLevelId
                };
                _.set(param, "criteria.intValue.offset", offset);
                api.moveFolder(param).then(function () {
                    var item = _this.fileList.splice(index, 1);
                    if (offset === 1) {
                        _this.fileList.splice(index + 1, 0, item[0]);
                    } else if (offset === -1) {
                        _this.fileList.splice(index - 1, 0, item[0]);
                    }
                });
            },
            doDeleteAuditFile:function (folder, index) {
                var _this = this;
                LIB.Modal.confirm({
                    title: '确定删除数据?',
                    onOk: function() {
                        api.deleteAuditFile(null, folder).then(function () {
                            _this.fileList.splice(index, 1);
                            LIB.Msg.info("删除成功");
                        })
                    }
                });
            },
            displayHzName: function (hz) {
                var o = _.find(this.hzList, "id", hz);
                return _.get(o, "value", "");
            },
            setFolderHz: function (folder) {
                this._updateFolder = folder;
                this.folderModel.opType = 'update';
                this.folderModel.vo = newFolderVO();
                _.extend(this.folderModel.vo, folder)
                this.folderModel.visible = true;
            },
            onUploadSuccess: function (data) {
                this.successLength++;
                var rs = data.rs.content;

                if (rs.attr1 === '1') {
                    var file = _.find(this.elementFiles, function (item) {
                        return item.id === rs.recordId;
                    })
                    if (file) {
                        file.attr1 = rs.attr1;
                        return;
                    }
                    _.forEach(this.fileList, function (list) {
                        file = _.find(list.files, function (item) {
                            return item.id === rs.recordId;
                        })
                        if (file) {
                            file.attr1 = rs.attr1;
                            return false;
                        }
                    })
                    return;
                }
                var o = {
                    name: rs.orginalName,
                    fileId: rs.id,
                    fileExt: rs.ext,
                    time: rs.createDate,
                    ctxPath: rs.ctxPath,
                    attr1: rs.attr1
                };

                // 在分组下面上传文件
                if (rs.recordId === this.secondLevelId) {
                    this.elementFiles.push(o)
                    return;
                }

                // 在文件夹下上传文件
                var fl = _.find(this.fileList, "id", rs.recordId);
                if (_.isArray(fl.files)) {
                    fl.files.push(o)
                } else {
                    fl.files = [o]
                }
            },
            onBeforeUpload: function (uploader) {
                this.totalLength = uploader.files.length;
                this.isUploading = true;
            },
            onUploadComplete: function () {
                var _this = this;
                setTimeout(function () {
                    _this.isUploading = false;
                }, 500)
            },
            doDeleteFile: function (id, index, no) {
                var _this = this;
                LIB.Modal.confirm({
                    title: '确定删除数据?',
                    onOk: function() {
                        api.deleteFile(null, [id]).then(function(res) {
                            if (!res.data || res.data.error === '0') {
                                if (_.isNumber(no)) {
                                    _this.fileList[no].files.splice(index, 1);
                                } else {
                                    _this.elementFiles.splice(index, 1);
                                }
                                LIB.Msg.success("删除成功");
                            }
                        })
                    }
                });

            },

            doPreview: function (f) {
                var ctxPath = f.ctxPath;
                if (f.attr1 === '1') {
                    var lastIndex = _.lastIndexOf(ctxPath, ".");
                    ctxPath = ctxPath.substr(0, 26) + ".pdf";
                    window.open(ctxPath);
                    return;
                }
                if (f.fileExt !== 'pdf') {
                    window.open('preview.html?id=' + f.fileId);
                    return;
                }
                window.open(ctxPath);
            },
            doFileClick: function (f) {
                window.open(LIB.convertFilePath(LIB.convertFileData(f)));
            },

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
                    vo.weight = parseInt(vo.weight) + '';
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
                this.$api.getTreeData({ id: this.tableId, types: [1, 3] }).then(function(res) {
                    var allData = res.data;
                    _this.treeModel.data = allData;
                    // 树默认选择第一个要素分组
                    // 设置创建新要素后树的状态
                    if (allData.length > 0 && opt) {
                        if (opt.reselect) {
                            var firstFacotr = allData.slice(0, 1);
                            var children = firstFacotr[0].children;
                            if (_.isArray(children) && !_.isEmpty(children)) {
                                _this.treeModel.selectedData = children.slice(0, 1);
                                var id = children[0].id;
                                _this.showRight = 'checkItem';
                                _this.tabKey = '0';
                                _this.factorGroupVo = _.deepExtend({}, _this.treeModel.selectedData[0]);
                                _this.getGroupData(id);
                                _this.$nextTick(function() {
                                    _this.doContentScrollTo(0);
                                });

                                _this.secondLevelId = id;
                                _this._queryFolderList(id);
                            } else {
                                _this.treeModel.selectedData = allData.slice(0, 1);
                                _this.showRight = 'factor';
                                _this.factorVo = _.deepExtend({}, _this.treeModel.selectedData[0]);
                            }

                        } else if (opt.id && opt.type === 'factor') {
                            _this.treeModel.selectedData = allData.filter(function(item) {
                                return item.id === opt.id;
                            });
                            _this.showRight = 'factor';
                            _this.factorVo = _.deepExtend({}, _this.treeModel.selectedData[0]);

                        } else if (opt.id && opt.type === 'factorGroup') {
                            _this.showRight = 'checkItem';
                            var parent = allData.filter(function(item) {
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

            uploadPreview: function (id) {
                this.$refs.uploadPreview.setOption('url', '/file/previewpdf/' + id);
                this.filePreviewModel.params.recordId = id;
                this.$refs.uploadPreview.$el.firstElementChild.click();
                this.successLength = 0;
            },
            // 这里只用了一个上传组件，所有 recordId 必须设置正确
            setRecordId: function (id) {
                id = id || this.secondLevelId;
                this.fileModel.params.recordId = id;
                this.successLength = 0;
                this.$refs.upload.$el.firstElementChild.click();
            },

            // 获取文件目录
            _queryFolderList: function (id) {
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

                    // 添加项的id，查询出直属于项的文件
                    ids.push(id);
                    if (ids.length > 0) {
                        _this._queryFileList(ids);
                    }
                })
            },
            _queryFileList: function (ids) {
                var _this = this;
                var params = {
                    "criteria.strsValue": JSON.stringify({recordId: ids})
                }
                var elementId = this.secondLevelId;
                api.listFile(params).then(function (res) {
                    var data = _.filter(res.data, "dataType", "S5");
                    data = _.map(data, function (f) {
                        return {
                            fileId: f.id,
                            name: f.orginalName,
                            fileExt: f.ext,
                            recordId: f.recordId,
                            time: f.createDate,
                            ctxPath: f.ctxPath,
                            attr1: f.attr1
                        }
                    })
                    data = _.groupBy(data, "recordId");
                    _.forEach(_this.fileList, function (item) {
                        item.files = data[item.id] || []
                    });
                    _this.elementFiles = data[elementId] || [];
                })
            },
            arrowIconType: function (list) {
                return list.show ? 'arrow-down-b' : 'arrow-right-b';
            },
            toggleFolder: function (list) {
                list.show = !list.show;
            },
            doTreeNodeClick: function(data) {
                data = data.data;
                var _this = this;
                if (data.elementType === '1') {
                    this.tabKey = '1';
                    this.showRight = 'factor';
                    this.factorVo = _.deepExtend({}, data);
                } else {
                    // this.tabKey = '0';
                    this.showRight = 'checkItem';
                    this.factorGroupVo = _.deepExtend({}, data);
                    this.getGroupData(data.id);
                    this.$nextTick(function() {
                        _this.doContentScrollTo(0);
                    });

                    this.secondLevelId = data.id;
                    this._queryFolderList(data.id);
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
                                _this.getTreeList(_.assign({ type: 'factor' }, data.data));
                                _this.displayModel.factorModalVisible = false;
                                _this.beforeCreateCache = null;
                                _this.getWeight();
                                _this._updateLocalStorage();
                            })
                        } else {
                            _this.$api.update(_.omit(_this.factorModel.vo, ['auditElement', 'auditTable', 'children'])).then(function(data) {
                                _this.getTreeList();
                                _this.factorVo = _this.factorModel.vo;
                                _this.displayModel.factorModalVisible = false;
                                _this.getWeight();
                                _this._updateLocalStorage();
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
                    auditCriterion: isSet ? item.auditCriterion : '20',
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
                                _this.displayModel.itemModalVisible = false;
                                _this.getGroupData(_this.factorGroupVo.id);
                            })
                        } else {
                            _this.$api.update(_.omit(_this.itemModel.vo, ['auditElement', 'auditTable', 'children'])).then(function(data) {
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
                var _this = this;
                this.$api.getAuditTable({ id: this.tableId }).then(function(res) {
                    _this.auditTable = res.data;
                    _this.auditTableName = _this.auditTable.name;
                    _this.isCreator = (LIB.user.id === _this.auditTable.createBy);
                })
            },
            replaceReturnKey: function(name) {
                return name.replace(/[\r\n]/g, '<br/>');
            },
            getWeight: function() {
                var _this = this;
                this.$api.getWeight({ id: this.tableId }).then(function(data) {
                    _this.usedWeight = parseFloat(data.data.weight) || 0;
                })
            },
            _updateLocalStorage: function () {
                window.localStorage.setItem("auditTableChangeTime", Date.now() + '');
            }
        },
        ready: function() {
            this.$api = api;
            this.tableId = this.$route.query.id;
            this.getAuditTableInfo();
            this.getTreeList({ reselect: true });
        }
    })

    return vm;
})
