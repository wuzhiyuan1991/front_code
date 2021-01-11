/**
 * Echarts工具类
 */
define(function(require) {
    var LIB = require("lib");
    //柱状矢量小图标
	var barIcon = "path://M6.7,22.9h10V48h-10V22.9zM24.9,13h10v35h-10V13zM43.2,2h10v46h-10V2zM3.1,58h53.7";
	//饼状矢量小图标
	var pieIcon = "M113.66,73.506c0.22,0.99,0.962,1.677,1.98,1.677c0.66,0,1.32-0.302,1.87-0.825l26.485-25.357c0.797-0.77,1.265-1.843,1.265-2.86c0-0.825-0.33-1.567-0.907-2.145c-7.014-6.683-16.446-10.836-26.567-11.716c-1.925-0.165-4.236,1.32-4.236,3.355l0,0l0,0v37.348l0,0l0,0C113.577,73.176,113.604,73.341,113.66,73.506M113.082,81.234c-1.292-1.293-2.613-2.063-2.613-4.125l0.138-39.851c0.137-0.77,0.055-1.348-0.248-1.733c-0.22-0.248-0.522-0.413-0.853-0.413c-23.652,0-42.876,20.104-42.876,44.829c0,24.092,19.747,43.701,44.031,43.701c10.918,0,21.37-4.098,29.428-11.551c0.688-0.633,1.1-1.513,1.1-2.476c0.027-0.963-0.357-1.843-1.018-2.53L113.082,81.234M150.237,52.247c-1.183-1.458-3.548-1.541-4.923-0.22l-26.182,25.357c-0.688,0.66-1.045,1.54-1.072,2.475c0,0.936,0.357,1.815,1.018,2.503l25.879,25.88c0.798,0.77,1.513,1.018,2.421,1.018c0.962,0,1.87-0.413,2.502-1.155c6.601-7.865,10.259-17.849,10.259-28.107C160.166,69.876,156.618,60.03,150.237,52.247";

    var buildBar2PieToolBox = function(chartModelThis, opt){

                var _opt;
                var seriesType = "bar";
                var radioType = ['bar', 'pie'];
                var _covertBarData2PieData = function(barData){
                    return _.map(barData, function(dd){
                        return {value:dd.value,xId:dd.xId,name:dd.xName}
                    });
                };
                var seriesOptGenreator = {
                    'bar': function(option, instance, ecModel, api){
                        if("pie" == seriesType){
                            instance.setOption(option, true);
                        }
                    },
                    'pie': function(option, instance, ecModel, api){
                        if("bar" == seriesType){
                            var newOption = _.deepExtend(option,{
                                                tooltip: [{
                                                    trigger: 'item',
                                                    formatter:'{b}:{c}'
                                                }]
                                            });
                            //删除坐标轴
                            delete newOption.xAxis;
                            delete newOption.yAxis;
                            var data = newOption.series[0].data;
                            newOption.series[0] = {
                                type:'pie',
                                radius : '55%',
                                center: ['50%', '50%'],
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: true,
                                            formatter: '{b} : {c} ({d}%)'
                                        },
                                        labelLine: {show: true}
                                    }
                                },
                                data:_covertBarData2PieData(data)
                            };
                            instance.setOption(newOption, true);
                        }
                    }
                };
                var onclick = function(ecModel, api, type){
                    //TODO 只能使用原始的Echart对象及相关方法
                    var echartsInstance = chartModelThis.$refs.echarts.chart;
                    // Not supported magicType
                    if (!seriesOptGenreator[type]) {
                        // console.warn("不支持的图标类型操作. type : " + type);
                        return;
                    }
                    //seriesType = type;
                    var _this = this;
                    var newOption = _.deepExtend({}, _opt);
                    seriesOptGenreator[type](newOption, echartsInstance, ecModel, api);
                    echartsInstance.setOption(newOption, true);
                    _.each(radioType, function(radio){
                        _this.model.setIconStatus(radio, 'normal');
                    })
                    _this.model.setIconStatus(type, 'emphasis');
                };
                var toolboxOption = {
                            show: true,
                            right: '5%',
                            feature: {
                                myTool:{
                                    show: true,
                                    type: [],
                                    // Icon group
                                    icon: {
                                        bar:barIcon,
                                        pie:pieIcon
                                    },
                                    title:{
                                        bar: '切换为柱状图',
                                        pie:'切换为饼图'
                                    },
                                    option: {},
                                    seriesIndex: {},
                                    onclick: onclick
                                }
                            }
                        };
                opt.toolbox = toolboxOption;
                _opt = _.clone(opt);
            };
    var formatTooltip = function(params){
        var label = "";
        _.each(params,function(param,i){
            if(i ==0) label += param.name;
            label += '<br/>'+buildColorPie(param.color)+param.seriesName+' : '+('-'==param.value ? '-':param.value+'%');
        });
        return label;
    };
    var buildColorPie = function(color){
        return '<span style="display:inline-block;margin-right:5px;'
                    + 'border-radius:10px;width:9px;height:9px;background-color:' + color + '"></span>';
    };
    //获取公司简称,并添加“-”
    var getCsn = function(typeOfRange, compId){
        if("frw" == typeOfRange) return "";
        var csn = _.propertyOf(LIB.getDataDic("org", compId))("csn");
        return _.isEmpty(csn)? "" : "-"+csn;
    };
    return {
        getCsn:getCsn,
        buildColorPie:buildColorPie,
        formatTooltip:formatTooltip,
        buildBar2PieToolBox:buildBar2PieToolBox
    }
});