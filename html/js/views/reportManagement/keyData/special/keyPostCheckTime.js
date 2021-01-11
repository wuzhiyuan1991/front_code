define(function (require) {
    var LIB = require('lib');
    var template = require("text!./keyPostCheckTime.html");
    var qryInfoApi = require("../../tools/vuex/qryInfoApi");
    var dateUtils = require("../../tools/dateUtils");
    var components = {
        // 'cascader':require('components/cascader/iviewCascader'),
        'obj-select': require("../../reportDynamic/dialog/objSelect"),
        // 'qry-info-edit':require("../../reportDynamic/dialog/qryInfoEdit"),
        // 'check-record-details':require("../../reportDynamic/dialog/checkRecordDetails"),
        'echart-component': require("./keyPost")
    };
    var orgTypes = [
        {value:"3",label:'按岗位统计'},
        {value:"2",label:'按部门统计'},
        {value:"1",label:'按公司统计'}
    ];
    var dataModel = function () {
        var current = new Date();
        var currYear = current.getFullYear();
        var times = {
            prevWeek: new Date(currYear, current.getMonth(), current.getDate()-7),
            prevMonth: new Date(currYear, current.getMonth()-1),
            prevQuarter: new Date(currYear, current.getMonth()-3),
            prevYear: new Date(currYear-1, current.getMonth())
        };
        return {
            datePickModel: {
                options: {
                    shortcuts: [
                        {
                            text: '本周',
                            value: function () {
                                return [dateUtils.getWeekFirstDay(current), dateUtils.getWeekLastDay(current)];
                            }
                        },
                        {
                            text: '本月',
                            value: function () {
                                return [dateUtils.getMonthFirstDay(current), dateUtils.getMonthLastDay(current)];
                            }
                        },
                        {
                            text: '本季度',
                            value: function () {
                                return [dateUtils.getQuarterFirstDay(current), dateUtils.getQuarterLastDay(current)];
                            }
                        },
                        {
                            text: '本年',
                            value: function () {
                                return [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)];
                            }
                        },
                        {text: '上周',value: function() {return [dateUtils.getWeekFirstDay(times.prevWeek), dateUtils.getWeekLastDay(times.prevWeek)];}},
                        {text: '上月',value: function() {return [dateUtils.getMonthFirstDay(times.prevMonth), dateUtils.getMonthLastDay(times.prevMonth)];}},
                        {text: '上季度',value: function() {return [dateUtils.getQuarterFirstDay(times.prevQuarter), dateUtils.getQuarterLastDay(times.prevQuarter)];}},
                        {text: '去年',value: function() {return [dateUtils.getYearFirstDay(times.prevYear), dateUtils.getYearLastDay(times.prevYear)];}}
                    ]
                }
            },
            typeOfRanges:orgTypes,
            qryInfoModel: {
                title: '关键岗位检查次数统计',
                vo: {
                    method: 'avg',//统计方式,abs-绝对值;avg-平均值;trend-平均值
                    item: [],
                    indicators: null,
                    objRange: [],
                    orgType:'3',
                    typeOfRange: 'frw',
                    dateRange: [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)]
                },
                rules: {
                    dateRange: [
                        {type: 'array', required: true, message: '请选择统计日期'},
                        {
                            validator: function(rule, value, callback) {
                                return value[1] < value[0] ? callback(new Error('结束时间须不小于开始时间')) : callback();
                            }
                        }
                    ]
                }
            },
            dataNumLimit: 20
        };
    };
    var opt = {
        template: template,
        components: components,
        data: function () {
            return dataModel();
        },
        props: {
            qryInfoDetail: Object
        },
        methods: {
            loadQryParam: function (qryInfo) {
                var _this = this;
                var qryInfoId = qryInfo.schemeId;
                if (_.isNull(qryInfoId)) {
                    return;
                }
                qryInfoApi.get({id: qryInfoId}).then(function (res) {
                    var d = res.data;
                    var param = _.clone(d.details);
                    _this.qryInfoModel.title = d.name;
                    var qryParam = _this.qryInfoModel.vo;

                    var item = [];
                    item.push(param.item);
                    if (param.indicators) {
                        item = item.concat(param.indicators.split("-"));
                    }
                    qryParam.item = item;
                    //统计方法
                    qryParam.method = param.method;

                    _this.$nextTick(function () {
                        qryParam.dateRange = [new Date(param.beginDate), new Date(param.endDate)];
                        _this.$nextTick(function () {
                            if (!_.isNull(param.objRange) && "" !== _.trim(param.objRange)) {
                                qryParam.objRange = JSON.parse(param.objRange);
                            } else {
                                qryParam.objRange = [];
                            }
                            //查询绝对值
                            _this.doQry();
                        });
                    });
                });
            },
            doQry: function () {
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        var qryParam = _.deepExtend({}, _this.qryInfoModel.vo);
                        var chartComp = _this.$refs.echart;
                        chartComp.doQry(qryParam);
                    }
                });
            },
            _queryDataNumLimit: function () {
                var _this = this;
                qryInfoApi.queryDataNumLimit().then(function (res) {
                    _this.dataNumLimit = Number(res.data.result) || 20;
                    _this.doQry();
                })
            }
        },
        created: function () {
            // this.loadQryParam(this.qryInfoDetail);
        },
        ready: function () {
            if(this.qryInfoDetail.item === 'times') {
                this.qryInfoModel.title = '关键岗位检查次数统计';
            } else {
                this.qryInfoModel.title = '关键岗位发现问题统计';
            }
            this.qryInfoModel.vo.item.push(this.qryInfoDetail.item);
            this._queryDataNumLimit();
        }
    };
    return LIB.Vue.extend(opt);
});