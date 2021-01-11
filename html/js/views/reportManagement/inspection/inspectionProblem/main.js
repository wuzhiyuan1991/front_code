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
                    pieChart:{
                        opt:{
                            series :[]
                        },
                        value:null
                    },
                    barChart:{
                        leftBarChart: {
                            opt:{
                                series :[]
                            },
                            value:null,
                            typeObj:null,
                            list:[]
                        },
                        leftBarChartUnder: {
                            opt:{
                                series :[]
                            },
                            value:null,
                            typeObj:null,
                            list:[]
                        },
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
            //弹窗-撰取
            drillDataModel:{
                show:false,
                title:"明细",
                groups:null,
                placeholderOfGroups:'请选择对象个体',
                table:{
                    url:'/rpt/stats/inspection/problem/pool/{curPage}/{pageSize}',
                    columns: [ {
                        title: "编号",
                        // title: this.$t("gb.common.code"),
                        fieldName: "title",
                        width:'200px',
                        render: function (data) {
                            // return '<a href="hiddenGovernance/businessCenterLib/total?detail=">'+data.title+ ' </a>'
                            var routerPart="/html/main.html#!/hiddenGovernance/businessCenterLib/total?method=detail&id="+data.id+"&code=";
                            return "<a target='_blank' href='"+routerPart+data.code+"'>"+data.title+"</a>";

                        }
                        // filterType: "text"
                    },
                        //    {
                        //    //title: "受检对象",
                        //    title: this.$t("gb.common.subjectObj"),
                        //    orderName:"checkObject.name",
                        //    fieldName : "checkObject.name",
                        //    filterType: "text",
                        //    filterName : "criteria.strValue.name",
                        //},
                        _.extend(_.clone(LIB.tableMgr.column.company), { filterType: null}),
                        _.extend(_.clone(LIB.tableMgr.column.dept), { filterType: null}),
                        {
                            title: "类型",
                            width:'100px',
                            // title: this.$t("gb.common.type"),
                            render: function (data) {
                                return LIB.getDataDic("pool_type", data.type);
                            }
                        },
                        // {
                        //     //title: "信息来源",
                        //     title: this.$t("gb.common.infoSource"),
                        //     orderName: "infoSource",
                        //     fieldType: "custom",
                        //     filterType: "enum",
                        //     filterName: "criteria.intsValue.infoSource",
                        //     popFilterEnum: LIB.getDataDicList("info_source"),
                        //     render: function (data) {
                        //         return LIB.getDataDic("info_source", data.infoSource);
                        //     }
                        // }, {
                        //     //title: "体系要素",
                        //     title: this.$t("gb.common.systemElement"),
                        //     orderName: "systemElement",
                        //     fieldType: "custom",
                        //     filterType: "enum",
                        //     filterName: "criteria.intsValue.systemElement",
                        //     popFilterEnum: LIB.getDataDicList("system_element"),
                        //     render: function (data) {
                        //         return LIB.getDataDic("system_element", data.systemElement);
                        //     }
                        // },{
                        //     //title: "专业",
                        //     title: this.$t("gb.common.profession"),
                        //     orderName: "profession",
                        //     fieldType: "custom",
                        //     filterType: "enum",
                        //     filterName: "criteria.intsValue.profession",
                        //     popFilterEnum: LIB.getDataDicList("profession"),
                        //     render: function (data) {
                        //         return LIB.getDataDic("profession", data.profession);
                        //     }
                        // },
                        {
                            title: "问题描述",
                            // title: this.$t("gb.common.problemDesc"),
                            fieldName: "problem",
                            width:'170px',
                            // filterType: "text"
                        }, {
                            title: "建议措施",
                            // title: this.$t("gb.common.recMeasure"),
                            fieldName: "danger",
                            width:'200px',
                        }, {
                            title: "登记日期",
                            // title: this.$t("bc.hal.registratDate"),
                            fieldName: "registerDate",
                            width:'170px',
                            // filterType : "date"
                        }, {
                            title: "隐患等级",
                            width:'170px',
                            render: function (data) {
                                return LIB.getDataDic("risk_type", data.riskType);
                            }
                        },{
                            title: "风险等级",
                            width:'170px',
                            render: function (data) {
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
                            }
                        }, {
                            title: "状态",
                            width:'170px',
                            render: function (data) {
                                return LIB.getDataDic("pool_status", data.status);
                            }
                        },{
                            title: "来源",
                            orderName: "sourceType",
                            width:'170px',
                            render: function (data) {
                                return LIB.getDataDic("pool_sourceType", data.sourceType);
                            }
                        },
                        {title: "绝对值", fieldName: "value"}],
                    //筛选过滤字段
                    filterColumns:null
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
                //         {
                //             title: '编码',
                //             fieldName: "code",
                //             width: 180,
                //             fieldType: "link",
                //             fieldType: "custom",
                //             render: function (data) {
                //                 return "<a target='_blank' href='/html/main.html#!/periodicWork/mgr/riskJudge?method=select&date="+data.operationStartDate+"&code="+data.code+"'>"+data.code+"</a>"

                //             },
                //         },
                //         {
                //             //作业分类
                //             title: "作业分类",
                //             fieldName: "operationType",
                //             fieldType: "custom",
                //             filterName: "criteria.intsValue.operationType",
                //             popFilterEnum : LIB.getDataDicList("ira_risk_judgm_operation_type"),
                //             width:200,
                //             render: function (data) {
                //                 return LIB.getDataDic("ira_risk_judgm_operation_type",data.operationType);
                //             },
                //         },
                //         {
                //             //作业名称
                //             title: "作业名称",
                //             fieldName: "operationName",
                //         },
                //         {
                //             title: "作业区域",
                //             fieldName: "dominationArea.name",
                //         },
                //         {
                //             title: "风险等级",
                //             fieldName: "riskLevel",
                //             fieldType: "custom",
                //             render: function (data) {
                //                 if (data.riskLevel) {
                //                     var resultColor = LIB.getDataDic("risk_level_result_color", data.riskLevel);
                //                     return "<span style='background:" + resultColor + ";color:" + resultColor + ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + LIB.getDataDic("risk_level_result", data.riskLevel);
                //                 } else {
                //                     return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + "无";
                //                 }

                //             },
                //         },
                //         {
                //             //作业开始时间
                //             title: "作业开始时间",
                //             fieldName: "operationStartDate",
                //             fieldType: "custom",
                //             render: function (data) {
                //                 return LIB.formatYMD(data.operationStartDate);
                //             }
                //         },
                //         {
                //             //作业结束时间
                //             title: "作业结束时间",
                //             fieldName: "operationEndDate",
                //             fieldType: "custom",
                //             render: function (data) {
                //                 return LIB.formatYMD(data.operationEndDate);
                //             }
                //         },
                //         {
                //             //风险研判内容
                //             title: "风险研判内容",
                //             fieldName: "content",
                //         },
                //         {
                //             //状态0-待执行；1-已结束
                //             title: "状态",
                //             fieldName: "status",
                //             fieldType: "custom",
                //             render: function (data) {
                //                 if(data.operationStartDate != null && data.operationEndDate != null && data.status != null){
                //                     if (data.status == 0 && data.operationStartDate < now && data.operationEndDate > now) {
                //                         data.status = 1;//执行中
                //                     }
                //                     if (data.operationEndDate < now) {
                //                         data.status = 2;//已结束
                //                     }
                //                 }
                //                 return LIB.getDataDic("ira_risk_judgm_status",data.status);
                //             },
                //         },
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
            showChartLoading:function(refKeys){
                refKeys && refKeys.forEach(function (key) {
                    this.$refs[key].showChartLoading && this.$refs[key].showChartLoading()
                })
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
            getBarChartSery: function(data, uniqKey, seryConfig){
                var group = _.groupBy(data,  uniqKey)
                var sery = [];
                _.each(seryConfig.fileds,function (item, index) {
                    var valueConfig = {
                        name: seryConfig.names[index],
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
                    _.each(seryConfig.orgs, function (it, index) {
                        var barData = group[it]
                        if(barData){
                            valueConfig.data.push(barData[0][item]);
                        }else{
                            valueConfig.data.push("0");
                        }
                    })
                    sery.push(valueConfig);
                })
                return sery;
            },
            buildBarChart: function (typeKeys, dataSource, opt, callback) {
                var thatOpt = this,typeMap = this
                var refName = opt.refName
                _.each(opt.orgs, function (item) {
                    item.value = item.yValue;
                    item.id = item.xId;
                })
                if (opt.isTitle) {
                    var opt = {
                        title: {x: 'center', text: opt.isTitle, top: 20},
                        tooltip: {trigger: 'axis'},
                        color: opt.color ? opt.color : ['#c23531'],
                        xAxis: {
                            type: 'category',
                            data: opt.orgs,
                        },
                        yAxis: {
                            type: 'value'
                        },
                        axisLabel: {
                            interval: 0,
                            rotate: -20,
                            formatter:function(value){
                                var str = ""; 
                                var num = 4; //每行显示字数 
                                var valLength = value.length; //该项x轴字数  
                                var rowNum = Math.ceil(valLength / num); // 行数  
                                
                                if(rowNum > 1) {
                                    for(var i = 0; i < rowNum; i++) {
                                        var temp = "";
                                        var start = i * num;
                                        var end = start + num;
                                        
                                        temp = value.substring(start, end) + "\n";
                                        str += temp; 
                                    }
                                    return str;
                                } else {
                                    return value;
                                }   
                            }
                        },
                        grid: {
                            left: 10,
                            right: 30,
                            bottom: 30,
                            containLabel: true
                        },
                    };
                }
                if (10 <= dataSource.length) {//如果分组数量大等于限制数量,调整x轴标签倾斜
                    opt.dataZoom = [
                        {show: true, xAxisIndex: 0, startValue: 0, endValue: 10}, {type: 'inside'}
                    ];
                }
                opt.series = callback();
                this.$refs[refName].hideLoading();
                return opt
            },
            buildBarChartFirst:function(typeKeys, dataSource, optKeys, opt, refName){
                var thatOpt = this,typeMap = this
                typeKeys.split('.').forEach(function (key) {
                    typeMap = typeMap[key]
                })
                typeMap = _.uniq(data,"xValue");
                _.each(this.mainModel.charts.barChart.firstBarChart.typeObj,function (item) {
                    item.value = item.xValue;
                    item.id = item.xId;
                })
                if (opt.isTitle) {
                    var opt = {
                        title: {x: 'center', text: opt.title, top: 20},
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
                }
                opt.series = this.getBarChartSery(dataSource);
                
                optKeys.split('.').forEach(function (key) {
                    thatOpt = thatOpt[key]
                })
                thatOpt = opt
                this.$refs[refName].hideLoading();
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
                qryParam.bizType = this.$route.query.bizType ? this.$route.query.bizType : 'default';
                return _.extend(qryParam, _.pick(vo,"timeType"));
            },
            clickPieChart: function (v) {
                var _this = this;
                var id = this.mainModel.charts.barChart.leftBarChart.list[v.dataIndex].xId;
                this.drillDataModel.show = true;
                var qryParam = this.getQryParam();
                qryParam = _.extend(qryParam, {id:id, rptType:1})
                this.$refs.detailTable.doQuery(qryParam);
            },
            clickFirstBarChart: function(v){
                var _this = this;
                var id = this.mainModel.charts.barChart.firstBarChart.list[v.dataIndex].xId;
                this.drillDataModel.show = true;

                var qryParam = this.getQryParam();
                qryParam = _.extend(qryParam, {id:id, rptType:2})
                this.$refs.detailTable.doQuery(qryParam);
            },
            clickSecondBarChart: function(v){
                var _this = this;
                var id = this.mainModel.charts.barChart.secondBarChart.list[v.dataIndex].xId;
                this.drillDataModel.show = true;

                var qryParam = this.getQryParam();
                qryParam = _.extend(qryParam, {id:id, rptType:3})
                this.$refs.detailTable.doQuery(qryParam);
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
                var commonPreFix = 'mainModel.charts.barChart.'
                var qryParam = this.getQryParam();
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        var refKeys = ['leftChart', 'barChartFirst', 'barChartSecond','leftChartUnder'];
                        _this.showChartLoading();
                        api.countByUser(qryParam).then(function (res) {
                            var commonKey = commonPreFix +'leftBarChart.'
                            var buildConfig = {
                                typeKeys: commonKey + 'typeObj'
                            }

                            var seryConfig = {
                                fileds:  ['yValue'],
                                names: ['发现问题数'],
                                orgs: _.map(res.data, "xName")
                            }
                            _this.mainModel.charts.barChart.leftBarChart.list = res.data;
                            _this.mainModel.charts.barChart.leftBarChart.opt = _this.buildBarChart(
                                buildConfig.typeKeys,
                                res.data,
                                { isTitle: '个人发现问题统计', color: ['#3398DB'], refName: refKeys[0], orgs: _.map(res.data, "xName") },
                                _this.getBarChartSery.bind(this, res.data, 'xName', seryConfig)
                                )
                        })
                        api.countByEquipment(qryParam).then(function (res) {
                            var seryConfig = {
                                fileds:  ['yValue'],
                                names: ['发现问题数'],
                                orgs: _.map(res.data, "xName")
                            }
                            var commonKey = commonPreFix + 'firstBarChart.'
                            var buildConfig = {
                                typeKeys: commonKey + 'typeObj',
                            }
                            _this.mainModel.charts.barChart.firstBarChart.list = res.data;
                            _this.mainModel.charts.barChart.firstBarChart.opt = _this.buildBarChart(
                                buildConfig.typeKeys,
                                res.data,
                                { isTitle: '设备发现问题统计', color: null, refName: refKeys[1], orgs: _.map(res.data, "xName") },
                                _this.getBarChartSery.bind(this, res.data, 'xName', seryConfig)
                            )
                        })
                        api.countBySpeciality(qryParam).then(function (res) {
                            var commonKey = commonPreFix +'secondBarChart.'
                            var buildConfig = {
                                typeKeys: commonKey + 'typeObj'
                            }
                            var seryConfig = {
                                fileds:  ['yValue'],
                                names: ['发现问题数'],
                                orgs: _.map(res.data, "xName")
                            }
                            _this.mainModel.charts.barChart.secondBarChart.list = res.data;
                            _this.mainModel.charts.barChart.secondBarChart.opt = _this.buildBarChart( 
                                buildConfig.typeKeys,
                                res.data,
                                { isTitle: '专业发现问题统计', color: ['#61a0a8'], refName: refKeys[2], orgs: _.map(res.data, "xName") },
                                _this.getBarChartSery.bind(this, res.data, 'xName', seryConfig)
                                )
                        })
                        api.countByUserRatio(qryParam).then(function (res) {
                            var commonKey = commonPreFix +'leftBarChartUnder.'
                            var buildConfig = {
                                typeKeys: commonKey + 'typeObj'
                            }

                            var seryConfig = {
                                fileds:  ['yValue'],
                                names: ['巡检问题比率'],
                                orgs: _.map(res.data, "xName")
                            }
                            _this.mainModel.charts.barChart.leftBarChartUnder.list = res.data;
                            _this.mainModel.charts.barChart.leftBarChartUnder.opt = _this.buildBarChart(
                                buildConfig.typeKeys,
                                res.data,
                                { isTitle: '巡检问题比率统计', color: ['#3398DB'], refName: refKeys[3], orgs: _.map(res.data, "xName") },
                                _this.getBarChartSery.bind(this, res.data, 'xName', seryConfig)
                            )
                        })
                        
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