define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    var sumMixin = require("../mixin/sumMixin");

    LIB.registerDataDic("jse_op_card_bag_type", [
        ["1","文件夹"],
        ["2","卡票"]
    ]);

    var newVO = function () {
        return {
            name: null,
            type: '1',
            parentId: null,
            disable: '0',
            fileId: null
        }
    };

    var initDataModel = function () {
        return {
            moduleCode: "opCardDocument",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                vo: newVO(),
                rules: {
                    name: [
                        LIB.formRuleMgr.require("文件夹名称"),
                        LIB.formRuleMgr.length(20)
                    ]
                }
            },
            tableModel: {
                selectedDatas: []
            },
            paths: null,
            documents: null,
            formModel: {
                visible: false
            },
            fileId: '',
            docTypes: [
                {
                    id: null,
                    name: '文件库'
                }
            ],
            uploadModel: {
                params: {
                    recordId: null,
                    dataType: 'W1',
                    fileType: 'W'
                },
                filters: {
                    max_file_size: '20mb',
                    mime_types: [{ title: "files", extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar,txt" }]
                }
            }
        };
    };

    var vm = LIB.VueEx.extend({
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel, sumMixin],
        template: tpl,
        data: initDataModel,
        components: {
        },
        methods: {
            doUploadBefore: function () {
                LIB.globalLoader.show();
            },
            doUploadSuccess: function (param) {
                this.uploadModel.params.recordId = null;
                var con = param.rs.content;
                this.checkPath = _.last(this.paths);
                var parentId = _.get(this.checkPath, "id");
                var vo = {
                    attr5: con.ctxPath,
                    fileId: con.id,
                    type: '2',
                    name: con.orginalName,
                    disable: '0',
                    parentId: parentId,
                    id: con.recordId,
                    attr1: con.ext
                };
                api.create(vo);
            },
            onUploadComplete: function () {
                LIB.globalLoader.hide();
                var _this = this;
                setTimeout(function () {
                    _this._getDocuments();
                }, 100)
            },
            refresh: function () {
                this._getDocuments();
            },
            // 获取卡包数据，并缓存
            _getDocuments: function (params) {
                var _this = this;
                this._cacheDocuments = null;
                api.list(params).then(function (res) {
                    _this._cacheDocuments = _.map(res.data.list, function (item) {
                        return {
                            id: item.id,
                            name: item.name,
                            parentId: item.parentId,
                            fileId: item.fileId,
                            type: item.type,
                            orderNo: item.orderNo,
                            ext: item.type === '1' ? 'folder' : item.attr1,
                            attr5 : item.attr5
                        }
                    });
                    _this._filterByParentId();
                })
            },
            // 新增文件夹
            doAddFolder: function () {
                this.mainModel.vo = newVO();
                this.mainModel.vo.parentId = _.get(this.checkPath, "id");
                this.formModel.visible = true;
            },
            // 保存文件夹
            doSaveFolder: function () {
                var _this = this;
                this.$refs.ruleform.validate(function (valid){
                    if (valid) {
                        var vo = _this.mainModel.vo;
                        if(vo.id) {
                            api.update(vo).then(function () {
                                _this._getDocuments();
                                _this.formModel.visible = false;
                                LIB.Msg.success("保存成功");
                            })
                        } else {
                            var folders = _.filter(_this.documents, function (item) {
                                return item.type === '1'
                            });
                            var folder = _.last(folders);
                            var first;
                            if (folder) {
                                _.set(vo, "criteria.strValue.insertPointObjId", folder.id);
                            } else {
                                first = _.first(_this.documents);
                                if (first) {
                                    _.set(vo, "criteria.strValue.insertPointObjId", first.id);
                                }
                            }
                            api.create(vo).then(function (res) {
                                if (first) {
                                    setTimeout(function () {
                                        _this.doMove(-1, {id: res.data.id, parentId: vo.parentId}, true);
                                    }, 300)
                                } else {
                                    _this._getDocuments();
                                }
                                _this.formModel.visible = false;
                                LIB.Msg.success("保存成功");
                            })
                        }

                    }
                });
            },

            // 移动
            doMove: function (offset, data, silent) {
                var _this = this;
                var param = {
                    id: data.id,
                    parentId: data.parentId
                };
                _.set(param, "criteria.intValue.offset", offset);
                api.order(param).then(function () {
                    _this._getDocuments();
                    if (!silent) {
                        LIB.Msg.success("移动成功");
                    }
                });
            },

            // 修改
            doUpdate: function (doc) {
                this.mainModel.vo = newVO();
                _.extend(this.mainModel.vo, doc);
                this.formModel.visible = true;
            },

            // 删除
            doDelete: function (doc) {

                var _this = this;
                api.remove(null, {id: doc.id}).then(function () {
                    _this._getDocuments();
                    LIB.Msg.success("删除成功");
                })
            },
            convertFilePath: function(doc) {
                return LIB.convertFilePath({fileId:doc.fileId, ctxPath:doc.attr5});
            },
            // 点击文件夹或者票卡
            doClickFolder: function (folder) {
                if (folder.type === '1') {
                    this.paths.push({id: folder.id, name: folder.name});
                    this._filterByParentId();
                }
            },
            // 点击面包屑导航项
            doClickBreadItem: function (index, path) {
                this.paths = this.paths.slice(0, index + 1);
                this._filterByParentId();
            },
            doOrgCategoryChange: function (obj) {
                this._getDocuments({orgId: obj.nodeId});
            },
            // 初始化
            _init: function () {
                this.paths = [];
                this.paths.push(this.docTypes[0]);
                this.onTableDataLoaded();
            },
            // 根据parentId过滤需要显示的列表
            _filterByParentId: function () {
                // 缓存当前活动路径， 方便保存文件夹或者票卡是获取parentId
                this.checkPath = _.last(this.paths);
                var parentId = _.get(this.checkPath, "id");

                var documents = _.filter(this._cacheDocuments, function (item) {
                    return parentId ? item.parentId === parentId : !item.parentId;
                });
                documents = _.sortBy(documents, function (item) {
                    return parseInt(item.orderNo);
                });
                this.documents = documents;
            }
        },
        events: {
        },
        init: function(){
            this.$api = api;
        },
        attached: function () {
            this._init();
            this._getDocuments();
        }
    });

    return vm;
});
