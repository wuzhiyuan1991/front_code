define(function (require) {
    var LIB = require('lib');
    var template = require("text!./riskControlReport.html");
    var dateUtils = require("../../tools/dateUtils");
    var dataUtils = require("../../tools/dataUtils");
    var api = require("./vuex/riskControlReport-api");
    var statisConst = require("../../tools/statisticalConst");
    var components = {
        'obj-select': require("../../reportDynamic/dialog/objSelect"),
        'hover-layer': require("./layer"),
        'detail-modal': require("./detailModal")
    };
    var current = new Date();
    var currYear = current.getFullYear();
    var times = {
        prevWeek: new Date(currYear, current.getMonth(), current.getDate()-7),
        prevMonth: new Date(currYear, current.getMonth()-1),
        prevQuarter: new Date(currYear, current.getMonth()-3),
        prevYear: new Date(currYear-1, current.getMonth())
    };
    var dataModel = function () {
        return {
            mainModel: {
                title: "风险管控状况",
                datePickOpts: {
                    shortcuts: [
                        {
                            text: '本周', value: function () {
                            return [dateUtils.getWeekFirstDay(current), dateUtils.getWeekLastDay(current)];
                        }
                        },
                        {
                            text: '本月', value: function () {
                            return [dateUtils.getMonthFirstDay(current), dateUtils.getMonthLastDay(current)];
                        }
                        },
                        {
                            text: '本季度', value: function () {
                            return [dateUtils.getQuarterFirstDay(current), dateUtils.getQuarterLastDay(current)];
                        }
                        },
                        {
                            text: '本年', value: function () {
                            return [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)];
                        }
                        },
                        {text: '上周',value: function() {return [dateUtils.getWeekFirstDay(times.prevWeek), dateUtils.getWeekLastDay(times.prevWeek)];}},
                        {text: '上月',value: function() {return [dateUtils.getMonthFirstDay(times.prevMonth), dateUtils.getMonthLastDay(times.prevMonth)];}},
                        {text: '上季度',value: function() {return [dateUtils.getQuarterFirstDay(times.prevQuarter), dateUtils.getQuarterLastDay(times.prevQuarter)];}},
                        {text: '去年',value: function() {return [dateUtils.getYearFirstDay(times.prevYear), dateUtils.getYearLastDay(times.prevYear)];}}
                    ]
                },
                typeOfRanges: statisConst.typeOfRanges[0],
                sourceInfos: statisConst.sourceInfos,
                qryRules: {
                    typeOfRange: {
                        required: true, message: '请选择对象范围'
                    },
                    dateRange: [
                        {
                            type: 'array',
                            required: true,
                            message: '请选择统计日期'
                        },
                        {
                            validator: function (rule, value, callback) {
                                return value[1] < value[0] ? callback(new Error('结束时间须不小于开始时间')) : callback();
                            }
                        }
                    ]
                },
                //散点图配置
                scatterChartOpt: {
                    series: []
                }
            },
            qryModel: {
                dateRange: [],
                typeOfRange: null,
                objRange: [],
                sourceInfo: null
            },
            showLayer: false,
            chartEventData: [],
            detailModel: {
                visible: false
            }
        }
    };
    var opt = {
        template: template,
        components: components,
        data: function () {
            return new dataModel();
        },
        computed: {
            getApi: function () {
                return this.qryModel.typeOfRange === 'frw' ? api.statisticsOfRiskControlByComp : api.statisticsOfRiskControlByOrg;
            },
            getCheckItemApi: function () {
                return this.qryModel.typeOfRange === 'frw' ? api.getCompCheckItemPercent : api.getOrgCheckItemPercent;
            }
        },
        methods: {
            changeTypeOfRange: function () {
                this.qryModel.objRange = [];
            },
            initQryModel: function () {
                //默认本月
                this.qryModel.dateRange = [dateUtils.getMonthFirstDay(current), dateUtils.getMonthLastDay(current)];
                //默认公司
                this.qryModel.typeOfRange = 'frw';
                //默认全部
                this.qryModel.sourceInfo = '0';
            },
            //组装查询条件
            getQryParam: function () {
                var paramOpt = _.propertyOf(this.qryModel);
                var dateRange = paramOpt("dateRange");
                var beginDate = dateRange[0].Format("yyyy-MM-dd hh:mm:ss");
                var endDate = dateRange[1].Format("yyyy-MM-dd hh:mm:ss");
                var qryParam = {
                    "type": paramOpt("sourceInfo"),
                    "idsRange": dataUtils.getIdsRange(paramOpt("objRange")),
                    "startDateRange": beginDate,
                    "endDateRange": endDate
                };
                return qryParam;
            },
            //查询
            doQry: function () {
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        _this.qryParam = _this.getQryParam();
                        _this.getApi(_this.qryParam).then(function (res) {
                            _this.originalData = res.data;
                            _this.buildLineChartOpt(res.data);
                        });
                    }
                });
            },
            //构造折线图报表配置
            buildLineChartOpt: function (data) {
                var opt = {
                    tooltip: {
                        show: false,
                        confine: true,
                        formatter: function (params) {
                            var vals = params.value;
                            var allVals = _.filter(data, function (d) {
                                var obj = _.propertyOf(d);
                                return vals[0] === obj("xValue") && vals[1] === obj("yValue");
                            });
                            var alllValGroup = _.groupBy(allVals, function (v, i) {
                                return parseInt(i / 5) + 1;
                            });
                            var label = "";
                            _.each(alllValGroup, function (group, n) {
                                if (parseInt(n) > 1) {
                                    label += "<div style='float: left;border-left: solid 1px #fff;margin-left: 5px;'>";
                                } else {
                                    label += "<div style='float: left;'>";
                                }
                                _.each(group, function (v, i) {
                                    var o = _.propertyOf(v);
                                    if (i > 0) label += "<hr/>";
                                    label += o("xName") + "<br/>检查次数: " + o("xValue") + "<br/>符合率: " + o("yValue") + "%";
                                });
                                label += "</div>";
                            });
                            //_.each(allVals,function(v, i){
                            //    var o = _.propertyOf(v);
                            //    if(i > 0) label +="<hr/>";
                            //   label += o("xName")+"<br/>检查次数: "+ o("xValue")+"<br/>符合率: "+o("yValue")+"%";
                            //});
                            return label;
                        }
                    },
                    dataZoom: [
                        {show: true, xAxisIndex: 0}, {type: 'inside'}
                    ],
                    xAxis: [
                        {name: '检查次数'}
                    ],
                    yAxis: [
                        {name: '符合率(%)', min: 0, axisLabel: {formatter: "{value}%"}}
                    ],
                    visualMap: [
                        {
                            left: 'left',
                            top: '10%',
                            dimension: 1,
                            min: 0,
                            max: 100,
                            itemWidth: 30,
                            itemHeight: 120,
                            calculable: true,
                            precision: 0.1,
                            text: ['符合率(%)'],
                            textGap: 30,
                            textStyle: {
                                color: '#000'
                            },
                            inRange: {
                                color: ['#c23531']
                                // symbolSize: [10, 30]
                            },
                            outOfRange: {
                                symbolSize: [10, 30],
                                color: ['rgba(255,255,255,.2)']
                            },
                            controller: {
                                inRange: {
                                    color: ['#c23531']
                                },
                                outOfRange: {
                                    color: ['#444']
                                }
                            }
                        }
                    ]
                };
                var sery1 = {
                    type: 'scatter',
                    symbolSize: function (data) {
                        var num = parseFloat(data[0]);
                        var size = 10;
                        if(num <= 10) {
                            size = 10;
                        }
                        else if(num <= 50) {
                            size = 15;
                        }
                        else if(num <= 100) {
                            size = 20;
                        }
                        else if(num <= 500) {
                            size = 25;
                        }
                        else {
                            size = 30;
                        }
                        return size;
                    },
                    data: _.map(data, function (d) {
                        var _d = _.propertyOf(d);
                        return [_d("xValue"), _d("yValue"), _d("xName")];
                    })
                };
                opt.series = [sery1];
                this.mainModel.scatterChartOpt = opt;
            },
            onLayerChange: function (id) {
                var _this = this;
                _this.$refs.clickLayer.$refs.chart.showLoading();
                this.getCheckItemApi(_.assign(this.qryParam, {attr1: id})).then(function (res) {
                    _this.$refs.clickLayer.buildChartOpt(res.data);
                    _this.$refs.clickLayer.$refs.chart.hideLoading();
                });
            },
            onChartClick: function (params) {
                this.showLayer = false;
                var _this = this;
                _this.$refs.chart.showLoading();

                // params.data: [xValue, yValue, xName]
                // 获取该点的数据(因为可能会有重复的数据， 所以需要从原始数据中过滤)
                this.chartEventData = _.filter(this.originalData, function (item) {
                    return item.xValue === params.data[0] && item.yValue === params.data[1]
                });
                this.getCheckItemApi(_.assign(this.qryParam, {attr1: this.chartEventData[0].xId})).then(function (res) {
                    _this.$refs.clickLayer.buildChartOpt(res.data);
                    _this.$refs.chart.hideLoading();
                });
                // this.detailModel.visible = true;
            },
            calcLayerPosition: function (param) {
                var xPercent = param.offsetX / param.width,
                    yPercent = param.offsetY / param.height;

                if(xPercent <= 0.5) {
                    this.layer.style.right = 'auto';
                    this.layer.style.left = param.offsetX - param.layerWidth * xPercent + 'px';
                } else {
                    this.layer.style.left = 'auto';
                    this.layer.style.right = param.width - param.offsetX - param.layerWidth * (1 - xPercent) + 'px';
                }

                if(yPercent <= 0.25) {
                    this.layer.style.bottom = 'auto';
                    this.layer.style.top = param.offsetY + 20 + 'px';
                } else {
                    this.layer.style.top = 'auto';
                    this.layer.style.bottom = param.height - param.offsetY + 20 + 'px';
                }
            },
            onChartMouseOver: function (params) {
                // params.data: [xValue, yValue, xName]
                // 获取该点的数据(因为可能会有重复的数据， 所以需要从原始数据中过滤)
                this.chartEventData = _.filter(this.originalData, function (item) {
                    return item.xValue === params.data[0] && item.yValue === params.data[1]
                });

                var styles = getComputedStyle(this.$refs.chart.$el, null);
                var position = {
                    offsetX: params.event.offsetX,
                    offsetY: params.event.offsetY,
                    width: parseInt(styles.getPropertyValue('width')),
                    height: parseInt(styles.getPropertyValue('height'))
                };
                this.showLayer = true;
                this.$nextTick(function () {
                    var layerStyles = getComputedStyle(this.layer, null);
                    position.layerWidth = parseInt(layerStyles.getPropertyValue('width'));
                    position.layerHeight = parseInt(layerStyles.getPropertyValue('height'));
                    this.calcLayerPosition(position);
                });
            },
            onChartMouseOut: function () {
                this.showLayer = false;
            },
            doExport:function(){
                var _this = this;
                window.open("/rpt/checkTable/riskControl/" + this.qryModel.typeOfRange + "/exportexcel"+LIB.urlEncode(this.getQryParam()).replace("&", "?"));
            }
        },
        ready: function () {
            this.initQryModel();
            this.$nextTick(function () {
                this.doQry();
            });
            this.layer = this.$refs.hoverLayer.$el;
        },
        events: {
            'chartclick': function (params) {
                if(this.detailModel.visible === true) {
                    return;
                }
                this.onChartClick(params);
            },
            'chartmouseover': function (params) {
                if(this.detailModel.visible === true) {
                    return;
                }
                this.onChartMouseOver(params);
            },
            'chartmouseout': function () {
                if(this.detailModel.visible === true) {
                    return;
                }
                this.onChartMouseOut();
            }
        }
    };
    return LIB.Vue.extend(opt);
});