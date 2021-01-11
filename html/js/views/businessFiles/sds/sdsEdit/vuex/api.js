define(function (require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
    	updateDisable: {method: 'PUT', url: 'richeckresult/disable'},
        order: {method: 'PUT', url: 'richeckresult/order'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("richeckresult"));
    var resource = Vue.resource(null, {}, customActions);
    resource.__auth__ = {
        'create': '2120001001',
        'edit': '2120001002',
        'delete': '2120001003',
        'enable': '2120001006'
        // 'import': '2120001004',
        // 'export': '2120001005',
    };
    return resource;
});