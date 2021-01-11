/**
 * Created by yyt on 2017/1/4.
 */
define(function(require) {
    var Vue = require("vue");
    var iInput = require("../iviewInput");
    var Drop = require("../select/iviewDropDown");
    //var Drop = require("../select/iviewDropDown");
    var clickoutside = require("../directives/clickoutside");
    var oneOf = require('components/utils/assist').oneOf;
    var formatDate = require("./util").formatDate;
    var parseDate = require("./util").parseDate;
    

    //import Vue from 'vue';
    //import iInput from '../../components/input/input.vue';
    //import Drop from '../../components/select/dropdown.vue';
    //import clickoutside from '../../directives/clickoutside';
    //import { oneOf } from '../../utils/assist';
    //import { formatDate, parseDate } from './util';
    var template = '<div '+
                    ':class="[prefixCls]" '+
                    'v-clickoutside="handleClose">'+
                    '<div v-el:reference>'+
                    '<slot>'+
                    '<iv-input '+
                    ':class="[prefixCls + \'-editor\']" '+
                    ':readonly="!editable || readonly" '+
                    ':disabled="disabled" '+
                    ':size="size" '+
                    ':placeholder="placeholder" '+
                    ':value.sync="visualValue" '+
                    '@on-change="handleInputChange" '+
                    '@on-focus="handleFocus" '+
                    '@click="handleClick" '+
                    '@on-click="handleIconClick" '+
                    '@mouseenter="handleInputMouseenter" '+
                    '@mouseleave="handleInputMouseleave" '+
                    ':icon="iconType"></iv-input>'+
                    '</slot>'+
                    '</div>'+
                    '<dropdown v-show="opened" :placement="placement" :transition="transition" v-ref:drop>'+
                    '<div v-el:picker></div>'+
                    '</dropdown>'+
                    '</div>';


    var prefixCls = 'ivu-date-picker';
    var DEFAULT_FORMATS = {
        date: 'yyyy-MM-dd',
        month: 'yyyy-MM',
        year: 'yyyy',
        datetime: 'yyyy-MM-dd HH:mm:ss',
        time: 'HH:mm:ss',
        timerange: 'HH:mm:ss',
        daterange: 'yyyy-MM-dd',
        datetimerange: 'yyyy-MM-dd HH:mm:ss'
    };
    var RANGE_SEPARATOR = ' - ';
    var DATE_FORMATTER = function(value, format) {
        return formatDate(value, format);
    };
    var DATE_PARSER = function(text, format) {
        return parseDate(text, format);
    };
    var RANGE_FORMATTER = function(value, format) {
        if (Array.isArray(value) && value.length === 2) {
            var start = value[0];
            var end = value[1];
            if (start && end) {
                return formatDate(start, format) + RANGE_SEPARATOR + formatDate(end, format);
            }
        }
        return '';
    };
    var RANGE_PARSER = function(text, format) {
        var array = text.split(RANGE_SEPARATOR);
        if (array.length === 2) {
            var range1 = array[0];
            var range2 = array[1];
            return [parseDate(range1, format), parseDate(range2, format)];
        }
        return [];
    };
    var TYPE_VALUE_RESOLVER_MAP = {
        default: {
            formatter:function(value) {
                if (!value) return '';
                return '' + value;
            },
            parser:function(text) {
                if (text === undefined || text === '') return null;
                return text;
            }
        },
        date: {
            formatter: DATE_FORMATTER,
            parser: DATE_PARSER
        },
        datetime: {
            formatter: DATE_FORMATTER,
            parser: DATE_PARSER
        },
        daterange: {
            formatter: RANGE_FORMATTER,
            parser: RANGE_PARSER
        },
        datetimerange: {
            formatter: RANGE_FORMATTER,
            parser: RANGE_PARSER
        },
        timerange: {
            formatter: RANGE_FORMATTER,
            parser: RANGE_PARSER
        },
        time: {
            formatter: DATE_FORMATTER,
            parser: DATE_PARSER
        },
        month: {
            formatter: DATE_FORMATTER,
            parser: DATE_PARSER
        },
        year: {
            formatter: DATE_FORMATTER,
            parser: DATE_PARSER
        },
        number: {
            formatter:function(value) {
                if (!value) return '';
                return '' + value;
            },
            parser:function(text) {
                var result = Number(text);
                if (!isNaN(text)) {
                    return result;
                } else {
                    return null;
                }
            }
        }
    };
    var opts = {
        template :  template,
        //components: { iInput:iInput, Drop:Drop },
        directives: {clickoutside:clickoutside},
        props: {
            format: {
                type: String
            },
            readonly: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            editable: {
                type: Boolean,
                default: true
            },
            clearable: {
                type: Boolean,
                default: true
            },
            confirm: {
                type: Boolean,
                default: false
            },
            open: {
                type: Boolean,
                default: null
            },
            size: {
                validator :function(value) {
                    return oneOf(value, ['small', 'large']);
                }
            },
            placeholder: {
                type: String,
                default: ''
            },
            placement: {
                validator :function(value) {
                    return oneOf(value, ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end']);
                },
                default: 'bottom-start'
            },
            options: {
                type: Object
            }
        },
        data :function() {
            return {
                prefixCls: prefixCls,
                showClose: false,
                visible: false,
                picker: null,
                internalValue: '',
                disableClickOutSide: false    // fixed when click a date,trigger clickoutside to close picker
            };
        },
        computed: {
            opened :function() {
                return this.open === null ? this.visible : this.open;
            },
            iconType :function() {
                var icon = 'ios-calendar-outline';
                if (this.type === 'time' || this.type === 'timerange') icon = 'ios-clock-outline';
                if (this.showClose) icon = 'ios-close';
                return icon;
            },
            transition :function() {
                if (this.placement === 'bottom-start' || this.placement === 'bottom' || this.placement === 'bottom-end') {
                    return 'slide-up';
                } else {
                    return 'slide-down';
                }
            },
            selectionMode:function() {
                if (this.type === 'month') {
                    return 'month';
                } else if (this.type === 'year') {
                    return 'year';
                }
                return 'day';
            },
            visualValue: {
                get :function() {
                    var value = this.internalValue;
                    if (!value) return;
                    var formatter = (
                        TYPE_VALUE_RESOLVER_MAP[this.type] ||
                        TYPE_VALUE_RESOLVER_MAP['default']
                    ).formatter;
                    var format = DEFAULT_FORMATS[this.type];
                    return formatter(value, this.format || format);
                },
                set :function(value) {
                    if (value) {
                        var type = this.type;
                        var parser = (
                            TYPE_VALUE_RESOLVER_MAP[type] ||
                            TYPE_VALUE_RESOLVER_MAP['default']
                        ).parser;
                        var parsedValue = parser(value, this.format || DEFAULT_FORMATS[type]);
                        if (parsedValue) {
                            if (this.picker) {
                            	this.picker.value = parsedValue;
                            	//解决手动输入修改日期时,绑定的this.value未变化 by anson
                            	this.value = parsedValue;
                            }
                        }
                        return;
                    }
                    if (this.picker) this.picker.value = value;
                }
            }
        },
        methods: {
            handleClose :function() {
                if (!this.disableClickOutSide) this.visible = false;
                this.disableClickOutSide = false;
            },
            handleFocus :function() {
//                if (this.readonly) return;
//                this.visible = true;
            },
            handleClick :function() {
                if (this.readonly) return;
                this.visible = !this.visible;
            },
            handleInputChange :function(event) {
                var oldValue = this.visualValue;
//                var value = oldValue;//event.target.value;
                var value = event.target.value;
                var correctValue = '';
                var correctDate = '';
                var type = this.type;
                var format = this.format || DEFAULT_FORMATS[type];
                if (type === 'daterange' || type === 'timerange' || type === 'datetimerange') {
                    var parser = (
                        TYPE_VALUE_RESOLVER_MAP[type] ||
                        TYPE_VALUE_RESOLVER_MAP['default']
                    ).parser;
                    var formatter = (
                        TYPE_VALUE_RESOLVER_MAP[type] ||
                        TYPE_VALUE_RESOLVER_MAP['default']
                    ).formatter;
                    var parsedValue = parser(value, format);
                    if (parsedValue[0] instanceof Date && parsedValue[1] instanceof Date) {
                        if (parsedValue[0].getTime() > parsedValue[1].getTime()) {
                            correctValue = oldValue;
                        } else {
                            correctValue = formatter(parsedValue, format);
                        }
                        // todo 判断disabledDate
                    } else {
                        correctValue = oldValue;
                    }
                    correctDate = parser(correctValue, format);
                } else if (type === 'time') {
                    var parsedDate = parseDate(value, format);
                    if (parsedDate instanceof Date) {
                        if (this.disabledHours.length || this.disabledMinutes.length || this.disabledSeconds.length) {
                            var hours = parsedDate.getHours();
                            var minutes = parsedDate.getMinutes();
                            var seconds = parsedDate.getSeconds();
                            if ((this.disabledHours.length && this.disabledHours.indexOf(hours) > -1) ||
                                (this.disabledMinutes.length && this.disabledMinutes.indexOf(minutes) > -1) ||
                                (this.disabledSeconds.length && this.disabledSeconds.indexOf(seconds) > -1)) {
                                correctValue = oldValue;
                            } else {
                                correctValue = formatDate(parsedDate, format);
                            }
                        } else {
                            correctValue = formatDate(parsedDate, format);
                        }
                    } else {
                        correctValue = oldValue;
                    }
                    correctDate = parseDate(correctValue, format);
                } else {
                    var parsedDate = parseDate(value, format);
                    if (parsedDate instanceof Date) {
                        var options = this.options || false;
                        if (options && options.disabledDate && typeof options.disabledDate === 'function' && options.disabledDate(new Date(parsedDate))) {
                            correctValue = oldValue;
                        } else {
                            correctValue = formatDate(parsedDate, format);
                        }
                    } else {
                        correctValue = oldValue;
                    }
                    correctDate = parseDate(correctValue, format);
                }
                this.visualValue = correctValue;
                event.target.value = correctValue;
                this.internalValue = correctDate;
                if (correctValue !== oldValue) this.emitChange(correctDate);
            },
            handleInputMouseenter :function() {
                if (this.readonly || this.disabled) return;
                if (this.visualValue && this.clearable) {
                    this.showClose = true;
                }
            },
            handleInputMouseleave :function() {
                this.showClose = false;
            },
            handleIconClick :function() {
                if (!this.showClose) return;
                this.handleClear();
            },
            handleClear :function() {
                this.visible = false;
                this.internalValue = '';
                this.value = '';
                this.$emit('on-clear');
            },
            showPicker :function() {
                var _this = this;
                if (!this.picker) {
                    var type = this.type;
                    //var ss =  new Vue(this.panel);
                    //var MyComponent = Vue.extend({
                    //    template: '<div>Hello!</div>'
                    //})

                    //this.picker = new MyComponent().$mount(this.$els.picker);
                    this.picker = new Vue(this.panel).$mount(this.$els.picker);
//                    this.picker = new this.panel().$mount(this.$els.picker);
                    if (type === 'datetime' || type === 'datetimerange') {
                        this.confirm = true;
                        this.picker.showTime = true;
                    }
                    this.picker.value = this.internalValue;
                    this.picker.confirm = this.confirm;
                    this.picker.selectionMode = this.selectionMode;
                    if (this.format) this.picker.format = this.format;
                    // TimePicker
                    if (this.disabledHours) this.picker.disabledHours = this.disabledHours;
                    if (this.disabledMinutes) this.picker.disabledMinutes = this.disabledMinutes;
                    if (this.disabledSeconds) this.picker.disabledSeconds = this.disabledSeconds;
                    if (this.hideDisabledOptions) this.picker.hideDisabledOptions = this.hideDisabledOptions;
                    var options = this.options;
                    for (var option in options) {
                        this.picker[option] = options[option];
                    }
                    this.picker.$on('on-pick', function(date){
                        var visible = false;
                        if (!_this.confirm&&!/time/.test(_this.type)){ _this.visible = visible;}
                        _this.emitChange(date);
                        _this.value = date;
                        _this.picker.value = date;
                        _this.picker.resetView && _this.picker.resetView();
                });
                    this.picker.$on('on-pick-clear', function(){
                        _this.handleClear();
                });
                    this.picker.$on('on-pick-success', function() {
                        _this.visible = false;
                        _this.$emit('on-ok');
                });
                    this.picker.$on('on-pick-click',function(){
                        _this.disableClickOutSide = true;
                    });
                }
                if (this.internalValue instanceof Date) {
                    this.picker.date = new Date(this.internalValue.getTime());
                } else {
                    this.picker.value = this.internalValue;
                }
                this.picker.resetView && this.picker.resetView();
            },
            emitChange :function(date) {

                var type = this.type;
                var format = this.format || DEFAULT_FORMATS[type];
                var formatter = (
                    TYPE_VALUE_RESOLVER_MAP[type] ||
                    TYPE_VALUE_RESOLVER_MAP['default']
                ).formatter;
                var newDate = formatter(date, format);
                if (type === 'daterange' || type === 'timerange') {
                    newDate = [newDate.split(RANGE_SEPARATOR)[0], newDate.split(RANGE_SEPARATOR)[1]];
                }
                this.$emit('before-change');
                this.$emit('on-change', newDate);
            }
        },
        watch: {
            visible :function(val) {
                if (val) {
                    var _this=this;
                    this.showPicker();
                    this.$refs.drop.update();
                    if (this.open === null) this.$emit('on-open-change', true);
                    if(this.type==='time'){
                    this.$nextTick(function () {
                       setTimeout(function () {
                           window.document.addEventListener("click",function (event) {
                               event.stopPropagation();
                              if(event.currentTarget!=_this.$el){
                                  _this.visible=false;
                              }
                           },{once:true})
                       })
                    })
                    }
                } else {
                    if (this.picker) this.picker.resetView && this.picker.resetView(true);
                    this.$refs.drop.destroy();
                    if (this.open === null) this.$emit('on-open-change', false);

                }
            },
//            visible : _.debounce(function(val) {
//                if (val) {
//                    this.showPicker();
//                    this.$refs.drop.update();
//                    if (this.open === null) this.$emit('on-open-change', true);
//                } else {
//                    if (this.picker) this.picker.resetView && this.picker.resetView(true);
//                    this.$refs.drop.destroy();
//                    if (this.open === null) this.$emit('on-open-change', false);
//                }
//            },100),
            internalValue :function(val) {
                if (!val && this.picker && typeof this.picker.handleClear === 'function') {
                    this.picker.handleClear();
                }
            },
            value: {
                immediate: true,
                handler :function(val) {
                    var type = this.type;
                    var parser = (
                        TYPE_VALUE_RESOLVER_MAP[type] ||
                        TYPE_VALUE_RESOLVER_MAP['default']
                    ).parser;
                    if (val && type === 'time' && !(val instanceof Date)) {
                        val = parser(val, this.format || DEFAULT_FORMATS[type]);
                    } else if (val && type === 'timerange' && Array.isArray(val) && val.length === 2 && !(val[0] instanceof Date) && !(val[1] instanceof Date)) {
                        val = val.join(RANGE_SEPARATOR);
                        val = parser(val, this.format || DEFAULT_FORMATS[type]);
                    }
                    this.internalValue = val;
                }
            },
            open :function(val) {
                if (val === true) {
                    this.visible = val;
                    this.$emit('on-open-change', true);
                } else if (val === false) {
                    this.$emit('on-open-change', false);
                }
            }
        },
        beforeDestroy :function() {
            if (this.picker) {
                this.picker.$destroy();
            }
        },
        ready :function() {
            if (this.open !== null) this.visible = this.open;
        }
    };

return opts;
    //var component = Vue.extend(opts);
    //return component;

});