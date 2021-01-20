define(function (require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var qryInfoApi = require("../tools/vuex/qryInfoApi");
    var dateUtils = require("../tools/dateUtils");
    var reqUtils = require("../tools/vuex/reqUtils");
    var statisConst = require("../tools/statisticalConst");
    //组件列表
    var specialComponents = {
        //非计划检查数倒数排名
        'reciprocal-rank-report': require("./special/reciprocalRankReport"),
        'check-item-report': require("../riskControl/bjtrq/checkItemReport"),
        'check-table-report': require("../riskControl/bjtrq/checkTableReport"),
        'unqualified-rate-report': require("./special/unqualifiedRateReport")
    };
    var allSpecialReports = LIB.getSettingByNamePath("sysSpecialReports");
    var specialQryInfos = _.filter([
        { id: 'reciprocalRankReport', compName: 'reciprocal-rank-report', name: LIB.lang('em.ms.trroui'), enableStar: false },
        { id: 'checkTableReport', compName: 'check-table-report', name: LIB.lang('em.ms.trpdnm'), enableStar: false },
        { id: 'checkItemReport', compName: 'check-item-report', name: LIB.lang('em.ms.cidnm'), enableStar: false },
        { id: 'unqualifiedRate', compName: 'unqualified-rate-report', name: LIB.lang('em.ms.ncrr'), enableStar: false },
    ], function (qryInfo) {
        return _.has(allSpecialReports, qryInfo.id) && allSpecialReports[qryInfo.id].disable == 0;
    });
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
            }
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
                    return info.id == _this.qryInfoModel.selectedId;
                });
                return specialComponent ? specialComponent.compName : 'normal-report';
            }
        },
        methods: {
            setHomeOfCover: function (node, formData) {
                var _this = this;
                LIB.Modal.confirm({
                    title: LIB.lang('em.ms.tfprhbf') + '?',
                    onOk: function () {
                        qryInfoApi.setHomeOfCover(null, formData).then(function () {
                            _this.loadQryInfoList();
                            LIB.Msg.info(LIB.lang('gb.common.operations'));
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
                    title: currentStar ? LIB.lang('em.ms.ctrhp') + '?' : LIB.lang('em.ms.ctcot') + '?',
                    onOk: function () {
                        qryInfoApi.setHomeOfCommon({ state: currentStar }, formData).then(function (res) {
                            if (res.data) {
                                _this.loadQryInfoList();
                                LIB.Msg.info(LIB.lang('gb.common.operations'));
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
                qryInfoApi.list({ accessPermission: "1", type: 'riskWarning', homeType: "0" }).then(function (res) {
                    _this.qryInfoModel.list = buildQryInfoList(res.data);
                    _this.$emit("setDefaultRpt");
                });
            },
            showReportModel: function (item) {
                this.reportModel.detailInfo = _.has(item, "details") ? _.deepExtend({}, item.details) : {};
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
            }
        },
        ready: function () {
            this.$once("setDefaultRpt", function () {
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
