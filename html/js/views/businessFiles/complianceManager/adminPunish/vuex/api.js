define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'adminpunish/disable'},

  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("adminpunish"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '2030002001',
        'edit':   '2030002002',
        'delete': '2030002003',
        'import': '2030002004',
        'export': '2030002005',
        // 'enable': '2030002006',
    };
    return resource;
});