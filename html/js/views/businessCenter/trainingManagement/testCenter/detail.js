define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail.html");
    var examPaperSelectModal = require("componentsEx/selectTableModal/examPaperSelectModal");
    var examSelectModal = require("componentsEx/selectTableModal/examSelectModal");
    var paperRecordSelectModal = require("componentsEx/selectTableModal/paperRecordSelectModal");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var examPointSelectModal = require("componentsEx/selectTableModal/examPointSelectModal");

    //选择知识点
    require("componentsEx/treeModal/treeModal");

    //初始化数据模型
    var newVO = function () {
        return {
            //考试日程id
            id: null,
            ////唯一标识
            code: null,
            ////禁用标识， 1:已禁用，0：未禁用，null:未禁用
            //disable : null,
            ////考试结束时间
            //endTime : null,
            ////考试开始时间
            //startTime : null,
            ////状态 0待开始 1已开始 2已结束
            status: null,
            ////修改日期
            //modifyDate : null,
            ////创建日期
            //createDate : null,
            ////试卷
            //examPaper : {id:'', name:''},
            ////考试计划
            //exam : {id:'', name:''},
            ////考试记录
            paperRecord: {id: '', name: '', testTime: null, userScore: null, testTime: null},
            examSubmit: null,
            ////用户
            //user : {id:'', name:''},
            score: null,
            //大题
            paperTopics: [],
            //知识点
            examPoints: [],
            examPaper: {name: null, replyTime: null, score: null, createType: ""},
            exam: {examDate: null,entryDeadline:null, place: null, remarks: null},
            result: null
        }
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "",

            //验证规则
            rules: {},
            emptyRules: {}
        },
        formModel: {},
        selectModel: {
            examPaperSelectModel: {
                visible: false,
                filterData: {orgId: null}
            },
            examSelectModel: {
                visible: false,
                filterData: {orgId: null}
            },
            paperRecordSelectModel: {
                visible: false,
                filterData: {orgId: null}
            },
            userSelectModel: {
                visible: false,
                filterData: {orgId: null}
            },
            examPointSelectModel: {
                visible: false,
                filterData: {orgId: null}
            },
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
        //考试成绩
        userScore: null,
        isExamQstOpenForExercise:false//“考题”类型的试题是否可以随机练习
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
            "exampaperSelectModal": examPaperSelectModal,
            "examSelectModal": examSelectModal,
            "paperrecordSelectModal": paperRecordSelectModal,
            "userSelectModal": userSelectModal,
            "exampointSelectModal": examPointSelectModal

        },
        data: function () {
            return dataModel;
        },
        computed: {
            title: function () {
                return this.mainModel.opType === 'create' ? '随机练习' : '详情';
            },
            total: function () {
                var _this = this;
                if (_this.customPaperTopic.score || _this.multiplePaperTopic.score || _this.judgmentPaperTopic.score) {
                    var radio = (_this.customPaperTopic.num <= 0) ? _this.customPaperTopic.score : _this.customPaperTopic.score * _this.customPaperTopic.num;
                    var multiple = (_this.multiplePaperTopic.num <= 0) ? _this.multiplePaperTopic.score : _this.multiplePaperTopic.score * _this.multiplePaperTopic.num;
                    var judgment = (_this.judgmentPaperTopic.num <= 0) ? _this.judgmentPaperTopic.score : _this.judgmentPaperTopic.score * _this.judgmentPaperTopic.num;
                    return Number(radio) + Number(multiple) + Number(judgment);
                }
            },
            statusValue: function () {
                var value = this.mainModel.vo.status;
                if(this.mainModel.vo.disable == 1){
                	return "已取消";
                }else if (value == 0) {
                    return "待开始";
                } else if (value == 1 && this.mainModel.vo.examSubmit) {
                    return "已交卷";
                } else if (value == 1 && !this.mainModel.vo.examSubmit) {
                    return "已开始";
                } else if (value == 2 && this.mainModel.vo.examSubmit) {
                    return "已结束";
                } else if (value == 2 && !this.mainModel.vo.examSubmit) {
                    return "缺考";
                }
            },
            testTime: function () {
                if (this.mainModel.vo.paperRecord.testTime) {
                    var seconds = parseInt(this.mainModel.vo.paperRecord.testTime);// 秒
                    if(_.isNaN(seconds)) {
                        return '';
                    }
                    var hours = Math.floor(seconds / 3600);
                    seconds = seconds - hours * 3600;
                    var minutes = Math.floor(seconds / 60);
                    seconds = seconds - minutes * 60;

                    var result = '';
                    result += hours > 0 ? hours + '时' : '';
                    result += minutes > 0 ? minutes + '分' : '';
                    result += seconds > 0 ? seconds + '秒' : '';

                    return result;
                } else {
                    return ''
                }
            },

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
                if (val && val.length > 0 && val <= 0 || val > this.customLength) {
                    this.customPaperTopic.num = null;
                }
            },
            "multiplePaperTopic.num": function (val) {
                if (val && val.length > 0 && val <= 0 || val > this.multipleLength) {
                    this.multiplePaperTopic.num = null;
                }
            },
            "judgmentPaperTopic.num": function (val) {
                if (val && val.length > 0 && val <= 0 || val > this.judgmentLength) {
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
            }
        },
        methods: {
            newVO: newVO,
            doStartExaming: function () {
                var _this = this;
                if (this.mainModel.vo.userId == LIB.user.id) {
                    if (this.mainModel.vo.status == 0) {
                        LIB.Msg.warning("未到考试时间");
                        return;
                    } else if (this.mainModel.vo.status == 2) {
                        LIB.Msg.warning("考试已结束");
                        return;
                    } else {
                        api.queryTrainTaskStatus({id : this.mainModel.vo.id}).then(function (res) {
                            if (res.data == true) {
                                window.open(LIB.ctxPath("/front/examschedule/" + _this.mainModel.vo.id + "/exam"));
                            } else {
                                LIB.Msg.warning("培训任务未通过,不能进入考试");
                                return;
                            }
                        })
                    }
                } else {
                    LIB.Msg.warning("只能参加自己的考试");
                    return;
                }
            },
            doShowReport: function () {
                if (this.mainModel.vo.user.id == LIB.user.id) {
                    if (this.mainModel.vo.status != 2) {
                        LIB.Msg.warning("所有人都完成考试后方可查看解析");
                        return;
                    }
                    if (this.mainModel.vo.paperRecord == null && !!this.mainModel.vo.examSubmit) {
                        LIB.Msg.warning("系统正在评分中，请稍候");
                        return;
                    } else {
                        window.open(LIB.ctxPath("/front/examschedule/" + this.mainModel.vo.id + "/report"));
                    }
                } else {
                    LIB.Msg.warning("只能查看自己的试卷解析");
                    return;
                }
            },
            doShowExamPointSelectModel: function () {
                /*this.selectModel.examPointSelectModel.visible = true;*/
                var _this = this;
                _this.examPointModel.visible = true;
                api.queryExampoint().then(function (res) {
                    _this.examPointModel.examPointModelData = res.body
                })
            },
            doSaveExamPoints: function (selectedDatas) {
                var _this = this;
                var arr = selectedDatas;
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
                _this.doRefreshType(arr);
            },
            //添加修改知识点的时候 刷新题型
            doRefreshType: function (arr) {
                var _this = this;
                var data = arr.join(",");
                //customNum multipleNum judgmentNum 是通过知识点获取到的题型数据
                var customNum, multipleNum, judgmentNum;
                api.getQuetionStatistic({examPointIds: data, useType : (this.isExamQstOpenForExercise ? null : 2)}).then(function (res) {
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
                    var sigleTopic = customNum || 0, multipleTopic = multipleNum || 0,
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
            doShowExamSelectModal: function () {
                this.selectModel.examSelectModel.visible = true;
                //this.selectModel.examSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
            },
            doSaveExam: function (selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.exam = selectedDatas[0];
                }
            },
            doShowPaperRecordSelectModal: function () {
                this.selectModel.paperRecordSelectModel.visible = true;
                //this.selectModel.paperRecordSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
            },
            doSavePaperRecord: function (selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.paperRecord = selectedDatas[0];
                }
            },
            doShowUserSelectModal: function () {
                this.selectModel.userSelectModel.visible = true;
                //this.selectModel.userSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
            },
            doSaveUser: function (selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.user = selectedDatas[0];
                }
            },

            doRemoveExamPoints: function (index) {
                this.mainModel.vo.examPoints.splice(index, 1);
            },
            beforeInit: function () {
            	var _this = this;
                this.mainModel.vo.examPoints = [];
                this.customPaperTopic = {type: false, num: "", score: ""};
                //多选
                this.multiplePaperTopic = {type: false, num: "", score: ""};
                //判断
                this.judgmentPaperTopic = {type: false, num: "", score: ""};
                this.customLength = null;
                this.multipleLength = null;
                this.judgmentLength = null;
                this.userScore = null
//                api.getQuetionList();
                api.getExerciseConfig().then(function (res) {
                    if (res.data.result === '2') {
                        _this.isExamQstOpenForExercise = true;
                    } else {
                        _this.isExamQstOpenForExercise = false;
                    }

                })
            },
            afterInitData: function () {
                if (this.mainModel.vo.paperRecord.userScore) {
                    this.userScore = this.mainModel.vo.paperRecord.userScore.substr(0, this.mainModel.vo.paperRecord.userScore.length - 2) + "分"
                }
            },
            //点保存
            beforeDoSave: function () {
                this.mainModel.vo.paperTopics = [];
                if (this.customPaperTopic.type) {
                    if(!this.customPaperTopic.num) {
                        LIB.Msg.error("请输入单选题数量");
                        return false;
                    }
                    if(!this.customPaperTopic.score) {
                        LIB.Msg.error("请输入单选题每题分数");
                        return false;
                    }
                    if (this.customPaperTopic.score < 1 || this.customPaperTopic.score > 10) {
                        LIB.Msg.error("单选题每题分数为1-10之间的正整数");
                        return false;
                    }
                    var customPaperTopic = {
                        type: "1",
                        num: this.customPaperTopic.num,
                        score: this.customPaperTopic.score
                    };
                    this.mainModel.vo.paperTopics.push(customPaperTopic);
                }
                if (this.multiplePaperTopic.type) {
                    if(!this.multiplePaperTopic.num) {
                        LIB.Msg.error("请输入多选题数量");
                        return false;
                    }
                    if(!this.multiplePaperTopic.score) {
                        LIB.Msg.error("请输入多选题每题分数");
                        return false;
                    }
                    if (this.multiplePaperTopic.score < 1 || this.multiplePaperTopic.score > 10) {
                        LIB.Msg.error("多选题每题分数为1-10之间的正整数");
                        return false;
                    }
                    //var multiplePaperTopic =  JSON.parse(JSON.stringify(this.multiplePaperTopic));
                    var multiplePaperTopic = {
                        type: "2",
                        num: this.multiplePaperTopic.num,
                        score: this.multiplePaperTopic.score
                    };
                    this.mainModel.vo.paperTopics.push(multiplePaperTopic);
                }
                if (this.judgmentPaperTopic.type) {
                    if(!this.judgmentPaperTopic.num) {
                        LIB.Msg.error("请输入判断题数量");
                        return false;
                    }
                    if(!this.judgmentPaperTopic.score) {
                        LIB.Msg.error("请输入判断题每题分数");
                        return false;
                    }
                    if (this.judgmentPaperTopic.score < 1 || this.judgmentPaperTopic.score > 10) {
                        LIB.Msg.error("判断题每题分数为1-10之间的正整数");
                        return false;
                    }
                    //var judgmentPaperTopic = JSON.parse(JSON.stringify(this.judgmentPaperTopic));;
                    var judgmentPaperTopic = {
                        type: "3",
                        num: this.judgmentPaperTopic.num,
                        score: this.judgmentPaperTopic.score
                    };
                    this.mainModel.vo.paperTopics.push(judgmentPaperTopic);
                }
                this.mainModel.vo.score = this.total;

            },
            doSave: function () {

                var validator = this.beforeDoSave();

                if(validator === false) {
                    return;
                }

                if(!this.total || this.mainModel.vo.paperTopics.length === 0) {
                    LIB.Msg.warning("请选择题型并录入分数");
                    return
                }
                var _this = this;
                var _data = this.mainModel;
                var _vo = _data.vo;

                if (_data.vo.id == null) {
                    var points = [];
                    _.each(this.mainModel.vo.examPoints, function (point) {
                        points.push(point.id);
                    })
                    var topics = [];
                    _.each(this.mainModel.vo.paperTopics, function (topic) {
                        topics.push(topic.type + "-" + topic.num + "-" + topic.score);
                    })
                    window.open(LIB.ctxPath("/front/exercise/random?topics=" + topics.join(",") + "&points=" + points.join(",")));
                }
            },
            doCustomPaperTopic: function () {
                var _this = this;
                if (_this.customPaperTopic.type && _this.mainModel.opType == 'create') {
                    if (_this.mainModel.vo.examPoints.length > 0) {
                        _this.doRefreshTable()
                    } else {
                    	
                        api.getQuetionList({type: 1, useType : (this.isExamQstOpenForExercise ? null : 2)}).then(function (res) {
                            _this.customLength = res.data.length;
                        })
                    }
                }
            },
            doMultiplePaperTopic: function () {
                var _this = this;
                if (_this.multiplePaperTopic.type && _this.mainModel.opType == 'create') {
                    if (_this.mainModel.vo.examPoints.length > 0) {
                        _this.doRefreshTable()
                    } else {
                        api.getQuetionList({type: 2, useType : (this.isExamQstOpenForExercise ? null : 2)}).then(function (res) {
                            _this.multipleLength = res.data.length;
                        })
                    }
                }
            },
            doJudgmentPaperTopic: function () {
                var _this = this;
                if (_this.judgmentPaperTopic.type && _this.mainModel.opType == 'create') {
                    if (_this.mainModel.vo.examPoints.length > 0) {
                        _this.doRefreshTable()
                    } else {
                        api.getQuetionList({type: 3, useType : (this.isExamQstOpenForExercise ? null : 2)}).then(function (res) {
                            _this.judgmentLength = res.data.length;
                        })
                    }
                }
            },
        },
        events: {
            'ev_handed_paper': function () {
                this.init('view', this.mainModel.vo.id);
            }
        },
        init: function () {
            this.$api = api;
        }
    });

    return detail;
});
