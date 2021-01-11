define(function(require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = require("text!./main.html");
    var dateUtils = require("views/reportManagement/tools/dateUtils");
    var current = new Date();
    var currYear = current.getFullYear();
    var times = {
        prevWeek: new Date(currYear, current.getMonth(), current.getDate()-7),
        prevMonth: new Date(currYear, current.getMonth()-1),
        prevQuarter: new Date(currYear, current.getMonth()-3),
        prevYear: new Date(currYear-1, current.getMonth())
    };
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
        hasExamine: false,
        tabKey: '1',
        scoreFiles: [],
        tableFiles: [],
        fileModel: {
            params: {
                recordId: null,
                dataType: 'S6',
                fileType: 'S'
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{ title: "files", extensions: "pdf,doc,docx,xls,xlsx" }]
            }
        },
        isUploading: false,
        status: '',
        tableFileList: null,
        scoreFileList: null,
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
        emptyResult: false,
        elementFiles: null,
        tableName: '',
        dateRangeOptions: {
            shortcuts:[
                {text: '本周',value: function() {return [dateUtils.getWeekFirstDay(current), dateUtils.getWeekLastDay(current)];}},
                {text: '本月',value: function() {return [dateUtils.getMonthFirstDay(current), dateUtils.getMonthLastDay(current)];}},
                {text: '本季度',value: function() {return [dateUtils.getQuarterFirstDay(current), dateUtils.getQuarterLastDay(current)];}},
                {text: '本年',value: function() {return [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)];}},
                {text: '上周',value: function() {return [dateUtils.getWeekFirstDay(times.prevWeek), dateUtils.getWeekLastDay(times.prevWeek)];}},
                {text: '上月',value: function() {return [dateUtils.getMonthFirstDay(times.prevMonth), dateUtils.getMonthLastDay(times.prevMonth)];}},
                {text: '上季度',value: function() {return [dateUtils.getQuarterFirstDay(times.prevQuarter), dateUtils.getQuarterLastDay(times.prevQuarter)];}},
                {text: '去年',value: function() {return [dateUtils.getYearFirstDay(times.prevYear), dateUtils.getYearLastDay(times.prevYear)];}}
            ]
        },
        dateRange: []
    };
    var vm = LIB.VueEx.extend({
        template: tpl,
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.safetyAudit],
        data: function() {
            return dataModel;
        },
        computed: {
            isAuditPeople: function () {
                return !this.isFreeze && (this.userId === LIB.user.id);
            },
            isFreeze: function () {
                return this.status === '3';
            },
            showSaveBtn: function () {
                return !this.hasExamine && this.isAuditPeople;
            },
            showAuditBtn: function () {
                return !this.hasExamine && !this.mainModel.statistics && this.isAuditPeople;
            },
            showAuditBtn2: function () {
                return this.hasExamine && !this.mainModel.statistics && this.isAuditPeople;
            },
            canEditInput: function () {
                return !this.hasExamine && this.isAuditPeople;
            },
            showLoading: function () {
                return !this.emptyResult && _.isArray(this.treeModel.data) && this.treeModel.data.length === 0
            }
        },
        watch: {
            "dateRange": function (val) {
                this._onDateRangeChanged(val);
            }
        },
        methods: {
            _onDateRangeChanged: function () {
                var range = this.dateRange;
                if (_.isDate(range[0]) && _.isDate(range[1])) {
                    var s = range[0].Format("yyyy-MM-dd hh:mm:ss");
                    var e = range[1].Format("yyyy-MM-dd 23:59:59");
                    var filterList = _.filter(this._allScoreFiles, function (item) {
                        return item.createDate > s && item.createDate < e;
                    });

                    this._normalizeScoreFiles(filterList);
                } else {
                    this._normalizeScoreFiles(this._allScoreFiles);
                }
            },
            displayHzName: function (hz) {
                var o = _.find(this.hzList, "id", hz);
                return _.get(o, "value", "");
            },
            doRefresh: function () {
                var select = this.treeModel.selectedData;
                if (_.isArray(select) && select.length > 0) {
                    this._queryFolderList(select[0].id, select[0].auditElementId, true);
                }
            },
            doChangeKey: function(k) {
                this.tabKey = k;
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

                var children = _.get(res, "[0].children") || [];

                // 设置默认树选中数据
                this.treeModel.selectedData = children.slice(0, 1);

                var id = _.get(children, "[0].id");
                var auditElementId = _.get(children, "[0].auditElementId");
                this._queryFolderList(id, auditElementId);

                var parentId = _.get(children, "[0].elementParentId");
                this.getGroupData(id, parentId);

                this.tabKey = '0';
            },
            getAllData: function() {
                var _this = this;
                this.$api.getTreeData({ id: this.tableId, types: [] }).then(function(res) {
                    _this.allData = res.data;
                    if (_.isArray(res.data) && res.data.length > 0) {
                        _this.setTreeData();
                        _this.hasExamine = (res.data[0].status === '15');
                    } else {
                        _this.emptyResult = true;
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
            doTreeNodeClick: function(data) {

                var item = data.data;
                if (item.elementType !== '3') {
                    return;
                }

                if (item.id !== this.lastElementId) {

                    // this.tabKey = '0';
                    this.getGroupData(item.id, item.elementParentId);

                    this._queryFolderList(item.id, item.auditElementId);
                    this.lastElementId = item.id;
                }

            },
            // 获取文件目录
            _queryFolderList: function (id, auditElementId, flag) {
                this._queryTableFolderList(auditElementId, flag);
                this._queryTaskFolderList(id);
            },
            _queryTableFolderList: function (auditElementId, flag) {
                var _this = this;
                api.queryFolderList({auditElementId: auditElementId, type: 0}).then(function (res) {
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
                    });
                    list = _.sortBy(list, function (item) {
                        return item.orderNo * 1
                    });
                    _this.tableFileList = list;

                    var ids = _.map(list, "id");
                    ids.push(auditElementId);
                    if (ids.length > 0) {
                        _this._queryTableFileList(ids, flag, auditElementId);
                    }
                })
            },
            _queryTableFileList: function (ids, flag, auditElementId) {
                var _this = this;
                var params = {
                    "criteria.strsValue": JSON.stringify({recordId: ids})
                };
                api.listFile(params).then(function (res) {
                    var data = _.filter(res.data, "dataType", "S5");
                    data = _.map(data, function (f) {
                        return {
                            fileId: f.id,
                            name: f.orginalName,
                            fileExt: f.ext,
                            recordId: f.recordId,
                            createDate: f.createDate,
                            ctxPath: f.ctxPath
                        }
                    });
                    data = _.groupBy(data, "recordId");
                    _.forEach(_this.tableFileList, function (item) {
                        item.files = data[item.id] ? (_.sortBy(data[item.id], "createDate").reverse()) : [];
                    });
                    _this.elementFiles = data[auditElementId] ? (_.sortBy(data[auditElementId], "createDate").reverse()) : [];
                    if (flag) {
                        LIB.Msg.success("刷新成功");
                    }
                })
            },
            _queryTaskFolderList: function (id) {
                var _this = this;
                api.queryFolderList({auditTaskId: id}).then(function (res) {
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
                    });
                    list = _.sortBy(list, function (item) {
                        return item.orderNo * 1
                    });
                    _this.scoreFileList = list;

                    var ids = _.map(list, "id");
                    if (ids.length > 0) {
                        _this._queryTaskFileList(ids);
                    }
                })
            },
            _queryTaskFileList: function (ids) {
                var _this = this;
                var params = {
                    "criteria.strsValue": JSON.stringify({recordId: ids})
                }
                api.listFile(params).then(function (res) {
                    var data = _.filter(res.data, "dataType", "S6");
                    _this._allScoreFiles = data;
                    _this._normalizeScoreFiles(data);
                })
            },
            _normalizeScoreFiles: function (list) {
                var data = _.map(list, function (f) {
                    return {
                        fileId: f.id,
                        name: f.orginalName,
                        fileExt: f.ext,
                        recordId: f.recordId,
                        createDate: f.createDate,
                        ctxPath: f.ctxPath,
                        month: f.createDate.substr(0, 7)
                    }
                });
                data = _.groupBy(data, "recordId");
                _.forEach(this.scoreFileList, function (item) {
                    var files = data[item.id] || [];
                    var ret = [];
                    if (_.isEmpty(files)) {
                        item.files = files;
                    } else {
                        files = _.groupBy(files, "month");
                        _.forEach(files, function(v, k){
                            o = {
                                month: k,
                                files: _.sortBy(v, "createDate").reverse()
                            };
                            ret.push(o);
                        });
                        item.files = _.sortBy(ret, "month").reverse();
                    }
                });
            },
            arrowIconType: function (list) {
                return list.show ? 'arrow-down-b' : 'arrow-right-b';
            },
            toggleFolder: function (list) {
                list.show = !list.show;
            },
            setRecordId: function (id) {
                this.fileModel.params.recordId = id;
            },
            onBeforeUpload: function () {
                this.isUploading = true;
            },
            onUploadComplete: function () {
                this.isUploading = false;
            },
            onUploadSuccess: function (data) {
                var rs = data.rs.content;
                this._allScoreFiles.push(rs);
                this._onDateRangeChanged();
            },
            doDeleteFile: function (id) {
                var _this = this;
                api.deleteFile(null, [id]).then(function(res) {
                    if (!res.data || res.data.error === '0') {
                        var index = _.findIndex(_this._allScoreFiles, "id", id);
                        _this._allScoreFiles.splice(index, 1);
                        _this._onDateRangeChanged();
                        LIB.Msg.success("删除成功");
                    }
                })
            },
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
            showOwnerName: function(item) {
                if (item.user) {
                    return item.user.name
                } else {
                    return ''
                }
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
            _getPlanInfo: function () {
                var _this = this;
                api.getPlan({id: this.tableId}).then(function (res) {
                    _this.status = _.get(res, "data.status");
                    _this.tableName = _.get(res, "data.auditTable.name", "要素标准安全体系");
                })
            }
        },
        ready: function() {
            this.$api = api;
            this.tableId = this.$route.query.id;
            this.userId = this.$route.query.userId; // 负责人Id
            if(this.$route.query.from === 'statistics') {
                this.mainModel.statistics = true;
            }
            this.getAllData();
            this._getPlanInfo();
        }
    });

    return vm;
})
