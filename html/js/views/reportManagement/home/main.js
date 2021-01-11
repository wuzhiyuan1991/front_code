define(function (require) {
    var LIB = require('lib');
    var template = require("text!./main.html");
    var qryInfoApi = require("../tools/vuex/qryInfoApi");
    var reqUtils = require("../tools/vuex/reqUtils");
    var dateUtils = require("../tools/dateUtils");
    var dataUtils = require("../tools/dataUtils");

    var getLastYearDate = function () {
        var date = dateUtils.getMonthFirstDay(dateUtils.getDateAfterYear(-1))
        return date;
    };

    var getCurEndMonthDate = function () {
        var d = dateUtils.getMonthLastDay();
        return d;
    };
    var newChartModel = function (title, param) {
        return {
            title: title,
            param: param
        };
    };

    var dataModel = {
        defaultCharts: [
            newChartModel("年度检查", {
                method: 'trend',
                item: ['equip'],
                typeOfRange: 'frw',
                objRange: null,
                dateRange: [getLastYearDate(), getCurEndMonthDate()]
            }),
            newChartModel("年度超期未整改", {
                method: 'abs',
                item: ['rectification', '2'],
                typeOfRange: 'frw',
                objRange: null,
                dateRange: [getLastYearDate(), getCurEndMonthDate()]
            })
        ],
        chartsModel: [
            newChartModel(), newChartModel()//, newChartModel()
        ]
    };

    var component = LIB.Vue.extend({
        components: {
            'echart-component': require("../tools/chartUtils/chartFactory"),
            'pie-echart-component': require("./special/poolTotalReport")
        },
        template: template,
        data: function () {
            return dataModel;
        },
        methods: {
            showPieEchar: function (orgList) {
                this.$refs.pieEchart.doQry(orgList, 1);
            },
            doQryAllCharts:function(orgList){
                this.$nextTick(function () {
                    var _this = this;
                    orgList = _.map(orgList, function (org) {
                        return {key: org.id}
                    });
                    if (orgList.length < 1) {
                        orgList[0] = {key: "-1"};
                    }
                    // 复制配置数据
                    _.each(_this.defaultCharts, function (chart, index) {
                        _this.chartsModel.$set(index, _.clone(chart));
                    });

                    _.each(_this.chartsModel, function (chart, i) {
                        chart.param.objRange = orgList;
                    });

                    _.each(_this.chartsModel, function (chart, index) {

                        var qryParam = _.deepExtend({}, chart.param);
                        qryParam['limitOrgByDataAuth'] = 1;//限制只能查询数据权限范围内的组织机构
                        var chartComp = _this.$refs["echart" + index];

                        // 请求数据
                        chartComp.doQry(qryParam);

                        chartComp.$once("build-chart-opt", function (opt) {
                            // 设置图标标题
                            opt.title = {
                                show: true,
                                text: chart.title,
                                top: "20px",
                                left: "20px"
                            };

                            //bug6875
                            if (index === 0) {
                                opt.grid = {
                                    top: 120
                                };
                                opt.tooltip.confine = true
                            }
                        });
                    });
                    // 饼图请求数据
                    orgList = _.pluck(orgList, 'key');
                    _this.showPieEchar(orgList);
                })
            },
            init: function () {
                var _this = this;
                var qryParam = {
                    type: "1",
                    disable: "0"
                };
                var businessSet = LIB.getBusinessSetByNamePath("reportFunction.statCompSet");
                if(businessSet.result){
                    var content = businessSet.content;
                    var num = JSON.parse(content).num;
                    var comp = JSON.parse(content).comp;
                    if(businessSet.result === '1'){
                        this.$resource("organization/list/1/" + num + "?criteria.orderValue.fieldName=name&criteria.orderValue.orderType=0").get(qryParam).then(function (res) {
                            _this.doQryAllCharts(res.data.list);
                        })
                    }else if(businessSet.result === '2'){
                        _this.doQryAllCharts(comp);
                    }
                }else {
                    this.$resource("organization/list/1/20?criteria.orderValue.fieldName=name&criteria.orderValue.orderType=0").get(qryParam).then(function (res) {

                        var orgList = _.map(res.data.list, function (org) {
                            return {key: org.id}
                        });

                        if (orgList.length < 1) {
                            orgList[0] = {key: "-1"};
                        }

                        // 饼图请求数据
                        _this.showPieEchar();

                        // 复制配置数据
                        _.each(_this.defaultCharts, function (chart, index) {
                            _this.chartsModel.$set(index, _.clone(chart));
                        });

                        _.each(_this.chartsModel, function (chart, i) {
                            chart.param.objRange = orgList;
                        });

                        _.each(_this.chartsModel, function (chart, index) {

                            var qryParam = _.deepExtend({}, chart.param);
                            qryParam['limitOrgByDataAuth'] = 1;//限制只能查询数据权限范围内的组织机构
                            var chartComp = _this.$refs["echart" + index];

                            // 请求数据
                            chartComp.doQry(qryParam);

                            chartComp.$once("build-chart-opt", function (opt) {
                                // 设置图标标题
                                opt.title = {
                                    show: true,
                                    text: chart.title,
                                    top: "20px",
                                    left: "20px"
                                };

                                //bug6875
                                if (index === 0) {
                                    opt.grid = {
                                        top: 120
                                    };
                                    opt.tooltip.confine = true
                                }
                            });
                        });
                    });
                }
            }
        },
        route: {
            //因为router使用了keeplive, 所以需要每次激活二级路由的时候重新刷新table
            activate: function (transition) {
                this.init();
                //路由生命周期必须调用
                transition.next();
            }
        },
        compiled: function () {
        }
    });
    return component;
});
