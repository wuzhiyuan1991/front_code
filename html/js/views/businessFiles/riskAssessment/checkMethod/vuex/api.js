define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
    };
    
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("checkmethod"));
    
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '3020002001',
        'edit': '3020002002',
        'delete': '3020002003',
        'export':'3020002005',
        'import':'3020002004'
    };
    return resource;
});