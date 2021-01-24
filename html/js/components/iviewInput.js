///**
// * Created by yyt on 2016/11/16.
// */

define(function(require) {

    var Vue = require("vue");
    var assist = require("./utils/assist");
    var calcTextareaHeight = require("./utils/calcTextareaHeight");

    var template = '<div :class="wrapClasses"> ' +

	    '<template  v-if="textonly"> ' +
	    	'<div :title="showTip ? value : null" style="white-space: pre-wrap;line-height: 20px;">{{value}}</div> ' +
	    ' </template> ' +

        '<template  v-else>' +
	        '<template  v-if="type!== \'textarea\'"> ' +
		        '<div :class="[prefixCls + \'-group-prepend\']" v-if="prepend" v-show="slotReady"  v-el:prepend><slot name="prepend"></slot></div> ' +
                ' <i class="ivu-icon" v-show="value" :class="closeIconClass" :style="closeIconStyle" v-if="cleanable" @click="handleCloseIconClick"></i> ' +
                ' <i class="ivu-icon" :class="[\'ivu-icon-\' + icon, prefixCls + \'-icon\']" v-if="icon" @click="handleIconClick"></i> ' +
		        ' <input ' +
		        ' :type="type" ' +
		        ' :class="inputClasses" ' +
                ' :style="inputStyle" ' +
		        ' :placeholder="placeholder" ' +
		        ' :disabled="disabled" ' +
		        ' :maxlength="maxlength" ' +
		        ' :readonly="readonly || textonly" ' +
                ' :title="titleText"' +
                ' :debounce="debounce"' +
		        '  v-model="value" ' +
                ' :autofocus="autofocus"'+
		        ' @keyup.enter="handleEnter" ' +
		        ' @focus="handleFocus" ' +
                ' @input="handleInput"' +
                ' @blur="handleBlur" ' +
		        ' @change="handleChange"> ' +
	        	' <div :class="[prefixCls + \'-group-append\']" v-if="append" v-show="slotReady" v-el:append><slot name="append"></slot></div> ' +
	        ' </template> ' +
        
	        ' <textarea ' +
		        ' v-else ' +
		        ' v-el:textarea ' +
		        ':class="textareaClasses" ' +
		        ' :style="textareaStyles" ' +
		        ':placeholder="placeholder" ' +
		        ':disabled="disabled" ' +
		        ':rows="rows" ' +
		        ':maxlength="maxlength" ' +
		        ':readonly="readonly || textonly" ' +
		        'v-model="value" ' +
                 ':autofocus="autofocus"'+
		        '@keyup.enter="handleEnter" ' +
		        '@focus="handleFocus" ' +
		        '@blur="handleBlur" ' +
		        '@change="handleChange"> ' +
	        '  </textarea> ' +
        ' </template> ' +
        '  </div> ' ;


    var prefixCls = 'ivu-input';

    var opt = {
        template: template,


        props: {
            type: {
                validator: function (value) {
                    return assist.oneOf(value, ['text', 'textarea', 'password','number'])
                },
                default: 'text'
            },
            value: {
                type: [String, Number],
                default: ''
//                	,
//                twoWay: true
            },
            size: {
                validator: function (value) {
                    return assist.oneOf(value, ['small', 'large']);
                }
            },
            placeholder: {
                type: String,
                default: ''
            },
            maxlength: {
                type: Number
            },
            displayType:{
                type:String,
                default: ''
            },
            disabled: {
                type: Boolean,
                default: false
            },

            icon: String,
            autosize: {
                type: [Boolean, Object],
                default: false
            },
            rows: {
                type: Number,
                default: 2
            },
            readonly: {
                type: Boolean,
                default: false
            },
            textonly: {
                type: Boolean,
                default: false
            },
            autofocus: {
                type: Boolean,
                default: false
            },
            autotrim: {
                type:Boolean,
                default: false
            },
            //是否显示title
            showTip:{
                type: Boolean,
                default: true
            },
            debounce: {
                type: Number,
                default: 10
            },
            showTitle: {
                type: Boolean,
                default: false
            },
            cleanable: {
                type: Boolean,
                default: false
            },
            height:{
                type: [Number,String],
                default: "auto"
            }
        },
        data: function () {
            return {
                prefixCls: prefixCls,
                prepend: true,
                append: true,
                slotReady: false,
                textareaStyles: {}
            }
        },
        computed: {
            wrapClasses :function() {
                var obj = {};
                obj[prefixCls + '-' + this.size] = !!this.size;
                obj[prefixCls + '-' + 'type'] = this.type;
                obj[prefixCls + '-' + 'group'] = this.prepend || this.append;
                obj[prefixCls + '-group' + '-' + this.size] = (this.prepend || this.append) && !!this.size;
                return [prefixCls + '-wrapper', obj];

            },
            inputClasses: function() {
                var obj = {};
                obj[prefixCls + '-' + this.size] = !!this.size;
                obj[prefixCls + '-' + 'disabled'] = this.disabled;
                obj[prefixCls + '-' + 'readonly'] = this.readonly;
                obj[prefixCls + '-' + 'textonly'] = this.textonly;
                obj[prefixCls + '-' + 'popselect'] = this.displayType=="popselect";
                obj[prefixCls + '-' + 'popfx'] =this.displayType=="popfx"
                return [prefixCls, obj];
            },

            textareaClasses: function() {
                var obj = {};
                obj[prefixCls + '-' + 'disabled'] = this.disabled;
                obj[prefixCls + '-' + 'readonly'] = this.readonly;
                obj[prefixCls + '-' + 'textonly'] = this.textonly;
                return [prefixCls, obj];
            },
            titleText: function () {
                return this.showTitle ? this.value : '';
            },
            closeIconClass: function () {
                var obj = {
                    'ivu-icon-close-circled': true,
                    'ivu-input-close-icon': true
                };
                obj[this.prefixCls + '-icon'] = true;
                obj['ivu-input-close-show'] = Boolean(this.value);
                return obj;
            },
            closeIconStyle: function () {
                var styleO = {
                    color: "red",
                    cursor: "pointer"
                };
                if (this.icon) {
                    styleO.right = "24px";
                }
                return styleO
            },
            inputStyle: function () {
                var styleO = {
                    paddingRight: "7px"
                };
                if (this.icon && this.cleanable) {
                    styleO.paddingRight = "48px"
                } else if (this.icon || this.cleanable) {
                    styleO.paddingRight = "24px"
                }
                return styleO;
            }
        },
        methods: {
            handleCloseIconClick: function () {
                this.value = '';
                var _this = this;
                setTimeout(function () {
                    _this.$emit('on-remove')
                }, 0)
            },
            handleEnter: function () {
                this.$emit('on-enter', this.value);
            },
            handleIconClick: function () {
                this.$emit('on-click', this.value);
            },
            handleFocus: function () {
                this.$emit('on-focus');
            },
            handleBlur: function () {
                this.$emit('on-blur');
                this.$dispatch('on-form-blur', this.value);
            },
            handleChange : function(event) {
                this.autotrim && this.value && (this.value = this.value.trim());
                this.$emit('on-change', event);
                this.$dispatch('on-form-change', this.value);
            },
            handleInput: function (event) {
                this.$emit('on-input', event);
            },
            resizeTextarea: function () {
                var autosize = this.autosize;
                if(this.height) this.textareaStyles = {height:this.height}; // 设置自适应高度。。。
                if (!autosize || this.type !== 'textarea') {
                    return false;
                }
                var minRows = autosize.minRows;
                var maxRows = autosize.maxRows;
                // this.textareaStyles=0;
                this.textareaStyles = calcTextareaHeight(this.$els.textarea, minRows, maxRows);
            }
        },

        watch: {
            value: function (val) {
                var _this = this;
                this.$nextTick = function () {
                    _this.resizeTextarea();
                };
//                this.$emit('on-change', val);
            },

            displaytype:function(){
                console.log("|")
            }
        },
        ready:function(){
            if(_.isEmpty(this.placeholder)&& !this.disabled){
                this.placeholder=this.$t('gb.common.pleaseInput');
            }
            //if(this.textonly==true && this.placeholder=="请输入"){
            //    this.placeholder="";
            //}
            if(this.displayType === "popselect"){
                this.icon="plus";
                this.readonly=true;

            }else if(this.displayType === "popfx"){
                this.readonly=true;
            }
            if(this.type === 'text' || this.type === 'number') {
                this.prepend = this.$els.prepend && this.$els.prepend.innerHTML !== '';
                this.append = this.$els.append && this.$els.append.innerHTML !="";
            }
            else {
                this.prepend = false;
                this.append = false;
            }
//            if(_.isEmpty(this.maxlength)) {
//                if(this.type != 'textarea') {
//                    this.maxlength = 50;
//                } else {
//                    this.maxlength = 100;
//                }
//            }

            this.slotReady = true;
            this.resizeTextarea();
        }

    };

    var component = Vue.extend(opt);
    Vue.component('iv-input', component);

})
