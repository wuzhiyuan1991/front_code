define(function (require) {
    var LIB = require('lib');
    var template = require("text!./detailModal.html");

    var sliceStr = function (val, len) {
        var le = len || 4;
        return !val ? "" : val.length > le ? val.slice(0, le).concat("..") : val;
    };

    var opt = {
        template: template,
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            values: {
                type: Array,
                default: function () {
                    return []
                }
            }
        },
        computed: {
            times: function () {
                return _.get(this.values, '[0].xValue')
            },
            percent: function () {
                return _.get(this.values, '[0].yValue')
            },
            checkTables: function () {
                return _.map(this.values, function (item) {
                    return {
                        id: item.xId,
                        name: item.xName,
                        compName: LIB.getDataDic("org", item.compId)["csn"]
                    }
                })
            }
        },
        data: function () {
            return {
                title: '详情',
                barChartOpt: {
                    series: []
                },
                activeIndex: 0
            }
        },
        methods: {
            buildChartOpt: function (items) {
                this.activeIndex = this.activeIndex || 0;
                this.visible = true;

                var opt = {
                    dataZoom: [
                        {show: true, yAxisIndex: 0,left:"10"}, {type: 'inside'}
                    ],
                    tooltip: {
                        show: true,
                        trigger: 'axis',
                        formatter: '{b}'
                    },
                    xAxis: {
                        name: '合格率(%)',
                        type: 'value'
                    },
                    yAxis: {
                        name: '检查项',
                        type: 'category',
                        data: _.map(items, 'xName'),
                        axisLabel:{
                            textStyle:{
                                fontSize:12
                            }
                        }
                    },
                    series: [
                        {
                            name: '检查项',
                            type: 'bar',
                            barMaxWidth: 30,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'right',
                                    formatter: '{c}%'
                                }
                            },
                            itemStyle: {normal: {barBorderRadius: [0, 0, 0, 0]}},
                            data: _.map(items, 'yValue')
                        }
                    ]
                };
                var maxLengthOfName = _.max(opt.yAxis.data, function (d) {
                    return d.length
                }).length;
                if (25 <= maxLengthOfName) {//如果名称最大值大于8个字符，横坐标标签倾斜30度,并截断
                    opt.yAxis.axisLabel = {
                       // rotate: 30,
                        formatter: function (val) {
                            return sliceStr(val, 15);
                        }
                    };
                }
                opt.grid = {
                    left: 330,
                };

                this.$nextTick(function () {
                    this.barChartOpt = opt;
                    this.$refs.chart.chart.resize();
                })
            },
            doClick: function (index, id) {
                if(index === this.activeIndex) {
                    return;
                }
                this.activeIndex = index;
                this.$emit('on-change', id);
            },
            onClose: function () {
                this.activeIndex = 0;
            }
        }
    };
    return LIB.Vue.extend(opt);
});