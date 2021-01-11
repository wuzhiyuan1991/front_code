define(function(require) {
    var LIB = require('lib');
    var template = require("text!./main2.html");
    var api = require("./vuex/api");
    var dateUtils = require("../tools/dateUtils");
    var components = {
			'obj-select':require("../tools/dialog/objSelect")
    };

    var cardTaskKeyValue = [
        ["低风险","中风险","高风险"]
    ]

    var now = new Date().Format("yyyy-MM-dd hh:mm:ss");
    var current = new Date();
    var currYear = current.getFullYear();
    var times = {
        prevWeek: new Date(currYear, current.getMonth(), current.getDate() - 7),
        prevMonth: new Date(currYear, current.getMonth() - 1),
        prevQuarter: new Date(currYear, current.getMonth() - 3),
        prevYear: new Date(currYear - 1, current.getMonth())
    };
    var defaultFilterModel = {
        dateRange: [dateUtils.getMonthFirstDay(current), current]
    };
    var dataModel = function(){
        var _this = this;
        var columsCfg = LIB.setting.fieldSetting["BC_HaG_HazT"] ? LIB.setting.fieldSetting["BC_HaG_HazT"] : [];
        var renderTableModel = _.bind(LIB.tableRenderMgr.renderModel, _this, columsCfg);
        return {
            qryParam: defaultFilterModel,
            mainModel:{
                title:'隐患等级统计',
                datePickModel:{
                    options:{
                        shortcuts:[
                            {text: '本周',value: function() {return [dateUtils.getWeekFirstDay(current), dateUtils.getWeekLastDay(current)];}},
                            {text: '本月',value: function() {return [dateUtils.getMonthFirstDay(current), dateUtils.getMonthLastDay(current)];}},
                            {text: '本季度',value: function() {return [dateUtils.getQuarterFirstDay(current), dateUtils.getQuarterLastDay(current)];}},
                            {text: '本年',value: function() {return [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)];}},
                            {text: '上周', value: function () {return [dateUtils.getWeekFirstDay(times.prevWeek), dateUtils.getWeekLastDay(times.prevWeek)];}},
                            {text: '上月', value: function () {return [dateUtils.getMonthFirstDay(times.prevMonth), dateUtils.getMonthLastDay(times.prevMonth)];}},
                            {text: '上季度', value: function () {return [dateUtils.getQuarterFirstDay(times.prevQuarter), dateUtils.getQuarterLastDay(times.prevQuarter)];}},
                            {text: '去年', value: function () {return [dateUtils.getYearFirstDay(times.prevYear), dateUtils.getYearLastDay(times.prevYear)];} }
                        ]
                    }
                },
                typeOfRanges:[
                              {value:"frw",label:'机构',type:2},
                              {value:"dep",label:'单位',type:1}
                          ],
                vo:{
                    timeType: 1,
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
            // drillModel: {
            //     table: LIB.Opts.extendMainTableOpt(
            //         renderTableModel({
            //         //数据请求地址
            //         url: '/rpt/stats/periodicwork/riskJudge/list2/{curPage}/{pageSize}',
            //         //请求参数
            //         qryParam: null,
            //         //对应表格字段
            //         columns: [
            //             {
            //                 title: '编码',
            //                 fieldName: "code",
            //                 width: 180,
            //                 fieldType: "link",
            //                 fieldType: "custom",
            //                 render: function (data) {
            //                     return "<a target='_blank' href='/html/main.html#!/periodicWork/mgr/riskJudge?method=select&date="+data.operationStartDate+"&code="+data.code+"'>"+data.code+"</a>"

            //                 },
            //             },
            //             {
            //                 //作业分类
            //                 title: "作业分类",
            //                 fieldName: "operationType",
            //                 fieldType: "custom",
            //                 render: function (data) {
            //                     if (data.iraRiskJudgmentOptypeVos) {
            //                         return _.pluck(data.iraRiskJudgmentOptypeVos, "name").join("、")
            //                     }
            //                 }
            //             },
            //             {
            //                 //作业名称
            //                 title: "作业名称",
            //                 fieldName: "operationName",
            //             },
            //             {
            //                 title: "作业区域",
            //                 fieldName: "dominationAreaName",
            //                 fieldType: "custom",
            //                 render: function (data) {
            //                     if (data.dominationAreas) {
            //                         return _.pluck(data.dominationAreas, "name").join("、")
            //                     }
            //                 }
            //             },
            //             {
            //                 title: "风险等级",
            //                 fieldName: "riskLevel",
            //                 fieldType: "custom",
            //                 render: function (data) {
            //                     if (data.riskLevel) {
            //                         var resultColor = LIB.getDataDic("risk_level_result_color", data.riskLevel);
            //                         return "<span style='background:" + resultColor + ";color:" + resultColor + ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + LIB.getDataDic("risk_level_result", data.riskLevel);
            //                     } else {
            //                         return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + "无";
            //                     }

            //                 },
            //             },
            //             {
            //                 //作业开始时间
            //                 title: "作业开始时间",
            //                 fieldName: "operationStartDate",
            //                 fieldType: "custom",
            //                 render: function (data) {
            //                     return LIB.formatYMD(data.operationStartDate);
            //                 }
            //             },
            //             {
            //                 //作业结束时间
            //                 title: "作业结束时间",
            //                 fieldName: "operationEndDate",
            //                 fieldType: "custom",
            //                 render: function (data) {
            //                     return LIB.formatYMD(data.operationEndDate);
            //                 }
            //             },
            //             {
            //                 //风险研判内容
            //                 title: "存在风险",
            //                 fieldName: "content",
            //             },
            //             {
            //                 title: "控制措施",
            //                 fieldName: "controls",
            //             },
            //             {
            //                 //状态0-待执行；1-已结束
            //                 title: "状态",
            //                 fieldName: "status",
            //                 fieldType: "custom",
            //                 render: function (data) {
            //                     if(data.operationStartDate != null && data.operationEndDate != null && data.status != null){
            //                         if (data.status == 0 && data.operationStartDate < now && data.operationEndDate > now) {
            //                             data.status = 1;//执行中
            //                         }
            //                         if (data.operationEndDate < now) {
            //                             data.status = 2;//已结束
            //                         }
            //                     }
            //                     return LIB.getDataDic("ira_risk_judgm_status",data.status);
            //                 },
            //             },
            //             _.extend(_.clone(LIB.tableMgr.column.company),{ filterType: null}) ,
            //             _.extend(_.clone(LIB.tableMgr.column.dept),{ filterType: null}) ,
            //         ],
            //         //筛选过滤字段
            //         filterColumns: ["criteria.strValue.keyWordValue"]
            //     }))
            // },
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
                        this.mainModel.vo.dateRange = [];
                        _this.mainModel.vo.dateRange.push(new Date(times-oneDay));
                        _this.mainModel.vo.dateRange.push(new Date());
                    }else if(val == '4'){
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
                    } else if(val == '3'){
                        this.mainModel.vo.dateRange = [];
                        _this.mainModel.vo.dateRange.push(new Date(monthFirstDay));
                        _this.mainModel.vo.dateRange.push(new Date(CurrentMonthLast()));
                    }else if(val == '1' || val == '2'){
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
                // this.$refs.barChartFirst.showLoading();
                // this.$refs.barChartSecond.showLoading();
            },
        
        
            buildBarChartThird:function(data){
        	    var total = 0;
                _.each(data, function (item) {
                    total += parseInt(item.total);
                });
                // this.mainModel.charts.barChart.thirdBarChart.typeObj = _.uniq(data,"xName");
                var  xdata = _.pluck(data,"xName");
                var opt = {
                    title: {x: 'center', text: '巡检项数量统计：'+total, top: 20},
                    tooltip: {trigger: 'axis'},
                    // color: ['#c26002'],
                    color: ['#c23531','#2f4554', '#61a0a8'],
                    yAxis: {
                        type: 'value'
                    },
                    xAxis: {
                        type: 'category',
                        data: xdata,
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
                    name: '巡检项不合格数量',
                    type: 'bar',
                    stack: '总量',
                    barMaxWidth: 40,
                    label: {
                        normal: {
                            show: true,
                            position: 'inside'
                        }
                    },
                    data: []
                };
                // var value1 = {
                //     name: '巡检项数量',
                //     type: 'line',
                    
                  
                //     data: []
                // };
                var value2 = {
                    name: '巡检项合格数量',
                    type: 'bar',
                    stack: '总量',
                    barMaxWidth: 40,
                    label: {
                        normal: {
                            show: true,
                            position: 'inside'
                        }
                    },
                    data: []
                };
               _.each(data,function(item){
                value.data.push(item.unqualified)
                // value1.data.push(item.total)
                value2.data.push(item.qualified)
               })
                sery.push(value);
                // sery.push(value1);
                sery.push(value2);
                
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
           
            doQry:function(){
                debugger
                var _this = this;
                var qryParam = this.getQryParam();

console.log(_this.mainModel.vo)
var obj = {
    type : this.mainModel.vo.typeOfRange === 'frw' ? 1 : 2,
    timeType: this.mainModel.vo.timeType,
    startDateRange: this.mainModel.vo.dateRange[0].Format("yyyy-MM-dd hhh:mm:ss"),
    endDateRange: this.mainModel.vo.dateRange[1].Format("yyyy-MM-dd hhh:mm:ss"),
    idsRange: _.pluck(this.mainModel.vo.objRange||[], 'key').join(',')
}

                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        _this.showChartLoading();
                       api.queryInvalid(obj).then(function (res) {
                           
                            data=[{
                                xName:'时间1',
                                total:'100',
                                qualified:'80',
                                unqualified:'20'
                            },
                                {
                                    xName:'时间2',
                                    total:'170',
                                    qualified:'110',
                                    unqualified:'60'
                                },
                                {
                                    xName:'时间3',
                                    total:'40',
                                    qualified:'20',
                                    unqualified:'20'
                                },
                                {
                                    xName:'时间4',
                                    total:'90',
                                    qualified:'70',
                                    unqualified:'20'
                                },
                                {
                                    xName:'时间1',
                                    total:'100',
                                    qualified:'80',
                                    unqualified:'20'
                                },
                                {
                                    xName:'时间2',
                                    total:'170',
                                    qualified:'110',
                                    unqualified:'60'
                                },
                                {
                                    xName:'时间3',
                                    total:'40',
                                    qualified:'20',
                                    unqualified:'20'
                                },
                                {
                                    xName:'时间4',
                                    total:'90',
                                    qualified:'70',
                                    unqualified:'20'
                                }
                            ]
                           var data1 = _.map(res.data, function (item) {
                               return {
                                   xName: item.xName,
                                   total: (item.yValues && item.yValues.yValue3) || '0',
                                   qualified:(item.yValues && item.yValues.yValue2) || '0',
                                   unqualified:(item.yValues && item.yValues.yValue1) || '0',
                               }
                           })
                            _this.buildBarChartThird(data1);
                        })
                    }
                })
            },
          
        },
        ready:function(){
            this.doQry();
            this.mainModel.vo.timeType = 1;
        }
    };
    return LIB.VueEx.extend(opt);
});