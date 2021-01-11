define(function(require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var api = require("./vuex/api");
    var dateUtils = require("../tools/dateUtils");
    var dataUtils = require("../tools/dataUtils");
    var components = {
			'obj-select':require("../tools/dialog/objSelect")
    };
    var apiMap = {
        };
    var current = new Date();
    var dataModel = function(){
        return {
            mainModel:{
                title:'隐患等级统计',
                datePickModel:{
                    options:{
                        shortcuts:[
                            {text: '本周',value: function() {return [dateUtils.getWeekFirstDay(current), dateUtils.getWeekLastDay(current)];}},
                            {text: '本月',value: function() {return [dateUtils.getMonthFirstDay(current), dateUtils.getMonthLastDay(current)];}},
                            {text: '本季度',value: function() {return [dateUtils.getQuarterFirstDay(current), dateUtils.getQuarterLastDay(current)];}},
                            {text: '本年',value: function() {return [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)];}}
                        ]
                    }
                },
                typeOfRanges:[
                              {value:"frw",label:'机构'},
                              {value:"dep",label:'单位'}
                          ],
                vo:{
                    timeType: null,
                    dateRange: [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)],
                    objRange: [],
                    typeOfRange:'dep',
                },
                rules:{
                	typeOfRange:{required: true, message: '请选择对象范围'},
                    dateRange:[
                        {type:'array',required: true, message: '请选择统计日期'},
                        {
                            validator: function(rule, value, callback) {
                                return value[1] < value[0] ? callback(new Error('结束时间须不小于开始时间')) : callback();
                            }
                        }
                    ]
                },
                charts:{
                    pieChartOpt:{
                        series :[]
                    },
                    barChartOpt:{
                        series :[]
                    }
                }
            },
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
                            title: "一级分类",
                            width: 180,
                            fieldName: "xName",
                            render: function (data) {
                                return LIB.getDataDic("pool_first_level",data.xName);
                            }
                        },
                        {
                            title: "风险等级",
                            width: 120,
                            fieldName: "yName",
                        },
                        {
                            title: "数量",
                            width: 180,
                            fieldName: "yValue"
                        },
                    ],
                    //筛选过滤字段
                    filterColumns: ["criteria.strValue.keyWordValue"]
                }
            },
        }
    };
    var opt = {
        template:template,
        components:components,
        data:function(){
            return new dataModel();
        },
        computed:{
        },
        methods:{
        	changeTypeOfRange:function(){
                this.mainModel.vo.objRange = [];
            },
            changeQryDate:function(type){
                if(1 == type){//本年
                    this.mainModel.vo.dateRange = [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)];
                }else if(2 == type){//本季度
                    this.mainModel.vo.dateRange = [dateUtils.getQuarterFirstDay(current), dateUtils.getQuarterLastDay(current)];
                }else if(3 == type){//本月
                    this.mainModel.vo.dateRange = [dateUtils.getMonthFirstDay(current), dateUtils.getMonthLastDay(current)];
                }else{
                    this.mainModel.vo.dateRange = [];
                }
            },
            showChartLoading:function(){
                this.$refs.pieChart.showLoading();
                this.$refs.barChart.showLoading();
            },
            toggleLegend: function () {
                var opt = this.mainModel.charts.pieChartOpt;
                opt.legend.show = !opt.legend.show;
                if (opt.legend.show) {
                    opt.series[0].center = ['55%', '50%'];
                    opt.toolbox.feature.myTool1.title = '隐藏图例';
                } else {
                    opt.series[0].center = ['50%', '50%'];
                    opt.toolbox.feature.myTool1.title = '显示图例';
                }
            },
            buildPieChart:function(data){
                var _this = this;
                var opt = {
                    title:{x:'center',text:'隐患等级统计-饼状图', top: 20},
                    tooltip : {trigger: 'item',formatter: "{a} <br/>{b} : {c} ({d}%)"},
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
                    left: 10,
                    top: 'middle',
                    padding: [30, 0],
                    // bottom: 20,
                    z: 1,
                    data: [],
                    show: true
                };
                var sery = {
                    startAngle: 0,
                    name: '隐患总数',
                    type: 'pie',
                    radius: '50%',
                    center: ['55%', '50%'],
                    label: {
                        normal: {
                            show: true,
                            formatter: '{b} : {c} ({d}%)'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '18',
                                fontWeight: 'bold',
                                backgroundColor: 'white'
                            },
                            borderColor: '#aaa',
                            borderWidth: 1,
                            borderRadius: 4,
                            padding: 5
                        }
                    },
                    data: []
                };
                _.find(data,function(d,i){
                    legend.data.push(d.xValue);
                    sery.data.push({
                        xId:d.xId,
                        name:d.xValue,
                        value:d.yValue
                    });
                    return i+1 == 20;
                    //return false;
                });
                opt.legend = legend;
                opt.series = [sery];
                this.mainModel.charts.pieChartOpt = opt;
                this.$refs.pieChart.hideLoading();
            },
            buildBarChart:function(data){
                var opt = {
                    title: {x: 'center', text: '隐患等级统计', top: 20},
                    tooltip: {trigger: 'axis'},
                    xAxis: {
                        type: 'value'
                    },
                    grid: {
                        left: 10,
                        right: 30,
                        bottom: 30,
                        containLabel: true
                    }
                };
                var yAxis = {
                    type: 'category',
                    axisLabel: {
                        interval: 0
                    },
                    data: []
                };
                var sery = {
                    name: '隐患总数',
                    type: 'bar',
                    barMaxWidth: 40,
                    label: {
                        normal: {
                            show: true,
                            position: 'inside'
                        }
                    },
                    itemStyle: {
                        normal: {
                            barBorderRadius: [0, 5, 5, 0]
                        }
                    },
                    data: []
                };
                _.find(data,function(d,i){
                    yAxis.data.push(d.xValue)
                    sery.data.push({
                        xId:d.xId,
                        name:d.xValue,
                        value:d.yValue
                    });
                    return i+1 == 20;
                    //return false;
                });
                var maxLengthOfName = _.max(yAxis.data,function(d){return d.length}).length;
                if(8 <= maxLengthOfName){//如果名称最大值大于8个字符，横坐标标签倾斜30度,并截断
                    yAxis.axisLabel = _.extend(yAxis.axisLabel, {
                        // rotate:30,
                        formatter:function(val){
                            return dataUtils.sliceStr(val,8);
                        }
                    });
                }
                opt.yAxis = yAxis;
                opt.series = [sery];
                this.mainModel.charts.barChartOpt = opt;
                this.$refs.barChart.hideLoading();
            },
            getQryParam:function(){
                var vo = this.mainModel.vo;
                var qryParam;
                var dateRange = vo.dateRange;
                if(dateRange.length == 2){
                    var beginDate = vo.dateRange[0];
                    var endDate = vo.dateRange[1];
                    qryParam = {
                        startDateRange: beginDate && beginDate.Format("yyyy-MM-dd hh:mm:ss"),
                        endDateRange: endDate && endDate.Format("yyyy-MM-dd hh:mm:ss")
                    };
                }else{
                    qryParam = {};
                }
                qryParam.envType = 'xbgd';
                qryParam.type = vo.typeOfRange === 'frw' ? 1 : 2;
                qryParam.idsRange = _.map(vo.objRange,function(r){return r.key;}).join(",");
                return _.extend(qryParam, _.pick(vo,"timeType"));
            },
            clickPieChart: function (v) {
                // var vo = this.mainModel.vo;
                // var beginDate = vo.dateRange[0];
                // var endDate = vo.dateRange[1];
                // this.drillModel.table.qryParam = {
                //     startDateRange: beginDate && beginDate.Format("yyyy-MM-dd hh:mm:ss"),
                //     endDateRange: endDate && endDate.Format("yyyy-MM-dd hh:mm:ss"),
                //     idsRange: _.map(vo.objRange,function(r){return r.key;}).join(","),
                //     type:vo.typeOfRange === 'frw' ? 1 : 2,
                //     objValue:v.data.xId,
                //     envType: 'xbgd',
                // };
                // this.drillModel.table.url = '/rpt/stats/pool/infoSource/detail/{curPage}/{pageSize}';
                // // this.drillModel.exportURL = '/rpt/stats/pool/org/all/detail/exportExcel';
                // this.drillModel.show = true;
            },
            doQry:function(){
                var _this = this;
                var qryParam = this.getQryParam();
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        _this.showChartLoading();
                        api.poolCountByBizType(qryParam).then(function (res) {
                            _this.buildPieChart(res.data);
                            _this.buildBarChart(res.data);
                        })
                        // api.queryLookUpItem().then(function (res) {
                        //     var obj = JSON.parse(res.data.content);
                        // // _this.getApi(qryParam).then(function (res) {
                        //     _this.buildPieChart(obj.content);
                        //     _this.buildBarChart(obj.content);
                        // });

                    }
                })
            }
        },
        ready:function(){
            this.doQry();
        }
    };
    return LIB.Vue.extend(opt);
});