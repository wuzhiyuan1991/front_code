/**
 * Created by yyt on 2017/4/5.
 */

define(function(require) {
    var Vue = require("vue");
    var assist = require("./utils/assist");
    var helper = require("./iviewSpinHelper");

    var template = '<div :class="classes"  v-show="showSpin"> '+
        '<div :class="mainClasses"> '+
        '<span :class="dotClasses"></span> '+
        '<div :class="textClasses" v-el:text><slot></slot></div> '+
        '</div> '+
        '</div> ' ;

    var prefixCls = 'ivu-spin';

    var opt = {
        template: template,
        props: {
            size: {
                validator: function(value) {
                    return assist.oneOf(value, ['small', 'large']);
                }
            },
            fix: {
                type: Boolean,
                default: false
            },
            showSpin:{
                type: Boolean,
                default: false
            }
        },
        data: function () {
            return {
                showText: false
            };
        },
        computed: {
            classes: function() {
                var obj = {};
                obj[prefixCls + '-' + 'this.size'] = !!this.size;
                obj[prefixCls + '-' + 'fix'] = this.fix;
                obj[prefixCls + '-' + 'show'+ '-' + 'text'] = this.showText;
                return [prefixCls, obj];
            },
            mainClasses: function(){
                //return `${prefixCls}-main`;
                return [prefixCls+ '-' + 'main'];
            },
            dotClasses: function(){
                return [prefixCls+ '-' + 'dot'];
                //return `${prefixCls}-dot`;
            },
            textClasses: function() {
                return [prefixCls+ '-' + 'text'];
                //return `${prefixCls}-text`;
            },
        },
        compiled: function() {
            var text = this.$els.text.innerHTML;
            if (text != '') {
                this.showText = true;
            }
        },
        ready : function() {
            helper.registerInstance(this._uid, this);
        },
        destroyed : function() {
            helper.unRegisterInstance(this._uid);
        }
    };

    var component = Vue.extend(opt);
    Vue.component('ivu-spin', component);

});

