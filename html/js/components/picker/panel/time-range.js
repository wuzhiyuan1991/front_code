/**
 * Created by yyt on 2017/1/4.
 */

define(function(require) {

    var Vue = require("vue");
    var Mixin = require('./mixin');
    var TimeSpinner = require('../base/time-spinner');
    var Confirm = require('../base/confirm');
    var initTimeDate = require('../util').initTimeDate;
    var toDate = require('../util').toDate;
    var formatDate = require('../util').formatDate;
    //import TimeSpinner from '../base/time-spinner.vue';
    //import Confirm from '../base/confirm.vue';
    //import Mixin from './mixin';
    //import { initTimeDate, toDate, formatDate } from '../util';

    var template =  '<div :class="classes"> '+
                    ' <div :class="[prefixCls + \'-body\']"> '+
                    ' <div :class="[prefixCls + \'-content\', prefixCls + \'-content-left\']"> '+
                    ' <div :class="[timePrefixCls + \'-header\']"> '+
                    ' <template v-if="showDate">{{ visibleDate }}</template> '+
                    '<template v-else>开始时间</template> '+
                    '</div> '+
                    ' <time-spinner '+
                    ' v-ref:time-spinner '+
                    ' :show-seconds="showSeconds" '+
                    ' :hours="hours" '+
                    ' :minutes="minutes" '+
                    ' :seconds="seconds" '+
                    ':disabled-hours="disabledHours" '+
                    ':disabled-minutes="disabledMinutes" '+
                    ' :disabled-seconds="disabledSeconds" '+
                    ' :hide-disabled-options="hideDisabledOptions" '+
                    '  @on-change="handleStartChange" '+
                    '  @on-pick-click="handlePickClick"></time-spinner> '+
                    '     </div> '+
                    '    <div :class="[prefixCls + \'-content\', prefixCls + \'-content-right\']"> '+
                    '   <div :class="[timePrefixCls + \'-header\']"> '+
                    '  <template v-if="showDate">{{ visibleDateEnd }}</template> '+
                    '<template v-else>结束时间</template> '+
                    '</div> '+
                    '<time-spinner '+
                    'v-ref:time-spinner-end '+
                    ':show-seconds="showSeconds" '+
                    ':hours="hoursEnd" '+
                    ':minutes="minutesEnd" '+
                    ':seconds="secondsEnd" '+
                    ':disabled-hours="disabledHours" '+
                    ':disabled-minutes="disabledMinutes" '+
                    ':disabled-seconds="disabledSeconds" '+
                    ':hide-disabled-options="hideDisabledOptions" '+
                    ' @on-change="handleEndChange" '+
                    ' @on-pick-click="handlePickClick"></time-spinner> '+
                    ' </div> '+
                    '<Confirm '+
                    'v-if="confirm" '+
                    ' @on-pick-clear="handlePickClear" '+
                    ' @on-pick-success="handlePickSuccess"></Confirm> '+
                    ' </div> '+
                    ' </div>';
    var prefixCls = 'ivu-picker-panel';
    var timePrefixCls = 'ivu-time-picker';
    var opts = {
        template :  template,
        mixins: [Mixin],
        components: { TimeSpinner:TimeSpinner, Confirm:Confirm },
        data :function() {
            return {
                prefixCls: prefixCls,
                timePrefixCls: timePrefixCls,
                format: 'HH:mm:ss',
                showDate: false,
                date: initTimeDate(),
                dateEnd: initTimeDate(),
                value: '',
                hours: '',
                minutes: '',
                seconds: '',
                hoursEnd: '',
                minutesEnd: '',
                secondsEnd: '',
                disabledHours: [],
                disabledMinutes: [],
                disabledSeconds: [],
                hideDisabledOptions: false,
                confirm: false
            };
        },
        computed: {
            classes :function() {
                var opt = {};
                opt[timePrefixCls + '-with-seconds'] = this.showSeconds;
                return [prefixCls+'-body-wrapper',timePrefixCls+'-with-range', opt];
            },
                //return [
                //    `${prefixCls}-body-wrapper`,
                //    `${timePrefixCls}-with-range`,
                //    {
                //        [`${timePrefixCls}-with-seconds`]: this.showSeconds
                //    }
                //];
            showSeconds :function() {
                return (this.format || '').indexOf('ss') !== -1;
            },
            visibleDate :function() {
                var date = this.date || initTimeDate();
                return [date.getFullYear()]+'年' [date.getMonth() + 1]+'月';
            },
            visibleDateEnd :function(){
                var date = this.dateEnd || initTimeDate();
                return [date.getFullYear()]+'年' [date.getMonth() + 1]+'月';
            }
        },
        watch: {
            value :function(newVal) {
                if (!newVal) return;
                if (Array.isArray(newVal)) {
                    var valStart = newVal[0] ? toDate(newVal[0]) : false;
                    var valEnd = newVal[1] ? toDate(newVal[1]) : false;
                    if (valStart && valEnd) {
                        this.handleChange(
                            {
                                hours: valStart.getHours(),
                                minutes: valStart.getMinutes(),
                                seconds: valStart.getSeconds()
                            },
                            {
                                hours: valEnd.getHours(),
                                minutes: valEnd.getMinutes(),
                                seconds: valEnd.getSeconds()
                            },
                            false
                        );
                    }
                }
            }
        },
        methods: {
            handleClear :function() {
                this.date = initTimeDate();
                this.dateEnd = initTimeDate();
                this.hours = '';
                this.minutes = '';
                this.seconds = '';
                this.hoursEnd = '';
                this.minutesEnd = '';
                this.secondsEnd = '';
            },
            handleChange :function(date, dateEnd,emit) {
                //var emit = true;
                if(emit  == undefined) {
                    emit = true;
                }
                var oldDateEnd = new Date(this.dateEnd);
                if (date.hours !== undefined) {
                    this.date.setHours(date.hours);
                    this.hours = this.date.getHours();
                }
                if (date.minutes !== undefined) {
                    this.date.setMinutes(date.minutes);
                    this.minutes = this.date.getMinutes();
                }
                if (date.seconds !== undefined) {
                    this.date.setSeconds(date.seconds);
                    this.seconds = this.date.getSeconds();
                }
                if (dateEnd.hours !== undefined) {
                    this.dateEnd.setHours(dateEnd.hours);
                    this.hoursEnd = this.dateEnd.getHours();
                }
                if (dateEnd.minutes !== undefined) {
                    this.dateEnd.setMinutes(dateEnd.minutes);
                    this.minutesEnd = this.dateEnd.getMinutes();
                }
                if (dateEnd.seconds !== undefined) {
                    this.dateEnd.setSeconds(dateEnd.seconds);
                    this.secondsEnd = this.dateEnd.getSeconds();
                }
                // judge endTime > startTime?
                if (this.dateEnd < this.date) {
                    this.$nextTick(function(){
                        this.dateEnd = new Date(this.date);
                    this.hoursEnd = this.dateEnd.getHours();
                    this.minutesEnd = this.dateEnd.getMinutes();
                    this.secondsEnd = this.dateEnd.getSeconds();
                    var format = 'yyyy-MM-dd HH:mm:ss';
                    if (formatDate(oldDateEnd, format) !== formatDate(this.dateEnd, format)) {
                        if (emit) this.$emit('on-pick', [this.date, this.dateEnd], true);
                    }
                });
                } else {
                    if (emit) this.$emit('on-pick', [this.date, this.dateEnd], true);
                }
            },
            handleStartChange :function(date) {
                this.handleChange(date, {});
            },
            handleEndChange :function(date) {
                this.handleChange({}, date);
            },
            updateScroll :function() {
                this.$refs.timeSpinner.updateScroll();
                this.$refs.timeSpinnerEnd.updateScroll();
            }
        },
        compiled :function() {
            if (this.$parent && this.$parent.$options.name === 'DatePicker') this.showDate = true;
        }
    };

    return opts;
//    var component = Vue.extend(opts);
//    return component;

});