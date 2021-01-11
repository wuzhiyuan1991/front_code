define(function(require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var dateUtils = require("../../tools/dateUtils");
    var dataUtils = require("../../tools/dataUtils");
    var api = require("./vuex/api");
    var components = {
			'obj-select':require("../../reportDynamic/dialog/objSelect")
		};
    var dataModel = function(){
        var currentYear = Number(new Date().Format("yyyy"));
        return {
            qryInfoModel:{
                title:'船舶靠港次数统计',
                qryDateType:'1',
                qryYears:(function(lastYear){
                    var years = [];
                    for(var year = 2014; year <= lastYear; year++){
                        years.push(year);
                    }
                    return years;
                })(currentYear),
                vo:{
                    timeType:1,
                    dateRange:[],
                    objRange:[],
                    year:null,
                }
            },
            barChartOpt:{
                series :[]
            },
            drillModel:{
                show : false,
                title :'详情',
                table:{
                    //数据请求地址
                    url:null,
                    //请求参数
                    qryParam:null,
                    //对应表格字段
                    columns:null,
                }
            }
        }
    };
    var opt = {
        template:template,
        components:components,
        data:function(){
            return new dataModel();
        },
        props:{
            qryInfoDetail:Object
        },
        methods:{
            changeQryYear:function(year){
                var yearFirstDay = "";
                var yearLastDay = "";
                if (year == "") {
                    this.qryInfoModel.vo.dateRange = null;
                } else {
                    yearFirstDay = dateUtils.getYearFirstDay(new Date(String(year)));
                    yearLastDay = dateUtils.getYearLastDay(new Date(String(year)));
                    this.qryInfoModel.vo.dateRange = [yearFirstDay.Format("yyyy-MM-dd 00:00:00"),yearLastDay.Format("yyyy-MM-dd 23:59:59")];
                    this.qryInfoModel.vo.year = String(year);
                }
            },
            changeQryMonth:function(month){
                var monthDate = dateUtils.getMonthLastDay(new Date(month+'-20 23:59:59'));
                this.qryInfoModel.vo.dateRange = [month+'-01 00:00:00',monthDate.Format("yyyy-MM-dd 23:59:59")];
            },
            chartClick:function(params) {
                var qryParam = this.getQryParam();
                if (params.data.name) {
                    qryParam.startDateRange = dateUtils.getMonthFirstDay(new Date(params.data.name)).Format("yyyy-MM-dd hh:mm:ss");
                    if (params.data.name.length === 4) {
                        qryParam.endDateRange = dateUtils.getYearLastDay(new Date(params.data.name)).Format("yyyy-MM-dd 23:59:59");
                    } else {
                        qryParam.endDateRange = dateUtils.getMonthLastDay(new Date(params.data.name)).Format("yyyy-MM-dd 23:59:59");
                    }
                }
                // qryParam.endDateRange =
                var tableOpt = {
                    url:"rpt/stats/tpa/boat/berth/detail/{curPage}/{pageSize}",
                    qryParam:qryParam,
                    filterColumns:["criteria.strValue.keyWordValue"],
                    columns:[
                        {title:"检查表",width:"280px",fieldName:"xValue"},
                        {title:"数量",width:"150px",fieldName:"yValue"},
                        {title:"船舶",width:"150px",fieldName:"xName"},
                    ]
                };
                this.drillModel.table = tableOpt;
                this.drillModel.exportDataUrl = "/rpt/stats/tpa/boat/berth/detail/export";
                this.drillModel.show = true;
            },
            doExportData:function(){
                var _this = this;
                window.open(_this.drillModel.exportDataUrl+LIB.urlEncode(_this.$refs.rptDetailsTable.getCriteria()).replace("&", "?"));
            },
            buildBarChart:function(data){
                var opt = {
                    title:{x:'center',text:'船舶靠港次数统计',top:20},
                    tooltip : {trigger: 'axis'},
                    yAxis : [{type : 'value'}]
                };
                var xAxis1 =
                    {type : 'category',
                    axisLabel:{
                        interval:0
                    },data:[]};
                var sery = {
                    name: '船舶靠港次数',
                    type: 'bar',
                    barMaxWidth:40,
                    label:{normal:{show:true,position:'top'}},
                    itemStyle: {normal: {barBorderRadius :[5, 5, 0, 0]}},
                    data:[]
                };
                _.find(_.sortBy(data,"xValue"),function(d,i){
                    xAxis1.data.push(d.xValue)
                    sery.data.push({
                        xId:d.xId,
                        name:d.xValue,
                        value:d.yValue
                    });
                    return i+1 == 20;
                    //return false;
                });
                var maxLengthOfName = _.max(xAxis1.data,function(d){return d.length}).length;
                if(8 <= maxLengthOfName){//如果名称最大值大于8个字符，横坐标标签倾斜30度,并截断
                    xAxis1.axisLabel = _.extend(xAxis1.axisLabel, {
                        rotate:30,
                        formatter:function(val){
                            return dataUtils.sliceStr(val,8);
                        }
                    });
                    //扩大横坐标底部边距
                    opt.grid = {
                        bottom:80
                    };
                }
                opt.xAxis = [xAxis1];
                opt.series = [sery];
                this.barChartOpt = opt;
                this.$refs.barChart.hideLoading();
            },
            showChartLoading:function(){
                this.$refs.barChart.showLoading();
            },
            getQryParam:function(){
                var vo = this.qryInfoModel.vo;
                var qryParam;
                var dateRange = vo.dateRange;
                if(dateRange && dateRange.length == 2){
                    var beginDate = vo.dateRange[0];
                    var endDate = vo.dateRange[1];
                    qryParam = {
                        startDateRange:beginDate,
                        endDateRange:endDate
                    };
                }else{
                    this.changeQryYear(Number(new Date().Format("yyyy")));
                    var beginDate = vo.dateRange[0];
                    var endDate = vo.dateRange[1];
                    qryParam = {
                        startDateRange:beginDate,
                        endDateRange:endDate
                    };
                }
                qryParam.idsRange = _.map(vo.objRange,function(r){return r.key;}).join(",");
                return _.extend(qryParam, _.pick(vo,"timeType"));
            },
            doQry:function(){
                var _this = this;
                var qryParam = this.getQryParam();
                this.showChartLoading();
                api.checkRecordCountByBerth(qryParam).then(function(res){
                    _this.buildBarChart(res.data);
                });
            }
        },
        ready:function(){
            this.doQry();
        }
    };
    return LIB.Vue.extend(opt);
});