define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        order:{method: 'PUT', url: 'richecktype/order'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("richecktype"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        // 'create': '2220001001',
        // 'edit':   '2220001002',
        // 'delete': '2220001003',
        // 'import': '2220001004',
        // 'export': '2220001005',
    };
    return resource;
});