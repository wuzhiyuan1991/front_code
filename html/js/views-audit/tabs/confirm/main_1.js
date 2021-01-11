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
            emptyRules: {},
            statistics: false
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
        uploadModel: {
            //文件过滤器，默认只能上传图片，可不配
            filters: {
                max_file_size: '10mb',
                mime_types: [{ title: "files", extensions: "png,jpg,jpeg,mp4" }]
            },
            params: {
                recordId: null,
                dataType: 'S',
                fileType: 'S'
            },
            paramsRender: function(file, params) {
                if (file.type.indexOf('image') === 0) {
                    return {
                        recordId: params.recordId,
                        dataType: 'S1',
                        fileType: 'S'
                    }
                } else {
                    return {
                        recordId: params.recordId,
                        dataType: 'S2',
                        fileType: 'S'
                    }
                }
            }
        },
        hasExamine: true
    };
    var vm = LIB.VueEx.extend({
        template: tpl,
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.safetyAudit],
        data: function() {
            return dataModel;
        },
        methods: {
            initCheckedData: function() {
                this.checkedIds = [];
            },
            setTreeData: function() {
                var res = [];
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

                _.cloneDeep(this.allData).forEach(function(item) {
                    res.push(_.assign(item, { children: buildChildren(item.children) }));
                });

                // 设置树数据
                this.treeModel.data = res;
                // 设置默认树选中数据
                this.treeModel.selectedData = res.slice(0, 1);

                this.getGroupData(this.allData[0].id, this.allData[0].auditElementId);

            },
            getAllData: function() {
                var _this = this;
                this.$api.getTreeData({ id: this.tableId, types: [] }).then(function(data) {
                    _this.allData = data.data;
                    if (data.data.length > 0) {
                        _this.setTreeData();
                        _this.hasExamine = (data.data[0].status === '15');
                    }
                })
            },
            // 获取审核要素数据
            getGroupData: function(id, elementId) {
                this.lastElementId = elementId;
                var groups = null;

                groups = this.allData.filter(function(item) {
                    return item.id === id;
                })

                this.groups = {
                    id: id,
                    children: this.setDefaultFiles(groups[0].children),
                    elementId: elementId
                };
                this.getFiles();
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
                this.mainModel.isReadOnly = true;
                this.initCheckedData();

            },
            doAudit: function(type) {
                var _this = this;
                var params = {
                    auditPlanId: this.tableId,
                    status: type
                }
                this.$api.audit(params).then(function(data) {
                    if (type === '10') {
                        LIB.Msg.info('弃审成功');
                    } else {
                        LIB.Msg.info('审核成功');
                    }
                    _this.hasExamine = !_this.hasExamine;
                })
            },
            doSave: function() {
                var ret = [];

                function getInputValues(array) {
                    array.forEach(function(arr) {
                        if (arr.comment || arr.actScore || arr.actScore == 0) {
                            ret.push({
                                id: arr.id,
                                auditPlanId: arr.auditPlan.id,
                                comment: arr.comment,
                                auditElementId: arr.auditElementId,
                                score: arr.score,
                                actScore: arr.actScore,
                                ownerId: arr.user.id,
                                auditCriterion: arr.auditElement.auditCriterion
                            });
                        }
                        if (arr.children && arr.children.length) {
                            getInputValues(arr.children)
                        }
                    })
                }
                getInputValues(this.groups.children);
                if (ret.length === 0) {
                    LIB.Msg.warning("请填写评分");
                    return;
                }
                this.$api.batchScore(ret).then(function(data) {
                    LIB.Msg.info("保存成功");
                })
            },
            showOwnerName: function(item) {
                if (item.user) {
                    return item.user.name
                } else {
                    return ''
                }
            },
            setDefaultFiles: function(groups) {
                function setFiles(array) {
                    if (!_.isArray(array)) {
                        return;
                    }
                    array.forEach(function(arr) {
                        if (arr.elementType === '10' || arr.elementType === '15') {
                            arr.files = [];
                        }
                        if (arr.children && arr.children.length) {
                            setFiles(arr.children)
                        }
                    })
                }
                setFiles(groups)
                return groups;
            },
            setFiles: function(files) {
                files = _.groupBy(files, "recordId");

                function set(array) {
                    if (!_.isArray(array)) {
                        return;
                    }
                    array.forEach(function(arr) {
                        if (arr.elementType === '10' || arr.elementType === '15') {
                            if (_.has(files, arr.id)) {
                                arr.files = files[arr.id];
                            }
                        }
                        if (arr.children && arr.children.length) {
                            set(arr.children)
                        }
                    })
                }
                set(this.groups.children)
            },
            getIds: function(groups) {
                var res = [];

                function get(array) {
                    if (!_.isArray(array)) {
                        return;
                    }
                    array.forEach(function(arr) {
                        if (arr.elementType === '10' || arr.elementType === '15') {
                            res.push(arr.id);
                        }
                        if (arr.children && arr.children.length) {
                            get(arr.children)
                        }
                    })
                }
                get(groups)
                return res;
            },
            getFiles: function() {
                var _this = this;
                var recordIds = this.getIds(this.groups.children);
                var ids = JSON.stringify({
                    recordId: recordIds
                })
                this.$api.getFiles({ recordIds: [ids] }).then(function(data) {
                    var list = data.data.list;
                    if (list && list.length) {
                        _this.setFiles(data.data.list);
                    }
                })
            },
            doUploadSuccess: function(data) {
                this.currentRecord.files.push({
                    id: data.rs.content.id,
                    orginalName: data.rs.content.orginalName
                })
            },
            setRecordId: function(item) {
                this.currentRecord = item;
                this.uploadModel.params.recordId = item.id;
            },
            doDeleteFile: function(fileId, index, item) {
                var _this = this;
                LIB.Modal.confirm({
                    title: '确定删除该文件?',
                    onOk: function() {
                        api.deleteFile(null, [fileId]).then(function(data) {
                            if (data.data && data.error != '0') {
                                return;
                            } else {
                                item.files.splice(index, 1);
                                LIB.Msg.success("删除成功");
                            }
                        })
                    }
                });
            }
        },
        ready: function() {
            this.$api = api;
            this.tableId = this.$route.query.id;
            if(this.$route.query.from === 'statistics') {
                this.mainModel.statistics = true;
            }
            this.getAllData()
        }
    });

    return vm;
})
