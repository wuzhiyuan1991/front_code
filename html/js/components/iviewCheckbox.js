
/**
 * Created by yyt on 2016/10/25.
 */
define(function(require) {

    var Vue = require("vue");

    var template =     '<label :class="wrapClasses">'+
                        '<span :class="checkboxClasses">'+
                        '<span :class="innerClasses"></span>'+
                        '<input '+
                        'v-if="group" '+
                        'type="checkbox" '+
                        ':class="inputClasses" '+
                        ':disabled="disabled" '+
                        ':value="value" '+
                        'v-model="model" '+
                        '@change="change">'+
                        '<input '+
                        'v-if="!group" '+
                        'type="checkbox" '+
                        ':class="inputClasses" '+
                        ':disabled="disabled" '+
                        'v-model="selected" '+
                        '@change="change">'+
                        '</span>'+
                        '<slot><span v-show="value">{{ value }}</span></slot>'+
                        '</label>';
    var prefixCls = 'ivu-checkbox';

    var opt = {
        name:"iv-checkbox",
        template : template,
        props: {
            disabled: {
                type: Boolean,
                default: false
            },
            value: {
                type: [String, Number, Boolean]
            },
            checked: {
                type: [Boolean,String,Number],
                default: false
            },
            middle: {
                type: Boolean,
                default: false
            },
            trueValue:{
                type: [String, Number]
            },
            falseValue:{
                type: [String, Number]
            }
        },
        data: function data() {
            return {
                model: [],
                selected: false,
                group: false
            };
        },

        computed: {
            wrapClasses: function wrapClasses() {
                var obj ={};
                obj[prefixCls + 'group-item'] = this.group;
                obj[prefixCls + '-wrapper-checked'] = this.group;
                obj[prefixCls + '-wrapper-disabled'] = this.disabled;

                return [prefixCls + '-wrapper',obj
                    //{
                    //    [prefixCls + 'group-item']:this.group,
                    //    [prefixCls + '-wrapper-checked']: this.selected,
                    //    [prefixCls + '-wrapper-disabled']: this.disabled
                    //}
                ];
            },
            checkboxClasses: function checkboxClasses() {
                var _ref2;
                var oot ={};
                oot[prefixCls + '-checked'] = this.selected;
                oot[prefixCls + '-disabled'] = this.disabled;
                oot[prefixCls + '-middle'] = this.middle;
                return ['' + prefixCls,oot
                    //{
                    //    [prefixCls + '-checked']: this.selected,
                    //    [prefixCls + '-disabled']: this.disabled
                    //}
                ];
            },
            innerClasses: function innerClasses() {
                return prefixCls + '-inner';
            },
            inputClasses: function inputClasses() {
                return prefixCls + '-input';
            }
        },
        ready: function ready() {
        	var p = this.$parent;
        	
            if (!this.group) {
            	//anson tag start
            	/**
            	 *  <iv-Checkbox-group :model.sync="fruit">
				        <iv-Checkbox v-for="a in aList" :value="a">{{a}}</iv-Checkbox>
				    </iv-Checkbox-group>
            	 * 
            	 * 当先设置 checkbox-group 的数据源 fruit， 后异步设置 iv-Checkbox  v-for 的 aList时  this.group = false, 修正此bug
            	 */
            	if(p.$el && p.$el.className && p.$el.className.indexOf("ivu-checkbox-group") != -1) {
                	this.group = true;
                	this.model = _.extend(this.model,p.model);
            		if(_.contains(this.model, this.value)) {
            			this.selected = true;
            		}
            	} 
            	//anson tag end
            	else{
            		this.updateModel();
            	}
            } else {
                this.$parent.change(this.model);
            }
        },

        methods: {
            _getCheckVal:function(){
                if(this.trueValue!==undefined&&this.falseValue!==undefined){
                    if(this.checked===this.trueValue){
                        return  true;
                    }
                    else{
                        return false;
                    }
                }
                else{
                    return this.checked;
                }
            },
            _setCheckValue:function(){
                if(this.trueValue!==undefined&&this.falseValue!==undefined){
                    if(this.selected){return this.trueValue}
                    else{return this.falseValue}
                }
                else{
                    return this.selected;
                }
            },
            change: function change(event) {
                if (this.disabled) {
                    return false;
                }

                //this.selected = event.target.checked;
                if (this.group) {
                    this.$parent.change(this.model);
                } else {
                    this.checked=this._setCheckValue();
                    this.$emit('on-change', this.checked,this.checked);

                }
            },
            updateModel: function updateModel() {
                this.selected =this._getCheckVal();
}
        },
        watch: {
            checked: function checked(val) {
                this.updateModel();
            }
        }
    };


    var component = Vue.extend(opt);
    Vue.component('iv-checkbox', component);
    return component;
});




