define(function(require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var api = require("./vuex/api");
    var dateUtils = require("../../tools/dateUtils");
    var components = {
			'obj-select':require("../../tools/dialog/objSelect")
    };
    var now = new Date().Format("yyyy-MM-dd hh:mm:ss");
    var current = new Date();
    var completionKeyValue = {
        'xNum':'正常巡检',
        'yValue':'异常巡检',
        // 'unFinish':'未巡检',
    };
    var tableColor = {
        "日巡检表" : "#b7c472",
        "周巡检表" : "#87ffb7",
        "月巡检表" : "#7ea3ff",
        // "" : "#DCDCDC",
    }
    var dataModel = function(){
        var _this = this;
        var columsCfg = LIB.setting.fieldSetting["BC_HaG_HazT"] ? LIB.setting.fieldSetting["BC_HaG_HazT"] : [];
        var renderTableModel = _.bind(LIB.tableRenderMgr.renderModel, _this, columsCfg);
        return {
            mainModel:{
                title:'巡检统计',
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
                    barChart:{
                        firstBarChart:{
                            opt:{
                                series :[]
                            },
                            value:null,
                            typeObj:null
                        },
                        secondBarChart:{
                            opt:{
                                series :[]
                            },
                            value:null,
                            typeObj:null
                        },
                    },
                    pieChart:{
                        opt:{
                            series :[]
                        },
                        value:null
                    },

                }
            },
            drillModel: {
                table: LIB.Opts.extendMainTableOpt(
                    renderTableModel({
                    //数据请求地址
                    url: '/rpt/stats/inspection/task/list/{curPage}/{pageSize}',
                    //请求参数
                    qryParam: null,
                    //对应表格字段
                    columns: [
                        {
                            //
                            title: "编码",
                            fieldName: "code",
                            width: 180
                        },
                        {
                            title: "检查任务",
                            fieldName:"groupName",
                            render: function (data) {
                                return data.groupName + "#" + data.num;
                            },
                            width: 240
                        },
                        {
                            title: "检查表",
                            fieldType: "custom",
                            sortable :false,
                            render: function (data) {
                                if (data.checkPlan) {
                                    var list = _.pluck(data.checkPlan.checkTables, 'name');
                                    list = list.filter(function (item) {
                                        return item && item!='' && item!=null && item!=undefined
                                    });
                                    return list.join("，");
                                }
                            },
                            width: 240
                        },
                        {
                            title: "检查对象",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.checkPlan) {
                                    var list = _.pluck(data.checkPlan.checkObjects, 'name');
                                    list = _.union(list).join("，")
                                    return list;
                                }
                            },
                            width: 240
                        },
                        {
                            //检查人
                            title: "检查人",
                            //fieldName: "checkUser.name",
                            orderName: "checkerId",
                            width: 100,
                            render: function (data) {
                                if (data.checkUser) {
                                    return data.checkUser.name;
                                }else if(data.checkerNames){
                                    return data.checkerNames;
                                }
                            },
                        },
                        {
                            //任务状态 默认0未到期 1待执行 2按期执行 3超期执行 4未执行
                            title: "任务状态",
                            fieldName:"status",
                            fieldType: "custom",
                            render: function (data) {
                                return LIB.getDataDic("task_group_status", data.status);
                            },
                            width: 100
                        },
                        {
                            //开始时间
                            title: "开始时间",
                            fieldName: "startDate",
                            width: 180
                        },
                        {
                            //结束时间
                            title: "结束时间",
                            fieldName: "endDate",
                            width: 180
                        }

                    ],
                    //筛选过滤字段
                    filterColumns: ["criteria.strValue.keyWordValue"]
                }))
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
                this.$refs.barChartFirst.showLoading();
                this.$refs.barChartSecond.showLoading();
            },
            // toggleLegend: function () {
            //     var opt = this.mainModel.charts.pieChart.opt;
            //     opt.legend.show = !opt.legend.show;
            //     if (opt.legend.show) {
            //         opt.series[0].center = ['55%', '50%'];
            //         opt.toolbox.feature.myTool1.title = '隐藏图例';
            //     } else {
            //         opt.series[0].center = ['50%', '50%'];
            //         opt.toolbox.feature.myTool1.title = '显示图例';
            //     }
            // },
            exchangeToCN: function(data){
        	    _.each(data, function(item){
                    var keys = _.keys(item);
                    _.each(keys, function(key){
                        if(completionKeyValue[key]){
                            item[completionKeyValue[key]] = item[key];
                            delete item[key];
                        }
                    })
                })
            },
            buildBarChartFirst:function(data){
        	    this.exchangeToCN(data);
                var legendName = _.map(data,"xName");
                var yName = _.filter(_.keys(data[0]),function (item) {
                    return item != 'xName';
                })
                var k = {};
                _.each(data,function(item){
                    k[item.xName] = item;
                })
                var opt =  {
                    title: {x: 'center', text: '巡检执行统计', top: 20},
                    tooltip: {trigger: 'axis'},
                    legend: {
                        data:legendName,
                    },
                    grid: {
                        left: 10,
                        right: 30,
                        bottom: 30,
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value'
                    },
                    yAxis: {
                        type: 'category',
                        data: yName
                    },
                };
                if (10 <= data.length) {//如果分组数量大等于限制数量,调整x轴标签倾斜
                    opt.dataZoom = [
                        {show: true, xAxisIndex: 0, startValue: 0, endValue: 10}, {type: 'inside'}
                    ];
                }
                var series = [];
                _.each(legendName, function (item) {
                    var d = {
                        name: item,
                        type: 'bar',
                        stack: '总量',
                        barMaxWidth: 40,
                        label: {
                            show: true,
                            position: 'insideRight',
                            normal: {
                                show: true,
                                position: 'inside',
                                formatter: function(params) {
                                    return params.value > 0 ? params.value : "";
                                }
                            }
                        },
                    }
                    var dd = [];
                    _.each(yName, function (it) {
                        k[item][it]
                        if(k[item][it]){
                            dd.push(k[item][it])
                        }else{
                            dd.push(0);
                        }
                    })
                    d.data = dd;
                    d.itemStyle = {
                        normal: {
                            // 设置饼图的颜色
                            color: function(val){
                                return tableColor[val.seriesName];
                            }

                        },
                    }
                    series.push(d);
                })
                opt.series = series;
                this.mainModel.charts.barChart.firstBarChart.opt = opt;
                this.$refs.barChartFirst.hideLoading();
            },

            buildBarChartSecond:function(data){
                this.mainModel.charts.barChart.secondBarChart.typeObj = _.uniq(data,"xValue");
                _.each(this.mainModel.charts.barChart.secondBarChart.typeObj,function (item) {
                    item.value = item.xValue;
                    item.id = item.xId;
                })
                this.exchangeToCN(data);
                var opt =  {
                    title: {x: 'center', text: '员工巡检统计', top: 20},
                    tooltip: {trigger: 'axis'},
                    legend: {
                        data:_.values(completionKeyValue),
                    },
                    grid: {
                        left: 10,
                        right: 30,
                        bottom: 30,
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: _.map(data,"xValue")
                    },
                    yAxis: {
                        type: 'value'

                    },
                };
                if (10 <= data.length) {//如果分组数量大等于限制数量,调整x轴标签倾斜
                    opt.dataZoom = [
                        {show: true, xAxisIndex: 0, startValue: 0, endValue: 10}, {type: 'inside'}
                    ];
                }
                debugger
                var series = [
                    {
                        name: '正常巡检',
                        type: 'bar',
                        stack: '总量',
                        barMaxWidth: 40,
                        label: {
                            show: true,
                            position: 'insideRight',
                            normal: {
                                show: true,
                                position: 'inside',
                                formatter: function(params) {
                                    return params.value > 0 ? params.value : "";
                                }
                            }
                        },
                        itemStyle:{
                            normal:{color:"#aacd03"}
                        },
                        data: _.map(data,"正常巡检")
                    },
                    {
                        name: '异常巡检',
                        type: 'bar',
                        stack: '总量',
                        barMaxWidth: 40,
                        label: {
                            show: true,
                            position: 'insideRight',
                            normal: {
                                show: true,
                                position: 'inside',
                                formatter: function(params) {
                                    return params.value > 0 ? params.value : "";
                                }
                            }
                        },
                        itemStyle:{
                            normal:{color:"#db4520"}
                        },
                        data: _.map(data,"异常巡检")
                    },
                    {
                        name: '未巡检',
                        type: 'bar',
                        stack: '总量',
                        barMaxWidth: 40,
                        label: {
                            show: true,
                            position: 'insideRight',
                            normal: {
                                show: true,
                                position: 'inside',
                                formatter: function(params) {
                                    return params.value > 0 ? params.value : "";
                                }
                            }
                        },
                        data: _.map(data,"未巡检")
                    },
                ];
                opt.series = series;
                this.mainModel.charts.barChart.secondBarChart.opt = opt;
                this.$refs.barChartSecond.hideLoading();
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
                qryParam.bizType = this.$route.query.bizType ? this.$route.query.bizType : 'default';
                return _.extend(qryParam, _.pick(vo,"timeType"));
            },
            clickPieChart: function (v) {
                var _this = this;
                this.mainModel.charts.pieChart.value = null;
                this.mainModel.charts.barChart.firstBarChart.value = null;
                this.mainModel.charts.barChart.secondBarChart.value = null;
                var qryParam = this.getQryParam();
                if(v.data.selected){
                    this.mainModel.charts.pieChart.value = v.data.xId;
                    qryParam.firstChartValue = v.data.xId;
                }
                api.countByCompletion(qryParam).then(function (res) {
                    _this.buildBarChartFirst(res.data);
                })
                api.countByUserCompletion(qryParam).then(function (res) {
                    _this.buildBarChartSecond(res.data);
                })
                _this.queryTable(qryParam);
            },
            clickFirstBarChart: function(v){
                this.mainModel.charts.barChart.firstBarChart.value = null;
                this.mainModel.charts.barChart.secondBarChart.value = null;
                // var find = _.find(this.mainModel.charts.barChart.firstBarChart.typeObj,'value',v.name);
        	    if(v.name){
                    this.mainModel.charts.barChart.firstBarChart.value = v.name;
                    var _this = this;
                    var qryParam = this.getQryParam();
                    qryParam.firstChartValue = this.mainModel.charts.pieChart.value;
                    qryParam.secondChartValue = v.name;
                    api.countByUserCompletion(qryParam).then(function (res) {
                        _this.buildBarChartSecond(res.data);
                    })
                    _this.queryTable(qryParam);
                }

            },
            clickSecondBarChart: function(v){
                this.mainModel.charts.barChart.secondBarChart.value = null;
                var find = _.find(this.mainModel.charts.barChart.secondBarChart.typeObj,'value',v.name);
                if(find){
                    this.mainModel.charts.barChart.secondBarChart.value = find.id;
                    var _this = this;
                    var qryParam = this.getQryParam();
                    qryParam.firstChartValue = this.mainModel.charts.pieChart.value;
                    qryParam.secondChartValue = this.mainModel.charts.barChart.firstBarChart.value;
                    qryParam.thirdChartValue = find.id;
                    _this.queryTable(qryParam);
                }

            },
            queryTable: function(qryParam){
                var params = [];
                _.each(_.keys(qryParam),function (item) {
                    params.push({
                        type: "save",
                        value: {
                            columnFilterName: item,
                            columnFilterValue: qryParam[item]
                        }
                    })
                })
                this.$refs.table.doCleanRefresh(params);
            },
            buildPieChart:function(data){
        	    var total = 0;
        	    _.each(data, function(item){
                    total += Number(item.yValue);
                })
                var _this = this;
                var opt = {
                    title:{x:'center',text:'巡检类型统计总数：' + total, top: 20},
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
                    selectedMode: 'single',
                    name: '风险统计',
                    type: 'pie',
                    radius: '50%',
                    center: ['55%', '50%'],
                    label: {
                        normal: {
                            show: true,
                            formatter: '{b} : {c} ({d}%)',
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
                    data: [],
                    itemStyle: {
                        normal: {
                            // 设置饼图的颜色
                            color: function(val){
                                return tableColor[val.data.name];
                            }

                        },
                    }
                };
                _.find(data,function(d,i){
                    legend.data.push(d.xName);
                    sery.data.push({
                        xId:d.xId,
                        name:d.xName,
                        value:d.yValue
                    });
                    return i+1 == 20;
                    //return false;
                });
                opt.legend = legend;
                opt.series = [sery];
                this.mainModel.charts.pieChart.opt = opt;
                this.$refs.pieChart.hideLoading();
            },
            doQry:function(){
                var _this = this;
                var qryParam = this.getQryParam();
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        _this.showChartLoading();
                        api.countByTableType(qryParam).then(function (res) {
                            _this.buildPieChart(res.data);
                        })
                        api.countByCompletion(qryParam).then(function (res) {
                            _this.buildBarChartFirst(res.data)
                        })
                        api.countByUserCompletion(qryParam).then(function (res) {
                            _this.buildBarChartSecond(res.data)
                        })
                        _this.queryTable(qryParam);

                    }
                })
            }
        },
        ready:function(){
            this.doQry();
        }
    };
    return LIB.VueEx.extend(opt);
});