/**
 * Created by yyt on 2016/11/28.
 */

define(function (require) {

    var Vue = require("vue");
    var langSets = require('./langSets');
    var dateFunc = require("./dateFunc");

    var template = '<div class="comp-full-calendar"> ' +
        '<!-- header pick month --> ' +
        '<fc-header v-if="showHeader" :first-day="firstDay" :current-date="currentDate" :title-format="titleFormat" ' +
        '@change="emitChangeMonth"> ' +
        '<div slot="header-right"> ' +
        '<slot name="fc-header-right"> ' +
        '</slot> ' +
        '</div> ' +
        '</fc-header> ' +
        //'<div class="Go"><span class="prev-month" @click.stop="goPrev">{{leftArrow}}</span> '+
        //'<span class="next-month" @click.stop="goNext">{{rightArrow}}</span></div>'+
        '<!-- body display date day and events --> ' +
        '<fc-body :current-date="currentDate" :events="events" :event-dates="eventDates" :month-names="monthNames" ' +
        ':week-names="weekNames" :first-day="firstDay" ' +
        '@eventclick="emitEventClick" @dayclick="emitDayClick" ' +
        '@moreclick="emitMoreClick"> ' +
        '<div slot="body-card"> ' +
        '<slot name="fc-body-card"> ' +
        '</slot> ' +
        '</div> ' +
        '</fc-body> ' +
        '</div> ';


    var prefixCls = 'ivu-calendar';


    var opts = {
        template: template,
        components: {
            'fcBody': require('./body'),
            'fcHeader': require('./header')
        },
        props: {
            events: { // events will be displayed on calendar
                type: Array,
                default: function () {
                    return [];
                }
            },
            lang: {
                type: String,
                default: 'zh'
            },
            firstDay: {
                type: Number | String,
                coerce: function (val) {
                    var res = parseInt(val)
                    if (res < 0 || res > 6) return 0
                    return res
                },
                default: 0
            },
            titleFormat: {
                type: String,
                default: function () {
                    return langSets[this.lang].titleFormat
                }
            },
            monthNames: {
                type: Array,
                default: function () {
                    return langSets[this.lang].monthNames
                }
            },
            weekNames: {
                type: Array,
                default: function () {
                    var arr = langSets[this.lang].weekNames
                    return arr.slice(this.firstDay).concat(arr.slice(0, this.firstDay))
                }
            },
            showHeader: {
                type: Boolean,
                default: true
            },
            eventDates: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        data: function () {
            return {
                leftArrow: '<',
                rightArrow: '>',
                currentDate: new Date(),
                headDate: new Date()
            }
        },
        watch: {
            currentDate: function (val) {
                if (!val) return
                this.headDate = val
                // this.headDate = JSON.parse(JSON.stringify(val))
            }
        },
        methods: {
            emitChangeMonth: function (start, end, currentStart, current) {
                this.currentDate = current
                this.$emit('change-month', start, end, currentStart)
            },
            emitEventClick: function (event, jsEvent, pos) {
                this.$emit('event-click', event, jsEvent, pos)
            },
            emitDayClick: function (day, jsEvent) {
                this.$emit('day-click', day, jsEvent)
                //console.log('dayClick', day, jsEvent)
            },
            emitMoreClick: function (day, events, jsEvent) {
                this.$emit('more-click', day, event, jsEvent)
            }
        },

    };


    var component = Vue.extend(opts);
    Vue.component('full-calendar', component);
});