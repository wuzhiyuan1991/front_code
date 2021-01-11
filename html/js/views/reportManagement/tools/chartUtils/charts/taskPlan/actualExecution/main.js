/**
 * 计划任务-实际执行-Echarts报表生成器
 */
define(function(require) {
    var LIB = require("lib");
    var api = require("./vuex/api");
    var template = require("text!./main.html");
    var mixins = [require("./../../baseMixin")];
    var dataUtils = require("../../../../dataUtils");
    var echartTools = require("../../../../echartTools");

    var dataModel = function(){
        return {
            apiMap:{
                'frw-org':api.compAll,//计划执行-计划巡检-应执行计划总数-公司-公司
                'frw-specialty':api.compSpecialty,//计划执行-计划巡检-应执行计划总数-公司-专业
                'dep-org':api.depAll,//计划执行-计划巡检-应执行计划总数-部门-公司
                'dep-specialty':api.depSpecialty//计划执行-计划巡检-应执行计划总数-部门-专业
            },
            charts:{
                opt:{
                    series:[]
                }
            }
        }
    };

    var opts = {
        mixins : mixins,
        template:template,
        computed:{
            apiKey:function(){
                var paramOpt = _.propertyOf(this.qryParam);
                var typeOfRange = paramOpt("typeOfRange");
                var key =typeOfRange+'-'+this.method;
                return key;
            }
        },
        data:function(){
            return new dataModel();
        },
        methods:{
            buildParam:function(){
                var paramOpt = _.propertyOf(this.qryParam);
				var dateRange = paramOpt("dateRange");
				var beginDate = dateRange[0].Format("yyyy-MM-dd hh:mm:ss");
				var endDate = dateRange[1].Format("yyyy-MM-dd hh:mm:ss");
				return {
						"idsRange":this.getIdsRange(paramOpt("objRange")),
						"startDateRange":beginDate,
						"endDateRange":endDate
				};
            },
            showChart:function(){
                this.doQry();
            },
            doQry : function(){
                this.method = this.method || "org";
                this.getData().then(function(data){
                    this.buildChart(data);
                });
            },
            buildChart:function(data){
                var opt = this.buildBarChars(data, this.dataLimit);
                this.$emit("build-chart-opt",opt);
                this.charts.opt = opt;
            },
            /**
             * 构建柱状图
             * @param data
             * @param dataLimit
             * @returns {{tooltip: *[], yAxis: *[]}}
             */
            buildBarChars:function(data, dataLimit){
                var typeOfRange = this.qryParam.typeOfRange;
                var opt = {
                    legend: {
                        data: ['实际执行次数', '应执行次数', '实际完成率'],
                        align: 'left',
                        left: 10
                    },
                    tooltip: [
                        {
                            trigger: 'axis',
                            formatter:function(params){
                                var label = "";
                                _.each(params,function(param,i){
                                    if(i ==0) label += param.name+echartTools.getCsn(typeOfRange, _.propertyOf(param.data)("compId"));
                                    label += '<br/>'+echartTools.buildColorPie(param.color)+param.seriesName+' : '+param.value;
                                    if(i == 2) label += '%';
                                });
                                return label;
                            }
                        }
                    ],
                    yAxis : [
                        {name: '执行次数',type : 'value'},
                        {
                            name: '实际完成率(%)',
                            type : 'value',
                            axisLabel:{
                                formatter:"{value}%"
                            }
                        }
                    ]
                };
                var sery1 = {
                    name:'实际执行次数',
                    type:'bar',
                    barMaxWidth:40,
                    label:{normal:{show:true,position:'top'}},
                    itemStyle: {normal: {barBorderRadius :[5, 5, 0, 0]}},
                    data:[]
                };
                var sery2 = {
                    name:'应执行次数',
                    type:'bar',
                    barMaxWidth:40,
                    label:{normal:{show:true,position:'top'}},
                    itemStyle: {normal: {barBorderRadius :[5, 5, 0, 0]}},
                    data:[]
                };
                var sery3 = {
                    name:'实际完成率',
                    type:'line',
                    yAxisIndex: 1,
                    label:{
                        normal:{
                            show: false,
                            position:'top',
                            formatter:'{c}%'
                        }
                    },
                    data:[]
                };
                var xAxis1 = {
                    type : 'category',
                    axisLabel:{
                        interval:0
                    },
                    data : []
                };
                _.each(_.sortBy(data,function(d){return Number(d.yValues.yValue1) * -1}),function(v,i){
                    var value = {
                        xId:v.xId,
                        xName:v.xName,
                        deptId:v.deptId,
                        compId:v.compId,
                        value:v.yValues.yValue1
                    };
                    xAxis1.data.push(value.xName);
                    sery1.data.push(value);
                    sery2.data.push(_.extend({}, value, {value:v.yValues.yValue2}));
                    sery3.data.push(_.extend({}, value, {value:dataUtils.formatPercent(v.yValues.yValue3)}));

                    //return i+1 == dataLimit;
                });
                if(dataLimit <= xAxis1.data.length){//如果分组数量大等于限制数量,添加缩放滚动条
                    opt.dataZoom = [
                        {
                            show: true,
                            type: 'slider',
                            xAxisIndex:0,
                            startValue: 0,
                            endValue: dataLimit,
                            filterMode: 'empty',
                            maxValueSpan: 30
                        },
                        {
                            type: 'inside',
                            maxValueSpan: 30
                        }
                    ];
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
                        bottom: 120,
                        top: 80
                    };
                }
                opt.xAxis = [xAxis1];
                opt.series = [sery1,sery2,sery3];
                return opt;
            }
        }
    };

    var comp = LIB.Vue.extend(opts);
    return comp;
});