define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail.html");
    var paperTopicFormModal = require("componentsEx/formModal/paperTopicFormModal");
    var examPointSelectModal = require("componentsEx/selectTableModal/examPointSelectModal");
    // 对应课程modal
    var courseSelectModal = require("componentsEx/selectTableModal/courseSelectModal");
    //对应章节
    var kpoIntModal = require("./dialog/kpoint");
    var tempExamPoints = [];// 添加前的知识点列表

    //选择知识点
    require("componentsEx/treeModal/treeModal");

    //验证规则
    var rules = {
        // "code": [LIB.formRuleMgr.require("编码")],
        "name": [LIB.formRuleMgr.require("试卷名称")],
        "compId": [{required: true, message: '请选择所属公司'},
            LIB.formRuleMgr.length()
        ],
        "type": [{required: true, message: '请选择试卷类型'},
            LIB.formRuleMgr.length()
        ],
        "replyTime": [LIB.formRuleMgr.require("考试时长"),
            {type: 'integer', min: 1, max: 180, message: '大小在 1 到 180 之间'}],
    };
    //验证规则
    var course = {
        // "code": [LIB.formRuleMgr.require("编码")],
        "name": [LIB.formRuleMgr.require("试卷名称")],
        "compId": [{required: true, message: '请选择所属公司'},
            LIB.formRuleMgr.length()
        ],
        "replyTime": [LIB.formRuleMgr.require("考试时长"),
            {type: 'integer', min: 1, max: 180, message: '大小在 1 到 180 之间'}],
        "course.id": [{required: true, message: '请选择对应课程'},
            LIB.formRuleMgr.length()
        ],
        "type": [{required: true, message: '请选择试卷类型'},
            LIB.formRuleMgr.length()
        ],
        "courseKpoint.id": [{required: true, message: '请选择对应章节'},
            LIB.formRuleMgr.length()
        ]
    };
    //验证规则
    var kpoint = {
        // "code": [LIB.formRuleMgr.require("编码")],
        "name": [LIB.formRuleMgr.require("试卷名称")],
        "compId": [{required: true, message: '请选择所属公司'},
            LIB.formRuleMgr.length()
        ],
        "type": [{required: true, message: '请选择试卷类型'},
            LIB.formRuleMgr.length()
        ],
        "replyTime": [LIB.formRuleMgr.require("考试时长"),
            {type: 'integer', min: 1, max: 180, message: '大小在 1 到 180 之间'}],
        "course.id": [{required: true, message: '请选择对应课程'},
            LIB.formRuleMgr.length()
        ]
    };
    //初始化数据模型
    var newVO = function () {
        return {
            //主键
            id: null,
            //唯一标识
            code: null,
            //试卷名称
            name: null,
            //
            compId: null,
            //限制答题的时间 单位分钟
            replyTime: null,
            //试卷总分
            score: null,
            //试卷类型 0手动组卷 1随机组卷
            type: null,
            createType: 1,
            //大题
            paperTopics: [],
            //知识点
            examPoints: [],
            //对应课程
            course: {id: null, name: ""},
            //对应章节
            courseKpoint: {id: null, name: ""}
        }
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: ""
        },
        formModel: {
            paperTopicFormModel: {
                show: false,
                queryUrl: "exampaper/{id}/papertopic/{paperTopicId}"
            }
        },
        selectModel: {
            examPointSelectModel: {
                visible: false,
                filterData: {orgId: null}
            },
            courseSelectModel: {
                visible: false,
                filterData: null
            }
        },
        examPointModel: {
            visible: false,
            examPointModelData: null,
            title: "选择知识点"

        },
        //新增的时候定义的桥接变量
        //单选
        customPaperTopic: {type: false, num: "", score: ""},
        customLength: null,
        //多选
        multiplePaperTopic: {type: false, num: "", score: ""},
        multipleLength: null,
        //判断
        judgmentPaperTopic: {type: false, num: "", score: ""},
        judgmentLength: null,
        kpoint: {
            //控制组件显示
            title: "选择章节",
            //显示编辑弹框
            show: false
        },
        //是否显示章节
        showCourseKpoint: false
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
            "papertopicFormModal": paperTopicFormModal,
            "exampointSelectModal": examPointSelectModal,
            "courseSelectModal": courseSelectModal,
            "kpoIntModal": kpoIntModal
        },
        data: function () {
            return dataModel;
        },
        computed: {
            total: function () {
                var _this = this;
                if (_this.customPaperTopic.score || _this.multiplePaperTopic.score || _this.judgmentPaperTopic.score) {
                    var radio = (_this.customPaperTopic.num <= 0) ? 0 : _this.customPaperTopic.score * _this.customPaperTopic.num;
                    var multiple = (_this.multiplePaperTopic.num <= 0) ? 0 : _this.multiplePaperTopic.score * _this.multiplePaperTopic.num;
                    var judgment = (_this.judgmentPaperTopic.num <= 0) ? 0 : _this.judgmentPaperTopic.score * _this.judgmentPaperTopic.num;
                    return Number(radio) + Number(multiple) + Number(judgment);
                }
            },
            rules: function () {
                if (this.mainModel.isReadOnly) {
                    return {}
                }
                if (this.mainModel.opType === 'create') {
                    if(this.mainModel.vo.type === '1') {
                        return course;
                    }
                    else if(this.mainModel.vo.type === '2') {
                        return kpoint;
                    }
                    else {
                        return rules;
                    }
                }

                if(this.mainModel.vo.type === '1') {
                    return _.assign(_.cloneDeep(course), {code: LIB.formRuleMgr.codeRule()})
                }
                else if(this.mainModel.vo.type === '2') {
                    return _.assign(_.cloneDeep(kpoint), {code: LIB.formRuleMgr.codeRule()})
                }
                else {
                    return _.assign(_.cloneDeep(rules), {code: LIB.formRuleMgr.codeRule()})
                }
            }
        },
        watch: {
            "customPaperTopic.type": function (val) {
                if (val == false) {
                    this.customPaperTopic.num = "";
                    this.customPaperTopic.score = "";
                }
            },
            "multiplePaperTopic.type": function (val) {
                if (val == false) {
                    this.multiplePaperTopic.num = "";
                    this.multiplePaperTopic.score = "";
                }
            },
            "judgmentPaperTopic.type": function (val) {
                if (val == false) {
                    this.judgmentPaperTopic.num = "";
                    this.judgmentPaperTopic.score = "";
                }
            },
            "customPaperTopic.num": function (val) {
                var num = parseInt(val);
                var customLength = parseInt(this.customLength);
                if (!isNaN(num) && num > 0
                    && num > customLength
                    && this.mainModel.opType != "view") {
                    this.customPaperTopic.num = null;
                }
            },
            "multiplePaperTopic.num": function (val) {
                var num = parseInt(val);
                var multipleLength = parseInt(this.multipleLength);
                if (!isNaN(num) && num > 0
                    && num > multipleLength
                    && this.mainModel.opType != "view") {
                    this.multiplePaperTopic.num = null;
                }
            },
            "judgmentPaperTopic.num": function (val) {
                var num = parseInt(val);
                var judgmentLength = parseInt(this.judgmentLength);
                if (!isNaN(num) && num > 0
                    && num > judgmentLength
                    && this.mainModel.opType != "view") {
                    this.judgmentPaperTopic.num = null;
                }
            },
            "customPaperTopic.score": function (val) {
                if (val.length > 0 && val <= 0) {
                    this.customPaperTopic.score = 0;
                }
            },
            "multiplePaperTopic.score": function (val) {
                if (val.length > 0 && val <= 0) {
                    this.multiplePaperTopic.score = 0;
                }
            },
            "judgmentPaperTopic.score": function (val) {
                if (val.length > 0 && val <= 0) {
                    this.judgmentPaperTopic.score = 0;
                }
            },
            "mainModel.vo.type": function (val) {
                if (val == 1) {
                    // this.mainModel.veriFication = this.mainModel.course;
                    this.showCourseKpoint = true;
                } else if (val == 2) {
                    // this.mainModel.veriFication = this.mainModel.kpoint;
                    this.showCourseKpoint = false;
                    this.mainModel.vo.courseKpoint = {id: '', name: ''};
                } else {
                    // this.mainModel.veriFication = this.mainModel.rules;
                    this.showCourseKpoint = false;
                    this.mainModel.vo.courseKpoint = {id: '', name: ''};
                }

            }
        },
        methods: {
            newVO: newVO,
            doPreview: function () {
                window.open(LIB.ctxPath("/front/exampaper/view/" + this.mainModel.vo.id));
            },
            //选择章节
            doShowKpointModel: function () {
                if (this.mainModel.vo.course.id) {
                    this.kpoint.show = true;
                    this.$broadcast('ev_editReload', this.mainModel.vo.course.id);
                } else {
                    LIB.Msg.warning("请重新选择,对应课程!");
                }

            },
            //保存章节
            doSaveKpoint: function (selectedDatas) {
                this.mainModel.vo.courseKpoint.id = selectedDatas[0].id;
                this.mainModel.vo.courseKpoint.name = selectedDatas[0].name;
                this.kpoint.show = false;
            },
            doClearCourseKpointInput: function () {
                this.mainModel.vo.courseKpoint = {id: null, name: ""};
            },
            //清除课程
            doClearCourseInput: function () {
                this.mainModel.vo.course = {id: null, name: ""};
                this.mainModel.vo.courseKpoint.id = "";
                this.mainModel.vo.courseKpoint.name = "";
                this._resetQuestionAfterChangeCourse();
            },
            //选择课程
            doShowCourseSelectModal: function () {
                if (this.mainModel.vo.type === '1') {
                    this.selectModel.courseSelectModel.filterData = {type: 1};
                } else {
                    this.selectModel.courseSelectModel.filterData = null;
                }
                this.selectModel.courseSelectModel.visible = true;

            },
            _getPointIdsByCourseId: function (m) {
                var _this = this;
                api.queryExamPointByCourseId({id: this.mainModel.vo.course.id}).then(function (res) {
                    _this.coursePointIds = _.pluck(res.data.list, "id");
                    if (m && _this.coursePointIds.length > 0) {
                        this._getQuestionCount();
                    }
                });
            },
            //保存课程
            doSaveCourse: function (selectedDatas) {
                var row = selectedDatas[0];
                if (row.id === this.mainModel.vo.course.id) {
                    return;
                }
                this.mainModel.vo.course.id = row.id;
                this.mainModel.vo.course.name = row.name;
                this.mainModel.vo.courseKpoint = {id: '', name: ''};
                this._getPointIdsByCourseId();
                this._resetQuestionAfterChangeCourse();
            },
            _resetQuestionAfterChangeCourse: function () {
                this.customPaperTopic = {type: false, num: "", score: ""};
                this.multiplePaperTopic = {type: false, num: "", score: ""};
                this.judgmentPaperTopic = {type: false, num: "", score: ""};
                this.customLength = null;
                this.multipleLength = null;
                this.judgmentLength = null;
            },

            doShowPaperTopicFormModal4Update: function (param) {
                this.formModel.paperTopicFormModel.show = true;
                this.$refs.papertopicFormModal.init("update", {id: this.mainModel.vo.id, paperTopicId: param.entry.data.id});
            },
            doShowPaperTopicFormModal4Create: function (param) {
                this.formModel.paperTopicFormModel.show = true;
                this.$refs.papertopicFormModal.init("create");
            },
            doSavePaperTopic: function (data) {
                if (data) {
                    var _this = this;
                    api.savePaperTopic({id: this.mainModel.vo.id}, data).then(function () {
                        _this.refreshTableData(_this.$refs.papertopicTable);

                    });
                }
            },
            doUpdatePaperTopic: function (data) {
                if (data) {
                    var _this = this;
                    api.updatePaperTopic({id: this.mainModel.vo.id}, data).then(function () {
                        _this.refreshTableData(_this.$refs.papertopicTable);
                    });
                }
            },

            _getAllExamPoints: function () {
                var _this = this;
                api.queryExampoint().then(function (res) {
                    _this.examPointModel.examPointModelData = res.body
                })
            },
            _getExamPointsByCourseId: function () {
                var _this = this;
                api.queryExamPointByCourseId({id:this.mainModel.vo.course.id}).then(function (res) {
                    var list = res.data.list;
                    if (_.isEmpty(list)) {
                        _this._getAllExamPoints();
                        return;
                    }
                    _this.examPointModel.examPointModelData = list
                })
            },
            doShowExamPointSelectModal: function () {
                var _this = this;
                _this.examPointModel.visible = true;
                if (this.mainModel.vo.course.id) {
                    this._getExamPointsByCourseId();
                } else {
                    this._getAllExamPoints();
                }
            },
            doSaveExamPoints: function (selectedDatas) {
                var _this = this;
                if (selectedDatas) {
                    //两数组去重
                    if (_this.mainModel.vo.examPoints.length > 0) {
                        _.each(_this.mainModel.vo.examPoints, function (data) {
                            _.each(selectedDatas, function (item, index) {
                                if (item.id == data.id) {
                                    //_this.mainModel.vo.examPoints.splice(index,1);
                                    selectedDatas.splice(index, 1);
                                    return false
                                }
                            })
                        })
                    }
                    _this.mainModel.vo.examPoints = _this.mainModel.vo.examPoints.concat(selectedDatas);
                    _this.doRefreshTable();
                }
            },
            doRefreshTable: function () {
                var _this = this;
                var arr = _.map(_this.mainModel.vo.examPoints, function (item) {
                    return item.id
                });
                if (_.isEmpty(this.mainModel.vo.examPoints) && this.mainModel.vo.course.id) {
                    arr = this.coursePointIds;
                }
                _this.doRefreshType(arr);
            },
            //添加修改知识点的时候 刷新题型
            doRefreshType: function (arr) {
                var _this = this;
                var data = arr.join(",");
                //customNum multipleNum judgmentNum 是通过知识点获取到的题型数据
                var customNum, multipleNum, judgmentNum;
                api.getQuetionStatistic({examPointIds: data}).then(function (res) {
                    var num = res.body;
                    for (var key in num) {
                        if (key == 1) {
                            customNum = num[key];
                        } else if (key == 2) {
                            multipleNum = num[key];
                        } else {
                            judgmentNum = num[key];
                        }
                    }
                    //sigleTopic 单选题数目  multipleTopic多选题数目 trueOrFlaleTopic 判断题数目
                    var sigleTopic = customNum || 0,
                        multipleTopic = multipleNum || 0, 
                        trueOrFlaleTopic = judgmentNum || 0;

                    _this.customLength = sigleTopic;
                    _this.multipleLength = multipleTopic;
                    _this.judgmentLength = trueOrFlaleTopic;
                    //判断之前输入的题数是否大于 通过知识点获取到的题型总数 如果大于 就清空题型
                    if (parseInt(_this.customPaperTopic.num) > parseInt(sigleTopic) || parseInt(_this.multiplePaperTopic.num) > parseInt(multipleTopic) ||
                        parseInt(_this.judgmentPaperTopic.num) > parseInt(trueOrFlaleTopic)) {
                        _this.doReustNum(sigleTopic, multipleTopic, trueOrFlaleTopic);
                    }
                });
            },
            //重置题型数
            doReustNum: function (sigleTopic, multipleTopic, trueOrFlaleTopic) {
                if (parseInt(this.customPaperTopic.num) > parseInt(sigleTopic)) {
                    this.customPaperTopic.num = null;
                }
                if (parseInt(this.multiplePaperTopic.num) > parseInt(multipleTopic)) {
                    this.multiplePaperTopic.num = null;
                }
                if (parseInt(this.judgmentPaperTopic.num) > parseInt(trueOrFlaleTopic)) {
                    this.judgmentPaperTopic.num = null;
                }
            },
            //删除知识点时候
            doRemoveExamPoints: function (index) {
                this.mainModel.vo.examPoints.splice(index, 1);
                var arr = _.map(this.mainModel.vo.examPoints, function (item) {
                    return item.id
                });
                this.doRefreshType(arr);
            },

            _getQuestionCount: function () {
                var _this = this;
                if (_this.mainModel.vo.examPoints.length > 0 || !_.isEmpty(this.coursePointIds)) {
                    _this.doRefreshTable()
                } else {
                    api.getQuetionList({type: 3}).then(function (res) {
                        _this.judgmentLength = res.data.length;
                    });
                    api.getQuetionList({type: 2}).then(function (res) {
                        _this.multipleLength = res.data.length;
                    });
                    api.getQuetionList({type: 1}).then(function (res) {
                        _this.customLength = res.data.length;
                    });
                }
            },
            afterInitData: function () {
                var _this = this;

                var callback = function (res1) {
                    _this.mainModel.vo.examPoints = res1.data;
                    //查询题型
                    _this._getQuestionCount();
                    setTimeout(function () {
                        api.queryPaperTopics({id: _this.mainModel.vo.id}).then(function (res) {
                            var paperTopics = res.data;
                            _.each(paperTopics, function (item) {
                                //单选
                                if (item.type == "1") {
                                    _this.customPaperTopic = {
                                        type: true,
                                        num: item.num,
                                        score: item.score
                                    }
                                    //多选
                                } else if (item.type == "2") {
                                    _this.multiplePaperTopic = {
                                        type: true,
                                        num: item.num,
                                        score: item.score
                                    }
                                    //判断
                                } else if (item.type == "3") {
                                    _this.judgmentPaperTopic = {
                                        type: true,
                                        num: item.num,
                                        score: item.score
                                    }
                                }
                            })

                        })
                    }, 0)
                }
                api.getQuetionType({id: _this.mainModel.vo.id}).then(callback);

                if (this.mainModel.vo.course.id) {
                    this._getPointIdsByCourseId(1);
                }
            },

            beforeInit: function (data, opType) {
               this._resetQuestionAfterChangeCourse();
                this.mainModel.vo.examPoints = [];
                // if (opType.opType == "create") {
                //     this.mainModel.veriFication = this.mainModel.rules;
                // }
            },
            afterDoEdit: function () {
                // 添加前备份知识点
                tempExamPoints = this.mainModel.vo.examPoints;
            },
            // 保存前验证
            afterFormValidate: function () {
                if (this.customPaperTopic.type) {
                    if (this.customPaperTopic.num < 1) {
                        LIB.Msg.error("请输入单选题数量");
                        return false;
                    } 
                    if (this.customPaperTopic.score < 1 || this.customPaperTopic.score > 10) {
                        LIB.Msg.error("单选题每题分数为1-10之间的正整数");
                        return false;
                    }
                }
                if (this.multiplePaperTopic.type) {
                    if (this.multiplePaperTopic.num < 1) {
                        LIB.Msg.error("请输入多选题数量");
                        return false;
                    }
                    if (this.multiplePaperTopic.score < 1 || this.multiplePaperTopic.score > 10) {
                        LIB.Msg.error("多选题每题分数为1-10之间的正整数");
                        return false;
                    }
                }
                if (this.judgmentPaperTopic.type) {
                    if (this.judgmentPaperTopic.num < 1) {
                        LIB.Msg.error("请输入判断题数量");
                        return false;
                    }
                    if (this.judgmentPaperTopic.score < 1 || this.judgmentPaperTopic.score > 10) {
                        LIB.Msg.error("判断题每题分数为1-10之间的正整数");
                        return false;
                    }
                }

                return true;
            },
            // 保存之前
            beforeDoSave: function () {
                this.mainModel.vo.paperTopics = [];

                if (this.customPaperTopic.type && this.customPaperTopic.num && this.customPaperTopic.score) {
                    var customPaperTopic = {
                        type: "1",
                        num: this.customPaperTopic.num,
                        score: this.customPaperTopic.score
                    };
                    this.mainModel.vo.paperTopics.push(customPaperTopic);
                }

                if (this.multiplePaperTopic.type && this.multiplePaperTopic.num && this.multiplePaperTopic.score) {
                    var multiplePaperTopic = {
                        type: "2",
                        num: this.multiplePaperTopic.num,
                        score: this.multiplePaperTopic.score
                    };
                    this.mainModel.vo.paperTopics.push(multiplePaperTopic);
                }

                if (this.judgmentPaperTopic.type && this.judgmentPaperTopic.num && this.judgmentPaperTopic.score) {
                    var judgmentPaperTopic = {
                        type: "3",
                        num: this.judgmentPaperTopic.num,
                        score: this.judgmentPaperTopic.score
                    };
                    this.mainModel.vo.paperTopics.push(judgmentPaperTopic);
                }

                this.mainModel.vo.score = this.total;
               
            },
            buildSaveData: function () {
                var _strValue = {};
                if(!this.mainModel.vo.course.id) {
                    _strValue.courseId_empty = '1';
                }
                if(!_.isEmpty(_strValue)) {
                    this.mainModel.vo["criteria"] = {
                        strValue: _strValue
                    };
                }
                return this.mainModel.vo;
            },

            // 取消之后
            afterDoCancel: function () {
                this.mainModel.vo.examPoints = tempExamPoints; // 还原知识点
            },

            // 单选题多选框改变回调
            doCustomPaperTopic: function () {
                var _this = this;
                if (_this.customPaperTopic.type) {
                    if (_this.mainModel.vo.examPoints.length > 0 || !_.isEmpty(this.coursePointIds)) {
                        _this.doRefreshTable()
                    } else {
                        api.getQuetionList({type: 1}).then(function (res) {
                            _this.customLength = res.data.length;
                        })
                    }

                }
            },

            // 多选题多选框改变回调
            doMultiplePaperTopic: function () {
                var _this = this;
                if (_this.multiplePaperTopic.type) {
                    if (_this.mainModel.vo.examPoints.length > 0 || !_.isEmpty(this.coursePointIds)) {
                        _this.doRefreshTable()
                    }
                    else {
                        api.getQuetionList({type: 2}).then(function (res) {
                            _this.multipleLength = res.data.length;
                        })
                    }
                }
            },

            // 判断题多选框改变回调
            doJudgmentPaperTopic: function () {
                var _this = this;
                if (_this.judgmentPaperTopic.type) {
                    if (_this.mainModel.vo.examPoints.length > 0 || !_.isEmpty(this.coursePointIds)) {
                        _this.doRefreshTable()
                    } else {
                        api.getQuetionList({type: 3}).then(function (res) {
                            _this.judgmentLength = res.data.length;
                        })
                    }
                }
            }

        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return detail;
});
