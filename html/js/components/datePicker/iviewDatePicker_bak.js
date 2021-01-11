define(function(require) {

    var Vue = require("vue");
    var Icon = require("./iviewIcon");
    var Dropdown = require("./select/iviewDropDown");
    var clickoutside = require("./directives/clickoutside");

    var assist = require("./utils/assist");


    var template = '<div :class="classes" v-clickoutside="handleClose" class="datepicker_main">'+
        '<div '+
        ':class="prefixCls+\'-selection\'" '+
        'v-el:reference '+
        '@click="toggleMenu($event)" class="ivu-input-customize"> '+
        '<div class="ivu-tag" v-if="multiple" v-for="item in selectedMultiple"> '+
        '<span class="ivu-tag-text">{{ item.label }}</span> '+
        '<Icon type="ios-close-empty" @click.stop="removeTag($index)"></Icon> '+
        '</div> '+
        '<input type="hidden" v-model="selectedDate">' +
        '<iv-input icon="clock" placeholder="请选择日期" :value.sync="selectedTime" readonly ></iv-input>'+
        '<Icon type="ios-close" class="ivu-input-customize-ico"  v-show="showCloseIcon" @click.stop="clearSelectedDate"></Icon>'+
        '</div> '+
        '<Dropdown v-show="visible" transition="slide-up" :placement="placement" v-ref:dropdown> '+
        '<calendar '+
        ':show.sync="visible" '+
        ':type.sync="type" '+
        ':value.sync="selectedDateStr"  '+
        ':x="calendar.x"  '+
        ':y="calendar.y"  '+
        ':begin.sync="begin"  '+
        ':end.sync="end"  '+
        ':range.sync="calendar.range" '+
        ':weeks="calendar.weeks" '+
        ':months="calendar.months" ' +
        ':is-calendar-class="isCalendarClass"'+
        ':sep.sync="calendar.sep"> '+
        '</calendar>'+
        '</Dropdown> '+
        '</div>';


    var prefixCls = 'ivu-select';
    var opts = {
        template :  template,
        components: { Icon:Icon, Dropdown:Dropdown },
        directives: { clickoutside:clickoutside },
        props: {
            model: {
                type: [String, Number, Array],
                default: ''
            },
            multiple: {
                type: Boolean,
                default: false
            },
            readonly:{
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
            size: {
                validator: function validator(value) {
                    return assist.oneOf(value, ['small', 'large']);
                }
            },
            labelInValue: {
                type: Boolean,
                default: false
            },
            list: {
                type: [Array],
                default: null
            },
            displayAttr: {
                type: String
            },
            idAttr : {
                type:String,
                default:"id"
            },
            //日历
            selectedDate: {
                type: [String,Date],
                default: ''
            },
            format: {
                type: String,
                //设置默认时间
                //default: 'yyyy-MM-dd'
                default: 'yyyy-MM-dd 00:00:00'
            },
            selectedDatetwo:{
                type: Date,
                default: ''
            },
            active:{
                type: Boolean,
                default: false
            },
            type: {
                type: String,
                default: "date"
            },
            //用来区分是否显示时分秒
            isTime:{
                type: Boolean,
                default: true
            },
            //切换方像 比如说默认往下
            placement: {
                type: String,
                default: 'bottom-start'
            },
            //给日历 三角形 增加一个判断
            isCalendarClass:{
                type: Boolean,
                default: true
            },
            //开始时间
            begin:String,
            //结束时间
            end:String
        },
        data: function data() {
            return {
                prefixCls: prefixCls,
                visible: false,
                options: [],
                optionInstances: [],
                selectedSingle: '', // label
                selectedMultiple: [],
                focusIndex: 0,
                query: '',
                inputLength: 20,
                calendar:{
                    show:false,
                    x:0,
                    y:0,
                    //type:"date",
                    value:"",
                    range:false,
                },
                selectedDateStr : ''
            };
        },

        computed: {
            selectedTime:function(){
                if(this.isTime){
                    return this.formatData(this.selectedDate, this.format || "yyyy-MM-dd");
                }else{
                    return this.formatData(this.selectedDate, this.format || "yyyy-MM-dd HH:mm:ss");
                }

            },
            classes: function classes() {
                var oot ={};
                oot[prefixCls + '-visible']=this.visible;
                oot[prefixCls + '-disabled']=this.disabled;
                oot[prefixCls + '-multiple']=this.multiple;
                oot[prefixCls + '-single']=!this.multiple;
                oot[prefixCls + '-show-clear']=this.showCloseIcon;
                oot[prefixCls + '-' + this.size]=!!this.size;
                oot[prefixCls + '-' + 'readonly'] = this.readonly;
                return ['' + prefixCls, oot];
            },
            showPlaceholder: function showPlaceholder() {
                var status = false;
                if (typeof this.model === 'string') {
                    if (this.model === '') {
                        status = true;
                    }
                    //anson tag 暂时不允许显示的值是空字符串，如果是空字符串则显示placeHolder
                    else if(this.selectedSingle == '') {
                        status = true;
                    }
                } else if (Array.isArray(this.model)) {
                    if (!this.model.length) {
                        status = true;
                    }
                }
                //anson tag 暂时不允许显示的值是空字符串，如果是空字符串则显示placeHolder
                else if(this.selectedSingle == '') {
                    status = true;
                }
                return status;
            },
            showCloseIcon: function showCloseIcon() {
                return this.selectedTime && !this.multiple && this.clearable;
            },
            inputStyle: function inputStyle() {
                var style = {};
                if (this.multiple) {
                    style.width = this.inputLength + 'px';
                }
                return style;
            }
        },
        methods: {
            toggleMenu: function(event) {
                if (this.disabled || this.readonly) {
                    return false;
                }
                this.visible = !this.visible;
                var Height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                //todo 判断点击的地方加上 本身的高度 是否大于 屏幕高度
                //如果大于 切换方向就向上
                if(event.clientY + 260 > Height){
                    this.placement ="top-start";
                    this.isCalendarClass = false;
                }else{
                    this.placement ="bottom-start";
                    this.isCalendarClass =true;
                }
            },

            hideMenu: function hideMenu() {
                this.visible = false;
                this.focusIndex = 0;
                this.$broadcast('on-select-close');
            },

            // find option component
            findChild: function findChild(cb) {
                var find = function find(child) {
                    var name = child.$options.componentName;
                    if (name) {
                        cb(child);
                    } else if (child.$children.length) {
                        child.$children.forEach(function (innerChild) {
                            find(innerChild, cb);
                        });
                    }
                };

//	            if (this.optionInstances.length) {
                //解决动态切换数据源问题
                if (this.optionInstances.length && (this.optionInstances[0].label || this.optionInstances[0].$el)) {
                    this.optionInstances.forEach(function (child) {
                        find(child);
                    });
                } else {
                    this.$children.forEach(function (child) {
                        find(child);
                    });
                }
            },
            updateOptions: function updateOptions(init) {
                var _this = this;

                var options = [];
                var index = 1;

                this.findChild(function (child) {
                    options.push({
                        value: child.value,
                        label: child.label === undefined ? child.$el.innerHTML : child.label
                    });
                    child.index = index++;

                    if (init) {
                        _this.optionInstances.push(child);
                    }
                });

                this.options = options;

                if (init) {
                    this.updateSingleSelected(true);
                    this.updateMultipleSelected(true);
                }
            },
            updateSingleSelected: function updateSingleSelected() {
                var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

                this.toggleSingleSelected(this.model, init);
            },
            clearSelectedDate: function clearSingleSelect() {
                if (this.showCloseIcon) {
                    this.selectedDate = "";
                }
            },
            updateMultipleSelected: function updateMultipleSelected() {
                var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

                if (this.multiple && Array.isArray(this.model)) {
                    var selected = [];

                    for (var i = 0; i < this.model.length; i++) {
                        var model = this.model[i];

                        for (var j = 0; j < this.options.length; j++) {
                            var option = this.options[j];

                            if (model === option.value) {
                                selected.push({
                                    value: option.value,
                                    label: option.label
                                });
                            }
                        }
                    }

                    this.selectedMultiple = selected;
                }

                this.toggleMultipleSelected(this.model, init);
            },
            removeTag: function removeTag(index) {
                if (this.disabled) {
                    return false;
                }
                this.model.splice(index, 1);
            },

            // to select option for single
            toggleSingleSelected: function toggleSingleSelected(value) {
                var init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

                if (!this.multiple) {
                    var label = '';

                    this.findChild(function (child) {
                        if (child.value === value) {
                            child.selected = true;
                            label = child.label === undefined ? child.$el.innerHTML : child.label;
                        } else {
                            child.selected = false;
                        }
                    });

                    this.hideMenu();

                    if (!init) {
                        if (this.labelInValue) {
                            this.$emit('on-change', {
                                value: value,
                                label: label
                            });
                        } else {
                            this.$emit('on-change', value);
                        }
                    }
                }
            },

            // to select option for multiple
            toggleMultipleSelected: function toggleMultipleSelected(value) {
                var _this2 = this;
                var init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                if (this.multiple) {
                    (function () {
                        var hybridValue = [];
                        for (var i = 0; i < value.length; i++) {
                            hybridValue.push({
                                value: value[i]
                            });
                        }

                        _this2.findChild(function (child) {
                            var index = value.indexOf(child.value);

                            if (index >= 0) {
                                child.selected = true;
                                hybridValue[index].label = child.label === undefined ? child.$el.innerHTML : child.label;
                            } else {
                                child.selected = false;
                            }
                        });

                        if (!init) {
                            if (_this2.labelInValue) {
                                _this2.$emit('on-change', hybridValue);
                            } else {
                                _this2.$emit('on-change', value);
                            }
                        }
                    })();
                }
            },
            handleClose: function handleClose() {
                this.hideMenu();
            },
            handleKeydown: function handleKeydown(e) {
                if (this.visible) {
                    var keyCode = e.keyCode;
                    // Esc slide-up
                    if (keyCode === 27) {
                        e.preventDefault();
                        this.hideMenu();
                    }
                    // next
                    if (keyCode === 40) {
                        e.preventDefault();
                        this.navigateOptions('next');
                    }
                    // prev
                    if (keyCode === 38) {
                        e.preventDefault();
                        this.navigateOptions('prev');
                    }
                    // enter
                    if (keyCode === 13) {
                        e.preventDefault();

                        this.findChild(function (child) {
                            if (child.isFocus) {
                                child.select();
                            }
                        });
                    }
                }
            },
            navigateOptions: function navigateOptions(direction) {
                var _this3 = this;

                if (direction === 'next') {
                    var next = this.focusIndex + 1;
                    this.focusIndex = this.focusIndex === this.options.length ? 1 : next;
                } else if (direction === 'prev') {
                    var prev = this.focusIndex - 1;
                    this.focusIndex = this.focusIndex <= 1 ? this.options.length : prev;
                }
                var child_status = {
                    disabled: false
                };

                this.findChild(function (child) {
                    if (child.index === _this3.focusIndex) {
                        child_status.disabled = child.disabled;
                        if (!child.disabled) {
                            child.isFocus = true;
                        }
                    } else {
                        child.isFocus = false;
                    }
                });

                this.resetScrollTop();

                if (child_status.disabled) {
                    this.navigateOptions(direction);
                }
            },
            resetScrollTop: function resetScrollTop() {
                var index = this.focusIndex - 1;
                var bottomOverflowDistance = this.optionInstances[index].$el.getBoundingClientRect().bottom - this.$refs.dropdown.$el.getBoundingClientRect().bottom;
                var topOverflowDistance = this.optionInstances[index].$el.getBoundingClientRect().top - this.$refs.dropdown.$el.getBoundingClientRect().top;

                if (bottomOverflowDistance > 0) {
                    this.$refs.dropdown.$el.scrollTop += bottomOverflowDistance;
                }
                if (topOverflowDistance < 0) {
                    this.$refs.dropdown.$el.scrollTop += topOverflowDistance;
                }
            },
            //日历
            updateSelectedDateStr : function(val) {
                var val = this.selectedDate;
                val = val || '';
                var type = typeof this.selectedDate;
                //根据selectedDate类型来更新selectedDateStr
                if (type === 'string' || val == '') {
                    this.selectedDateStr = val;
                } else {
                    this.selectedDateStr = val.Format(this.format);
                    //this.selectedDate=this.parserDate(val.Format(this.format));
                    //this.selectedDateStr = val.Format("yyyy-MM-dd");

                }
            },
            formatData:function(time, format){
                if(time){
                    var t = this.covertDate(time);
                    var tf = function(i){return (i < 10 ? '0' : '') + i};
                    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
                        switch(a){
                            case 'yyyy':
                                return tf(t.getFullYear());
                                break;
                            case 'MM':
                                return tf(t.getMonth() + 1);
                                break;
                            case 'mm':
                                return tf(t.getMinutes());
                                break;
                            case 'dd':
                                return tf(t.getDate());
                                break;
                            case 'HH':
                                return tf(t.getHours());
                                break;
                            case 'ss':
                                return tf(t.getSeconds());
                                break;
                        }
                    })
                }
            },
            covertDate:function(time){
                var date = new Date();
                if(typeof time == 'object' && typeof time.getTime == 'function'){
                    date.setTime(time.getTime());
                }else if(typeof time == 'string'){
                    if(this.type=="datetime"){
                        date = new Date(time);
                    }else{
                        var times=time.replace(/\s((\d{2}):){2}\d{2}$/, "").split('-');
                        date.setFullYear(times[0], times[1]-1, times[2]);
                    }

                }
                return date;
            }
        },
        ready: function ready() {
            this.updateSelectedDateStr();
            this.updateOptions(true);
            document.addEventListener('keydown', this.handleKeydown);
        },

        beforeDestroy: function beforeDestroy() {
            document.removeEventListener('keydown', this.handleKeydown);
        },

        watch: {
            model: function model() {
                if (this.multiple) {
                    this.updateMultipleSelected();
                } else {
                    this.updateSingleSelected();
                }
            },
            visible: function visible(val) {

                if (val) {
                    this.$broadcast('on-update-popper');
                } else {}
            },
            selectedDateStr : function(val) {
                var type = typeof this.selectedDate;
                //根据selectedDate类型来更新selectedDate
                if (type === 'string') {
                    //if(this.type=="datetime"){
                    //	this.selectedDate = val;
                    //}else{
                    //	this.selectedDate =this.formatData(val,this.format)
                    //}
                    this.selectedDate =this.formatData(val,this.format)
                    this.visible = false;
                } else if(val != ''){
                    //将yyyy-MM-dd 转成js默认的 yyyy/MM/dd格式，用来去掉默认+8的时区问题
                    // this.selectedDate = new Date(val.replace(/-/g,"/"));
                    //this.selectedDate = val;
                    var a = new Date(val.replace(/-/g,"/"));
                    this.selectedDate=this.formatData(a,this.format);
                    this.visible = false;
                    //console.log(this.selectedDate);

                }
            },
            selectedDate : function(val) {
                this.updateSelectedDateStr();

            },
            list: function (val) {
                var _this = this;

                //解决动态切换数据源的问题
                this.options = [];
                this.optionInstances = [];
//	            this.selectedSingle = ''; // label
                this.selectedMultiple = [];

//	        	 if (typeof this.model === 'string') {
//	                if (this.model === '') {
//	                    status = true;
//	                }
//	        		 this.model = '';
//                     status = true;
//	            } else if (Array.isArray(this.model)) {
//	                if (!this.model.length) {
//	                    status = true;
//	                }
//	            	this.model.length = 0;
//                    status = true;
//	            }
                this.updateOptions(true);
            }
        },
        events: {
            'on-select-selected': function onSelectSelected(value) {
                if (this.model === value) {
                    this.hideMenu();
                } else {
                    if (this.multiple) {
                        var index = this.model.indexOf(value);
                        if (index >= 0) {
                            this.removeTag(index);
                        } else {
                            this.model.push(value);
                        }
                    } else {
                        this.model = value;
                    }
                }
            }
        }
    };

    var component = Vue.extend(opts);
    Vue.component('date-picker', component);

});