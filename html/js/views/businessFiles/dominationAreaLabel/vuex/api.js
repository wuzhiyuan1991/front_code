define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'dominationarealabel/disable'},

		queryDominationAreas : {method: 'GET', url: 'dominationarealabel/dominationareas/list/{pageNo}/{pageSize}'},
		saveDominationAreas : {method: 'POST', url: 'dominationarealabel/{id}/dominationareas'},
		removeDominationAreas : _.extend({method: 'DELETE', url: 'dominationarealabel/{id}/dominationareas'}, apiCfg.delCfg),

  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("dominationarealabel"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        // 'create': '_YYYYYYY001',
        // 'edit':   '_YYYYYYY002',
        // 'delete': '_YYYYYYY003',
        // 'import': '_YYYYYYY004',
        // 'export': '_YYYYYYY005',
        // 'enable': '_YYYYYYY006',
    };
    return resource;
});