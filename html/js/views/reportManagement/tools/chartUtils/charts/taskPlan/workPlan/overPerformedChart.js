/**
 * 计划任务-工作计划-超期执行计划数Echarts报表生成器
 */
define(function(require) {
    var LIB = require("lib");
    var api = require("./vuex/overPerformedChart-api");
    var template = require("text!./overPerformedChart.html");
    var mixins = [require("./../../baseMixin")];
    //柱状矢量小图标
	var barIcon = "path://M6.7,22.9h10V48h-10V22.9zM24.9,13h10v35h-10V13zM43.2,2h10v46h-10V2zM3.1,58h53.7";
	//饼状矢量小图标
	var pieIcon = "M113.66,73.506c0.22,0.99,0.962,1.677,1.98,1.677c0.66,0,1.32-0.302,1.87-0.825l26.485-25.357c0.797-0.77,1.265-1.843,1.265-2.86c0-0.825-0.33-1.567-0.907-2.145c-7.014-6.683-16.446-10.836-26.567-11.716c-1.925-0.165-4.236,1.32-4.236,3.355l0,0l0,0v37.348l0,0l0,0C113.577,73.176,113.604,73.341,113.66,73.506M113.082,81.234c-1.292-1.293-2.613-2.063-2.613-4.125l0.138-39.851c0.137-0.77,0.055-1.348-0.248-1.733c-0.22-0.248-0.522-0.413-0.853-0.413c-23.652,0-42.876,20.104-42.876,44.829c0,24.092,19.747,43.701,44.031,43.701c10.918,0,21.37-4.098,29.428-11.551c0.688-0.633,1.1-1.513,1.1-2.476c0.027-0.963-0.357-1.843-1.018-2.53L113.082,81.234M150.237,52.247c-1.183-1.458-3.548-1.541-4.923-0.22l-26.182,25.357c-0.688,0.66-1.045,1.54-1.072,2.475c0,0.936,0.357,1.815,1.018,2.503l25.879,25.88c0.798,0.77,1.513,1.018,2.421,1.018c0.962,0,1.87-0.413,2.502-1.155c6.601-7.865,10.259-17.849,10.259-28.107C160.166,69.876,156.618,60.03,150.237,52.247";

    var dataModel = function(){
        return {
            apiMap:{
                'taskPlan-frw-org-1-3':api.compAbs,//计划执行-工作计划-超期执行计划总数-公司-公司
                'taskPlan-frw-specialty-1-3':api.compSpecialty,//计划执行-工作计划-超期执行计划总数-公司-专业
                'taskPlan-dep-org-1-3':api.depAbs,//计划执行-工作计划-超期执行计划总数-部门-公司
                'taskPlan-dep-specialty-1-3':api.depSpecialty//计划执行-工作计划-超期执行计划总数-部门-专业
            },
            charts:{
                opt:{
                    series:[]
                }
            }
        }
    };
    var formatPercent = function(num){
        return new Number(num * 100).toFixed(1);
    }
    var opts = {
        mixins : mixins,
        template:template,
        computed:{
            apiKey:function(){
                var paramOpt = _.propertyOf(this.qryParam);
                var items = _.deepExtend([],paramOpt("item"));
                var type = items.shift();
                var typeOfRange = paramOpt("typeOfRange");
                var key = type+'-'+typeOfRange+'-'+this.method+"-"+items.join("-");
                return key;
            }
        },
        data:function(){
            return new dataModel();
        },
        methods : {
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
                var opt = {
                    legend: {
                        data: ['超期执行次数', '超期完成率'],
                        align: 'left',
                        left: 10
                    },
                    tooltip: [
                        {
                            trigger: 'axis',
                            formatter:'<b>{b}</b><br/><li>{a0}:{c0}</li><li>{a1}:{c1}%</li>'
                        }
                    ],
                    yAxis : [
                        {name: '执行次数',type : 'value'},
                        {
                            name: '超期完成率(%)',
                            type : 'value',
                            axisLabel:{
                                formatter:"{value}%"
                            }
                        }
                    ]
                };
                var sery1 = {
                    name:'超期执行次数',
                    type:'bar',
                    barMaxWidth:40,
                    label:{normal:{show:true,position:'top'}},
                    itemStyle: {normal: {barBorderRadius :[5, 5, 0, 0]}},
                    data:[]
                };
                var sery2 = {
                    name:'超期完成率',
                    type:'line',
                    yAxisIndex: 1,
                    label:{
                        normal:{
                            show:true,
                            position:'top',
                            formatter:'{c}%'
                        }},
                    data:[]
                };
                var xAxis1 = {
                    type : 'category',
                    axisLabel:{
                        interval:0
                    },
                    data : []
                };
                _.find(_.sortBy(data,function(d){return Number(d.yValues.yValue1) * -1}),function(v,i){
                    var value1 = {
                        xId:v.xId,
                        xName:v.xName,
                        value:v.yValues.yValue1
                    };
                    xAxis1.data.push(value1.xName);
                    sery1.data.push(value1);
                    sery2.data.push(_.extend({}, value1, {value:formatPercent(v.yValues.yValue2)}));

                    return i+1 == dataLimit;
                });
                opt.xAxis = [xAxis1];
                opt.series = [sery1,sery2];
                this.buildToolBox(opt);
                return opt;
            },
            /**
             * 构造柱状图与饼图转换工具栏
             * TODO 只处理柱状图与饼图互换
             * @param opt
             */
            buildToolBox:function(opt){

                var _chartModelthis = this;
                var _opt;
                var seriesType = "bar";
                var radioType = ['bar', 'pie'];
                var _covertBarData2PieData = function(barData){
                    return _.map(barData, function(dd){
                        return {value:dd.value,xId:dd.xId,name:dd.xName}
                    });
                };
                var seriesOptGenreator = {
                    'bar': function(option, instance, ecModel, api){
                        if("pie" == seriesType){
                            instance.setOption(option, true);
                        }
                    },
                    'pie': function(option, instance, ecModel, api){
                        if("bar" == seriesType){
                            var newOption = option;
                            newOption.tooltip = [{trigger: 'item',formatter:'{b}:{c}'}];
                            //删除坐标轴
                            delete newOption.xAxis;
                            delete newOption.yAxis;
                            var sery1 = newOption.series.shift();
                            var data = sery1.data;
                            newOption.series = [{
                                type:'pie',
                                radius : '55%',
                                center: ['50%', '50%'],
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: true,
                                            formatter: '{b} : {c} ({d}%)'
                                        },
                                        labelLine: {show: true}
                                    }
                                },
                                data:_covertBarData2PieData(data)
                            }];
                            instance.setOption(newOption, true);
                        }
                    }
                };
                var onclick = function(ecModel, api, type){
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
                    _.each(radioType, function(radio){
                        _this.model.setIconStatus(radio, 'normal');
                    })
                    _this.model.setIconStatus(type, 'emphasis');
                };
                var toolboxOption = {
                            show: true,
                            right: 20,
                            top:20,
                            feature: {
                                myTool:{
                                    show: true,
                                    type: [],
                                    // Icon group
                                    icon: {
                                        bar:barIcon,
                                        pie:pieIcon
                                    },
                                    title:{
                                        bar: '切换为柱状图',
                                        pie:'切换为饼图'
                                    },
                                    option: {},
                                    seriesIndex: {},
                                    onclick: onclick
                                }
                            }
                        };
                opt.toolbox = toolboxOption;
                _opt = _.clone(opt);
            }
        }
    }
    var comp = LIB.Vue.extend(opts);
    return comp;
});
