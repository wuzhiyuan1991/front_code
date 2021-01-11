
define(function (require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var objSelect = require("views/reportManagement/reportDynamic/dialog/objSelect");
    var dateUtils = require("views/reportManagement/tools/dateUtils");
    var examSelectModal = require("componentsEx/selectTableModal/examSelectModal");

    var api = require("../vuex/api");

    var mixin = require("views/reportManagement/tools/chartUtils/charts/normal/normalMixin");



    var buildDataModel =function () {
        var defaultFilterModel = {
        	exams:[],
        };
        return {
            qryParam: defaultFilterModel,
            selectModel: {
                examSelectModel: {
                    visible: false,
                    filterData: {type: null}
                }
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
        	examModal: examSelectModal
        },
        data: function () {
            return buildDataModel();
        },
        computed: {
        },
        methods: {
        	doRemoveExam: function (index) {
                this.qryParam.exams.splice(index, 1);
                
            },
            doSaveExams: function (data) {
            	_.each(data, function(exam){
            		exam.examDate = new Date(exam.examDate).Format("yyyy-MM-dd");
            	})
                this.qryParam.exams = this.qryParam.exams.concat(data);
            },
            doShowExamModal: function () {
                var excludeIds = _.map(this.qryParam.exams, function(exam){
                    	return exam.id;
                    });
                this.selectModel.examSelectModel.filterData = {"criteria.strsValue" : {excludeId:excludeIds},disable:0,"criteria.dateValue":{endExamDate:new Date().Format("yyyy-MM-dd hh:mm:ss")}}
                this.selectModel.examSelectModel.visible = true;
            },
            doQuery: function () {
            	var _this = this;
                var params = this._getParams();
                api.queryExamResultGroupByExamPoint(params).then(function (res) {
                    _this.items = res.data;
                    _this.charts.opt = _this.buildPieChart(res.data);
                })
            },
            _getIdsRange: function (ranges) {
                var array = _.map(ranges, function (r) {
                    return r.id;
                });
                return array.join(",");
            },
            _getParams: function () {
                var params = {
                    idsRange: this._getIdsRange(this.qryParam.exams),
                };
                return params;
            },
            buildPieChart: function (data) {
                var opt = {
                    title: {text: '错题知识点分布', top: "20px", x: "center"},
                    tooltip: {trigger: 'item', formatter: "{a} <br/>{b} : {c} ({d}%)"}
                };
                var legend = {
                    type: "scroll",
                    orient: "vertical",
                    left: 20,
                    top: 'middle',
                    padding: [30, 0],
                    data: []
                };
                var sery = {
                    name: '错题数',
                    type: 'pie',
                    radius: [0, '55%'],
                    center: ['65%', '60%'],
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                formatter: '{b}({d}%)'
                            },
                            labelLine: {show: true}
                        }
                    },
                    data: [],
                    startAngle: 45
                };

                // 格式化数据
                var items = _.map(data, function (v) {
                    return {
                        xId: v.xId,
                        name: v.xName,
                        value: Number(v.yValues.yValue2) - Number(v.yValues.yValue1)
                    }
                });

                // 按错题数量从大到小排序
                items = _.sortBy(items, function (v) {
                    return -1 * v.value
                });
                // 取前50个数据
                items = items.slice(0, 50);

                legend.data = _.pluck(items, "name");
                sery.data = items;

                opt.legend = legend;
                opt.series = [sery];
                return opt;
            },
            doExport:function(){
                var _this = this;
                window.open(_this.detailModel.exportDataUrl+LIB.urlEncode(_this.$refs.rptDetailsTable.getCriteria()).replace("&", "?"));
            },
            doExportExcel: function () {
                window.open("/rpt/stats/exam/detail/exportexcel?idsRange=" + this._getIdsRange(this.qryParam.exams));
            }
        },
        ready:function(){
            this.doQuery();
        },
        route: {

        },
        attached: function () {
            this.$refs.echarts.resize();
        }
    };
    return LIB.Vue.extend(opt);
});
