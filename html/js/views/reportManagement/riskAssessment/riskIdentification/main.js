define(function(require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var api = require("./vuex/api");
    var dateUtils = require("../../tools/dateUtils");
    var components = {
			'obj-select':require("../../tools/dialog/objSelect")
    };
    var now = new Date().Format("yyyy-MM-dd hh:mm:ss");
    LIB.registerDataDic("ira_risk_identification_control_unit", [
        ["1","基层单位"],
        ["2","二级单位"],
        ["3","公司机关"]
    ]);

    LIB.registerDataDic("ira_risk_identification_existence_state", [
        ["1","正常"],
        ["2","异常"],
        ["3","紧急"]
    ]);

    LIB.registerDataDic("ira_risk_identification_existence_tense", [
        ["1","过去"],
        ["2","现在"],
        ["3","将来"]
    ]);

    LIB.registerDataDic("ira_risk_identification_is_important_danger", [
        ["0","否"],
        ["1","是"]
    ]);

    LIB.registerDataDic("ira_risk_identi_controlmeasures_type", [
        ["1","技术措施"],
        ["2","管理措施"],
        ["3","个人防护"],
    ]);

    LIB.registerDataDic("ira_risk_identification_hse_type", [
        ["1","健康"],
        ["2","安全"],
        ["3","环境"]
    ]);
    var dataDicList1 = LIB.getDataDicList('risk_hse_evalu_method');
    var dataDicList2 = LIB.getDataDicList('risk_integrity_evalu_method');
    var dataDicList3 = LIB.getDataDicList('risk_supervise_evalu_method');
    var arr = [];
    _.each(dataDicList1, function (item) {
        arr.push([item.id, item.value]);
    })
    _.each(dataDicList2, function (item) {
        var number = _.findIndex(arr, item.id);
        if (number == -1) {
            arr.push([item.id, item.value]);
        }
    })
    _.each(dataDicList3, function (item) {
        var number = _.findIndex(arr, item);
        if (number == -1) {
            arr.push([item.id, item.value]);
        }
    })
    LIB.registerDataDic("risk_evalu_method", arr);
    var riskColor = {
        "低风险" : "#4472c4",
        "一般风险" : "#ffe000",
        "较大风险" : "#ff6722",
        "重大风险" : "#ff0312",
    }
    var current = new Date();
    var dataModel = function(){
        var _this = this;
        var columsCfg = LIB.setting.fieldSetting["BC_HaG_HazT"] ? LIB.setting.fieldSetting["BC_HaG_HazT"] : [];
        var renderTableModel = _.bind(LIB.tableRenderMgr.renderModel, _this, columsCfg);
        return {
            mainModel:{
                title:'风险统计',
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
                    typeOfRange:'frw',
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
                        url: '/rpt/stats/riskAssessment/list{/curPage}{/pageSize}',
                        //请求参数
                        qryParam: null,
                        //对应表格字段
                        columns: [
                            {
                                title: "编号",
                                fieldName: "number",
                                fixed: true,
                            },
                            _.extend(_.clone(LIB.tableMgr.column.company),{ filterType: null}) ,
                            _.extend(_.clone(LIB.tableMgr.column.dept),{ filterType: null}) ,
                            {
                                title: "设备设施分类",
                                fieldName: "equipmentType.name",
                                width: 160,
                                'renderClass': "textarea",
                                fieldType: "custom",
                                render: function (data) {
                                    if(data && data.equipmentType){
                                        if(data.equipmentType.attr4){
                                            return data.equipmentType.attr4;
                                        }else {
                                            return data.equipmentType.name
                                        }
                                    }else{
                                        return "";
                                    }
                                },
                            },
                            {
                                //区域
                                title: "区域",
                                fieldName: "region",
                                'renderClass': "textarea",
                            },
                            {
                                //涉及岗位
                                title: "涉及岗位",
                                fieldName: "position",
                            },
                            {
                                //活动产品服务
                                title: "活动产品服务",
                                fieldName: "activeProductService",
                            },
                            {
                                //变更管理
                                title: "变更管理",
                                fieldName: "changeManage",
                            },
                            {
                                //后果分析
                                title: "后果分析",
                                fieldName: "aftermathAnalyze",
                            },
                            {
                                //事件学习
                                title: "事件学习",
                                fieldName: "eventLearn",
                            },
                            {
                                //其他活动
                                title: "其他活动",
                                fieldName: "otherActive",
                            },
                            {
                                //危害因素种类
                                title: "危害因素种类",
                                fieldName: "hazardType",
                            },
                            {
                                //危害因素成因
                                title: "危害因素成因",
                                fieldName: "hazardCause",
                                'renderClass': "textarea",
                            },
                            {
                                //存在状态 1:正常,2:异常,3:紧急
                                title: "存在状态",
                                fieldName: "existenceState",
                                fieldType: "custom",
                                render: function (data) {
                                    return LIB.getDataDic("ira_risk_identification_existence_state", data.existenceState);
                                }
                            },
                            {
                                //存在时态 1:过去,2:现在,3:将来
                                title: "存在时态",
                                fieldName: "existenceTense",
                                fieldType: "custom",
                                render: function (data) {
                                    return LIB.getDataDic("ira_risk_identification_existence_tense", data.existenceTense);
                                }
                            },
                            {
                                title: "风险评价",
                                fieldName: "riskLevel",
                                width: 120,
                                showTip: false,
                                render: function (data) {
                                    var resultColor = _.propertyOf(JSON.parse(data.riskModel))("resultColor");
                                    if (resultColor) {
                                        return "<span style='background:\#" + resultColor + ";color:\#" + resultColor + ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + data.riskLevel;
                                    } else {
                                        return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + data.riskLevel;
                                    }
                                },
                            },
                            {
                                //是否危险重要 0:否,1:是
                                title: "重要危险",
                                fieldName: "isImportantDanger",
                                fieldType: "custom",
                                popFilterEnum: LIB.getDataDicList("ira_risk_identification_is_important_danger"),
                                render: function (data) {
                                    return LIB.getDataDic("ira_risk_identification_is_important_danger", data.isImportantDanger);
                                }
                            },
                            {
                                //风险管控单位 1:基层单位,2:二级单位,3:公司机关
                                title: "风险管控单位",
                                fieldName: "controlUnit",
                                fieldType: "custom",
                                popFilterEnum: LIB.getDataDicList("ira_risk_identification_control_unit"),
                                render: function (data) {
                                    return LIB.getDataDic("ira_risk_identification_control_unit", data.controlUnit);
                                }
                            },
                            {
                                title: "剩余风险评价",
                                fieldName: "residualRiskLevel",
                                width: 140,
                                fieldType: "custom",
                                showTip: false,
                                render: function (data) {
                                    var resultColor = _.propertyOf(JSON.parse(data.residualRiskModel))("resultColor");
                                    if (resultColor) {
                                        return "<span style='background:\#" + resultColor + ";color:\#" + resultColor + ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + data.residualRiskLevel;
                                    } else if(data.residualRiskLevel){
                                        return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + data.residualRiskLevel;
                                    }else{
                                        return ""
                                    }
                                },
                            },

                            {
                                //评估方法
                                title: "评估方法",
                                fieldName: "evaluMethod",
                                orderName: "evaluMethod",
                                filterName: "criteria.intsValue.evaluMethod",
                                fieldType: "custom",
                                render: function (data) {
                                    return LIB.getDataDic("risk_evalu_method",data.evaluMethod);
                                }
                            },
                            LIB.tableMgr.column.remark,
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
                        color: opt.color ? opt.color : ['#c26002'],
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
            buildBarChartFirst: function (data) {
                var _this = this;
                var opt = {
                    title: {x: 'center', text: '风险管控', top: 20},
                    tooltip: {trigger: 'axis'},
                    color: ['#10c204'],
                    xAxis: {
                        type: 'value'
                    },
                    grid: {
                        left: 10,
                        right: 30,
                        bottom: 30,
                        containLabel: true
                    }
                };
                var yAxis = {
                    type: 'category',
                    axisLabel: {
                        interval: 0
                    },
                    data: []
                };
                var sery = {
                    name: '风险数',
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

                _.find(data, function (d, i) {
                    yAxis.data.push(d.xValue);
                    sery.data.push({
                        xId: d.xId,
                        name: d.xValue,
                        value: d.yValue
                    });
                    return i + 1 == 20;
                    //return false;
                });
                var maxLengthOfName = _.max(yAxis.data, function (d) {
                    return d.length
                }).length;
                if (8 <= maxLengthOfName) {//如果名称最大值大于8个字符，横坐标标签倾斜30度,并截断
                    yAxis.axisLabel = _.extend(yAxis.axisLabel, {
                        // rotate: 30,
                        formatter: function (val) {
                            return dataUtils.sliceStr(val, 8);
                        }
                    });
                }
                opt.yAxis = yAxis;
                opt.series = [sery];
                this.mainModel.charts.barChart.firstBarChart.opt = opt;
                this.$refs.barChartFirst.hideLoading();
            },

            buildBarChartSecond:function(data){
                var _this = this;
                var opt = {
                    title: {x: 'center', text: '专业风险统计', top: 20},
                    tooltip: {trigger: 'axis'},
                    color: ['#10c204'],
                    yAxis: {
                        type: 'value'
                    },
                    grid: {
                        left: 10,
                        right: 30,
                        bottom: 30,
                        containLabel: true
                    }
                };
                var xAxis = {
                    type: 'category',
                    axisLabel: {
                        interval: 0
                    },
                    data: []
                };
                var sery = {
                    name: '风险数',
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

                _.find(data, function (d, i) {
                    xAxis.data.push(d.xName);
                    sery.data.push({
                        xId: d.xId,
                        name: d.xName,
                        value: d.yValue
                    });
                    return i + 1 == 20;
                    //return false;
                });
                var maxLengthOfName = _.max(xAxis.data, function (d) {
                    return d.length
                }).length;
                if (8 <= maxLengthOfName) {//如果名称最大值大于8个字符，横坐标标签倾斜30度,并截断
                    yAxis.axisLabel = _.extend(yAxis.axisLabel, {
                        // rotate: 30,
                        formatter: function (val) {
                            return dataUtils.sliceStr(val, 8);
                        }
                    });
                }
                opt.xAxis = xAxis;
                opt.series = [sery];
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
                qryParam.bizType = this.$route.query.bizType;
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
                api.countByImplement(qryParam).then(function (res) {
                    _this.buildBarChartFirst(res.data);
                })
                api.countBySpecialty(qryParam).then(function (res) {
                    _this.buildBarChartSecond(res.data);
                })
                _this.queryTable(qryParam);
            },
            clickFirstBarChart: function(v){
                this.mainModel.charts.barChart.firstBarChart.value = null;
                this.mainModel.charts.barChart.secondBarChart.value = null;
                if(v.name){
                    this.mainModel.charts.barChart.firstBarChart.value = v.name;
                    var _this = this;
                    var qryParam = this.getQryParam();
                    qryParam.firstChartValue = this.mainModel.charts.pieChart.value;
                    qryParam.secondChartValue = v.name;
                    api.countBySpecialty(qryParam).then(function (res) {
                        _this.buildBarChartSecond(res.data);
                    })
                    _this.queryTable(qryParam);
                }

            },
            clickSecondBarChart: function(v){
                this.mainModel.charts.barChart.secondBarChart.value = null;
                if(v.name){
                    this.mainModel.charts.barChart.secondBarChart.value = v.name;
                    var _this = this;
                    var qryParam = this.getQryParam();
                    qryParam.firstChartValue = this.mainModel.charts.pieChart.value;
                    qryParam.secondChartValue = this.mainModel.charts.barChart.firstBarChart.value;
                    qryParam.thirdChartValue = v.name;
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
            buildPieChart:function(data){
                var total = 0;
                _.each(data, function(item){
                    total += Number(item.xValue);
                })
                var _this = this;
                var opt = {
                    title:{x:'center',text:'风险统计总数：' + total, top: 20},
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
                    name: '风险统计',
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
                                return riskColor[val.data.name];
                            }

                        },
                    }
                };
                _.find(data,function(d,i){
                    sery.data.push({
                        xId:d.xId,
                        name:d.xId,
                        value:d.xValue
                    });
                    return i+1 == 20;
                    //return false;
                });
                for(var key in riskColor){
                    legend.data.push(key);
                }

                opt.legend = legend;
                opt.series = [sery];
                this.mainModel.charts.pieChart.opt = opt;
                this.$refs.pieChart.hideLoading();
            },
            doQry:function(){
                var _this = this;
                var commonPreFix = 'mainModel.charts.barChart.'
                var qryParam = this.getQryParam();
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        var refKeys = ['leftChart', 'barChartFirst', 'barChartSecond']
                        _this.showChartLoading();
                        api.countByRiskLevel(qryParam).then(function (res) {
                            _this.buildPieChart(res.data);
                        })
                        api.countByImplement(qryParam).then(function (res) {
                            _this.buildBarChartFirst(res.data);
                        })
                        api.countBySpecialty(qryParam).then(function (res) {
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