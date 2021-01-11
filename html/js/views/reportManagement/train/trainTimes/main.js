
define(function (require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var objSelect = require("views/reportManagement/reportDynamic/dialog/objSelect");
    var dateUtils = require("views/reportManagement/tools/dateUtils");
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
            selectModel: {
                courseSelectModel: {
                    visible: false,
                    filterData: {type: null}
                }
            },
            detailModel:{
                show:false,
                title:'更多',
                exportDataUrl:'/rpt/stats/training/times/exportexcel',
                table:{
                    url:'rpt/stats/training/times/details{/curPage}{/pageSize}',
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
                            title: "次数绝对值",
                            fieldName: "allTimes"
                        },
                        {
                            title: "次数平均值",
                            fieldName: "avgTimes"
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
//                window.open("http://192.168.88.10:10025/rpt/stats/training/times/exportexcel?type=1&startDateRange=2018-01-01+00%3A00%3A00&endDateRange=2018-12-31+00%3A00%3A00&idsRange=&isOnline=&containElective=0");
//                window.open("http://192.168.88.10:10025/rpt/stats/training/passrate/exportexcel?type=1&startDateRange=2018-01-01+00%3A00%3A00&endDateRange=2018-12-31+00%3A00%3A00&idsRange=&isOnline=&containElective=0");
//                window.open("http://192.168.88.10:10025/rpt/stats/course/dev/exportexcel?type=1&startDateRange=2018-01-01+00%3A00%3A00&endDateRange=2018-12-31+00%3A00%3A00&idsRange=&isOnline=&containElective=0");
//                window.open("http://192.168.88.10:10025/rpt/stats/coursecomment/quality/exportexcel?type=1");
//                window.open("http://192.168.88.10:10025/rpt/stats/coursecomment/teaching/exportexcel?type=1");
//                window.open("http://192.168.88.10:10025/rpt/stats/coursecomment/envir/exportexcel?type=1");
//                window.open("http://192.168.88.10:10025/rpt/stats/integralscore/exportexcel?type=1&compIds=ezz2mhmo9b,ezn4clmlee,evdy7u1ij2&idsRange=ezz2mhmo9b,ezn4clmlee,evdy7u1ij2");
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
                    isOnline: this.qryParam.typeOfCourse !== '2' ? this.qryParam.typeOfCourse : null,
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
                api.queryAllTrainingTimes(params).then(function (res) {
                    _this.items = res.data;
                    _this.charts.opt = _this.buildBarChars(res.data, _this.dataNumLimit);
                })
            },
            _getAvg: function () {
                var _this = this;
                var params = this._getParams();
                api.queryAvgTrainingTimes(params).then(function (res) {
                    _this.charts.opt = _this.buildBarChars(res.data, _this.dataNumLimit);
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
                var toolCol3 = this.detailModel.table.columns[4];
                var isToolColShow3 = (this.detailModel.table.qryParam.type != "5");
                if(toolCol3.visible !== isToolColShow3) {
                    toolCol3.visible = isToolColShow3;
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
