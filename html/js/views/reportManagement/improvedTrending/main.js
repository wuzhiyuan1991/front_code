define(function(require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var qryInfoApi = require("../tools/vuex/qryInfoApi");
    //组件列表
    var specialComponents = {
        'pool-total-report':require("./bjtrq/poolTotalReport"),
        'pool-profession-report':require("./bjtrq/poolProfessionReport"),
        'pool-info-source-report':require("./bjtrq/poolInfoSourceReport"),
        'pool-system-element-report':require("./bjtrq/poolSystemElementReport"),
        'pool-grade-report':require("./bjtrq/poolGradeReport"),
        'percent-pass-report':require("./special/percentOfPassReport")
    };
    var allSpecialReports = LIB.getSettingByNamePath("sysSpecialReports");
    var specialQryInfos = _.filter([
        {id:'poolTotalReport',compName:'pool-total-report',name:'隐患总数统计',enableStar:false},
        {id:'poolProfessionReport',compName:'pool-profession-report',name:'专业统计',enableStar:false},
        {id:'poolInfoSourceReport',compName:'pool-info-source-report',name:'信息来源统计',enableStar:false},
        {id:'poolSystemElementReport',compName:'pool-system-element-report',name:'体系要素统计',enableStar:false},
        {id:'poolGradeReport',compName:'pool-grade-report',name:'隐患等级统计',enableStar:false},
        {id:'percentOfPassReport',compName:'percent-pass-report',name:'风险点的符合率趋势',enableStar:false}
    ], function(qryInfo){
        return _.has(allSpecialReports, qryInfo.id) && allSpecialReports[qryInfo.id].disable == 0;
    });
    var components = _.extend({
        'normal-report':require("./normal/main")
    },specialComponents);

    var buildQryInfoList = function(data){
        return specialQryInfos.concat(data);
    };
    var dataModel = function(){
        return {
            qryInfoModel:{
                selectedId:0,
                activeIndex:-1,
                detailInfo:{},
                list:[]
            },
            reportModel:{
                show:false
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
            'reportCptName':function(){
                var _this = this;
                var specialComponent = _.find(specialQryInfos, function(info){
                    return info.id == _this.qryInfoModel.selectedId;
                });
                return specialComponent ? specialComponent.compName : 'normal-report';
            }
        },
        methods:{
            loadQryInfoList:function(){
                var _this = this;
				qryInfoApi.list({accessPermission:"1",type:'improvedTrending', homeType:"0"}).then(function(res){
					_this.qryInfoModel.list = buildQryInfoList(res.data);
                    _this.$emit("setDefaultRpt");
				});
            },
            showReportModel:function(item){
                this.reportModel.detailInfo = _.has(item,"details")?_.deepExtend({},item.details):{};
                this.reportModel.show = true;
            },
            qryInfoClick:function(index){
                this.reportModel.show = false;
                this.$nextTick(function () {
                    this.qryInfoModel.activeIndex = index;
                    var item = this.qryInfoModel.list[index];
                    this.qryInfoModel.selectedId = item.id;
                    this.showReportModel(item);
                }); 
            }
        },
        ready:function(){
            this.$once("setDefaultRpt",function(){
                this.qryInfoClick(0);
            });
        },
		route: {
			//因为router使用了keeplive, 所以需要每次激活二级路由的时候重新刷新table
			activate: function (transition) {
				this.loadQryInfoList();
				//路由生命周期必须调用
				transition.next();
			}
		}
    };
    return LIB.Vue.extend(opt);
});