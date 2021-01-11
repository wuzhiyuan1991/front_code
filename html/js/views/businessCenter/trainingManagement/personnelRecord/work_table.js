/*
* 轻量级的表格组件，用于显示数据，不应拓展太多功能
*
* columns {Array<Object>}: {
*     title: {String} 表头显示文字，不应该为空,
*     fieldName: {String} 表格中显示的文字， 使用_.get()取值
*     render: {Function} 用于复杂数据的自定义显示，参数:
*     width: {String} 单元格宽度，110px/20%/auto
*     event: {Boolean} 单元格是否绑定了 点击 事件，不设置不会向上抛出事件
* }
*
* tools {Array<String>}: ['del', 'update', 'move'] 配置表格行最后一列显示操作按钮, 可根据需要配置
*/
define(function (require) {
    var Vue = require("vue");
    var template = require("text!./work_table.html");
    var opt = {
        template: template,
        props:{
            values:{
                type:Object,
            }
        }
        // data:function () {
        //     return {
        //         values:{},
        //     }
        // }
    };
    var component = Vue.extend(opt);
    return component;
});
