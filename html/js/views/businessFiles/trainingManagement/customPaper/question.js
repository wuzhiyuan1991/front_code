define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./api");
    var tpl = LIB.renderHTML(require("text!./question.html"));
    require("componentsEx/treeModal/treeModal");
    var vm = LIB.VueEx.extend({
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        template: tpl,
        props: {
            data: {
                type: Object
            },
            title: {
                type: String,
                default: ''
            },
            total: {
                type: Number,
                default: 0
            },
            courseid: {
                type: String,
                default: undefined
            },
        },
        data: function () {
            return {
                examPointVisible: false,
                examPoints: null
            }
        },
        components: {},
        methods: {
            deletePoint: function (index) {
                this.data.points.splice(index, 1);
                this._calculateRandom();
            },
            // 考点所占比例变化
            onPointPercentChange: function (index, e) {
                var percent = e.target.valueAsNumber;
                var point = this.data.points[index];
                var maxPercent = Math.ceil(point.total / this.data.count * 100);
                var _this = this;
                if (_.isNaN(percent)) {
                    percent = 0;
                    point.percent = 0;
                }
                if (percent < 0) {
                    LIB.Msg.error("考点比例必须为正数", 2);
                    point.percent = 0;
                    return;
                }
                if (percent > maxPercent) {
                    percent = maxPercent;
                }
                point.percent = percent;
                var totalPercent = this._calculateTotalPercent();
                if (totalPercent > 100) {
                    LIB.Msg.error("所有考点比例之和大于100%", 3);
                    setTimeout(function () {
                        point.percent = Math.max(point.percent - (totalPercent - 100), 0);
                        _this._calculatePointCount(point);
                        _this._fixLastPointCount();
                        _this._calculateRandom();
                    }, 500);
                } else {
                    this._calculatePointCount(point, percent);
                    if (totalPercent === 100) {
                        _this._fixLastPointCount();
                    }
                    _this._calculateRandom();
                }
            },
            // 考点题目数量变化
            onPointCountChange: function (index, e) {
                var count = e.target.valueAsNumber;
                var point = this.data.points[index];
                var _this = this;
                if (_.isNaN(count)) {
                    count = 0;
                }
                if (count < 0) {
                    count = Math.abs(count);
                }
                if (count > point.total) {
                    LIB.Msg.error("分配的题目数量大于此考点题目总数", 3);
                    count = 0;
                }
                point.count = Math.floor(count);
                setTimeout(function () {
                    point.count = Math.floor(count);
                }, 100);
                if (this.data.count === 0) {
                    return;
                }
                var totalCount = this._calculateTotalCount();
                if (totalCount > this.data.count) {
                    LIB.Msg.error("所有考点题目数量之和大于题目数量总和", 3);
                    setTimeout(function () {
                        point.count = Math.max(point.count - (totalCount - _this.data.count), 0);
                        _this._calculatePointPercent(point);
                        _this._fixLastPointPercent(point);
                        _this._calculateRandom();
                    }, 500);
                    return;
                }
                this._calculatePointPercent(point);
                if (totalCount === this.data.count) {
                    this._fixLastPointPercent(point);
                }
                this._calculateRandom();
            },
            // 题目总数量变化
            onCountChange: function (e) {
                var _this = this;
                var count = e.target.valueAsNumber;
                if (_.isNaN(count)) {
                    count = 0;
                }
                if(count < 0 || !Number.isInteger(count)) {
                    LIB.Msg.error("题目数量必须为正整数");
                    return;
                }
                if (count === 0) {
                    return;
                }
                if (count > this.total) {
                    LIB.Msg.error(this.data.name + " 分配数量超过 " + this.data.name + " 总题数");
                    setTimeout(function () {
                        _this.data.count = _this.total;
                        _.forEach(_this.data.points, function (point) {
                            _this._calculatePointCount(point)
                        });
                        _this._calculateRandom();
                    }, 500);
                    return;
                }
                this.data.count = count;
                _.forEach(this.data.points, function (point) {
                    _this._calculatePointCount(point)
                });
                _this._calculateRandom();
            },

            // 计算考点比例之和
            _calculateTotalPercent: function () {
                var totalPercent = _.reduce(this.data.points, function (res, item) {
                    return parseFloat(res) + parseFloat(item.percent);
                }, 0);
                return totalPercent;
            },
            _calculateTotalCount: function () {
                var totalCount = _.reduce(this.data.points, function (res, item) {
                    return parseInt(res) + parseInt(item.count);
                }, 0);
                return totalCount;
            },
            // 根据考点比例计算考点题目数量
            _calculatePointCount: function (point, percent) {
                percent = percent || point.percent;
                var count = Math.floor(this.data.count * percent / 100);
                if (count > point.total) {
                    LIB.Msg.error("该考点应该分配 " + count + " 题, 超过试题总数", 2);
                    point.count = 0;
                } else {
                    point.count = count;
                }
            },
            // 根据考点题目数量计算考点比例
            _calculatePointPercent: function (point, count) {
                count = count || point.count;
                var percent = Math.ceil(count / this.data.count * 100);
                point.percent = percent;
            },
            _calculateRandom: function () {
                if (!this.data.random) {
                    return;
                }
                this.data.randomPercent = _.reduce(this.data.points, function (result, item) {
                    return result - item.percent
                }, 100);
                this.data.randomCount =  _.reduce(this.data.points, function (result, item) {
                    return result - item.count
                }, this.data.count);
            },

            // 根据百分比计算题目数量时，采用向下取整来保证数据的合理性，所以需要对最后一个考点题目数量做修正
            _fixLastPointCount: function () {
                if (this.data.random) {
                    return;
                }
                var total = _.reduce(this.data.points, function (result, item) {
                    return parseInt(result) + parseInt(item.count);
                }, 0);
                var lastPoint = _.last(this.data.points);
                lastPoint.count = Math.min(this.data.count - total + lastPoint.count, lastPoint.total);
            },
            // 根据数量计算百分比时，采用向上取整的方法来保证数据的合理性，所以需要修正数据
            _fixLastPointPercent: function (point) {
                var total = _.reduce(this.data.points, function (result, item) {
                    return parseFloat(result) + parseFloat(item.percent);
                }, 0);
                point.percent = 100 - total + point.percent;
            },
            onScoreChange: function (e) {
                var score = e.target.valueAsNumber;
                if (_.isNaN(score)) {
                    score = 0;
                }
                if(score < 0 || !Number.isInteger(score)) {
                    LIB.Msg.error("每题分值必须为正整数");
                    score = Math.abs(Math.floor(score));
                }
                setTimeout(function (that) {
                    that.data.score = score;
                }, 100, this);
            },
            toggleRandom: function () {
                if (!this.data.random) {
                    this.data.randomCount = 0;
                    this.data.randomPercent = 0;
                } else {
                    this._calculateRandom()
                }
            },
            appendPoint: function () {
                var _this = this;
                this.examPointVisible = true;
                //if (!_.isEmpty(this.examPoints)) {
                //    return;
                //}

                if (this.courseid) {
                    this._getExamPointsByCourseId();
                } else {
                    this._getAllExamPoints();
                }
            },
            _getAllExamPoints: function () {
                var _this = this;
                api.queryExampoint().then(function (res) {
                    _this.examPoints = res.data;
                })
            },
            _getExamPointsByCourseId: function () {
                var _this = this;
                api.queryExamPointByCourseId({id:this.courseid}).then(function (res) {
                    var list = res.data.list;
                    if (_.isEmpty(list)) {
                        _this._getAllExamPoints();
                        return;
                    }
                    _this.examPoints = list;
                })
            },
            doSaveExamPoints: function (selects) {
                if (_.isEmpty(selects)) {
                    return;
                }
                //两数组去重
                if (!_.isEmpty(this.data.points)) {
                    _.each(this.data.points, function (data) {
                        _.each(selects, function (item, index) {
                            if (item.id === data.id) {
                                selects.splice(index, 1);
                                return false;
                            }
                        })
                    })
                }
                if (_.isEmpty(selects)) {
                    return;
                }
                this._getQuestionCountByIds(selects);

            },
            _getQuestionCountByIds: function (selects) {
                var _this = this;
                var ids = _.pluck(selects, 'id').join(',');
                api.getQuestionCountByIds({examPointIds: ids, type: this.data.type}).then(function (res) {
                    var o = res.data;
                    _.forEach(selects, function (s) {
                        _this.data.points.push({
                            id: s.id,
                            name: s.name,
                            percent: 0,
                            count: 0,
                            total: parseInt(o[s.id]) || 0
                        })
                    })
                })
            }
        },
        init: function () {
            this.$api = api;
        }
    });

    return vm;
});
