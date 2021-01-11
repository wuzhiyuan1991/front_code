define(function (require) {

    var Vue = require("vue");
    var Icon = require("../iviewIcon");
    var Dropdown = require("../select/iviewDropDown");
    var clickoutside = require("../directives/clickoutside");


    var template = require("text!./ivierDatePicker.html");


    var prefixCls = 'ivu-select';
    var opts = {
        template: template,
        components: {Icon: Icon, Dropdown: Dropdown},
        directives: {clickoutside: clickoutside},
        props: {
            readonly: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            clearable: {
                type: Boolean,
                default: false
            },
            //日历
            selectedDate: {
                type: [String, Date],
                default: ''
            },
            format: {
                type: String,
                //设置默认时间
                default: 'yyyy-MM-dd 00:00:00'
            },
            dataFormat: {
                type: String,
                //设置默认时间
                default: null
            },
            type: {
                type: String,
                default: "date"
            },
            //切换方像 比如说默认往下
            placement: {
                type: String,
                default: 'bottom-start'
            },
            //给日历 三角形 增加一个判断
            isCalendarClass: {
                type: Boolean,
                default: true
            },
            //开始时间
            begin: String,
            //结束时间
            end: String,
            // 时间选择器没有选择打开后时分秒是否默认为00:00:00, 默认否
            timeZero: {
                type: Boolean,
                default: false
            },
            defaultDate: {
                type: Boolean,
                default: true
            }
        },
        data: function data() {
            return {
                visible: false,
                selectedDateStr: '' // 与日历绑定的时间
            };
        },

        computed: {
            selectedTime: function () {
                
                return this.formatData(this.selectedDate, this.format);
            },
            classes: function classes() {
                var oot = {};
                oot[prefixCls + '-disabled'] = this.disabled;
                oot[prefixCls + '-show-clear'] = this.showCloseIcon;
                oot[prefixCls + '-' + 'readonly'] = this.readonly;
                return ['' + prefixCls, oot];
            },
            showCloseIcon: function showCloseIcon() {
                return this.selectedTime && this.clearable;
            }
        },
        watch: {
            visible: function visible(val) {
                if (val) {
                    if(this.selectedDate && !this.selectedDateStr) {
                        this._initDateStr = true;
                        this.updateSelectedDateStr();
                    } else if(!this.selectedDate) {
                        this._initDateStr = true;

                        if(this.defaultDate){
                            var d = new Date();
                            var times=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + '00:00:00'
                            this.selectedDateStr = times;
                        }else{
                            this.selectedDateStr = '';
                        }

                    }
                    this.$broadcast('on-update-popper');
                }
            },
            selectedDateStr: function (val) {
                // 选择日期后引起的selectedDateStr改变
                var type = typeof this.selectedDate;
                //根据selectedDate类型来更新selectedDate
                if (type === 'string') {
                    this.selectedDate = this.formatData(val, !this.dataFormat ? this.format : this.dataFormat)
                } else if (val !== '') {
                    var a = new Date(val.replace(/-/g, "/"));
                    this.selectedDate = this.formatData(a, !this.dataFormat ? this.format : this.dataFormat);

                }
                if(!this._initDateStr) {
                    this.visible = false;
                } else {
                    this._initDateStr = false;
                }
                this._isChangeFromSelect = true;

            },
            selectedDate: function (val) {
                // selectedDate改变引起selectedDateStr改变
                if(this._isChangeFromSelect) {
                    this._isChangeFromSelect = false;
                    return;
                }
                this.updateSelectedDateStr();
            }
        },
        methods: {
            toggleMenu: function (event) {
                if (this.disabled || this.readonly) {
                    return false;
                }

                this.visible = !this.visible;

                var Height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                //todo 判断点击的地方加上 本身的高度 是否大于 屏幕高度
                //如果大于 切换方向就向上

                var boxHeight = this.type === 'datetime' ? 340 : 260;

                var arr = this.placement.split("-");
                var place = _.last(arr) === 'end' ? 'end' : 'start';
                if (event.clientY + boxHeight > Height) {
                    this.placement = "top-" + place;
                    this.isCalendarClass = false;
                } else {
                    this.placement = "bottom-" + place;
                    this.isCalendarClass = true;
                }
            },

            hideMenu: function hideMenu() {
                this.visible = false;
                this.$broadcast('on-select-close');
            },

            // 清空
            clean: function () {
                this.selectedDate = "";
            },

            // 点击日期选择组件以外的地方
            handleClose: function handleClose() {
                this.hideMenu();
            },

            // 更新日历数据
            updateSelectedDateStr: function () {

                var val = this.selectedDate || '';
                var type = typeof this.selectedDate;

                //根据selectedDate类型来更新selectedDateStr
                if (type === 'string' || val === '') {
                    this.selectedDateStr = val;
                } else {
                    this.selectedDateStr = val.Format(this.format);
                }
            },
            formatData: function (time, format) {
                
                if (!time) {
                    return '';
                }
                var t = this.convertDate(time);
                var padZero = function (i) {
                    return (i < 10 ? '0' : '') + i
                };
                return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
                    switch (a) {
                        case 'yyyy':
                            return padZero(t.getFullYear());
                            break;
                        case 'MM':
                            return padZero(t.getMonth() + 1);
                            break;
                        case 'mm':
                            return padZero(t.getMinutes());
                            break;
                        case 'dd':
                            return padZero(t.getDate());
                            break;
                        case 'HH':
                            return padZero(t.getHours());
                            break;
                        case 'ss':
                            return padZero(t.getSeconds());
                            break;
                    }
                })
            },
            convertDate: function (time) {
                var date = new Date();

                if (typeof time === 'object' && typeof time.getTime === 'function') {
                    date.setTime(time.getTime());
                }
                else if (typeof time === 'string') {
                    if (this.type === "datetime") {
                        date = new Date(time);
                    } else {
                        var times = time.replace(/\s((\d{2}):){2}\d{2}$/, "").split('-');
                        date.setFullYear(times[0], times[1] - 1, times[2]);
                    }

                }
                return date;
            }
        },
        ready: function ready() {
            // this.updateSelectedDateStr();
            this._initDateStr = false;
        },

        events: {
            'on-select-selected': function (value) {

            }
        }
    };

    var component = Vue.extend(opts);
    Vue.component('date-picker', component);

    return component;

});