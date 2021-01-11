define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        queryLegalTypes:{method: 'GET', url: 'irllegalregulationtype/list'},
        createLegalType:{method: 'POST', url: 'irllegalregulationtype'},
        updateLegalType:{method: 'PUT', url: 'irllegalregulationtype'},
        removeLegalType:{method: 'DELETE', url: 'irllegalregulationtype'},

        

    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("irllegalregulation"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
         'create': '9310002001',
         'edit':   '9310002002',
         'delete': '9310002003',
         'import': '9310002004',
         'export': '9310002005',
         'createType': '9310001001',
         'editType':   '9310001002',
         'deleteType': '9310001003',
    };
    return resource;
});