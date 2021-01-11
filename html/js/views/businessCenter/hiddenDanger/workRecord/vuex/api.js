define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'workrecord/disable'},

  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("workrecord"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '2020007001',
        'edit':   '2020007002',
        'delete': '2020007003',
        // 'import': '_YYYYYYY004',
        // 'export': '_YYYYYYY005',
        // 'enable': '_YYYYYYY006',
    };
    return resource;
});