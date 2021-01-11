define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = require("text!./main.html");

    // 审核要素
    var newFactorVO = function () {
        return {
            code: '',
            name: '',
            parentId: '',
            parentName: '',
            elementType: '3'
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
        uploadModel: {
            //文件过滤器，默认只能上传图片，可不配
            filters: {
                max_file_size: '10mb',
                mime_types: [{title: "files", extensions: "png,jpg,jpeg,mp4"}]
            },
            params: {
                recordId: null,
                dataType: 'S',
                fileType: 'S'
            },
            paramsRender: function (file, params) {
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
        // true:只取当前登录用户的数据; false: 取全部数据
        isFilter: true,
        //formcheked 提交需要验证的字段
        requirePms: null,
        isModify:false,//是否更改当前页面
        keyBeforeClickHandle:true,//这个和下面两个是一起的，先要用这的话，keyBeforeClickHandle必须为true
        beforeClickHandle:function (target) {//return false, 树形不做任何反应
          if(this.isModify){
            if(this.enableSwitch(target)){
               return this.changeCheck;
            }
          }
        },
    };
    var vm = LIB.VueEx.extend({
        template: tpl,
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.safetyAudit],
        data: function () {
            return dataModel;
        },
        methods: {
            doChangPage:function(){
                this.isModify=true;
            },
            changeCheck:function(cb,target,pms){
                var _this=this;
                if(!this.isModify){
                    cb.call(target,pms);
                }
                else{
                    LIB.Modal.confirm({
                        title: '当前要素被编辑过，是否检查保存？',
                        showCancel:true,
                        okText:"确定",
                        cancelText:"不保存离开",
                        onCancel:function () {
                            if(cb){
                                cb.call(target,pms);
                            }
                            _this.isModify=false;
                        }

                    });
                }

            },
            initCheckedData: function () {
                this.checkedIds = [];
            },
            setTreeData: function () {
                var res = [];

                // 取两层数据
                function buildChildren(array) {
                    var res = [];
                    if (_.isArray(array)) {
                        array.forEach(function (item) {
                            res.push(_.assign(item, {children: null}))
                        })
                    }
                    return res;
                }

                if (this.isFilter) {
                    _.cloneDeep(this.selfData).forEach(function (item) {
                        res.push(_.assign(item, {children: buildChildren(item.children)}));
                    });
                } else {
                    _.cloneDeep(this.allData).forEach(function (item) {
                        res.push(_.assign(item, {children: buildChildren(item.children)}));
                    });
                }
                // 设置树数据
                this.treeModel.data = res;
                // 设置默认树选中数据
                this.treeModel.selectedData = res.slice(0, 1);
                if (this.isFilter) {
                    var params = this.selfData[0] || {};
                    this.getGroupData(params.id, params.auditElementId);
                } else {
                    var params = this.allData[0] || {};
                    this.getGroupData(params.id, params.auditElementId);
                }
            },
            getSelfData:function(){
                this.changeCheck(this.origin_getSelfData,this);
            },
            origin_getSelfData: function () {
                var _this=this;
                this.isFilter = true;
                if (this.selfData) {
                    this.setTreeData();
                    return;
                }
                this.$api.getSelfData({planId: this.tableId, types: []}).then(function (data) {
                    _this.selfData = data.data;
                    if (data.data.length > 0) {
                        _this.setTreeData();
                    }
                }).catch(function () {
                    _this.treeModel.data=[];
                    _this.treeModel.selectedData=[];
                })
            },
            getAllData:function(){
                this.changeCheck(this.orgin_getAllData,this);
            },
            orgin_getAllData: function () {
                this.isFilter = false;
                var _this = this;
                // 只取一次
                if (this.allData) {
                    this.setTreeData();
                    return;
                }
                this.$api.getTreeData({id: this.tableId, types: []}).then(function (data) {
                    _this.allData = data.data;
                    if (data.data.length > 0) {
                        _this.setTreeData();
                    }
                })
            },
            // 获取审核要素数据
            getGroupData: function (id, elementId) {
                if (!id || !elementId) {
                    this.groups = {
                        children: []
                    }
                    return;
                }
                this.lastElementId = elementId;
                var groups = null;
                if (this.isFilter) {
                    groups = this.selfData.filter(function (item) {
                        return item.id === id;
                    })
                } else {
                    groups = this.allData.filter(function (item) {
                        return item.id === id;
                    })
                }

                this.groups = {
                    id: id,
                    children: this.setDefaultFiles(groups[0].children),
                    elementId: elementId,
                    name:groups[0].elementName
                };
                this.getFiles();
            },
            enableSwitch:function(targetThis){
                var data=targetThis.model;
                if (data.elementType === '1') {
                    if (data.auditElementId !== this.lastElementId) {
                        return true;
                    }
                } else if(data.elementParentId !== this.lastElementId) {
                    return true;
                }
            },
            doTreeNodeClick: function (data) {
                data = data.data;
                if (data.elementType === '1') {
                    if (data.auditElementId !== this.lastElementId) {
                        this.factorModel.vo = _.deepExtend({}, data);
                        this.getGroupData(data.id, data.auditElementId);
                    }
                    this.doContentScrollTo(0);
                } else {
                    if (data.elementParentId !== this.lastElementId) {
                        var parent = null;
                        if (this.isFilter) {
                            parent = this.selfData.filter(function (item) {
                                return item.auditElementId === data.elementParentId;
                            })
                        } else {
                            parent = this.allData.filter(function (item) {
                                return item.auditElementId === data.elementParentId;
                            })
                        }
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
            doSave: function () {
                if (!this.isFilter) {
                    return;
                }
                var ret = [],
                    _this = this;

                function getInputValues(array,depth) {
                    array.forEach(function (arr) {
                        //数据从第3层开始获取
                        if (depth>2) {
                            var data={
                                id: arr.id,
                                auditPlanId: arr.auditPlan.id,
                                comment: arr.comment,
                                auditElementId: arr.auditElementId,
                                score: arr.score,
                                actScore: arr.actScore,
                                ownerId: arr.user.id,
                                auditCriterion: arr.auditElement.auditCriterion,

                                files: arr.files || [],
                                name:arr.elementName,
                                children1:arr.children,

                            };
                            if(_this.isNotItem(arr.auditElement)){//否定项数据存在attr1上面
                                data.attr1=arr.attr1?1:2;
                            }
                            ret.push(data);

                        }
                        if (arr.children && arr.children.length) {
                            getInputValues(arr.children,depth+1)
                        }
                    })
                }

                getInputValues(this.groups.children,1);
                if (ret.length === 0) {
                    // LIB.Msg.warning("请填写评分");
                    console.error("找不到评分项");
                } else {
                    var i = 0, item;
                    var yaoshu=this.groups.name;
                    for (i; i < ret.length; i++) {
                            item = ret[i];
                            var yaoshuItem=item.name;
                            if (!item.attr1&&this.requirePms.isScoreRequiredWhenFirstAudit&&!item.children1&&isNaN(item.actScore)) {
                                LIB.Msg.warning("请填写"+yaoshu+yaoshuItem+"项的评分");
                                return;
                            }
                            if (this.requirePms.isOpinionRequired && !item.comment) {
                                LIB.Msg.warning("请填写"+yaoshu+yaoshuItem+"项的评分意见");
                                return;
                            }
                            if (item.comment&&item.comment.length>500) {
                                LIB.Msg.warning(""+yaoshu+yaoshuItem+"项的评分意见请控制在500个字符以内");
                                return;
                            }
                            if (this.requirePms.isFileRequired && item.files.length === 0) {
                                LIB.Msg.warning("请上传"+yaoshu+yaoshuItem+"项的附件");
                                return;
                            }
                    }
                }
                this.$api.batchScore(ret).then(function() {
                    _this.$api.getTreeData({ id: _this.tableId, types: [] }).then(function(data) {
                        _this.allData = data.data;
                        _this.isModify=false;
                        LIB.Msg.info("保存成功");
                    })
                })
            },
            showOwnerName: function (item) {
                if (item.user) {
                    return item.user.name
                } else {
                    return ''
                }
            },
            setDefaultFiles: function (groups) {
                function setFiles(array) {
                    if (!_.isArray(array)) {
                        return;
                    }
                    array.forEach(function (arr) {
                        if (arr.elementType === '10' || arr.elementType === '15') {
                            arr.files = [];
                        }
                        if (arr.children && arr.children.length) {
                            setFiles(arr.children)
                        }
                        if(arr.hasOwnProperty('attr1')){
                            arr.attr1=arr.attr1==1;
                        }

                    })
                }

                setFiles(groups)
                return groups;
            },
            setFiles: function (files) {
                files = _.groupBy(files, "recordId");

                function set(array) {
                    if (!_.isArray(array)) {
                        return;
                    }
                    array.forEach(function (arr) {
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
            getIds: function (groups) {
                var res = [];

                function get(array) {
                    if (!_.isArray(array)) {
                        return;
                    }
                    array.forEach(function (arr) {
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
            getFiles: function () {
                var _this = this;
                var recordIds = this.getIds(this.groups.children);
                var ids = JSON.stringify({
                    recordId: recordIds
                })
                this.$api.getFiles({recordIds: [ids]}).then(function (data) {
                    var list = data.data.list;
                    if (list && list.length) {
                        _this.setFiles(data.data.list);
                    }
                })
            },
            convertFilePath: function(file) {
                return LIB.convertFilePath(LIB.convertFileData(file));
            },
            doUploadSuccess: function(data) {
                this.currentRecord.files.push({
                    id: data.rs.content.id,
                    attr5: data.rs.content.attr5,
                    ctxPath: data.rs.content.ctxPath,
                    orginalName: data.rs.content.orginalName
                })
            },
            setRecordId: function (item) {
                this.currentRecord = item;
                this.uploadModel.params.recordId = item.id;
            },
            doDeleteFile: function (fileId, index, item) {
                var _this = this;
                LIB.Modal.confirm({
                    title: '确定删除该文件?',
                    onOk: function () {
                        api.deleteFile(null, [fileId]).then(function (data) {
                            if (data.data && data.error != '0') {
                                return;
                            } else {
                                item.files.splice(index, 1);
                                LIB.Msg.success("删除成功");
                            }
                        })
                    }
                });
            },
            isNotItem:function (item) {//是否是否决项 写在这里方便更改
                return item.auditCriterion==15;//

            }
        },
        ready: function () {
            var _this = this;
            this.$api = api;
            this.tableId = this.$route.query.id;
            this.getSelfData();

            api.getSafetyAuditConfig().then(function (data) {
                _this.requirePms = data;
            });


            // // yincasng
            // $(".app-main-header").css({"display":"none"})

        }
    });

    return vm;
})
