define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        queryLegalTypes:{method: 'GET', url: 'securityagency/list'},
        createLegalType:{method: 'POST', url: 'securityagency'},
        updateLegalType:{method: 'PUT', url: 'securityagency'},
        removeLegalType:{method: 'DELETE', url: 'securityagency'},
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("securityagencyrole"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
         'create': '9210002001',
         'edit':   '9210002002',
         'delete': '9210002003',
         'import': '9210002004',
         'export': '9210002005',
         'createType': '9210001001',
         'editType':   '9210001002',
         'deleteType': '9210001003',
    };
    return resource;
});