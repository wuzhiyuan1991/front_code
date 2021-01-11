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
                    }else if(val == '1' || val == '2' ){
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
                   total += parseInt(item.a) || 0;
                   total += parseInt(item.b) || 0;
                   total += parseInt(item.c) || 0;
                });
                // this.mainModel.charts.barChart.thirdBarChart.typeObj = _.uniq(data,"xValue");
                var  xdata = _.pluck(data,"xName");
                var opt = {
                    title: {x: 'center', text: '巡检执行情况统计：'+total, top: 20},
                    tooltip: {trigger: 'axis'},
                    // color: ['#c26002'],
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
                    name: '已执行',
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
                var value1 = {
                    name: '待执行',
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
                var value2 = {
                    name: '未执行',
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
                value.data.push(item.a)
                value1.data.push(item.b)
                value2.data.push(item.c)
               })
                sery.push(value);
                sery.push(value1);
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
                var _this = this;
                var qryParam = this.getQryParam();

                console.log(_this.mainModel.vo)
                var obj = {
                    type: qryParam.type,
                    timeType: this.mainModel.vo.timeType,
                    startDateRange: this.mainModel.vo.dateRange[0].Format("yyyy-MM-dd hhh:mm:ss"),
                    endDateRange: this.mainModel.vo.dateRange[1].Format("yyyy-MM-dd hhh:mm:ss"),
                    idsRange: _.pluck(this.mainModel.vo.objRange||[], 'key').join(',')
                }
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        _this.showChartLoading();

                        api.queryCheckTasks(obj).then(function (res) {
                            var data1 = _.map(res.data, function (item) {
                                return {
                                    xName: item.xName,
                                    c: (item.yValues && item.yValues.yValue3) || '0',
                                    b:(item.yValues && item.yValues.yValue2) || '0',
                                    a:(item.yValues && item.yValues.yValue1) || '0',
                                }
                            })
                            _this.buildBarChartThird(data1);
                        })

                        data=[{
                            xName:'时间1',
                            c:'30',
                            a:'80',
                            b:'20',
                        },
                    ]
                        // _this.buildBarChartThird(data);
                    }
                })
            },
           
        },
        ready:function(){
            // this.doQry();
            this.mainModel.vo.timeType = 5;
        }
    };
    return LIB.VueEx.extend(opt);
});