define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {

    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("accidentcase"));

    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '3020004001',
        'edit': '3020004002',
        'delete': '3020004003',
        'import':'3020004004',
        'export':'3020004005'
    };
    return resource;
});