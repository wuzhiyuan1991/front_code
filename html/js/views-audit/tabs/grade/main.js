define(function(require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = require("text!./main.html");
    var dateUtils = require("views/reportManagement/tools/dateUtils");
    var current = new Date();
    // var currYear = current.getFullYear();
    // var times = {
    //     prevWeek: new Date(currYear, current.getMonth(), current.getDate()-7),
    //     prevMonth: new Date(currYear, current.getMonth()-1),
    //     prevQuarter: new Date(currYear, current.getMonth()-3),
    //     prevYear: new Date(currYear-1, current.getMonth())
    // };

    // 审核要素
    var newFactorVO = function() {
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
        },
        treeModel: {
            data: [],
            selectedData: []
        },
        factorModel: {
            vo: newFactorVO()
        },
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
        // true:只取当前登录用户的数据; false: 取全部数据
        isFilter: true,
        scoreFiles: [],
        tableFiles: [],
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
        // dateRangeOptions: {
        //     shortcuts:[
        //         {text: '本周',value: function() {return [dateUtils.getWeekFirstDay(current), dateUtils.getWeekLastDay(current)];}},
        //         {text: '本月',value: function() {return [dateUtils.getMonthFirstDay(current), dateUtils.getMonthLastDay(current)];}},
        //         {text: '本季度',value: function() {return [dateUtils.getQuarterFirstDay(current), dateUtils.getQuarterLastDay(current)];}},
        //         {text: '本年',value: function() {return [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)];}},
        //         {text: '最近7天', value: dateUtils.getRecent7Days},
        //         {text: '最近30天', value: dateUtils.getRecent30Days}
        //         // {text: '上周',value: function() {return [dateUtils.getWeekFirstDay(times.prevWeek), dateUtils.getWeekLastDay(times.prevWeek)];}},
        //         // {text: '上月',value: function() {return [dateUtils.getMonthFirstDay(times.prevMonth), dateUtils.getMonthLastDay(times.prevMonth)];}},
        //         // {text: '上季度',value: function() {return [dateUtils.getQuarterFirstDay(times.prevQuarter), dateUtils.getQuarterLastDay(times.prevQuarter)];}},
        //         // {text: '去年',value: function() {return [dateUtils.getYearFirstDay(times.prevYear), dateUtils.getYearLastDay(times.prevYear)];}}
        //     ]
        // }, 集成到组件里面去了
        dateRange: [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)],
        totalLength: 1,
        successLength: 0
    };
    var vm = LIB.VueEx.extend({
        template: tpl,
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.safetyAudit],
        data: function() {
            return dataModel;
        },
        computed: {
            styles: function () {
                return {
                    overflowY: "auto",
                    marginRight: "-20px",
                    paddingRight: "10px",
                    marginBottom: "0",
                    maxHeight: "calc(100% - 40px)"
                }
            },
            showUploadRemoveIcon: function () {
                return (LIB.user.id === this.uId) && !this.isFreeze;
            },
            isFreeze: function () {
                return this.status === '3';
            },
            showLoading: function () {
                return !this.emptyResult && _.isArray(this.treeModel.data) && this.treeModel.data.length === 0
            },
            uploadPercent: function () {
                return Math.round(this.successLength / this.totalLength * 100);
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
            getSelfData: function() {
                this.isFilter = true;
                var _this = this;
                if (this.selfData) {
                    _this.emptyResult = false;
                    this.setTreeData();
                    return;
                }
                this.$api.getSelfData({ planId: this.tableId, types: [] }).then(function(data) {
                    _this.selfData = data.data;
                    if (_.isArray(data.data) && data.data.length > 0) {
                        _this.setTreeData();
                        _this.emptyResult = false;
                    } else {
                        _this.treeModel.data = null;
                        _this.emptyResult = true;
                    }
                })
            },
            getAllData: function() {
                this.isFilter = false;
                var _this = this;
                // 只取一次
                if (this.allData) {
                    _this.emptyResult = false;
                    this.setTreeData();
                    return;
                }
                this.$api.getTreeData({ id: this.tableId, types: [] }).then(function(data) {
                    _this.allData = data.data;
                    if (_.isArray(data.data) && data.data.length > 0) {
                        _this.setTreeData();
                        _this.emptyResult = false;
                    } else {
                        _this.treeModel.data = null;
                        _this.emptyResult = true;
                    }
                })
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


                if (this.isFilter) {
                    _.cloneDeep(this.selfData).forEach(function(item) {
                        res.push(_.assign(item, { children: buildChildren(item.children) }));
                    });
                } else {
                    _.cloneDeep(this.allData).forEach(function(item) {
                        res.push(_.assign(item, { children: buildChildren(item.children) }));
                    });
                }
                // 设置树数据
                this.treeModel.data = res;

                var children = _.get(res, "[0].children") || [];

                var id, auditElementId;
                // 设置默认树选中数据
                if (this.queryTaskId) {
                    this.treeModel.selectedData = [{id: this.queryTaskId}];
                    id = this.queryTaskId;
                    var f = _.find(res, function (item) {
                        return _.some(item.children, function (c) {
                            return c.id === id;
                        })
                    });
                    if (f) {
                        var s = _.find(f.children, function (c) {
                            return c.id === id;
                        })
                    }
                    auditElementId = _.get(s, "auditElementId");
                } else {
                    this.treeModel.selectedData = children.slice(0, 1);
                    id = _.get(children, "[0].id");
                    auditElementId = _.get(children, "[0].auditElementId");
                }


                this._queryFolderList(id, auditElementId);
            },

            doTreeNodeClick: function(data) {
                var item = data.data;
                if (item.elementType !== '3') {
                    return;
                }

                if (item.id !== this.lastElementId) {
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


            // 获取文件夹列表
            _queryTaskFolderList: function (id) {
                var _this = this;
                api.queryFolderList({auditTaskId: id}).then(function (res) {
                    var list = _.map(res.data, function (item) {
                        return {
                            name: item.name,
                            id: item.id,
                            orderNo: item.orderNo,
                            frequencyType: item.frequencyType || '1',
                            auditElementId: item.auditElementId,
                            auditTableId: item.auditTableId,
                            files: null,
                            show: true,
                            todayUpload: true,
                            limitNumber: 10,
                            showMore: 0 // 0 不显示更多 1 显示更多 2 显示收起
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
                    _this._onDateRangeChanged();
                    // _this._normalizeScoreFiles(data);
                })
            },

            showMoreFile: function (item, flag) {
                if (flag === 2) {
                    item.limitNumber = item.fileList.length;
                } else if (flag === 1) {
                    item.limitNumber = 10;
                }
                this._setFileListByLimit(item);
                item.showMore = flag;
            },

            _setFileListByLimit: function (item) {
                if (_.isEmpty(item.fileList)) {
                    item.files = [];
                    item.showMore = 0;
                    if (item.frequencyType === '1') {
                        item.todayUpload = false;
                    }
                    return;
                }

                item.showMore = 1;
                var limit = item.limitNumber;
                var files = item.fileList.slice(0, limit);
                var today = new Date().Format("yyyy-MM-dd");
                var ret = [];
                if (item.fileList.length < 10) {
                    item.showMore = 0;
                }

                // 频率为每日的文件夹需要判断今天是否上传
                if (item.frequencyType === '1') {
                    item.todayUpload = _.some(files, function (file) {
                        return file.createDate.indexOf(today) > -1;
                    });
                }

                files = _.groupBy(files, "month");
                _.forEach(files, function(v, k){
                    o = {
                        month: k,
                        files: _.sortBy(v, "createDate").reverse()
                    };
                    ret.push(o);
                });
                item.files = _.sortBy(ret, "month").reverse();
            },

            _normalizeScoreFiles: function (list) {
                var _this = this;
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
                    item.fileList = _.sortBy(files, "createDate").reverse();
                    item.limitNumber = 10;
                    _this._setFileListByLimit(item);
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
                this.successLength = 0;
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
            onUploadSuccess: function (data) {
                this.successLength++;
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
            this.uId = this.$route.query.uId; // 负责人Id
            this.queryTaskId = this.$route.query.tId; // 任务Id
            this.getSelfData();
            this._getPlanInfo()
        }
    });

    return vm;
})
