define(function(require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var dateUtils = require("../../tools/dateUtils");
    var dataUtils = require("../../tools/dataUtils");
    var echartTools = require("../../tools/echartTools");
    var api = require("./vuex/checkItemReport-api");
    var components = {
			'obj-select':require("../../reportDynamic/dialog/objSelect")
		};
    var dataModel = function(){
        return {
            qryInfoModel:{
                title:'检查项不符合',
                qryDateType:'1',
                vo:{
                    dateRange:[],
                    objRange:[]
                }
            },
            barChartOpt1:{
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
                this.qryInfoModel.vo.dateRange = [year+'-01-01 00:00:00',year+'-12-31 23:59:59'];
            },
            changeQryMonth:function(month){
                var monthDate = dateUtils.getMonthLastDay(new Date(month+'-20 23:59:59'));
                this.qryInfoModel.vo.dateRange = [month+'-01 00:00:00',monthDate.Format("yyyy-MM-dd 23:59:59")];
            },
            buildBarChart:function(type,data){
                var opt = {
                    tooltip : {trigger: 'axis',formatter: function(params){
                        var label = "";
                        _.each(params,function(param,i){
                            if(i ==0) label += '<div style="width: 18em;word-wrap: break-word;white-space: pre-wrap;">'+param.name+'</div>';
                            label += '<br/>'+echartTools.buildColorPie(param.color)+param.seriesName+' : '+param.value;
                            if(i == 2) label += '%';
                        });
                        return label;
                    }},
                    yAxis : [{name : '数量',type : 'value'},{name:'百分比(%)',type:'value',min:0,axisLabel:{formatter:"{value}%"}}],
                    grid: {
                        left: '0',
                        right: '4%',
                        bottom: 10,
                        top: 20,
                        containLabel: true
                    },
                };
                var xAxis1 = {
                        type : 'category',
                        axisLabel:{
                            interval:0
                        },
                        data:[]
                    };
                var series = [
                    {
                        name: "不符合数",
                        type: 'bar',
                        barGap: '-100%',
                        z: 10,
                        //barWidth:40,
                        label:{normal:{show:true,position:'top'}},
                        itemStyle: {normal: {barBorderRadius :[5, 5, 0, 0]}},
                        data:[]
                    },
                    {
                        name: "检查总数",
                        type: 'bar',
                        barGap: '-100%',
                        label:{normal:{show:true,position:'top'}},
                        itemStyle: {normal: {color: '#ddd',barBorderRadius :[5, 5, 0, 0]}},
                        data:[]
                    },
                    {
                        name: "不符合率",
                        type: 'line',
                        yAxisIndex: 1,
                        data:[]
                    }
                ];
                _.forEach(data,function(d,i){
                    xAxis1.data.push(d.xName);
                    var yValues = d.yValues;
                    series[0].data.push({
                        xId:d.xId,
                        name:d.xName,
                        value:yValues.yValue1
                    });
                    series[1].data.push({
                        xId:d.xId,
                        name:d.xName,
                        value:yValues.yValue2
                    });
                    series[2].data.push({
                        xId:d.xId,
                        name:d.xName,
                        value:yValues.yValue3
                    });
                    // return i+1 == 20;
                });
                if(20 < xAxis1.data.length){//如果分组数量大等于限制数量,添加缩放滚动条
                    opt.grid.bottom = '15%';
                    opt.dataZoom = [
                        {
                            type: 'slider',
                            show: true,
                            xAxisIndex: 0,
                            start: 0,
                            end: Math.max(parseInt((20 * 100 / data.length)), 1),
                            zoomLock:true,
                            showDetail:false
                        }
                    ]
                }
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
                opt.series = series;
                return opt;
            },
            showChartLoading:function(){
                this.$refs.barChart1.showLoading();
            },
            chartClick:function(params) {
                var _this = this;
                var qryParam = this.getQryParam();
                qryParam.checkItemId = params.data.xId;
                var tableOpt = {
                    url:"rpt/stats/tpa/checkitem/detail/{curPage}/{pageSize}",
                    qryParam:qryParam,
                    columns:[
                        {title:"船舶名称",width:"180px",fieldName:"name"},
                        {title:"创建时间",fieldName:"createDate"},
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept
                    ]
                };
                this.drillModel.table = tableOpt;
                this.drillModel.exportDataUrl = "/rpt/stats/tpa/checkitem/detail/export";
                this.drillModel.show = true;
            },
            doExportData:function(){
                var _this = this;
                window.open(_this.drillModel.exportDataUrl+LIB.urlEncode(_this.$refs.rptDetailsTable.getCriteria()).replace("&", "?"));
            },
            getQryParam:function(){
                var vo = this.qryInfoModel.vo;
                var qryParam;

                var dateRange = vo.dateRange;
                if(dateRange.length == 2){
                    var beginDate = vo.dateRange[0];
                    var endDate = vo.dateRange[1];
                    qryParam = {
                        startDateRange:beginDate,
                        endDateRange:endDate
                    };
                }else{
                    qryParam = {};
                }
                qryParam.idsRange = _.map(vo.objRange,function(r){return r.key;}).join(",");
                return _.extend(qryParam, _.pick(vo,"timeType"));
            },
            doQry:function(){
                var _this = this;
                var qryParam = this.getQryParam();
                this.showChartLoading();
                api.recordCountByCheckItem(_.extend({type:0},qryParam)).then(function(res){
                    _this.barChartOpt1 = _this.buildBarChart(0, res.data);
                    _this.$refs.barChart1.hideLoading();
                });
            }
        },
        ready:function(){
            this.doQry();
        }
    };
    return LIB.Vue.extend(opt);
});