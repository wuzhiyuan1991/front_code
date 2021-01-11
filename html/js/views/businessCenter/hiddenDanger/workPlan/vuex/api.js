define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'workplan/disable'},

  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("workplan"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '2020006001',
        'edit':   '2020006002',
        'delete': '2020006003',
        // 'import': '_YYYYYYY004',
        // 'export': '_YYYYYYY005',
        // 'enable': '_YYYYYYY006',
    };
    return resource;
});