define(function(require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var qryInfoApi = require("../tools/vuex/qryInfoApi");
    var dateUtils = require("../tools/dateUtils");
    var reqUtils = require("../tools/vuex/reqUtils");
    var statisConst = require("../tools/statisticalConst");
    //组件列表
    var specialComponents = {
        'average-report': require("./special/average"),
        'front-report': require("./special/front"),
        'end-report': require("./special/end"),
        'detail-report': require("./special/detail"),
        'same-level-report': require("./special/sameLevel")

    };
    var allSpecialReports = LIB.getSettingByNamePath("sysSpecialReports");

    var specialReports = [
        { id: 'averageReport', compName: 'average-report',name: '人均积分', enableStar: false },
        { id: 'detailReport', compName: 'detail-report',name: '积分明细', enableStar: false },
        { id: 'sameLevelReport', compName: 'same-level-report',name: '同层级积分明细', enableStar: false}
    ];
    var specialQryInfos = _.filter(specialReports, function(qryInfo){
        // return _.has(allSpecialReports, qryInfo.id) && allSpecialReports[qryInfo.id].disable === '0';
        return true;
    });
    // var specialQryInfos = _.filter([
    //     {id:'reciprocalRankReport',compName:'reciprocal-rank-report',name:'非计划检查数倒数排名',enableStar:false},
    //     {id:'checkTableReport',compName:'check-table-report',name:'风险点不符合',enableStar:false},
    //     {id:'checkItemReport',compName:'check-item-report',name:'检查项不符合',enableStar:false},
    //     {id:'unqualifiedRate',compName:'unqualified-rate-report',name:'不符合率排名',enableStar:false}
    // ], function(qryInfo){
    //     return _.has(allSpecialReports, qryInfo.id) && allSpecialReports[qryInfo.id].disable === '0';
    // });
    var components = _.extend({
        'normal-report':require("./normal/main")
    },specialComponents);

    var buildQryInfoList = function(data){
        return specialQryInfos.concat(data);
    };
    var dataModel = function(){
        return {
            qryInfoModel:{
                selectedId: 'averageReport',
                activeIndex: 0,
                detailInfo:{},
                list:[]
            },
            reportModel:{
                show:true
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
                    return info.id === _this.qryInfoModel.selectedId;
                });
                return specialComponent ? specialComponent.compName : 'normal-report';
            }
        },
        methods:{
            setHomeOfCover:function(node, formData){
                var _this = this;
                LIB.Modal.confirm({
                    title:'首页报表已配置满额，是否覆盖之前的配置?',
                    onOk:function(){
                        qryInfoApi.setHomeOfCover(null,formData).then(function() {
                            _this.loadQryInfoList();
                            LIB.Msg.info("操作成功");
                        });
                    }
                });
            },
            setHome:function(data){
                var _this = this;
                var currentStar = !data.homeRpt;
                var formData = {
                    type:0,
                    schemeId:data.id
                };
                LIB.Modal.confirm({
                    title:currentStar ? '配置到报表首页?' : '取消报表首页配置?',
                    onOk:function(){
                        qryInfoApi.setHomeOfCommon({state:currentStar},formData).then(function(res){
                            if(res.data){
                                _this.loadQryInfoList();
                                LIB.Msg.info("操作成功");
                            }else{//配置数量已达上限，是否覆盖配置
                                //需要延迟执行，不然嵌套的提示框组件会被一起关闭
                                setTimeout(function(){
                                    _this.setHomeOfCover(data, formData);
                                }, 500);
                            }
                        });
                    }
                });
            },
            loadQryInfoList:function(){
                var _this = this;
                _this.qryInfoModel.list = buildQryInfoList([]);
                // qryInfoApi.list({accessPermission:"1",type:'riskWarning', homeType:"0"}).then(function(res){
                //     _this.qryInfoModel.list = buildQryInfoList(res.data);
                // });
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
