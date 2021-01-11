define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
    		updateDisable: {method: 'PUT', url: 'richeckpointtpl/disable'},
  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("richeckpointtpl"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '8220001001',
        'edit':   '8220001002',
        'delete': '8220001003',
        // 'import': '8220001004',
        // 'export': '8220001005',
    	'enable': '8220001006',
    };
    return resource;
});