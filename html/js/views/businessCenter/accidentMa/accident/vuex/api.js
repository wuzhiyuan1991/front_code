define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'accident/disable'},

		queryCasualties : {method: 'GET', url: 'accident/casualties/list/{pageNo}/{pageSize}'},
		saveCasualty : {method: 'POST', url: 'accident/{id}/casualty'},
		removeCasualties : _.extend({method: 'DELETE', url: 'accident/{id}/casualties'}, apiCfg.delCfg),
		updateCasualty : {method: 'PUT', url: 'accident/{id}/casualty'},

		queryEconomicLosses : {method: 'GET', url: 'accident/economiclosses/list/{pageNo}/{pageSize}'},
		saveEconomicLoss : {method: 'POST', url: 'accident/{id}/economicloss'},
		removeEconomicLosses : _.extend({method: 'DELETE', url: 'accident/{id}/economiclosses'}, apiCfg.delCfg),
		updateEconomicLoss : {method: 'PUT', url: 'accident/{id}/economicloss'},

  
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("accident"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        // 'create': '5040001001',
        // 'edit':   '5040001002',
        // 'delete': '5040001003',
        // 'import': '5040001004',
        // 'export': '5040001005',
        // 'enable': '5040001006',
        // 'report': '5040001007',
    };
    return resource;
});