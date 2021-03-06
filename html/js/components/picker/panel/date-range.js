/**
 * Created by yyt on 2017/1/4.
 */

/**
 * Created by yyt on 2017/1/4.
 */

define(function(require) {

    var Vue = require("vue");
    var Icon = require("../../iviewIcon");
    var DateTable = require("../base/date-table");
    var YearTable = require("../base/year-table");
    var MonthTable = require("../base/month-table");
    var TimePicker = require("./time-range");
    var Confirm = require("../base/confirm");
    var toDate = require("../util").toDate;
    var prevMonth = require("../util").prevMonth;
    var nextMonth = require("../util").nextMonth;
    var initTimeDate = require("../util").initTimeDate;
    var Mixin = require('./mixin');
    var lang = require("../../utils/lang")
    //import Icon from '../../icon/icon.vue';
    //import DateTable from '../base/date-table.vue';
    //import YearTable from '../base/year-table.vue';
    //import MonthTable from '../base/month-table.vue';
    //import TimePicker from './time-range.vue';
    //import Confirm from '../base/confirm.vue';
    //import { toDate, prevMonth, nextMonth, initTimeDate } from '../util';
    //import Mixin from './mixin';

    var template =  '<div :class="classes"> '+
                    ' <div :class="[prefixCls +\'-sidebar\']" v-if="shortcuts.length"> '+
                    ' <div '+
                    '  :class="[prefixCls + \'-shortcut\']" '+
                    ' v-for="shortcut in shortcuts" '+
                    '  @click="handleShortcutClick(shortcut)">{{ shortcut.text }}</div> '+
                    ' </div> '+
                    '<div :class="[prefixCls + \'-body\']"> '+
                    ' <div :class="[prefixCls + \'-content\', prefixCls + \'-content-left\']" v-show="!isTime"> '+
                    ' <div :class="[datePrefixCls + \'-header\']" v-show="leftCurrentView !== \'time\'"> '+
                    '  <span '+
                    ' :class="iconBtnCls(\'prev\', \'-double\')" '+
                    '                   @click="prevYear(\'left\')"><Icon type="ios-arrow-left"></Icon></span> '+
                    '  <span '+
                    '  :class="iconBtnCls(\'prev\')" '+
                    '                   @click="prevMonth" '+
                    ' v-show="leftCurrentView === \'date\'"><Icon type="ios-arrow-left"></Icon></span> '+
                    '  <span '+
                    ' :class="[datePrefixCls + \'-header-label\']" '+
                    '         @click="showYearPicker(\'left\')">{{ leftYearLabel }}</span> '+
                    ' <span '+
                    ' :class="[datePrefixCls + \'-header-label\']" '+
                    '  @click="showMonthPicker(\'left\')" '+
                    ' v-show="leftCurrentView === \'date\'">{{ leftMonth + 1 }} '+lang("gb.common.month1")+'</span> '+
                    ' <span '+
                    ' :class="iconBtnCls(\'next\', \'-double\')" '+
                    '                     @click="nextYear(\'left\')" '+
                    ' v-show="leftCurrentView === \'year\' || leftCurrentView === \'month\'"><Icon type="ios-arrow-right"></Icon></span> '+
                    '   </div> '+
                    '   <date-table '+
                    ' v-show="leftCurrentView === \'date\'" '+
                    ' :year="leftYear" '+
                    ' :month="leftMonth" '+
                    ' :date="date" '+
                    ' :min-date="minDate" '+
                    ' :max-date="maxDate" '+
                    ' :range-state="rangeState" '+
                    '  selection-mode="range" '+
                    ' :disabled-date="disabledDate" '+
                    '                 @on-changerange="handleChangeRange" '+
                    '                @on-pick="handleRangePick" '+
                    '                @on-pick-click="handlePickClick"></date-table> '+
                    '     <year-table '+
                    '  v-ref:left-year-table '+
                    ' v-show="leftCurrentView === \'year\'" '+
                    ' :year="leftTableYear" '+
                    ' :date="leftTableDate" '+
                    ' selection-mode="range" '+
                    ' :disabled-date="disabledDate" '+
                    '              @on-pick="handleLeftYearPick" '+
                    '             @on-pick-click="handlePickClick"></year-table> '+
                    ' <month-table '+
                    '  v-ref:left-month-table '+
                    ' v-show="leftCurrentView === \'month\'" '+
                    ' :month="leftMonth" '+
                    ' :date="leftTableDate" '+
                    ' selection-mode="range" '+
                    ' :disabled-date="disabledDate" '+
                    '                @on-pick="handleLeftMonthPick" '+
                    '                 @on-pick-click="handlePickClick"></month-table> '+
                    '    </div> '+
                    '     <div :class="[prefixCls + \'-content\', prefixCls + \'-content-right\']" v-show="!isTime"> '+
                    '    <div :class="[datePrefixCls + \'-header\']" v-show="rightCurrentView !== \'time\'"> '+
                    '    <span '+
                    ' :class="iconBtnCls(\'prev\', \'-double\')" '+
                    '                    @click="prevYear(\'right\')" '+
                    ' v-show="rightCurrentView === \'year\' || rightCurrentView === \'month\'"><Icon type="ios-arrow-left"></Icon></span> '+
                    '     <span '+
                    ' :class="[datePrefixCls + \'-header-label\']" '+
                    '                   @click="showYearPicker(\'right\')">{{ rightYearLabel }}</span> '+
                    ' <span '+
                    '   :class="[datePrefixCls + \'-header-label\']" '+
                    '                   @click="showMonthPicker(\'right\')" '+
                    '  v-show="rightCurrentView === \'date\'">{{ rightMonth + 1 }} '+lang("gb.common.month1")+'</span> '+
                    ' <span '+
                    ' :class="iconBtnCls(\'next\', \'-double\')" '+
                    '                   @click="nextYear(\'right\')"><Icon type="ios-arrow-right"></Icon></span> '+
                    '   <span '+
                    ' :class="iconBtnCls(\'next\')" '+
                    '                   @click="nextMonth" '+
                    ' v-show="rightCurrentView === \'date\'"><Icon type="ios-arrow-right"></Icon></span> '+
                    '   </div> '+
                    '   <date-table '+
                    ' v-show="rightCurrentView === \'date\'" '+
                    ' :year="rightYear" '+
                    ' :month="rightMonth" '+
                    ' :date="rightDate" '+
                    ' :min-date="minDate" '+
                    ' :max-date="maxDate" '+
                    ' :range-state="rangeState" '+
                    ' selection-mode="range" '+
                    ' :disabled-date="disabledDate" '+
                    '               @on-changerange="handleChangeRange" '+
                    '               @on-pick="handleRangePick" '+
                    '               @on-pick-click="handlePickClick"></date-table> '+
                    '   <year-table '+
                    ' v-ref:right-year-table '+
                    ' v-show="rightCurrentView === \'year\'" '+
                    ' :year="rightTableYear" '+
                    ' :date="rightTableDate" '+
                    ' selection-mode="range" '+
                    ' :disabled-date="disabledDate" '+
                    '               @on-pick="handleRightYearPick" '+
                    '               @on-pick-click="handlePickClick"></year-table> '+
                    '   <month-table '+
                    ' v-ref:right-month-table '+
                    ' v-show="rightCurrentView === \'month\'" '+
                    ' :month="rightMonth" '+
                    ' :date="rightTableDate" '+
                    ' selection-mode="range" '+
                    ' :disabled-date="disabledDate" '+
                    '               @on-pick="handleRightMonthPick" '+
                    '               @on-pick-click="handlePickClick"></month-table> '+
                    '   </div> '+
                    '   <div :class="[prefixCls + \'-content\']" v-show="isTime"> '+
                    '   <time-picker '+
                    ' v-ref:time-picker '+
                    ' v-show="isTime" '+
                    '               @on-pick="handleTimePick" '+
                    '               @on-pick-click="handlePickClick"></time-picker> '+
                    '   </div> '+
                    '   <Confirm '+
                    ' v-if="confirm" '+
                    '   :show-time="showTime" '+
                    ' :is-time="isTime" '+
                    ' :time-disabled="timeDisabled" '+
                    '           @on-pick-toggle-time="handleToggleTime" '+
                    '           @on-pick-clear="handlePickClear" '+
                    '           @on-pick-success="handlePickSuccess"></Confirm> '+
                    '   </div> '+
                    '   </div>';
    var prefixCls = 'ivu-picker-panel';
    var datePrefixCls = 'ivu-date-picker';
    var opts = {
        template :  template,
        name: 'DatePicker',
        mixins: [Mixin],
        components: { Icon:Icon, DateTable:DateTable, YearTable:YearTable, MonthTable:MonthTable, TimePicker:TimePicker, Confirm:Confirm },
        data :function() {
            return {
                prefixCls: prefixCls,
                datePrefixCls: datePrefixCls,
                shortcuts: [],
                date: initTimeDate(),
                value: '',
                minDate: '',
                maxDate: '',
                confirm: false,
                rangeState: {
                    endDate: null,
                    selecting: false
                },
                showTime: false,
                disabledDate: '',
                leftCurrentView: 'date',
                rightCurrentView: 'date',
                selectionMode: 'range',
                leftTableYear: null,
                rightTableYear: null,
                isTime: false,
                format: 'yyyy-MM-dd'
            };
        },
        computed: {
            classes :function() {
                var obj = {};
                obj[prefixCls + '-with-sidebar'] = this.shortcuts.length;
                return [prefixCls+'-body-wrapper',datePrefixCls+'-with-range', obj];
                //return [
                //    `${prefixCls}-body-wrapper`,
                //    `${datePrefixCls}-with-range`,
                //    {
                //        [`${prefixCls}-with-sidebar`]: this.shortcuts.length
                //    }
                //];
            },
            leftYear :function() {
                return this.date.getFullYear();
            },
            leftTableDate :function() {
                if (this.leftCurrentView === 'year' || this.leftCurrentView === 'month') {
                    return new Date(this.leftTableYear);
                } else {
                    return this.date;
                }
            },
            leftYearLabel :function() {
                if (this.leftCurrentView === 'year') {
                    var year = this.leftTableYear;
                    if (!year) return '';
                    var startYear = Math.floor(year / 10) * 10;
                    return startYear + this.$t('gb.common.year1') +'-'+ (startYear + 9) + this.$t('gb.common.year1');
                } else {
                    var year = this.leftCurrentView === 'month' ? this.leftTableYear : this.leftYear;
                    if (!year) return '';
                    return year+this.$t('gb.common.year1');
                }
            },
            leftMonth :function() {
                return this.date.getMonth();
            },
            rightYear :function() {
                return this.rightDate.getFullYear();
            },
            rightTableDate :function() {
                if (this.rightCurrentView === 'year' || this.rightCurrentView === 'month') {
                    return new Date(this.rightTableYear);
                } else {
                    return this.date;
                }
            },
            rightYearLabel :function() {
                if (this.rightCurrentView === 'year') {
                    var year = this.rightTableYear;
                    if (!year) return '';
                    var startYear = Math.floor(year / 10) * 10;
                    //return `${startYear}年 - ${startYear + 9}年`;
                    return startYear + this.$t('gb.common.year1') +'-'+ (startYear + 9) + this.$t('gb.common.year1');
                } else {
                    var year = this.rightCurrentView === 'month' ? this.rightTableYear : this.rightYear;
                    if (!year) return '';
                    return year+this.$t('gb.common.year1');
                }
            },
            rightMonth :function() {
                return this.rightDate.getMonth();
            },
            rightDate :function() {
                var newDate = new Date(this.date);
                var month = newDate.getMonth();
                newDate.setDate(1);
                if (month === 11) {
                    newDate.setFullYear(newDate.getFullYear() + 1);
                    newDate.setMonth(0);
                } else {
                    newDate.setMonth(month + 1);
                }
                return newDate;
            },
            timeDisabled :function() {
                return !(this.minDate && this.maxDate);
            }
        },
        watch: {
            value :function(newVal) {
                if (!newVal) {
                    this.minDate = null;
                    this.maxDate = null;
                } else if (Array.isArray(newVal)) {
                    this.minDate = newVal[0] ? toDate(newVal[0]) : null;
                    this.maxDate = newVal[1] ? toDate(newVal[1]) : null;
                    if (this.minDate) this.date = new Date(this.minDate);
                }
                if (this.showTime) this.$refs.timePicker.value = newVal;
            },
            minDate :function(val) {
                if (this.showTime) this.$refs.timePicker.date = val;
            },
            maxDate :function(val) {
                if (this.showTime) this.$refs.timePicker.dateEnd = val;
            },
            format :function(val) {
                if (this.showTime) this.$refs.timePicker.format = val;
            },
            isTime :function(val) {
                if (val) this.$refs.timePicker.updateScroll();
            }
        },
        methods: {
            resetDate :function() {
                this.date = new Date(this.date);
                this.leftTableYear = this.date.getFullYear();
                this.rightTableYear = this.rightDate.getFullYear();
            },
            handleClear :function() {
                this.minDate = null;
                this.maxDate = null;
                this.date = new Date();
                this.handleConfirm();
                if (this.showTime) this.$refs.timePicker.handleClear();
            },
            resetView :function() {
                var reset = false;
                this.leftCurrentView = 'date';
                this.rightCurrentView = 'date';
                this.leftTableYear = this.leftYear;
                this.rightTableYear = this.rightYear;
                if (reset) this.isTime = false;
            },
            prevYear :function(direction) {
                if (this[direction+'CurrentView'] === 'year') {
                    this.$refs[direction+'YearTable'].prevTenYear();
                } else if (this[direction+'CurrentView'] === 'month') {
                    this[direction+'TableYear']--;
                } else {
                    var date = this.date;
                    date.setFullYear(date.getFullYear() - 1);
                    this.resetDate();
                }
            },
            nextYear :function(direction) { 
                //if (this[`${direction}CurrentView`] === 'year') {
                //    this.$refs[`${direction}YearTable`].nextTenYear();
                //} else if (this[`${direction}CurrentView`] === 'month') {
                //    this[`${direction}TableYear`]--;
                if (this[direction+'CurrentView'] === 'year') {
                    this.$refs[direction+'YearTable'].nextTenYear();
                } else if (this[direction+'CurrentView'] === 'month') {
                    this[direction+'TableYear']++;
                } else {
                    var date = this.date;
                    date.setFullYear(date.getFullYear() + 1);
                    this.resetDate();
                }
            },
            prevMonth :function() {
                this.date = prevMonth(this.date);
            },
            nextMonth :function() {
                this.date = nextMonth(this.date);
            },
            handleLeftYearPick :function(year) {
                if(close  == undefined) {
                	close = true;
                }
                this.handleYearPick(year, close, 'left');
            },
            handleRightYearPick :function(year, close) {
                if(close  == undefined) {
                	close = true;
                }
                this.handleYearPick(year, close, 'right');
            },
            handleYearPick :function(year, close, direction) {
                this[direction+'TableYear'] = year;
                if (!close) return;
                this[direction+'CurrentView'] = 'month';
            },
            handleLeftMonthPick :function(month) {
                this.handleMonthPick(month, 'left');
            },
            handleRightMonthPick :function(month) {
                this.handleMonthPick(month, 'right');
            },
            handleMonthPick :function(month, direction) {
                var year = this[direction+'TableYear'];
                if (direction === 'right') {
                    if (month === 0) {
                        month = 11;
                        year--;
                    } else {
                        month--;
                    }
                }
                this.date.setYear(year);
                this.date.setMonth(month);
                this[direction+'CurrentView'] = 'date';
                this.resetDate();
            },
            showYearPicker :function(direction) { 
                this[direction+'CurrentView'] = 'year';
                this[direction+'TableYear'] = this[direction+'Year'];
            },
            showMonthPicker :function(direction) {
                this[direction+'CurrentView'] = 'month';
            },
            handleConfirm :function(visible) {
                this.$emit('on-pick', [this.minDate, this.maxDate], visible);
            },
            handleRangePick :function(val, close) {
                if(close == undefined) {
                    close = true;
                }
                if (this.maxDate === val.maxDate && this.minDate === val.minDate) return;
                this.minDate = val.minDate;
                this.maxDate = val.maxDate;
                if (!close) return;
//                if (!this.showTime) {
//                    this.handleConfirm(false);
//                }
                this.handleConfirm(false);
            },
            handleChangeRange :function(val) {
                this.minDate = val.minDate;
                this.maxDate = val.maxDate;
                this.rangeState = val.rangeState;
            },
            handleToggleTime :function() {
                this.isTime = !this.isTime;
            },
            handleTimePick :function(date) {
                this.minDate = date[0];
                this.maxDate = date[1];
                this.handleConfirm(false);
            }
        },
        compiled :function() {
            if (this.showTime) {
                // todo 这里也到不了
                this.$refs.timePicker.date = this.minDate;
                this.$refs.timePicker.dateEnd = this.maxDate;
                this.$refs.timePicker.value = this.value;
                this.$refs.timePicker.format = this.format;
                this.$refs.timePicker.showDate = true;
            }
        }
    };

    return opts;
//    var component = Vue.extend(opts);
//    return component;

});
