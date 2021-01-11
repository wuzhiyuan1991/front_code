/**
 * 标准报表EChart通用基础mixin类型
 * 注：与baseMixin.js组合使用
 */
define(function (require) {
    var LIB = require("lib");
    var dateUtils = require("../../../dateUtils");
    var dataUtils = require("../../../dataUtils");
    var echartTools = require("../../../echartTools");
    //柱状矢量小图标
    var barIcon = "path://M6.7,22.9h10V48h-10V22.9zM24.9,13h10v35h-10V13zM43.2,2h10v46h-10V2zM3.1,58h53.7";
    //饼状矢量小图标
    var pieIcon = "M113.66,73.506c0.22,0.99,0.962,1.677,1.98,1.677c0.66,0,1.32-0.302,1.87-0.825l26.485-25.357c0.797-0.77,1.265-1.843,1.265-2.86c0-0.825-0.33-1.567-0.907-2.145c-7.014-6.683-16.446-10.836-26.567-11.716c-1.925-0.165-4.236,1.32-4.236,3.355l0,0l0,0v37.348l0,0l0,0C113.577,73.176,113.604,73.341,113.66,73.506M113.082,81.234c-1.292-1.293-2.613-2.063-2.613-4.125l0.138-39.851c0.137-0.77,0.055-1.348-0.248-1.733c-0.22-0.248-0.522-0.413-0.853-0.413c-23.652,0-42.876,20.104-42.876,44.829c0,24.092,19.747,43.701,44.031,43.701c10.918,0,21.37-4.098,29.428-11.551c0.688-0.633,1.1-1.513,1.1-2.476c0.027-0.963-0.357-1.843-1.018-2.53L113.082,81.234M150.237,52.247c-1.183-1.458-3.548-1.541-4.923-0.22l-26.182,25.357c-0.688,0.66-1.045,1.54-1.072,2.475c0,0.936,0.357,1.815,1.018,2.503l25.879,25.88c0.798,0.77,1.513,1.018,2.421,1.018c0.962,0,1.87-0.413,2.502-1.155c6.601-7.865,10.259-17.849,10.259-28.107C160.166,69.876,156.618,60.03,150.237,52.247";
    var getLineData = function (lineKey) {
        var lineDate = lineKey.split(":");
        return {
            id: lineDate[0],
            value: lineDate[1]
        };
    };
    return {
        data: function () {
            return {
                charts: {
                    opt: {
                        series: []
                    }
                }
            };
        },
        // props:{
        //     dataLimit:{
        //         type: Number,
        //         default:10
        //     },
        // },
        methods: {
            /**
             * 构建折线图
             * @param data
             * @param dataLimit
             * @param showToolBox 后加的属性， 默认有toolbox
             * @returns {{tooltip: {trigger: string}, toolbox: {feature: {magicType: {type: string[]}}}, yAxis: *[]}}
             */
            buildLineChars: function (data, dataLimit, showToolBox) {
                var hasTool = (typeof showToolBox === 'undefined');
                var typeOfRange = this.qryParam.typeOfRange;
                var opt = {
                    tooltip: {
                        trigger: 'axis', formatter: function (params) {
                            var tip;
                            _.each(params, function (param, i) {
                                if (i == 0) tip = param.name;
                                var data = param.data;
                                tip += "<br/>" + echartTools.buildColorPie(param.color) + data.yName + echartTools.getCsn(typeOfRange, data.compId) + ":" + data.value;
                            });
                            return tip;
                        }
                    },
                    yAxis: [{ type: 'value' }]
                };
                if (hasTool) {
                    opt.toolbox = {
                        feature: {
                            magicType: {
                                type: ['line', 'bar'],
                                iconStyle: {
                                    emphasis: {
                                        textAlign: 'right',
                                    }
                                }
                            }
                        }
                    }
                }

                var xAxis = [{
                    type: 'category',
                    axisTick: { alignWithLabel: true },
                    data: _.sortBy(_.keys(_.groupBy(data, "xValue")))
                }];
                var linesData = _.groupBy(data, function (v) {
                    return v.yId + ":" + v.yName;
                });
                var lineNames = [];
                _.find(_.keys(linesData), function (v, i) {
                    lineNames.push(getLineData(v));
                    return i+1  == dataLimit;
                });
                var legend = {
                    top: 55,
                    data: _.map(lineNames, function (v) {
                        return v.value;
                    })
                };
                var currentData = new Date().Format("yyyy-MM");
                var series = _.map(lineNames, function (lineName) {
                    return {
                        name: lineName.value,
                        type: 'line',
                        label: { normal: { show: true, position: 'top' } },
                        data: _.sortBy(_.map(linesData[lineName.id + ":" + lineName.value], function (lineData) {
                            //未来时间，不显示折线
                            var value = lineData.xValue > currentData ? "-" : lineData.yValue;
                            return {
                                yId: lineData.yId,
                                yName: lineData.yName,
                                deptId: lineData.deptId,
                                compId: lineData.compId,
                                value: value,
                                xValue: lineData.xValue
                            };
                        }), "xValue")
                    }
                });
                opt.xAxis = xAxis;
                opt.legend = legend;
                opt.series = series;
                opt.grid = {
                    bottom: 60,
                    top: 100
                };
                return opt;
            },
            /**
             * 构建柱状图
             * @param data
             * @param dataLimit
             * @returns {{tooltip: *[], yAxis: *[]}}
             */
            buildBarChars: function (data, dataLimit) {
                var typeOfRange = this.qryParam.typeOfRange;
                var opt = {
                    //tooltip: [{trigger: 'axis', formatter: '{b}:{c}'}],
                    tooltip: [
                        {
                            trigger: 'axis',
                            formatter: function (params) {
                                var data = params[0].data;
                                var tip = '';
                                if (data) {
                                    tip = data.xName + echartTools.getCsn(typeOfRange, data.compId) + ":" + data.value;
                                }
                                return tip;
                            }
                        }
                    ],
                    yAxis: [{ type: 'value' }],
                    grid: {
                        left: '0',
                        right: '4%',
                        bottom: 10,
                        top: 20,
                        containLabel: true
                    }
                };
                var sery1 = {
                    name: '检查次数',
                    type: 'bar',
                    barMaxWidth: 40,
                    label: { normal: { show: true, position: 'top' } },
                    itemStyle: { normal: { barBorderRadius: [5, 5, 0, 0] } },
                    data: []
                };
                var xAxis1 = {
                    type: 'category',
                    axisLabel: {
                        interval: 0
                    },
                    data: []
                };

                var _data = _.sortBy(data, function (d) {
                    return Number(d.yValue) * -1
                });
                var _this = this 
                _data = _.map(_.take(_data, dataLimit), function (v) {
                    if (_this.qryParam.typeOfRange=='dep'||_this.qryParam.orgType=='2') {
                        LIB.reNameOrg(v,'xValue')
                    }
                    return {
                        xId: v.xId,
                        xName: v.xValue,
                        deptId: v.deptId,
                        compId: v.compId,
                        value: v.yValue
                    };
                });
                xAxis1.data = _.pluck(_data, "xName");
                sery1.data = _data;
                if (20 < xAxis1.data.length) { //如果分组数量大等于限制数量,添加缩放滚动条
                    opt.grid.bottom = '15%';
                    opt.dataZoom = [
                        {
                            type: 'slider',
                            show: true,
                            xAxisIndex: 0,
                            start: 0,
                            end: parseInt((20 / xAxis1.data.length) * 100),
                            zoomLock: true,
                            showDetail: false
                        }
                    ]
                }

                var maxLengthOfName = _.max(xAxis1.data, function (d) {
                    return d.length
                }).length;
                if (8 <= maxLengthOfName) {//如果名称最大值大于8个字符，横坐标标签倾斜30度,并截断
                    xAxis1.axisLabel = _.extend(xAxis1.axisLabel, {
                        rotate: 30,
                        formatter: function (val) {
                            return dataUtils.sliceStr(val, 8);
                        }
                    });
                    //扩大横坐标底部边距
                    opt.grid = {
                        bottom: 80,
                        top: 80
                    };
                }
                opt.xAxis = [xAxis1];
                opt.series = [sery1];
                return opt;
            },
            /**
             * 构造柱状图与饼图转换工具栏
             * TODO 只处理柱状图与饼图互换
             * @param opt
             */
            buildToolBox: function (opt) {
                var _chartModelthis = this;
                var _opt;
                var seriesType = "bar";
                var radioType = ['bar', 'pie'];
                var _covertBarData2PieData = function (barData) {
                    return _.map(barData, function (dd) {
                        return { value: dd.value, xId: dd.xId, name: dd.xName }
                    });
                };
                var seriesOptGenreator = {
                    'bar': function (option, instance, ecModel, api) {
                        if ("pie" === seriesType) {
                            instance.setOption(option, true);
                        }
                    },
                    'pie': function (option, instance, ecModel, api) {
                        if ("bar" === seriesType) {
                            var newOption = option;
                            newOption.tooltip = [{ trigger: 'item', formatter: '{b}:{c}' }];
                            //删除坐标轴
                            delete newOption.xAxis;
                            delete newOption.yAxis;
                            delete newOption.dataZoom;
                            var data = newOption.series[0].data;
                            newOption.series[0] = {
                                type: 'pie',
                                radius: '55%',
                                center: ['50%', '50%'],
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: true,
                                            formatter: '{b} : {c} ({d}%)'
                                        },
                                        labelLine: { show: true }
                                    }
                                },
                                data: _covertBarData2PieData(data)
                            };
                            instance.setOption(newOption, true);
                        }
                    }
                };
                var onclick = function (ecModel, api, type) {
                    //TODO 只能使用原始的Echart对象及相关方法
                    var echartsInstance = _chartModelthis.$refs.echarts.chart;
                    // Not supported magicType
                    if (!seriesOptGenreator[type]) {
                        // console.warn("不支持的图标类型操作. type : " + type);
                        return;
                    }
                    //seriesType = type;
                    var _this = this;
                    var newOption = _.deepExtend({}, _opt);
                    seriesOptGenreator[type](newOption, echartsInstance, ecModel, api);
                    echartsInstance.setOption(newOption, true);
                    _.each(radioType, function (radio) {
                        _this.model.setIconStatus(radio, 'normal');
                    })
                    _this.model.setIconStatus(type, 'emphasis');
                };
                var toolboxOption = {
                    show: true,
                    right: 20,
                    top: 20,
                    feature: {
                        myTool: {
                            show: true,
                            type: [],
                            // Icon group
                            icon: {
                                bar: barIcon,
                                pie: pieIcon
                            },
                            title: {
                                bar: '切换为柱状图',
                                pie: '切换为饼图'
                            },
                            option: {},
                            seriesIndex: {},
                            onclick: onclick
                        }
                    }
                };
                opt.toolbox = toolboxOption;
                _opt = _.clone(opt);
            },
            /**
             * 构造更多table数据与列配置
             * @param method
             * @param rptData
             * @returns {{columns: Array, data: Array}}
             */
            buildMoreDataTable: function (method, rptData) {
                var columns = [];
                var data = [];
                var typeOfRange = this.qryParam.typeOfRange;
                if (_.contains(["abs", "avg"], method)) {
                    if ("frw" === typeOfRange) {
                        columns.push({ title: "公司", width: 420, fieldName: "name", showTip: true });
                        if (this.qryParam.orgType) {
                            switch (this.qryParam.orgType) {
                                case '2':columns[0].title='部门'
    
                                    break;
                                case '3':columns[0].title='岗位'
    
                                    break;
                                default:
                                    break;
                            }
                        }
                    } else if ("dep" === typeOfRange) {
                        columns.push({ title: "部门", width: 240, fieldName: "name", showTip: true });
                        columns.push({ title: "公司", width: 240, fieldName: "compName", showTip: true });
                    } else if ("per" === typeOfRange) {
                        columns.push({ title: "人员", width: 180, fieldName: "name", showTip: true });
                        columns.push({ title: "部门", width: 180, fieldName: "depName", showTip: true });
                        columns.push({ title: "公司", width: 180, fieldName: "compName", showTip: true });
                    } else if ("equip" === typeOfRange) {
                        columns.push({ title: "设备设施", width: 180, fieldName: "name", showTip: true });
                        columns.push({ title: "部门", width: 180, fieldName: "depName", showTip: true });
                        columns.push({ title: "公司", width: 180, fieldName: "compName", showTip: true });
                    }
                    columns.push({ title: "abs" === method ? "绝对值" : "平均值", fieldName: "value", width: 300 });
                   
                    data = _.sortBy(_.map(rptData, function (v) {
                        return {
                            "name": v.xValue,
                            "depName": _.propertyOf(LIB.getDataDic("org", v.deptId))("deptName"),
                            "compName": _.propertyOf(LIB.getDataDic("org", v.compId))("csn"),
                            "value": v.yValue
                        };
                    }), function (d) {
                        return Number(d.value) * -1
                    });
                } else {
                    //组装表头
                    var widthColFst = 180; // 第一列默认宽度
                    var widthColSec = 100;  // 第二列及以上默认宽度
                    var ranges = _.keys(_.groupBy(rptData, "xValue"));

                    // 当列数较小时配置宽度
                    if (ranges.length < 9) {
                        var aveWidth = (840 / (ranges.length + 1));
                        if (aveWidth > 180) widthColFst = aveWidth;
                        if (aveWidth > 100) widthColSec = aveWidth;
                    }
                    if ("frw" == typeOfRange) {
                        columns.push({ title: "公司", width: widthColFst, fieldName: "name", showTip: true });
                    } else if ("dep" == typeOfRange) {
                        columns.push({ title: "部门", width: widthColFst, fieldName: "name", showTip: true });
                        columns.push({ title: "公司", width: widthColFst, fieldName: "compName", showTip: true });
                    } else if ("per" == typeOfRange) {
                        columns.push({ title: "人员", width: widthColFst, fieldName: "name", showTip: true });
                        columns.push({ title: "部门", width: widthColFst, fieldName: "depName", showTip: true });
                        columns.push({ title: "公司", width: widthColFst, fieldName: "compName", showTip: true });
                    } else if ("equip" == typeOfRange) {
                        columns.push({ title: "设备设施", width: widthColFst, fieldName: "name", showTip: true });
                        columns.push({ title: "部门", width: widthColFst, fieldName: "depName", showTip: true });
                        columns.push({ title: "公司", width: widthColFst, fieldName: "compName", showTip: true });
                    }

                    _.each(ranges, function (d) {
                        var x = { title: d, width: widthColSec, fieldName: d };
                        columns.push(x);
                    });

                    //组装表格数据
                    data = _.map(_.groupBy(rptData, "yName"), function (v, k) {
                        var row = {
                            name: k,
                            "depName": _.propertyOf(LIB.getDataDic("org", v[0].deptId))("deptName"),
                            "compName": _.propertyOf(LIB.getDataDic("org", v[0].compId))("csn")
                        };
                        _.each(v, function (d) {
                            row[d.xValue] = d.yValue;
                        });
                        return row;
                    });
                }
                return {
                    columns: columns,
                    data: data
                }
            },
            /**
             * 构造统计报表参数
             * @returns {{idsRange: *, startDateRange, endDateRange}}
             */
            buildParam: function () {
                var paramOpt = _.propertyOf(this.qryParam);
                var dateRange = paramOpt("dateRange");
                var beginDate = dateRange[0] ? dateRange[0].Format("yyyy-MM-dd hh:mm:ss") : '';
                var endDate = dateRange[1] ? dateRange[1].Format("yyyy-MM-dd hh:mm:ss") : '';
                var params = null
                if (this.qryParam.hasOwnProperty('orgType')) {
                    params = {
                        "idsRange": this.getIdsRange(paramOpt("objRange")),
                        "startDateRange": beginDate,
                        "endDateRange": endDate,
                        "orgType": this.qryParam.orgType
                    };
                } else {
                    params = {
                        "idsRange": this.getIdsRange(paramOpt("objRange")),
                        "startDateRange": beginDate,
                        "endDateRange": endDate,
                    };
                }


                // 报表-自定义查询是否包含随机观察
                if (paramOpt("containRandomData")) {
                    params.containRandomData = 1;
                }
                if (paramOpt("containResignedData")) {
                    params.containResignedData = 1;
                }
                if (paramOpt("limitOrgByDataAuth")) {
                    params.limitOrgByDataAuth = 1;
                }
                return params;
            },
            /**
             * 构造撰取table数据的请求参数
             * @param method
             * @param qryParam
             * @param targetClick
             * @returns {{[criteria.strsValue.item]: *, startDateRange: *, endDateRange: *}}
             */
            buildDrillParam: function (method, qryParam, targetClick) {
                var paramOpt = _.propertyOf(qryParam);
                var dataOpt = _.propertyOf(targetClick.data);
                var objId, beginDate, endDate;
                if ("trend" === method) {//趋势折线图
                    objId = dataOpt("yId");
                    var date = new Date(dataOpt("xValue"));
                    beginDate = dateUtils.getMonthFirstDay(date).Format('yyyy-MM-dd hh:mm:ss');
                    endDate = dateUtils.getMonthLastDay(date).Format('yyyy-MM-dd hh:mm:ss');
                } else {//绝对值/平均值柱状图
                    objId = dataOpt("xId");
                    var dateRange = paramOpt("dateRange");
                    beginDate = dateRange[0].Format("yyyy-MM-dd hh:mm:ss");
                    endDate = dateRange[1].Format("yyyy-MM-dd hh:mm:ss");
                }
                var param = {
                    'criteria.strsValue.item': paramOpt("item"),
                    startDateRange: beginDate,
                    endDateRange: endDate,
                };
                if ("frw" === qryParam.typeOfRange) {//公司
                    param.orgId = objId;
                } else if ("dep" === qryParam.typeOfRange) {//部门
                    param.depId = objId;
                } else if ("per" === qryParam.typeOfRange) {//人员
                    param.checkerId = objId;
                } else if ("equip" === qryParam.typeOfRange) {//设备设施
                    param.equipId = objId;
                }
                return param;
            }
        }
    };
});