define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        updateDisable: {method: 'PUT', url: 'majorchemicalobj/updateDisable'},
  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("majorchemicalobj"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '2010007001',
        'edit': '2010007002',
        'delete': '2010007003',
        'enable': '2010007006',
        // 'import': '2010007004',
         'export': '2010007005'
    };
    return resource;
});