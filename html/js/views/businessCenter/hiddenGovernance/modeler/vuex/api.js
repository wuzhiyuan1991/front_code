define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        //list : {method: 'GET', url: 'activitimodeler/list/{pageNo}/{pageSize}'},
        //get : {method: 'GET', url: 'activitimodeler/{id}'},
        //create : {method: 'POST', url: 'activitimodeler'},
        createProcess : {method: 'POST', url: 'model/create'},
        //update : {method: 'PUT', url: 'activitimodeler'},
        deploy : {method: 'GET', url: 'model/deploy'},
        //remove : _.extend({method: 'DELETE', url: 'activitimodeler/ids'}, apiCfg.delCfg),
        //exportExcel : {method: 'GET', url: 'activitimodeler/exportExcel'},
        //importExcel : {method: 'POST', url: 'activitimodeler/importExcel'},
        copyProcess: {method: 'POST', url: 'model/doCopy'},
        getStandardTemplates: {method: 'GET', url: 'activitimodeler/template/list/{curPage}/{pageSize}'}
  
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("activitimodeler"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '5010007001',
        'import': '5010007004',
        'edit': '5010007002',
        'delete': '5010007003',
        'publish': '5010010201',
        'copy': '5010010001',
        'condition': '5010008000',
        'node': '5010009000',
        'setting': '5010010000'
    };
    return resource;
});