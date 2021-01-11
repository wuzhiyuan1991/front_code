
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
        {value:"teacher",label:'讲师'},
        {value:"per",label:'学员'}
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
            dateRange: [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)],
            objRange: []
        };
        return {
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
                exportDataUrl:'/rpt/stats/integralscore/exportexcel',
                table:{
                    url:'rpt/stats/integralscore/details{/curPage}{/pageSize}',
                    qryParam:null,
                    columns:[
                        {
                            title: "姓名",
                            fieldName: "name"
                        },
                        {
                            title: "讲师",
                            fieldName: "name"
                        },
                        {
                            title: "部门",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.orgId) {
                                    return LIB.getDataDic("org", data.orgId)["deptName"];
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
                            title: "总得分",
                            fieldName: "totalScore"
                        },
                        {
                        	title: "上传线上课程得分",
                            fieldName: "DeptOnlineCourseDevScore"
                        },
                        {
                        	title: "上传线下课程得分",
                            fieldName: "DeptOfflineCourseDevScore"
                        },
                        {
                        	title: "人均积分排名得分",
                            fieldName: "DeptPerCapitaTrainingScore"
                        },
                        {
                        	title: "开发线上课程得分",
                            fieldName: "OnlineCourseDevScore"
                        },
                        {
                        	title: "开发线下课程得分",
                            fieldName: "OfflineCourseDevScore"
                        },
                        {
                        	title: "讲师水平1得分",
                            fieldName: "TeachingLevel5Score"
                        },
                        {
                        	title: "讲师水平2得分",
                            fieldName: "TeachingLevel4Score"
                        },
                        {
                        	title: "课件质量1得分",
                            fieldName: "CourseQuality5Score"
                        },
                        {
                        	title: "课件质量2得分",
                            fieldName: "CourseQuality4Score"
                        },
                        
                        {
                        	title: "必修课按时通过得分",
                            fieldName: "CompulsoryTrainingOnTimeScore",
                            width: 160
                        },
                        {
                        	title: "必修课逾期通过得分",
                            fieldName: "CompulsoryTrainingOverTimeScore",
                            width: 160
                        },
                        {
                        	title: "通过选修课得分",
                            fieldName: "OptionalTrainingScore"
                        },
                        {
                        	title: "通过考试得分",
                            fieldName: "PassATestScore"
                        },
                        {
                        	title: "课程评论得分",
                            fieldName: "CommentScore"
                        }
                    ]
                }
            },
            method: 'abs',
            charts: {
                opt: {
                    series: []
                }
            },
            items: [],
            titleValue: '',
            visibleMode: ''
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
            },
            showTypeRanges: function () {
                return this.visibleMode === 'all';
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
                    'per': '5'
                };
                var params = {
                    type: types[this.qryParam.typeOfRange],
                    startDateRange: this.qryParam.dateRange[0].Format("yyyy-MM-dd hh:mm:ss"),
                    endDateRange: this.qryParam.dateRange[1].Format("yyyy-MM-dd 23:59:59"),
                    idsRange: this._getIdsRange(this.qryParam.objRange)
                };
                return params;
            },
            _getTrend: function () {
                var _this = this;
                var params = this._getParams();
                api.queryCourseQualityTrend(params).then(function (res) {
                    _this.charts.opt = _this.buildLineChars(res.data, _this.dataNumLimit, 1);
                })
            },
            _getAbs: function () {
                var _this = this;
                var params = this._getParams();
                api.queryTrainingScore(params).then(function (res) {
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
                var isToolColShow = (this.detailModel.table.qryParam.type == "5");
                if(toolCol.visible !== isToolColShow) {
                    toolCol.visible = isToolColShow;
                }
                var toolCol2 = this.detailModel.table.columns[1];
                var isToolColShow2 = (this.detailModel.table.qryParam.type == "3");
                if(toolCol2.visible !== isToolColShow2) {
                    toolCol2.visible = isToolColShow2;
                }
                var toolCol3 = this.detailModel.table.columns[2];
                var isToolColShow3 = (this.detailModel.table.qryParam.type == "2" || this.detailModel.table.qryParam.type == "5");
                if(toolCol3.visible !== isToolColShow3) {
                    toolCol3.visible = isToolColShow3;
                }
                
                //公司/部门积分字段
                var orgToolCols = this.detailModel.table.columns.slice(5,8);
                var isOrgToolColShow = (this.detailModel.table.qryParam.type == "1" || this.detailModel.table.qryParam.type == "2");
//                if(toolCol6.visible !== isOrgToolColShow) {
//                	toolCol6.visible = isOrgToolColShow;
//                	toolCol7.visible = isOrgToolColShow;
//                	toolCol8.visible = isOrgToolColShow;
//                }
                _.each(orgToolCols,function(col){
                	col.visible = isOrgToolColShow;
                });
                
                //讲师积分字段
                var teacherToolCols = this.detailModel.table.columns.slice(8,14);
                var isTeacherToolColShow = (this.detailModel.table.qryParam.type == "3");
                _.each(teacherToolCols,function(col){
                	col.visible = isTeacherToolColShow;
                });
                
                //学员积分字段
                var userToolCols = this.detailModel.table.columns.slice(14);
                var isUserToolColShow = (this.detailModel.table.qryParam.type == "5");
                _.each(userToolCols,function(col){
                	col.visible = isUserToolColShow;
                });
                
                
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
            },
            _setConfig: function () {

                var path = this.$route.path;
                var pathArr = path.split("/");
                var arr = ['student', 'department', 'teacher'];
                var common = _.intersection(pathArr, arr);

                var kvs = {
                    all: 'frw',
                    student: 'per',
                    department: 'dep',
                    teacher: 'teacher'
                };

                this.visibleMode = common[0] || 'all';


                this.qryParam.typeOfRange = kvs[this.visibleMode];
                this.qryParam.objRange = [];
            }
        },
        ready:function(){
        },
        route: {

        },
        attached: function () {
            this._setConfig();
            this.$refs.echarts.resize();
            this._queryDataNumLimit();
        }
    };
    return LIB.Vue.extend(opt);
});
