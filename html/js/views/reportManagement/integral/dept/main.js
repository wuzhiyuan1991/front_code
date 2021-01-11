define(function(require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var dateUtils = require("../../tools/dateUtils");
    var dataUtils = require("../../tools/dataUtils");
    var echartTools = require("../../tools/echartTools");
    var api = require("./vuex/api");
    var components = {
			'obj-select':require("../../reportDynamic/dialog/objSelect")
		};
    var dataModel = function(){
        var vo = {
            beginDate:dateUtils.getMonthFirstDay(new Date()),
            endDate:null,
            objRange:[],
            typeOfRange:"frw",
        };
        return {
            rptData:[],
            qryInfoModel:{
                title:'部门积分排名',
                dataLimit:20,
                beginDateOptions:{
                    disabledDate :function(date){
                        var endDate = _.isDate(vo.endDate) ? vo.endDate : new Date();
                        return date && date.valueOf() > endDate.getTime();
                    }
                },
                endDateOptions:{
                    disabledDate :function(date){
                        var result = false;
                        if(_.isDate(vo.beginDate)){
                            result = date && date.valueOf() < vo.beginDate.getTime();
                        }
                        return result || (date && date.valueOf() > new Date().getTime());
                    }
                },
                typeOfRanges:[
                    {value:"frw",label:'公司'},
                    {value:"dep",label:'部门'}
                ],
                vo:vo,
                rules:{
                    beginDate:[{
                        validator: function(rule, value, callback) {
                            var error = null;
                            if(!_.isDate(value)){
                                error = "";
                            }else if(_.isDate(vo.endDate) && value.valueOf() > vo.endDate.getTime()){
                                error = "开始时间必须小于结束时间";
                            }else if(value.valueOf() > new Date().getTime()){
                                error = "开始时间必须小于当前时间";
                            }
                            return callback(error);
                        }
                    }],
                    endDate:[{
                        validator: function(rule, value, callback) {
                            var error = null;
                            if(!_.isDate(value)){
                                error = "";
                            }else if(_.isDate(vo.beginDate) && value.valueOf() < vo.beginDate.getTime()){
                                error = "结束时间必须大于开始时间";
                            }else if(value.valueOf() > new Date().getTime()){
                                error = "结束时间必须小于当前时间";
                            }
                            return callback(error);
                        }
                    }]
                }
            },
            detailModel:{
                show:false,
                title:'明细',
                exportDataUrl:'/integralscorerecord/exportExcelRptScoreDetailPageData',
                table:{
                    url:'integralscorerecord/selectRptScoreDetailPageData{/curPage}{/pageSize}',
                    qryParam:null,
                    filterColumns:["criteria.strValue.name","criteria.strValue.compName","criteria.strValue.parentName"],
                    columns:[
                        {
                            title: "名次",
                            fieldType:"sequence",
                            width:'80px'
                        },
                        {
                            title: "部门",
                            width:'100px',
                            fieldName: "name"
                        },
                         _.omit(LIB.tableMgr.column.company,"filterType"),
                         _.omit(LIB.tableMgr.column.deptByParentId,"filterType"),
                        {
                            title: "积分值",
                            fieldName: "totalScore",
                            width:'100px'
                        },
                        {
                            title: "人均积分得分",
                            fieldName: "DeptPerCapitaScoreScore",
                            width: 150
                        },
                        {
                            title: "人均发现问题得分",
                            fieldName: "DeptPerCapitaProblemScore",
                            width:150
                        },
                        {
                            title: "整改率得分",
                            fieldName: "DeptReformRateScore",
                            width: 110
                        },
                        {
                            title: "隐患加分",
                            fieldName: "DeptDiscoverHiddenDangerScore",
                            width: 100
                        },{
                            title: "抽检符合率得分",
                            fieldName: "DeptRandomPassRateScore",
                            width:150
                        },{
                            title: "隐患排查率得分",
                            fieldName: "DeptPoolIdentifyRateScore",
                            width:150
                        }
                    ]
                }
            },
            barChartOpt:{
                series :[]
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
            buildBarChart:function(){
                var _this = this;
                var opt = {
                    tooltip: [{trigger: 'axis',formatter: function(params){
                        var data = params[0].data;
                        var tip = data.xName +echartTools.getCsn('dep', data.compId)+":"+data.value;
                        return tip;
                    }}],
                    yAxis : [{type : 'value'}]
                };
                var sery1 = {
                    name:'积分数',
                    type:'bar',
                    barMaxWidth:40,
                    label:{normal:{show:true,position:'top'}},
                    itemStyle: {normal: {barBorderRadius :[5, 5, 0, 0]}},
                    data:[]
                };
                var xAxis1 = {
                    type : 'category',
                    axisLabel:{
                        rotate:30,
                        interval:0
                    },
                    data : []
                };
                _.forEach(_.take(this.rptData, this.qryInfoModel.dataLimit), function(v, i){
                    
                    if (_this.qryInfoModel.vo.typeOfRange=='dep') {
                        LIB.reNameOrg(v,'name')
                    }
                    var value = {
                        xId:v.id,
                        xName:v.name,
                        deptId: v.deptId,
                        compId: v.compId,
                        value:v.score
                    };
                    xAxis1.data.push(dataUtils.sliceStr(value.xName,"8"));
                    sery1.data.push(value);
                });
                opt.xAxis = [xAxis1];
                opt.series = [sery1];

                this.barChartOpt = opt;
                this.$refs.barChart.hideLoading();
            },
            showChartLoading:function(){
                this.$refs.barChart.showLoading();
            },
            getQryParam:function(){
                var vo = this.qryInfoModel.vo;

                var orgType = {
                    'frw':1,
                    'dep':2
                }
                var param = {
                    idsRange: _.map(vo.objRange,function(v){return v.key;}).join(","),
                    orgType: orgType[vo.typeOfRange]
                };
                if(vo.beginDate != ""){
                    param.beginDate = vo.beginDate.Format("yyyy-MM-dd 00:00:00");
                }
                if(vo.endDate != ""){
                    param.endDate = dateUtils.getMonthLastDay(vo.endDate).Format("yyyy-MM-dd 23:59:59");
                }
                return param;
            },
            doQry:function(){
                var _this = this;
                this.$refs.ruleform.validate(function(valid){
                    if(valid){
                        _this.showChartLoading();
                        api.selectRptDeptScoreData(_this.getQryParam()).then(function(res){
                            _this.rptData = res.data;
                            _this.buildBarChart();
                        });
                    }
                });
            },
            showDetails:function(){
                this.detailModel.table.qryParam = _.deepExtend({type:2}, this.getQryParam());
                this.detailModel.show = true;
            },
            doExportData:function(){
                var _this = this;
                window.open(_this.detailModel.exportDataUrl+LIB.urlEncode(_this.$refs.rptDetailsTable.getCriteria()).replace("&", "?"));
            }
        },
        ready:function(){
            this.doQry();
        }
    };
    return LIB.Vue.extend(opt);
});