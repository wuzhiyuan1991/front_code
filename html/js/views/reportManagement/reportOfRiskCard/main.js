define(function(require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var api = require("./vuex/api");
    var components = {
			'obj-select':require("../tools/dialog/objSelect")
    };
    var dataModel = function(){
        return {
            mainModel:{
                title:'告知卡分布统计',
                typeOfRanges:[
                              {value:"frw",label:'公司'},
                              {value:"dep",label:'部门'}
                          ],
                typeOfCards:[
                    {value:"risk",label:'风险点告知卡'},
                    {value:"pos",label:'岗位告知卡'}
                ],
                stateOfCards:[
                    {value:"-1",label:'全部'},
                    {value:"0",label:'启用'},
                    {value:"1",label:'停用'},
                ],
                vo:{
                    objRange: [],
                    typeOfRange:'dep',
                    typeOfCard:'risk',
                    stateOfCard:'-1',
                },
                rules:{
                	typeOfRange:{required: true, message: '请选择对象范围'},
                    typeOfCard:{required: true, message: '请选择告知卡类型'},
                    stateOfCard:{required: true, message: '请选择告知卡状态'}
                },
                charts:{
                    pieChartOpt:{
                        series :[]
                    },
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
        computed:{
        },
        methods:{
        	changeTypeOfRange:function(){
                this.mainModel.vo.objRange = [];
            },
            // changeQryDate:function(type){
            //     if(1 == type){//本年
            //         this.mainModel.vo.dateRange = [dateUtils.getYearFirstDay(current), dateUtils.getYearLastDay(current)];
            //     }else if(2 == type){//本季度
            //         this.mainModel.vo.dateRange = [dateUtils.getQuarterFirstDay(current), dateUtils.getQuarterLastDay(current)];
            //     }else if(3 == type){//本月
            //         this.mainModel.vo.dateRange = [dateUtils.getMonthFirstDay(current), dateUtils.getMonthLastDay(current)];
            //     }else{
            //         this.mainModel.vo.dateRange = [];
            //     }
            // },
            showChartLoading:function(){
                this.$refs.pieChart.showLoading();
                // this.$refs.barChart.showLoading();
            },
            toggleLegend: function () {
                var opt = this.mainModel.charts.pieChartOpt;
                opt.legend.show = !opt.legend.show;
                if (opt.legend.show) {
                    opt.series[0].center = ['55%', '50%'];
                    opt.toolbox.feature.myTool1.title = '隐藏图例';
                } else {
                    opt.series[0].center = ['50%', '50%'];
                    opt.toolbox.feature.myTool1.title = '显示图例';
                }
            },
            buildPieChart:function(data){
                var _this = this;
                var opt = {
                    title:{x:'center',text:'告知卡统计-饼状图', top: 20},
                    tooltip : {trigger: 'item',formatter: "{a} <br/>{b} : {c} ({d}%)"},
                    toolbox: {
                        feature: {
                            myTool1: {
                                show: true,
                                title: '隐藏图例',
                                icon: 'image://images/toggle.svg',
                                onclick: function (){
                                    _this.toggleLegend();
                                }
                            }
                        },
                        top: 5,
                        left: 5,
                        iconStyle: {
                            emphasis: {
                                textPosition: 'right',
                                textAlign: 'left'
                            }
                        }
                    }
                };
                var legend = {
                    type: 'scroll',
                    orient: 'vertical',
                    left: 10,
                    top: 'middle',
                    padding: [30, 0],
                    // bottom: 20,
                    z: 1,
                    data: [],
                    show: true
                };
                var sery = {
                    startAngle: 0,
                    name: '告知卡数量',
                    type: 'pie',
                    radius: '50%',
                    center: ['55%', '50%'],
                    label: {
                        normal: {
                            show: true,
                            formatter: '{b} : {c} ({d}%)'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '18',
                                fontWeight: 'bold',
                                backgroundColor: 'white'
                            },
                            borderColor: '#aaa',
                            borderWidth: 1,
                            borderRadius: 4,
                            padding: 5
                        }
                    },
                    data: []
                };
                _.find(data,function(d,i){
                    if (_this.mainModel.vo.typeOfRange=='dep') {
                        LIB.reNameOrg(d,'xName')
                    }
                    
                    legend.data.push(d.xName);
                    sery.data.push({
                        xId:d.xId,
                        name:d.xName,
                        value:d.yValue
                    });
                    return i+1 == 20;
                    //return false;
                });
                opt.legend = legend;
                opt.series = [sery];
                this.mainModel.charts.pieChartOpt = opt;
                this.$refs.pieChart.hideLoading();
            },
            getQryParam:function(){
                var vo = this.mainModel.vo;
                var qryParam = {};
                qryParam.type = vo.typeOfCard === 'risk' ? 1 : 2;
                qryParam.orgType = vo.typeOfRange === 'frw' ? 1 : 2;
                qryParam.state = vo.stateOfCard === '-1' ? '' : vo.stateOfCard;
                qryParam.idsRange = _.map(vo.objRange,function(r){return r.key;}).join(",");
                return qryParam;
            },
            doQry:function(){
                var _this = this;
                var qryParam = this.getQryParam();
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        _this.showChartLoading();
                        api.riskCardRpt(qryParam).then(function (res) {
                            _this.buildPieChart(res.data);
                        })
                    }
                })
            }
        },
        ready:function(){
            this.doQry();
        }
    };
    return LIB.Vue.extend(opt);
});