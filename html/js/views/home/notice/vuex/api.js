define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        getUUID: {method: 'GET', url: 'helper/getUUID'},
        listLogs: {method: 'GET', url: 'circularlog/list/{curPage}/{pageSize}'}
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("companycircular"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '7020001001',
        'delete': '7020001003'
    };
    return resource;
});