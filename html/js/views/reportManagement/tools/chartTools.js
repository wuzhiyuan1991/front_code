define(function (require) {
    var dateUtils = require("./dateUtils");
    var dataUtils = require("../tools/dataUtils");
    //柱状矢量小图标
    var barIcon = "path://M6.7,22.9h10V48h-10V22.9zM24.9,13h10v35h-10V13zM43.2,2h10v46h-10V2zM3.1,58h53.7";
    //饼状矢量小图标
    var pieIcon = "M113.66,73.506c0.22,0.99,0.962,1.677,1.98,1.677c0.66,0,1.32-0.302,1.87-0.825l26.485-25.357c0.797-0.77,1.265-1.843,1.265-2.86c0-0.825-0.33-1.567-0.907-2.145c-7.014-6.683-16.446-10.836-26.567-11.716c-1.925-0.165-4.236,1.32-4.236,3.355l0,0l0,0v37.348l0,0l0,0C113.577,73.176,113.604,73.341,113.66,73.506M113.082,81.234c-1.292-1.293-2.613-2.063-2.613-4.125l0.138-39.851c0.137-0.77,0.055-1.348-0.248-1.733c-0.22-0.248-0.522-0.413-0.853-0.413c-23.652,0-42.876,20.104-42.876,44.829c0,24.092,19.747,43.701,44.031,43.701c10.918,0,21.37-4.098,29.428-11.551c0.688-0.633,1.1-1.513,1.1-2.476c0.027-0.963-0.357-1.843-1.018-2.53L113.082,81.234M150.237,52.247c-1.183-1.458-3.548-1.541-4.923-0.22l-26.182,25.357c-0.688,0.66-1.045,1.54-1.072,2.475c0,0.936,0.357,1.815,1.018,2.503l25.879,25.88c0.798,0.77,1.513,1.018,2.421,1.018c0.962,0,1.87-0.413,2.502-1.155c6.601-7.865,10.259-17.849,10.259-28.107C160.166,69.876,156.618,60.03,150.237,52.247";
    var tools = {
        barIcon: barIcon,
        pieIcon: pieIcon,
        /**
         * 转换id数组参数为使用","拼接的字符串
         * @param ranges
         * @returns {string}
         */
        getIdsRange: function (ranges) {
            var array = _.map(ranges, function (r) {
                return r.key;
            });
            return array.join(",");
        },
        /**
         * 构建柱状图
         * @param data
         * @param dataLimit
         * @returns {{tooltip: *[], yAxis: *[]}}
         */
        buildBarChars: function (seryName, data, dataLimit) {
            var opt = {
                tooltip: [{trigger: 'axis', formatter: '{b}:{c}'}],
                yAxis: [{type: 'value'}]
            };
            var sery1 = {
                name: seryName,
                type: 'bar',
                barMaxWidth: 40,
                label: {normal: {show: true, position: 'top'}},
                itemStyle: {normal: {barBorderRadius: [5, 5, 0, 0]}},
                data: []
            };
            var xAxis1 = {
                type: 'category',
                axisLabel: {
                    interval: 0
                },
                data: []
            };
            _.find(_.sortBy(data, function (d) {
                return Number(d.yValue) * -1
            }), function (v, i) {
                var value = {
                    xId: v.xId,
                    xName: v.xValue,
                    value: v.yValue
                };
                xAxis1.data.push(value.xName);
                sery1.data.push(value);

                return i + 1 == dataLimit;
            });
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
                    bottom: 80
                };
            }
            opt.xAxis = [xAxis1];
            opt.series = [sery1];
            return opt;
        },
        /**
         * 构建折线图
         * @param data
         * @param dataLimit
         * @returns {{tooltip: {trigger: string}, toolbox: {feature: {magicType: {type: string[]}}}, yAxis: *[]}}
         */
        buildLineChars: function (data, dataLimit) {
            var opt = {
                tooltip: {trigger: 'axis'},
                toolbox: {
                    feature: {magicType: {type: ['line', 'bar']}}
                },
                yAxis: [{type: 'value'}]
            };
            var xAxis = [{
                type: 'category',
                axisTick:{alignWithLabel :true},
                data: _.sortBy(_.keys(_.groupBy(data, "xValue")))
            }];
            var linesData = _.groupBy(data, function(v,i){
                return v.yId + ":" + v.yName;
            });
            var lineNames = [];
            _.find(_.keys(linesData), function (v, i) {
                var d = v.split(":");
                lineNames.push({id: d[0], name: d[1]});
                return i + 1 == dataLimit;
            });
            var legend = {
                top: 25,
                data: lineNames
            };
            var series = _.map(lineNames, function (lineName) {
                return {
                    name: lineName.name,
                    type: 'line',
                    label: {normal: {show: true, position: 'top'}},
                    data: _.sortBy(_.map(linesData[lineName.id+":"+lineName.name], function (lineData) {
                        return {
                            yId: lineData.yId,
                            yName: lineData.yName,
                            value: lineData.yValue,
                            xValue: lineData.xValue
                        };
                    }), "xValue")
                }
            });
            opt.xAxis = xAxis;
            opt.legend = legend;
            opt.series = series;
            return opt;
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
            if (_.contains(["abs", "avg"], method)) {
                columns = [
                    {title: "统计对象个体名称", width: "180px", fieldName: "name", showTip: true},
                    {title: "abs" === method ? "绝对值" : "平均值", fieldName: "value"}
                ];
                data = _.sortBy(_.map(rptData, function (v) {
                    return {"name": v.xValue, "value": v.yValue};
                }), function (d) {
                    return Number(d.value) * -1
                });
            } else {
                //组装表头
                columns.push({title: "对象名称", width: "180px", fieldName: "name", showTip: true});
                var ranges = _.keys(_.groupBy(rptData, "xValue"));

                _.each(ranges, function (d) {
                    var x = {title: d, width: "80px", fieldName: d};
                    columns.push(x);
                });

                //组装表格数据
                data = _.map(_.groupBy(rptData, "yName"), function (v, k) {
                    var row = {name: k};
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
                endDateRange: endDate
            };
            if ("frw" === qryParam.typeOfRange) {//机构
                param.orgId = objId;
            } else if ("dep" === qryParam.typeOfRange) {//部门
                param.depId = objId;
            } else if ("per" === qryParam.typeOfRange) {//人员
                param.checkerId = objId;
            } else if ("equip" === qryParam.typeOfRange) {//设备设施
                param.equipId = objId;
            }
            return param;
        },
        /**
         * 构造撰取table数据的请求参数
         * @param method
         * @param qryParam
         * @param targetClick
         * @returns {{[criteria.strsValue.item]: *, startDateRange: *, endDateRange: *}}
         */
        buildDrill2Param: function (method, qryParam, targetClick) {
            var paramOpt = _.propertyOf(qryParam);
            var dataOpt = _.propertyOf(targetClick.data);
            var objId, beginDate, endDate,type;
            if ("org" === method) {
                objId = dataOpt("xId");
                var dateRange = paramOpt("dateRange");
                beginDate = dateRange[0].Format("yyyy-MM-dd hh:mm:ss");
                endDate = dateRange[1].Format("yyyy-MM-dd hh:mm:ss");
            }  else if ("specialty" === method) {
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
            if ("specialty" === method) {
                param.specialty = objId;
            } else {
                param.id = objId;
            }
            if ("frw" === qryParam.typeOfRange) {//机构
                param.type = 1;
            } else if ("dep" === qryParam.typeOfRange) {//部门
                param.type = 2;
            }
            return param;
        },
        buildColorPie : function(color){
            return '<span style="display:inline-block;margin-right:5px;'
                        + 'border-radius:10px;width:9px;height:9px;background-color:' + color + '"></span>';
        }
    };
    return tools;
});