define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));

    var newVO = function () {
        return {
            id: null,
            name: null,
            type: '1',
            parentId: null,
            disable: '0',
            fileId: null,
            dataType: '1',
            remark:null,
            parent:{id:"",name:""},
            acceptUpload:'1',//是否可以上传文件 0:不可以,1:可以
            fileExtensions:"",
            bizType:null,
        }
    };

    var newRootDocument = function () {
        return  {
            id: null,
            name: "文档库",
            type: '1',
            parentId: null,
            disable: '0',
            dataType: '1',
            acceptUpload: '0',//是否可以上传文件 0:不可以,1:可以
            fileExtensions:""
        };
    };

    var path2NameMap = {};

    var initDataModel = function () {
        return {
            moduleCode: "homeDocument",
            //控制全部分类组件显示
            mainModel: {
                vo: newVO(),
                curBizType : null,
                rules: {
                    name: [
                        LIB.formRuleMgr.require("文件夹名称"),
                        LIB.formRuleMgr.length(50)
                    ],
                    remark:[LIB.formRuleMgr.length(500)]
                }
            },
            paths: null, // 面包屑数据
            documents: null,
            currentList: null, // 当前显示的数据列表
            parentDocument: {
                id: null,
                name: "文档库",
                type: '1',
                parentId: null,
                disable: '0',
                dataType: '1',
                acceptUpload: '0',//是否可以上传文件 0:不可以,1:可以
                fileExtensions:""
            },
            formModel: {
                visible: false,
                title: '新建文件夹',
                appendSlot: ''
            },
            deleteFormModel:{
                visible: false,
                title: '删除文件夹',
                tipVisible: false
            },
            fileTypeModel: {
                visible: false
            },
            reUploadModel: {
                visible: false,
                title: '重新上传'
            },
            uploadModel: {
                params: {
                    id: '',
                    recordId: null,
                    dataType: 'AA1',
                    fileType: 'AA'
                },
                filters: {
                    max_file_size: '100mb',
                    // mime_types: [{ title: "files", extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar,txt" }]
                    mime_types: [{ title: "files", extensions: "*" }]
                }
            },
            inputNameValue: '',
            inputDateValue: [],
            inputUserValue: '',
            searching: false,
            filterModel: {
                exts: null,
                users: null,
                dates: null,
                vo: {
                    types: [],
                    users: [],
                    dateRange: []
                }
            },
            fileDataType: '1',
            editFormMode: '1',
            moveModel:{
                visible: false,
                title: '移动'
            },
            folderList: null,
            selectedDatas: [],
            extensionData:[],
            extensions:null,
            allChecked:false,

            pathName:'' //目录名称
        };
    };

    var vm = LIB.VueEx.extend({
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {},
        computed: {
            acceptUpload: function () {
                return this.parentDocument.acceptUpload == "1";
            }
        },
        watch: {
            // inputNameValue: function (nVal, oVal) {
            //     this._setPaths(nVal, oVal);
            // },
            // "filterModel.vo.dateRange": function (nVal) {
            //     this.filterByEverything();
            // },
            searching: function (nVal, oVal) {
                this._setPaths(nVal, oVal);
            }
        },
        methods: {

            checkFiles:function (files) {
                var _this = this;
                var arr = [];
                _.each(files, function (file) {
                    var obj = _.find(_this.currentList, function (item) {
                        return  file.name == item.name;
                    });
                    if(obj){
                        arr.push(obj.name);
                    }
                });
                if(arr.length>0){
                    LIB.Msg.error(arr.join(', ')+"文件已经存在");
                    return false;
                }
                return true;
            },

            // -------------------------- 过滤 -----------------------
            _setPaths: function (nVal, oVal) {
                var path = _.last(this.paths);
                var filterPath = {
                    id: null,
                    filter: true,
                    name: path.name + " 中的搜索结果"
                };

                // 缓存搜索前的路径
                if (!oVal) {
                    this.pathCache = _.cloneDeep(this.paths);
                }

                if (nVal && !oVal)  {
                    this.paths = [filterPath];
                } else if (!nVal && oVal){
                    this.paths = this.pathCache;
                }

            },

            updatePathName : function(pid){
                var _this  = this;
                var pathName = '/';

                if(!pid ){
                    return _this.paths[0].name;
                }
               for(var i=0; i<_this.pathName.length; i++){
                   if(_this.pathName[i].id == pid){
                       pathName  =  _this.updatePathName(_this.pathName[i].parentId) + " / " + _this.pathName[i].name ;
                        break;
                   }
               }
               return pathName;
            },

            _normalizeFilterItems: function () {
                var list = this.currentList;
                var exts = _.union(_.pluck(list, "extName"));
                var users = _.union(_.pluck(list, "createBy"));
                this.filterModel.exts = exts;
                this.filterModel.users = users;
            },

            _hasFilterValue: function () {
                return !!(this.inputNameValue || this.inputUserValue || (!_.isEmpty(this.inputDateValue) && this.inputDateValue[1] && this.inputDateValue[0]));
            },
            doSearch: function () {
                this.searching = this._hasFilterValue();
                this.$nextTick(function () {
                    if (this.searching) {
                        this._filterByName();
                    }
                    this._getCurrentList();
                });

            },
            reset: function () {
                this.inputNameValue = '';
                this.inputUserValue = '';
                this.inputDateValue = [];
                this.doSearch();
            },
            _filterByName: function () {
                var all = this._cacheAllDocuments;
                var name = this.inputNameValue;
                var user = this.inputUserValue;
                var dateRange = this.inputDateValue;
                var s, e;
                if (!_.isEmpty(dateRange) && dateRange[0] && dateRange[1]) {
                    s = dateRange[0].Format("yyyy-MM-dd 00:00:00");
                    e = dateRange[1].Format("yyyy-MM-dd 23:59:59");
                }
                var pool = [];
                function findChildren(docs) {
                    pool = pool.concat(docs);
                    var parentIds = _.pluck(_.filter(docs, "type", "1"), "id");
                    if (_.isEmpty(parentIds)) {
                        return;
                    }
                    var children = _.filter(all, function (item) {
                        return _.includes(parentIds, item.parentId);
                    });
                    findChildren(children);
                }

                var pList = this._getListByParentId(_.last(this.pathCache).id);
                findChildren(pList);


                var result = _.filter(pool, function (item) {
                    return item.name.indexOf(name) > -1 && item.createBy.indexOf(user) > -1 && (s && e ? (item.createDate > s && item.createDate < e) : true);
                });

                // 缓存搜索结果
                // this.filterByNameListCache = result;
                return result;
            },

            // filterByEverything: function () {
            //     var filterVo = this.filterModel.vo;
            //     var inputNameValue = this.inputNameValue;
            //     var documents = (this.currentListCache || []).slice();
            //
            //
            //     if (!_.isEmpty(filterVo.types)) {
            //         documents = _.filter(documents, function (item) {
            //             return _.includes(filterVo.types, item.extName)
            //         })
            //     }
            //     if (!_.isEmpty(filterVo.users)) {
            //         documents = _.filter(documents, function (item) {
            //             return _.includes(filterVo.users, item.createBy)
            //         })
            //     }
            //     if (!_.isEmpty(filterVo.dateRange) && filterVo.dateRange[0] && filterVo.dateRange[1]) {
            //         var s = filterVo.dateRange[0].Format("yyyy-MM-dd 00:00:00"),
            //             e = filterVo.dateRange[1].Format("yyyy-MM-dd 23:59:59");
            //
            //         documents = _.filter(documents, function (item) {
            //             return item.createDate >= s && item.createDate <= e;
            //         })
            //     }
            //
            //     this.currentList = documents;
            //     this.filterListCache = documents;
            // },

            //  ---------------上传---------------------------
            showFileTypeModal: function () {
                this.isReUpload = false;
                this.uploadModel.params.recordId = null;
                this.mainModel.vo = newVO();
                this.mainModel.vo.bizType = this.mainModel.curBizType;
                this.fileTypeModel.visible = true;
                // this.fileDataType = '1';
            },
            confirmFileType: function () {
                this.fileTypeModel.visible = false;
                // 以下代码为 将动态限制
                 var fileExtensions = this.parentDocument.fileExtensions || "*";
                 this.$refs.uploader.setOptionFileExtensions(fileExtensions);
                 this.$refs.uploader.$el.firstElementChild.click();
            },
            reupload: function (file) {
                this.reUploadCache = file;
                this.isReUpload = true;
                this.reUploadModel.visible = true;
                this.uploadModel.params.recordId = file.id;
                this.cacheFileName = file.name;
                this.mainModel.vo = newVO();
                this.mainModel.vo.bizType = this.mainModel.curBizType;
            },
            move:function (doc) {
                var _this = this;
                this.moveModel.visible = true;
                _this.folderList = _.filter(_this._cacheAllDocuments, "type", "1");
                if (doc.type === '1') {
                    _this.folderList = _.filter(_this.folderList, function (item) {
                        return !_.includes(doc.id, item.id) && !_.includes(doc.id, item.parentId);
                    });
                }
                this.mainModel.vo = newVO();
                this.mainModel.vo.bizType = this.mainModel.curBizType;
                _.extend(this.mainModel.vo, doc);
            },

            doUpdateParentId:function () {
                var _this = this;
                var vo = _this.mainModel.vo;
                var params = {
                    id: vo.id,
                    parentId: vo.parentId,
                    remark:vo.remark
                };
                api.move(params).then(function () {
                    _this.moveModel.visible = false;
                    _this._getDocuments();
                    LIB.Msg.success("修改成功");
                })
            },
            doSaveReUploadRemark: function () {
                this.reUploadModel.visible = false;
                this.$refs.singleUploader.$el.firstElementChild.click();
            },
            uploadParamsRender: function (file, params) {
                return _.extend({}, params, {id: this.reUploadCache.fileId})
            },
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
                    fileSize: con.fileSize,
                    id: con.recordId,
                    attr1: con.ext,
                    dataType: this.fileDataType,
                    remark: this.mainModel.vo.remark,
                    bizType:this.mainModel.vo.bizType
                };
                if (this.isReUpload) {
                    if (this.cacheFileName !== vo.name) {
                        vo.remark += '(文件名由 ' + this.cacheFileName + ' 变更为 ' + vo.name + ' )';
                    }
                    api.update({_bizType: 'reupload'}, vo).then(function (res) {
                        LIB.Msg.success("上传成功");
                    });
                } else {
                    api.create(vo).then(function (res) {
                        LIB.Msg.success("上传成功");
                    });
                }
                this.isReUpload = false;
            },
            onUploadComplete: function () {
                LIB.globalLoader.hide();
                var _this = this;
                setTimeout(function () {
                    _this._getDocuments();
                }, 300);
                this.isReUpload = false;
            },
            refresh: function () {
                this._getDocuments(null, 1);
            },


            // 获取卡包数据，并缓存
            _getDocuments: function (params, isRefresh) {
                var _this = this;
                //只显示  1:公开 2：审核通过的文件
                params = {
                    "criteria.intsValue": JSON.stringify({dataType: [1, 2]})
                };
                if(this.mainModel.vo.bizType) {
                    params["bizType"] = this.mainModel.vo.bizType;
                }

                this._cacheAllDocuments = null;
                api.list(params).then(function (res) {

                    var data = res.data;

                    _this.pathName = data.list;

                    // 手动遍历并建树
                    _.each(data.list, function (item, index) {
                        data.list[index].path = _this.updatePathName(item.parentId);
                    })

                    _this._cacheAllDocuments = _.map(data.list, function (item) {
                        return {
                            id: item.id,
                            name: item.name,
                            parentId: item.parentId,
                            fileId: item.fileId,
                            type: item.type,
                            orderNo: item.orderNo,
                            ext: item.type === '1' ? 'folder' : item.attr1,
                            extName: item.type === '1' ? '文件夹' : item.attr1.toUpperCase(),
                            ctxPath: item.ctxPath,
                            fileSize: item.fileSize,
                            createBy: _.get(item, "user.name", ""),
                            createDate: item.modifyDate || item.createDate,
                            acceptUpload:item.acceptUpload,
                            fileExtensions:item.fileExtensions,
                            path: item.path,
                            bizType: item.bizType,
                            attr5 : item.attr5
                        }
                    });
                    _this.folderList = _.filter(_this._cacheAllDocuments, "type", "1");



                    // _this._getListByParentId();
                    _this._getCurrentList();
                    isRefresh && LIB.Msg.success("文件列表已刷新");
                })
            },
            // 根据搜索和过滤状态获取当前应该显示的数据
            _getCurrentList: function () {
                var lastPath = _.last(this.paths);
                var list;
                if (lastPath.filter) {
                    // list = this.filterByNameListCache;
                    list = this._filterByName();
                } else {
                    list = this._getListByParentId();

                    this.parentDocument = _.last(this.paths);
                    // this.currentParentList = list;
                }
                this.currentList = list;
                // this.currentListCache = list;
                // this._normalizeFilterItems();
            },

            // 根据parentId过滤需要显示的列表
            _getListByParentId: function (pId) {
                // 缓存当前活动路径， 方便保存文件夹或者票卡是获取parentId
                this.checkPath = _.last(this.paths);

                var parentId = pId || _.get(this.checkPath, "id");

                var documents = _.filter(this._cacheAllDocuments, function (item) {
                    return parentId ? item.parentId === parentId : !item.parentId;
                });
                documents = _.sortBy(documents, function (item) {
                    return parseInt(item.orderNo);
                });
                documents = _.sortBy(documents, function (item) {
                    return parseInt(item.type);
                });
                return documents;
            },


            // 新增文件夹
            doAddFolder: function () {
                this.formModel.title = "新建文件夹";
                this.editFormMode = '1';
                this.mainModel.vo = newVO();
                this.mainModel.vo.bizType = this.mainModel.curBizType;
                this.mainModel.vo.parentId = _.get(this.checkPath, "id");
                this.formModel.visible = true;
            },
            // 保存文件夹
            doSaveFolder: function () {
                var _this = this;
                if(_.find(this.currentList,function (item) {
                        if(_this.mainModel.vo.type != '1')
                            return (item.name == (_this.mainModel.vo.name + '.'+_this.mainModel.vo.ext)) && (item.id != _this.mainModel.vo.id)
                        else
                            return (item.name == (_this.mainModel.vo.name)) && (item.id != _this.mainModel.vo.id)
                    })){
                    LIB.Msg.info("名称重复");
                    return;
                }
                this.$refs.ruleform.validate(function (valid){
                    if (valid) {
                        var vo = _this.mainModel.vo;
                        if (vo.type !== '1') {
                            vo.name = vo.name + "." + vo.ext;
                        }
                        vo = _.pick(_this.mainModel.vo, _.keys(newVO()));

                        if (vo.type === '1') {
                            var fileExtensions = "";
                            _.forEach(_this.extensionData, function (item) {
                                if (item.isChecked) {
                                    if (fileExtensions) {
                                        fileExtensions+= ","+item.name;
                                    } else {
                                        fileExtensions = item.name;
                                    }
                                }
                            });
                            vo.fileExtensions = fileExtensions;
                        }
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

                                _this._getDocuments();

                                _this.formModel.visible = false;
                                LIB.Msg.success("保存成功");
                            })
                        }

                    }
                });
            },
            doPreview: function (f) {
                var officeExts = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'pdf'];
                if (_.includes(officeExts, f.ext)) {
                    window.open('preview.html?id=' + f.fileId);
                    return;
                }
                if(LIB.isURL(f.attr5)) {
                    window.open(f.attr5);
                } else {
                    window.open("/file/down/" + f.fileId);
                }

            },
            // 修改
            doUpdate: function (doc) {
                var _this = this;
                this.formModel.title = "编辑";
                this.editFormMode = doc.type;
                if (doc.type === '1') {
                    this.mainModel.vo = newVO();
                    _.extend(this.mainModel.vo, doc);
                    this.formModel.appendSlot = "";
                    var fes = !!this.mainModel.vo.fileExtensions ? this.mainModel.vo.fileExtensions.split(",") : "";
                    _.each(this.extensionData, function (item) {
                        item.isChecked = fes.indexOf(item.name) != -1;
                    });
                } else {
                    this.mainModel.vo = _.cloneDeep(doc);
                    this.formModel.appendSlot = "."+ doc.ext;
                    this.mainModel.vo.name = _.initial(this.mainModel.vo.name.split(".")).join(".");
                }
                this.formModel.visible = true;
            },

            // 删除
            doDelete: function (doc) {
                this.deleteFormModel.tipVisible = false;
                this.deleteFormModel.title = doc.type === '1' ? "删除文件夹" : "删除文件";
                this.mainModel.vo = newVO();
                _.extend(this.mainModel.vo, doc);
                this.deleteFormModel.visible = true;
                if (doc.type === '1') {
                    var documents = _.filter(this._cacheAllDocuments, function (item) {
                        return item.parentId === doc.id;
                    });
                    if (!_.isEmpty(documents)) {
                        this.deleteFormModel.tipVisible = true;
                    }
                }
            },

            doDeleteFolder: function () {
                var _this = this;

                var vo = _this.mainModel.vo;
                api.deleteLogic(null, vo).then(function () {
                    _this._getDocuments();
                    _this.deleteFormModel.visible = false;
                    LIB.Msg.success("删除成功");
                });

            },
            convertFilePath: function(doc) {
                return LIB.convertFilePath({fileId:doc.fileId, ctxPath:doc.attr5});
            },
            // 点击文件夹或者票卡
            doClickItem: function (item) {
                if (item.type === '1') {
                    this.paths.push({id: item.id, name: item.name, acceptUpload : item.acceptUpload, fileExtensions: item.fileExtensions});
                    this._getCurrentList();
                    this.parentDocument = item;
                } else if (item.type === '2') {
                    this.doPreview(item)
                }

            },
            // 点击面包屑导航项
            doClickBreadItem: function (index, path) {
                this.paths = this.paths.slice(0, index + 1);
                this._getCurrentList();
            },
            doOrgCategoryChange: function (obj) {
                this._getDocuments({orgId: obj.nodeId});
            },
            changeUploadFile:function (checked) {
                this.mainModel.vo.acceptUpload = checked ? '1' : '0';
            },
            doChangeUploadFileExtension:function (f) {
                var _this = this;
                _this.$nextTick(function () {
                    _this.allChecked = _.every(_this.extensionData, "isChecked", true);
                });
            },
            doCheckExtensionAll:function () {
                var nVal = this.allChecked;
                _.forEach(this.extensionData, function (item) {
                    item.isChecked = !nVal;
                });
            },
            // 初始化
            _init: function () {
                this.paths = [];
                var rootDoc = {};
                _.extend(rootDoc, this.parentDocument);
                this.paths.push(rootDoc);
                if (this.hasAuth('isAuditFile')) {
                    this.fileDataType = '10';
                }
            },
            getDocCenterUploadExtensions: function () {
                var _this = this;
                _this.extensionData = [];
                api.getDocCenterUploadExtensions().then(function (res) {
                    if (res.data) {
                        var dcue = res.data.split(",");
                        if (dcue) {
                            _.each(dcue, function (item) {
                                _this.extensionData.push({name: item, isChecked: false});
                            });
                        }
                    }
                })
            },
            setPageByPath: function (route) {

                var menu = path2NameMap[route.path];

                this.parentDocument = newRootDocument();
                if(menu) {
                    this.parentDocument.name = menu.name;
                } else {
                    this.parentDocument.name = "文档库";
                }

                var query = route.query;
                // var bizType = _.last(path.split("/"));
                // if(bizType && bizType != this.mainModel.curBizType) {
                // }
                var bizType = query.bizType;
                this.reset();
                this.mainModel.curBizType = this.mainModel.vo.bizType = bizType;


            },
            // if (!this.mainModel.statusVo[viewMode]) {
            //     this.visibleMode = 'all';
            //     this.changeViewMode('all');
            // } else {
            //     this.visibleMode = viewMode;
            //     this.changeViewMode(viewMode);
            // }

            // var menuName = $(".v-link-active :last").text();
            // this.parentDocument.name = menuName;
            // console.log(menuName);
            //防止重复调用
            // queryOnServerLazyFunc: _.debounce(function (_this){
            //     _this.setPageByPath(_this.$route);
            //     if(_this._isReady) {
            //         _this._init();
            //         _this._getDocuments();
            //     }
            // }),
            initData: function () {
                this.setPageByPath(this.$route);
                this._init();
                this._getDocuments();
            }
        },
        events: {},
        init: function(){
            path2NameMap = _.indexBy(LIB.setting.menuList, "attr1");
            this.$api = api;
        },
        //会重复被调用
        // attached: function () {
            // this.queryOnServerLazyFunc(this);
        // },
        ready: function () {
            // this._init();
            // this._getDocuments();
            this.getDocCenterUploadExtensions();
        }
    });

    return vm;
});
