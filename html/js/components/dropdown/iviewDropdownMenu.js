///**
// * Created by yyt on 2016/12/12.
// */

define(function(require) {

    var Vue = require("vue");
    var template =  '<ul class="ivu-dropdown-menu"><slot></slot></ul>' ;


    var prefixCls = 'ivu-dropdown-menu';

    var opt = {
        template: template,

        };

    var component = Vue.extend(opt);
    Vue.component('iv-dropdown-menu', component);

})
