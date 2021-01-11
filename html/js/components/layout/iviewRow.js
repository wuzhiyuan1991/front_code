/**
 * Created by yyt on 2016/11/16.
 */
define(function(require) {

    var Vue = require("vue");
    var assist = require("../utils/assist");

    var template =  '<div :class="classes">'+
                    '<slot></slot>'+
                    '</div>';
    var prefixCls = 'ivu-row'

    var opt = {
        template : template,
        props: {
            type: {
                validator: function validator(value) {
                    return assist.oneOf(value, ['flex']);
                }
            },
            align: {
                validator: function validator(value) {
                    return assist.oneOf(value, ['top', 'middle', 'bottom']);
                }
            },
            justify: {
                validator: function validator(value) {
                    return assist.oneOf(value, ['start', 'end', 'center', 'space-around', 'space-between']);
                }
            },
            className: String
        },

        computed: {
            classes:function() {
                var opt ={};
                    opt[prefixCls+"-"+this.type]= !!this.type,
                    opt[prefixCls+"-"+this.type+"-"+this.align]= !!this.align,
                    opt[prefixCls+"-"+this.type+"-"+this.justify]= !!this.justify,
                    opt[this.className]=!!this.className
                return [prefixCls,opt];
            }

        },
    };
    var component = Vue.extend(opt);
    Vue.component('iv-row', component);
});