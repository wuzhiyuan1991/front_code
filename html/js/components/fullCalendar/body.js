/**
 * Created by yyt on 2016/11/28.
 */

define(function (require) {
    var dateFunc = require("./dateFunc");
    var template = require("text!./body.html");

    var prefixCls = 'full-calendar-body';


    var opts = {
        template: template,
        props: {
            currentDate: {},
            events: {},
            weekNames: {
                type: Array,
                default: []
            },
            monthNames: {},
            firstDay: {},
            eventDates: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        created: function () {
            this.events.forEach(function (item, index) {
                item._id = item.id || index
                item.end = item.end || item.start
            })
            // this.events = events
        },
        data: function () {
            return {
                // weekNames : DAY_NAMES,
                weekMask: [1, 2, 3, 4, 5, 6, 7],
                // events : [],
                isLismit: true,
                eventLimit: 3,
                showMore: false,
                morePos: {
                    top: 0,
                    left: 0
                },
                selectDay: {},
                lastSelectIndex: -1
                //title      : '',
                //leftArrow  : '<',
                //rightArrow : '>',
                //headDate : new Date()
            }
        },
        watch: {
            weekNames: function (val) {
                // console.log('watch weekNames', val)
            }
        },
        computed: {
            displayDates: function () {
                return this.getCalendar()
            }
        },
        methods: {
            //goPrev :function() {
            //  this.headDate = this.changeMonth(this.headDate, -1)
            //  this.dispatchEvent()
            //},
            //goNext :function() {
            //  this.headDate = this.changeMonth(this.headDate, 1)
            //  this.dispatchEvent()
            //},
            isBegin: function (event, date, index) {
                var st = new Date(event.start)

                if (index == 0 || st.toDateString() == date.toDateString()) {
                    return event.title
                }
                return '　'
            },
            moreTitle: function (date) {
                var dt = new Date(date)
                return this.weekNames[dt.getDay()] + ', ' + this.monthNames[dt.getMonth()] + dt.getDate()
            },
            classNames: function (cssClass) {
                if (!cssClass) return '';
                // string
                if (typeof cssClass == 'string') return cssClass

                // Array
                if (Array.isArray(cssClass)) return cssClass.join(' ')

                // else
                return ''
            },
            getCalendar: function () {
                // calculate 2d-array of each month
                // first day of this month

                this.lastSelectIndex = -1;
                var now = new Date(); // today
                var current = new Date(this.currentDate);

                // 获取当月第一天
                var startDate = dateFunc.getStartDate(current);

                // 获取当月第一天是星期几
                var curWeekDay = startDate.getDay();

                // 获取显示在日历上的第一个位置的日期
                startDate.setDate(startDate.getDate() - curWeekDay + parseInt(this.firstDay));

                var calendar = [];

                // 日历显示六周(一个月最多跨越6个星期)
                for (var perWeek = 0; perWeek < 6; perWeek++) {

                    var week = [];

                    // 每周
                    for (var perDay = 0; perDay < 7; perDay++) {
                        var date = {
                            monthDay: startDate.getDate(),
                            isToday: now.toDateString() === startDate.toDateString(),
                            isCurMonth: startDate.getMonth() === current.getMonth(),
                            weekDay: perDay,
                            date: new Date(startDate),
                            events: this.slotEvents(startDate),
                            hasEvent: this.hasEventDate(startDate),
                            isSelect: false,
                            index: perWeek * 7 + perDay
                        };
                        if(date.isToday && date.isCurMonth) {
                            date.isSelect = true;
                            this.lastSelectIndex = date.index;
                        }
                        week.push(date);

                        startDate.setDate(startDate.getDate() + 1)

                    }
                    calendar.push(week)
                }
                return calendar;
            },
            hasEventDate: function (date) {
                var dateStr = dateFunc.format(date, "yyyy-MM-dd");
                return this.eventDates.indexOf(dateStr) > -1;
            },
            slotEvents: function (date) {

                // find all events start from this date
                var cellIndexArr = []
                var thisDayEvents = this.events.filter(function (day) {
                    var dt = new Date(day.start)
                    var st = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate())
                    var ed = day.end ? new Date(day.end) : st
                    return date >= st && date <= ed
                })

                // sort by duration
                thisDayEvents.sort(function (a, b) {
                    if (!a.cellIndex) return 1
                    if (!b.cellIndex) return -1
                    return a.cellIndex - b.cellIndex
                })

                // mark cellIndex and place holder
                for (var i = 0; i < thisDayEvents.length; i++) {
                    thisDayEvents[i].cellIndex = thisDayEvents[i].cellIndex || (i + 1)
                    thisDayEvents[i].isShow = true
                    if (thisDayEvents[i].cellIndex == i + 1 || i > 2) continue
                    thisDayEvents.splice(i, 0, {
                        title: 'holder',
                        cellIndex: i + 1,
                        start: dateFunc.format(date, 'yyyy-MM-dd'),
                        end: dateFunc.format(date, 'yyyy-MM-dd'),
                        isShow: false
                    })
                }
                return thisDayEvents
            },
            isStart: function (eventDate, date) {
                var st = new Date(eventDate)
                return st.toDateString() === date.toDateString()
            },
            isEnd: function (eventDate, date) {
                var ed = new Date(eventDate)
                return ed.toDateString() === date.toDateString()
            },
            selectThisDay: function (day, jsEvent) {
                this.selectDay = day
                this.showMore = true
                this.morePos = this.computePos(event.target)
                this.morePos.top -= 100
                var events = day.events.filter(function (item) {
                    return item.isShow === true
                })
                this.$emit('moreclick', day.date, events, jsEvent)
            },
            computePos: function (target) {
                var eventRect = target.getBoundingClientRect()
                var pageRect = this.$refs.dates.getBoundingClientRect()
                return {
                    left: eventRect.left - pageRect.left,
                    top: eventRect.top + eventRect.height - pageRect.top
                }
            },
            dayClick: function (day, x, y ,jsEvent) {
                this.lastSelectIndex = 7 * x + y;
                this.$emit('dayclick', day, jsEvent)
            },
            eventClick: function (event, jsEvent) {
                if (!event.isShow) {
                    return
                }
                jsEvent.stopPropagation()
                var pos = this.computePos(jsEvent.target)
                this.$emit('eventclick', event, jsEvent, pos)
            }
        },
        ready: function () {
        }
    };


    //var component = Vue.extend(opts);
    //return component;
    return opts;
});