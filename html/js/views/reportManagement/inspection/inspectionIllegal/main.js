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
                    barChartOpt:{
                        series :[]
                    },
                }
            },
            drillModel: {
                // table: LIB.Opts.extendMainTableOpt(
                //     renderTableModel({
                //     //数据请求地址
                //     url: '/rpt/stats/periodicwork/riskJudge/list/{curPage}/{pageSize}',
                //     //请求参数
                //     qryParam: null,
                //     //对应表格字段
                //     columns: [
                //         _.extend(LIB.tableMgr.column.company,{ filterType: null}) ,
                //         _.extend(LIB.tableMgr.column.dept,{ filterType: null}) ,
                //     ],
                //     //筛选过滤字段
                //     filterColumns: ["criteria.strValue.keyWordValue"]
                // }))
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
                this.$refs.barChart.showLoading();
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

            buildBarChart:function(data){
                var opt = {
                    title:{x:'center',text:'异常巡检记录统计',top:20},
                    tooltip : {trigger: 'axis'},
                    yAxis : [{type : 'value'}]
                };
                var xAxis =
                    {type : 'category',
                        axisLabel:{
                            interval:0
                        },data:[]};
                var sery = {
                    name: '异常巡检记录数',
                    type: 'bar',
                    barMaxWidth:40,
                    label:{normal:{show:true,position:'top'}},
                    itemStyle: {normal: {barBorderRadius :[5, 5, 0, 0]}},
                    data:[]
                };
                _.find(data,function(d,i){
                    xAxis.data.push(d.xValue)
                    sery.data.push({
                        xId:d.xId,
                        name:d.xValue,
                        value:d.yValue
                    });
                    return i+1 == 20;
                });
                var maxLengthOfName = _.max(xAxis.data,function(d){return d.length}).length;
                if(8 <= maxLengthOfName){//如果名称最大值大于8个字符，横坐标标签倾斜30度,并截断
                    xAxis.axisLabel = _.extend(xAxis1.axisLabel, {
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
                opt.xAxis = [xAxis];
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
                // qryParam.envType = 'xbgd';
                qryParam.type = vo.typeOfRange === 'frw' ? 1 : 2;
                qryParam.idsRange = _.map(vo.objRange,function(r){return r.key;}).join(",");
                qryParam.bizType = this.$route.query.bizType ? this.$route.query.bizType : 'default';
                return _.extend(qryParam, _.pick(vo,"timeType"));
            },
            // clickPieChart: function (v) {
            //     var _this = this;
            //     this.mainModel.charts.pieChart.value = null;
            //     this.mainModel.charts.barChart.firstBarChart.value = null;
            //     this.mainModel.charts.barChart.secondBarChart.value = null;
            //     var qryParam = this.getQryParam();
            //     if(v.data.selected){
            //         this.mainModel.charts.pieChart.value = v.data.xId;
            //         qryParam.firstChartValue = v.data.xId;
            //     }
            //     api.countByOperationTypeForRiskLevel(qryParam).then(function (res) {
            //         _this.buildBarChartFirst(res.data);
            //     })
            //     api.countByOperationTypeForOperationArea(qryParam).then(function (res) {
            //         _this.buildBarChartSecond(res.data);
            //     })
            //     _this.queryTable(qryParam);
            // },
            // clickFirstBarChart: function(v){
            //     this.mainModel.charts.barChart.firstBarChart.value = null;
            //     this.mainModel.charts.barChart.secondBarChart.value = null;
            //     var find = _.find(this.mainModel.charts.barChart.firstBarChart.typeObj,'value',v.name);
        	//     if(find){
            //         this.mainModel.charts.barChart.firstBarChart.value = find.id;
            //         var _this = this;
            //         var qryParam = this.getQryParam();
            //         qryParam.firstChartValue = this.mainModel.charts.pieChart.value;
            //         qryParam.secondChartValue = find.id;
            //         api.countByOperationTypeForOperationArea(qryParam).then(function (res) {
            //             _this.buildBarChartSecond(res.data);
            //         })
            //         _this.queryTable(qryParam);
            //     }
            //
            // },
            // clickSecondBarChart: function(v){
            //     this.mainModel.charts.barChart.secondBarChart.value = null;
            //     var find = _.find(this.mainModel.charts.barChart.secondBarChart.typeObj,'value',v.name);
            //     if(find){
            //         this.mainModel.charts.barChart.secondBarChart.value = find.id;
            //         var _this = this;
            //         var qryParam = this.getQryParam();
            //         qryParam.firstChartValue = this.mainModel.charts.pieChart.value;
            //         qryParam.secondChartValue = this.mainModel.charts.barChart.firstBarChart.value;
            //         qryParam.thirdChartValue = find.id;
            //         _this.queryTable(qryParam);
            //     }
            //
            // },
            // queryTable: function(qryParam){
            //     var params = [];
            //     _.each(_.keys(qryParam),function (item) {
            //         params.push({
            //             type: "save",
            //             value: {
            //                 columnFilterName: item,
            //                 columnFilterValue: qryParam[item]
            //             }
            //         })
            //     })
            //     this.$refs.table.doCleanRefresh(params);
            // },
            doQry:function(){
                var _this = this;
                var qryParam = this.getQryParam();
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        _this.showChartLoading();
                        api.countByUser(qryParam).then(function (res) {
                            _this.buildBarChart(res.data);
                        })
                        // _this.queryTable(qryParam);

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