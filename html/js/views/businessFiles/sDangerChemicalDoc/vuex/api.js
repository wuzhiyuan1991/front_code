define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        updateDisable: {method: 'PUT', url: 'chemicalregister/updateDisable'},
  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("chemicalregister"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '2210003001',
        'edit': '2210003002',
        'delete': '2210003003',
        // 'enable': '2010008006',
        // 'import': '2010008004'
         'export': '2210003005'
    };
    return resource;
});