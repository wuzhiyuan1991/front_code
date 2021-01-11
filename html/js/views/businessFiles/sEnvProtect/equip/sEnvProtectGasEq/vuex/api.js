define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		

  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("wastegasequirecord"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '9410002001',
        'edit':   '9410002002',
        'delete': '9410002003',
        'import': '9410002004',
        'export': '9410002005',
        // 'enable': '_YYYYYYY006',
    };
    return resource;
});