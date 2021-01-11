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
                table: LIB.Opts.extendMainTableOpt(
                    renderTableModel({
                    //数据请求地址
                    url: '/rpt/stats/periodicwork/riskJudge/list/{curPage}/{pageSize}',
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
                            filterName: "criteria.intsValue.operationType",
                            popFilterEnum : LIB.getDataDicList("ira_risk_judgm_operation_type"),
                            width:200,
                            render: function (data) {
                                return LIB.getDataDic("ira_risk_judgm_operation_type",data.operationType);
                            },
                        },
                        {
                            //作业名称
                            title: "作业名称",
                            fieldName: "operationName",
                        },
                        {
                            title: "作业区域",
                            fieldName: "dominationArea.name",
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
                            title: "风险研判内容",
                            fieldName: "content",
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
                this.mainModel.charts.pieChart.opt = opt;
                this.$refs.pieChart.hideLoading();

                var qryParam = this.getQryParam();
                api.countAndTodo(qryParam).then(function (res) {
                    if(res.data.length){
                        _this.mainModel.charts.pieChart.opt.title.text = "风险研判总数：" + res.data[0].xValue + "    执行中："+res.data[0].yValue;
                    }

                })
            },
            getBarChartSery: function(data){
                var sery = [];
                var map = _.map(_.uniq(data,"xValue"),"xValue");//去重
                var group  = _.groupBy(data,function (item) {//分组，id一样在同一柱子
                    return item.yId;
                });
                var KeyValueObject = [];
                var keys = _.keys(group);
                var values = [];
                _.each(keys,function (item) {
                    values.push(LIB.getDataDic("ira_risk_judgm_operation_type",item));
                })
                KeyValueObject.push(keys);
                KeyValueObject.push(values);
                _.each(KeyValueObject[0],function (item,index) {
                    var barData = group[item];
                    var barName = KeyValueObject[1][index];
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
                        // itemStyle:{
                        //     normal:{color:riskColor[riskLevel]}
                        // },
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
                var opt = {
                    title: {x: 'center', text: '风险等级统计', top: 20},
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
                    // legend: {
                    //     data: riskKeyValue[0]
                    // },
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
                    title: {x: 'center', text: '作业区域统计', top: 20},
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
                    // legend: {
                    //     data: riskKeyValue[0]
                    // },
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
                qryParam.envType = 'xbgd';
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
                api.countByOperationTypeForRiskLevel(qryParam).then(function (res) {
                    _this.buildBarChartFirst(res.data);
                })
                api.countByOperationTypeForOperationArea(qryParam).then(function (res) {
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
                    api.countByOperationTypeForOperationArea(qryParam).then(function (res) {
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
                        api.countByOperationType(qryParam).then(function (res) {
                            var data = res.data;
                            _.each(data,function (item) {
                                var dayaDic = LIB.getDataDic("ira_risk_judgm_operation_type",item.xId) ? LIB.getDataDic("ira_risk_judgm_operation_type",item.xId) : "其他";
                                item.xValue = dayaDic;
                            })
                            _this.buildPieChart(data);
                        })
                        api.countByOperationTypeForRiskLevel(qryParam).then(function (res) {
                            _this.buildBarChartFirst(res.data);
                        })
                        api.countByOperationTypeForOperationArea(qryParam).then(function (res) {
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
    return LIB.VueEx.extend(opt);
});