define(function (require) {
    var LIB = require('lib');
    var API = require("../vuex/api");
    var tpl = LIB.renderHTML(require("text!./danger.html"));


    var DefaultUserConfs = function () {
        return {
            CheckNum: {score: 0, dailyMaxScore: null, enabled: false},
            ImmedReformOfRadomObser: {score: 0, dailyMaxScore: null, enabled: false},
            EffectiveProblem: {
                enabled: false,
                dailyMaxScore: null,
                subRuleConfs: {},
            },
            //新增的一列
            RandomObservation: {score: 0, dailyMaxScore: null,enabled: false}
        };
    };
    var DefaultDeptConfs = function () {
        return {
            DeptPerCapitaScore: {
                enabled: false,
                subRuleConfs: {
                    DeptPerCapitaScore1: {score: 0},
                    DeptPerCapitaScore2: {score: 0}
                }
            },
            DeptPerCapitaProblem: {
                enabled: false,
                subRuleConfs: {
                    DeptPerCapitaProblem1: {score: 0},
                    DeptPerCapitaProblem2: {score: 0}
                }
            },
            DeptReformRate: {
                enabled: false,
                subRuleConfs: {
                    DeptReformRate1: {score: 0},
                    DeptReformRate2: {score: 0}
                }
            },
            DeptDiscoverHiddenDanger: {
                enabled: false,
                subRuleConfs:{}
            },
            DeptRandomPassRate:{
                enabled: false,
                subRuleConfs: {
                    DeptRandomPassRate1: {score: 0},
                    DeptRandomPassRate2: {score: 0}
                }
            },
            DeptPoolIdentifyRate:{
                enabled: false,
                subRuleConfs: {
                    DeptPoolIdentifyRate1: {score: 0},
                    DeptPoolIdentifyRate2: {score: 0}
                }
            }
        };
    };
    var DefaultConfis = function () {
        return {
            userConfs: {
                show: true,
                vo: new DefaultUserConfs()
            },
            deptConfs: {
                show: true,
                vo: new DefaultDeptConfs()
            },
            riskGradeLatRanges:[],
            deptDiscoverHiddenDangers:[],
            effectiveProblemRangeShow:false,
            deptDiscoverHDRangeShow:false,
            riskModelEffectiveProblems:[],
            riskModelDeptDiscoverHiddenDangers:[]
        }
    };

    var dataModel = function () {
        return _.deepExtend({compId: null, disabled: false}, new DefaultConfis());
    };

    var seq;
    var buildConfs = function (type, typeFlag, v, compId) {
        if (_.isEmpty(v)) return null;//空对象
        var conf = {
            attr1: "1",
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
            conf.dailyMaxScore = v.dailyMaxScore;
        } else {
            conf.score = v.score;
            conf.dailyMaxScore = v.dailyMaxScore;
            conf.attr4 = v.rangeId;
            conf.attr5 = v.modelId;
        }
        return conf;
    };
    var _initConfs = function (data) {
        if (_.isEmpty(data)) return null;//空对象
        if (_.isArray(data)) {
            var confs = {};
            for (var i in data) {
            	if(data[i] && data[i].attr1 == '1') {
            		_.extend(confs, _initConfs(data[i]));
            	}
            }
            return confs;
        } else if (_.isObject(data)) {
            var conf = {};
            if (_.isEmpty(data.subRuleConfs)) {
                conf[data.typeFlag] = {enabled: data.disable == '1' ? false : true, score: data.score, dailyMaxScore: data.dailyMaxScore, rangeId:data.attr4,modelId:data.attr5};
            } else {
                conf[data.typeFlag] = {enabled: data.disable == '1' ? false : true, dailyMaxScore: data.dailyMaxScore, subRuleConfs: _initConfs(data.subRuleConfs)};
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
            return  dataModel();
        },
        watch: {
            compId: function (nVal) {
                this.getConfs();
            }
        },
        computed: {
            showItem: function () {
                var path = this.$route.path;
                if (_.includes(path, "/person")) {
                    return 'person'
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
                var showItem = this.showItem;
                if (showItem == "person" || showItem == "all") {
                    _.each(this.userConfs.vo, function (v, k) {
                        var data = buildConfs(userType, k, v, compId);
                        data.disable = v.enabled ? '0' : '1';
                        formData.push(data);
                    });
                }
                if (showItem == "department" || showItem == "all") {
                    var deptType = 2;
                    _.each(this.deptConfs.vo, function (v, k) {
                        var data = buildConfs(deptType, k, v, compId);
                        data.disable = v.enabled ? '0' : '1';
                        formData.push(data);
                    });
                }
                return formData;
            },
            doSave: function () {
                var _this = this;
                var formData = this.getFormData();
                API.saveDangerConfs(formData).then(function (res) {
                    _this.getConfs();
                    LIB.Msg.info("保存成功");
                });
            },
            initConfs: function (data) {
                //if(_.isEmpty(data)) return;
                //清空旧数据
                this.userConfs.vo = new DefaultUserConfs();
                this.deptConfs.vo = new DefaultDeptConfs();

                for (var i in data) {
                    var conf = _initConfs(data[i]);
                    if (1 == data[i].type) {
                        _.deepExtend(this.userConfs.vo, conf);
                    } else if (2 == data[i].type) {
                        _.deepExtend(this.deptConfs.vo, conf);
                    }
                }
            },
            getConfs: function () {
                var compId = this.compId || LIB.user.compId;
                if (!compId) {
                    return;
                }
                var params = {
                    attr1: '1',//attr1=1为隐患积分规则
                    compId: compId
                };
                var _this = this;
                API.queryConfsByNest(params).then(function (res) {
                    _this.initConfs(res.data);
                    setTimeout(function () {
                        _this.riskGradeLatRanges = [];
                        _this.deptDiscoverHiddenDangers = [];
                        _this.riskModelEffectiveProblems = [];
                        _this.riskModelDeptDiscoverHiddenDangers = [];
                        var riskModels1 ={};
                        var riskModels2 ={};
                        _this.effectiveProblemRangeShow = false;
                        _this.deptDiscoverHDRangeShow = false;
                        if (compId) {
                            API.queryRiskGradeLatRange({compId:compId}).then(function (res) {
                                //已存在的模型id
                                var modelIds1 = [];
                                if (!_.isEmpty(_this.userConfs.vo.EffectiveProblem.subRuleConfs)) {
                                    var subRuleConfs = _this.userConfs.vo.EffectiveProblem.subRuleConfs;
                                    for (var i in subRuleConfs) {
                                        modelIds1.push(subRuleConfs[i].modelId);
                                    }
                                }

                                //已存在的模型id
                                var modelIds2 = [];
                                if (!_.isEmpty(_this.deptConfs.vo.DeptDiscoverHiddenDanger.subRuleConfs)) {
                                    var subRuleConfs = _this.deptConfs.vo.DeptDiscoverHiddenDanger.subRuleConfs;
                                    for (var i in subRuleConfs) {
                                        modelIds2.push(subRuleConfs[i].modelId);
                                    }
                                }

                                _.each(res.data,function (val) {
                                    var riskModel = val.riskModel;
                                    //过滤掉 已停用且未设置的 评估模型
                                    // 暂时屏蔽
                                    // if (!(riskModel.disable == 1 && modelIds1.indexOf(riskModel.id) == -1)) {
                                        if(riskModels1[val.riskModelId]){
                                            riskModels1[val.riskModelId].riskGradeLatRanges.push({id:val.id,level:val.level,minScore:val.minScore,maxScore:val.maxScore})
                                        }else{
                                            var disableVal = riskModel.disable == 0 ? "启用状态" : "停用状态";
                                            riskModels1[val.riskModelId] = {riskGradeLatRanges:[],riskModelName:"("+disableVal+")"+riskModel.name};
                                            riskModels1[val.riskModelId].riskGradeLatRanges.push({id:val.id,level:val.level,minScore:val.minScore,maxScore:val.maxScore});
                                        }
                                    // }

                                    // if (!(riskModel.disable == 1 && modelIds2.indexOf(riskModel.id) == -1)) {
                                        if(riskModels2[val.riskModelId]){
                                            riskModels2[val.riskModelId].riskGradeLatRanges.push({id:val.id,level:val.level,minScore:val.minScore,maxScore:val.maxScore})
                                        }else{
                                            var disableVal = riskModel.disable == 0 ? "启用状态" : "停用状态";
                                            riskModels2[val.riskModelId] = {riskGradeLatRanges:[],riskModelName:"("+disableVal+")"+riskModel.name};
                                            riskModels2[val.riskModelId].riskGradeLatRanges.push({id:val.id,level:val.level,minScore:val.minScore,maxScore:val.maxScore});
                                        }
                                    // }
                                });
                                //赋值
                                for(var key in riskModels1){
                                    _this.riskModelEffectiveProblems.push(riskModels1[key]);
                                }
                                for(var key in riskModels2){
                                    _this.riskModelDeptDiscoverHiddenDangers.push(riskModels2[key]);
                                }
                                // _this.riskGradeLatRanges = res.data;
                                // _this.deptDiscoverHiddenDangers = res.data;
                                if (res.data) {
                                    if (_.isEmpty(_this.userConfs.vo.EffectiveProblem.subRuleConfs)) {
                                        _this.userConfs.vo.EffectiveProblem.subRuleConfs = {};
                                        _this.effectiveProblemRangeShow = true;
                                        _.each(res.data, function (range, i) {
                                            _this.userConfs.vo.EffectiveProblem.subRuleConfs["EffectiveProblem" + (i + 1)] = {
                                                score: 0,
                                                level: range.level,
                                                rangeId: range.id,
                                                modelId: range.riskModelId
                                            };
                                        });
                                    } else {//有值的情况下 需要将启用的评估模型放入进去
                                        _.each(res.data,function (range, i) {
                                            var riskModel = range.riskModel;
                                            if (riskModel.disable == 0 && modelIds1.indexOf(riskModel.id) == -1) {
                                                _this.userConfs.vo.EffectiveProblem.subRuleConfs["EffectiveProblem" + (i + 1+ modelIds1.length)] = {
                                                    score: 0,
                                                    level: range.level,
                                                    rangeId: range.id,
                                                    modelId: range.riskModelId
                                                };
                                            }
                                        })
                                    }

                                    if (_.isEmpty(_this.deptConfs.vo.DeptDiscoverHiddenDanger.subRuleConfs)) {
                                        _this.deptConfs.vo.DeptDiscoverHiddenDanger.subRuleConfs = {};
                                        _this.deptDiscoverHDRangeShow = true;
                                        _.each(res.data, function (range, i) {
                                            _this.deptConfs.vo.DeptDiscoverHiddenDanger.subRuleConfs["DeptDiscoverHiddenDanger" + (i + 1)] = {
                                                score: 0,
                                                level: range.level,
                                                rangeId: range.id,
                                                modelId: range.riskModelId
                                            };
                                        });
                                    } else {//有值的情况下 需要将启用的评估模型放入进去
                                        _.each(res.data,function (range, i) {
                                            var riskModel = range.riskModel;
                                            if (riskModel.disable == 0 && modelIds2.indexOf(riskModel.id) == -1) {
                                                _this.deptConfs.vo.DeptDiscoverHiddenDanger.subRuleConfs["DeptDiscoverHiddenDanger" + (i + 1+ modelIds2.length)] = {
                                                    score: 0,
                                                    level: range.level,
                                                    rangeId: range.id,
                                                    modelId: range.riskModelId
                                                };
                                            }
                                        })
                                    }
                                }
                            });
                        }
                    }, 300);
                });
            },
        },
        ready: function () {
        },
        attached: function () {
            //this.disabled = LIB.authMixin.methods.hasPermission('1060002002');
            // this.getConfs();
            var path = this.$route.path;
            if(_.startsWith(path, '/randomInspection')) {
                this.disabled  = LIB.authMixin.methods.hasPermission('4010001002');
            }else{
                this.disabled = LIB.authMixin.methods.hasPermission('1060002002');
            }
            this.getConfs();
        }
    });
    return vm;
});