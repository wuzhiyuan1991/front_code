define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		queryAccidentCases : {method: 'GET', url: 'tpacheckitem/accidentcases/list/{pageNo}/{pageSize}'},
		saveAccidentCases : {method: 'POST', url: 'tpacheckitem/{id}/accidentcases'},
		removeAccidentCases : _.extend({method: 'DELETE', url: 'tpacheckitem/{id}/accidentcases'}, apiCfg.delCfg),
        saveCheckMethods : {method: 'POST', url: 'tpacheckitem/{id}/checkmethods'},
        saveCheckBasis : {method: 'POST', url: 'tpacheckitem/{id}/checkbases'},
        saveAccident : {method: 'POST', url: 'tpacheckitem/{id}/accidentcases'},
        removeCheckMethods : _.extend({method: 'DELETE', url: 'tpacheckitem/{id}/checkmethods'}, apiCfg.delCfg),
        removeCheckBasis : _.extend({method: 'DELETE', url: 'tpacheckitem/{id}/checkbases'}, apiCfg.delCfg),
        removeAccidentCase : _.extend({method: 'DELETE', url: 'tpacheckitem/{id}/accidentcases'}, apiCfg.delCfg),
  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("tpacheckitem/certificate"));
    var resource = Vue.resource(null,{}, customActions);
    return resource;
});