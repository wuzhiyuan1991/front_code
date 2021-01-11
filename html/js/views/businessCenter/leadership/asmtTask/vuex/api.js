define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        get: {method: 'GET', url: 'asmttask/{id}', time: 0},
        cancelTask: {method: 'PUT', url: 'asmttask/cancel'},
        modifyAuditor: {method: 'PUT', url: 'asmttask/auditor'},
        getSetting: {method: 'GET', url: 'systembusinessset/root?name=asmtTaskSet&compId=9999999999'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("asmttask"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'modify': '8010002007',
        'cancel': '8010002006',
        'export': '8010002005'
    };
    return resource;
});