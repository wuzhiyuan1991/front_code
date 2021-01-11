define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");
    var customActions = {
        //list: {method: 'GET', url: 'i18n/list/{pageNo}/{pageSize}'},
        //get: {method: 'GET', url: 'i18n/{id}'},
        //create: {method: 'POST', url: 'i18n'},
        //update: {method: 'PUT', url: 'i18n'},
        //remove: {method: 'DELETE', url: 'i18n'},
        //exportExcel:{method: 'GET', url: 'i18n/exportExcel'},
        //importExcel:{method: 'POST', url: 'i18n/importExcel'}
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("i18n"));
    var resource = Vue.resource(null,{}, customActions);
    return resource;
});