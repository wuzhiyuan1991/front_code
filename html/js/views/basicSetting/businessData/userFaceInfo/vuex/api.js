define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'userfaceinfo/disable'},

  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("userfaceinfo"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '1010005001',
        'edit':   '1010005002',
        'delete': '1010005003',
        'import': '1010005004',
        'export': '1010005005',
        'enable': '1010005006',
    };
    return resource;
});