define(function (require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var qryInfoApi = require("../tools/vuex/qryInfoApi");
    var dateUtils = require("../tools/dateUtils");
    var reqUtils = require("../tools/vuex/reqUtils");
    var statisConst = require("../tools/statisticalConst");
    //组件列表
    var specialComponents = {
        //随机观察统计
        'user-participation-report': require("./special/userParticipationReport"),
        'key-post': require("./special/keyPostCheckTime"),
        'user-report':require("../integral/user/main"),
        'dept-report':require("../integral/dept/main"),
        'task-status':require("./special/taskStatus"),
        'self-inspection-rate': require("./special/selfInspectionRate"),
        'dept-per-capita-report':require("../integral/deptPerCapita/main"),//部门人均积分
    };
    var allSpecialReports = LIB.getSettingByNamePath("sysSpecialReports");
    var specialQryInfos = _.filter([
        {id: 'userParticipation', compName: 'user-participation-report', name: '随机观察统计', enableStar: false},
        {id: 'keyPostCheckTime', compName: 'key-post', name: '关键岗位检查次数统计', enableStar: false},
        {id: 'keyPostIssue', compName: 'key-post', name: '关键岗位发现问题统计', enableStar: false},
        {id:'integralUserReport',compName:'user-report',name:'激励绩效个人积分', enableStar: false},
        {id:'integralDeptReport',compName:'dept-report',name:'激励绩效部门积分', enableStar: false},
        {id:'taskStatusReport',compName:'task-status',name:'任务状态统计', enableStar: false},
        {id:'selfInspectionRateReport',compName:'self-inspection-rate',name:'自查自纠率', enableStar: false},
        {id:'integralDeptPerCapitaReport',compName:'dept-per-capita-report',name:'激励绩效部门人均积分', enableStar: false},
    ], function (qryInfo) {
        return _.has(allSpecialReports, qryInfo.id) && allSpecialReports[qryInfo.id].disable == 0;
    });
//    specialQryInfos = specialQryInfos.concat([
//        {id: 'keyPostCheckTime', compName: 'key-post', name: '关键岗位检查次数统计', enableStar: false},
//        {id: 'keyPostIssue', compName: 'key-post', name: '关键岗位发现问题统计', enableStar: false},
//        {id:'userReport',compName:'user-report',name:'激励绩效个人积分'},
//        {id:'deptReport',compName:'dept-report',name:'激励绩效部门积分'},
//
//    ]);
    var components = _.extend({
        'normal-report': require("./normal/main")
    }, specialComponents);

    var buildQryInfoList = function (data) {
        return specialQryInfos.concat(data);
    };
    var dataModel = function () {
        return {
            qryInfoModel: {
                selectedId: 0,
                activeIndex: -1,
                detailInfo: {},
                list: []
            },
            reportModel: {
                show: false
            },
            initReportId: null
        }
    };

    var opt = {
        template: template,
        components: components,
        data: function () {
            return new dataModel();
        },
        computed: {
            'reportCptName': function () {
                var _this = this;
                var specialComponent = _.find(specialQryInfos, function (info) {
                    return info.id === _this.qryInfoModel.selectedId;
                });
                return specialComponent ? specialComponent.compName : 'normal-report';
            },
            colSpan: function () {
                return !!this.initReportId ? '24' : '20'
            }
        },
        methods: {
            setHomeOfCover: function (node, formData) {
                var _this = this;
                LIB.Modal.confirm({
                    title: '首页报表已配置满额，是否覆盖之前的配置?',
                    onOk: function () {
                        qryInfoApi.setHomeOfCover(null, formData).then(function () {
                            _this.loadQryInfoList();
                            LIB.Msg.info("操作成功");
                        });
                    }
                });
            },
            setHome: function (data) {
                var _this = this;
                var currentStar = !data.homeRpt;
                var formData = {
                    type: 0,
                    schemeId: data.id
                };
                LIB.Modal.confirm({
                    title: currentStar ? '配置到报表首页?' : '取消报表首页配置?',
                    onOk: function () {
                        qryInfoApi.setHomeOfCommon({state: currentStar}, formData).then(function (res) {
                            if (res.data) {
                                _this.loadQryInfoList();
                                LIB.Msg.info("操作成功");
                            } else {//配置数量已达上限，是否覆盖配置
                                //需要延迟执行，不然嵌套的提示框组件会被一起关闭
                                setTimeout(function () {
                                    _this.setHomeOfCover(data, formData);
                                }, 500);
                            }
                        });
                    }
                });
            },
            loadQryInfoList: function () {
                var _this = this;
                qryInfoApi.list({accessPermission: "1", type: 'keyData', homeType: "0"}).then(function (res) {
                    _this.qryInfoModel.list = buildQryInfoList(res.data);
                    _this.$emit("setDefaultRpt");
                });
            },
            showReportModel: function (item) {
                if(item.id === 'keyPostCheckTime') {
                    this.reportModel.detailInfo = {
                        item: 'times'
                    };
                } else if (item.id === 'keyPostIssue') {
                    this.reportModel.detailInfo = {
                        item: 'issue'
                    };
                } else {
                    this.reportModel.detailInfo = _.has(item, "details") ? _.deepExtend({}, item.details) : {};
                }
                this.reportModel.show = true;
            },
            qryInfoClick: function (index) {
                this.reportModel.show = false;
                this.$nextTick(function () {
                    this.qryInfoModel.activeIndex = index;
                    var item = this.qryInfoModel.list[index];
                    this.qryInfoModel.selectedId = item.id;
                    this.showReportModel(item);
                });
            },
            _setParameter: function (to) {
                var path = to.path;
                var arr = ['department', 'person','deptPerCapita'];
                var pathArr = path.split("/");
                var common = _.intersection(pathArr, arr);
                var kvs = {
                    department: 'integralDeptReport',
                    person: 'integralUserReport',
                    deptPerCapita: 'integralDeptPerCapitaReport'
                };

                this.initReportId = kvs[common[0]];
                this.loadQryInfoList();
                this.$once("setDefaultRpt",function(){
                    var index = 0;
                    if (this.initReportId) {
                        index = _.findIndex(this.qryInfoModel.list, "id", this.initReportId);
                    }
                    this.qryInfoClick(index);
                });
            }
        },
        ready:function(){},
        route: {
            //因为router使用了keeplive, 所以需要每次激活二级路由的时候重新刷新table
            activate: function (transition) {
                this._setParameter(transition.to);
                //路由生命周期必须调用
                transition.next();
            }
        }
    };
    return LIB.Vue.extend(opt);
});
