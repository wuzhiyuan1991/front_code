define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        updateDisable: {method: 'PUT', url: 'nomalchemicalobj/updateDisable'},
  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("nomalchemicalobj"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '2010008001',
        'edit': '2010008002',
        'delete': '2010008003',
        'enable': '2010008006',
        // 'import': '2010008004'
         'export': '2010008005'
    };
    return resource;
});