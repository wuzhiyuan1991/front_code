/**
 * Created by yyt on 2017/1/4.
 */

define(function(require) {

    var Vue = require("vue");
    var deepCopy = require('../../utils/assist').deepCopy;
    var getFirstDayOfMonth = require("../util").getFirstDayOfMonth;
    var getDayCountOfMonth = require("../util").getDayCountOfMonth;
    //import { getFirstDayOfMonth, getDayCountOfMonth } from '../util';
    //import { deepCopy } from '../../../utils/assist';
    var template = '<div '+
                    ':class="classes" '+
                    '@click.stop="handleClick" '+
                    '@mousemove="handleMouseMove"> '+
                    '<div :class="[prefixCls + \'-header\']"> '+
                    '<span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span> '+
                    '</div> '+
                    '<span :class="getCellCls(cell)" v-for="cell in readCells"><em :index="$index">{{ cell.text }}</em></span> '+
                    '</div>';

    var prefixCls = 'ivu-date-picker-cells';
    var clearHours = function (time) {
        var cloneDate = new Date(time);
        cloneDate.setHours(0, 0, 0, 0);
        return cloneDate.getTime();
    };
    var opts = {
        template :  template,
        props: {
            date: {},
            year: {},
            month: {},
            selectionMode: {
                default: 'day'
            },
            disabledDate: {},
            minDate: {},
            maxDate: {},
            rangeState: {
                default :function() {
                    return {
                        endDate: null,
                        selecting: false
                    };
                }
            },
            value: ''
        },
        data :function() {
            return {
                prefixCls: prefixCls,
                readCells: []
            };
        },
        watch: {
            'rangeState.endDate' :function(newVal) {
                this.markRange(newVal);
            },
            minDate :function(newVal, oldVal) {
                if (newVal && !oldVal) {
                    this.rangeState.selecting = true;
                    this.markRange(newVal);
                } else if (!newVal) {
                    this.rangeState.selecting = false;
                    this.markRange(newVal);
                } else {
                    this.markRange();
                }
            },
            maxDate :function(newVal, oldVal) {
                if (newVal && !oldVal) {
                    this.rangeState.selecting = false;
                    this.markRange(newVal);
                }
            },
            cells: {
                handler :function(cells) {
                    this.readCells = cells;
                },
                immediate: true
            }
        },
        computed: {
            classes :function() {
                return [prefixCls];
            },
            cells :function() {
                var date = new Date(this.year, this.month, 1);
                var day = getFirstDayOfMonth(date);    // day of first day
                day = (day === 0 ? 7 : day);
                var today = clearHours(new Date());    // timestamp of today
                var selectDay = clearHours(new Date(this.value));    // timestamp of selected day
                var minDay = clearHours(new Date(this.minDate));
                var maxDay = clearHours(new Date(this.maxDate));
                var dateCountOfMonth = getDayCountOfMonth(date.getFullYear(), date.getMonth());
                var dateCountOfLastMonth = getDayCountOfMonth(date.getFullYear(), (date.getMonth() === 0 ? 11 : date.getMonth() - 1));
                var disabledDate = this.disabledDate;
                var cells = [];
                var cell_tmpl = {
                    text: '',
                    type: '',
                    selected: false,
                    disabled: false,
                    range: false,
                    start: false,
                    end: false
                };
                if (day !== 7) {
                    for (var i = 0; i < day; i++) {
                        var cell = deepCopy(cell_tmpl);
                        cell.type = 'prev-month';
                        cell.text = dateCountOfLastMonth - (day - 1) + i;
                        var prevMonth = this.month - 1;
                        var prevYear = this.year;
                        if (this.month === 0) {
                            prevMonth = 11;
                            prevYear -= 1;
                        }
                        var time = clearHours(new Date(prevYear, prevMonth, cell.text));
                        cell.disabled = typeof disabledDate === 'function' && disabledDate(new Date(time));
                        cells.push(cell);
                    }
                }
                for (var i = 1; i <= dateCountOfMonth; i++) {
                    var cell = deepCopy(cell_tmpl);
                    var time = clearHours(new Date(this.year, this.month, i));
                    cell.type = time === today ? 'today' : 'normal';
                    cell.text = i;
                    cell.selected = time === selectDay;
                    cell.disabled = typeof disabledDate === 'function' && disabledDate(new Date(time));
                    cell.range = time >= minDay && time <= maxDay;
                    cell.start = this.minDate && time === minDay;
                    cell.end = this.maxDate && time === maxDay;
                    cells.push(cell);
                }
                var nextMonthCount = 42 - cells.length;
                for (var i = 1; i <= nextMonthCount; i++) {
                    var cell = deepCopy(cell_tmpl);
                    cell.type = 'next-month';
                    cell.text = i;
                    var nextMonth = this.month + 1;
                    var nextYear = this.year;
                    if (this.month === 11) {
                        nextMonth = 0;
                        nextYear += 1;
                    }
                    var time = clearHours(new Date(nextYear, nextMonth, cell.text));
                    cell.disabled = typeof disabledDate === 'function' && disabledDate(new Date(time));
                    cells.push(cell);
                }
                return cells;
            }
        },
        methods: {
            getDateOfCell: function (cell) {
                var year = this.year;
                var month = this.month;
                var day = cell.text;
                var date = this.date;
                var hours = date.getHours();
                var minutes = date.getMinutes();
                var seconds = date.getSeconds();
                if (cell.type === 'prev-month') {
                    if (month === 0) {
                        month = 11;
                        year--;
                    } else {
                        month--;
                    }
                } else if (cell.type === 'next-month') {
                    if (month === 11) {
                        month = 0;
                        year++;
                    } else {
                        month++;
                    }
                }
                return new Date(year, month, day, hours, minutes, seconds);
            },
            handleClick: function (event) {
                var target = event.target;
                if (target.tagName === 'EM') {
                    var cell = this.cells[parseInt(event.target.getAttribute('index'))];
                    if (cell.disabled) return;
                    var newDate = this.getDateOfCell(cell);
                    if (this.selectionMode === 'range') {
                        if (this.minDate && this.maxDate) {
                            var minDate = new Date(newDate.getTime());
                            var maxDate = null;
                            this.rangeState.selecting = true;
                            this.markRange(this.minDate);
                            this.$emit('on-pick', {minDate: minDate, maxDate: maxDate}, false);
                        } else if (this.minDate && !this.maxDate) {
                            if (newDate >= this.minDate) {
                                var maxDate = new Date(newDate.getTime());
                                this.rangeState.selecting = false;
                                this.$emit('on-pick', {minDate: this.minDate, maxDate: maxDate});
                            } else {
                                var minDate = new Date(newDate.getTime());
                                this.$emit('on-pick', {minDate: minDate, maxDate: this.maxDate}, false);
                            }
                        } else if (!this.minDate) {
                            var minDate = new Date(newDate.getTime());
                            this.rangeState.selecting = true;
                            this.markRange(this.minDate);
                            this.$emit('on-pick', {minDate: minDate, maxDate: this.maxDate}, false);
                        }
                    } else {
                        this.$emit('on-pick', newDate);
                    }
                }
                this.$emit('on-pick-click');
            },
            handleMouseMove: function (event) {
                if (!this.rangeState.selecting) return;
                this.$emit('on-changerange', {
                    minDate: this.minDate,
                    maxDate: this.maxDate,
                    rangeState: this.rangeState
                });
                var target = event.target;
                if (target.tagName === 'EM') {
                    var cell = this.cells[parseInt(event.target.getAttribute('index'))];
//                    if (cell.disabled) return;    // todo 待确定
                    this.rangeState.endDate = this.getDateOfCell(cell);
                }
            },
            markRange: function (maxDate) {
                var minDate = this.minDate;
                var _this = this;
                if (!maxDate) maxDate = this.maxDate;
                var minDay = clearHours(new Date(minDate));
                var maxDay = clearHours(new Date(maxDate));
                this.cells.forEach(function (cell) {
                    if (cell.type === 'today' || cell.type === 'normal') {
                        var time = clearHours(new Date(_this.year, _this.month, cell.text));
                        cell.range = time >= minDay && time <= maxDay;
                        cell.start = minDate && time === minDay;
                        cell.end = maxDate && time === maxDay;
                    }
                });
            },
            getCellCls: function (cell) {
                var obj = {};
                obj[prefixCls + '-cell-selected'] = cell.selected || cell.start || cell.end;
                obj[prefixCls + '-cell-disabled'] = cell.disabled;
                obj[prefixCls + '-cell-today'] = cell.type === 'today';
                obj[prefixCls + '-cell-prev-month'] = cell.type === 'prev-month';
                obj[prefixCls + '-cell-next-month'] = cell.type === 'next-month';
                obj[prefixCls + '-cell-range'] = cell.range && !cell.start && !cell.end;
                return [prefixCls + '-cell', obj];
                //return [
                //    `${prefixCls}-cell`,
                //    {
                //        [`${prefixCls}-cell-selected`]: cell.selected || cell.start || cell.end,
                //        [`${prefixCls}-cell-disabled`]: cell.disabled,
                //        [`${prefixCls}-cell-today`]: cell.type === 'today',
                //        [`${prefixCls}-cell-prev-month`]: cell.type === 'prev-month',
                //        [`${prefixCls}-cell-next-month`]: cell.type === 'next-month',
                //        [`${prefixCls}-cell-range`]: cell.range && !cell.start && !cell.end
                //    }
                //];
            },
        }
    };

    var component = Vue.extend(opts);
    return component;

});