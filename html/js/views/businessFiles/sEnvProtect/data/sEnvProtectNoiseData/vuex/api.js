define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'noisedectction/disable'},

  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("noisedectction"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
       'create': '9410005001',
        'edit':   '9410005002',
        'delete': '9410005003',
        'import': '9410005004',
        'export': '9410005005',
        // 'enable': '_YYYYYYY006',
    };
    return resource;
});