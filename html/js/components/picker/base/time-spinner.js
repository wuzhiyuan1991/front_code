/**
 * Created by yyt on 2017/1/4.
 */

define(function(require) {

    var Vue = require("vue");
    var deepCopy = require('../../utils/assist').deepCopy;
    var scrollTop = require('../../utils/assist').scrollTop;
    var firstUpperCase = require('../../utils/assist').firstUpperCase;
    var Options = require("../time-mixins");
    //import Options from '../time-mixins';
    //import { deepCopy, scrollTop, firstUpperCase } from '../../../utils/assist';
    var template =  '<div :class="classes"> '+
                    '<div :class="[prefixCls+ \'-list\']" v-el:hours> '+
                    '<ul :class="[prefixCls + \'-ul\']" @click.stop="handleClickHours"> '+
                    ' <li :class="getCellCls(item)" v-for="item in hoursList" v-show="!item.hide" :index="$index">{{ formatTime(item.text) }}</li> '+
                    '</ul> '+
                    '</div> '+
                    '<div :class="[prefixCls+ \'-list\']" v-el:minutes> '+
                    '<ul :class="[prefixCls + \'-ul\']" @click.stop="handleClickMinutes"> '+
                    '<li :class="getCellCls(item)" v-for="item in minutesList" v-show="!item.hide" :index="$index">{{ formatTime(item.text) }}</li> '+
                    '</ul> '+
                    '</div> '+
                    '<div :class="[prefixCls+ \'-list\']" v-show="showSeconds" v-el:seconds> '+
                    '<ul :class="[prefixCls + \'-ul\']" @click.stop="handleClickSeconds"> '+
                    '<li :class="getCellCls(item)" v-for="item in secondsList" v-show="!item.hide" :index="$index">{{ formatTime(item.text) }}</li> '+
                    '</ul> '+
                    '</div> '+
                    '</div>';
    var prefixCls = 'ivu-time-picker-cells';
    var opts = {
        template :  template,
        mixins: [Options],
        props: {
            hours: {
                type: [Number, String],
                default: 0
            },
            minutes: {
                type: [Number, String],
                default: 0
            },
            seconds: {
                type: [Number, String],
                default: 0
            },
            showSeconds: {
                type: Boolean,
                default: true
            }
        },
        data :function() {
            return {
                prefixCls: prefixCls,
                compiled: false
            };
        },
        computed: {
            classes :function() {
                var obj = {};
                obj[prefixCls + '-with-seconds'] = this.showSeconds;
                return [prefixCls, obj];
                //return [
                //    `${prefixCls}`,
                //    {
                //        [`${prefixCls}-with-seconds`]: this.showSeconds
                //    }
                //];
            },
            hoursList :function() {
                var hours = [];
                var hour_tmpl = {
                    text: 0,
                    selected: false,
                    disabled: false,
                    hide: false
                };
                for (var i = 0; i < 24; i++) {
                    var hour = deepCopy(hour_tmpl);
                    hour.text = i;
                    if (this.disabledHours.length && this.disabledHours.indexOf(i) > -1) {
                        hour.disabled = true;
                        if (this.hideDisabledOptions) hour.hide = true;
                    }
                    if (this.hours === i) hour.selected = true;
                    hours.push(hour);
                }
                return hours;
            },
            minutesList :function() {
                var minutes = [];
                var minute_tmpl = {
                    text: 0,
                    selected: false,
                    disabled: false,
                    hide: false
                };
                for (var i = 0; i < 60; i++) {
                    var minute = deepCopy(minute_tmpl);
                    minute.text = i;
                    if (this.disabledMinutes.length && this.disabledMinutes.indexOf(i) > -1) {
                        minute.disabled = true;
                        if (this.hideDisabledOptions) minute.hide = true;
                    }
                    if (this.minutes === i) minute.selected = true;
                    minutes.push(minute);
                }
                return minutes;
            },
            secondsList :function() {
                var seconds = [];
                var second_tmpl = {
                    text: 0,
                    selected: false,
                    disabled: false,
                    hide: false
                };
                for (var i = 0; i < 60; i++) {
                    var second = deepCopy(second_tmpl);
                    second.text = i;
                    if (this.disabledSeconds.length && this.disabledSeconds.indexOf(i) > -1) {
                        second.disabled = true;
                        if (this.hideDisabledOptions) second.hide = true;
                    }
                    if (this.seconds === i) second.selected = true;
                    seconds.push(second);
                }
                return seconds;
            }
        },
        methods: {
            getCellCls :function(cell) {
                var opt = {};
                opt[prefixCls + '-cell-selected'] = cell.selected;
                opt[prefixCls + '-cell-disabled'] = cell.disabled;
                return [prefixCls+'-cell', opt];
                //return [
                //    `${prefixCls}-cell`,
                //    {
                //        [`${prefixCls}-cell-selected`]: -cell-selected,
                //        [`${prefixCls}-cell-disabled`]: cell.disabled
                //    }
                //];
            },
            handleClickHours :function(event) {
                this.handleClick('hours', event);
            },
            handleClickMinutes :function(event) {
                this.handleClick('minutes', event);
            },
            handleClickSeconds :function(event) {
                this.handleClick('seconds', event);
            },
            handleClick :function(type, event) {
                var target = event.target;
                if (target.tagName === 'LI') {
                    var cell = this[type+'List'][parseInt(event.target.getAttribute('index'))];
                    if (cell.disabled) return;
                    var data = {};
                    data[type] = cell.text;
                    this.$emit('on-change', data);
                }
                this.$emit('on-pick-click');
            },
            scroll :function(type, index) {
                var from = this.$els[type].scrollTop;
                var to = 24 * this.getScrollIndex(type, index);
                scrollTop(this.$els[type], from, to, 500);
            },
            getScrollIndex :function(type, index) {
                var Type = firstUpperCase(type);
                var disabled = this["disabled" + Type];
                if (disabled.length && this.hideDisabledOptions) {
                    var _count = 0;
                    disabled.forEach(function(item) {
                        item <= index ? _count++ : ''
                    });
                    index -= _count;
                }
                return index;
            },
            updateScroll :function() {
                var times = ['hours', 'minutes', 'seconds'];
                var _this = this;
                _this.$nextTick(function() {
                    times.forEach(function(type) {
                    	_this.$els[type].scrollTop = 24 * _this.getScrollIndex(type, this[type]);
                    });
                });
            },
            formatTime :function(text) {
                return text < 10 ? '0' + text : text;
            }
        },
        watch: {
            hours :function(val) {
                if (!this.compiled) return;
                this.scroll('hours', val);
            },
            minutes :function(val) {
                if (!this.compiled) return;
                this.scroll('minutes', val);
            },
            seconds :function(val) {
                if (!this.compiled) return;
                this.scroll('seconds', val);
            }
        },
        compiled :function() {
            this.updateScroll();
            this.$nextTick(function(){
                this.compiled = true
            });
        }
    };

    var component = Vue.extend(opts);
    return component;

});