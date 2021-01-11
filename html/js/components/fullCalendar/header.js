/**
 * Created by yyt on 2016/11/28.
 */

define(function (require) {
    var dateFunc = require("./dateFunc");

    var template = '<div class="full-calendar-header"> ' +
        // '<div class="header-left">日历' +
        // '<slot name="header-left"> ' +
        // '</slot> ' +
        // '</div> ' +
        '<div class="header-center"> ' +
        '<span class="prev-month" @click.stop="goPrev">{{leftArrow}}</span> ' +
        '<span class="title">{{title}}</span> ' +
        '<span class="next-month" @click.stop="goNext">{{rightArrow}}</span> ' +
        '</div> ' +
        // '<div class="header-right"> ' +
        // '<slot name="header-right"> ' +
        // '</slot> ' +
        // '</div> ' +
        '</div> ';


    var prefixCls = 'full-calendar-header';


    var opts = {
        template: template,
        created: function () {
            this.dispatchEvent()
        },
        props: {
            currentDate: {},
            titleFormat: {},
            firstDay: {}
        },
        data: function () {
            return {
                title: '',
                leftArrow: '<',
                rightArrow: '>',
                headDate: new Date()
            }
        },
        watch: {
            currentDate: function (val) {
                if (!val) return;
                this.headDate = val
                // this.headDate = JSON.parse(JSON.stringify(val))
            }
        },
        methods: {
            goPrev: function () {
                this.headDate = this.changeMonth(this.headDate, -1)
                this.dispatchEvent()
            },
            goNext: function () {
                this.headDate = this.changeMonth(this.headDate, 1)
                this.dispatchEvent()
            },
            changeMonth: function (date, num) {
                var dt = new Date(date)
                return new Date(dt.setMonth(dt.getMonth() + num))
            },
            dispatchEvent: function () {
                this.title = dateFunc.format(this.headDate, this.titleFormat);

                // 获取该月第一天
                var startDate = dateFunc.getStartDate(this.headDate);
                // 获取该月第一天是星期几
                var curWeekDay = startDate.getDay();

                // 1st day of this monthView
                //startDate.setDate(startDate.getDate() - curWeekDay + 1)
                var diff = parseInt(this.firstDay) - curWeekDay;
                // if (diff) diff -= 7;
                startDate.setDate(startDate.getDate() + diff);

                // the month view is 6*7
                var endDate = dateFunc.changeDay(startDate, 41);

                // 1st day of current month
                var currentDate = dateFunc.getStartDate(this.headDate);

                this.$emit('change',
                    dateFunc.format(startDate, 'yyyy-MM-dd'),
                    dateFunc.format(endDate, 'yyyy-MM-dd'),
                    dateFunc.format(currentDate, 'yyyy-MM-dd'),
                    this.headDate
                )
            }
        },
    };


    //var component =Vue.extend(opts);
    //return component
    return opts;
});