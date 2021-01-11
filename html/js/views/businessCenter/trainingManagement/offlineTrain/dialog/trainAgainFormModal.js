define(function (require) {
    //基础js
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var template = LIB.renderHTML(require("text!./trainAgainFormModal.html"));
    var courseSelectModal = require("componentsEx/selectTableModal/courseSelectModal");
    var userSelectModal = require("componentsEx/selectTableModal/retrainUserSelectModal");


    var newVO = function () {
        return {
            //培训计划id
            id: null,
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
            isOver: false
        }
    };
    var now = new Date();
    var beginDate = now.Format("yyyy-MM-dd 00:00:00");

    var dataModel = {
        title: "安排复培课程",
        mainModel: {
            vo: null,
            //验证规则
            rules: {
                "course.id": [{required: true, message: '请选择课程'}],
                "startTime": [{required: true, message: '请输入开始时间'}],
                "endTime": [{required: true, message: '请输入结束时间'}],

                "compId": [{required: true, message: '请选择所属公司'}],
                "exam.examDate": [
                    LIB.formRuleMgr.require("考试开始时间"),
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
                    LIB.formRuleMgr.require("考试结束时间"),
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
                    LIB.formRuleMgr.require("通过分数"),
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
                trainTasks: [{required: true, type: 'array', message: '请选择复培人员'}],
                "exam.examPaper.id": [LIB.formRuleMgr.require("试卷")]
            },
            now: (now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate())
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
                filterData: {"course.id": null}
            }
        },
        withExam: false,
        isCourseExamExist: false,
        users: null
    };
    var component = LIB.Vue.extend({
        template: template,
        components: {
            "courseSelectModal": courseSelectModal,
            "user-select-modal": userSelectModal
        },
        props: {
            id: {
                type: String
            },
            visible: {
                type: Boolean,
                default: false
            }
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
            }
        },
        watch: {
            "visible": function (val) {
                val && this._init()
            }
        },
        methods: {

            _init: function () {
                this.mainModel.vo = newVO();
                this.withExam = false;
                this.isCourseExamExist = false;
                this.users = [];
            },
            // 选择课程
            doShowCourseSelectModal: function () {
                this.selectModel.courseSelectModel.filterData = {disable: 0, "criteria.intsValue.type": [2, 3]};
                this.selectModel.courseSelectModel.visible = true;
            },
            doSaveCourse: function (selectedDatas) {
                var row = _.isArray(selectedDatas) ? selectedDatas[0] : null;
                if (!row) {
                    return;
                }
                this.mainModel.vo.course.id = row.id;
                this.mainModel.vo.course.name = row.name;
                this.doClearInput();

                this._checkCourseExamExist(row.id);
            },
            _checkCourseExamExist: function (id) {
                var _this = this;
                var param = {
                    'course.id': id,
                    type: 3,
                    'criteria.intValue': {selectWithQuestion: 1}
                };
                api.queryExamsByCourseId(param).then(function (res) {
                    _this.isCourseExamExist = (res.data.total > 0);
                })
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
            doPreview: function (data) {
                window.open(LIB.ctxPath("/front/exampaper/preview/" + data[0].id));
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
            doClearInput: function () {
                this.mainModel.vo.exam.examPaper.id = null;
                this.mainModel.vo.exam.examPaper.name = null;
                this.mainModel.vo.exam.examPaper.score = null;
                this.mainModel.vo.exam.examDate = null;
                this.mainModel.vo.exam.passLine = null;
                this.mainModel.vo.exam.paperId = null;
                this.mainModel.vo.exam.entryDeadline = '';
                this.withExam = false;
            },
            doShowUserSelectModal: function () {
                this.selectModel.userSelectModel.visible = true;
                this.selectModel.userSelectModel.filterData = {
                    orgId: this.mainModel.vo.compId,
                    "course.id": this.mainModel.vo.course.id
                };
            },
            doSaveUsers: function (rows) {
                this.mainModel.vo.trainTasks = _.map(rows, function (item) {
                    return {
                        user: {id: item.user.id},
                        compId: item.compId,
                        orgId: item.orgId
                    }
                });
                this.users = _.map(rows, function (item) {
                    return {
                        id: item.user.id,
                        name: item.user.name
                    }
                })
            },

            doSave: function (status) {
                var param = _.cloneDeep(this.mainModel.vo);

                var _this = this;
                param.status = status;
                this.$refs.ruleform.validate(function(valid) {
                    if (valid) {
                        api.create(param).then(function (res) {
                            LIB.Msg.success("生成计划成功");
                            _this.$emit("do-save")
                        })
                    }
                })

            }

        }
    });

    return component;
});