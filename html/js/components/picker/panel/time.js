/**
 * Created by yyt on 2017/1/4.
 */

define(function(require) {

    var Vue = require("vue");
    var Mixin = require('./mixin');
    var TimeSpinner = require('../base/time-spinner');
    var Confirm = require('../base/confirm');
    var initTimeDate = require('../util').initTimeDate;
    //import TimeSpinner from '../base/time-spinner.vue';
    //import Confirm from '../base/confirm.vue';
    //import Mixin from './mixin';
    //import { initTimeDate } from '../util';

    var template =  '<div :class="[prefixCls + \'-body-wrapper\']"> '+
                    '<div :class="[prefixCls + \'-body\']"> '+
                    ' <div :class="[timePrefixCls + \'-header\']" v-if="showDate">{{ visibleDate }}</div> '+
                    ' <div :class="[prefixCls + \'-content\']"> '+
                    '  <time-spinner '+
                    ' v-ref:time-spinner '+
                    ' :show-seconds="showSeconds" '+
                    ' :hours="hours" '+
                    ' :minutes="minutes" '+
                    ' :seconds="seconds" '+
                    ' :disabled-hours="disabledHours" '+
                    ' :disabled-minutes="disabledMinutes" '+
                    ' :disabled-seconds="disabledSeconds" '+
                    ' :hide-disabled-options="hideDisabledOptions" '+
                    '                 @on-change="handleChange" '+
                    '                 @on-pick-click="handlePickClick"></time-spinner> '+
                    '    </div> '+
                    '     <Confirm '+
                    ' v-if="confirm" '+
                    '  @on-pick-clear="handlePickClear" '+
                    '          @on-pick-success="handlePickSuccess"></Confirm> '+
                    '  </div> '+
                    '  </div>';
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
                date: initTimeDate(),
                value: '',
                showDate: false,
                format: 'HH:mm:ss',
                hours: '',
                minutes: '',
                seconds: '',
                disabledHours: [],
                disabledMinutes: [],
                disabledSeconds: [],
                hideDisabledOptions: false,
                confirm: false
            };
        },
        computed: {
            showSeconds :function() {
                return (this.format || '').indexOf('ss') !== -1;
            },
            visibleDate :function() {
                var date = this.date;
                return [date.getFullYear()]+'年' [date.getMonth() + 1]+'月';
            }
        },
        watch: {
            value :function(newVal) {
                if (!newVal) return;
                newVal = new Date(newVal);
                if (!isNaN(newVal)) {
                    this.date = newVal;
                    this.handleChange({
                        hours: newVal.getHours(),
                        minutes: newVal.getMinutes(),
                        seconds: newVal.getSeconds()
                    }, false);
                }
            }
        },
        methods: {
            handleClear :function() {
                this.date = initTimeDate();
                this.hours = '';
                this.minutes = '';
                this.seconds = '';
            },
            handleChange :function(date,emit) {
                //var  emit = true;
                if(emit  == undefined) {
                    emit = true;
                }
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
                if (emit) this.$emit('on-pick', this.date, true);
            },
            updateScroll :function() {
                this.$refs.timeSpinner.updateScroll();
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