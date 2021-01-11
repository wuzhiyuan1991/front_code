define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'wastegasdectction/disable'},

  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("wastegasdectction"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '9410004001',
        'edit':   '9410004002',
        'delete': '9410004003',
        'import': '9410004004',
        'export': '9410004005',
        // 'enable': '_YYYYYYY006',
    };
    return resource;
});