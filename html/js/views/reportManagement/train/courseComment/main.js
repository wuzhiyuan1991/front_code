
define(function (require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var objSelect = require("views/reportManagement/reportDynamic/dialog/objSelect");
    var dateUtils = require("views/reportManagement/tools/dateUtils");
    var api = require("../vuex/api");

    var mixin = require("views/reportManagement/tools/chartUtils/charts/normal/normalMixin");

    var typeOfComments = [
                        {value:"quality",label:'课件质量'},
                        {value:"teaching",label:'讲师水平'},
                        {value:"envir",label:'环境体验'},
                    ];
    
    var typeOfRanges = [
        {value:"frw",label:'公司'},
        {value:"dep",label:'部门'},
        {value:"teacher",label:'讲师'},
        {value:"course",label:'课程'}
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
        	typeOfComment: 'quality',
            typeOfRange: 'frw',
            dateRange: [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)],
            objRange: []
        };
        return {
            typeOfRanges: typeOfRanges,
            typeOfComments: typeOfComments,
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
                exportDataUrl:'/rpt/stats/coursecomment/{commentType}/exportexcel',
                table:{
                    url:'rpt/stats/coursecomment/{commentType}/details{/curPage}{/pageSize}',
                    qryParam:null,
                    columns:[{
	                        title: "课程",
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
                            title: "平均星级",
                            fieldName: "grade"
                        }
                    ]
                }
            },
            labelModel:{
                show:false,
                title:'评论标签',
                table:{
                    url:'rpt/stats/coursecomment/{commentType}/labels{/curPage}{/pageSize}',
                    qryParam:null,
                    columns:[{
	                        title: "课程名称",
	                        fieldName: "courseName",
	                        width:160
                    	},
                    	{
	                        title: "标签1",
	                        fieldName: "label1",
	                        width:130
                    	},
                    	{
	                        title: "标签2",
	                        fieldName: "label2",
	                        width:130
                    	},
                    	{
	                        title: "标签3",
	                        fieldName: "label3",
	                        width:130
                    	},
                    	{
	                        title: "标签4",
	                        fieldName: "label4",
	                        width:130
                    	},
                    	{
	                        title: "标签5",
	                        fieldName: "label5",
	                        width:130
                    	},
                    	{
	                        title: "标签6",
	                        fieldName: "label6",
	                        width:130
                    	}
                    	
                    ]
                }
            },
            labelRange: {
            	quality:['实用性强','内容全面','深入浅出','纸上谈兵','枯燥无味','难以理解'], 
            	teaching:['耐心细致','积极互动','讲解透彻','严肃冷漠','逻辑混乱','啰嗦跑题'],
            	envir:['网速流畅','使用方便','环境舒适','经常卡顿','难以操作','条件恶劣']
            },
            method: 'abs',
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
            changeTypeOfComment: function () {
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
                	commentType:this.qryParam.typeOfComment,
                    type: types[this.qryParam.typeOfRange],
                    startDateRange: this.qryParam.dateRange[0].Format("yyyy-MM-dd hh:mm:ss"),
                    endDateRange: this.qryParam.dateRange[1].Format("yyyy-MM-dd 23:59:59"),
                    idsRange: this._getIdsRange(this.qryParam.objRange)
                };
                return params;
            },
            _getAbs: function () {
                var _this = this;
                var params = this._getParams();
                if(params.type == 3 && params.commentType == 'envir') {
                	LIB.Msg.warning("环境体验无法按讲师查询");
                	return false;
                }
	            api.queryCourseComment(params).then(function (res) {
	            	if(!res.data || res.data.length == 0) {
	            		LIB.Msg.info("暂无评价数据");
	            		return;
	            	}
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
            showLabels:function(){
            	var _this = this;
                this.labelModel.table.qryParam = _.deepExtend({}, this._getParams());
                _.each(this.labelModel.table.columns, function(column, index){
                	if(index > 0)
                		column.title = _this.labelRange[_this.labelModel.table.qryParam.commentType][index - 1];
                	if(_this.labelModel.table.columns.length == index + 1)
                		_this.labelModel.show = true;
                })
                
            },
            showMore:function(){
                this.detailModel.table.qryParam = _.deepExtend({}, this._getParams());
                var toolCol1 = this.detailModel.table.columns[0];
                var isToolColShow1 = (this.detailModel.table.qryParam.type == "4");
                if(toolCol1.visible !== isToolColShow1) {
                    toolCol1.visible = isToolColShow1;
                }
                var toolCol2 = this.detailModel.table.columns[1];
                var isToolColShow2 = (this.detailModel.table.qryParam.type == "3");
                if(toolCol2.visible !== isToolColShow2) {
                    toolCol2.visible = isToolColShow2;
                }
                var toolCol3 = this.detailModel.table.columns[2];
                var isToolColShow3 = (this.detailModel.table.qryParam.type == "4" || this.detailModel.table.qryParam.type == "2");
                if(toolCol3.visible !== isToolColShow3) {
                    toolCol3.visible = isToolColShow3;
                }
                this.detailModel.show = true;
            },
            doExport:function(){
                var _this = this;
                var url = '/rpt/stats/coursecomment/' + this.qryParam.typeOfComment + '/exportexcel';
                window.open(url+LIB.urlEncode(_this.$refs.rptDetailsTable.getCriteria()).replace("&", "?"));
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
