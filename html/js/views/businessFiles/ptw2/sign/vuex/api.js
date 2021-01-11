define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'ptwcatalog/disable'},

  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("ptwcatalog"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
         'create': '7050004001',
         'edit':   '7050004002',
         'delete': '7050004003',
        // 'import': '7050004004',
        // 'export': '7050004005',
         'enable': '7050004006',
    };
    return resource;
});