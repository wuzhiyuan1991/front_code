
define(function (require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var objSelect = require("views/reportManagement/reportDynamic/dialog/objSelect");
    var dateUtils = require("views/reportManagement/tools/dateUtils");
    var dataUtils = require("views/reportManagement/tools/dataUtils");
    var echartTools = require("views/reportManagement/tools/echartTools");
    var courseSelectModal = require("componentsEx/selectTableModal/courseSelectModal");

    var api = require("../vuex/api");

    var mixin = require("views/reportManagement/tools/chartUtils/charts/normal/normalMixin");

    var typeOfRanges = [
        {value:"frw",label:'公司'},
        {value:"dep",label:'部门'},
        {value:"per",label:'学员'}
    ];

    var typeOfCourses = [
        {
            value: '2',
            label: '全部'
        },
        {
            value: '1',
            label: '线上课程'
        },
        {
            value: '0',
            label: '线下课程'
        }
    ];



    var buildDataModel =function () {
        var current = new Date();
        var currYear = current.getFullYear();
        var times = {
            prevWeek: new Date(currYear, current.getMonth(), current.getDate()-7),
            prevMonth: new Date(currYear, current.getMonth()-1),
            prevQuarter: new Date(currYear, current.getMonth()-3),
            prevYear: new Date(currYear-1, current.getMonth())
        };
        var defaultFilterModel = {
            typeOfRange: 'frw',
            typeOfCourse: '2',
            dateRange: [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)],
            objRange: [],
            course: {
                id: '',
                name: ''
            },
            containElective: false
        };
        return {
            typeOfRanges: typeOfRanges,
            typeOfCourses: typeOfCourses,
            qryParam: defaultFilterModel,
            datePickModel:{
                options:{
                    shortcuts:[
                        {text: '本周',value: function() {return [dateUtils.getWeekFirstDay(current), dateUtils.getWeekLastDay(current)];}},
                        {text: '本月',value: function() {return [dateUtils.getMonthFirstDay(current), dateUtils.getMonthLastDay(current)];}},
                        {text: '本季度',value: function() {return [dateUtils.getQuarterFirstDay(current), dateUtils.getQuarterLastDay(current)];}},
                        {text: '本年',value: function() {return [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)];}},
                        {text: '上周',value: function() {return [dateUtils.getWeekFirstDay(times.prevWeek), dateUtils.getWeekLastDay(times.prevWeek)];}},
                        {text: '上月',value: function() {return [dateUtils.getMonthFirstDay(times.prevMonth), dateUtils.getMonthLastDay(times.prevMonth)];}},
                        {text: '上季度',value: function() {return [dateUtils.getQuarterFirstDay(times.prevQuarter), dateUtils.getQuarterLastDay(times.prevQuarter)];}},
                        {text: '去年',value: function() {return [dateUtils.getYearFirstDay(times.prevYear), dateUtils.getYearLastDay(times.prevYear)];}}
                    ]
                }
            },
            detailModel:{
                show:false,
                title:'更多',
                exportDataUrl:'/rpt/stats/training/passrate/exportexcel',
                table:{
                    url:'rpt/stats/training/passrate/details{/curPage}{/pageSize}',
                    qryParam:null,
                    columns:[
						{
						    title: "姓名",
						    fieldName: "name"
						},
                        {
                            title: "部门",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.deptId) {
                                    return LIB.getDataDic("org", data.deptId)["deptName"];
                                }
                            }
                        },
                        {
                            title: "公司",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.compId) {
                                    return LIB.getDataDic("org", data.compId)["compName"];
                                }
                            }
                        },
                        {
                            title: "课程",
                            fieldName: "courseName"
                        },
                        {
                            title: "通过率",
                            fieldName: "passRate",
                            render:function(data) {
                            	return data.passRate + '%';
                            }
                        }
                    ]
                }
            },
            selectModel: {
                courseSelectModel: {
                    visible: false,
                    filterData: {type: null}
                }
            },
            method: 'abs',
            leaveWorkerSwitch:false,
            charts: {
                opt: {
                    series: []
                }
            },
            items: [],
            titleValue: ''
        };
    };

    var opt = {
        template: template,
        mixins: [mixin],
        components: {
            objSelect: objSelect,
            courseSelectModal: courseSelectModal
        },
        data: function () {
            return buildDataModel();
        },
        computed: {
            rightTitle: function () {
                var _this = this;
                return _.find(typeOfRanges, function (item) {
                    return item.value === _this.titleValue
                }).label;
            }
        },
        methods: {
            changeTypeOfRange: function () {
                this.qryParam.objRange = [];
            },
            doQuery: function () {
                this.titleValue = this.qryParam.typeOfRange;
                switch (this.method) {
                    case 'abs': this._getAbs();
                        break;
                    case 'avg': this._getAvg();
                        break;
                }
            },
            clearCourse: function () {
                this.qryParam.course = {id: '', name: ''};
            },
            doSaveCourse: function (data) {
                var _d = data[0];
                this.qryParam.course = {
                    id: _d.id,
                    name: _d.name
                }
            },
            showCourseModal: function () {
                this.selectModel.courseSelectModel.visible = true;
            },
            changeMethod: function (m) {
                if(this.method === m) {
                    return;
                }
                this.method = m;

                this.doQuery();
            },
            _getIdsRange: function (ranges) {
                var array = _.map(ranges, function (r) {
                    return r.key;
                });
                return array.join(",");
            },
            _getParams: function () {
                var types = {
                    'frw': '1',
                    'dep': '2',
                    'per': '5'
                };
                var params = {
                    type: types[this.qryParam.typeOfRange],
                    startDateRange: this.qryParam.dateRange[0].Format("yyyy-MM-dd hh:mm:ss"),
                    endDateRange: this.qryParam.dateRange[1].Format("yyyy-MM-dd 23:59:59"),
                    idsRange: this._getIdsRange(this.qryParam.objRange),
                    isOnline: this.qryParam.typeOfCourse !== '2' ? this.qryParam.typeOfCourse : '',
                    containElective: this.qryParam.containElective ? '1' : '0',
                    includeDisableUser:this.leaveWorkerSwitch&&this.qryParam.typeOfRange=='per'?'1':'0'
                };
                if(this.qryParam.course.id) {
                    params.courseIds = this.qryParam.course.id;
                }

                return params;
            },
            _getAbs: function () {
                var _this = this;
                var params = this._getParams();
                api.queryTrainingPassRate(params).then(function (res) {
                	if(!res.data || res.data.length == 0) {
	            		LIB.Msg.info("暂无培训数据");
	            		return;
	            	}
                    _this.items = res.data;
                    _this.charts.opt = _this.buildBarChars(res.data, 10);
                })
            },
            _getAvg: function () {
                var _this = this;
                var params = this._getParams();
                api.queryAvgTrainingTimes(params).then(function (res) {
                	if(!res.data || res.data.length == 0) {
	            		LIB.Msg.info("暂无培训数据");
	            		return;
	            	}
                    _this.charts.opt = _this.buildBarChars(res.data, 10);
                })
            },
            showMore:function(){
                this.detailModel.table.qryParam = _.deepExtend({}, this._getParams());
                var toolCol = this.detailModel.table.columns[0];
                var isToolColShow = (this.detailModel.table.qryParam.type == "5");
                if(toolCol.visible !== isToolColShow) {
                    toolCol.visible = isToolColShow;
                }
                var toolCol2 = this.detailModel.table.columns[1];
                var isToolColShow2 = (this.detailModel.table.qryParam.type != "1");
                if(toolCol2.visible !== isToolColShow2) {
                    toolCol2.visible = isToolColShow2;
                }
                this.detailModel.show = true;
            },
            doExport:function(){
                var _this = this;
                window.open(_this.detailModel.exportDataUrl+LIB.urlEncode(_this.$refs.rptDetailsTable.getCriteria()).replace("&", "?"));
            },
            buildBarChars: function (data, dataLimit) {
                var typeOfRange = this.qryParam.typeOfRange;
                var opt = {
                    //tooltip: [{trigger: 'axis', formatter: '{b}:{c}'}],
                    tooltip: [{trigger: 'axis', formatter: function(params){
                        var data = params[0].data;
                        var tip = data.xName +echartTools.getCsn(typeOfRange, data.compId)+":"+data.value;
                        return tip;
                    }}],
                    yAxis: {
                    	type: 'value',
                    	axisLabel: {
                            formatter: function (val) {
                                return val + '%';
                            }
                        },
            		},
                    grid: {
                        left: '0',
                        right: '4%',
                        bottom: 10,
                        top: 20,
                        containLabel: true
                    }
                };
                var sery1 = {
                    name: '检查次数',
                    type: 'bar',
                    barMaxWidth: 40,
                    label: {normal: {show: true, position: 'top',formatter : '{c}%'}},
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

                var _data = _.sortBy(data, function (d) {
                    return Number(d.yValue) * -1
                });
                _data = _.map(_.take(_data, this.dataNumLimit), function (v) {
                    return {
                        xId: v.xId,
                        xName: v.xValue,
                        deptId: v.deptId,
                        compId: v.compId,
                        value: v.yValue
                    };
                });
                sery1.data = _data;
                xAxis1.data = _.pluck(_data, "xName");

                if(20 < xAxis1.data.length){//如果分组数量大等于限制数量,添加缩放滚动条
                    opt.grid.bottom = '15%';
                    opt.dataZoom = [
                        {
                            type: 'slider',
                            show: true,
                            xAxisIndex: 0,
                            start: 0,
                            end: parseInt((20 / xAxis1.data.length) * 100),
                            zoomLock:true,
                            showDetail:false
                        }
                    ]
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
                        bottom: 80,
                        top: 80
                    };
                }
                opt.xAxis = [xAxis1];
                opt.series = [sery1];
                return opt;
            },
            _queryDataNumLimit: function () {
                var _this = this;
                api.queryDataNumLimit().then(function (res) {
                    _this.dataNumLimit = Number(res.data.result) || 20;
                    _this.doQuery();
                })
            }
        },
        ready:function(){
            this.leaveWorkerSwitch=false
            this._queryDataNumLimit();
        },
        route: {

        },
        attached: function () {
            this.$refs.echarts.resize();
        }
    };
    return LIB.Vue.extend(opt);
});
