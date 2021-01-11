define(function(require) {
    var LIB = require('lib');
    var template = require("text!./reportTabsComponent.html");
    var qryInfoApi = require("../tools/vuex/qryInfoApi");
    var echartComponent = require("../tools/chartUtils/chartFactory");

    var newChartModel = function(id, title,param){
    	return {
            id:id,
    		title:title,
    		param:param
    	};
    };

    var buildChartModel = function(data){
    	var details = data.details;
    	var item = [details.item];
    	if(details.indicators){
    		item.push(details.indicators);
    	}
    	var objRange = _.map(_.defaults(details,{objRange:""}).objRange.split(","),function(objId){
			return {key:objId};
		});
    	return newChartModel(data.id, data.name,{
			method:details.method,
			item:item,
			typeOfRange:details.typeOfRange,
			objRange:objRange,
			dateRange:[new Date(details.beginDate),new Date(details.endDate)]
		});
    };

    var dataModel = function(){
        return {
            show:false,
            reportQryInfos:[],
            WIDTH:{'height':'280px','width':'600px'}
        }
    };
    var opts = {
        template:template,
        components:{
            'echart-component':echartComponent
        },
        props:{
            type:{// 1-个人报表
                type:Number,
                required:true
            }
        },
        data:function(){
            return new dataModel();
        },
        methods:{
            doQry:function(){
                var echartTabs = this.$refs.echartTabs;
                _.each(this.reportQryInfos, function(qryInfo, i){
                    //var chartModel = buildChartModel(qryInfo);
                    //debugger
                    //var qryParam = {
                    //    dateRange:[new Date(qryInfo.beginDate), new Date(qryInfo.endDate)],
                    //    item:[qryInfo.item],
                    //    indicators:qryInfo.indicators,
                    //    objRange:qryInfo.objRange.split(","),
                    //    typeOfRange:qryInfo.typeOfRange,
                    //    method:qryInfo.method
                    //};debugger
                    echartTabs[i].$children[0].doQry(qryInfo.param);
                });
            },
            init:function(){
                var _this = this;
                this.show = false;
                qryInfoApi.homeList().then(function(res){
                    _this.$set("reportQryInfos", _.map(res.data, function(qryInfo){return buildChartModel(qryInfo);}));
                    _this.show = true;
                    _this.$nextTick(function(){
                        _this.doQry();
                    });
                });
                //动态显示图表的宽度
                var scrollWidth = document.body.scrollWidth;
                if(scrollWidth <= 1024 ){
                    _this.WIDTH = {'height':'280px','width':'350px'}
                }else if(scrollWidth <= 1400 ){
                    _this.WIDTH = {'height':'280px','width':'420px'}
                }else if(scrollWidth <= 1680 ){
                    _this.WIDTH = {'height':'280px','width':'520px'}
                }else{
                    _this.WIDTH = {'height':'280px','width':'600px'}
                }
            }
        },
        ready:function(){
            this.init();
        }
    };
    return LIB.Vue.extend(opts);
});