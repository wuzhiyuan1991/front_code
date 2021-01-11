define(function(require) {
    var LIB = require('lib');
    var template = require("text!./main2.html");
    var api = require("./vuex/api");
    var dateUtils = require("../../tools/dateUtils");
    var components = {
			'obj-select':require("../../tools/dialog/objSelect")
    };

    var cardTaskKeyValue = [
        ["低风险","中风险","高风险"]
    ]

    var now = new Date().Format("yyyy-MM-dd hh:mm:ss");
    var current = new Date();
    var dataModel = function(){
        var _this = this;
        var columsCfg = LIB.setting.fieldSetting["BC_HaG_HazT"] ? LIB.setting.fieldSetting["BC_HaG_HazT"] : [];
        var renderTableModel = _.bind(LIB.tableRenderMgr.renderModel, _this, columsCfg);
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
                    timeType: -1,
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
                    pieChart:{
                        opt:{
                            series :[]
                        },
                        value:null
                    },
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
                        thirdBarChart:{
                            opt:{
                                series :[]
                            },
                            value:null,
                            typeObj:null
                        },
                    },
                }
            },
            drillModel: {
                table: LIB.Opts.extendMainTableOpt(
                    renderTableModel({
                    //数据请求地址
                    url: '/rpt/stats/periodicwork/riskJudge/list2/{curPage}/{pageSize}',
                    //请求参数
                    qryParam: null,
                    //对应表格字段
                    columns: [
                        {
                            title: '编码',
                            fieldName: "code",
                            width: 180,
                            fieldType: "link",
                            fieldType: "custom",
                            render: function (data) {
                                return "<a target='_blank' href='/html/main.html#!/periodicWork/mgr/riskJudge?method=select&date="+data.operationStartDate+"&code="+data.code+"'>"+data.code+"</a>"

                            },
                        },
                        {
                            //作业分类
                            title: "作业分类",
                            fieldName: "operationType",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.iraRiskJudgmentOptypeVos) {
                                    return _.pluck(data.iraRiskJudgmentOptypeVos, "name").join("、")
                                }
                            }
                        },
                        {
                            //作业名称
                            title: "作业名称",
                            fieldName: "operationName",
                        },
                        {
                            title: "作业区域",
                            fieldName: "dominationAreaName",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.dominationAreas) {
                                    return _.pluck(data.dominationAreas, "name").join("、")
                                }
                            }
                        },
                        {
                            title: "风险等级",
                            fieldName: "riskLevel",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.riskLevel) {
                                    var resultColor = LIB.getDataDic("risk_level_result_color", data.riskLevel);
                                    return "<span style='background:" + resultColor + ";color:" + resultColor + ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + LIB.getDataDic("risk_level_result", data.riskLevel);
                                } else {
                                    return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + "无";
                                }

                            },
                        },
                        {
                            //作业开始时间
                            title: "作业开始时间",
                            fieldName: "operationStartDate",
                            fieldType: "custom",
                            render: function (data) {
                                return LIB.formatYMD(data.operationStartDate);
                            }
                        },
                        {
                            //作业结束时间
                            title: "作业结束时间",
                            fieldName: "operationEndDate",
                            fieldType: "custom",
                            render: function (data) {
                                return LIB.formatYMD(data.operationEndDate);
                            }
                        },
                        {
                            //风险研判内容
                            title: "存在风险",
                            fieldName: "content",
                        },
                        {
                            title: "控制措施",
                            fieldName: "controls",
                        },
                        {
                            //状态0-待执行；1-已结束
                            title: "状态",
                            fieldName: "status",
                            fieldType: "custom",
                            render: function (data) {
                                if(data.operationStartDate != null && data.operationEndDate != null && data.status != null){
                                    if (data.status == 0 && data.operationStartDate < now && data.operationEndDate > now) {
                                        data.status = 1;//执行中
                                    }
                                    if (data.operationEndDate < now) {
                                        data.status = 2;//已结束
                                    }
                                }
                                return LIB.getDataDic("ira_risk_judgm_status",data.status);
                            },
                        },
                        _.extend(_.clone(LIB.tableMgr.column.company),{ filterType: null}) ,
                        _.extend(_.clone(LIB.tableMgr.column.dept),{ filterType: null}) ,
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

        watch: {
            "mainModel.vo.timeType": function (val) {
                var _this = this;
                if(val){
                    var date = new Date();
                    var oneDay = 24*3600*1000;
                    var times = date.getTime() - date.getTime()%(oneDay);
                    var monthFirstDay = new Date().setDate(1) - new Date().setDate(1)%(oneDay)
                    // 星期几
                    var day = new Date().getDay();
                    // var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");

                    if(val == '5'){
                        if(day == 0){
                            this.mainModel.vo.dateRange = [];
                            var offMut = 6 * oneDay;
                            _this.mainModel.vo.dateRange.push(new Date(times - offMut));
                            _this.mainModel.vo.dateRange.push(new Date(times));
                        }else{
                            var offsetDay = (7 - day) * oneDay;
                            var offMut = (1 - day) * oneDay;
                            this.mainModel.vo.dateRange = [];
                            _this.mainModel.vo.dateRange.push(new Date(times + offMut));
                            _this.mainModel.vo.dateRange.push(new Date(times + offsetDay));
                        }
                    } else if(val == '4'){
                        this.mainModel.vo.dateRange = [];
                        _this.mainModel.vo.dateRange.push(new Date(monthFirstDay));
                        _this.mainModel.vo.dateRange.push(new Date(CurrentMonthLast()));
                    }else if(val == '1' || val == '2' || val=='3'){
                        this.mainModel.vo.dateRange = [];
                        _this.mainModel.vo.dateRange.push(new Date(getFirstDayOfYear()));
                        _this.mainModel.vo.dateRange.push(new Date(getLastDayOfYear()));
                    }

                    this.doQry()
                }

                 function getFirstDayOfYear () {
                    var date = new Date();
                     date.setDate(1);
                     date.setMonth(0);
                     var time = date.getTime() - date.getTime()%oneDay;
                     return new Date(time) ;
                 }
                function getLastDayOfYear(){
                    var date = new Date();
                    date.setDate(31);
                    date.setMonth(11);
                    var time = date.getTime() - date.getTime()%oneDay;
                    return new Date(time) ;
                }
                function CurrentMonthLast(){
                    var date=new Date();
                    var currentMonth=date.getMonth();
                    var nextMonth=++currentMonth;
                    var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
                    var oneDay=1000*60*60*24;
                    return new Date(nextMonthFirstDay-oneDay);
                }
            }
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
                // this.$refs.pieChart.showLoading();
                this.$refs.barChartThird.showLoading();
                this.$refs.barChartFirst.showLoading();
                this.$refs.barChartSecond.showLoading();
            },
            toggleLegend: function () {
                // var opt = this.mainModel.charts.pieChart.opt;
                // opt.legend.show = !opt.legend.show;
                // if (opt.legend.show) {
                //     opt.series[0].center = ['55%', '50%'];
                //     opt.toolbox.feature.myTool1.title = '隐藏图例';
                // } else {
                //     opt.series[0].center = ['50%', '50%'];
                //     opt.toolbox.feature.myTool1.title = '显示图例';
                // }
            },
            buildPieChart:function(data){
                var _this = this;
                var opt = {
                    title:{x:'center',text:'风险研判', top: 20},
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
                    name: '风险研判',
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
                            // color: function(val){
                            //     return "";
                            // }

                        },
                    }
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
                // this.mainModel.charts.pieChart.opt = opt;
                // this.$refs.pieChart.hideLoading();

                // var qryParam = this.getQryParam();
                // api.countAndTodo(qryParam).then(function (res) {
                //     if(res.data.length){
                //         _this.mainModel.charts.pieChart.opt.title.text = "风险研判总数：" + res.data[0].xValue + "    执行中："+res.data[0].yValue;
                //     }
                //
                // })
            },
            getBarChartSery: function(data){
                var sery = [];
                var map = _.map(_.uniq(data,"xValue"),"xValue");//去重
                var group  = _.groupBy(data,function (item) {//分组，id一样在同一柱子
                    return item.yName;
                });
                _.each(cardTaskKeyValue[0],function (item,index) {
                    var barData = group[item];
                    var barName = cardTaskKeyValue[0][index];
                    var value = {
                        name: barName,
                        type: 'bar',
                        stack: '总量',
                        barMaxWidth: 40,
                        label: {
                            normal: {
                                show: true,
                                position: 'inside',
                                formatter: function(params) {
                                    return params.value > 0 ? params.value : "";
                                }
                            }

                        },
                        itemStyle:{
                            normal:{color:function (v) {
                                if (v.seriesName == '低风险') {
                                    return '#4472c4';
                                } else if (v.seriesName == '中风险') {
                                    return '#ffc12a';
                                } else {
                                    return '#ff1e02';
                                }
                                }}
                        },
                        data:[]
                    }
                    if(barData){
                        _.each(map,function (it) {
                            var f = _.find(barData,function (i) {
                                return i.xValue === it;
                            })
                            if(f){
                                value.data.push(f.yValue);
                            }else{
                                value.data.push("0");
                            }
                        })
                    }else{
                        _.each(map,function () {
                            value.data.push("0");
                        })

                    }
                    sery.push(value);
                })
                return sery;
            },
            buildBarChartFirst:function(data){
                this.mainModel.charts.barChart.firstBarChart.typeObj = _.uniq(data,"xValue");
                _.each(this.mainModel.charts.barChart.firstBarChart.typeObj,function (item) {
                    item.value = item.xValue;
                    item.id = item.xId;
                })
                var legendName = _.map(data,"yName");
                var opt = {
                    title: {x: 'center', text: '区域风险作业统计', top: 20},
                    tooltip: {trigger: 'axis'},
                    xAxis: {
                        type: 'value'
                    },
                    yAxis: {
                        type: 'category',
                        data: this.mainModel.charts.barChart.firstBarChart.typeObj,
                    },
                    grid: {
                        left: 10,
                        right: 30,
                        bottom: 30,
                        containLabel: true
                    },
                    legend: {
                        data: legendName
                    },
                };
                opt.series = this.getBarChartSery(data);
                this.mainModel.charts.barChart.firstBarChart.opt = opt;
                this.$refs.barChartFirst.hideLoading();
            },
            buildBarChartSecond:function(data){
                this.mainModel.charts.barChart.secondBarChart.typeObj = _.uniq(data,"xValue");
                _.each(this.mainModel.charts.barChart.secondBarChart.typeObj,function (item) {
                    item.value = item.xValue;
                    item.id = item.xId;
                })
                var opt = {
                    title: {x: 'center', text: '员工危险作业管控统计', top: 20},
                    tooltip: {trigger: 'axis'},
                    color: ['#c26002'],
                    yAxis: {
                        type: 'value'
                    },
                    xAxis: {
                        type: 'category',
                        data: this.mainModel.charts.barChart.secondBarChart.typeObj,
                        axisLabel:{
                            interval:"0",
                            rotate:"30"
                        }
                    },
                    grid: {
                        left: 10,
                        right: 30,
                        bottom: 30,
                        containLabel: true
                    },
                    // legend: {
                    //     data: riskKeyValue[0]
                    // },
                };
                if (10 <= data.length) {//如果分组数量大等于限制数量,调整x轴标签倾斜
                    opt.dataZoom = [
                        {show: true, xAxisIndex: 0, startValue: 0, endValue: 10}, {type: 'inside'}
                    ];
                }

                opt.series = this.getBarChartSery2(data);
                this.mainModel.charts.barChart.secondBarChart.opt = opt;
                this.$refs.barChartSecond.hideLoading();
            },
            buildBarChartThird:function(data){
        	    var total = 0;
                this.mainModel.charts.barChart.thirdBarChart.typeObj = _.uniq(data,"xValue");
                _.each(this.mainModel.charts.barChart.thirdBarChart.typeObj,function (item) {
                    total += parseInt(item.yValue) || 0;
                    item.value = item.xValue;
                    item.id = item.xId;
                })
                var opt = {
                    title: {x: 'center', text: '时间维度风险作业统计：'+total, top: 20},
                    tooltip: {trigger: 'axis'},
                    color: ['#c26002'],
                    yAxis: {
                        type: 'value'
                    },
                    xAxis: {
                        type: 'category',
                        data: this.mainModel.charts.barChart.thirdBarChart.typeObj,
                        axisLabel:{
                            interval:"0",
                            rotate:"30"
                        }
                    },
                    grid: {
                        left: 10,
                        right: 30,
                        bottom: 30,
                        containLabel: true
                    },
                    // legend: {
                    //     data: riskKeyValue[0]
                    // },
                };
                if (10 <= data.length) {//如果分组数量大等于限制数量,调整x轴标签倾斜
                    opt.dataZoom = [
                        {show: true, xAxisIndex: 0, startValue: 0, endValue: 10}, {type: 'inside'}
                    ];
                }
                opt.series = this.getBarChartSery3(data);
                this.mainModel.charts.barChart.thirdBarChart.opt = opt;
                this.$refs.barChartThird.hideLoading();
            },
            getBarChartSery3: function(data) {
                var sery = [];
                var yAxis = {
                    type: 'category',
                    axisLabel: {
                        interval: 0
                    },
                    data: []
                };
                var value = {
                    name: '风险研判数量',
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
                    value.data.push({
                        xId:d.xId,
                        name:d.xValue,
                        value:d.yValue
                    });
                    return i+1 == 20;
                });
                sery.push(value);
                return sery;
            },
            getBarChartSery2: function(data) {
                var sery = [];
                var yAxis = {
                    type: 'category',
                    axisLabel: {
                        interval: 0
                    },
                    data: []
                };
                var value = {
                    name: '风险研判数量',
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
                        },
                    },
                    data: []
                };
                _.find(data,function(d,i){
                    yAxis.data.push(d.xValue)
                    value.data.push({
                        xId:d.xId,
                        name:d.xValue,
                        value:d.yValue
                    });
                    return i+1 == 20;
                });
                sery.push(value);
                return sery;
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
            queryTable2: function(qryParam){
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
            doQry:function(){
                var _this = this;
                var qryParam = this.getQryParam();

                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        _this.showChartLoading();
                        // api.countByOperationType(qryParam).then(function (res) {
                        //     var data = res.data;
                        //     _.each(data,function (item) {
                        //         var dayaDic = LIB.getDataDic("ira_risk_judgm_operation_type",item.xId) ? LIB.getDataDic("ira_risk_judgm_operation_type",item.xId) : "其他";
                        //         item.xValue = dayaDic;
                        //     })
                        //     _this.buildPieChart(data);
                        // })
                        api.countDominationRiskLevel(qryParam).then(function (res) {
                            _this.buildBarChartFirst(res.data);
                        })
                        api.countsupervisorsRiskJudgment(qryParam).then(function (res) {
                            _this.buildBarChartSecond(res.data);
                        })
                        api.countDateRiskLevel(qryParam).then(function (res) {
                            _this.buildBarChartThird(res.data);
                        })
                        _this.queryTable2(qryParam);
                    }
                })
            },
            clickThirdBarChart:function (v) {
                var _this = this;
                this.mainModel.charts.barChart.thirdBarChart.value = null;
                this.mainModel.charts.barChart.firstBarChart.value = null;
                this.mainModel.charts.barChart.secondBarChart.value = null;
                var qryParam = this.getQryParam();
                var find = _.find(this.mainModel.charts.barChart.thirdBarChart.typeObj,'value',v.name);
                if(find) {
                    this.mainModel.charts.barChart.thirdBarChart.value = find.value;
                    //当前选择的时间段
                    qryParam.startDateRange = new Date(find.startDate).Format("yyyy-MM-dd 00:00:00");
                    qryParam.endDateRange = new Date(find.endDate).Format("yyyy-MM-dd 23:59:59");
                }
                api.countDominationRiskLevel(qryParam).then(function (res) {
                    _this.buildBarChartFirst(res.data);
                })
                api.countsupervisorsRiskJudgment(qryParam).then(function (res) {
                    _this.buildBarChartSecond(res.data);
                })
                _this.queryTable2(qryParam);
            },
            clickFirstBarChart:function (v) {
                var _this = this;
                this.mainModel.charts.barChart.firstBarChart.value = null;
                this.mainModel.charts.barChart.secondBarChart.value = null;
                var qryParam = this.getQryParam();
                var find = _.find(this.mainModel.charts.barChart.firstBarChart.typeObj,'value',v.name);
                if(find) {
                    this.mainModel.charts.barChart.firstBarChart.value = find.xId;
                    qryParam.firstChartValue = find.xId;

                    var findThird = _.find(_this.mainModel.charts.barChart.thirdBarChart.typeObj,'value',_this.mainModel.charts.barChart.thirdBarChart.value);
                    if(findThird) {
                        qryParam.startDateRange = new Date(findThird.startDate).Format("yyyy-MM-dd 00:00:00");
                        qryParam.endDateRange = new Date(findThird.endDate).Format("yyyy-MM-dd 23:59:59");
                    }
                }

                api.countsupervisorsRiskJudgment(qryParam).then(function (res) {
                    _this.buildBarChartSecond(res.data);
                })
                _this.queryTable2(qryParam);
            },
            clickSecondBarChart:function (v) {
                var _this = this;
                this.mainModel.charts.barChart.secondBarChart.value = null;
                var qryParam = this.getQryParam();
                var find = _.find(this.mainModel.charts.barChart.secondBarChart.typeObj,'value',v.name);
                if(find) {
                    this.mainModel.charts.barChart.secondBarChart.value = find.value;
                    qryParam.firstChartValue = this.mainModel.charts.barChart.firstBarChart.value;
                    qryParam.secondChartValue = find.id;

                    var findThird = _.find(_this.mainModel.charts.barChart.thirdBarChart.typeObj,'value',_this.mainModel.charts.barChart.thirdBarChart.value);
                    if(findThird) {
                        qryParam.startDateRange = new Date(findThird.startDate).Format("yyyy-MM-dd 00:00:00");
                        qryParam.endDateRange = new Date(findThird.endDate).Format("yyyy-MM-dd 23:59:59");
                    }

                    _this.queryTable2(qryParam);
                }
            }
        },
        ready:function(){
            // this.doQry();
            this.mainModel.vo.timeType = 5;
        }
    };
    return LIB.VueEx.extend(opt);
});