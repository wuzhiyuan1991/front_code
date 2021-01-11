define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");
    var courseSelectModal = require("componentsEx/selectTableModal/courseSelectModal");
    var userSelectModal = require("./dialog/userSelect");

    var multipleResult = require("./dialog/multipleResult");
    var singleResult = require("./dialog/singleResult");

    //选择知识点
    require("componentsEx/selectTableModal/examPaperSelectModal");
    //初始化数据模型
    var newVO = function () {
        return {
            //培训计划id
            id: null,
            //
            compId: null,
            //培训结束时间
            endTime: null,
            //备注
            remarks: null,
            //培训开始时间
            startTime: null,
            //状态 0未发布,1已发布,2已取消
            status: 0,
            //修改日期
            modifyDate: null,
            //创建日期
            createDate: null,
            //对应课程
            course: {id: null, name: ''},
            //考试计划
            exam: {id: null, examDate: null, entryDeadline: null, passLine: null, examPaper: {id: null, name: '', score: 0}},
            //培训人员
            trainTasks: [],
            //是否结束
            isOver: false,
            publisher: null,
        }
    };
    var now = new Date();
    var beginDate = now.Format("yyyy-MM-dd 00:00:00");

    var baseColumns = [
        {
            title: "姓名",
            fieldName: "user.name",
            keywordFilterName: "criteria.strValue.keyWordValue_name"
        },
        {
            title: "所属公司",
            fieldType: "custom",
            render: function (data) {
                if (data.compId) {
                    return LIB.getDataDic("org", data.user.compId)["compName"];
                }
            },
            keywordFilterName: "criteria.strValue.keyWordValue_comp"
        },
        {
            title: "所属部门",
            fieldType: "custom",
            render: function (data) {
                if (data.orgId) {
                    return LIB.getDataDic("org", data.user.orgId)["deptName"];
                }
            },
            keywordFilterName: "criteria.strValue.keyWordValue_org"
        },
        {
            title: "岗位",
            fieldType: "custom",
            render: function (data) {
                if (_.propertyOf(data.user)("positionList")) {
                    var posNames = "";
                    data.user.positionList.forEach(function (e) {
                        if (e.postType == 0) {
                            posNames += (e.name + "/");
                        }
                    });
                    posNames = posNames.substr(0, posNames.length - 1);
                    return posNames;

                }
            },
            keywordFilterName: "criteria.strValue.keyWordValue_position"
        },
        {
            title: "安全角色",
            fieldType: "custom",
            render: function (data) {
                if (_.propertyOf(data.user)("positionList")) {
                    var roleNames = "";
                    data.user.positionList.forEach(function (e) {
                        if (e.postType == 1) {
                            roleNames += (e.name + "/");
                        }
                    });
                    roleNames = roleNames.substr(0, roleNames.length - 1);
                    return roleNames;

                }
            },
            keywordFilterName: "criteria.strValue.keyWordValue_position"
        },
        {
            //title : "任务类型",
            title: "任务类型",
            fieldType: "custom",
            filterType: "enum",
            dataDicKey: "train_task_type",
            render: function (data) {
                return LIB.getDataDic("train_task_type", data.source);
            },
            keywordFilterName: "criteria.intsValue.keyWordValue_source",
            width: 160
        }
    ];

    var toolColumns = [
        {
            title: "",
            render: function () {
                return '<a href="javascript:void(0);" data-action="REMOVEUSER"><i class="ivu-icon ivu-icon-trash-a" data-action="REMOVEUSER"></i></a>'
            },
            width: 60
        }
    ];

    var resultColumns = [
        {
            title: "培训结果",
            fieldType: "custom",
            render: function (data) {
                var status = data.status;
                if (data.course.type == 1 && data.status == 2 && data.endTime < data.trainDate) {
                    status = '7';
                }
                if(data.course.type == 1 && data.status == 0 && new Date(data.endTime).getTime() < new Date().getTime()) {
                    status = '6';
                }

                var item = LIB.getDataDic('train_task_result', status);

                if (status == 2 || status == 7) {
                    return "<span style='color:#009900'>" + item + "</span>"
                } else if (status == 1 || status == 3) {
                    return "<span style='color:red'>" + item + "</span>"
                } else {
                    return "<span style='color:#8c6666'>" + item + "</span>"
                }

            },
            tipRender: function (data) {
                var item = LIB.getDataDic('train_task_result', data.status);
                return item
            },
            width: 150
        },
        {
            title: "通过时间",
            fieldName: "trainDate",
            // fieldType: "custom",
            // render: function (data) {
            //     return data.trainDate;
            // },
            width: 140
        },
        {
            title: "考试交卷时间",
            fieldName: "examSchedule.startTime",
            width: 140
        },
        {
            title: "考试得分",
            fieldName: "custom",
            render: function (data) {
                if (data.score) {
                    return parseInt(data.score) + "分";
                } else if (!!data.examSchedule && data.examSchedule.status == 2) {
                    return "0分";
                }
            },
            width: 100
        }
        
    ];

    var setResultColumn = [
        {
            title: "上报结果",
            render: function () {
                return '<a href="javascript:void(0);" data-action="SETRESULT">上报结果</a>'
            }
        }
    ];
    var certificateColumn = [
        {
            title: "证书",
            render: function (data) {
                if (_.includes(['2', '7'], data.status)) {
                    return '<a href="javascript:void(0);" data-action="SETCERTIFICATE">添加证书</a>'
                } else {
                    return '';
                }
            }
        }
    ];


    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "",

            //验证规则
            rules: {
                "course.id": [{required: true, message: '请选择课程'}],
                "startTime": [{required: true, message: '请输入开始时间'}],
                "endTime": [{required: true, message: '请输入结束时间'}],

                "compId": [{required: true, message: '请选择所属公司'}],
                "exam.examDate": [
                    {
                        validator: function (rule, value, callback) {
                            if (!!dataModel.mainModel.vo.exam.examPaper.id) {
                                if (!!value) {
                                    var start = new Date(),
                                        end = new Date(value);
                                    if (end <= start) {
                                        return callback(new Error("允许考试时间（开始）要大于当前时间"))
                                    }
                                    return callback()
                                } else {
                                    return callback(new Error('请输入允许考试时间（开始）'));
                                }
                            } else {
                                return callback();
                            }

                        }
                    }
                ],
                "exam.entryDeadline": [
                    {
                        validator: function (rule, value, callback) {
                            if (!!dataModel.mainModel.vo.exam.examPaper.id) {
                                if (!!value) {
                                    var start = new Date(),
                                        end = new Date(value);
                                    var examDate = dataModel.mainModel.vo.exam.examDate;
                                    if (end <= start) {
                                        return callback(new Error("允许考试时间（开始）要大于当前时间"))
                                    } else if (value <= examDate) {
                                        return callback(new Error('允许考试时间（结束）要大于允许考试时间（开始）'));
                                    } else {
                                        callback();
                                    }
                                } else {
                                    return callback(new Error('请输入允许考试时间（结束）'));
                                }
                            } else {
                                return callback();
                            }

                        }
                    }
                ],
                "exam.passLine": [LIB.formRuleMgr.length(),
                    {
                        validator: function (rule, value, callback) {
                            if (!!dataModel.mainModel.vo.exam.examPaper.id) {
                                if (value != null) {
                                    if (value <= 0) {
                                        return callback(new Error('通过分数必须大于0'));
                                    }
                                    return parseFloat(value) > dataModel.mainModel.vo.exam.examPaper.score ? callback(new Error('通过分数不能大于试卷总分')) : callback();
                                } else {
                                    return callback(new Error('请输入通过分数'));
                                }

                            } else {
                                return callback();
                            }

                        }
                    }
                ],
                "remarks": [LIB.formRuleMgr.length()],
            },
            emptyRules: {},
            now: (now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate())

        },
        tableModel: {
            userTableModel: {
                url: "trainplan/traintasks/list/{curPage}/{pageSize}",
                columns: [],
                defaultFilterValue: {
                    "criteria.intValue": {
                      includeDisableUser: '0'
                    }
                  }
            }
        },
        cardModel: {
            userCardModel: {
                showContent: true
            }
        },
        selectModel: {
            courseSelectModel: {
                visible: false,
                filterData: {orgId: null}
            },
            examPaperSelectModel: {
                visible: false,
                filterData: {orgId: null}
            },
            userSelectModel: {
                visible: false,
                filterData: {orgId: null}
            }
        },
        formModel: {
            certFormModel: {
                show : false,
                queryUrl : "cert/{id}"
            }
        },
        beginDate: beginDate,
        tabs: [
            {
                id: 'all',
                name: '全部'
            },
            {
                id: '0',
                name: '培训中'
            },
            {
                id: '2',
                name: '通过'
            },
            {
                id: '1',
                name: '未通过'
            }
        ],
        currentTabId: 'all',
        //上传资料数据
        proofMaterialData: [],
        proofMaterial: {
            params: {
                recordId: null,
                dataType: 'T1', //上传证明
                fileType: 'T'
            },
            filters: {
                max_file_size: '10mb',
                mime_types: [{ title: "files", extensions: "pdf,doc,docx,xls,xlsx,jpg,jpeg,png" }]
            }
        },
        multipleResult: {
            visible: false
        },
        singleResult: {
            visible: false
        },
        leaveWorkerSwitch: false
    };

    //Vue组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *    el
     template
     components
     componentName
     props
     data
     computed
     watch
     methods
     events
     vue组件声明周期方法
     created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
        template: tpl,
        components: {
            "courseSelectModal": courseSelectModal,
            "userSelectModal": userSelectModal,
            "multipleResult": multipleResult,
            "singleResult": singleResult
        },
        data: function () {
            return dataModel;
        },
        computed: {
            "scoreLabel": function () {
                var label = "通过分数";
                if(this.mainModel.vo.exam.examPaper.score) {
                    label += "(总分: " + this.mainModel.vo.exam.examPaper.score +")"
                }
                return label;
            },
            hasExam: function () {
                return !!_.get(this.mainModel.vo, "exam.examPaper.id");
            },
            hasCourseSelected: function () {
                return !!_.get(this.mainModel.vo, "course.id");
            },
            images: function () {
                return _.filter(this.proofMaterialData, "isImage", true);
            }
        },
        watch: {
            'mainModel.vo.exam.entryDeadline': function (val, oldVal) {
                if (this.hasExam && !!val) {
                    var examDate = new Date(this.mainModel.vo.exam.entryDeadline);
                    var replayTime = parseInt(this.mainModel.vo.exam.examPaper.replyTime) + 10;
                    examDate.setMinutes(examDate.getMinutes() + replayTime);
                    this.mainModel.vo.endTime = examDate.Format("yyyy-MM-dd hh:mm:ss");
                }
            },
            'leaveWorkerSwitch': function (value) {
                var query = {}
                query['criteria.intValue.includeDisableUser'] = value ? '1' : '0'
                this.$refs.userTable.doQuery(query)
              }
        },
        methods: {
            newVO: newVO,

            refreshUserTableData: function () {
                var params = [{
                    type: "save",
                    value: {
                        columnFilterName: "id",
                        columnFilterValue: this.mainModel.vo.id,
                    }
                }];

                if (this.currentTabId !== 'all') {
                    params.push({
                        type: "save",
                        value: {
                            columnFilterName: "criteria.intsValue.status",
                            columnFilterValue: [this.currentTabId],
                        }
                    })
                }
                this.$refs.userTable.doCleanRefresh(params);
            },
            doTabClick: function (id) {
                this.currentTabId = id;
                this.refreshUserTableData();
            },

            onUploadSuccess: function(data) {
                var imageExtensions = ['jpg', 'jpeg', 'png'];
                var content = data.rs.content;
                this.proofMaterialData.push({
                    fileId: content.id,
                    attr5: content.attr5,
                    ctxPath: content.ctxPath,
                    fullSrc: content.ctxPath,
                    name: content.orginalName,
                    fileExt: content.ext,
                    isImage: _.includes(imageExtensions, content.ext)
                });
            },
            convertFilePath: LIB.convertFilePath,
            showImage: function (id) {
                var index = _.findIndex(this.images, "fileId", id);
                this.$refs.imageViewer.view(index);
            },
            doDeleteFile : function(fileId, index, array) {
                if (!this.hasPermission('4010005035')) {
                    LIB.Msg.warning("你没有此权限!");
                    return;
                }
                api.deleteFile(null, [fileId]).then(function(data) {
                    array.splice(index, 1);
                    LIB.Msg.success("删除成功");
                })

            },

            doPassedSingle: function () {
                this.singleResult.visible = false;
                this.multipleResult.visible = false;
                this.refreshUserTableData();
                LIB.Msg.success("操作成功");
            },
            clickedTableRow: function (data) {
                var el = data.event.target;
                var action = _.get(el, "dataset.action");
                if (action === 'SETRESULT') {
                    this.$refs.singleResult.init(this.mainModel.vo.id, data.entry.data, action);
                    this.singleResult.visible = true;
                }
                else if (action === 'REMOVEUSER') {
                    this.doRemoveTrainTasks(data.entry.data)
                } else if (action === 'SETCERTIFICATE') {
                    this.$refs.singleResult.init(this.mainModel.vo.id, data.entry.data, action);
                    this.singleResult.visible = true;
                }
            },
            setMultipleResult: function () {
                this.multipleResult.visible = true;
            },

            doPreview: function (data) {
                window.open(LIB.ctxPath("/front/exampaper/preview/" + data[0].id));
            },
            doComptime: function (beginTime, endTime) {
                var beginTimes = beginTime.substring(0, 10).split('-');
                var endTimes = endTime.substring(0, 10).split('-');
                beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' ' + beginTime.substring(10, 19);
                endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + endTime.substring(10, 19);
                var time = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
                return time;
            },

            // 选择课程
            doShowCourseSelectModal: function () {
                this.selectModel.courseSelectModel.visible = true;
                this.selectModel.courseSelectModel.filterData = {disable: 0, "criteria.intsValue.type": [2, 3]};
            },
            doSaveCourse: function (selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.course.id = selectedDatas[0].id;
                    this.mainModel.vo.course.name = selectedDatas[0].name;
                    this.doClearInput();
                }
            },

            // 选择试卷
            doShowExamPaperSelectModal: function () {
                this.selectModel.examPaperSelectModel.visible = true;
                this.selectModel.examPaperSelectModel.filterData = {
                    'course.id': this.mainModel.vo.course.id,
                    type: 3,
                    'criteria.intValue': {selectWithQuestion: 1}
                };
            },
            doSaveExamPaper: function (selectedDatas) {
                var row = _.isArray(selectedDatas) ? selectedDatas[0] : null;
                if (row) {
                    this.mainModel.vo.exam.paperId = row.id;
                    this.mainModel.vo.exam.examPaper.id = row.id;
                    this.mainModel.vo.exam.examPaper.name = row.name;
                    this.mainModel.vo.exam.examPaper.score = row.score;
                    this.mainModel.vo.exam.examPaper.replyTime = row.replyTime;
                }
            },

            // 选择培训人员
            doShowUserSelectModal: function () {
                this.selectModel.userSelectModel.visible = true;
                this.selectModel.userSelectModel.filterData = {
                    orgId: LIB.user.orgId,
                    courseId: this.mainModel.vo.course.id
                };
            },
            doSaveTrainTasks: function (selectedDatas) {
                var _this = this;

                var param = _.map(selectedDatas, function (data) {
                    return {
                        user: {id: data.id},
                        orgId: data.orgId,
                        compId: data.compId
                    }
                });
                if (_.isEmpty(param)) {
                    return;
                }
                api.saveTrainTasks({id: this.mainModel.vo.id}, param).then(function (res) {
                    if (_this.mainModel.vo.status === '2') {
                        _this.mainModel.vo.status = '0';
                    }
                    _this.refreshUserTableData();
                    _this.$dispatch("ev_dtUpdate");
                });

            },

            doRemoveTrainTasks: function (data) {
                var _this = this;
                api.removeTrainTasks({id: this.mainModel.vo.id}, [{
                    id: data.id,
                    userId: data.userId
                }]).then(function (res) {
                    if (_this.mainModel.vo.status === '2') {
                        _this.mainModel.vo.status = '0';
                    }
                    _this.refreshUserTableData();
                    _this.$dispatch("ev_dtUpdate");
                });
            },


            // 发布
            doPublish: function () {
                var _this = this;
                LIB.Modal.confirm({
                    title: '确定发布?',
                    onOk: function () {
                        api.publish({id: _this.mainModel.vo.id}).then(function (res) {
                            LIB.Msg.success("发布成功");
                            _this.mainModel.vo.status = '1';
                            _this.mainModel.vo.publisher = {username: LIB.user.username};
                            _this.afterDoSave({type: "U"});
                            _this.changeView("view");
                            _this.$dispatch("ev_dtUpdate");
                            _this._setTableColumns();
                        })
                    }
                });
            },
            //取消发布
            doCancelPublish: function () {
                var _this = this;

                if (this.mainModel.vo.status !== '1') {
                    LIB.Msg.warning("【未发布/已取消】状态不能取消!");
                    return;
                }
                if (this.mainModel.vo.isOver) {
                    LIB.Msg.warning("培训已结束不能取消,请重新选择!");
                    return;
                }
                LIB.Modal.confirm({
                    title: '确定取消发布此计划?',
                    onOk: function () {
                        api.cancelPublish({
                            id: _this.mainModel.vo.id,
                            orgId: _this.mainModel.vo.orgId
                        }).then(function (res) {
                            _this.mainModel.vo.status = "2";
                            _this.mainModel.vo.publisher = null;
                            LIB.Msg.info("取消成功!");
                            _this.afterDoSave({type: "U"});
                            _this.changeView("view");
                            _this.$dispatch("ev_dtUpdate");
                            _this._setTableColumns();

                        });
                    }
                });
            },



            _setTableColumns: function () {
                var status = this.mainModel.vo.status;
                var columns;
                if (status === '1') {
                    columns = baseColumns.concat(resultColumns);
                    if (this.hasAuth('setResult')) {
                        columns = columns.concat(setResultColumn);
                        if (_.get(this.mainModel.vo, "course.isCertRequired") === '1') {
                            columns = columns.concat(certificateColumn);
                        }
                    }

                } else {
                    columns = baseColumns.concat(toolColumns);
                }
                // this.$refs.userTable.refreshColumns();
                this.tableModel.userTableModel.columns = columns;
            },


            _getFiles: function () {
                var _this = this;
                var id = this.mainModel.vo.id;
                var imageExtensions = ['jpg', 'jpeg', 'png'];
                this.proofMaterialData = [];
                this.proofMaterial.params.recordId = id;
                api.listFile({ recordId: id }).then(function(res) {
                    var fileData = res.data;
                    var files = _.filter(fileData, "dataType", "T1");
                    _this.proofMaterialData = _.map(files, function (item) {
                        return {
                            name: item.orginalName,
                            fileId: item.id,
                            attr5: item.attr5,
                            ctxPath: item.ctxPath,
                            fullSrc: item.ctxPath,
                            fileExt: item.ext,
                            isImage: _.includes(imageExtensions, item.ext)
                        }
                    });

                });
            },

            beforeInit: function () {
            	this.proofMaterialData = [];
                this.$refs.userTable.doClearData();
            },
            afterInit: function () {
                this.currentTabId = 'all';
                if (this.mainModel.opType === 'create') {
                    this._setTableColumns();
                }
            },
            afterInitData: function () {
                if (this.leaveWorkerSwitch) {
                    this.leaveWorkerSwitch =false
                }
                this._setTableColumns();
                this._getFiles();
                this.refreshUserTableData();
               
            },
            doClearInput: function () {
                this.mainModel.vo.exam.examPaper.id = null;
                this.mainModel.vo.exam.examPaper.name = null;
                this.mainModel.vo.exam.examPaper.score = null;
                this.mainModel.vo.exam.examDate = null;
                this.mainModel.vo.exam.passLine = null;
                this.mainModel.vo.exam.paperId = null;
                this.mainModel.vo.exam.entryDeadline = '';
            },
            beforeDoDelete: function () {
                this.mainModel.vo.exam.trainPlan = null;
            },
            afterFormValidate: function () {
                this.mainModel.vo.exam.trainPlan = null;
                this.mainModel.vo.exam.examSchedules = null;
                //因为有时分秒 所以判断一下结束时间是否小于开始时间
                var endTime = this.doComptime(this.mainModel.vo.startTime, this.mainModel.vo.endTime);
                if (endTime < 0) {
                    LIB.Msg.warning("结束时间不能少于开始时间");
                    return false;
                }
                if (this.mainModel.vo.exam.examDate) {
                    //判断考试时间是否小于开始时间
                    var examStarTime = this.doComptime(this.mainModel.vo.startTime, this.mainModel.vo.exam.examDate);
                    if (examStarTime < 0) {
                        LIB.Msg.warning("考试时间不能少于开始时间");
                        return false;
                    }
                    //判断考试时间是否大于结束时间
                    var examEndTime = this.doComptime(this.mainModel.vo.exam.examDate, this.mainModel.vo.endTime);
                    if (examEndTime < 0) {
                        LIB.Msg.warning("考试时间不能大于结束时间");
                        return false;

                    }
                }
                return true;
            },
            afterDoSave: function (opt, res) {
                if (!!res) {
                    if (!!res.id) {
                        this.mainModel.vo.status = '0';
                        this.mainModel.vo.id = res.id;
                    }
                    if (!!res.examId) {
                        this.mainModel.vo.exam.id = res.examId;
                    }
                    this.refreshUserTableData();
                }

            }
        },
        init: function () {
            this.$api = api;
        },
        ready: function () {
        }
    });

    return detail;
});