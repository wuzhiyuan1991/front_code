define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        list: {method: 'GET', url: 'opcardbag/list/1/9999'},
        order: {method: 'PUT', url: 'opcardbag/order'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("opcardbag"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        // 'create': '2020003001',
        // 'edit':   '2020002002',
        // 'delete': '2020002003',
        // 'import': '2020002004',
        // 'export': '2020003005',
    };
    return resource;
});