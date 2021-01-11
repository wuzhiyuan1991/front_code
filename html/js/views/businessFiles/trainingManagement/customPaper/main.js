define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    var question = require("./question");

    // 对应课程modal
    var courseSelectModal = require("componentsEx/selectTableModal/courseSelectModal");
    //对应章节
    var kpoIntModal = require("../examPaper/dialog/kpoint");

    var rules = {
        // "code": [LIB.formRuleMgr.require("编码")],
        "name": [LIB.formRuleMgr.require("试卷名称")],
        "compId": [{required: true, message: '请选择所属公司'}],
        "replyTime": [
            LIB.formRuleMgr.require("考试时长"),
            {type: 'integer', min: 1, max: 180, message: '大小在 1 到 180 之间'}
        ],
        "type": [{required: true, message: '请选择试卷类型'},
            LIB.formRuleMgr.length()
        ],
        "score": [
            LIB.formRuleMgr.require("试卷总分"),
            {type: 'integer', min: 1, message: "试卷总分必须是正整数"}
        ]
    };

    //验证规则
    var course = {
        // "code": [LIB.formRuleMgr.require("编码")],
        "name": [LIB.formRuleMgr.require("试卷名称")],
        "compId": [{required: true, message: '请选择所属公司'},
            LIB.formRuleMgr.length()
        ],
        "orgId": [{required: true, message: '请选择所属部门'},
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
        "orgId": [{required: true, message: '请选择所属部门'},
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

    var createQuestionObject = function (name, type) {
        return {
            checked: true,
            count: 0,
            score: 0,
            points: [],
            random: false,
            randomCount: 0,
            randomPercent: 0,
            name: name,
            type: type
        }
    };
    var createVo = function () {
        return {
            code: '',
            attr2: '2',
            name: '',
            compId: '',
            score: '',
            replyTime: '',
            type: null,
            createType: '0',
            //对应课程
            //courseId:null,
            course: {id: null, name: ""},
            //对应章节
            //kpointId:null
            courseKpoint: {id: null, name: ""},
        }
    };
    var vm = LIB.VueEx.extend({
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        template: tpl,
        data: function () {
            return {
                mainModel: {
                    vo: null,
                    opType: 'create',
                    isReadOnly: false
                },
                single: {name:null,count:null,score:null},
                multiple: {name:null,count:null,score:null},
                choice: {name:null,count:null,score:null},
                rules: rules,
                questions: [],
                singleTotal: 0,
                multipleTotal: 0,
                choiceTotal: 0,
                selectModel: {
                    courseSelectModel: {
                        visible: false,
                        filterData: {type: null}
                    }
                },
                kpoint: {
                    //控制组件显示
                    title: "选择章节",
                    //显示编辑弹框
                    show: false
                },
                //是否显示章节
                showCourseKpoint: false,
            }
        },
        components: {
            question: question,
            "courseSelectModal": courseSelectModal,
            "kpoIntModal": kpoIntModal,
        },
        computed: {
            rules: function () {
                if (this.mainModel.vo.type === '1') {
                    return course;
                }
                else if (this.mainModel.vo.type === '2') {
                    return kpoint;
                }
                else {
                    return rules;
                }
            }
        },
        watch: {
            "mainModel.vo.type": function (val) {
                if (val == 1) {
                    // this.mainModel.veriFication = this.mainModel.course;
                    this.showCourseKpoint = true;
                } else if (val == 2) {
                    // this.mainModel.veriFication = this.mainModel.kpoint;
                    this.showCourseKpoint = false;
                } else {
                    // this.mainModel.veriFication = this.mainModel.rules;
                    this.showCourseKpoint = false;
                }
            },
            "single.checked": function() {
                this.calculateTotalScore();
            },
            "single.count": function() {
                this.calculateTotalScore();
            },
            "single.score": function() {
                this.calculateTotalScore();
            },
            "multiple.checked": function() {
                this.calculateTotalScore();
            },
            "multiple.count": function() {
                this.calculateTotalScore();
            },
            "multiple.score": function() {
                this.calculateTotalScore();
            },
            "choice.checked": function() {
                this.calculateTotalScore();
            },
            "choice.count": function() {
                this.calculateTotalScore();
            },
            "choice.score": function() {
                this.calculateTotalScore();
            },
            "mainModel.vo.course.id": function() {
                this._getCountByType();
            }
        },
        methods: {
            //计算总分
            calculateTotalScore:function() {
                var score = 0;
                if(this.single.checked && this.single.score > 0 && this.single.count > 0) {
                    score = score + (parseFloat(this.single.count) * parseFloat(this.single.score));
                }
                if(this.multiple.checked && this.multiple.score > 0 && this.multiple.count > 0) {
                    score = score + (parseFloat(this.multiple.count) * parseFloat(this.multiple.score));
                }
                if(this.choice.checked && this.choice.score > 0 && this.choice.count > 0) {
                    score = score + (parseFloat(this.choice.count) * parseFloat(this.choice.score));
                }
                this.mainModel.vo.score = score + "";
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
                this.mainModel.vo.courseKpoint = selectedDatas[0];
                this.kpoint.show = false;
            },
            doClearCourseKpointInput: function () {
                this.mainModel.vo.courseKpoint.id = "";
            },
            //清除课程
            doClearCourseInput: function () {
                this.mainModel.vo.course = {
                    id: null,
                    name: null
                };
                this.mainModel.vo.courseId = null;
                this.mainModel.vo.courseKpoint.id = null;
                this.mainModel.vo.courseKpoint.name = null;
            },
            //选择课程
            doShowCourseSelectModal: function () {
                this.selectModel.courseSelectModel.visible = true;
                if (this.mainModel.vo.type == 1) {
                    this.selectModel.courseSelectModel.filterData.type = 1;
                } else {
                    this.selectModel.courseSelectModel.filterData.type = null;
                }
            },
            //保存课程
            doSaveCourse: function (selectedDatas) {
                this.mainModel.vo.course = selectedDatas[0];
                this.mainModel.vo.course.id = selectedDatas[0].id;
                this.mainModel.vo.courseKpoint = {id: '', name: ''};
            },
            doPreview: function () {
                var _this = this;

                this.$refs.ruleform.validate(function (valid) {
                    if (!valid) {
                        return;
                    }
                    var params = _this._normalizeParams();
                    _this._check(params);
                    if (_this.invalid) {
                        return;
                    }
                    var str = new URLSearchParams(params).toString();
                    window.open('/front/exampaper/preview?' + str);
                })
            },
            doSave: function () {
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (!valid) {
                        return;
                    }
                    var params = _this._normalizeParams();
                    _this._check(params);
                    if (_this.invalid) {
                        return;
                    }
                    api.create(params).then(function (res) {
                        LIB.Msg.success("保存成功");
                        localStorage.setItem('custom_paper_mark', +new Date() + '');
                        setTimeout(function () {
                            window.close();

                        }, 1000)
                    })
                })
            },
            _check: function (params) {
                this.invalid = false;

                this._checkQuestion(params);

                if (this.invalid) {
                    return;
                }
                // 检查试卷总分是否一致
                //var paperScore = parseInt(this.mainModel.vo.score);
                //var totalScore = this._calculateTotalScore();
                //if (paperScore !== totalScore) {
                //    this.invalid = true;
                //    LIB.Msg.error("试卷总分与题目分数和不一致，请检查分数设置", 2);
                //}
            },
            _checkQuestion: function (params) {

                var topics = JSON.parse(params.paperTopicJson);
                if (topics.length === 0) {
                    this.invalid = true;
                    LIB.Msg.error("该试卷还未设置试题", 2);
                    return;
                }
                var single = _.find(topics, 'type', '1'),
                    multiple = _.find(topics, 'type', '2'),
                    choice = _.find(topics, 'type', '3');

                this._checkQuestionItem(this.single, single);
                this._checkQuestionItem(this.multiple, multiple);
                this._checkQuestionItem(this.choice, choice);

            },
            _checkQuestionItem: function (item, conf) {
                if (this.invalid) {
                    return;
                }
                var itemCount = item.count;
                var count;
                if (!item.checked) {
                    return;
                }
                if (item.count === 0) {
                    return;
                }
                if (!conf) {
                    this.invalid = true;
                    LIB.Msg.error(item.name + "分配题目数量之和与设置的题目总数不一致", 3);
                    return;
                }
                if (conf) {
                    count = _.reduce(conf.exampointIdNumMap, function (result, v, k) {
                        return parseInt(result) + parseInt(v)
                    }, 0);
                    if (count != itemCount) {
                        this.invalid = true;
                        LIB.Msg.error(item.name + "分配题目数量之和与设置的题目总数不一致", 3);
                    }
                }
            },
            //_calculateTotalScore: function () {
            //    var score = 0;
            //    if (this.single.checked) {
            //        score += this.single.score * this.single.count;
            //    }
            //    if (this.multiple.checked) {
            //        score += this.multiple.score * this.multiple.count;
            //    }
            //    if (this.choice.checked) {
            //        score += this.choice.score * this.choice.count;
            //    }
            //    return score;
            //},
            _normalizeParams: function () {
                var params = _.clone(this.mainModel.vo);
                var paperTopics = [];
                var topic;
                var single = this.single;
                var multiple = this.multiple;
                var choice = this.choice;
                if (single.checked) {
                    topic = {
                        name: single.name,
                        type: single.type,
                        score: single.score,
                        exampointIdNumMap: this._normalizeIdNumMap(single)
                    };
                    if (!_.isEmpty(topic.exampointIdNumMap)) {
                        paperTopics.push(topic);
                    }
                }
                if (multiple.checked) {
                    topic = {
                        name: multiple.name,
                        type: multiple.type,
                        score: multiple.score,
                        exampointIdNumMap: this._normalizeIdNumMap(multiple)
                    };
                    if (!_.isEmpty(topic.exampointIdNumMap)) {
                        paperTopics.push(topic);
                    }
                }
                if (choice.checked) {
                    topic = {
                        name: choice.name,
                        type: choice.type,
                        score: choice.score,
                        exampointIdNumMap: this._normalizeIdNumMap(choice)
                    };
                    if (!_.isEmpty(topic.exampointIdNumMap)) {
                        paperTopics.push(topic);
                    }
                }
                params.paperTopicJson = JSON.stringify(paperTopics);
                return params;
            },
            _normalizeIdNumMap: function (question) {
                var points = question.points;
                var ret = {};
                _.forEach(points, function (v) {
                    if (v.count > 0) {
                        ret[v.id] = v.count
                    }
                });
                if (question.random) {
                    ret.random = question.randomCount;
                }
                return ret;
            },
            doClosePage: function () {
                window.close();
            },
            _getCountByType: function () {
                var _this = this;
                if(!!this.mainModel.vo.course.id) {
                    api.queryExamPointByCourseId({id: this.mainModel.vo.course.id}).then(function (res) {
                        var pointIds = _.pluck(res.data.list, "id");
                        api.getQuetionStatistic({examPointIds: pointIds.join(",")}).then(function (res) {
                            var num = res.body;
                            _this.singleTotal = 0;
                            _this.multipleTotal = 0;
                            _this.choiceTotal = 0;
                            for (var key in num) {
                                if (key == 1) {
                                    _this.singleTotal = parseInt(num[key] || 0);
                                } else if (key == 2) {
                                    _this.multipleTotal = parseInt(num[key] || 0);
                                } else {
                                    _this.choiceTotal = parseInt(num[key] || 0);
                                }
                            }

                        })
                    });
                }else{
                    api.getCountByType().then(function (res) {
                        var data = res.data;
                        _this.singleTotal = parseInt(data['1']) || 0;
                        _this.multipleTotal = parseInt(data['2']) || 0;
                        _this.choiceTotal =parseInt(data['3']) || 0;
                    })
                }
            },

            doUpdateStrategic: function () {
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (!valid) {
                        return;
                    }
                    _this.beforeSingle = _.cloneDeep(_this.single);
                    _this.beforeMultiple = _.cloneDeep(_this.multiple);
                    _this.beforeChoice = _.cloneDeep(_this.choice);
                });
            },
            doSaveExamPoints: function () {
                var params = this._normalizeParams();
                this._check(params);
                if (this.invalid) {
                    return;
                }

                this._normalizeQuestionTypes();
            },
            _normalizeQuestionTypes: function () {
                var ret = [];
                var topic;
                var single = this.single;
                var multiple = this.multiple;
                var choice = this.choice;
                if (single.checked) {
                    topic = {
                        name: single.name,
                        score: single.score,
                        count: single.count
                    };
                    if (single.count > 0) {
                        ret.push(topic);
                    }

                }
                if (multiple.checked) {
                    topic = {
                        name: multiple.name,
                        score: multiple.score,
                        count: multiple.count
                    };
                    if (multiple.count > 0) {
                        ret.push(topic);
                    }
                }
                if (choice.checked) {
                    topic = {
                        name: choice.name,
                        score: choice.score,
                        count: choice.count
                    };
                    if (choice.count > 0) {
                        ret.push(topic);
                    }
                }
                this.questions = ret;
            }
        },
        events: {

        },
        init: function () {
            this.$api = api;
            this.invalid = false; // 验证数据是否合理
        },
        ready: function () {
            this.$refs.ruleform.resetFields();
            this.mainModel.vo = createVo();
            this.single = createQuestionObject('单选题', '1');
            this.multiple = createQuestionObject('多选题', '2');
            this.choice = createQuestionObject('判断题', '3');
            this.questions = [];
            this.invalid = false; // 验证数据是否合理
            this._getCountByType();
            this.mainModel.vo.compId = LIB.user.compId;
        }
    });

    return vm;
});
