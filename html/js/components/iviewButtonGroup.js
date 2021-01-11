/**
 * Created by yyt on 2016/12/2.
 */
define(function(require) {

    var Vue = require("vue");

    var template =  '<div :class="classes">'+
                    '<slot></slot>'+
                    '</div>';

    var prefixCls = 'ivu-btn-group';


    var opts = {
        template : template,
        props: {
            size: {
                validator :function(value) {
                    return oneOf(value, ['small', 'large']);
                }
            },
        },
        computed: {
            classes :function() {
                var obj = {};
                obj[prefixCls + '-'+this.size] = !!this.size;
                return [prefixCls,obj]
        //    return [
        //                `${prefixCls}`,
        //    {
        //        [`${prefixCls}-${this.size}`]: !!this.size
        //    }
        //]
    }
}
    };

    var comp = Vue.extend(opts);
    Vue.component('ivu-btn-group', comp);
    Vue.component('Button-group', comp);

});