define(function (require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var api = require("./vuex/api");
    var dateUtils = require("../tools/dateUtils");
    var dataUtils = require("../tools/dataUtils");
    var chartTools = require("../tools/chartTools");
    var components = {
        'obj-select': require("../tools/dialog/objSelect")
    };
    var apiMap = {
        'frw-abs': api.overdueRectCompAbs,//整改情况-机构-日期范围-超期未整改-绝对值
        'frw-trend': api.overdueRectCompTrend,//整改情况-机构-日期范围-超期未整改-趋势
        'dep-abs': api.overdueRectDepAbs,//整改情况-部门-日期范围-超期未整改-绝对值
        'dep-trend': api.overdueRectDepTrend,//整改情况-部门-日期范围-超期未整改-趋势
        'equip-abs': api.overdueRectEquipAbs,//整改情况-设备设施-日期范围-超期未整改-绝对值
        'equip-trend': api.overdueRectEquipTrend,//整改情况-设备设施-日期范围-超期未整改-趋势
        'frw-abs-export': api.overdueRectCompAbsExport,//整改情况-机构-日期范围-超期未整改-绝对值-导出
        'dep-abs-export': api.overdueRectDepAbsExport,//整改情况-部门-日期范围-超期未整改-绝对值-导出
    };
    var dataModel = function () {
        var current = new Date();
        return {
            echartStyle:'',
            tabIndex:5, // 当前选择 5全部 0未提交 1未审核 2未整改 3未验证
            mainModel: {
                title: '隐患超期情况统计',
                barClick:null, // 标记点击了哪一个
                datePickModel: {
                    options: {
                        shortcuts: [
                            {
                                text: '本周', value: function () {
                                return [dateUtils.getWeekFirstDay(current), dateUtils.getWeekLastDay(current)];
                            }
                            },
                            {
                                text: '本月', value: function () {
                                return [dateUtils.getMonthFirstDay(current), dateUtils.getMonthLastDay(current)];
                            }
                            },
                            {
                                text: '本季度', value: function () {
                                return [dateUtils.getQuarterFirstDay(current), dateUtils.getQuarterLastDay(current)];
                            }
                            },
                            {
                                text: '本年', value: function () {
                                return [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)];
                            }
                            }
                        ]
                    }
                },
                typeOfRanges: [
                    {value: "frw", label: '公司'},
                    {value: "dep", label: '部门'},
                    // {value: "equip", label: '设备设施'}
                ],
                stateList:[
                    {value: "0", label: '全部超期'},
                    {value: "1", label: '超期已做'},
                    {value: "2", label: '超期未做'},
                ],
                stepList:[
                    {value: "-1", label: '全部步骤'},
                    {value: "0", label: '提交'},
                    {value: "1", label: '审批'},
                    {value: "2", label: '整改'},
                    {value: "3", label: '验证'},
                ],
                //报表数据
                rptData: [],
                vo: {
                    method: null,
                    item: ['rectification', '2'],
                    typeOfRange: 'dep',
                    state:"0",
                    step:"-1",
                    objRange: [],
                    dateRange: [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)]
                },
                rules: {
                    typeOfRange: {required: true, message: '请选择对象范围'},
                    dateRange: [
                        {type: 'array', required: true, message: '请选择统计日期'},
                        {
                            validator: function (rule, value, callback) {
                                return value[1] < value[0] ? callback(new Error('结束时间须不小于开始时间')) : callback();
                            }
                        }
                    ]
                },
                chart: {
                    dataLimit: 10,
                    opts: {
                    }
                }
            },
            //弹窗-更多
            moreDataModel: {
                show: false,
                title: '更多',
                scroll: false,
                columns: [],
                data: []
            },
            //弹窗-撰取
            drillDataModel: {
                show: false,
                title: "明细",
                groups: null,
                placeholderOfGroups: '请选择对象个体',
                table: {
                    //数据请求地址
                    url: null,
                    //请求参数
                    qryParam: null,
                    //对应表格字段
                    columns: null,
                    //筛选过滤字段
                    filterColumns: null
                }
            },

        };
    };

    var opt = {
        template: template,
        components: components,
        data: function () {
            return new dataModel();
        },
        computed: {
            getApi: function () {
                var vo = this.mainModel.vo;
                return apiMap[vo.typeOfRange + '-' + vo.method];
            },
            getExportApi: function () {
                var vo = this.mainModel.vo;
                return apiMap[vo.typeOfRange + '-' + vo.method + '-export'];
            },
            // echartStyle:function () {
            //     return "width:15000px;"
            //     var len = 150 * this.mainModel.rptData.length;
            //     if(len < 1200){
            //         return ''
            //     }else{
            //         return 'width:' + len + 'px';
            //     }
            // }
        },
        methods: {
            changePage:function () {
                LIB.globalLoader.show();
            },
            changeTypeOfRange: function () {
                this.mainModel.vo.objRange = [];
            },

            dataLoaded:function () {
                LIB.globalLoader.hide();
            },

            changeTab:function (val,type) {
               this.tabIndex = val;
               var statusList;
               if(val === 5) {
                   statusList = [0,1,2,3];
               }else{
                   statusList = [val];
               }
               LIB.globalLoader.show();
               var params = [
                   {
                       value : {
                           columnFilterName : "criteria.intsValue",
                           columnFilterValue :  {statusList:statusList},
                       },
                       type : "save"
                   },
                   {
                       value : {
                           columnFilterName : "type",
                           columnFilterValue :  type,
                       },
                       type : "save"
                   },
               ];
               this.$refs.rptDetailsTable.doQueryByFilter(params);
            },

            getStatus:function (barIndex,index) {
                if(barIndex && !index){
                    return this.mainModel.barClick === barIndex;
                }
                var step = this.mainModel.vo.step;
                var leftMenu = [];
                if(step === '-1'){//全部
                    leftMenu = ['0','1','2','3'];
                }else{
                    leftMenu.push(step);
                }
                return this.mainModel.barClick === barIndex && _.contains(leftMenu,index);
            },

            chartClick: function (params) {
                var vo = this.mainModel.vo;
                // if ("avg" === vo.method) return;//平均值不进行撰取

                // 获取点击的序号
                var index = params.dataIndex;
                var id = this.mainModel.rptData[index].xId;

                var arr = '';
                var arr = ['超期未提交','超期未审批','超期未整改','超期未验证','超期已提交','超期已审批','超期已整改','超期已验证'];
                var index = arr.indexOf(params.seriesName); //barClick
                if(index>3){
                    this.mainModel.barClick = '1'
                }else if(index >-1){
                    this.mainModel.barClick = '2'
                }

                // 获取点击了哪一个状态
                // if(params.seriesName == '超期未提交'){
                //     var status = '0'
                // }else if(params.seriesName == '超期未审批'){
                //     var status = '1'
                // }else if(params.seriesName == '超期未整改'){
                //     var status = '2'
                // }else if(params.seriesName == '超期未验证'){
                //     var status = '3'
                // }
                this.tabIndex = 5;
                var status = this.tabIndex;
                if(this.tabIndex == 5){
                    status = ''
                }

                if(!id) return;

                var param = chartTools.buildDrillParam(vo.method, vo, params);
                if ("frw" === vo.typeOfRange) {//机构
                    param.orgId = id;
                } else if ("dep" === vo.typeOfRange) {//部门
                    param.depId = id;
                } else if ("per" === vo.typeOfRange) {//人员
                    param.checkerId = id;
                } else if ("equip" === vo.typeOfRange) {//设备设施
                    param.equipId = id;
                }
                var statusList = [];
                if(this.mainModel.vo.step === '-1') {
                    statusList = [0,1,2,3];
                }else{
                    statusList.push(this.mainModel.vo.step);
                }
                if(this.mainModel.barClick === '1'){
                    param.type = 1;
                }else {
                    param.type = 0;
                }
                param["criteria.intsValue"] = {statusList:statusList};
                //param.status = status;
                //param.status = 2;//0:待提交,1:待审批, 2:待整改, 3:待验证
                var tableOpt = {
                    url: "rpt/stats/details/pool/overdue/list/{curPage}/{pageSize}",
                    qryParam: param,
                    columns: [
                        // _.extend({},
                        //     LIB.tableMgr.ksColumn.code,
                        //     { fieldName:"title",pathCode: LIB.ModuleCode.HM_IT_Ate}),
                        // {
                        //     title: "", width: "60",
                        //     render: function (data) {
                        //         // return "<a target='_blank' href='/html/main.html#!/hiddenGovernance/businessCenter/total?method=detail&id="+data.id+"'>查看</a>";
                        //
                        //         return "<a target='_blank' href='/html/main.html#!/hiddenGovernance/businessCenter/total?method=detail&id="+data.id+"&code="+data.title+"'>查看</a>"
                        //     },
                        //     tipRender:function () {
                        //         return "查看"
                        //     }
                        // },
                        (function () {
                            var code = _.cloneDeep(LIB.tableMgr.ksColumn.code);
                            code.render = function (data) {

                                return "<a target='_blank' href='/html/main.html#!/hiddenGovernance/businessCenter/total?method=detail&id="+data.id+"&code="+data.title+"'>"+data.title+"</a>"
                            };
                            code.tipRender=function(data){
                                return data.title;
                            };
                            return code;
                        })(),
                        {
                            title: "类型", width: "70px", fieldType: "custom", render: function (data) {
                            return LIB.getDataDic("pool_type", data.type);
                        }
                        },
                        {
                            title: "状态", width: "70px", fieldType: "custom", render: function (data) {
                                return LIB.getDataDic("pool_status", data.status);
                            }
                        },
                        {title: "问题描述", width: "150px", fieldName: "problem"},
                        {title: "建议措施", width: "150px", fieldName: "danger"},
                        {title: "登记日期", width: "150px", fieldName: "registerDate"},
                        {title: "待处理人", width: "150px", fieldName: "dealName"},
                        {
                            title: "风险等级", width: "120px", fieldType: "custom", render: function (data) {
                            if (data.riskLevel) {
                                var riskLevel = JSON.parse(data.riskLevel);
                                if (riskLevel && riskLevel.result) {
                                    var resultColor = _.propertyOf(JSON.parse(data.riskModel))("resultColor");
                                    if (resultColor) {
                                        return "<span style='background: #" + resultColor + ";color: #" + resultColor + ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + riskLevel.result;
                                    } else {
                                        return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + riskLevel.result;
                                    }
                                } else {
                                    return "无";
                                }

                            } else {
                                return "无";
                            }
                        }
                        },
                        {
                            title: "状态", fieldType: "custom", render: function (data) {
                            return LIB.getDataDic("pool_status", data.status);
                        }
                        }
                    ],
                    filterColumns: ["criteria.strValue.problem", "criteria.strValue.danger", "criteria.strValue.riskLevel", "criteria.strValue.poolStatus"]
                };
                this.drillDataModel.title = this.mainModel.rptData[index].name + "明细";
                if(this.mainModel.barClick === '1'){
                    tableOpt.columns[6].title = '处理人';
                }else {
                    tableOpt.columns[6].title = '待处理人';
                }

                this.drillDataModel.table = tableOpt;
                this.drillDataModel.show = true;
                LIB.globalLoader.show();
            },
            getParam: function () {
                var vo = this.mainModel.vo;
                var beginDate = vo.dateRange[0].Format("yyyy-MM-dd hh:mm:ss");
                var endDate = vo.dateRange[1].Format("yyyy-MM-dd hh:mm:ss");
                var state = vo.state;
                var step = vo.step;
                return {
                    "idsRange": chartTools.getIdsRange(_.propertyOf(vo)("objRange")),
                    "startDateRange": beginDate,
                    "endDateRange": endDate,
                    "state":state,
                    "step":step,
                };
            },
            // 堆叠柱状图
            buildStacBarChars: function (data, dataLimit) {
                var opt = {
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        data:this.getArr(),
                        top:"10",
                        bottom:'10'
                    },
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '70',
                        // containLabel: true
                    },
                };

                if (dataLimit <= data.length) {//如果分组数量大等于限制数量,调整x轴标签倾斜
                    // opt.dataZoom = [
                    //     {   // 这个dataZoom组件，默认控制x轴。
                    //         type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                    //         xAxisIndex: [0],
                    //         start: 0,      // 左边在 0% 的位置。
                    //         end: 5        // 右边在 5% 的位置。
                    //     }
                    // ];
                    opt.dataZoom = [
                        {show: true, xAxisIndex: 0, startValue: 0, endValue: dataLimit}, {type: 'inside'}
                    ];
                }

                var xAxis1 = {
                    type:'category',
                    data:[],  //横坐标名称,
                    // max:'40',
                    axisLabel:{
                        interval:"0",
                        rotate:"30"
                    }
                };
                var sery1 = [
                    {
                        name:"超期未提交",
                        type:"bar",
                        stack: '未审核',
                        data:[],
                        barMaxWidth: 40,

                        label: {
                            normal: {
                                show: true,
                                position: 'inside',
                                textStyle: {
                                    color: '#fff',
                                    fontSize:16
                                },
                                formatter: function(params) {

                                    var num = sery1[0].data[params.dataIndex].value?sery1[0].data[params.dataIndex].value:sery1[0].data[params.dataIndex];
                                    if(parseInt(num) > 0)
                                        return num;
                                    return '';

                                    if(sery1[0].data[params.dataIndex] * 8 >= sery1[1].data[params.dataIndex]
                                        && sery1[0].data[params.dataIndex] * 8 >= sery1[2].data[params.dataIndex]
                                        && sery1[0].data[params.dataIndex] * 8 >= sery1[3].data[params.dataIndex])
                                        return sery1[0].data[params.dataIndex]
                                    else return ''
                                }
                            }
                        },
                    },
                    {
                        name:"超期未审批",
                        type:"bar",
                        stack: '未审核',
                        data:[],
                        barMaxWidth: 40,
                        label: {
                            normal: {
                                show: true,
                                position: 'inside',
                                textStyle: {
                                    color: '#fff',
                                    fontSize:16
                                },
                                formatter: function(params) {

                                    var num = sery1[1].data[params.dataIndex].value?sery1[1].data[params.dataIndex].value:sery1[1].data[params.dataIndex];
                                    if(parseInt(num) > 0)
                                        return num;
                                    return '';

                                    if(sery1[1].data[params.dataIndex] * 8 >= sery1[0].data[params.dataIndex]
                                        && sery1[1].data[params.dataIndex] * 8 >= sery1[2].data[params.dataIndex]
                                        && sery1[1].data[params.dataIndex] * 8 >= sery1[3].data[params.dataIndex])
                                        return sery1[1].data[params.dataIndex]
                                    else return ''
                                }
                            }
                        },
                    },
                    {
                        name:"超期未整改",
                        type:"bar",
                        stack: '未审核',
                        data:[],
                        barMaxWidth: 40,
                        label: {
                            normal: {
                                show: true,
                                position: 'inside',
                                textStyle: {
                                    color: '#fff',
                                    fontSize:16
                                },
                                formatter: function(params) {

                                    var num = sery1[2].data[params.dataIndex].value?sery1[2].data[params.dataIndex].value:sery1[2].data[params.dataIndex];
                                    if(parseInt(num) > 0)
                                        return num;
                                    return '';

                                    if(sery1[2].data[params.dataIndex] * 8 >= sery1[1].data[params.dataIndex]
                                        && sery1[2].data[params.dataIndex] * 8 >= sery1[0].data[params.dataIndex]
                                        && sery1[2].data[params.dataIndex] * 8 >= sery1[3].data[params.dataIndex])
                                        return sery1[2].data[params.dataIndex]
                                    else return ''
                                }
                            }
                        },
                    },
                    {
                        name:"超期未验证",
                        type:"bar",
                        stack: '未审核',
                        data:[],
                        barMaxWidth: 40,
                        label: {
                            normal: {
                                show: true,
                                position: 'inside',
                                textStyle: {
                                    color: '#fff',
                                    fontSize:16
                                },
                                formatter: function(params) {
                                    var num = sery1[3].data[params.dataIndex].value?sery1[3].data[params.dataIndex].value:sery1[3].data[params.dataIndex];
                                    if(parseInt(num) > 0)
                                        return num;
                                    return '';

                                    if(sery1[3].data[params.dataIndex] * 8 >= sery1[1].data[params.dataIndex]
                                        && sery1[3].data[params.dataIndex] * 8 >= sery1[2].data[params.dataIndex]
                                        && sery1[3].data[params.dataIndex] * 8 >= sery1[0].data[params.dataIndex])
                                        return sery1[3].data[params.dataIndex]
                                    else return ''
                                }
                            }
                        },
                    },
                    {
                        name:"超期已提交",
                        type:"bar",
                        stack: '审核',
                        data:[],
                        barMaxWidth: 40,

                        label: {
                            normal: {
                                show: true,
                                position: 'inside',
                                textStyle: {
                                    color: '#fff',
                                    fontSize:16
                                },
                                formatter: function(params) {

                                    var num = sery1[4].data[params.dataIndex].value?sery1[4].data[params.dataIndex].value:sery1[4].data[params.dataIndex];
                                    if(parseInt(num) > 0)
                                        return num;
                                    return '';

                                    if(sery1[4].data[params.dataIndex] * 8 >= sery1[5].data[params.dataIndex]
                                        && sery1[4].data[params.dataIndex] * 8 >= sery1[6].data[params.dataIndex]
                                        && sery1[4].data[params.dataIndex] * 8 >= sery1[7].data[params.dataIndex])
                                        return sery1[4].data[params.dataIndex]
                                    else return ''
                                }
                            }
                        },
                    },
                    {
                        name:"超期已审批",
                        type:"bar",
                        stack: '审核',
                        data:[],
                        barMaxWidth: 40,
                        label: {
                            normal: {
                                show: true,
                                position: 'inside',
                                textStyle: {
                                    color: '#fff',
                                    fontSize:16
                                },
                                formatter: function(params) {

                                    var num = sery1[5].data[params.dataIndex].value?sery1[5].data[params.dataIndex].value:sery1[5].data[params.dataIndex];
                                    if(parseInt(num) > 0)
                                        return num;
                                    return '';

                                    if(sery1[5].data[params.dataIndex] * 8 >= sery1[4].data[params.dataIndex]
                                        && sery1[5].data[params.dataIndex] * 8 >= sery1[6].data[params.dataIndex]
                                        && sery1[5].data[params.dataIndex] * 8 >= sery1[7].data[params.dataIndex])
                                        return sery1[5].data[params.dataIndex]
                                    else return ''
                                }
                            }
                        },
                    },
                    {
                        name:"超期已整改",
                        type:"bar",
                        stack: '审核',
                        data:[],
                        barMaxWidth: 40,
                        label: {
                            normal: {
                                show: true,
                                position: 'inside',
                                textStyle: {
                                    color: '#fff',
                                    fontSize:16
                                },
                                formatter: function(params) {

                                    var num = sery1[6].data[params.dataIndex].value?sery1[6].data[params.dataIndex].value:sery1[6].data[params.dataIndex];
                                    if(parseInt(num) > 0)
                                        return num;
                                    return '';

                                    if(sery1[6].data[params.dataIndex] * 8 >= sery1[5].data[params.dataIndex]
                                        && sery1[6].data[params.dataIndex] * 8 >= sery1[4].data[params.dataIndex]
                                        && sery1[6].data[params.dataIndex] * 8 >= sery1[7].data[params.dataIndex])
                                        return sery1[6].data[params.dataIndex]
                                    else return ''
                                }
                            }
                        },
                    },
                    {
                        name:"超期已验证",
                        type:"bar",
                        stack: '审核',
                        data:[],
                        barMaxWidth: 40,
                        label: {
                            normal: {
                                show: true,
                                position: 'inside',
                                textStyle: {
                                    color: '#fff',
                                    fontSize:16
                                },
                                formatter: function(params) {
                                    var num = sery1[7].data[params.dataIndex].value?sery1[7].data[params.dataIndex].value:sery1[7].data[params.dataIndex];
                                    if(parseInt(num) > 0)
                                        return num;
                                    return '';

                                    if(sery1[7].data[params.dataIndex] * 8 >= sery1[5].data[params.dataIndex]
                                        && sery1[7].data[params.dataIndex] * 8 >= sery1[6].data[params.dataIndex]
                                        && sery1[7].data[params.dataIndex] * 8 >= sery1[4].data[params.dataIndex])
                                        return sery1[7].data[params.dataIndex]
                                    else return ''
                                }
                            }
                        },
                    }
                ];
                
                _.each(data, function (item) {
                    LIB.reNameOrg(item,'name')
                   
                    xAxis1.data.push(item.name);

                    sery1[3].data.push(item.unverify);
                    sery1[2].data.push(item.unrefrom);
                    sery1[1].data.push(item.unapproval);
                    sery1[0].data.push(item.unsubmit);

                    sery1[7].data.push(item.verify);
                    sery1[6].data.push(item.refrom);
                    sery1[5].data.push(item.approval);
                    sery1[4].data.push(item.submit);

                    for (var i = 3; i > 0; i--) {
                        var num = sery1[i].data[sery1[i].data.length - 1];
                        if(num > 0){
                            sery1[i].data[sery1[i].data.length - 1] = {
                                value:num,
                                itemStyle: {normal: {barBorderRadius: [5, 5, 0, 0]}}
                            }
                            break;
                        }
                    }

                    for (var i = 7; i > 3; i--) {
                        var num = sery1[i].data[sery1[i].data.length - 1];
                        if(num > 0){
                            sery1[i].data[sery1[i].data.length - 1] = {
                                value:num,
                                itemStyle: {normal: {barBorderRadius: [5, 5, 0, 0]}}
                            }
                            break;
                        }
                    }

                    //
                    // if(parseInt(item.unverify) > 0){
                    //     sery1[3].data.push({value:item.unverify,itemStyle: {normal: {barBorderRadius: [5, 5, 0, 0]}}
                    //     });
                    //     sery1[0].data.push(item.unsubmit);
                    //     sery1[1].data.push(item.unapproval);
                    //     sery1[2].data.push(item.unrefrom);
                    // }
                    // else if(parseInt(item.unrefrom) > 0){
                    //     sery1[2].data.push({value:item.unrefrom,itemStyle: {normal: {barBorderRadius: [5, 5, 0, 0]}}
                    //     });
                    //     sery1[0].data.push(item.unsubmit);
                    //     sery1[1].data.push(item.unapproval);
                    //     sery1[3].data.push(item.unverify);
                    // }
                    // else if(item.unapproval >0){
                    //     sery1[1].data.push({value:item.unapproval,itemStyle: {normal: {barBorderRadius: [5, 5, 0, 0]}}
                    //     });
                    //     sery1[0].data.push(item.unsubmit);
                    //     sery1[3].data.push(item.unverify);
                    //     sery1[2].data.push(item.unrefrom);
                    // }
                    // else if(item.unsubmit >0){
                    //     sery1[0].data.push({value:item.unsubmit,itemStyle: {normal: {barBorderRadius: [5, 5, 0, 0]}}
                    //     });
                    //     sery1[1].data.push(item.unapproval);
                    //     sery1[3].data.push(item.unverify);
                    //     sery1[2].data.push(item.unrefrom);
                    // }
                    // else{
                    //     sery1[0].data.push(item.unsubmit)
                    //     sery1[1].data.push(item.unapproval);
                    //     sery1[3].data.push(item.unverify);
                    //     sery1[2].data.push(item.unrefrom);
                    // }
                });
                opt.xAxis = [xAxis1];
                opt.series = sery1;

                return opt;
            },

            getArr:function () {
                var arr = [];
                if(this.mainModel.vo.state == 0){
                    arr = [['超期未提交','超期未审批','超期未整改','超期未验证'],['超期已提交','超期已审批','超期已整改','超期已验证']];
                }else if(this.mainModel.vo.state == 1){
                    arr = [['超期已提交','超期已审批','超期已整改','超期已验证']];
                }else
                    arr = [['超期未提交','超期未审批','超期未整改','超期未验证']];
                var tempArr  = [];
                for(var i=0; i<arr.length; i++){
                    if(this.mainModel.vo.step == -1){
                        tempArr = tempArr.concat(arr[i]);
                    }else{
                        tempArr.push(arr[i][this.mainModel.vo.step]);
                    }
                }
                return tempArr;
            },
            
            // deelArr: function () {
            //     var arrStr1 = ['超期未提交','超期未审批','超期未整改','超期未验证'];
            //     var arrStr2 = ['超期已提交','超期已审批','超期已整改','超期已验证'];
            //     var tempArr = [arrStr1, arrStr2];
            //     var step = this.mainModel.vo.step,  state = this.mainModel.vo.state;
            //
            //     var arr = [], arrStr = [];
            //     if(state > 0 && step>0){
            //         arrStr = [tempArr[state-1][step-1]];
            //     }else if(state == 1 && step==0){
            //         arrStr = arrStr1
            //     }else if(state == 1 && step==0){
            //
            //     }
            //
            //
            // },

            buildChart: function () {
                // 排序
                var data = this.mainModel.rptData.sort(function (a, b) {
                    return  parseInt(b.total) - parseInt(a.total);
                });
                // var opt = _.contains(["abs", "avg"], this.mainModel.vo.method)
                //     ? this.buildStacBarChars(data, this.mainModel.chart.dataLimit)
                //     : chartTools.buildLineChars(data, this.mainModel.chart.dataLimit);
                var opt = this.buildStacBarChars(data, this.mainModel.chart.dataLimit);

                // opt.xAxis= [
                //     {
                //         type: 'category',
                //         data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                //     }
                // ]

                this.mainModel.chart.opts = opt;
            },
            doQry: function (type) {
                this.mainModel.vo.method = type || 'abs';
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        _this.$refs.echarts.showLoading();
                        _this.getApi(_this.getParam()).then(function (res) {
                            _this.mainModel.rptData = res.data;

                            _this.buildChart();

                            _this.$refs.echarts.hideLoading();
                        });
                    }
                });
            },
            buildMoreDataTable: function (rptData) {
                var columns = [
                    {title: '统计对象个体名称',fieldName: "name", width: "180px",showTip: true},
                    {title: "总数", fieldName: "total"},
                    // {title: '超期未提交', fieldName: "unsubmit"},
                    // {title: "超期未审批", fieldName: "unapproval"},
                    // {title: '超期未整改', fieldName: "unrefrom"},
                    // {title: "超期未验证", fieldName: "unverify"},
                    // {title: '超期已提交', fieldName: "submit"},
                    // {title: "超期已审批", fieldName: "approval"},
                    // {title: '超期已整改', fieldName: "refrom"},
                    // {title: "超期已验证", fieldName: "verify"},
                ];

                var todoCol = [
                    {title: '超期未提交', fieldName: "unsubmit"},
                    {title: "超期未审批", fieldName: "unapproval"},
                    {title: '超期未整改', fieldName: "unrefrom"},
                    {title: "超期未验证", fieldName: "unverify"}
                ];
                var doneCol = [
                    {title: '超期已提交', fieldName: "submit"},
                    {title: "超期已审批", fieldName: "approval"},
                    {title: '超期已整改', fieldName: "refrom"},
                    {title: "超期已验证", fieldName: "verify"}
                ];
                var step = this.mainModel.vo.step;
                var state = this.mainModel.vo.state;
                if(step != '-1'){
                    todoCol = [todoCol[step]];
                    doneCol = [doneCol[step]];
                }
                if(state === '0'){
                    columns = _.union(columns,todoCol);
                    columns = _.union(columns,doneCol);
                }else if(state === '1'){
                    columns = _.union(columns,doneCol);
                }else if(state === '2'){
                    columns = _.union(columns,todoCol);
                }
                return {
                    columns: columns,
                    data: rptData
                }
            },
            showMore: function () {
                this.mainModel.vo.method = 'abs';
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        _this.getApi(_this.getParam()).then(function (res) {
                            var tableOpt = _this.buildMoreDataTable(res.data);
                            _this.moreDataModel.columns = tableOpt.columns;
                            _this.moreDataModel.scroll = tableOpt.columns.length >= 10;
                            _this.moreDataModel.data = tableOpt.data;
                            _this.moreDataModel.show = true;
                        });
                    }
                });

            },

            doExportRptData: function () {
                window.open("/rpt/stats/details/overduerect/exportExcel" + LIB.urlEncode(this.$refs.rptDetailsTable.getCriteria()).replace("&", "?"));
            },
            doExport:function(){
                var _this = this;
                if(_this.moreDataModel.data.length == 0){
                    LIB.Msg.warning("当前查询无数据可导出！");
                    return;
                }
                var url = "/rpt/stats/pool/overduerect/all/export/" + (_this.mainModel.vo.typeOfRange === 'frw'? 'comp' : 'dep');
                var params = _this.getParam();
                window.open(url + LIB.urlEncode(params).replace("&", "?"));
            },
        },
        ready: function () {
            this.doQry('abs');
        }
    };
    return LIB.Vue.extend(opt);
});