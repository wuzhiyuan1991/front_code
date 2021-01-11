define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");

    var isEmer = 0;
    //初始化数据模型
    var newVO = function () {
        return {
            //用户id
            id: null,
            //用户编码
            code: null,
            //手机号
            mobile: null,
            //
            compId: null,
            //企业id
            orgId: null,
            //是否禁用，0启用，1禁用
            disable: null,
            //邮箱
            email: null,
            //头像编码
            face: null,
            //头像标识，标明头像是否更新
            faceFlag: null,
            //用户头像id
            faceid: null,
            //加密盐
            keysata: null,
            //最近登陆时间
            lastLoginDate: null,
            //最后登录的手机Imei
            lastLoginImei: null,
            //最近登陆ip
            lastLoginIp: null,
            //最后登录地理位置
            lastLoginQth: null,
            //登录名
            loginName: null,
            //登陆方式
            loginType: null,
            //备用手机
            mobile2: null,
            //用户昵称
            nickname: null,
            //用户密码
            password: null,
            //备注
            remarks: null,
            //状态 0：离职 1：在职  2.其他
            status: null,
            //用户类型  0:非正式用户  1：正式用户
            type: null,
            //用户姓名
            username: null,
            //更新日期
            modifyDate: null,
            //创建日期
            createDate: null,
            //岗位跟安全角色
            positionList: [],
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
            rules: {
            },
            emptyRules: {},
            //岗位名称
            postListName: "",
            //安全角色
            hseRoleListName: "",
        },
        tableModel: {
            courseCategoryTableModel: {
                url: "traintask/list/{curPage}/{pageSize}?criteria.intValue.isEmer=" + isEmer,
                columns: [
                    {
                        title: "课程名称",
                        //fieldName : "course.name",
                        fieldType: "custom",
                        render: function (data) {
                            return "<span style='color: #00CFFF'>" + data.course.name + "</span>";
                        },
                        tipRender: function (data) {
                            return data.course.name;
                        },
                        width: 200
                    },
                    {
                        //title : "培训状态",
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
                        fieldType: "custom",
                        render: function (data) {
                            if (data.status == 2 || data.status == 3) {
                                //return data.examSchedule.startTime;
                                return data.trainDate
                            }
                        },
                        width: 140
                    },
                    {
                        title: "培训方式",
                        //fieldName : "course.type",
                        fieldType: "custom",
                        render: function (data) {
                            return LIB.getDataDic("course_type", _.propertyOf(data.course)("type"));
                        },
                        width: 100
                    },
                    {
                        //复培频率 以年为单位 0表示一次性
                        title: "复培周期",
                        fieldName: "frequence",
                        fieldType: "custom",
                        render: function (data) {
                            if(data.matrix && data.attr2 != 1) {
                                var frequence = data.matrix.frequence == null ? 0 : data.matrix.frequence;
                                if (frequence == 0) {
                                    return "无需复培";
                                }else{
                                    return parseFloat(frequence) + "个月";
                                }
                            }else{
                                return "无需复培";
                            }
                        },
                        width: 100
                    },
                    {
                        //title : "任务类型",
                        title: "任务类型",
                        fieldType: "custom",
                        render: function (data) {
                            return LIB.getDataDic("train_task_type", data.source);
                        },
                        width: 130
                    },
                    {
                        title: "培训开始时间",
                        fieldName: "startTime",
                        width: 120,
                        render: function (data) {
                            if(data.startTime){
                                return data.startTime.slice(0,11);
                            }
                        },
                    },
                    {
                        title: "培训结束时间",
                        fieldName: "endTime",
                        width: 120,
                        render: function (data) {
                            if(data.endTime){
                                return data.endTime.slice(0,11);
                            }
                        },
                    },
                    {
                        //学习进度
                        title: "完成进度",
                        fieldType: "custom",
                        render: function (data) {
                            return data.percent + "%";
                        },
                        width: 100
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
                    },

                    {
                        title: "所属公司",
                        fieldType: "custom",
                        render: function (data) {
                            if (data.course) {
                                return LIB.getDataDic("org", data.course.compId)["compName"];
                            }
                        },
                        keywordFilterName: "criteria.strValue.keyWordValue_comp",
                        width: 200
                    },
                    {
                        title: "所属部门",
                        fieldType: "custom",
                        render: function (data) {
                            if (data.course) {
                                return LIB.getDataDic("org", data.course.orgId)["deptName"];
                            }
                        },
                        keywordFilterName: "criteria.strValue.keyWordValue_org",
                        width: 120
                    },
                ]
            }
        },
        //tab的课程类型
        categorys: [],
        showTabs: false,
        //对应课程
        userCourse: [],
        exportModel: {
            singleUrl: "/traintask/{id}/exportExcel/usertraindetail"
        }
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
        methods: {
            newVO: newVO,
            afterInitData: function () {
                var _this = this;
                _this.categorys = [];
                _this.mainModel.postListName = "";
                _this.mainModel.hseRoleListName = "";
                if (_this.mainModel.vo.positionList && this.mainModel.vo.positionList.length > 0) {
                    _.each(_this.mainModel.vo.positionList, function (item) {
                        //postType 为0 说明是岗位 1 为安全角色
                        if (item.postType == 0) {
                            _this.mainModel.postListName += item.name + ",";
                        } else if (item.postType == 1) {
                            _this.mainModel.hseRoleListName += item.name + ",";
                        }
                    })
                }
                _this.mainModel.postListName = _this.mainModel.postListName.substr(0, _this.mainModel.postListName.length - 1);
                _this.mainModel.hseRoleListName = _this.mainModel.hseRoleListName.substr(0, _this.mainModel.hseRoleListName.length - 1);
                
                var categoryIds = [];//全部培训课程的类型id
                api.listtask({
                    userId: _this.mainModel.vo.id
                }).then(function (ret) {
                    if(ret.data && ret.data.length > 0) {
                    	categoryIds = _.map(ret.data, function(item){
                    		return item.id;
                    	});
                    	api.queryCategorySubjects({'criteria.strsValue':JSON.stringify({sonId:categoryIds})}).then(function (res) {
                            var data = res.data;
                            _.each(data, function (item) {
                                if (item.level == 1) {
                                    _this.categorys.push(item);
                                    _this.showTabs = true;

                                }
                            })
                            _this.doCourseInit(_this.categorys[0])
                        });
                    }
                });
                
                
            },
            doCourseInit: function (data) {
                var _this = this;
                //查询课程
                api.listtask({userId: _this.mainModel.vo.id, "course.categoryId": data.id, 'criteria.intValue' : {isEmer: isEmer}}).then(function (res) {
                    _this.userCourse = res.data;
                });
            },
            doTabInit: function (index) {
                var _this = this;
                var i = parseInt(index.key) - 1;
                api.listtask({
                    userId: _this.mainModel.vo.id,
                    "course.categoryId": _this.categorys[i].id,
                    'criteria.intValue' : {isEmer: isEmer}
                }).then(function (res) {
                    _this.userCourse = res.data;
                });
            },
            beforeInit: function () {
                this.userCourse = [];
                this.showTabs = false;
                this.mainModel.vo.positionList = [];
                //this.$refs.userFileTable.doClearData();
            },
            doExportDetail: function () {
                window.open(this.exportModel.singleUrl.replace("\{id\}", this.mainModel.vo.id) + "?isEmer=" + isEmer);
            },
        },
        events: {},
        init: function () {
            isEmer = 0;
            if(this.$route.path.indexOf("/emer") == 0) {
                this.$api = require("../../emerMa/trainingUserFile/vuex/api");
                isEmer = 1;
            } else{
                this.$api = api;
            }
        },
    });

    return detail;
});
