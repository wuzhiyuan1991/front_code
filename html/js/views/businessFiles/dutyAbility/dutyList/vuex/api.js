define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'idadutyability/disable'},

  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("idadutyability"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        // 'create': '4320001001',
        // 'edit':   '4320001002',
        // 'delete': '4320001003',
        // 'import': '4320001004',
        // 'export': '4320001005',
        // 'enable': '4320001006',
    };
    return resource;
});