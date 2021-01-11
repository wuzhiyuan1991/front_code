define(function (require) {

    var Vue = require("vue");
    var LIB = require('lib');
    var template = require("text!./Calendar.html");

    var prefixCls = 'ivu-icon';

    var opts = {
        template: template,
        props: {
            show: {
                type: Boolean,
                twoWay: true,
                default: false
            },
            type: {
                type: String,
                default: "date"
            },
            value: {
                type: String,
                twoWay: true,
                default: ""
            },
            x: {
                type: Number,
                default: 0
            },
            y: {
                type: Number,
                default: 0
            },
            begin: {
                type: String,
                twoWay: true,
                default: ""
            },
            end: {
                type: String,
                default: ""
            },
            range: {
                type: Boolean,
                default: false
            },
            rangeBegin: {
                type: Array,
                default: Array
            },
            rangeEnd: {
                type: Array,
                default: Array
            },
            sep: {
                type: String,
                twoWay: true,
                default: "-"
            },
            weeks: {
                type: Array,
                default: function () {
                    return ['日', '一', '二', '三', '四', '五', '六']
                }
            },
            months: {
                type: Array,
                default: function () {
                    return ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
                }
            },
            //给日历 三角形 增加一个判断
            isCalendarClass: {
                type: Boolean,
                default: true
            },
            // 时间选择器是时分秒是否默认为00:00:00, 默认否
            timeZero: {
                type: Boolean,
                default: false
            }
        },
        data: function () {
            return {
                year: 0,
                month: 0,
                day: 0,
                hour: 0,
                minute: 0,
                second: 0,
                days: [],
                today: [],
                currentMonth: Number,
                monthString: "",
            }
        },
        //created : function() {
        //	var _this = this;
        //    this.init()
        //    // 延迟绑定事件，防止关闭
        //    window.setTimeout(function(){
        //        document.addEventListener('click', function(e) {;
        //           // e.stopPropagation()
        //            _this.cancel();
        //        }, false)
        //    }, 500)
        //},
        // 测试用
        watch: {
            // year(val, old) {
            //     console.log("new %s old %s time:%s", val, old, +new Date)
            // },
            show: function () {
                this.init()
            },
            value: function () {
                this.init()
            },
            //增加一个开始时间少于结束时间下拉刷新
            end: function () {
                if (this.end) {
                    this.render(this.year, this.month)
                }
            },
            begin: function () {
                if (this.begin) {
                    this.render(this.year, this.month)
                }
            }
        },
        ready: function () {
            this.init()
        },
        methods: {
            // 日期补零

            zero: function (n) {
                return n < 10 ? '0' + n : n
            },
            // 初始化一些东西
            init: function () {
                var now = new Date();
                if (!!this.value) {
                    if (this.value.indexOf("-") != -1) this.sep = "-"
                    if (this.value.indexOf(".") != -1) this.sep = "."
                    if (this.value.indexOf("/") != -1) this.sep = "/"
                    if (this.type == "date") {
                        var split = this.value.split(this.sep)
                        this.year = parseInt(split[0])
                        this.month = parseInt(split[1]) - 1
                        this.day = parseInt(split[2])
                    } else if (this.type == "datetime") {
                        var split = this.value.split(" ")
                        var splitDate = split[0].split(this.sep)
                        this.year = parseInt(splitDate[0])
                        this.month = parseInt(splitDate[1]) - 1
                        this.day = parseInt(splitDate[2])
                        if (split.length > 1) {
                            var splitTime = split[1].split(":")
                            this.hour = splitTime[0];
                            this.minute = splitTime[1];
                            this.second = splitTime[2];
                        }
                    }
                    if (this.range) {
                        var split = this.value.split(" ~ ")
                        if (split.length > 1) {
                            var beginSplit = split[0].split(this.sep)
                            var endSplit = split[1].split(this.sep)
                            this.rangeBegin = [parseInt(beginSplit[0]), parseInt(beginSplit[1] - 1), parseInt(beginSplit[2])]
                            this.rangeEnd = [parseInt(endSplit[0]), parseInt(endSplit[1] - 1), parseInt(endSplit[2])]
                        }
                    }
                } else {
                    if (this.sep == "") this.sep = "/"
                    this.year = now.getFullYear()
                    this.month = now.getMonth()
                    this.day = now.getDate()
                    if(this.timeZero) {
                        this.hour = "00";
                        this.minute = "00";
                        this.second = "00";
                    } else {
                        this.hour = this.zero(now.getHours())
                        this.minute = this.zero(now.getMinutes())
                        this.second = this.zero(now.getSeconds())
                    }

                    if (this.range) {
                        this.rangeBegin = Array
                        this.rangeEnd = Array
                    }
                }
                this.monthString = this.months[this.month]
                this.render(this.year, this.month)
            },
            // 渲染日期
            render: function (y, m) {
                if (!this.range) {
                    this.rangeBegin = []
                    this.rangeEnd = []
                }
                var firstDayOfMonth = new Date(y, m, 1).getDay()         //当月第一天
                var lastDateOfMonth = new Date(y, m + 1, 0).getDate()    //当月最后一天
                var lastDayOfLastMonth = new Date(y, m, 0).getDate()     //最后一月的最后一天
                this.year = y
                this.currentMonth = this.months[m]
                var seletSplit = this.value.split(" ")[0].split(this.sep)

                var i, line = 0, temp = []
                for (i = 1; i <= lastDateOfMonth; i++) {
                    var dow = new Date(y, m, i).getDay()
                    // 第一行
                    if (dow == 0) {
                        temp[line] = []
                    } else if (i == 1) {
                        temp[line] = []
                        var k = lastDayOfLastMonth - firstDayOfMonth + 1
                        for (var j = 0; j < firstDayOfMonth; j++) {
                            temp[line].push({
                                day: k,
                                disabled: true
                            })
                            k++;
                        }
                    }

                    // 如果是日期范围
                    if (this.range) {
                        var options = {
                            day: i
                        }
                        if (this.rangeBegin.length > 0) {
                            var beginTime = Number(new Date(this.rangeBegin[0], this.rangeBegin[1], this.rangeBegin[2]))
                            var endTime = Number(new Date(this.rangeEnd[0], this.rangeEnd[1], this.rangeEnd[2]))
                            var thisTime = Number(new Date(this.year, this.month, i))
                            if (beginTime <= thisTime && endTime >= thisTime) {
                                options.selected = true
                            }
                        }
                        temp[line].push(options)
                    }
                    else {
                        // 单选模式
                        var chk = new Date()
                        var chkY = chk.getFullYear()
                        var chkM = chk.getMonth()
                        // 匹配上次选中的日期
                        if (
                            parseInt(seletSplit[0]) == this.year &&
                            parseInt(seletSplit[1]) - 1 == this.month &&
                            parseInt(seletSplit[2]) == i) {
                            temp[line].push({
                                day: i,
                                selected: true
                            })
                            this.today = [line, temp[line].length - 1]
                        }

                        // 没有默认值的时候显示选中今天日期
                        else if (chkY == this.year && chkM == this.month && i == this.day && this.value == "") {
                            //var dataTime = chkY.valueOf() + chkM.valueOf() + chkY.valueOf() + i.valueOf();
                            var yearTime = Number(chkM) + Number(1);
                            var dataTime = chkY + '-' + yearTime + '-' + i;
                            //获取毫秒时间在比较
                            var starTime = (new Date(dataTime)).getTime(); // yyyy-MM-dd 00:00:00
                            var endTime = (new Date(this.begin)).getTime(); // yyyy-MM-dd hh:mm:ss 当type=datetime时恒大于startTime

                            if (endTime > starTime) {
                                temp[line].push({
                                    day: i,
                                    selected: false,
                                    disabled: true
                                })
                            } else {
                                temp[line].push({
                                    day: i,
                                    selected: true
                                })
                            }
                            this.today = [line, temp[line].length - 1]
                        } else {
                            // 设置可选范围
                            // console.log(this.begin,this.end);
                            var options = {
                                day: i,
                                selected: false,
                            };
                            if (!!this.begin) {
                                var beginSplit = this.begin.split(this.sep)
                                var beginTime = Number(new Date(
                                    parseInt(beginSplit[0]),
                                    parseInt(beginSplit[1]) - 1,
                                    parseInt(beginSplit[2])
                                ))
                                if (beginTime > Number(new Date(this.year, this.month, i))) options.disabled = true

                            }
                            if (!!this.end) {
                                var endSplit = this.end.split(this.sep)
                                var endTime = Number(new Date(
                                    parseInt(endSplit[0]),
                                    parseInt(endSplit[1]) - 1,
                                    parseInt(endSplit[2])
                                ))
                                if (endTime < Number(new Date(this.year, this.month, i))) options.disabled = true
                            }
                            temp[line].push(options)
                        }
                    }

                    // 最后一行
                    if (dow == 6) {
                        line++
                    } else if (i == lastDateOfMonth) {
                        var k = 1
                        for (dow; dow < 6; dow++) {
                            temp[line].push({
                                day: k,
                                disabled: true
                            })
                            k++
                        }
                    }
                } //end for
                this.days = temp
            },
            // 上月
            prev: function (e) {
                e.stopPropagation()
                if (this.month == 0) {
                    this.month = 11
                    this.year = parseInt(this.year) - 1
                } else {
                    this.month = parseInt(this.month) - 1
                }
                this.monthString = this.months[this.month]
                this.render(this.year, this.month)
            },
            //  下月
            next: function (e) {
                e.stopPropagation()
                if (this.month == 11) {
                    this.month = 0
                    this.year = parseInt(this.year) + 1
                } else {
                    this.month = parseInt(this.month) + 1
                }
                this.monthString = this.months[this.month]
                this.render(this.year, this.month)
            },
            // 选中日期
            select: function (k1, k2, e) {
                if (e != undefined) e.stopPropagation()
                // 日期范围
                if (this.range) {
                    if (this.rangeBegin.length == 0 || this.rangeEndTemp != 0) {
                        this.rangeBegin = [this.year, this.month, this.days[k1][k2].day, this.hour, this.minute, this.second]
                        this.rangeBeginTemp = this.rangeBegin
                        this.rangeEnd = [this.year, this.month, this.days[k1][k2].day, this.hour, this.minute, this.second]
                        this.rangeEndTemp = 0
                    } else {
                        this.rangeEnd = [this.year, this.month, this.days[k1][k2].day, this.hour, this.minute, this.second]
                        this.rangeEndTemp = 1
                        // 判断结束日期小于开始日期则自动颠倒过来
                        if (+new Date(this.rangeEnd[0], this.rangeEnd[1], this.rangeEnd[2]) < +new Date(this.rangeBegin[0], this.rangeBegin[1], this.rangeBegin[2])) {
                            this.rangeBegin = this.rangeEnd
                            this.rangeEnd = this.rangeBeginTemp
                        }
                    }
                    this.render(this.year, this.month)
                } else {
                    // 取消上次选中
                    if (this.today.length > 0 && this.type == "datetime") {
                        if (this.days[(this.today[0])]) {
                            this.days[(this.today[0])][this.today[1]].selected = false
                        }
                    }
                    // 设置当前选中天
                    this.days[k1][k2].selected = true
                    this.day = this.days[k1][k2].day
                    this.today = [k1, k2]
                    if (this.type == 'date') {
                        this.value = this.year + this.sep + this.zero(this.month + 1) + this.sep + this.zero(this.days[k1][k2].day)
                        this.show = false

                    }
                }

            },
            // 多选的时候提交
            ok: function () {
                var r1 = /^[0-9]$|^[0-1][0-9]$|^2[0-3]$/;
                var r2 = /^[0-5]?[0-9]$/;

                if(!r1.test(this.hour)) {
                    LIB.Msg.error("小时请填写0-23之间的正整数");
                    return;
                }
                if(!r2.test(this.minute)) {
                    LIB.Msg.error("分钟请填写0-59之间的正整数");
                    return;

                }
                if(!r2.test(this.second)) {
                    LIB.Msg.error("秒请填写0-59之间的正整数");
                    return;
                }
                // 只有有日期的时候才执行
                if (this.type !== "time") {
                    var isSelected = false;
                    this.days.forEach(function (v) {
                        v.forEach(function (vv) {
                            if (vv.selected) {
                                isSelected = true;
                            }
                        });
                    });
//	                this.days.forEach(v=>{
//	                    v.forEach(vv=>{
//	                        if(vv.selected){
//	                            isSelected=true
//	                        }
//	                    })
//	                })
                    if (!isSelected) return false;
                }

                if (this.range) {
                    this.value = this.output(this.rangeBegin) + " ~ " + this.output(this.rangeEnd)
                } else {
                    if (this.second > 60) {
                        var second = Math.floor(this.second / 60);
                        this.second = parseInt(this.second) - 60;
                        this.minute = parseInt(this.minute) + second;
                    } else if (this.second < 0) {
                        this.second = 0
                    }
                    if (this.minute > 60) {
                        var minute = Math.floor(this.minute / 60);
                        this.minute = parseInt(this.minute) - 60;
                        this.hour = parseInt(this.hour) + minute;
                    } else if (this.minute < 0) {
                        this.minute = 0
                    }
                    if (this.hour > 24 || this.hour < 0) {
                        this.hour = 24;
                    }
                    this.value = this.output([
                        this.year,
                        this.month,
                        this.day,
                        parseInt(this.hour),
                        parseInt(this.minute),
                        parseInt(this.second)
                    ])
                }
                this.show = false;
            },

            // 隐藏控件
            cancel: function () {
                this.show = false;

            },
            // 格式化输出
            output: function (args) {
                if (this.type === 'time') {
                    return this.zero(args[3]) + ":" + this.zero(args[4]) + ":" + this.zero(args[5])
                }
                if (this.type === 'datetime') {
                    return args[0] + this.sep + this.zero(args[1] + 1) + this.sep + this.zero(args[2]) + " " + this.zero(args[3]) + ":" + this.zero(args[4]) + ":" + this.zero(args[5])
                }
                if (this.type === 'date') {
                    return args[0] + this.sep + this.zero(args[1] + 1) + this.sep + this.zero(args[2])
                }
            }
        }
    };


    var component = Vue.extend(opts);
    Vue.component('calendar', component);

});