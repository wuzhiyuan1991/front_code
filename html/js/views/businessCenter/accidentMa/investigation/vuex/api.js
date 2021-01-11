define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        getAccident: {method: 'GET', url: 'accident/{id}'},
		updateDisable : {method: 'PUT', url: 'investigation/disable'},

		queryInvestigators : {method: 'GET', url: 'investigation/investigators/list/{pageNo}/{pageSize}'},
		saveInvestigators : {method: 'POST', url: 'investigation/{id}/investigators'},
		removeInvestigators : _.extend({method: 'DELETE', url: 'investigation/{id}/investigators'}, apiCfg.delCfg),

  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("investigation"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        // 'create': '5040002001',
        // 'edit':   '5040002002',
        // 'delete': '5040002003',
        // 'import': '5040002004',
        // 'export': '5040002005',
        // 'enable': '5040002006',
    };
    return resource;
});