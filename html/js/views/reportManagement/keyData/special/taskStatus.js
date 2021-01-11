define(function (require) {
    var LIB = require('lib');
    var template = require("text!./taskStatus.html");
    var qryInfoApi = require("../../tools/vuex/qryInfoApi");
    var dateUtils = require("../../tools/dateUtils");
    var components = {
        'obj-select': require("../../reportDynamic/dialog/objSelect"),
    };

    var dataModel = function () {
        var current = new Date();
        var currYear = current.getFullYear();
        var times = {
            prevWeek: new Date(currYear, current.getMonth(), current.getDate()-7),
            prevMonth: new Date(currYear, current.getMonth()-1),
            prevQuarter: new Date(currYear, current.getMonth()-3),
            prevYear: new Date(currYear-1, current.getMonth())
        };
        return {
            datePickModel: {
                options: {
                    shortcuts: [
                        {
                            text: '本周',
                            value: function () {
                                return [dateUtils.getWeekFirstDay(current), current];
                            }
                        },
                        {
                            text: '本月',
                            value: function () {
                                return [dateUtils.getMonthFirstDay(current), current];
                            }
                        },
                        {
                            text: '本季度',
                            value: function () {
                                return [dateUtils.getQuarterFirstDay(current), current];
                            }
                        },
                        {
                            text: '本年',
                            value: function () {
                                return [dateUtils.getYearFirstDay(current), current];
                            }
                        },
                        {text: '上周',value: function() {return [dateUtils.getWeekFirstDay(times.prevWeek), dateUtils.getWeekLastDay(times.prevWeek)];}},
                        {text: '上月',value: function() {return [dateUtils.getMonthFirstDay(times.prevMonth), dateUtils.getMonthLastDay(times.prevMonth)];}},
                        {text: '上季度',value: function() {return [dateUtils.getQuarterFirstDay(times.prevQuarter), dateUtils.getQuarterLastDay(times.prevQuarter)];}},
                        {text: '去年',value: function() {return [dateUtils.getYearFirstDay(times.prevYear), dateUtils.getYearLastDay(times.prevYear)];}}
                    ]
                }
            },
            qryInfoModel: {
                title: '任务状态统计',
                vo: {
                    item: [],
                    objRange: [],
                    typeOfRange: 'dep',
                    dateRange: [dateUtils.getYearFirstDay(current), current]
                },
                rules: {
                    dateRange: [
                        {type: 'array', required: true, message: '请选择统计日期'},
                        {
                            validator: function(rule, value, callback) {
                                return value[1] < value[0] ? callback(new Error('结束时间须不小于开始时间')) : (value[1] > new Date() ? callback(new Error('结束时间不能大于当前日期')) : callback());
                            }
                        }
                    ],
                    objRange: [
                        {type: 'array', required: true, message: '请选择统计对象'},
                    ]
                }
            },
            typeOfRanges :[
                {value:"dep",label:'部门'},
                {value:"per",label:'人员'}
            ],
            taskStatusCfg:{},
            //dataNumLimit: 20,
            headers:[],
            cellList:[],
            exportModel:{
                url : "/rpt/stats/taskstatus/exportExcel",
            },
            tips:"请选择查询条件"
        };
    };
    var opt = {
        template: template,
        components: components,
        data: function () {
            return dataModel();
        },
        props: {
            qryInfoDetail: Object
        },
        computed: {
            tableWidth: function () {
                if(this.headers.length > 10) {
                    return {
                        width: this.headers.length * 100 + "px"
                    }
                }
                return {
                    width: "100%"
                }
            }
        },
        methods: {
            changeTypeOfRange: function () {
                this.qryInfoModel.vo.objRange = [];
            },
            getIdsRange: function (ranges) {
                var array = _.map(ranges, function (r) {
                    return r.key;
                });
                return array.join(",");
            },
            getParams: function () {
                var types = {
                    'dep': '1',
                    'per': '2'
                };
                var params = {
                    type: types[this.qryInfoModel.vo.typeOfRange],
                    startDateRange: this.qryInfoModel.vo.dateRange[0].Format("yyyy-MM-dd 00:00:00"),
                    endDateRange: this.qryInfoModel.vo.dateRange[1].Format("yyyy-MM-dd 00:00:00"),
                    idsRange: this.getIdsRange(this.qryInfoModel.vo.objRange),
                };
                return params;
            },
            checkEndWith : function(str, endStr){
                var d= str.length-endStr.length;
                return (d >= 0 && str.lastIndexOf(endStr)==d)
            },
            getCellValue:function(row, orgId){
                if(!orgId  || !row || !row[orgId]) {
                    return "";
                }
                if(this.checkEndWith(row[orgId].rowKey, "Rate")) {//判断要加百分号显示
                    return row[orgId].value + "%";
                }
                return row[orgId].value;

            },
            doExport: function() {
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        var params = _this.getParams();
                        window.open(_this.exportModel.url + LIB.urlEncode(params).replace("&", "?"));
                    }
                });
            },
            doQry: function () {
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        _this.headers = [];
                        _this.cellList = [];
                        _this.tips="正在查询...";
                        var params = _this.getParams();
                        qryInfoApi.queryTaskStatus(params).then(function(res){
                            if(res.data){
                                var list = [];
                                _.each(res.data, function(value, key){
                                    if(_this.headers.length == 0) {
                                        _.each(value, function(item){
                                            _this.headers.push({id:item.columnId, name:item.columnName});
                                        });
                                    }
                                    list.push([key, value]);
                                });
                                _this.cellList = list.concat();

                                if(list.length == 0) {
                                    _this.tips="查不到数据";
                                }
                            }else{
                                _this.tips="查不到数据";
                            }
                        });
                    }
                });
            },
            doRefresh: function () {
                var _this = this;
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        _this.headers = [];
                        _this.cellList = [];
                        _this.tips="正在查询...";
                        var params = _this.getParams();
                        qryInfoApi.refreshTaskStatus(params).then(function(res){
                            if(res.data){
                                var list = [];
                                _.each(res.data, function(value, key){
                                    if(_this.headers.length == 0) {
                                        _.each(value, function(item){
                                            _this.headers.push({id:item.columnId, name:item.columnName});
                                        });
                                    }
                                    list.push([key, value]);
                                });
                                _this.cellList = list.concat();

                                if(list.length == 0) {
                                    _this.tips="查不到数据";
                                }
                            }else{
                                _this.tips="查不到数据";
                            }
                        });
                    }
                });
            },
            //_queryDataNumLimit: function () {
            //    var _this = this;
            //
            //    qryInfoApi.queryDataNumLimit().then(function (res) {
            //        _this.dataNumLimit = Number(res.data.result) || 20;
            //        //_this.doQry();
            //    })
            //}
        },
        created: function () {
            // this.loadQryParam(this.qryInfoDetail);
        },
        ready: function () {
            //this._queryDataNumLimit();
        }
    };
    return LIB.Vue.extend(opt);
});