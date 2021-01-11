define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'deliverypandect/disable'},

  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("deliverypandect"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '2910002001',
        'edit':   '2910002002',
        'delete': '2910002003',
        'import': '2910002004',
        'export': '2910002005',
        // 'enable': '_YYYYYYY006',
    };
    return resource;
});