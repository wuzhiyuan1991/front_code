define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        queryLegalTypes: {method: 'GET', url: 'legalregulationtype/list/1/9999'},
        createLegalType: {method: 'POST', url: 'legalregulationtype'},
        updateLegalType: {method: 'PUT', url: 'legalregulationtype'},
        removeLegalType: {method: 'DELETE', url: 'legalregulationtype'},

        querLegalregulations: {method: 'GET', url: 'legalregulationtype/legalregulations/list'},

    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("legalregulation"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
         'create': '2010011001',
         'edit':   '2010011002',
         'delete': '2010011003',
         'import': '2010011004',
         'export': '2010011005',
         'createType': '2010012001',
         'editType':   '2010012002',
         'deleteType': '2010012003',
    };
    return resource;
});