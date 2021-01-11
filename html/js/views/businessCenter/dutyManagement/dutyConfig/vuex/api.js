define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {

    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("dutyprocesstemplate"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        // 'create': '6420001001',
        // 'edit':   '6420001002',
        // 'delete': '6420001003',
        // // 'import': '6420001004',
        // // 'export': '6420001005',
        // 'publish' : '6420001006',
        // 'invalid' : '6420001007',
        // 'submit':'6420001008',
        // 'audit':'6420001009',
        // 'quit':'6420001010',
    };
    return resource;
});