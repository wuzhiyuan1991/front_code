define(function(require) {
    var LIB = require('lib');
    var template = require("text!./checkTableReport.html");
    var dateUtils = require("../../tools/dateUtils");
    var dataUtils = require("../../tools/dataUtils");
    var echartTools = require("../../tools/echartTools");
    var chartTools = require("../../tools/chartTools")
    var api = require("./vuex/checkTableReport-api");
    var components = {
			'obj-select':require("../../reportDynamic/dialog/objSelect")
		};
    var dataModel = function(){
        return {
            qryInfoModel:{
                title:'风险点不符合',
                qryDateType:'1',
                year:null,
                typeOfRanges:[
                              {value:"frw",label:'公司'},
                              {value:"dep",label:'部门'}
                          ],
                types:[{value:"2",label:'全部'},{value:"1",label:'定期排查'},{value:"0",label:'随机排查'}],
                vo:{
                    dateRange:[],
                    objRange:[],
                    typeOfRange:'frw',
                    recordType:"2"
                }
            },
            barChartOpt1:{
                series :[]
            },
            barChartOpt2:{
                series :[]
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
            }
        }
    };
    var opt = {
        template:template,
        components:components,
        data:function(){
            return new dataModel();
        },
        props:{
            qryInfoDetail:Object
        },
        methods:{
        	changeTypeOfRange:function(){
                this.qryInfoModel.vo.objRange = [];
            },
            changeQryYear:function(year){
                this.qryInfoModel.vo.dateRange = [year+'-01-01 00:00:00',year+'-12-31 23:59:59'];
            },
            changeQryMonth:function(month){
                var monthDate = dateUtils.getMonthLastDay(new Date(month+'-20 23:59:59'));
                this.qryInfoModel.vo.dateRange = [month+'-01 00:00:00',monthDate.Format("yyyy-MM-dd 23:59:59")];
            },
            buildDrillParam: function (params) {
                var qryParam = this.getQryParam();
                var dataOpt = _.propertyOf(params.data);
                var objId = dataOpt("xId");
                var param = _.deepExtend({}, qryParam);
                param['criteria.strValue.checkTableId'] = objId;
                param['rptType'] = 1;
                return param;
            },
            doClickCell: function (data) {
                if (!data.cell.fieldName === "code") {
                    return;
                }
                var vo = data.entry.data;
                var router = LIB.ctxPath("/html/main.html#!");
                var routerPart;
                if(vo.type == 1) {//定期排查
                    routerPart="/hiddenDanger/businessCenter/checkRecord?method=detail&code=" + vo.code + "&id=" + vo.id;
                }else if(vo.type == 0) {//随机排查
                    routerPart="/randomInspection/businessCenter/notPlanCheckRecord?method=detail&code=" + vo.code + "&id=" + vo.id;
                }
                window.open(router + routerPart);
            },
            chartClick: function (params) {
                var tableOpt = {
                    url: "rpt/stats/details/checkerRecord/list/{curPage}/{pageSize}",
                    qryParam: this.buildDrillParam(params),
                    columns: [
                        {
                            title:"  ",
                            width:'80px',
                            fieldType:"custom",
                            fieldName:'code',
                            fixed:true,
                            render:function () {
                                return '<div style="color: #33a6ff;cursor: pointer;">查 看</div>'
                            }
                        },
                        {title: "检查结果", width: 100, fieldName: "checkResult"},
                        {title: "检查人", width: 80, fieldName: "checkPersonName"},
                        {title: "检查开始时间", width: 150, fieldName: "checkBeginDate"},
                        {title: "检查结束时间", width: 150, fieldName: "checkEndDate"},
                        {title: "检查对象", width: 120, fieldName: "checkObjectName"},
                        {title: "检查表", width: 150, fieldName: "checkTableName"},
                        {title: "总数", width: 75, fieldName: "total"},
                        {title: "合格", width: 75, fieldName: "qualified"},
                        {title: "不合格", width: 75, fieldName: "unqualified"},
                        {title: "不涉及", width: 75, fieldName: "uninvolved"}

                    ],
                    filterColumns: ["criteria.strValue.checkPersonName", "criteria.strValue.checkResult"]
                };
                this.drillDataModel.table = tableOpt;
                this.drillDataModel.show = true;
            },
            buildBarChart:function(type,data){
                var opt = {
                    tooltip : {trigger: 'axis',formatter: function(params){
                        var label = "";
                        _.each(params,function(param,i){
                            if(i ==0) label += param.name;
                            label += '<br/>'+echartTools.buildColorPie(param.color)+param.seriesName+' : '+param.value;
                            if(i == 2) label += '%';
                        });
                        return label;
                    }},
                    yAxis : [{name : '数量',type : 'value'},{name:'百分比(%)',type:'value',min:0,axisLabel:{formatter:"{value}%"}}],
                    grid: {
                        left: '0',
                        right: '4%',
                        bottom: 10,
                        top: 50,
                        containLabel: true
                    }
                };
                var xAxis1 = {
                        type : 'category',
                        axisLabel:{
                            interval:0
                        },
                        data:[]
                    };
                var series = [
                    {
                        name: "不符合数",
                        type: 'bar',
                        barGap: '-100%',
                        z: 10,
                        barMaxWidth:40,
                        label:{normal:{show:true,position:'top'}},
                        itemStyle: {normal: {barBorderRadius :[5, 5, 0, 0]}},
                        data:[]
                    },
                    {
                        name: "检查总数",
                        type: 'bar',
                        barGap: '-100%',
                        barMaxWidth: 40,
                        label:{normal:{show:true,position:'top'}},
                        itemStyle: {normal: {color: '#ddd',barBorderRadius :[5, 5, 0, 0]}},
                        data:[]
                    },
                    {
                        name: "不符合率",
                        type: 'line',
                        yAxisIndex: 1,
                        data:[]
                    }
                ];
                _.forEach(_.take(data, this.dataNumLimit),function(d,i){
                    xAxis1.data.push(d.xName);
                    var yValues = d.yValues;
                    series[0].data.push({
                        xId:d.xId,
                        name:d.xName,
                        value:yValues.yValue1
                    });
                    series[1].data.push({
                        xId:d.xId,
                        name:d.xName,
                        value:yValues.yValue2
                    });
                    series[2].data.push({
                        xId:d.xId,
                        name:d.xName,
                        value:yValues.yValue3
                    });
                });

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
                var maxLengthOfName = _.max(xAxis1.data,function(d){return d.length}).length;
                if(8 <= maxLengthOfName){//如果名称最大值大于8个字符，横坐标标签倾斜30度,并截断
                    xAxis1.axisLabel = _.extend(xAxis1.axisLabel, {
                        rotate:30,
                        formatter:function(val){
                            return dataUtils.sliceStr(val,8);
                        }
                    });
                    //扩大横坐标底部边距
                    opt.grid = {
                        bottom:80
                    };
                }

                opt.xAxis = [xAxis1];
                opt.series = series;
                return opt;
            },
            showChartLoading:function(){
                this.$refs.barChart1.showLoading();
            },
            getQryParam:function(){
                var vo = this.qryInfoModel.vo;
                var qryParam;

                var dateRange = vo.dateRange;
                if(dateRange.length == 2){
                    var beginDate = vo.dateRange[0];
                    var endDate = vo.dateRange[1];
                    qryParam = {
                        startDateRange:beginDate,
                        endDateRange:endDate
                    };
                }else{
                    qryParam = {};
                }
                var orgType = {"frw":1,"dep":2};
                qryParam.orgType = orgType[vo.typeOfRange];
                qryParam.idsRange = _.map(vo.objRange,function(r){return r.key;}).join(",");
                qryParam.bizType = this.$route.query.bizType ? this.$route.query.bizType : 'default';
                qryParam.recordType = vo.recordType;
                return _.extend(qryParam, _.pick(vo,"timeType"));
            },
            doQry:function(){
                var _this = this;
                var qryParam = this.getQryParam();
                this.showChartLoading();
                api.recordCountByCheckTable(_.extend({type:0},qryParam)).then(function(res){
                    _this.barChartOpt1 = _this.buildBarChart(0, res.data);
                    _this.$refs.barChart1.hideLoading();
                });
            },
            _queryDataNumLimit: function () {
                var _this = this;
                api.queryDataNumLimit().then(function (res) {
                    _this.dataNumLimit = Number(res.data.result) || 20;
                    _this.doQry();
                })
            }
        },
        ready:function(){
            var currentYear = new Date().Format("yyyy");
            this.qryInfoModel.year = currentYear;
            this.changeQryYear(currentYear);
            this._queryDataNumLimit();
        }
    };
    return LIB.Vue.extend(opt);
});