/**
 * Created by yyt on 2017/1/4.
 */

define(function(require) {

    var Vue = require("vue");
    var Mixin = require('./mixin');
    var Icon = require("../../iviewIcon");
    var DateTable = require("../base/date-table");
    var YearTable = require("../base/year-table");
    var MonthTable = require("../base/month-table");
    var TimePicker = require("./time");
    var Confirm = require("../base/confirm");
    var initTimeDate = require("../util").initTimeDate;
    //import Icon from '../../icon/icon.vue';
    //import DateTable from '../base/date-table.vue';
    //import YearTable from '../base/year-table.vue';
    //import MonthTable from '../base/month-table.vue';
    //import TimePicker from './time.vue';
    //import Confirm from '../base/confirm.vue';
    //import Mixin from './mixin';
    //import { initTimeDate } from '../util';

    var template =  '<div :class="classes"> '+
                    ' <div :class="[prefixCls + \'-sidebar\']" v-if="shortcuts.length"> '+
                    ' <div '+
                    ' :class="[prefixCls + \'-shortcut\']" '+
                    ' v-for="shortcut in shortcuts" '+
                    ' @click="handleShortcutClick(shortcut)">{{ shortcut.text }}</div> '+
                    '</div> '+
                    '<div :class="[prefixCls + \'-body\']"> '+
                    '<div :class="[datePrefixCls + \'-header\']" v-show="currentView !== \'time\'"> '+
                    '<span '+
                    ':class="iconBtnCls(\'prev\', \'-double\')" '+
                    '  @click="prevYear"><Icon type="ios-arrow-left"></Icon></span> '+
                    ' <span '+
                    ':class="iconBtnCls(\'prev\')" '+
                    '@click="prevMonth" '+
                    'v-show="currentView === \'date\'"><Icon type="ios-arrow-left"></Icon></span> '+
                    '<span '+
                    ':class="[datePrefixCls + \'-header-label\']" '+
                    '   @click="showYearPicker">{{ yearLabel }}</span> '+
                    ' <span '+
                    ':class="[datePrefixCls + \'-header-label\']" '+
                    '              @click="showMonthPicker" '+
                    'v-show="currentView === \'date\'">{{ month + 1 + \'月\' }}</span> '+
                    '<span '+
                    ':class="iconBtnCls(\'next\', \'-double\')" '+
                    '               @click="nextYear"><Icon type="ios-arrow-right"></Icon></span> '+
                    '   <span '+
                    ':class="iconBtnCls(\'next\')" '+
                    '                @click="nextMonth" '+
                    ' v-show="currentView === \'date\'"><Icon type="ios-arrow-right"></Icon></span> '+
                    ' </div> '+
                    ' <div :class="[prefixCls + \'-content\']"> '+
                    ' <date-table '+
                    ' v-show="currentView === \'date\'" '+
                    ' :year="year" '+
                    ' :month="month" '+
                    ' :date="date" '+
                    ' :value.sync="value" '+
                    ' :selection-mode="selectionMode" '+
                    ':disabled-date="disabledDate" '+
                    '          @on-pick="handleDatePick" '+
                    '             @on-pick-click="handlePickClick"></date-table> '+
                    '   <year-table '+
                    ' v-ref:year-table '+
                    '  v-show="currentView === \'year\'" '+
                    ' :year="year" '+
                    ':date="date" '+
                    ' :selection-mode="selectionMode" '+
                    ':disabled-date="disabledDate" '+
                    '   @on-pick="handleYearPick" '+
                    '    @on-pick-click="handlePickClick"></year-table> '+
                    ' <month-table '+
                    ' v-ref:month-table '+
                    ' v-show="currentView === \'month\'" '+
                    ' :month="month" '+
                    ':date="date" '+
                    ' :selection-mode="selectionMode" '+
                    ' :disabled-date="disabledDate" '+
                    '                 @on-pick="handleMonthPick" '+
                    '                 @on-pick-click="handlePickClick"></month-table> '+
                    '     <time-picker '+
                    '  v-ref:time-picker '+
                    ' show-date '+
                    '  v-show="currentView === \'time\'" '+
                    '              @on-pick="handleTimePick" '+
                    '               @on-pick-click="handlePickClick"></time-picker> '+
                    '    </div> '+
                        '<Confirm '+
                        'v-if="confirm" '+
                        ' :show-time="showTime" '+
                        ':is-time="isTime" '+
                        ' @on-pick-toggle-time="handleToggleTime" '+
                        '@on-pick-clear="handlePickClear" '+
                        '@on-pick-success="handlePickSuccess"></Confirm> '+
                    '</div> '+
                    '</div>';
    var prefixCls = 'ivu-picker-panel';
    var datePrefixCls = 'ivu-date-picker';
    var opts = {
        name: 'DatePicker',
        template : template,
        mixins: [Mixin],
        components: { Icon:Icon, DateTable:DateTable, YearTable:YearTable, MonthTable:MonthTable, TimePicker:TimePicker, Confirm:Confirm },
        data :function() {
            return {
                prefixCls: prefixCls,
                datePrefixCls: datePrefixCls,
                shortcuts: [],
                currentView: 'date',
                date: initTimeDate(),
                value: '',
                showTime: false,
                selectionMode: 'day',
                disabledDate: '',
                year: null,
                month: null,
                confirm: false,
                isTime: false,
                format: 'yyyy-MM-dd'
            };
        },
        computed: {
            classes :function() {
                var obj = {};
                obj[prefixCls + '-with-sidebar'] = this.shortcuts.length;
                return [prefixCls+'-body-wrapper', obj];
            },
            yearLabel :function() {
                var year = this.year;
                if (!year) return '';
                if (this.currentView === 'year') {
                    var startYear = Math.floor(year / 10) * 10;
                    return startYear + this.$t('gb.common.year1') +  '-' + (startYear + 9) + this.$t('gb.common.year1');
                }
                return [year]+this.$t('gb.common.year1');
            }
        },
        watch: {
            value :function(newVal) {
                if (!newVal) return;
                newVal = new Date(newVal);
                if (!isNaN(newVal)) {
                    this.date = newVal;
                    this.year = newVal.getFullYear();
                    this.month = newVal.getMonth();
                }
                if (this.showTime) this.$refs.timePicker.value = newVal;
            },
            date :function(val) {
                if (this.showTime) this.$refs.timePicker.date = val;
            },
            format :function(val) {
                if (this.showTime) this.$refs.timePicker.format = val;
            },
            currentView :function(val) {
                if (val === 'time') this.$refs.timePicker.updateScroll();
            }
        },
        methods: {
            resetDate :function() {
                this.date = new Date(this.date);
            },
            handleClear :function() {
                this.date = new Date();
                this.$emit('on-pick', '');
                if (this.showTime) this.$refs.timePicker.handleClear();
            },
            resetView :function() {
                var reset = false;
                if (this.currentView !== 'time' || reset) {
                    if (this.selectionMode === 'month') {
                        this.currentView = 'month';
                    } else if (this.selectionMode === 'year') {
                        this.currentView = 'year';
                    } else {
                        this.currentView = 'date';
                    }
                }
                this.year = this.date.getFullYear();
                this.month = this.date.getMonth();
            },
            prevYear :function() {
                if (this.currentView === 'year') {
                    this.$refs.yearTable.prevTenYear();
                } else {
                    this.year--;
                    this.date.setFullYear(this.year);
                    this.resetDate();
                }
            },
            nextYear :function() {
                if (this.currentView === 'year') {
                    this.$refs.yearTable.nextTenYear();
                } else {
                    this.year++;
                    this.date.setFullYear(this.year);
                    this.resetDate();
                }
            },
            prevMonth :function() {
                this.month--;
                if (this.month < 0) {
                    this.month = 11;
                    this.year--;
                }
            },
            nextMonth :function() {
                this.month++;
                if (this.month > 11) {
                    this.month = 0;
                    this.year++;
                }
            },
            showYearPicker :function() {
                this.currentView = 'year';
            },
            showMonthPicker :function() {
                this.currentView = 'month';
            },
            handleToggleTime :function() {
                if (this.currentView === 'date') {
                    this.currentView = 'time';
                    this.isTime = true;
                } else if (this.currentView === 'time') {
                    this.currentView = 'date';
                    this.isTime = false;
                }
            },
            handleYearPick :function(year,close) {
                //var close = true;
                if(close  == undefined) {
                    close = true;
                }
                this.year = year;
                if (!close) return;
                this.date.setFullYear(year);
                if (this.selectionMode === 'year') {
                    this.$emit('on-pick', new Date(year, 0, 1));
                } else {
                    this.currentView = 'month';
                }
                this.resetDate();
            },
            handleMonthPick :function(month) {
                this.month = month;
                var selectionMode = this.selectionMode;
                if (selectionMode !== 'month') {
                    this.date.setMonth(month);
                    this.currentView = 'date';
                    this.resetDate();
                } else {
                    this.date.setMonth(month);
                    this.year && this.date.setFullYear(this.year);
                    this.resetDate();
                    var value = new Date(this.date.getFullYear(), month, 1);
                    this.$emit('on-pick', value);
                }
            },
            handleDatePick :function(value) {
                if (this.selectionMode === 'day') {
                    this.$emit('on-pick', new Date(value.getTime()));
                    this.date.setFullYear(value.getFullYear());
                    this.date.setMonth(value.getMonth());
                    this.date.setDate(value.getDate());
                }
                this.resetDate();
            },
            handleTimePick :function(date) {
                this.handleDatePick(date);
            }
        },
        compiled :function() {
            if (this.selectionMode === 'month') {
                this.currentView = 'month';
            }
            if (this.date && !this.year) {
                this.year = this.date.getFullYear();
                this.month = this.date.getMonth();
            }
            if (this.showTime) {
                // todo 这里可能有问题，并不能进入到这里，但不影响正常使用
                this.$refs.timePicker.date = this.date;
                this.$refs.timePicker.value = this.value;
                this.$refs.timePicker.format = this.format;
                this.$refs.timePicker.showDate = true;
            }
        }
    };
    return opts;
//  var component = Vue.extend(opts);
//  return component;

});
