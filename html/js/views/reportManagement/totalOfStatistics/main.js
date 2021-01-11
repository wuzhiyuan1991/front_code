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
    var riskColor = {
        "高风险" : "#ff1e02",
        "中风险" : "#ffc12a",
        "低风险" : "#4472c4",
        "待评估风险" : "#DCDCDC",
    }
    var riskKeyValue = [
        ["待评估风险","低风险","中风险","高风险"],
        ["-1","10","20","30"],
    ]
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
                              {value:"frw",label:'公司'},
                              {value:"dep",label:'部门'}
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
                    pieChartReform:{
                        opt:{
                            series :[]
                        },
                        value:null
                    },
                    barChart:{
                        firstLevelBarChart:{
                            opt:{
                                series :[]
                            },
                            value:null,
                            typeObj:null
                        },
                        secondLevelBarChart:{
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
                    url: '/rpt/stats/pool/list{/curPage}{/pageSize}',
                    //请求参数
                    qryParam: null,
                    //对应表格字段
                    columns: [
                       {
                            title: "编号",
                            // title: this.$t("gb.common.code"),
                            fieldName: "title",
                            width: 180,
                            fieldType: "link",
                            filterName: "title",
                           
                        },
                        //    {
                        //    //title: "受检对象",
                        //    title: this.$t("gb.common.subjectObj"),
                        //    orderName:"checkObject.name",
                        //    fieldName : "checkObject.name",
                        //    filterType: "text",
                        //    filterName : "criteria.strValue.name",
                        //},
                       _.extend(_.clone(LIB.tableMgr.column.company),{ filterType: null}) ,
                       _.extend(_.clone(LIB.tableMgr.column.dept),{ filterType: null}) ,
                        {
                            title: "属地",
                            fieldName: "dominationArea.name",
                            orderName: "dominationAreaId",
                           
                        },
                        {
                            title: "检查对象",
                            fieldName: "checkObj.name",
                            orderName: "ifnull(e.check_object_id,e.equipment_id)",
                           
                        },
                        {
                            title: '检查人',
                            orderName: "attr1",
                            fieldName: "user.name",
                            
                            filterName: "criteria.strValue.checkUserName",
                            width: 100
                        },
                        { 
                            title: '问题发现人',
                            fieldName: "problemFinder",
                           
                            filterName: "criteria.strValue.problemFinder",
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
                           
                            fieldName: "problem",
                            filterName: "criteria.strValue.problem",
                            
                            renderClass: "textarea",
                            width: 320
                        },
                        {
                            title: "潜在危害",
                            fieldName: "latentDefect",
                            
                            width: 180
                        },
                        {
                            title: "建议措施",
                           
                            fieldName: "danger",
                            filterName: "criteria.strValue.danger",
                           
                            renderClass: "textarea",
                            width: 320
                        }, {
                            title: "登记日期",
                            // title: '建议措施',
                            fieldName: "registerDate",
                            
                            width: 180
                        }, {
                            title: "隐患等级",
                           
                            orderName: "type",
                            fieldType: "custom",
                            
                            filterName: "criteria.strsValue.riskType",
                            popFilterEnum: LIB.getDataDicList("risk_type"),
                            render: function (data) {
                                return LIB.getDataDic("risk_type", data.riskType);
                            },
                            width: 120
                        }, {
                            title: "风险等级",
                            
                            orderName: "riskLevel",
                            fieldType: "custom",
                           
                            showTip: false,
                            filterName: "criteria.strValue.riskLevel",
                            render: function (data) {
                                if (data.riskLevel) {
                                    var riskLevel = JSON.parse(data.riskLevel);
                                    var resultColor = _.propertyOf(JSON.parse(data.riskModel))("resultColor");
                                    if (riskLevel && riskLevel.result) {
                                        //return riskLevel.result;
                                        if (resultColor) {
                                            return "<span style='background:\#" + resultColor + ";color:\#" + resultColor + ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + riskLevel.result;
                                        } else {
                                            return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + riskLevel.result;
                                        }
                                    } else {
                                        return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + "无";
                                        //return "无";
                                    }
                                }  else if (data.riskLevelResult) {
                                    var resultColor = LIB.getDataDic("risk_level_result_color", data.riskLevelResult);
                                    return "<span style='background:" + resultColor + ";color:" + resultColor + ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + LIB.getDataDic("risk_level_result", data.riskLevelResult);
                                } else {
                                    return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + "无";
                                    //return "无";
                                }
                            },
                            width: 120
                        }, {
                            title: '状态',
                            orderName: "status",
                            fieldType: "custom",
                            
                            filterName: "criteria.intsValue.status",
                            popFilterEnum: LIB.getDataDicList("pool_status"),
                            render: function (data) {
                                return LIB.getDataDic("pool_status", data.status);
                            },
                            width: 120
                        },
                        {
                            title: "整改状态",
                            sortable: false,
                            width: 120,
                            
                            filterName: "criteria.intsValue.reformStatus",
                            popFilterEnum: LIB.getDataDicList("pool_reform_status"),
                            render: function (data) {
                                var maxDealDate;
                                var dealDate;
                                if (data && data.lastReform) {
                                    if (data.lastReform.maxDealDate) {
                                        maxDealDate = new Date(data.lastReform.maxDealDate);
                                    }
                                    if (data.lastReform.dealDate) {
                                        dealDate = new Date(data.lastReform.dealDate);
                                    }
                                } else {
                                    return "<span style='background:#F5F5F5;color:#F5F5F5;margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + "其他";
                                }
                                var status = data.status;
                                var now = new Date();
                                if (status === "2" && maxDealDate) {//待整改
                                    if (now > maxDealDate) {
                                        return "<span style='background:red;color:red;margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + "逾期未整改";
                                    } else {
                                        return "<span style='background:#F5F5F5;color:#F5F5F5;margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + "其他";
                                    }
                                } else if ((status === "3" || status === "100") && maxDealDate) {//待验证 //验证合格
                                    if (dealDate > maxDealDate) {
                                        return "<span style='background:yellow;color:yellow;margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + "逾期整改";
                                    } else {
                                        return "<span style='background:#0F0;color:#0F0;margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + "期限内整改";
                                    }
                                } else {
                                    return "<span style='background:#F5F5F5;color:#F5F5F5;margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + "其他";
                                }
                            },

                        },
                        {
                            title: "来源",
                            orderName: "sourceType",
                            fieldType: "custom",
                           
                            filterName: "criteria.intsValue.sourceType",
                            popFilterEnum: LIB.getDataDicList("pool_sourceType").filter(function (item) {

                                return item.id != 6;//过滤掉 id:6 "风险研判"
                            }),
                            render: function (data) {
                                return LIB.getDataDic("pool_sourceType", data.sourceType);
                            },
                            width: 150
                        },
                        {
                            title: "整改类型",
                            orderName: "reformType",
                            fieldType: "custom",
                            
                            filterName: "criteria.strsValue.reformType",
                            popFilterEnum: LIB.getDataDicList("pool_reformType"),
                            render: function (data) {
                                return LIB.getDataDic("pool_reformType", data.reformType);
                            },
                            width: 100
                        },
                        {
                            title:'业务来源',
                            orderName: "bizType",
                            fieldType: "custom",
                           
                            filterName: "criteria.intsValue.bizType",
                            popFilterEnum: LIB.getDataDicList("pool_biz_source_type"),
                            render: function (data) {
                                return LIB.getDataDic("pool_biz_source_type", data.bizType);
                            },
                            width: 180
                        },
                        {
                            title: "类型",
                            // title: this.$t("gb.common.type"),
                            orderName: "type",
                            fieldType: "custom",
                            
                            filterName: "criteria.intsValue.type",
                            popFilterEnum: LIB.getDataDicList("pool_type"),
                            render: function (data) {
                                return LIB.getDataDic("pool_type", data.type);
                            },
                            width: 100
                        },
                        {
                            title: "审批人",
                            fieldName: "auditorName",
                            filterName: "criteria.strValue.auditorName",
                            
                            renderClass: "textarea",
                            width: 180
                        },
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
                this.$refs.pieChartReform.showLoading();
                // this.$refs.barChartFirst.showLoading();
                // this.$refs.barChartSecond.showLoading();
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
            toggleLegendReform: function () {
                var opt = this.mainModel.charts.pieChartReform.opt;
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
                    title:{x:'center',text:'隐患风险统计', top: 20},
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
                    name: '隐患风险统计',
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

                // var qryParam = this.getQryParam();
                // api.poolCountAndReformCount(qryParam).then(function (res) {
                //     if(res.data.length){
                //         _this.mainModel.charts.pieChart.opt.title.text = "隐患总数：" + res.data[0].xValue + "    未完成数："+res.data[0].yValue;
                //     }
                //
                // })
            },
            buildPieChartReform:function(data){
                var _this = this;
                var opt = {
                    title:{x:'center',text:'隐患整改统计', top: 20},
                    tooltip : {trigger: 'item',formatter: "{a} <br/>{b} : {c} ({d}%)"},
                    toolbox: {
                        feature: {
                            myTool1: {
                                show: true,
                                title: '隐藏图例',
                                icon: 'image://images/toggle.svg',
                                onclick: function (){
                                    _this.toggleLegendReform();
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
                    name: '隐患整改统计',
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
                            //     return riskColor[val.data.name];
                            // }

                        },
                    }
                };
                _.find(data,function(d,i){
                    legend.data.push(d.xId);
                    sery.data.push({
                        xId:d.xId,
                        name:d.xId,
                        value:d.xValue
                    });
                    return i+1 == 20;
                    //return false;
                });
                opt.legend = legend;
                opt.series = [sery];
                this.mainModel.charts.pieChartReform.opt = opt;
                this.$refs.pieChartReform.hideLoading();
            },
            // getBarChartSery: function(data){
            //     var sery = [];
            //     var map = _.map(_.uniq(data,"xValue"),"xValue");//去重
            //     var group  = _.groupBy(data,function (item) {//分组，id一样在同一柱子
            //         return item.yId;
            //     });
            //     _.each(riskKeyValue[1],function (item,index) {
            //         var riskData = group[item];
            //         var riskLevel = riskKeyValue[0][index];
            //         var value = {
            //             name: riskLevel,
            //             type: 'bar',
            //             stack: '总量',
            //             barMaxWidth: 40,
            //             label: {
            //                 normal: {
            //                     show: true,
            //                     position: 'inside',
            //                     formatter: function(params) {
            //                         return params.value > 0 ? params.value : "";
            //                     }
            //                 }
            //
            //             },
            //             itemStyle:{
            //                 normal:{color:riskColor[riskLevel]}
            //             },
            //             data:[]
            //         }
            //         if(riskData){
            //             _.each(map,function (it) {
            //                 var f = _.find(riskData,function (i) {
            //                     return i.xValue === it;
            //                 })
            //                 if(f){
            //                     value.data.push(f.yValue);
            //                 }else{
            //                     value.data.push("0");
            //                 }
            //             })
            //         }else{//不存在该风险等级的，都赋0
            //             _.each(map,function () {
            //                 value.data.push("0");
            //             })
            //
            //         }
            //         sery.push(value);
            //     })
            //     return sery;
            // },
            // buildBarChartFirst:function(data){
            //     this.mainModel.charts.barChart.firstLevelBarChart.typeObj = _.uniq(data,"xValue");
            //     _.each(this.mainModel.charts.barChart.firstLevelBarChart.typeObj,function (item) {
            //         item.value = item.xValue;
            //         item.id = item.xId;
            //     })
            //     var opt = {
            //         title: {x: 'center', text: '一级分类统计', top: 20},
            //         tooltip: {trigger: 'axis'},
            //         xAxis: {
            //             type: 'value'
            //         },
            //         yAxis: {
            //             type: 'category',
            //             data: this.mainModel.charts.barChart.firstLevelBarChart.typeObj,
            //         },
            //         grid: {
            //             left: 10,
            //             right: 30,
            //             bottom: 30,
            //             containLabel: true
            //         },
            //         // legend: {
            //         //     data: riskKeyValue[0]
            //         // },
            //     };
            //     opt.series = this.getBarChartSery(data);
            //     this.mainModel.charts.barChart.firstLevelBarChart.opt = opt;
            //     this.$refs.barChartFirst.hideLoading();
            // },
            // buildBarChartSecond:function(data){
            //     this.mainModel.charts.barChart.secondLevelBarChart.typeObj = _.uniq(data,"xValue");
            //     _.each(this.mainModel.charts.barChart.secondLevelBarChart.typeObj,function (item) {
            //         item.value = item.xValue;
            //         item.id = item.xId;
            //     })
            //     var opt = {
            //         title: {x: 'center', text: '二级分类统计', top: 20},
            //         tooltip: {trigger: 'axis'},
            //         yAxis: {
            //             type: 'value'
            //         },
            //         xAxis: {
            //             type: 'category',
            //             data: this.mainModel.charts.barChart.secondLevelBarChart.typeObj,
            //             axisLabel:{
            //                 interval:"0",
            //                 rotate:"30"
            //             }
            //         },
            //         grid: {
            //             left: 10,
            //             right: 30,
            //             bottom: 30,
            //             containLabel: true
            //         },
            //         // legend: {
            //         //     data: riskKeyValue[0]
            //         // },
            //     };
            //     opt.series = this.getBarChartSery(data);
            //     this.mainModel.charts.barChart.secondLevelBarChart.opt = opt;
            //     this.$refs.barChartSecond.hideLoading();
            // },
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
            // clickPieChart: function (v) {
            //     var _this = this;
            //     this.mainModel.charts.pieChart.value = null;
            //     this.mainModel.charts.barChart.firstLevelBarChart.value = null;
            //     this.mainModel.charts.barChart.secondLevelBarChart.value = null;
            //     var qryParam = this.getQryParam();
            //     if(v.data.selected){
            //         this.mainModel.charts.pieChart.value = v.data.xId;
            //         qryParam.firstChartValue = v.data.xId;
            //     }
            //     api.poolCountByRiskLevelForFirstLevel(qryParam).then(function (res) {
            //         _this.buildBarChartFirst(res.data);
            //     })
            //     api.poolCountByRiskLevelForSecondLevel(qryParam).then(function (res) {
            //         _this.buildBarChartSecond(res.data);
            //     })
            //     _this.queryTable(qryParam);
            // },
            // clickFirstLevelBarChart: function(v){
            //     this.mainModel.charts.barChart.firstLevelBarChart.value = null;
            //     this.mainModel.charts.barChart.secondLevelBarChart.value = null;
            //     var find = _.find(this.mainModel.charts.barChart.firstLevelBarChart.typeObj,'value',v.name);
        	//     if(find){
            //         this.mainModel.charts.barChart.firstLevelBarChart.value = find.id;
            //         var _this = this;
            //         var qryParam = this.getQryParam();
            //         qryParam.firstChartValue = this.mainModel.charts.pieChart.value;
            //         qryParam.secondChartValue = find.id;
            //         api.poolCountByRiskLevelForSecondLevel(qryParam).then(function (res) {
            //             _this.buildBarChartSecond(res.data);
            //         })
            //         _this.queryTable(qryParam);
            //     }
            //
            // },
            // clickSecondLevelBarChart: function(v){
            //     this.mainModel.charts.barChart.secondLevelBarChart.value = null;
            //     var find = _.find(this.mainModel.charts.barChart.secondLevelBarChart.typeObj,'value',v.name);
            //     if(find){
            //         this.mainModel.charts.barChart.secondLevelBarChart.value = find.id;
            //         var _this = this;
            //         var qryParam = this.getQryParam();
            //         qryParam.firstChartValue = this.mainModel.charts.pieChart.value;
            //         qryParam.secondChartValue = this.mainModel.charts.barChart.firstLevelBarChart.value;
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
                        api.poolCountByRiskLevel(qryParam).then(function (res) {
                            var data = res.data;
                            _.each(data,function (item) {
                                var dayaDic = LIB.getDataDic("risk_level_result",item.xId) ? LIB.getDataDic("risk_level_result",item.xId) : "待评估风险";
                                item.xValue = dayaDic;
                            })
                            _.each(riskKeyValue[0],function (item,index) {
                                if(!_.find(data,"xValue",item)){
                                    data.push({
                                        xId:riskKeyValue[1][index],
                                        xValue:item,
                                        yValue:0,
                                    })
                                }
                            })
                            _this.buildPieChart(_.sortBy(data,"xId"));
                        })
                        api.poolCountAndReformCount(qryParam).then(function (res) {
                            var xValue = res.data[0].xValue;
                            var yValue = res.data[0].yValue;
                            var data = [];
                            data.push({
                                xId:'隐患总数',
                                xValue:xValue,
                            });
                            data.push({
                                xId:'已整改',
                                xValue:xValue-yValue,
                            })
                            data.push({
                                xId:'未整改',
                                xValue:yValue,
                            })
                            _this.buildPieChartReform(data);
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