
define(function (require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var objSelect = require("views/reportManagement/reportDynamic/dialog/objSelect");
    var dateUtils = require("views/reportManagement/tools/dateUtils");
    var api = require("../vuex/api");

    var mixin = require("views/reportManagement/tools/chartUtils/charts/normal/normalMixin");


    var typeOfRanges = [
        {value:"frw",label:'公司'},
        {value:"dep",label:'部门'},
        {value:"teacher",label:'讲师'}
    ];
    

    var typeOfCounts = [ {
		value : "0",
		label : '按数量'
	}, {
		value : "1",
		label : '按课时'
	}];




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
            typeOfCount: '0',
            dateRange: [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)],
            objRange: []
        };
        return {
        	typeOfCounts: typeOfCounts,
            typeOfRanges: typeOfRanges,
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
                exportDataUrl:'/rpt/stats/course/dev/exportexcel',
                table:{
                    url:'rpt/stats/course/dev/details{/curPage}{/pageSize}',
                    qryParam:null,
                    columns:[{
	                        title: "讲师",
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
                            title: "开发量",
                            fieldName: "devNum"
                        }
                    ]
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
            objSelect: objSelect
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
                    case 'trend': this._getTrend();
                        break;
                }
            },
            _getIdsRange: function (ranges) {
                var array = _.map(ranges, function (r) {
                    return r.key;
                });
                return array.join(",");
            },
            _getParams:function () {
                var types = {
                    'frw': '1',
                    'dep': '2',
                    'teacher': '3',
                    'course': '4'
                };
                var params = {
                    type: types[this.qryParam.typeOfRange],
                    devType:this.qryParam.typeOfCount,
                    startDateRange: this.qryParam.dateRange[0].Format("yyyy-MM-dd hh:mm:ss"),
                    endDateRange: this.qryParam.dateRange[1].Format("yyyy-MM-dd 23:59:59"),
                    idsRange: this._getIdsRange(this.qryParam.objRange),
                    includeDisableUser:this.leaveWorkerSwitch&&this.qryParam.typeOfRange=='teacher'?'1':'0'
                };
                return params;
            },
            _getTrend: function () {
                var _this = this;
                var params = this._getParams();
                api.queryCourseDevTrend(params).then(function (res) {
                    _this.charts.opt = _this.buildLineChars(res.data, _this.dataNumLimit, 1);
                })  
            },
            _getAbs: function () {
                var _this = this;
                var params = this._getParams();
                api.queryCourseDev(params).then(function (res) {
                    _this.items = res.data;
                    _this.charts.opt = _this.buildBarChars(res.data, _this.dataNumLimit);
                })
            },
            changeMethod: function (m) {
                if(this.method === m) {
                    return;
                }
                this.method = m;

                this.doQuery();

            },
            showMore:function(){
                this.detailModel.table.qryParam = _.deepExtend({}, this._getParams());
                var toolCol = this.detailModel.table.columns[0];
                var isToolColShow = (this.detailModel.table.qryParam.type == "3");
                if(toolCol.visible !== isToolColShow) {
                    toolCol.visible = isToolColShow;
                }
                var toolCol2 = this.detailModel.table.columns[1];
                var isToolColShow2 = (this.detailModel.table.qryParam.type == "2");
                if(toolCol2.visible !== isToolColShow2) {
                    toolCol2.visible = isToolColShow2;
                }
                this.detailModel.show = true;
            },
            doExport:function(){
                var _this = this;
                window.open(_this.detailModel.exportDataUrl+LIB.urlEncode(_this.$refs.rptDetailsTable.getCriteria()).replace("&", "?"));
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
            this.leaveWorkerSwitch = false
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
