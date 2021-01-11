define(function (require) {
    var LIB = require('lib');
    //数据模型
    var api = require("../vuex/api");
    var tpl = require("text!./editRange.html");
    var rangeVO = function (riskModelId) {
        return {
            minScore: null,
            maxScore: null,
            level: '',
            colorMark: '000',
            suggest: '',
            riskModel: {
                id: riskModelId
            }
        };
    }
    var totalRange = {
        minScore: 0,
        maxScore: 0
    };
    /**
     * 获取区间最小、最大值范围
     */
    var calcTotalRange = function (formula, gradeLats) {
        /**
         * 获取选项最小、最大值 BEGIN
         */
        var minLatMap = {}, maxLatMap = {};
        _.each(gradeLats, function (lat) {
            var scores = _.map(lat.latScores, function (latScore) {
                return Number(latScore.score)
            });
            if (!_.isEmpty(scores)) {
                minLatMap[lat.id] = _.min(scores);
                maxLatMap[lat.id] = _.max(scores);
            }
        });
        /**
         * 计算表达式最小、最大值 BEGIN
         */
        var rules = formula.split(" ");
        var minCalc = "", maxCalc = "";
        _.each(rules, function (rule) {
            if (/^[\+\-\*\/]$/.test(rule)) {
                minCalc += rule + " ";
                maxCalc += rule + " ";
            } else {
                minCalc += _.result(minLatMap, rule, "0") + " ";
                maxCalc += _.result(maxLatMap, rule, "0") + " ";
            }
        });
        /**
         * 记录表达式最小、最大值
         */
        totalRange = {
            minScore: eval(minCalc),
            maxScore: eval(maxCalc)
        }
    };
    /**
     * 校验分值范围有效性
     */
    var validRange = function (ranges) {
        var _ranges = _.clone(ranges);
        var len = _ranges.length;
        var valid = true;
        _.find(_ranges, function (range) {
            //判断同一区间的最大值是否小于最小值
            if (parseFloat(range.minScore) >= parseFloat(range.maxScore)) {
                LIB.Msg.error("分值范围[" + range.minScore + "~" + range.maxScore + "]配置错误");
                valid = false;
                return true;//停止遍历
            }
        });
        if (valid) {
            _ranges = _.sortBy(_ranges, function (range) {
                return parseFloat(range.minScore);
            });
            _.find(_ranges, function (range, i) {
                var nextIndex = i + 1;
                if (len > nextIndex) {
                    var nextRange = _ranges[nextIndex];
                    if (parseFloat(range.maxScore) >= parseFloat(nextRange.minScore)) {
                        LIB.Msg.error("分值范围[" + range.minScore + "~" + range.maxScore + "]与[" + nextRange.minScore + "~" + nextRange.maxScore + "]配置交叉");
                        valid = false;
                        return true;//停止遍历
                    }
                }
            });
        }
        return valid;
    }
    //数据模型
    var dataModel = {
        isDataReferenced: true,
        mainModel: {
            riskModelId: null,
            delIds: [],
            gradeLatRanges: []
        },
        calculatingFormula: null,
        gradeLats: [],
        ruleModel: {
            score: [
                {type: 'number', required: true, message: '请输入正确分值'}
            ],
            level: [
                {required: true, message: '请输入风险等级'},
                {max: 10, message: '长度不能超过 10个字符'}
            ],
            suggest: [
                {max: 100, message: '长度不能超过 100个字符'}
            ]
        }
    };
    var detail = LIB.Vue.extend({
        template: tpl,
        data: function () {
            return dataModel;
        },
        computed: {
            itemLastIndex: function () {
                return this.mainModel.gradeLatRanges.length - 1;
            }
        },
        methods: {
            //添加一行分值范围配置
            addLatRange: function () {
                var latRanges = this.mainModel.gradeLatRanges;
                var rangeInfo = new rangeVO(this.mainModel.riskModelId);
                var len = latRanges.length;
                if (len === 0) {
                    rangeInfo.minScore = totalRange.minScore;
                } else if (len > 0) {
                    //5935 bug
                    rangeInfo.minScore = Number(latRanges[len - 1].maxScore) && Number(latRanges[len - 1].minScore) ? new Number(latRanges[len - 1].maxScore) + 1 : null;
                    //rangeInfo.minScore = new Number(latRanges[len-1].maxScore) + 1;
                }
                rangeInfo.attr1 = latRanges.length + 1;
                latRanges.push(rangeInfo);
            },
            //删除一行分值范围配置
            removeRange: function (index) {
                var ranges = this.mainModel.gradeLatRanges;
                this.mainModel.delIds.push(ranges[index].id)
                ranges.splice(index, 1);
            },
            //保存
            doSave: function () {
                var _this = this;
                if (_.isEmpty(this.mainModel.gradeLatRanges)) {
                    LIB.Msg.error("结果范围不能为空");
                    return;
                }
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        if (validRange(_this.mainModel.gradeLatRanges)) {//校验分值范围合法性
                            api.saveGradeLatRange({
                                delIds: JSON.stringify(_this.mainModel.delIds),
                                riskModelId: _this.mainModel.riskModelId
                            }, _this.mainModel.gradeLatRanges).then(function (res) {
                                LIB.Msg.info("保存成功");
                                //_this.$dispatch("ev_editRangeFinshed");
                                _this.$emit("do-edit-range-finshed");
                            });
                        }
                    }
                });
            }
        },
        events: {
            'ev_loadRange': function (param) {
                var _this = this;
                var riskModelId = param.riskModelId;
                var isDataReferenced = param.isDataReferenced;
                api.get({id: riskModelId}).then(function (res) {
                    var data = res.data;
                    _this.mainModel.delIds = [];
                    _this.isDataReferenced = isDataReferenced;
                    _this.mainModel.riskModelId = riskModelId;
                    _this.mainModel.gradeLatRanges = data.gradeLatRanges;
                    _this.calculatingFormula = data.calculatingFormula;
                    _this.gradeLats = data.riskGradeLats;
                    calcTotalRange(_this.calculatingFormula, _this.gradeLats);
                });
            }
        }
    });
    return detail;
});