define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");

    //初始化数据模型
    var newVO = function () {
        return {
            //用户id
            id: null,
            //用户编码
            code: null,
            ////手机号
            //mobile : null,
            //
            compId: null,
            //企业id
            orgId: null,
            //课程类型
            categorySubject: {name: ""},
            //认证类型
            certificationSubject: {name: ""},
            //复培周期
            frequence: null,
            //培训方式
            type: null,
            //学时
            trainHour: null,
            name: null,
            //语言
            language: null,
            ////是否禁用，0启用，1禁用
            //disable : null,
            ////邮箱
            //email : null,
            ////头像编码
            //face : null,
            ////头像标识，标明头像是否更新
            //faceFlag : null,
            ////用户头像id
            //faceid : null,
            ////加密盐
            //keysata : null,
            ////最近登陆时间
            //lastLoginDate : null,
            ////最后登录的手机Imei
            //lastLoginImei : null,
            ////最近登陆ip
            //lastLoginIp : null,
            ////最后登录地理位置
            //lastLoginQth : null,
            ////登录名
            //loginName : null,
            ////登陆方式
            //loginType : null,
            ////备用手机
            //mobile2 : null,
            ////用户昵称
            //nickname : null,
            ////用户密码
            //password : null,
            ////备注
            //remarks : null,
            ////状态 0：离职 1：在职  2.其他
            //status : null,
            ////用户类型  0:非正式用户  1：正式用户
            //type : null,
            ////用户姓名
            //username : null,
            ////更新日期
            //modifyDate : null,
            ////创建日期
            //createDate : null,
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
                //"code":[LIB.formRuleMgr.require("编码")]
                "code": [LIB.formRuleMgr.require("用户编码"),
                    LIB.formRuleMgr.length()
                ],
                "mobile": [LIB.formRuleMgr.require("手机号"),
                    LIB.formRuleMgr.length()
                ],
                "disable": [LIB.formRuleMgr.length()],
                "email": [LIB.formRuleMgr.length()],
                "face": [LIB.formRuleMgr.length()],
                "faceFlag": [LIB.formRuleMgr.length()],
                "faceid": [LIB.formRuleMgr.length()],
                "keysata": [LIB.formRuleMgr.length()],
                "lastLoginDate": [LIB.formRuleMgr.length()],
                "lastLoginImei": [LIB.formRuleMgr.length()],
                "lastLoginIp": [LIB.formRuleMgr.length()],
                "lastLoginQth": [LIB.formRuleMgr.length()],
                "loginName": [LIB.formRuleMgr.length()],
                "loginType": [LIB.formRuleMgr.length()],
                "mobile2": [LIB.formRuleMgr.length()],
                "nickname": [LIB.formRuleMgr.length()],
                "password": [LIB.formRuleMgr.length()],
                "remarks": [LIB.formRuleMgr.length()],
                "status": [LIB.formRuleMgr.length()],
                "type": [LIB.formRuleMgr.length()],
                "username": [LIB.formRuleMgr.length()],
                "modifyDate": [LIB.formRuleMgr.length()],
                "createDate": [LIB.formRuleMgr.length()]
            },
            emptyRules: {}
        },
        tableModel: {
            courseFileTableModel: {
                url: "traintask/list/{curPage}/{pageSize}",
                columns: [
                    {
                        title: "姓名",
                        fieldName: "user.name",
                        keywordFilterName: "criteria.strValue.keyWordValue_name",
                        width: 80
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
                        filterType: "enum",
                        dataDicKey: "train_task_result",
                        keywordFilterName: "criteria.intsValue.keyWordValue_status",
                        width: 150
                    },
                    {
                        //title : "任务类型",
                        title: "任务类型",
                        fieldType: "custom",
                        filterType: "enum",
                        dataDicKey: "train_task_type",
                        render: function (data) {
                            return LIB.getDataDic("train_task_type", data.source);
                        },
                        keywordFilterName: "criteria.intsValue.keyWordValue_source",
                        width: 130
                    },
                    {
                        title: "开始时间",
                        fieldName: "startTime",
                        width: 100,
                        render: function (data) {
                            if(data.startTime){
                                return data.startTime.slice(0,11);
                            }
                        }
                    },
                    {
                        title: "结束时间",
                        fieldName: "endTime",
                        width: 100,
                        render: function (data) {
                            if(data.endTime){
                                return data.endTime.slice(0,11);
                            }
                        },
                    },
                    {
                        title: "通过时间",
                        fieldName: "trainDate",
                        fieldType: "custom",
                        render: function (data) {
                            if (data.status == 2 || data.status == 3) {
                                return data.trainDate
                                // return data.examSchedule.startTime;
                            }
                        },
                        width: 140
                    },
                    {
                        title: "交卷时间",
                        fieldName: "examSchedule.startTime",
                        width: 140
                    },
                    {
                        //学习进度
                        title: "完成进度",
                        fieldType: "custom",
                        render: function (data) {
                            return data.percent + "%";
                        },
                        keywordFilterName: "criteria.strValue.keyWordValue_percent",
                        width: 100
                    },
                    {
                        title: "考试得分",
                        fieldType: "custom",
                        render: function (data) {
                            if (data.score) {
                                return parseInt(data.score) + "分";
                            } else if (!!data.examSchedule && data.examSchedule.status == 2) {
                                return "0分";
                            }
                        },
                        keywordFilterName: "criteria.strValue.keyWordValue_score",
                        width: 100
                    },

                    {
                        title: "所属公司",
                        fieldType: "custom",
                        render: function (data) {
                            if (data.compId) {
                                return LIB.getDataDic("org", data.user.compId)["compName"];
                            }
                        },
                        keywordFilterName: "criteria.strValue.keyWordValue_comp",
                        width: 200
                    },
                    {
                        title: "所属部门",
                        fieldType: "custom",
                        render: function (data) {
                            if (data.orgId) {
                                return LIB.getDataDic("org", data.user.orgId)["deptName"];
                            }
                        },
                        keywordFilterName: "criteria.strValue.keyWordValue_org",
                        width: 120
                    },

                    {
                        title: "岗位",
                        fieldType: "custom",
                        render: function (data) {
                            if (_.propertyOf(data.user)("positionList")) {
                                var posNames = "";
                                data.user.positionList.forEach(function (e) {
                                    if (e.postType == 0) {
                                        posNames += (e.name + "/");
                                    }
                                });
                                posNames = posNames.substr(0, posNames.length - 1);
                                return posNames;

                            }
                        },
                        keywordFilterName: "criteria.strValue.keyWordValue_position",
                        width: 140
                    },
                    {
                        title: "安全角色",
                        fieldType: "custom",
                        render: function (data) {
                            if (_.propertyOf(data.user)("positionList")) {
                                var roleNames = "";
                                data.user.positionList.forEach(function (e) {
                                    if (e.postType == 1) {
                                        roleNames += (e.name + "/");
                                    }
                                });
                                roleNames = roleNames.substr(0, roleNames.length - 1);
                                return roleNames;

                            }
                        },
                        keywordFilterName: "criteria.strValue.keyWordValue_position",
                        width: 140
                    },
                ],
                defaultFilterValue: {
                    "criteria.intValue": {
                      includeDisableUser: '0'
                    }
                  }
            }
        },
        leaveWorkerSwitch:false,
        teachersName: "",
        exportModel: {
            singleUrl: "/traintask/{id}/exportExcel/coursedetail"
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
        watch: {
            'leaveWorkerSwitch': function (value) {
                var query = {
                    id: this.mainModel.vo.id
                }
                query['criteria.intValue.includeDisableUser'] = value ? '1' : '0'
                this.$refs.courseFileTable.doQuery(query)
            }
        },
        methods: {
            newVO: newVO,
            afterInitData: function () {
                var _this = this;
                this.teachersName = "";
                api.course({id: this.mainModel.vo.id}).then(function (res) {
                    if (res.data.length > 0) {
                        var data = res.data;
                        _.each(data, function (item) {
                            _this.teachersName += item.name + ",";
                        })
                        _this.teachersName = _this.teachersName.substr(0, _this.teachersName.length - 1);
                    }
                });
                if (_this.mainModel.vo.frequence != 0) {
                    _this.mainModel.vo.frequence = parseFloat(_this.mainModel.vo.frequence) + "个月";
                } else if (_this.mainModel.vo.frequence == 0) {
                    _this.mainModel.vo.frequence = "无需复培";
                }
                _this.$refs.courseFileTable.doQuery({"course.id": _this.mainModel.vo.id});
                if (this.leaveWorkerSwitch) {
                    this.leaveWorkerSwitch =false
                }
            },
            doExportDetail: function () {
                window.open(this.exportModel.singleUrl.replace("\{id\}", this.mainModel.vo.id));
            },
        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return detail;
});