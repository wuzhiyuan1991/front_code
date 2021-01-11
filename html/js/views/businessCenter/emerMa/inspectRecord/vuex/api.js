define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'emerinspectrecord/disable'},

  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("emerinspectrecord"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
         'create': '9020006001',
         'edit':   '9020006002',
         'delete': '9020006003',
         'import': '9020006004',
         'export': '9020006005',
         'copy': '9020006007',
    };
    return resource;
});