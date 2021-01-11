define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail.html");

    //初始化数据模型
    var newVO = function () {
        return {
            //教师id
            id: null,
            //教师名称
            name: null,
            code: null,
            //
            compId: null,
            //讲师类型 0内部讲师 1外部讲师
            source: '0',
            //讲师介绍
            career: null,
            email: null,
            //手机号码
            mobile: null,
            //关联用户
            user: {id: null, name: ''}
        }
    };
    var teacherLabels = [
        {name: '耐心细致', value: '1'},
        {name: '积极互动', value: '2'},
        {name: '讲解透彻', value: '3'},
        {name: '严肃冷漠', value: '4'},
        {name: '逻辑混乱', value: '5'},
        {name: '啰嗦跑题', value: '6'}
    ];
    var columns = [
        {
            title: '课程名称',
            fieldName: 'course.name',
            width: 120
        },
        // {
        //     title: '评价时间',
        //     fieldName: 'createDate',
        //     width: 150
        // },
        {
            title: '课件质量',
            showTip: false,
            render: function (data) {
                return data.qualityGrade + '<i class="ivu-icon ivu-icon-star" style="font-size: 16px;color: #fc0;margin-left: 5px;"></i>'
            },
            width: 90
        },
        {
            title: '讲师水平',
            showTip: false,
            render: function (data) {
                return data.teacherGrade + '<i class="ivu-icon ivu-icon-star" style="font-size: 16px;color: #fc0;margin-left: 5px;"></i>'
            },
            width: 90
        },
        {
            title: '环境体验',
            showTip: false,
            render: function (data) {
                return data.envirGrade + '<i class="ivu-icon ivu-icon-star" style="font-size: 16px;color: #fc0;margin-left: 5px;"></i>'
            },
            width: 90
        },
        {
            title: '内容',
            fieldName: 'content'
        }
    ];


    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "",
            rules: {
                "source": [{required: true, message: '请选择讲师类型'}],
                "name": [{
                    required: true,
                    validator: function (rule, value, callback) {
                        if (dataModel.mainModel.vo.source == 1 && !_.trim(value)) {
                            return callback(new Error("请输入讲师"));
                        } else if (dataModel.mainModel.vo.source == 0 && _.isEmpty(dataModel.mainModel.vo.user.id)) {
                            return callback(new Error("请选择讲师"));
                        } else {
                            return callback();
                        }
                    }
                }],
                "user.id": [LIB.formRuleMgr.allowStrEmpty, {
                    required: true,
                    validator: function (rule, value, callback) {
                        if (dataModel.mainModel.vo.source == 1 && !value) {
                            return callback(new Error("请选择关联用户"));
                        } else {
                            return callback();
                        }
                    }
                }],
                "compId": [{required: true, message: '请选择所属公司'}],
                "mobile": [LIB.formRuleMgr.allowStrEmpty].concat(LIB.formRuleMgr.allowStrEmpty),
                "email": [LIB.formRuleMgr.allowStrEmpty].concat(LIB.formRuleMgr.allowStrEmpty),
            }
        },
        selectModel: {
            memberSelectModel: {
                visible: false
            }
        },
        tableModel: {
            detailModel: {
                url: 'course/coursecomments/list/{curPage}/{pageSize}',
                columns: columns
            }
        },
        teacherLabels: teacherLabels,
        avgModel: {
            teacherGrade: "",
            teacherGrade_float: 0
        },
        stats: null
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
        watch: {
            'mainModel.vo.source': function (val, oldVal) {
                if (val == 1) {
                    this.mainModel.vo.user.id = null;
                    this.mainModel.vo.userId = null;
                }
            }
        },
        methods: {
            newVO: newVO,
            afterDoSave: function (_pass, obj) {
                if(!!obj) {
                    _.deepExtend(this.mainModel.vo, obj);
                }
                if (_pass.type === 'C') {
                    this.afterInitData();
                }
            },
            doShowMemberSelectModal: function () {
                this.selectModel.memberSelectModel.visible = true;
            },
            doSaveUser: function (selectedDatas) {
                var data = selectedDatas[0];
                if (data) {
                    this.mainModel.vo.user = data;
                    this.mainModel.vo.name = data.name;
                    this.mainModel.vo.mobile = data.mobile;
                    this.mainModel.vo.email = data.email;
                }
            },
            getStatistic: function () {
                var _this = this;
                this.$api.queryCommentStatistic({"criteria.strValue": {teacherId: this.mainModel.vo.id}}).then(function (res) {
                    var data = res.data;
                    _this.stats = res.data;
                    _this.avgModel = {
                        teacherGrade: data.avgTeacherGrade,
                        teacherGrade_float: parseFloat(data.avgTeacherGrade)
                    }
                })
            },
            beforeInit: function () {
                this.$refs.commentTable.doClearData();
                this.stats = null;
                this.avgModel = {
                    teacherGrade: "",
                    teacherGrade_float: 0
                };
                this.mainModel.vo.user.id = '';
                this.mainModel.vo.user.name = '';
                this.mainModel.vo.name = '';
                this.mainModel.vo.mobile = '';
                this.mainModel.vo.email = '';
            },
            afterInitData: function () {
                this.getStatistic();
                this.$refs.commentTable.doQuery({"criteria.strValue": {teacherId: this.mainModel.vo.id}});
            },
            displayNum: function (type, index) {

                return this.stats.teacherLabelNum["label" + index]

            }
        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return detail;
});