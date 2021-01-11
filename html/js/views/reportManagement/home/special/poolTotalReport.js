define(function (require) {
    var LIB = require('lib');
    var template = require("text!./poolTotalReport.html");
    var dateUtils = require("../../tools/dateUtils");
    var api = require("./vuex/poolTotalReport-api");

    var opt = {
        template: template,
        data: function () {
            return {
                pieChartOpt: {
                    series: []
                }
            }
        },
        methods: {
            buildPieChart: function (data) {
                var opt = {
                    title: {text: '年度隐患总数', top: "20px", x:'center'},
                    tooltip: {trigger: 'item', formatter: "{a} <br/>{b} : {c} ({d}%)"}
                };
                var legend = {
                    type: 'scroll',
                    orient: 'vertical',
                    left: 20,
                    top: 'middle',
                    padding: [30, 0],
                    data: []
                };
                var sery = {
                    name: '隐患总数',
                    type: 'pie',
                    radius: [0, '55%'],
                    center: ['65%', '60%'],
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                formatter: '{b} : {c} ({d}%)'
                            },
                            labelLine: {show: true}
                        }
                    },
                    data: []
                };
                _.find(data, function (d, i) {
                    legend.data.push(d.xValue);
                    sery.data.push({
                        xId: d.xId,
                        name: d.xValue,
                        value: d.yValue
                    });
                    return i + 1 == 20;
                });
                opt.legend = legend;
                opt.series = [sery];
                this.pieChartOpt = opt;
                this.$refs.pieChart.hideLoading();
            },
            showChartLoading: function () {
                this.$refs.pieChart.showLoading();
            },
            getQryParam: function () {
                return {
                    startDateRange: dateUtils.getMonthFirstDay(dateUtils.getDateAfterYear(-1)).Format("yyyy-MM-dd 00:00:00"),
                    endDateRange: dateUtils.getMonthLastDay().Format("yyyy-MM-dd 23:59:59"),
                };
            },
            doQry: function (orgList, limitOrgByDataAuth) {
                var _this = this;
                var qryParam = this.getQryParam();
                if(limitOrgByDataAuth) {
                    qryParam['limitOrgByDataAuth'] = 1;
                }
                if(orgList){
                    qryParam.idsRange = orgList.join(",");
                }
                this.showChartLoading();
                api.poolCountByOrg(qryParam).then(function (res) {
                    _this.buildPieChart(res.data);
                });
            }
        }
    };
    return LIB.Vue.extend(opt);
});