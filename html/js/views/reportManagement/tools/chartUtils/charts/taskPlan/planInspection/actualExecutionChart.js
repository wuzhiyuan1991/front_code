/**
 * 计划任务-工作计划-应执行计划总数Echarts报表生成器
 */
define(function(require) {
    var LIB = require("lib");
    var api = require("./vuex/actualExecutionChart-api");
    var template = require("text!./actualExecutionChart.html");
    var mixins = [require("./../../baseMixin")];

    var dataModel = function(){
        return {
            apiMap:{
                'taskPlan-frw-org-2-1':api.compAbs,//计划执行-计划巡检-应执行计划总数-公司-公司
                'taskPlan-frw-specialty-2-1':api.compSpecialty,//计划执行-计划巡检-应执行计划总数-公司-专业
                'taskPlan-dep-org-2-1':api.depAbs,//计划执行-计划巡检-应执行计划总数-部门-公司
                'taskPlan-dep-specialty-2-1':api.depSpecialty//计划执行-计划巡检-应执行计划总数-部门-专业
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
                        data: ['实际执行次数', '应执行次数', '实际完成率'],
                        align: 'left',
                        left: 10
                    },
                    tooltip: [
                        {
                            trigger: 'axis',
                            formatter:'<b>{b}</b><br/><li>{a0}:{c0}</li><li>{a1}:{c1}</li><li>{a2}:{c2}%</li>'
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
                    var value = {
                        xId:v.xId,
                        xName:v.xName,
                        value:v.yValues.yValue1
                    };
                    xAxis1.data.push(value.xName);
                    sery1.data.push(value);
                    sery2.data.push(_.extend({}, value, {value:v.yValues.yValue2}));
                    sery3.data.push(_.extend({}, value, {value:formatPercent(v.yValues.yValue3)}));

                    return i+1 == dataLimit;
                });
                opt.xAxis = [xAxis1];
                opt.series = [sery1,sery2,sery3];
                return opt;
            }
        }
    }
    var comp = LIB.Vue.extend(opts);
    return comp;
});
