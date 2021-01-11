define(function(require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = require("text!./main.html");

    var courseLabels = [
        {name: '实用性强', value: '1'},
        {name: '内容全面', value: '2'},
        {name: '深入浅出', value: '3'},
        {name: '纸上谈兵', value: '4'},
        {name: '枯燥无味', value: '5'},
        {name: '难以理解', value: '6'}
    ];

    var teacherLabels = [
        {name: '耐心细致', value: '1'},
        {name: '积极互动', value: '2'},
        {name: '讲解透彻', value: '3'},
        {name: '严肃冷漠', value: '4'},
        {name: '逻辑混乱', value: '5'},
        {name: '啰嗦跑题', value: '6'}
    ];

    var envirLabels = [
        {name: '网速流畅', value: '1'},
        {name: '使用方便', value: '2'},
        {name: '环境舒适', value: '3'},
        {name: '经常卡顿', value: '4'},
        {name: '难以操作', value: '5'},
        {name: '条件恶劣', value: '6'}
    ];

    var columns = [
        {
            title: '评价时间',
            fieldName: 'createDate',
            width: 160
        },
        {
            title: '课件质量',
            render: function (data) {
                return data.qualityGrade + '<i class="ivu-icon ivu-icon-star" style="font-size: 16px;color: #fc0;margin-left: 5px;"></i>'
            },
            width: 120
        },
        {
            title: '讲师水平',
            render: function (data) {
                return data.teacherGrade + '<i class="ivu-icon ivu-icon-star" style="font-size: 16px;color: #fc0;margin-left: 5px;"></i>'
            },
            width: 120
        },
        {
            title: '环境体验',
            render: function (data) {
                return data.envirGrade + '<i class="ivu-icon ivu-icon-star" style="font-size: 16px;color: #fc0;margin-left: 5px;"></i>'
            },
            width: 120
        },
        {
            title: '内容',
            fieldName: 'content'
        }
    ];

    var newVO = {
        qualityGrade: 0,
        teacherGrade: 0,
        envirGrade: 0,
        content: '',
        courseId: '',
        qualityLabel: [],
        teacherLabel: [],
        envirLabel: []
    };

    var dataModel = {
        courseLabels: courseLabels,
        teacherLabels: teacherLabels,
        envirLabels: envirLabels,
        tableModel: {
            url: 'course/coursecomments/list/{curPage}/{pageSize}',
            columns: columns,
            defaultFilterValue : {"criteria.orderValue" : {fieldName : "modifyDate", orderType : "1"}},
        },
        mainModel: {
            vo: newVO
        },
        avgModel: {
            qualityGrade: "",
            teacherGrade: "",
            envirGrade: "",
            qualityGrade_float: 0,
            teacherGrade_float: 0,
            envirGrade_float: 0
        },
        saved: false,
        hasPassedTraining: false,
        haveToPassFirst: false,
        courseName: ''
    };
    var vm = LIB.VueEx.extend({
        template: tpl,
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        data: function() {
            return dataModel;
        },
        methods: {
            doSave: function () {
                var _this = this;
                var vo = this.mainModel.vo;
                if(!vo.qualityGrade) {
                    return LIB.Msg.warning("请给课件质量评分");
                }
                if(!vo.teacherGrade) {
                    return LIB.Msg.warning("请给讲师水平评分");
                }

                var params = _.omit(vo, ['qualityLabel', 'teacherLabel', 'envirLabel']);
                params.qualityLabel = vo.qualityLabel.join(",");
                params.teacherLabel = vo.teacherLabel.join(",");
                params.envirLabel = vo.envirLabel.join(",");
                params.attr1 = this.taskId;

                this.$api.saveCourseComment({id: this.id}, params).then(function (res) {
                    LIB.Msg.success("评价成功");
                    _this.saved = true;
                    _this.getStatistic();
                    _this.$refs.commentTable.doQuery({id: _this.id});
                    // _this.$router.go({path: '/courseEvaluationView', query: {id: _this.id}});
                });
            },
            toggleCheck: function (type, index) {
                if(this.saved) {
                    return;
                }
                index = index + 1;
                var vo = this.mainModel.vo;
                if (type === 'course') {
                    if(_.indexOf(vo.qualityLabel, index) > -1) {
                        vo.qualityLabel = _.without(vo.qualityLabel, index);
                    } else {
                        vo.qualityLabel.push(index);
                    }
                } else if(type === 'teacher') {
                    if(_.indexOf(vo.teacherLabel, index) > -1) {
                        vo.teacherLabel = _.without(vo.teacherLabel, index);
                    } else {
                        vo.teacherLabel.push(index);
                    }
                } else if(type === 'envir') {
                    if(_.indexOf(vo.envirLabel, index) > -1) {
                        vo.envirLabel = _.without(vo.envirLabel, index);
                    } else {
                        vo.envirLabel.push(index);
                    }
                }
            },
            isActive: function (type, index) {
                index = index + 1;
                var vo = this.mainModel.vo;
                if (type === 'course') {
                    return _.indexOf(vo.qualityLabel, index) > -1;
                }
                if(type === 'teacher') {
                    return _.indexOf(vo.teacherLabel, index) > -1;
                }
                if(type === 'envir') {
                    return _.indexOf(vo.envirLabel, index) > -1;
                }
            },
            getStatistic: function () {
                var _this = this;
                this.$api.queryCommentStatistic({id: this.id}).then(function (res) {
                    var data = res.data;
                    _this.avgModel = {
                        qualityGrade: data.avgQualityGrade,
                        teacherGrade: data.avgTeacherGrade,
                        envirGrade: data.avgEnvirGrade,
                        qualityGrade_float: parseFloat(data.avgQualityGrade),
                        teacherGrade_float: parseFloat(data.avgTeacherGrade),
                        envirGrade_float: parseFloat(data.avgEnvirGrade)
                    }
                })
            },
            _setGrade: function (data) {
                this.mainModel.vo.content = data.content;
                this.mainModel.vo.qualityGrade = parseInt(data.qualityGrade);
                this.mainModel.vo.teacherGrade = parseInt(data.teacherGrade);
                this.mainModel.vo.envirGrade = parseInt(data.envirGrade);
                this.mainModel.vo.qualityLabel = _.map(data.qualityLabel.split(','), function(v){return parseInt(v)});
                this.mainModel.vo.teacherLabel = _.map(data.teacherLabel.split(','), function(v){return parseInt(v)});
                this.mainModel.vo.envirLabel = _.map(data.envirLabel.split(','), function(v){return parseInt(v)});
            },
            getTask: function () {
                var _this = this;
                api.getTask({id: this.taskId}).then(function (res) {
                    _this.courseName = _.propertyOf(res.data)("course.name");
                    if(res.data) {
	                    if(res.data.courseComment) {
	                        _this._setGrade(res.data.courseComment);
	                        _this.saved = true;
	                    }
	                    if(res.data.status != 2 && res.data.status != 3) {
	                    	_this.hasPassedTraining = false;
	                    }else{
	                    	_this.hasPassedTraining = true;
	                    }
                	}
                    
                })
            },
            getCommentAccessConfig:function() {
            	var _this = this;
            	this.haveToPassFirst = false;
                api.getCommentAccessConfig().then(function (res) {
                	if(res.data && res.data.result === '2') {
                        _this.haveToPassFirst = true;
                    } 
                })
            }
        },
        ready: function() {
            this.$api = api;
            this.id = this.$route.query.id;
            this.mainModel.vo.courseId = this.$route.query.id;
            this.taskId = this.$route.query.taskId;
            this.getStatistic();
            this.$refs.commentTable.doQuery({id: this.id});
            this.getTask();
            this.getCommentAccessConfig();
        }
    });

    return vm;
});
