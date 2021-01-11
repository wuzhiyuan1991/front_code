define(function(require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var api = require("./vuex/api");
	var dateUtils = require("../tools/dateUtils");
    var dataUtils = require("../tools/dataUtils");
    var chartTools = require("../tools/chartTools")
    var components = {
			'obj-select':require("../tools/dialog/objSelect")
    };
    var apiMap = {
		'frw-avg':api.queryAvgReformTimeByComp, //整改情况-机构-日期范围-平均值-整改时间
        'dep-avg':api.queryAvgReformTimeByDep, //整改情况-单位-日期范围-平均值-整改时间
        'frw-trend':api.queryAvgReformTimeByCompWithTrend, //整改情况-机构-日期范围-平均值-趋势-整改时间
        'dep-trend':api.queryAvgReformTimeByDepWithTrend, //整改情况-单位-日期范围-平均值-趋势-整改时间
    };
    var dataModel = function(){
        var current = new Date();
        return {
            mainModel:{
                title:'整改平均用时统计',
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
                typeOfStatuses:[
	                {
			            value: "-1",
			            label: '全部'
			        },
			        {
			            value: '2',
			            label: '未完成'
			        },
			        {
			            value: '100',
			            label: '已完成'
			        }
	            ],
	            typeOfRegisters:[
	                {value:"-1",label:'全部'},
					{value:"1",label:'安监站录入问题'}
	            ],
                //报表数据
                rptData:[],
                vo:{
                    method:null,
                    typeOfRange:'dep',
                    typeOfStatus:"-1",
                    typeOfRegister:"-1",
                    objRange:[],
                    dateRange:[dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)]
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
                chart:{
                    dataLimit: 10,
                    opts:{
                        series:[]
                    }
                }
            },
            //弹窗-更多
            moreDataModel:{
                show:false,
                title:'更多',
                scroll:false,
                columns:[],
                data:[]
            },
            //弹窗-撰取
            drillDataModel:{
                show:false,
                title:"明细",
                groups:null,
                placeholderOfGroups:'请选择对象个体',
                table:{
                    //数据请求地址
                    url:null,
                    //请求参数
                    qryParam:null,
                    //对应表格字段
                    columns:null,
                    //筛选过滤字段
                    filterColumns:null
                }
            }
        };
    };

    var opt = {
        template: template,
        components:components,
        data:function(){
            return new dataModel();
        },
        computed:{
            getApi:function(){
                var vo = this.mainModel.vo;
                return apiMap[vo.typeOfRange+'-'+vo.method];
            }
        },
        methods:{
            changeTypeOfRange:function(){
                this.mainModel.vo.objRange = [];
            },
            chartClick:function(params){
                var vo = this.mainModel.vo;
                var qryParam = chartTools.buildDrillParam(vo.method, vo, params);
                _.extend(qryParam,{
                    'criteria.intsValue.status':(vo.typeOfStatus == "-1" ? []:[vo.typeOfStatus]),
                    'criteria.intValue.type':vo.typeOfRegister
                });
                var tableOpt = {
                    url:"rpt/stats/details/pool/list/{curPage}/{pageSize}",
                    qryParam:qryParam,
                    columns:[
                            {
	                            title: "编码",
	                            width: "150px",
	                            fieldName: "title",
	                            pathCode: LIB.ModuleCode.HM_IT_Com
	                        },
                            {title:"类型",width:"70px",fieldType: "custom",render: function (data) {
                                return LIB.getDataDic("pool_type", data.type);
                            }},
                            {title:"问题描述",width:"150px",fieldName:"problem"},
                            {title:"建议措施",width:"150px",fieldName:"danger"},
                            {title:"登记日期",width:"150px",fieldName:"registerDate"},
                            {title: "整改人", width: "150px", fieldName: "dealName"},
                            {title:"风险等级",width:"85px",fieldType: "custom",render: function (data) {
                                if (data.riskLevel) {
                                    var riskLevel = JSON.parse(data.riskLevel);
                                    if (riskLevel && riskLevel.result) {
                                        return riskLevel.result;
                                    } else {
                                        return "无";
                                    }
                                } else {
                                    return "无";
                                }
                            }},
                            {title:"状态",fieldType: "custom",render: function (data) {
                                return LIB.getDataDic("pool_status", data.status);
                            }}
                        ],
                    filterColumns:["criteria.strValue.problem", "criteria.strValue.danger"]
                };
                this.drillDataModel.table = tableOpt;
                this.drillDataModel.show = true;
            },
            getParam:function(){
                var vo = this.mainModel.vo;
				var beginDate = vo.dateRange[0].Format("yyyy-MM-dd hh:mm:ss");
				var endDate = vo.dateRange[1].Format("yyyy-MM-dd hh:mm:ss");
                return {
                    "idsRange":chartTools.getIdsRange(_.propertyOf(vo)("objRange")),
                    "startDateRange":beginDate,
                    "endDateRange":endDate,
                    "criteria.intValue":{"status":(vo.typeOfStatus == "-1" ? null:vo.typeOfStatus)},
                    "type":vo.typeOfRegister == "-1" ? null:vo.typeOfRegister,
                    
                };
            },
            buildLineChars: function (data, dataLimit) {
                var opt = {
                    tooltip: {trigger: 'axis',formatter: function(params){
                    	var label = "";
                        _.each(params,function(param,i){
                            if(i ==0) label += param.name;
                            label += '<br/>'+chartTools.buildColorPie(param.color)+param.seriesName+' : '+ dateUtils.formatSeconds(param.data.value * 86400);
                        });
                        return label;
		            }},
                    toolbox: {
                        feature: {magicType: {type: ['line', 'bar']}}
                    },
                    yAxis: [{type: 'value',axisLabel:{formatter:function(value, index){
                    	if(value > 0) {
                    		return dateUtils.formatSeconds(value * 86400);
                    	} 
                    	return '0';
                    }}}]
                };
                var xAxis = [{
                    type: 'category',
                    axisTick:{alignWithLabel :true},
                    data: _.sortBy(_.keys(_.groupBy(data, "xValue")))
                }];
                var linesData = _.groupBy(data, function(v,i){
                    return v.yId + ":" + v.yName;
                });
                var lineNames = [];
                _.find(_.keys(linesData), function (v, i) {
                    var d = v.split(":");
                    lineNames.push({id: d[0], name: d[1]});
                    return i + 1 == dataLimit;
                });
                var legend = {
                    top: 25,
                    data: lineNames
                };
                var series = _.map(lineNames, function (lineName) {
                    return {
                        name: lineName.name,
                        type: 'line',
                        label: {normal: {show: true, position: 'top',formatter: function(params){
    		                return dateUtils.formatSeconds(params.data.value * 86400);
    		            }}},
                        data: _.sortBy(_.map(linesData[lineName.id+":"+lineName.name], function (lineData) {
                            return {
                                yId: lineData.yId,
                                yName: lineData.yName,
                                value: parseInt(lineData.yValue)/86400,
                                xValue: lineData.xValue
                            };
                        }), "xValue")
                    }
                });
                opt.xAxis = xAxis;
                opt.legend = legend;
                opt.series = series;
                return opt;
            },
            buildBarChars: function (data) {
                var dataLimit = this.mainModel.chart.dataLimit;
                var opt = {
                		tooltip: {trigger: 'axis',formatter: function(params){
                        	var label = "";
                            _.each(params,function(param,i){
                                label += param.name + ' : '+ dateUtils.formatSeconds(param.data.value * 86400);
                            });
                            return label;
    		            }},
                    yAxis: [{type: 'value',axisLabel:{formatter:function(value, index){
                    	if(value > 0) {
                    		return dateUtils.formatSeconds(value * 86400);
                    	} 
                    	return '0';
                    }}}]
                };
                var sery1 = {
                    name: "检查次数",
                    type: 'bar',
                    barMaxWidth: 40,
                    label: {normal: {show: true, position: 'top',formatter: function(params){
		                return dateUtils.formatSeconds(params.data.value * 86400);
		            }}},
                    itemStyle: {normal: {barBorderRadius: [5, 5, 0, 0]}},
                    data: []
                };
                var xAxis1 = {
                    type: 'category',
                    axisLabel: {
                        interval: 0
                    },
                    data: []
                };
                _.forEach(_.sortBy(data, function (d) {
                    return Number(d.yValue) * -1
                }), function (v, i) {
                    var value = {
                        xId: v.xId,
                        xName: v.xValue,
                        value: parseInt(v.yValue)/86400
                    };
                    xAxis1.data.push(value.xName);
                    sery1.data.push(value);

                    // return i + 1 == dataLimit;
                });
                if (dataLimit <= xAxis1.data.length) {//如果分组数量大等于限制数量,调整x轴标签倾斜
                    opt.dataZoom = [
                        {show: true, xAxisIndex: 0, startValue: 0, endValue: dataLimit}, {type: 'inside'}
                    ];
                }
                var maxLengthOfName = _.max(xAxis1.data, function (d) {
                    return d.length
                }).length;
                if (8 <= maxLengthOfName) {//如果名称最大值大于8个字符，横坐标标签倾斜30度,并截断
                    xAxis1.axisLabel = _.extend(xAxis1.axisLabel, {
                        rotate: 30,
                        formatter: function (val) {
                            return dataUtils.sliceStr(val, 8);
                        }
                    });
                    //扩大横坐标底部边距
                    opt.grid = {
                        bottom: 80
                    };
                }
                opt.xAxis = [xAxis1];
                opt.series = [sery1];
                return opt;
            },
            buildChart:function(){
                var data = this.mainModel.rptData;
                var opt = _.contains(["abs","avg"],this.mainModel.vo.method)
                        ? this.buildBarChars(data)
                            : this.buildLineChars(data, this.mainModel.chart.dataLimit);
                this.mainModel.chart.opts = opt;
            },
            doQry:function(type){
                this.mainModel.vo.method = type || 'avg';
                var _this = this;
                this.$refs.ruleform.validate(function (valid){
                    if(valid){
                        _this.$refs.echarts.showLoading();
                        // _this.getApi(_this.getParam()).then(function(res){
                        api.queryLookUpItem().then(function (res) {
                            var obj = JSON.parse(res.data.content);
                            _this.mainModel.rptData = obj.content;
                            _this.buildChart();
                            _this.$refs.echarts.hideLoading();
                        });
                    }
                });
            },
            buildMoreDataTable: function (method, rptData) {
                var columns = [];
                var data = [];
                if (_.contains(["abs", "avg"], method)) {
                    columns = [
                        {title: "统计对象个体名称", width: "180px", fieldName: "name", showTip: true},
                        {title: "绝对值", fieldName: "value"}
                    ];
                    data = _.sortBy(_.map(rptData, function (v) {
                        return {"name": v.xValue, "value": v.yValue};
                    }), function (d) {
                        return Number(d.value) * -1
                    });
                    _.each(data, function(item){
                    	item.value = dateUtils.formatSeconds(item.value);
                    });
                } else {
                    //组装表头
                    columns.push({title: "对象名称", width: "180px", fieldName: "name", showTip: true});
                    var ranges = _.keys(_.groupBy(rptData, "xValue"));

                    _.each(ranges, function (d) {
                        var x = {title: d, width: "120px", fieldName: d};
                        columns.push(x);
                    });

                    //组装表格数据
                    data = _.map(_.groupBy(rptData, "yId"), function (v, k) {
                        var row = {name: v[0].yName};
                        _.each(v, function (d) {
                            row[d.xValue] = dateUtils.formatSeconds(d.yValue);
                        });
                        return row;
                    });
                }
                return {
                    columns: columns,
                    data: data
                }
            },
            showMore:function(){
                var vo = this.mainModel.vo;
                var tableOpt = this.buildMoreDataTable(vo.method, this.mainModel.rptData);
                this.moreDataModel.columns = tableOpt.columns;
                this.moreDataModel.scroll = tableOpt.columns.length >= 10;
                this.moreDataModel.data = tableOpt.data;
                this.moreDataModel.show = true;
            },
            doExport:function(){
                var _this = this;
                var params = _this.getParam();
                var url = "/rpt/stats/checkreform/reformtime/" + this.mainModel.vo.typeOfRange + "/" + this.mainModel.vo.method + "/details/export";
                window.open(url + "?idsRange=" + params.idsRange + "&startDateRange=" + params.startDateRange + "&endDateRange=" + params.endDateRange);
            },
            doExportRptData: function () {
                window.open("/rpt/stats/details/reformTime/exportExcel" + LIB.urlEncode(this.$refs.rptDetailsTable.getCriteria()).replace("&", "?"));
            }
        },
        ready:function(){
            this.doQry('avg');
        }
    };
    return LIB.Vue.extend(opt);
});