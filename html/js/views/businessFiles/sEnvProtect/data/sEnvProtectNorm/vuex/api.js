define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'standardconfig/disable'},

  
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("standardconfig"));

 
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '9410007001',
        'edit':   '9410007002',
        'delete': '9410007003',
        // 'import': '_YYYYYYY004',
        // 'export': '_YYYYYYY005',
        // 'enable': '_YYYYYYY006',
    };
    return resource;
});