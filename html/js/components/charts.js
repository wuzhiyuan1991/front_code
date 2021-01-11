define(function(require) {

    var Vue = require("vue");
    var echarts = require("charts");

    var tpl = '<div class="echarts"></div>';

    var ACTION_EVENTS = [
        'legendselectchanged',
        'legendselected',
        'legendunselected',
        'datazoom',
        'datarangeselected',
        'timelinechanged',
        'timelineplaychanged',
        'restore',
        'dataviewchanged',
        'magictypechanged',
        'pieselectchanged',
        'pieselected',
        'pieunselected',
        'mapselectchanged',
        'mapselected',
        'mapunselected'
    ]
    var MOUSE_EVENTS = [
        'click',
        'dblclick',
        'mouseover',
        'mouseout',
        'mousedown',
        'mouseup',
        'globalout'
    ]
    var opt = {
        template: tpl,
        props: ['options', 'theme', 'initOptions', 'group'],
        data: function() {
            return {
                chart: null
            }
        },
        computed: {
            // Only recalculated when accessed from JavaScript.
            // Won't update DOM on value change because getters
            // don't depend on reactive values
            width: {
                cache: false,
                getter: function() {
                    return this.chart.getWidth()
                }
            },
            height: {
                cache: false,
                getter: function() {
                    return this.chart.getHeight()
                }
            },
            isDisposed: {
                cache: false,
                getter: function() {
                    return this.chart.isDisposed()
                }
            }
        },
        methods: {
            // provide a explicit merge option method
            mergeOptions: function(options) {
                this.chart.setOption(options)
            },
            // just delegates ECharts methods to Vue component
            resize: function() {
                this.chart && this.chart.resize()
            },
            dispatchAction: function(payload) {
                this.chart.dispatchAction(payload)
            },
            showLoading: function() {
                this.chart.showLoading()
            },
            hideLoading: function() {
                this.chart.hideLoading()
            },
            getDataURL: function() {
                return this.chart.getDataURL()
            },
            clear: function() {
                this.chart.clear()
            },
            dispose: function() {
                this.chart.dispose()
            }
        },
        ready: function() {
            var _this = this;
            //��ʼ��
            var chart = echarts.init(this.$el, this.theme, this.initOptions)

            // use assign statements to tigger "options" and "group" setters
            chart.setOption(this.options)
            this.$watch('options', function(options) {
                chart.setOption(options, true)
                //chart.resize();
            }, { deep: true })
            chart.group = this.group
            this.$watch('group', function(group) {
                chart.group = group
            })

            // expose ECharts events as custom events
            ACTION_EVENTS.forEach(function(event) {
                chart.on(event, function(params) {
                    _this.$dispatch(event, params)
                })
            });

            // mouse events of ECharts should be renamed to prevent
            // name collision with DOM events
            MOUSE_EVENTS.forEach(function(event) {
                chart.on(event, function(params) {
                    _this.$dispatch('chart' + event, params)
                })
            })

            //添加窗口改变事件，重新调整echarts大小
            var resizeFuc = window.onresize;
            window.onresize = function() {
                _this.resize();
                if (resizeFuc) {
                    resizeFuc();
                }
            }

            this.chart = chart
        },
        connect: function(group) {
            if (typeof group !== 'string') {
                group = group.map(function(chart) {
                    var chart = chart.chart
                })
            }
            echarts.connect(group)
        },
        disconnect: function(group) {
            echarts.connect(group)
        },
        registerMap: function(name, geoData, area) {
            echarts.registerMap(name, geoData, area)
        },
        registerTheme: function(name, theme) {
            echarts.registerTheme(name, theme)
        }
    }
    var component = Vue.extend(opt);
    Vue.component('vuecharts', component);
})
