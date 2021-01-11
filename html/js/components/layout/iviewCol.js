/**
 * Created by yyt on 2016/11/16.
 */

define(function(require) {

    var Vue = require("vue");

    var template =  '<div :class="classes">'+
                    '<slot></slot>'+
                    '</div>';
    var prefixCls = 'ivu-col';

    var opt = {
        template : template,
        props: {
            span: [Number, String],
            order: [Number, String],
            offset: [Number, String],
            push: [Number, String],
            pull: [Number, String],
            className: String
        },

        computed: {
            classes:function() {
                var opt ={};
                    opt[prefixCls+'-span-'+this.span]= this.span,
                    opt[prefixCls+'-order-'+this.order]= this.order,
                    opt[prefixCls+'-offset-'+this.offset]= this.offset,
                    opt[prefixCls+'-push-'+this.push]= this.push,
                    opt[prefixCls+'-pull-'+this.pull]= this.pull,
                    opt[this.className]=!!this.className
                return [prefixCls,opt];
            }

        },
    };
    var component = Vue.extend(opt);
    Vue.component('iv-col', component);
});
