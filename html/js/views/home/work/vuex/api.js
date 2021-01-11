define(function(require){

    var Vue = require("vue");
    // var apiCfg = require("apiCfg");

    var customActions = {
        // 左侧列表
        getTasks: {method: 'GET', url: 'workTask/list'},
        // 右下列表
        getDateList: {method: 'GET', url: 'workTask/date/taskList'},
        // 右上
        getMonthEvent: {method: 'GET', url: 'workTask/date/list'},
        getAuditFile: {method: 'GET', url: 'auditfile/loginuser/todo'}
    };
    // customActions = _.defaults(customActions, apiCfg.buildDefaultApi(""));
    var resource = Vue.resource(null,{}, customActions);

    return resource;
});