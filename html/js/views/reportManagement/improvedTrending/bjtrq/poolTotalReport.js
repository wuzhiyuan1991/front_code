define(function (require) {
    var LIB = require('lib');
    var template = require("text!./poolTotalReport.html");
    var dateUtils = require("../../tools/dateUtils");
    var dataUtils = require("../../tools/dataUtils");
    var api = require("./vuex/poolTotalReport-api");
    var components = {
        'obj-select': require("../../reportDynamic/dialog/objSelect")
    };
    var apiMap = {
        'frw-pie': api.poolCountByOrg,//公司-饼状图
        'dep-pie': api.poolCountByDep,//单位-饼状图

        'frw-bar': api.poolCountByOrgAndDate,//公司-柱状图
        'dep-bar': api.poolCountByDepAndDate,//单位-柱状图
    };
    var dataModel = function () {
        var currentYear = Number(new Date().Format("yyyy"));
        return {
            qryInfoModel: {
                title: '隐患总数统计',
                qryYears: (function (lastYear) {
                    var years = [];
                    for (var year = 2014; year <= lastYear; year++) {
                        years.push(year);
                    }
                    return years;
                })(currentYear),
                year: null,
                vo: {
                    method:'pie',
                    typeOfRange: 'frw',
                    timeType: 1,
                    dateRange: [],
                    objRange: []
                }
            },
            pieChartOpt: {
                series: []
            },
            barChartOpt: {
                series: []
            },
            typeOfRanges: [
                {value: "frw", label: '公司'},
                {value: "dep", label: '部门'},
                // {value: "equip", label: '设备设施'}
            ],
            drillModel: {
                show: false,
                title: "明细",
                //导出excel服务地址
                exportURL: '',
                table: {
                    //数据请求地址
                    url: '',
                    //请求参数
                    qryParam: null,
                    //对应表格字段
                    columns: [
                        {
                            title: "编码",
                            width: 180,
                            fieldName: "title"
                        },
                        {
                            title: "类型",
                            width: 120,
                            fieldType: "custom",
                            render: function (data) {
                                return LIB.getDataDic("pool_type", data.type);
                            }
                        },
                        {
                            title: "检查人",
                            width: 120,
                            fieldName: "checkerName"
                        },
                        {
                            title: "问题描述",
                            width: 240,
                            fieldName: "problem"
                        },
                        {
                            title: "建议措施",
                            width: 240,
                            fieldName: "danger"
                        },
                        {
                            title: "登记日期",
                            width: 180,
                            fieldName: "registerDate"
                        },
                        {
                            title: "整改期限",
                            width: 180,
                            fieldName: "reformMaxDate"
                        },
                        {
                            title: "风险等级",
                            width: 120,
                            fieldType: "custom",
                            render: function (data) {
                                if (data.riskLevel) {
                                    var riskLevel = JSON.parse(data.riskLevel);
                                    var resultColor = _.propertyOf(JSON.parse(data.riskModel))("resultColor");
                                    if (riskLevel && riskLevel.result) {
                                        //return riskLevel.result;
                                        if (resultColor) {
                                            return "<span style='background:\#" + resultColor + ";color:\#" + resultColor + ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + riskLevel.result;
                                        } else {
                                            return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + riskLevel.result;
                                        }
                                    } else {
                                        //return "无";
                                        return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + "无";
                                    }
                                } else {
                                    //return "无";
                                    return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + "无";
                                }
                            }
                        },
                        {
                            title: "状态",
                            width: 120,
                            fieldType: "custom",
                            render: function (data) {
                                return LIB.getDataDic("pool_status", data.status);
                            }
                        }
                    ],
                    //筛选过滤字段
                    filterColumns: ["criteria.strValue.keyWordValue"]
                }
            },
            pieList:null
        }
    };
    var opt = {
        template: template,
        components: components,
        data: function () {
            return new dataModel();
        },
        props: {
            qryInfoDetail: Object
        },
        computed: {
            getApi: function () {
                var vo = this.qryInfoModel.vo;
                if(vo.typeOfRange){
                    return apiMap[vo.typeOfRange + '-' + vo.method];
                }else{
                    return apiMap['frw' + '-' + vo.method];
                }

            },
        },
        methods: {
            toggleLegend: function () {
                var opt = this.pieChartOpt;
                opt.legend.show = !opt.legend.show;
                if (opt.legend.show) {
                    //opt.series[0].center = ['50%', '50%'];
                    opt.toolbox.feature.myTool1.title = '隐藏图例';
                } else {
                    //opt.series[0].center = ['50%', '50%'];
                    opt.toolbox.feature.myTool1.title = '显示图例';
                }
            },
            changeTypeOfRange: function () {
                this.qryInfoModel.vo.objRange = [];
            },
            changeQryYear: function (year) {
                this.qryInfoModel.vo.dateRange = [year + '-01-01 00:00:00', year + '-12-31 23:59:59'];
            },

            buildPieChart: function (data) {
                
              
                var _this = this;
                var opt = {
                    title: {x: 'center', text: '隐患总数统计-饼状图', top: 5},
                    tooltip: {trigger: 'item', formatter: "{a} <br/>{b} : {c} ({d}%)"},
                    toolbox: {
                        feature: {
                            myTool1: {
                                show: true,
                                title: '隐藏图例',
                                icon: 'image://images/toggle.svg',
                                onclick: function (){
                                    _this.toggleLegend();
                                }
                            }
                        },
                        top: 5,
                        left: 5,
                        iconStyle: {
                            emphasis: {
                                textPosition: 'right',
                                textAlign: 'left'
                            }
                        }
                    }
                };
                var legend = {
                    type: 'scroll',
                    orient: 'vertical',
                    left: 20,
                    top: 'middle',
                    padding: [30, 0],
                    data: [],
                    show: true
                };
                var sery = {
                    name: '隐患总数',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                formatter: '{b} : {c} ({d}%)'
                            },
                            labelLine: {show: true}
                        }
                    },
                    data: []
                };
               
                
                var _data = _.map(_.take(data, this.dataNumLimit), function (d) {
                    if (_this.qryInfoModel.vo.typeOfRange=='dep') {
                        
                     
                        LIB.reNameOrg(d,'xValue')
                       
                    }
                    return {
                        xId: d.xId,
                        name: d.xValue,
                        value: d.yValue
                    }
                });

                sery.data = _data;
                legend.data = _.pluck(_data, "name");

                opt.legend = legend;
                opt.series = [sery];
                this.pieChartOpt = opt;
                this.$refs.pieChart.hideLoading();
            },
            buildBarChart: function (data, type) {
                var opt = {
                    title: {x: 'center', text: '隐患总数统计', top: 5},
                    tooltip: {trigger: 'axis'},
                    yAxis: [{type: 'value'}]
                };
                var xAxis1 =
                    {
                        type: 'category',
                        axisLabel: {
                            interval: 0
                        }, data: []
                    };
                var sery = {
                    name: '隐患总数',
                    type: 'bar',
                    barMaxWidth: 40,
                    label: {normal: {show: true, position: 'top'}},
                    itemStyle: {normal: {barBorderRadius: [5, 5, 0, 0]}},
                    data: []
                };
                _.find(_.sortBy(data, "xValue"), function (d, i) {
                    xAxis1.data.push(d.xValue)
                    sery.data.push({
                        xId: d.xId,
                        name: d.xValue,
                        value: d.yValue
                    });
                    return i + 1 == 20;
                    //return false;
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
                opt.series = [sery];
                if(type){
                    this.pieChartOpt = opt;
                }else{
                    this.barChartOpt = opt;
                }

                this.$refs.barChart.hideLoading();
            },
            showChartLoading: function () {
                this.$refs.pieChart.showLoading();
                this.$refs.barChart.showLoading();
            },
            changeMethod: function (m) {
                if(this.qryInfoModel.vo.method === m) {
                    return;
                }
                this.qryInfoModel.vo.method = m;
                var _this = this;
                if(m == 'pie'){
                    this.buildPieChart(this.pieList);
                }else{
                    this.buildBarChart(this.pieList, 1);
                }
            },
            getQryParam: function () {
                var vo = this.qryInfoModel.vo;
                var qryParam;

                var dateRange = vo.dateRange;
                if (dateRange.length == 2) {
                    var beginDate = vo.dateRange[0];
                    var endDate = vo.dateRange[1];
                    qryParam = {
                        startDateRange: beginDate,
                        endDateRange: endDate
                    };
                } else {
                    qryParam = {};
                }
                qryParam.idsRange = _.map(vo.objRange, function (r) {
                    return r.key;
                }).join(",");
                return _.extend(qryParam, _.pick(vo, "timeType"));
            },

            doQry: function () {
                var _this = this;
                var qryParam = this.getQryParam();
                this.showChartLoading();

                //隐患总数柱状图
                apiMap[this.qryInfoModel.vo.typeOfRange + '-pie'](qryParam).then(function (res) {
                    _this.pieList = res.data;
                    _this.buildPieChart(res.data);
                });

                //隐患总数柱状图
                apiMap[this.qryInfoModel.vo.typeOfRange + '-bar'](qryParam).then(function (res) {
                    _this.buildBarChart(res.data);
                });
            },
            clickPieChart: function (v) {
                this.drillModel.table.qryParam = {
                    startDateRange: this.qryInfoModel.vo.dateRange[0],
                    endDateRange: this.qryInfoModel.vo.dateRange[1],
                    idsRange: v.data.xId
                };
                this.drillModel.table.url = '/rpt/stats/pool/org/all/detail/{curPage}/{pageSize}';
                this.drillModel.exportURL = '/rpt/stats/pool/org/all/detail/exportExcel';
                this.drillModel.show = true;
            },
            clickBarChart: function (v) {
                this.drillModel.table.qryParam = {
                    idsRange: _.map(this.qryInfoModel.vo.objRange, function (r) {
                        return r.key;
                    }).join(","),
                    objValue: v.data.name,
                    timeType: this.qryInfoModel.vo.timeType
                };
                this.drillModel.table.url = '/rpt/stats/pool/type/all/detail/{curPage}/{pageSize}';
                this.drillModel.exportURL = '/rpt/stats/pool/type/all/detail/exportExcel';
                this.drillModel.show = true;
            },
            doExportData: function () {
                window.open(this.drillModel.exportURL + LIB.urlEncode(this.drillModel.table.qryParam).replace("&", "?"));
            },
            _queryDataNumLimit: function () {
                var _this = this;
                api.queryDataNumLimit().then(function (res) {
                    _this.dataNumLimit = Number(res.data.result) || 20;
                    _this.doQry();
                })
            }
        },
        ready: function () {
            var currentYear = new Date().Format("yyyy");
            this.qryInfoModel.year = currentYear;
            this.changeQryYear(currentYear);
            this._queryDataNumLimit();
        }
    };
    return LIB.Vue.extend(opt);
});