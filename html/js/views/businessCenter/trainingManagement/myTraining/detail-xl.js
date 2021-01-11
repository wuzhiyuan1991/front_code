define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");
    var examPointSelectModal = require("componentsEx/selectTableModal/examPointSelectModal");
    //初始化数据模型
    var newVO = function () {
        return {
            //培训记录id
            id: null,
            //唯一标识
            code: null,
            //禁用标识， 1:已禁用，0：未禁用，null:未禁用
            disable: null,
            attr2:null,//关联的矩阵id
            //复培时间 培训时间加上课程复培周期
            expiredDate: null,
            //学习进度
            percent: null,
            //分数
            score: null,
            //来源 1矩阵任务 2非矩阵任务
            source: null,
            //培训状态  0 未开始 1未通过 2通过 3通过（已复培）
            status: null,
            //培训时间
            trainDate: null,
            //修改日期
            modifyDate: null,
            //创建日期
            createDate: null,
            //用户
            user: {id: '', name: ''},
            //矩阵
            matrix:{id:null, frequence: null},
            startTime: null, endTime: null,
            //课程
            course: {
                id: '',
                name: '',
                attr1: '',
                frequence: null,
                type: null,
                description: '',
                orgId:null,
                compId: null,
                trainHour: null,
                language: null,
                requirement:null,
                certificationSubject: {name: ''},
                percent: null,
                teachers:[]
            },
            //讲师
            teacherNames: "",
            //学习详情
            studyDetails: [],
            //模拟卷
            analogVolume: [],
            //所属行业
            industry: null,
            trainPlan: {remarks: null},
            //考试时间
            examSchedule: {startTime: null,entryStartTime:null,entryDeadline:null, examPaper: {name: null}},

        }
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            timeoutParam:null,
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "",

            //验证规则
            rules: {},
            emptyRules: {}
        },
        tableModel: {
        	examPointTableModel : LIB.Opts.extendDetailTableOpt({
				url : "course/exampoints/list/{curPage}/{pageSize}",
				columns : [
				{
					title : "知识点名称",
					fieldName : "name",
					keywordFilterName: "criteria.strValue.keyWordValue_name"
				}
				]
			}),
        },
        formModel: {},
        cardModel: {
        	examPointCardModel : {
				showContent : true
			},
        },
        selectModel: {},
        referenceMaterials: [],

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
        components: {},
        data: function () {
            return dataModel;
        },
        computed : {
        	'frequence': function() {
        	    var matrix = this.mainModel.vo.matrix;

                if(matrix && this.mainModel.vo.attr2 != 1) {
                    var frequence = matrix.frequence == null ? 0 : matrix.frequence;
                    if (frequence == 0) {
                        return "无需复培";
                    }else{
                        return parseFloat(frequence) + "个月";
                    }
                }else{
                    return "无需复培";
                }
        	}
        },
        methods: {
            newVO: newVO,
            doCancelTask : function() {
				var _this = this;
                var vo = this.mainModel.vo;
                if(vo.source != 3) {
                    LIB.Msg.warning("非自选任务您无法取消");
                    return;
                }
                if (vo.status != 0) {
                    LIB.Msg.warning("任务已通过无法取消");
                    return;
                }

                api.cancel(null,{
                    id: vo.id,
                    orgId: vo.orgId
                }).then(function (res) {
                    LIB.Msg.info("取消成功!");
                    _this.$dispatch("ev_dtUpdate");

                });

			},
            doStartLearning: function (kpointId, fileType) {
                if (this.mainModel.vo.userId == LIB.user.id) {
                    if (this.mainModel.vo.course.type == 3) {
                        LIB.Msg.warning("线下课程无法播放");
                        return;
                    }else {
                        // 绑定事件 为了更新列表
                        this.addListen();
                        window.open(LIB.ctxPath("/front/course/" + this.mainModel.vo.id + "/" + this.mainModel.vo.courseId + "?kpointId=" + kpointId));
                    }
                } else {
                    LIB.Msg.warning("只能播放自己的课程");
                    return;
                }
            },

            // 设置定时器监听播放页面的关闭事件
            addListen:function () {
                var _this = this;
                if(this.timeoutParam){
                    clearTimeout(this.timeoutParam);
                }
                this.timeoutParam = setTimeout(timeoutFun,3000);
                localStorage.setItem("tempStore", 0);
                function timeoutFun() {
                    if(localStorage.getItem("tempStore")!=0){
                        clearTimeout(_this.timeoutParam);
                        _this.init("view",_this.mainModel.vo.id);
                    }else{
                        _this.timeoutParam = setTimeout(timeoutFun,3000)
                    }
                }
            },

            doStartExercise: function (paperId) {
                window.open(LIB.ctxPath("/front/exercise/course/" + paperId));
            },
            afterInitData: function () {
                var _this = this;
                this.$refs.exampointTable.doQuery({id : this.mainModel.vo.course.id});
                api.getCourse({id: _this.mainModel.vo.courseId}).then(function (rest) {
                    _.deepExtend(_this.mainModel.vo.course, rest.data);
                    //_this.mainModel.vo.course.frequence = parseFloat(rest.data.frequence);
                    _this.mainModel.vo.course.frequence = rest.data.frequence.charAt(0);
                    if (_this.mainModel.vo.course.frequence != 0) {
                        _this.mainModel.vo.course.frequence = parseFloat(_this.mainModel.vo.course.frequence) + "个月";
                    }
                    // else if (_this.mainModel.vo.course.frequence == 0) {
                    //     _this.mainModel.vo.course.frequence = "无需复培";
                    // }
                    _this.mainModel.vo.course.trainHour = parseFloat(rest.data.trainHour);
//					_this.mainModel.vo.course.certificationSubject = rest.data.certificationSubject;
                });
                if (!!this.mainModel.vo.matrix.frequence && this.mainModel.vo.matrix.frequence != 0) {
                    this.mainModel.vo.matrix.frequence = parseFloat(this.mainModel.vo.matrix.frequence) + "个月";
                }
                // else if (!!this.mainModel.vo.matrix.frequence && this.mainModel.vo.matrix.frequence == 0) {
                //     this.mainModel.vo.matrix.frequence = "无需复培";
                // }
                this.mainModel.vo.percent = this.mainModel.vo.percent + "%";
                //培训讲师
//                api.queryTeachers({id: _this.mainModel.vo.courseId}).then(function (res) {
//                    if (res.data) {
//                        var teacherNames = "";
//                        _.each(res.data, function (teacher) {
//                            teacherNames += teacher.name + ",";
//                        });
//                        _this.mainModel.vo.teacherNames = teacherNames.substr(0, teacherNames.length - 1)
//                    }
//                })
                //所属行业
                api.queryIndustryCategories({id: _this.mainModel.vo.courseId}).then(function (res1) {
                    var industryDate = res1.data;
                    if (industryDate.length > 0) {
                        var industryNames = "";
                        _.each(industryDate, function (item) {
                            industryNames += item.name + ",";
                        });
                        _this.mainModel.vo.industry = industryNames.substr(0, industryNames.length - 1)
                    }
                })
                api.queryStudyDetails({id: _this.mainModel.vo.id}).then(function (res2) {
                    _this.mainModel.vo.studyDetails = res2.data;
                });

                api.queryExamPapers({id: _this.mainModel.vo.course.id, "criteria.intValue": {examPaperType: 2}}).then(function (data) {
                    _this.mainModel.vo.analogVolume = data.data;
                })
                //查询上传课件
                _this.referenceMaterials = [];
                //初始化
                api.listFile({recordId: _this.mainModel.vo.course.id}).then(function (res) {
                    _this.referenceMaterials = [];
                    var fileData = res.data;
                    _.each(fileData, function (pic) {
                        if (pic.dataType === "L2") {
                            dataModel.referenceMaterials.push({fileId: pic.id, orginalName: pic.orginalName,fileExt: pic.ext});
                        }
                    });
                });
            },
            evaluation: function () {
                window.open('/html/main.html#!/courseEvaluation?id=' + this.mainModel.vo.course.id + "&taskId=" + this.mainModel.vo.id);
            },
            beforeInit: function (data, opType) {
                this.$refs.exampointTable.doClearData();
                this.mainModel.vo.course.teachers = [];
            },
        },
        events: {},
        ready: function () {
            this.$api = api;
        }
    });

    return detail;
});