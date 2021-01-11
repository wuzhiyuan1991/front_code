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

    var dataModel = {
        courseLabels: courseLabels,
        teacherLabels: teacherLabels,
        envirLabels: envirLabels,
        tableModel: {
            url: 'course/coursecomments/list/{curPage}/{pageSize}',
            columns: columns
        },
        avgModel: {
            qualityGrade: "",
            teacherGrade: "",
            envirGrade: "",
            qualityGrade_float: 0,
            teacherGrade_float: 0,
            envirGrade_float: 0
        },
        stats: null
    };
    var vm = LIB.VueEx.extend({
        template: tpl,
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        data: function() {
            return dataModel;
        },
        methods: {
            getStatistic: function (id) {
                var _this = this;
                this.$api.queryCommentStatistic({id: id}).then(function (res) {
                    var data = res.data;
                    _this.stats = res.data;
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
            displayNum: function (type, index) {
                if(type === "course") {
                    return this.stats.qualityLabelNum["label" +index]
                }
                if(type === "teacher") {
                    return this.stats.teacherLabelNum["label" +index]
                }
                if(type === "envir") {
                    return this.stats.envirLabelNum["label" +index]
                }
            },
            initFun: function (id) {
                this.getStatistic(id);
                this.$refs.commentTable.doQuery({id: id});
            },
            doClean: function () {
                var _this = this;
                _this.stats = null;
                _this.avgModel = {
                    qualityGrade: "",
                    teacherGrade: "",
                    envirGrade: "",
                    qualityGrade_float: 0,
                    teacherGrade_float: 0,
                    envirGrade_float: 0
                }
                this.$refs.commentTable.doClearData();
            }
        },
        ready: function() {
            this.$api = api;
            this.id = this.$route.query.id;
            if(this.id) {
               this.initFun(this.id);
            }
        }
    });

    return vm;
});
