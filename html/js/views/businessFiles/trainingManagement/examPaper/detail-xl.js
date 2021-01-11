define(function (require) {
    var Vue = require("vue");
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");
    var paperTopicFormModal = require("componentsEx/formModal/paperTopicFormModal");
    //var questionSelectModal = require("componentsEx/selectTableModal/questionSelectModal");
    var addQuesitonModal = require("./dialog/addQuesitonModal");
    // 对应课程modal
    var courseSelectModal = require("componentsEx/selectTableModal/courseSelectModal");
    //对应章节
    var kpoIntModal = require("./dialog/kpoint");
    //初始化数据模型

    //验证规则
    var rules = {
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

    var newVO = function () {
        return {
            //主键
            id: null,
            //大题顺序
            attr1: null,
            //试卷名称
            name: null,
            //
            compId: null,
            code: null,
            ////组织机构id
            //orgId : null,
            //试卷描述
            info: null,
            //考试时长 单位分钟
            replyTime: null,
            //试卷总分
            score: 0,
            //试卷类型 0手动组卷 1随机组卷
            type: null,
            createType: 0,
            //修改日期
            modifyDate: null,
            //创建日期
            createDate: null,
            //大题
            paperTopics: [],
            //对应课程
            //courseId:null,
            course: {id: null, name: ""},
            //对应章节
            //kpointId:null
            courseKpoint: {id: null, name: ""},
        }
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'view',
            isReadOnly: false,
            title: ""
        },
        tableModel: {
            paperTopicTableModel: {
                url: "exampaper/papertopics/list/{curPage}/{pageSize}",
                columns: [{
                    title: "编码",
                    fieldName: "code"
                }, {
                    title: "名称",
                    fieldName: "name",
                }, {
                    title: "",
                    fieldType: "tool",
                    toolType: "edit,del"
                }]
            },
            singleSelectQuestionTableModel: {
                columns: [
                    {
                        title: "试题内容",
                        fieldName: "content"
                    },
                    {
                        title: "正确答案",
                        fieldName: "answer"
                    },
                    {
                        title: "",
                        fieldType: "custom",
                        width: "150px",
                        showTip: false,
                        fieldName: "up",
                        //toolType:"edit,del",
                        render: function (data) {
                            return '<span  class="tableCustomIco_Up"><i class="ivu-icon ivu-icon-arrow-up-a"></i></span><span class="tableCustomIco_Down"><i class="ivu-icon ivu-icon-arrow-down-a"></i></span>' +
                                '<span class="tableCustomIco_Del"><i class="ivu-icon ivu-icon-trash-a"></i></span>'
                        }
                    }
                ]
            }
        },
        questionColumns: [
            {
                title: "试题内容",
                fieldName: "content"
            },
            {
                title: "正确答案",
                fieldName: "answer"
            },
            {
                title: "",
                fieldType: "custom",
                width: "150px",
                showTip: false,
                fieldName: "up",
                //toolType:"edit,del",
                render: function (data) {
                    return '<span  class="tableCustomIco_Up"><i class="ivu-icon ivu-icon-arrow-up-a"></i></span><span class="tableCustomIco_Down"><i class="ivu-icon ivu-icon-arrow-down-a"></i></span>' +
                        '<span class="tableCustomIco_Del"><i class="ivu-icon ivu-icon-trash-a"></i></span>'
                }
            }
        ],
        formModel: {
            paperTopicFormModel: {
                show: false,
                queryUrl: "exampaper/{id}/papertopic/{paperTopicId}"
            }
        },
        cardModel: {
            paperTopicCardModel: {
                showContent: true
            }
        },
        selectModel: {
            questionSelectModel: {
                visible: false,
                filterData: {orgId: null},
                topicId: null,
            },
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
        topicIndex: null, //大题在试卷中的下标
        questionIdex: null //试题在大题中的下标
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
            "addQuesitonModal": addQuesitonModal,
            "courseSelectModal": courseSelectModal,
            "kpoIntModal": kpoIntModal,

        },
        data: function () {
            return dataModel;
        },
        computed: {
            rules: function () {
                if (this.mainModel.isReadOnly) {
                    return {}
                }
                if (this.mainModel.opType === 'create') {
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
                else if (this.mainModel.opType === 'update'){
                    if (this.mainModel.vo.type === '1') {
                        return _.assign(_.cloneDeep(course), {code: LIB.formRuleMgr.codeRule()})
                    }
                    else if (this.mainModel.vo.type === '2') {
                        return _.assign(_.cloneDeep(kpoint), {code: LIB.formRuleMgr.codeRule()})
                    }
                    else {
                        return _.assign(_.cloneDeep(rules), {code: LIB.formRuleMgr.codeRule()})
                    }
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
            }
        },
        methods: {
            newVO: newVO,
            doPreview: function () {
                window.open(LIB.ctxPath("/front/exampaper/view/" + this.mainModel.vo.id));
            },
            doClose: function () {
                this.$dispatch("ev_dtManualClose");

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
                this.mainModel.vo.courseKpoint = {id: '', name: ''};
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
            doSave: function () {

                //当beforeDoSave方法明确返回false时,不继续执行doSave方法, 返回undefine和true都会执行后续方法
                if (this.beforeDoSave() === false) {
                    return;
                }

                var _this = this;
                var _data = this.mainModel;

                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        if (_this.afterFormValidate && !_this.afterFormValidate()) {
                            return;
                        }
                        var _vo = _this.buildSaveData() || _data.vo;
                        _vo.course = {id:_vo.course.id,name:_vo.course.name};
                        if (_data.vo.id == null) {
                            _this.$api.create(_vo).then(function (res) {
                                //清空数据
                                //_.deepExtend(_vo, _this.newVO());
                                //_this.opType = "view";
                                LIB.Msg.info("保存成功");
                                _data.vo.id = res.data.id;
                                _this._getResultCodeByRequest(res.data.id);
                                _this.afterDoSave({type: "C"}, res.body);
                                _this.changeView("view");
                                _this.$dispatch("ev_dtManualCreate");
                            });
                        } else {
                            _this.$api.update(_.omit(_vo, "paperTopics")).then(function (res) {
                                LIB.Msg.info("保存成功");
                                _this.afterDoSave({type: "U"}, res.body);
                                _this.changeView("view");
                                _this.$dispatch("ev_dtManualUpdate");
                            });
                        }
                    } else {
                        //console.error('doSave error submit!!');
                    }
                });
            },
            afterDoSave:function(){
                this.afterInitData();
            },
            doDelete: function () {

                //当beforeDoDelete方法明确返回false时,不继续执行doDelete方法, 返回undefine和true都会执行后续方法
                if (this.beforeDoDelete() == false) {
                    return;
                }

                var _vo = this.mainModel.vo;
                var _this = this;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function () {
                        _this.$api.remove(null, {id: _vo.id}).then(function () {
                            _this.afterDoDelete();
                            _this.$dispatch("ev_dtManualDelete");
                            LIB.Msg.info("删除成功");
                        });
                    }
                });
            },
            doShowPaperTopicFormModal4Update: function (topicId) {
                this.formModel.paperTopicFormModel.show = true;
                this.$refs.papertopicFormModal.init("update", {id: this.mainModel.vo.id, paperTopicId: topicId});
            },
            doShowPaperTopicFormModal4Create: function (param) {
                this.formModel.paperTopicFormModel.show = true;
                this.$refs.papertopicFormModal.init("create");
            },
            doSavePaperTopic: function (data) {
                if (data) {
                    var _this = this;
                    api.savePaperTopic({id: this.mainModel.vo.id}, data).then(function () {
                        _this.formModel.paperTopicFormModel.show = false;
                        _this.afterInitData();
                    });
                }
            },
            doUpdatePaperTopic: function (data) {
                if (data) {
                    var _this = this;
                    api.updatePaperTopic({id: this.mainModel.vo.id}, data).then(function () {
                        _this.formModel.paperTopicFormModel.show = false;
                        _this.refreshScore();
                        _this.afterInitData();

                    });
                }
            },
            doRemovePaperTopics: function (topicId) {
                var _this = this;
                LIB.Modal.confirm({
                    title: '确定删除?',
                    onOk: function () {
                        api.removePaperTopics({id: _this.mainModel.vo.id}, [{id: topicId}]).then(function () {
                            _this.refreshScore();
                            _this.afterInitData();

                        });
                    }
                })
            },
            doMovePaperTopics: function (offset, index) {
            	var topicList = this.mainModel.vo.paperTopics;
            	
                if(index === 0 && offset === -1) {
                    return;
                }
                if(offset === 1 && index === (topicList.length - 1)) {
                    return;
                }
                var item = topicList[index];
                topicList.splice(index, 1);
                topicList.splice(index + offset, 0, item);
                var _this = this;
                var param = {
                    id: item.id,
                };
                _.set(param, "criteria.intValue.offset", offset);
                api.movePaperTopics({id: this.mainModel.vo.id}, param).then(function () {
                });
            },
            doShowQuestionSelectModal: function (type, id) {
                this.selectModel.questionSelectModel.visible = true;
                this.selectModel.questionSelectModel.topicId = id;
                //this.selectModel.questionSelectModel.filterData = {excludeTopicId: id, type: type};
                this.selectModel.questionSelectModel.filterData = {"type": type, "criteria.strValue": {excludeTopicId: id}};
            },
            doSaveQuestions: function (selectedDatas) {
                if (selectedDatas) {
                    dataModel.mainModel.vo.questions = selectedDatas;
                    var param = _.map(selectedDatas, function (data) {
                        return {id: data.id}
                    });
                    var _this = this;
                    api.saveQuestions({
                        id: dataModel.mainModel.vo.id,
                        papertopicId: this.selectModel.questionSelectModel.topicId
                    }, param).then(function () {
                        _this.refreshScore();
                        _this.afterInitData();
                    });
                }
            },
            doCellIndex: function (id) {
                var _this = this;
                _.forEach(_this.mainModel.vo.paperTopics, function (topic, index) {
                    if (topic.questions) {
                        _.forEach(topic.questions, function (qst, qIndex) {
                            if (id === qst.id) {
                                _this.topicIndex = index;
                                _this.questionIndex = qIndex;
                                return false;
                            }
                        })
                    }

                })
            },
            doClickCell: function (data) {
                if (!this.hasPermission('4020002020')) {
                    LIB.Msg.warning("你没有此权限!");
                    return;
                }
                this.doCellIndex(data.entry.data.id);

                var questions = this.mainModel.vo.paperTopics[this.topicIndex].questions;
                var topicId = this.mainModel.vo.paperTopics[this.topicIndex].id;
                //分页数据
                var page = data.cell.rowId + 1 + (data.page.currentPage - 1) * data.page.pageSize;
                if (data.event.target.parentNode.className === "tableCustomIco_Up") {
                    this.doMoveQuestions(-1, this.questionIndex, questions, this.topicIndex);
                } else if (data.event.target.parentNode.className === "tableCustomIco_Down") {
                    this.doMoveQuestions(1, this.questionIndex, questions, this.topicIndex);
                } else if (data.event.target.parentNode.className === "tableCustomIco_Del") {
                    this.delRelRowHandler(topicId, data.entry.data.id);
                }
            },
            delRelRowHandler: function (topicId, questionId) {
                var _this = this;
                api.removeQuestions({
                    id: this.mainModel.vo.id,
                    papertopicId: topicId
                }, [{id: questionId}]).then(function () {
                    _.each(_this.mainModel.vo.paperTopics, function (topic) {
                        _.some(topic.questions, function (i, index) {
                            if (i.id === questionId) {
                                topic.questions.splice(index, 1);
                                _this.refreshScore();
                                return true;
                            }
                        });
                    });

                });
            },
            doMoveQuestions: function (offset, index, qstList, tindex) {
                if(index === 0 && offset === -1) {
                    return;
                }
                if(offset === 1 && index === (qstList.length - 1)) {
                    return;
                }
                var moveData = qstList[index];
                qstList.splice(index, 1);
                qstList.splice(index + offset, 0, moveData);
                var _this = this;
                var topicId = this.mainModel.vo.paperTopics[tindex].id;
                var param = {};
                _.set(param, "criteria.intValue.offset", offset);
                _.set(param, "criteria.strValue.qstId", moveData.id);
                api.moveQuestions({id: this.mainModel.vo.id,papertopicId:topicId}, param).then(function () {
                });
            },
            refreshScore: function () {
                var _this = this;
                api.get({id: this.mainModel.vo.id}).then(function (ret) {
                    _this.mainModel.vo.score = ret.data.score;
                    _this.$dispatch("ev_dtManualUpdate");
                });
            },
            afterInitData: function () {
                var _this = this;
                api.queryPaperTopics({id: _this.mainModel.vo.id}).then(function (res) {
                    // 添加属性，方便试题搜索控制
                    if (res.data.length > 0) {
                        _.each(res.data, function (item) {
                            Vue.set(item, 'keyWord', '');
                            Vue.set(item, 'showInput', false);
                        })
                    }
                    _this.mainModel.vo.paperTopics = res.data;
                })
            },
            // beforeInit: function (data, opType) {
            //     if (opType.opType === "create") {
            //         this.mainModel.veriFication = this.mainModel.rules;
            //     }
            // },
            toggleItemInput: function (item, value) {
                item.showInput = value;
                if (!value) {
                    item.keyWord = '';
                    item._keyWord = '';
                }
            },
            doQuestionFilter: function (item, k) {
                if (item.content.indexOf(k) > -1) {
                    return true;
                }
                if (item.answer.indexOf(k) > -1) {
                    return true;
                }
                return false;
            },
            setFilterValue: function (val, index) {
                this.mainModel.vo.paperTopics[index].keyWord = val;
            }
        },
        filters: {
            questionFilter: function (value, k) {
                var _this = this;
                if (!k || _.isEmpty(value)) {
                    return value;
                }
                return _.filter(value, function (item) {
                    return _this.doQuestionFilter(item, k.trim());
                })
            }
        },
        events: {
            "ev_dtManualReload": function (data) {
                this.init.apply(this, arguments);
                this.mainModel.vo.paperTopics = [];
            }
        },
        init: function () {
            this.$api = api;
        }
    });

    return detail;
});