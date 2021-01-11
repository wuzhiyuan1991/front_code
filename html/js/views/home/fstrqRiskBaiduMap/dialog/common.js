define(function () {

    var getTime = function (day) {
        var date = new Date();
        date.setTime(date.getTime()- 24*60*60*1000*day);
        return date;
    };

    var dateRanges = [
        {
            id: '1',
            value: '最近十次检查',
            param : {
                startDate : null,
                endDate : null,
                count : 10
            }
        },{
            id: '2',
            value: '最近一周检查',
            param : {
                startDate : getTime(7),
                endDate : new Date(),
                count : null
            }
        },{
            id: '3',
            value: '最近一月检查',
            param : {
                startDate : getTime(30),
                endDate : new Date(),
                count : null
            }
        },
        {
            id: '4',
            value: '最近季度检查',
            param : {
                startDate : getTime(30*3),
                endDate : new Date(),
                count : null
            }
        },
        {
            id: '5',
            value: '最近半年检查',
            param : {
                startDate : getTime(30*6),
                endDate : new Date(),
                count : null
            }
        },
        {
            id: '6',
            value: '最近一年检查',
            param : {
                startDate : getTime(365),
                endDate : new Date(),
                count : null
            }
        }
    ];


    var focusTypes = [
        {
            id: '1001',
            level: '1',
            name: '重大危险源',
            num: 0
        },
        {
            id: '1002',
            level: '1',
            name: '重点化学品',
            num: 0
        },
        {
            id: '1003',
            level: '1',
            name: '重点化学工艺',
            num: 0
        }
    ];

    var normalizeFocusTypes = function (checkTables, focusTypes) {
        var _items = _.groupBy(checkTables, 'focusType');
        _.forEach(focusTypes, function (item) {
            var _g = _items[item.id];
            item.num = _g ? _g.length : 0;
        })
    };

    var calculateStaticRisk = function (checkTables, staticRisks, currentStaticRisk) {
        var _items = _.groupBy(checkTables, 'level');
        var riskLevel = currentStaticRisk;

        _.forEach(staticRisks, function (item) {
            var _g = _items[item.level];
            if(_g && _g.length) {
                item.num = _g.length;
                if(item.level > riskLevel) {
                    riskLevel = item.level
                }
            } else {
                item.num = 0
            }
        });

        return riskLevel;
    };

    var calculateDynamicRisk = function (checkTables, dynamicRisks, currentDynamicRisk) {
        var _items = _.groupBy(checkTables, 'dynamicLevel');
        var riskLevel = currentDynamicRisk;

        _.forEach(dynamicRisks, function (item) {
            var _g = _items[item.level];
            if(_g && _g.length) {
                item.num = _g.length;
                if(item.level > riskLevel) {
                    riskLevel = item.level
                }
            } else {
                item.num = 0
            }
        });
        return riskLevel;
    };

    var calculateDynamicRiskLevel = function (items) {
        var dynamicRiskLevel = '1';
        var _group = _.groupBy(items, "dynamicLevel");

        var keys = _.compact(_.map(_.keys(_group), function (item) {
            return parseInt(item);
        }));

        if(keys.length > 0) {
            dynamicRiskLevel =  _.max(keys) + '';
        }

        return dynamicRiskLevel || '1';
    };


    var getFilteredCheckTables = function (cache, tables) {

        var checkTables = tables;

        // 风险点类型过滤
        if(cache.riskPointTypeId) {
            checkTables = _.filter(checkTables, function (item) {
                return item.checkObjType === cache.riskPointTypeId;
            });
        }

        // 重点关注类型过滤
        if(cache.focusTypeId) {
            checkTables = _.filter(checkTables, function (item) {
                return item.focusType === cache.focusTypeId;
            });
        }

        // 固有风险过滤
        if(cache.staticId) {
            checkTables = _.filter(checkTables, function (item) {
                return item.level === cache.staticId;
            });
        }

        // 动态风险过滤
        if(cache.dynamicId) {
            checkTables = _.filter(checkTables, function (item) {
                return item.dynamicLevel === cache.dynamicId;
            });
        }

        return checkTables;
    };

    var doRenderBgColor = function (riskLevel, riskColorMap) {
        riskLevel = riskLevel || '1';
        var bgColor = riskColorMap[riskLevel];
        var obj = {
            backgroundColor: bgColor,
            color: "#fff"
        };
        return obj;
    };

    var buildOptions = function (data, dateRangeId, riskNames, riskPojos) {
        var opt = {
            animationDuration: 500,
            title: {
                text: '管控风险趋势图',
                x: 'center',
                textStyle: {
                    fontSize: 14,
                    color: "#fff"
                }
            },
            color: ['#3398DB'],
            tooltip : {
                trigger: 'axis',
                formatter: function (arr) {
                    var obj = arr[0];
                    if(obj.name && obj.value) {
                        return obj.name + '<br />' + riskNames[obj.value];
                    }
                }
            },
            grid: {
                left: '0',
                right: '4%',
                bottom: 10,
                top: 20,
                containLabel: true
            },
            yAxis : [
                {
                    type : 'value',
                    min: 0,
                    max: 4,
                    axisLabel: {
                        formatter: function (value) {
                            return riskNames[value];
                        }
                    }
                }
            ],
            series : [
                {
                    type:'line',
                    data: _.pluck(data, 'level'),
                    symbol: 'circle',
                    symbolSize: 10,
                    smooth: true,
                    label: {
                        normal: {
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: function (data) {

                                return _.find(riskPojos, function (item) {
                                    return item.level === data.value;
                                }).color;
                            }
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: '#35aae1'
                        }
                    }
                }
            ]
        };

        if(dateRangeId === '1') {
            opt.xAxis = [
                {
                    type : 'category',
                    data : _.pluck(data, 'date'),
                    axisLabel: {
                        interval: 0,
                        // rotate:30
                        formatter: function(val){
                            if(!val) {
                                return '';
                            }
                            var strs = val.split(' '); //字符串数组
                            // var str = ''
                            // for (var i = 0, s; s = strs[i++];) { //遍历字符串数组
                            //     str += s;
                            //     if (!(i % 5)) str += '\n';
                            // }
                            return strs[0].substr(5) + '\n' + strs[1].substr(0, 5);
                        }
                    }
                }
            ]
        }
        else {
            opt.xAxis = [
                {
                    type : 'category',
                    data : _.pluck(data, 'date'),
                    axisLabel: {
                        interval: 0,
                        // rotate:30
                        formatter: function(val){
                            if(!val) {
                                return '';
                            }
                            return val.substr(0, 4) + '\n' + val.substr(5);
                        }
                    }
                }
            ]
        }

        if(data.length > 10) {
            opt.grid.bottom = '15%';
            opt.dataZoom = [
                {
                    type: 'slider',
                    show: true,
                    xAxisIndex: 0,
                    start: 0,
                    end: parseInt((10 / data.length) * 100),
                    zoomLock:true,
                    showDetail:false
                }
            ]
        }

        return opt;
    };

    return {
        dateRanges: dateRanges,
        focusTypes: focusTypes,
        calculateFocusTypesCount: normalizeFocusTypes,
        calculateStaticRiskCount: calculateStaticRisk,
        calculateDynamicRiskCount: calculateDynamicRisk,
        calculateDynamicRiskLevel: calculateDynamicRiskLevel,
        getFilteredCheckTables: getFilteredCheckTables,
        doRenderBgColor: doRenderBgColor,
        buildOptions: buildOptions
    }
});