define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		//queryAccidentCases : {method: 'GET', url: 'tpacheckitem/accidentcases/list/{pageNo}/{pageSize}'},
		//saveAccidentCases : {method: 'POST', url: 'tpacheckitem/{id}/accidentcases'},
		//removeAccidentCases : _.extend({method: 'DELETE', url: 'tpacheckitem/{id}/accidentcases'}, apiCfg.delCfg),

        queryCheckMethods : {method: 'GET', url: 'tpacheckitem/checkmethods/list/{pageNo}/{pageSize}'},
        saveCheckMethods : {method: 'POST', url: 'tpacheckitem/{id}/checkmethods'},
        saveCheckBasis : {method: 'POST', url: 'tpacheckitem/{id}/checkbases'},
        saveAccident : {method: 'POST', url: 'tpacheckitem/{id}/accidentcases'},
        removeCheckMethods : _.extend({method: 'DELETE', url: 'tpacheckitem/{id}/checkmethods'}, apiCfg.delCfg),
        removeCheckBasis : _.extend({method: 'DELETE', url: 'tpacheckitem/{id}/checkbases'}, apiCfg.delCfg),
        removeAccidentCase : _.extend({method: 'DELETE', url: 'tpacheckitem/{id}/accidentcases'}, apiCfg.delCfg),
        removeEquipment : _.extend({method: 'DELETE', url: 'tpacheckitem/{id}/equipments'}, apiCfg.delCfg),
        batchOpen:{method:'PUT',url:'tpacheckitem/open'},
        batchClose:{method:'PUT',url:'tpacheckitem/close'},
        listTableType:{method:'GET',url:'tparisktype/list'},
        _deleteExpertSupport:{method: 'DELETE',url:'tpacheckitem/deleteExpertSupport'},
  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("tpacheckitem"));
    var resource = Vue.resource(null,{}, customActions);
    return resource;
});