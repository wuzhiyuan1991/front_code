define(function(require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = require("text!./main.html");
    var gardeApi=require("../grade/vuex/api");
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
        hasExamine: true,
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
        data: function() {
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
            isNotItem:function (item) {//是否是否决项 写在这里方便更改
                return item.auditCriterion==15;//

            },
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
                    elementId: elementId,
                    name:groups[0].elementName,
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
                if(type === '10'){
                   var  title = '确认弃审？'
                }else{
                    var title  = '确认审核？'
                }
                LIB.Modal.confirm({
                    title: title,
                    onOk: function () {
                        _this.gotoDoAudit(type)
                    }
                });
            },
            gotoDoAudit: function (type) {
                var _this = this;
                var params = {
                    auditPlanId: this.tableId,
                    status: type
                }
                if(type==='15'){
                    var ret=this._getData(true);
                    if(ret===false){//表示有错误提示
                        return ;
                    }
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
            _getData:function(check){
                var ret = [];
                var _this = this;
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
                                name:arr.elementName,
                                children1:arr.children
                                //files: arr.files || [],

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
                }
                else if(check===true){
                    var i = 0, item;
                    var yaoshu=this.groups.name;
                    for (i; i < ret.length; i++) {
                        item = ret[i];
                        var yaoshuItem=item.name;
                        if (!item.attr1&&!item.children1&&isNaN(item.actScore)) {
                            LIB.Msg.warning("请填写"+yaoshu+yaoshuItem+"项的评分");
                            return false;
                        }
                        if (item.comment&&item.comment.length>500) {
                            LIB.Msg.warning(""+yaoshu+yaoshuItem+"项的评分意见请控制在500个字符以内");
                            return false;
                        }
                        // if (this.requirePms.isFileRequired && item.files.length === 0) {
                        //     LIB.Msg.warning("请上传附件");
                        //     return;
                        // }
                    }
                }
                return ret;
            },
            doSave: function() {
                var ret=this._getData(true);
                if(ret===false){//表示有错误提示
                    return ;
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
                        if(arr.hasOwnProperty('attr1')){
                            arr.attr1=arr.attr1==1;
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
            var _this=this;
            this.$api = api;
            this.tableId = this.$route.query.id;
            if(this.$route.query.from === 'statistics') {
                this.mainModel.statistics = true;
            }
            this.getAllData();
            gardeApi.getSafetyAuditConfig().then(function (data) {
                _this.requirePms = data;
            })
        }
    });

    return vm;
})
