define(function (require) {
    var LIB = require('lib');
    var API = require("../vuex/api");
    //使用Vue方式，对页面进行事件和数据绑定
    var defaultUserConf = {
        CompulsoryTrainingOnTime: {
            score: 15,
            enabled: false
        },
        CompulsoryTrainingOverTime: {
            score: 10,
            enabled: false
        },
        OptionalTraining: {
            score: 20,
            enabled: false
        },
        PassATest: {
            score: 15,
            enabled: false
        },
        Comment: {
            score: 5,
            enabled: false
        }
    };
    
    var defaultTeacherConf = {
            OnlineCourseDev: {
                score: 30,
                enabled: false
            },
            OfflineCourseDev: {
                score: 20,
                enabled: false
            },
            TeachingLevel5: {
                enabled: false,
                attr2:4.5,
                attr3:5,
                score:200,
            },
            TeachingLevel4: {
            	enabled: false,
                attr2:4.0,
                attr3:4.4,
                score:100,
            },
            CourseQuality5: {
                score: 200,
                attr2:4.5,
                attr3:5,
                enabled: false
            },
            CourseQuality4: {
                score: 100,
                attr2:4.0,
                attr3:4.4,
                enabled: false
            }
        };
    
    var defaultDeptConf = {
    	DeptOnlineCourseDev: {
        	score: 20,
        	enabled: false
        },
        DeptOfflineCourseDev: {
        	score: 15,
        	enabled: false
        },
        DeptPerCapitaTrainingScore: {
            enabled: false,
            subRuleConfs: {
            	DeptPerCapitaTrainingScore1: {score: 200},
            	DeptPerCapitaTrainingScore2: {score: 30}
            }
        }
    };

    var dataModel = {
        userConf: {
            show: true,
            vo: _.deepExtend({}, defaultUserConf)
        },
        deptConf: {
            show: true,
            vo: _.deepExtend({}, defaultDeptConf)
        },
        teacherConf: {
            show: true,
            vo: _.deepExtend({}, defaultTeacherConf)
        },
        compId: null,
        disabled: false
    };


    var tpl = LIB.renderHTML(require("text!./train.html"));
    var seq;
    var buildConfs = function (type, typeFlag, v, compId) {
        if (_.isEmpty(v)) return null;//空对象
        var conf = {
            attr1 : "2",
            compId: compId,
            type: type,
            typeFlag: typeFlag,
            executionSequence: seq++
        };

        if (_.has(v, "subRuleConfs")) {
            var confs = [];
            _.each(v.subRuleConfs, function (v, k) {
                confs.push(buildConfs(type, k, v, compId));
            });
            conf.subRuleConfs = confs;
        } else {
            conf.score = v.score;
            conf.attr2 = v.attr2;
            conf.attr3 = v.attr3;
        }
        return conf;
    };
    var _initConfs = function (data) {
        if (_.isEmpty(data)) return null;//空对象
        if (_.isArray(data)) {
            var confs = {};
            for (var i in data) {
            	if(data[i] && data[i].attr1 == '2') {
            		_.extend(confs, _initConfs(data[i]));
            	}
            }
            return confs;
        } else if (_.isObject(data)) {
            var conf = {};
            if (_.isEmpty(data.subRuleConfs)) {
                conf[data.typeFlag] = {enabled: data.disable == '1' ? false : true, score: data.score};
            } else {
                conf[data.typeFlag] = {enabled: data.disable == '1' ? false : true, subRuleConfs: _initConfs(data.subRuleConfs)};
            }
            return conf;
        }
    };


    var vm = LIB.VueEx.extend({
        template: tpl,
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        props: {
            compId: {
                type: String,
                default: ''
            }
        },
        data: function () {
            return dataModel;
        },
        watch: {
            compId: function (nVal) {
                this.getConfs();
            }  
        },
        computed: {
            showItem: function () {
                var path = this.$route.path;
                if (_.includes(path, "/student")) {
                    return 'student'
                } else if (_.includes(path, "/teacher")) {
                    return 'teacher'
                } else if (_.includes(path, "/department")) {
                    return 'department'
                } else {
                    return 'all'
                }
            }
        },
        methods: {
            getFormData: function () {
                seq = 1;
                var compId = this.compId;
                var formData = [];
                var userType = 1;
                _.each(this.userConf.vo, function (v, k) {
                    var data = buildConfs(userType, k, v, compId);
                    data.disable = v.enabled ? '0' : '1';
                    formData.push(data);
                });
                var deptType = 2;
                _.each(this.deptConf.vo, function (v, k) {
                    var data = buildConfs(deptType, k, v, compId);
                    data.disable = v.enabled ? '0' : '1';
                    formData.push(data);
                });
                var teacherType = 3;
                _.each(this.teacherConf.vo, function (v, k) {
                    var data = buildConfs(teacherType, k, v, compId);
                    data.disable = v.enabled ? '0' : '1';
                    formData.push(data);
                });
                return formData;
            },
            _validator: function () {
                var vo = this.teacherConf.vo;
                function isInvalid(str) {
                    var min = 0.1,
                        max = 5.0,
                        reg = /^[1-5](\.\d)?$|^0\.\d$/;
                    if(!reg.test(str)) {
                        return true;
                    }
                    var num = Number(str);
                    if(min > num && max < num) {
                        return true
                    }
                    return false;
                }
                if(isInvalid(vo.TeachingLevel5.attr2) || isInvalid(vo.TeachingLevel5.attr3) || isInvalid(vo.TeachingLevel4.attr2) || isInvalid(vo.TeachingLevel4.attr3)) {
                    LIB.Msg.error("讲师水平平均星级范围是0.1-5.0之间的整数或者一位小数");
                    return false;
                }
                if(isInvalid(vo.CourseQuality5.attr2) || isInvalid(vo.CourseQuality5.attr3) || isInvalid(vo.CourseQuality4.attr2) || isInvalid(vo.CourseQuality4.attr3)) {
                    LIB.Msg.error("课件质量平均星级范围是0.1-5.0之间的整数或者一位小数");
                    return false;
                }
                return true;
            },
            doSave: function () {
                var _this = this;
                var isValid  = this._validator();
                if(!isValid) {
                    return;
                }
                var formData = this.getFormData();
                API.saveTrainConfs(formData).then(function (res) {
                    _this.getConfs();
                    LIB.Msg.info("保存成功");
                });
            },
            initConfs: function (data) {
                //if(_.isEmpty(data)) return;
                //清空旧数据
                this.userConf.vo = _.deepExtend({}, defaultUserConf);
                this.deptConf.vo = _.deepExtend({}, defaultDeptConf);
                this.teacherConf.vo = _.deepExtend({}, defaultTeacherConf);

                for (var i in data) {
                    var conf = _initConfs(data[i]);
                    if (1 == data[i].type) {
                        _.deepExtend(this.userConf.vo, conf);
                    } else if (2 == data[i].type) {
                        _.deepExtend(this.deptConf.vo, conf);
                    } else if (3 == data[i].type) {
                        _.deepExtend(this.teacherConf.vo, conf);
                    }
                }
            },
            getConfs: function () {
                var compId = this.compId || LIB.user.compId;
                if (!compId) {
                    return;
                }
                var _this = this;
                var params = {
                    compId: compId,
                    attr1: '2' //attr1=2为培训积分规则
                };
                API.queryConfsByNest(params).then(function (res) {
                    _this.initConfs(res.data)
                });
            },
            //组织结构切换获取公司id
            doOrgCategoryChange: function (obj) {
                this.compId = obj.nodeId;
                this.getConfs();
            }
        },
        ready: function () {
        	if(!!LIB.user.compId) {
        	}
        },
        attached: function () {
            this.disabled = LIB.authMixin.methods.hasPermission('1060002002');
            this.getConfs();
        }
    });
    return vm;
});