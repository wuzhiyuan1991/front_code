define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'smoctemplate/disable'},

  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("smoctemplate"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '8210006001',
        'edit':   '8210006002',
        'delete': '8210006003',
        // 'import': '8210006004',
        // 'export': '8210006005',
        // 'enable': '8210006006',
    };
    return resource;
});