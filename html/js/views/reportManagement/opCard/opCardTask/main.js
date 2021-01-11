define(function(require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var api = require("./vuex/api");
    var dateUtils = require("../../tools/dateUtils");
    var dataUtils = require("../../tools/dataUtils");
    var chartTools = require("../../tools/chartTools")
    var components = {
			'obj-select':require("../../tools/dialog/objSelect")
    };
    var recordColor = {
        "不合格执行记录" : "#db4520",
        "正常执行记录" : "#aacd03",
    }
    LIB.registerDataDic("jse_op_card_status", [
        ["0", "待提交"],
        ["1", "待审核"],
        ["2", "已审核"]
    ]);

    LIB.registerDataDic("jse_op_task_disable", [
        ["1", "未发布"],
        ["0", "待执行"],
        ["2", "已执行"],
        ["3", "已中止"],
    ]);
    var cardTaskType={
        "crafts":"工艺操作任务",
        "electric":"电气操作任务"
    }
    var exceptionStatus={
        "0":"正常执行记录",
        "1":"不合格执行记录"
    }
    var exceptionStatusKeyValue = [
        ["正常执行记录","不合格执行记录"],
        ["0","1"],
    ]
    var cardTaskKeyValue = [
        ["工艺操作任务","电气操作任务"],
        ["crafts","electric"],
    ]
    var cardTaskColor = {
        "工艺操作任务" : "#4472c4",
        "电气操作任务" : "#ffc12a",
    }
    var current = new Date();
    var dataModel = function(){
        return {
            mainModel:{
                title:'操作票任务统计',
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
                    },
                }
            },
            drillModel: {
                table: {
                    //数据请求地址
                    url: 'rpt/jse/opcard/opcardTask/list{/curPage}{/pageSize}',
                    //请求参数
                    qryParam: null,
                    //对应表格字段
                    columns: [
                        _.extend(_.clone(LIB.tableMgr.column.code),{filterType: null}),
                        {
                            //卡票名称
                            title: "操作任务名称",
                            fieldName: "name",
                            width: 230
                        },
                        _.extend(_.clone(LIB.tableMgr.column.company),{filterType: null}),
                        _.extend(_.clone(LIB.tableMgr.column.dept),{filterType: null}),
                   
                        {
                            //审核状态 0:待提交,1:待审核,2:已审核
                            title: "审核状态",
                            fieldName: "status",
                            orderName: "status",
                            filterName: "criteria.intsValue.status",
                          
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("jse_op_card_status"),
                            render: function (data) {
                                return LIB.getDataDic("jse_op_card_status", data.status);
                            }
                        },
                        {
                            //任务状态
                            title: "任务状态",
                            fieldName: "disable",
                            render: function (data) {
                                return LIB.getDataDic("jse_op_task_disable", data.disable);
                            },
                            width: 100
                        },
                        {
                            //操作人
                            title: "操作人",
                            fieldName: "operators",
                            fieldType: "custom",
                            render: function (data) {
                                if(data && data.operators){
                                    return _.map(data.operators, _.iteratee('name'));
                                }
                                return "";
                            }
                        },
                        {
                            //监护人
                            title: "监护人",
                            fieldName: "operators",
                            fieldType: "custom",
                            render: function (data) {
                                if(data && data.supervisors){
                                    return _.map(data.supervisors, _.iteratee('name'));
                                }
                                return "";
                            }
                        },
                        {
                            //审核人
                            title: "审核人",
                            fieldName: "auditors",
                            fieldType: "custom",
                            render: function (data) {
                                if(data && data.auditors){
                                    return _.map(data.auditors, _.iteratee('name'));
                                }
                                return "";
                            }
                        },
                        {
                            //审核人
                            title: "操作时间",
                            fieldName: "publishTime",
                            filterType: "date",
                        },
                        {
                            title: "创建时间",
                            fieldName: "createDate",
                            width:140
                        },
                        {
                            title: "编制时间",
                            fieldName: "compileTime",
                            width:140
                        },
                        {
                            title: "审核时间",
                            fieldName: "auditDate",
                            width:140
                        },
                        {
                            title: "发布时间",
                            fieldName: "publishTime",
                            width:100
                        }
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
                this.$refs.barChartFirst.showLoading();
                this.$refs.barChartSecond.showLoading();
            },
            toggleLegend: function () {
                var opt = this.mainModel.charts.pieChart.opt;
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
        	    var total = 0;
        	    _.each(data,function (item) {
                    total = Number(total) + Number(item.yValue);
                })
                var _this = this;
                var opt = {
                    title:{x:'center',text:'操作票任务总数：'+ total, top: 20},
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
                    name: '操作票总数',
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
                                return cardTaskColor[val.data.name];
                            }

                        },
                    }
                };
                _.find(data,function(d,i){
                    legend.data.push(cardTaskType[d.xValue]);
                    sery.data.push({
                        xId:d.xId,
                        name:cardTaskType[d.xValue],
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
            getBarChartSery: function(data){
                var sery = [];
                var map = _.map(_.uniq(data,"xValue"),"xValue");//去重
                var group  = _.groupBy(data,function (item) {//分组，id一样在同一柱子
                    return item.yId;
                });
                _.each(exceptionStatusKeyValue[1],function (item,index) {
                    var taskData = group[item];
                    var value = {
                        name: exceptionStatusKeyValue[0][index],
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
                            normal:{
                                color:function(val){
                                    return recordColor[val.seriesName];

                                }
                            }
                        },
                        data:[]
                    }
                    if(taskData){
                        _.each(map,function (it) {
                            var f = _.find(taskData,function (i) {
                                return i.xValue === it;
                            })
                            if(f){
                                value.data.push(f.yValue);
                            }else{
                                value.data.push("0");
                            }
                        })
                    }else{//不存在该风险等级的，都赋0
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
                var opt = {
                    title: {x: 'center', text: '任务执行统计', top: 20},
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
                        data: exceptionStatusKeyValue[0]
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
                    title: {x: 'center', text: '员工执行统计', top: 20},
                    tooltip: {trigger: 'axis'},
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
                    legend: {
                        data: exceptionStatusKeyValue[0]
                    },
                };
                if (10 <= data.length) {//如果分组数量大等于限制数量,调整x轴标签倾斜
                    opt.dataZoom = [
                        {show: true, xAxisIndex: 0, startValue: 0, endValue: 10}, {type: 'inside'}
                    ];
                }
                opt.series = this.getBarChartSery(data);
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
                // qryParam.envType = 'xbgd';
                qryParam.type = vo.typeOfRange === 'frw' ? 1 : 2;
                qryParam.idsRange = _.map(vo.objRange,function(r){return r.key;}).join(",");
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
                api.cardTaskCountByBizTypeForException(qryParam).then(function (res) {
                    if(res.data && res.data.length){
                        _.each(res.data,function (item) {
                            item.xValue = cardTaskType[item.xValue];
                        })
                    }
                    _this.buildBarChartFirst(res.data);
                })
                api.cardTaskCountByBizTypeForUserException(qryParam).then(function (res) {
                    _this.buildBarChartSecond(res.data);
                })
                _this.queryTable(qryParam);
            },
            clickFirstBarChart: function(v){
                this.mainModel.charts.barChart.firstBarChart.value = null;
                this.mainModel.charts.barChart.secondBarChart.value = null;
                var find = _.find(this.mainModel.charts.barChart.firstBarChart.typeObj,'value',v.name);
        	    if(find){
                    this.mainModel.charts.barChart.firstBarChart.value = find.id;
                    var _this = this;
                    var qryParam = this.getQryParam();
                    qryParam.firstChartValue = this.mainModel.charts.pieChart.value;
                    qryParam.secondChartValue = find.id;
                    api.cardTaskCountByBizTypeForUserException(qryParam).then(function (res) {
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
            doQry:function(){
                var _this = this;
                var qryParam = this.getQryParam();
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        _this.showChartLoading();
                        api.cardTaskCountByBizType(qryParam).then(function (res) {
                            _this.buildPieChart(res.data);
                        })
                        api.cardTaskCountByBizTypeForException(qryParam).then(function (res) {
                            if(res.data && res.data.length){
                                _.each(res.data,function (item) {
                                    item.xValue = cardTaskType[item.xValue];
                                })
                            }
                            _this.buildBarChartFirst(res.data);
                        })
                        api.cardTaskCountByBizTypeForUserException(qryParam).then(function (res) {
                            _this.buildBarChartSecond(res.data);
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
    return LIB.Vue.extend(opt);
});