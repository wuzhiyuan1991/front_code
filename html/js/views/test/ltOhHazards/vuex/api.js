define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'ltohhazards/disable'},

		queryUsers : {method: 'GET', url: 'ltohhazards/users/list/{pageNo}/{pageSize}'},
		saveUsers : {method: 'POST', url: 'ltohhazards/{id}/users'},
		removeUsers : _.extend({method: 'DELETE', url: 'ltohhazards/{id}/users'}, apiCfg.delCfg),

  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("ltohhazards"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        // 'create': '2010001001',
        // 'edit':   '2010001002',
        // 'delete': '2010001003',
        // 'import': '2010001004',
        // 'export': '2010001005',
        // 'enable': '2010001006',
    };
    return resource;
});