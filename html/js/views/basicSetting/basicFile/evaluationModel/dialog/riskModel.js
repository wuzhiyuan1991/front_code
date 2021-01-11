define(function (require) {
    var LIB = require('lib');
    //模型选择页面
    var template = require("text!./riskModel.html");

    //选择模型信息
    var newVO = function () {
        return {
            id: null,
            formula: null,
            riskGradeLats: [],
            gradeLatRanges: [],
            opts: [],
            latId: null,
            result: null
        };
    }
    //清空模型选择信息
    var cleanModelVO = function (target) {
        _.deepExtend(target, newVO());
        target.riskGradeLats = [];
        target.gradeLatRanges = [];
        target.opts = [];
    };
    //拷贝模型信息
    var extendModelVO = function (target, source) {
        if(_.isEmpty(source)) {
            return;
        }
        cleanModelVO(target);
        target.id = source.id;
        target.opts = _.map(source.opts, function (opt) {
            return opt;
        });
        target.result = source.result;
        target.latId = source.latId;
    };

    var detail = LIB.Vue.extend({
        template: template,
        data: function () {
            return {
                modelVO: newVO(),
                show: false,
                showExt: [],
                isShowCardContent: false,
                modelList: [],
                ruleModel: {
                    name: [
                        {required: true, message: '请选择模型'}
                    ],
                    latScore: [
                        {required: true, message: '请选择对应选项'}
                    ]
                }
            };
        },
        props: {
            model: {
                type: Object,
                'default': function () {
                    return {
                        id: '',
                        opts: [],
                        latId: '',
                        result: ''
                    }
                }
            },
            cleanable: {
                type: Boolean,
                default: false
            },
            riskModelId: {
                type: String,
                default: ''
            },
        },
        watch: {
            model: {
                //立即以表达式的当前值触发回调
                immediate: true,
                handler: function () {
                    this.modelVO = newVO();
                    extendModelVO(this.modelVO, this.model);
                }
            }
        },
        computed: {
            calcRuleLable: function () {
                var formula = this.modelVO.formula;
                if (formula == null) return "";
                var rules = formula.split(" ");
                var gradeLats = this.modelVO.riskGradeLats;
                var label = "";
                var latScores = this.coventLatOptions();
                _.each(rules, function (rule) {
                    if (/^[\+\-\*\/]$/.test(rule)) {
                        label += rule + " ";
                        return true;
                    }
                    _.each(gradeLats, function (lat) {
                        if (lat.id == rule) {
                            label += lat.name + "(" + _.result(latScores, rule, "0") + ")";
                            return true;
                        }
                    });
                });
                return label;
            },
            //计算风险等级结果 低、中、高
            calcRuleLables: function () {
                var formula = this.modelVO.formula;
                if (formula == null) return [];
                var labels = [];
                var rules = formula.split(" ");
                var gradeLats = this.modelVO.riskGradeLats;
                var latScores = this.coventLatOptions();
                _.each(rules, function (rule) {
                    if (/^[\+\-\*\/]$/.test(rule)) {
                        labels.push(rule);
                        return true;
                    }
                    _.each(gradeLats, function (lat) {
                        if (lat.id == rule) {
                            labels.push(lat.name + "(" + _.result(latScores, rule, "0") + ")");
                            return true;
                        }
                    });
                });
                return labels;
            },
            calcRuleResult: function () {
                var gradeLatRanges = this.modelVO.gradeLatRanges;
                var formula = this.modelVO.formula;
                if (gradeLatRanges == null || gradeLatRanges.length < 1) return null;
                if (formula == null) return gradeLatRanges[0];
                var latScores = this.coventLatOptions();
                var rules = formula.split(" ");
                var calc = "";
                _.each(rules, function (rule) {
                    if (/^[\+\-\*\/]$/.test(rule)) {
                        calc += rule + " ";
                    } else {
                        calc += _.result(latScores, rule, "0") + " ";
                    }
                });
                var rs = eval(calc);
                var range = gradeLatRanges[0];
                _.each(gradeLatRanges, function (rg) {
                    if (rg.minScore <= rs && rg.maxScore >= rs) {
                        range = rg;
                    }
                });
                this.modelVO.latId = range.id;
                this.modelVO.result = range.level;
                return range;
            },
            showClearIcon: function () {
                return this.cleanable && this.modelVO.result
            }
        },
        methods: {
            displayLabelText: function (label) {
                var text = label === '*' ? '×' : label;
                if (_.includes(["+", "-", "×", "/"], text)) {
                    return "<span style='font-size: 36px;'>" + text + "</span>";
                }
                return text
            },
            doExtra: function (index) {
                var isShow = this.showExt[index];
                this.showExt.splice(index, 1, !isShow);
            },
            //转换当前
            coventLatOptions: function () {
                var latOpts = {};
                var _this = this;
                _.each(this.modelVO.riskGradeLats, function (lat) {
                    _.each(lat.latScores, function (score) {
                        if (_.contains(_this.modelVO.opts, score.id)) {
                            latOpts[lat.id] = score.score;
                        }
                    })
                });
                return latOpts;
            },
            doClose: function () {
                extendModelVO(this.modelVO, this.model);

            },
            showModel: function () {
                var _this = this;
                _this.modelList=[];
                this.$refs.ruleform.resetFields();
                cleanModelVO(this.modelVO);
                if (_this.riskModelId) {
                    var resource = this.$resource("riskmodel/{id}");
                    resource.get({id: _this.riskModelId}).then(function (res) {
                        _this.modelList.push(res.data);
                        extendModelVO(_this.modelVO, _this.model);
                        if (!_this.modelVO.id) {
                            var model = res.data;
                            _this.modelVO.id = model ? model.id : null;
                        }
                    });
                    this.show = true;
                } else {
                    var resource = this.$resource("riskmodel/list");
                    var _this = this;
                    var compId = null;
                    if(_this.$parent.form && _this.$parent.form.model){
                        compId = _this.$parent.form.model.compId;
                    }
                    resource.get({disable: 0,compId:compId}).then(function (res) {
                        var modelList = res.data
                        _this.modelList = modelList;
                        extendModelVO(_this.modelVO, _this.model);
                        if (!_this.modelVO.id) {
                            var model = _.first(modelList);
                            _this.modelVO.id = model ? model.id : null;
                        }
                    });
                    this.show = true;
                }
            },
            modelChange: function () {
                if (!this.modelVO.id) {
                    return;
                }
                else if (null === this.model || this.modelVO.id != this.model.id) {
                    this.modelVO.opts = [];
                    this.modelVO.latId = null;
                    this.modelVO.result = null;
                }
                var _this = this;
                if (_this.riskModelId) {
                    var data = _this.modelList[0];
                    if (_.isUndefined(data)) return;
                    _this.modelVO.formula = data.calculatingFormula;
                    //显示纬度详情标示
                    var opts = _this.modelVO.opts;
                    _this.showExt = _.map(data.riskGradeLats, function (rgl, i) {
                        if (undefined === opts[i] || "" === opts[i]) {
                            var latScore = _.first(rgl.latScores);
                            opts[i] = latScore ? latScore.id : null;
                        }
                        return false;
                    });
                    _this.modelVO.riskGradeLats = data.riskGradeLats;
                    _this.modelVO.gradeLatRanges = data.gradeLatRanges;
                } else {
                    var resource = this.$resource("riskmodel/{id}");
                    resource.get({id: this.modelVO.id}).then(function (res) {
                        var data = res.data;
                        if (_.isUndefined(data)) return;
                        _this.modelVO.formula = data.calculatingFormula;
                        //显示纬度详情标示
                        var opts = _this.modelVO.opts;
                        _this.showExt = _.map(data.riskGradeLats, function (rgl, i) {
                            if (undefined === opts[i] || "" === opts[i]) {
                                var latScore = _.first(rgl.latScores);
                                opts[i] = latScore ? latScore.id : null;
                            }
                            return false;
                        });
                        _this.modelVO.riskGradeLats = data.riskGradeLats;
                        _this.modelVO.gradeLatRanges = data.gradeLatRanges;
                    });
                }
            },
            getExtInfo: function (index, exts) {
                return exts[index] != null ? exts[index].name : '';
            },
            getExtDetailsInfo: function (index, exts) {
                return exts[index] != null ? exts[index].description : '';
            },
            doConfirm: function () {
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        _this.model = _.pick(_this.modelVO, "id", "opts", "result", "latId");
                        _this.show = false;
                        _this.$emit("do-confirm", _this._calculateScore());
                    }
                });
            },
            _calculateScore: function () {
                var opts = this.modelVO.opts;
                var lats = this.modelVO.riskGradeLats;
                var rule = this.modelVO.formula;
                var symbol;
                if (rule) {
                    symbol = rule.match(/([\+\-\*\/])/);
                    symbol = symbol ? symbol[0] : null
                }
                var ret = {};
                var isPossibility = (lats[0].name.indexOf("可能性") > -1);
                if (isPossibility) {
                    ret.possibility = _.find(lats[0].latScores, "id", opts[0]).score;
                    ret.severity = _.find(lats[1].latScores, "id", opts[1]).score;
                } else {
                    ret.severity = _.find(lats[0].latScores, "id", opts[0]).score;
                    ret.possibility = _.find(lats[1].latScores, "id", opts[1]).score;
                }
                ret.riskScore = this._calculateBySymbol(ret.possibility, ret.severity, symbol);
                return ret;
            },
            _calculateBySymbol: function (a, b, s) {
                a = parseFloat(a);
                b = parseFloat(b);
                if (s === '+') {
                    return (a + b).toFixed(2)
                }
                if (s === '-') {
                    return (a - b).toFixed(2)
                }
                if (s === '*') {
                    return (a * b).toFixed(2)
                }
                if (s === '/') {
                    return (a / b).toFixed(2)
                }
                return a;
            },
            doClear: function () {
                this.model = {
                    id: '',
                    opts: [],
                    latId: '',
                    result: ''
                }
            }
        }
    });
    return detail;
});