define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        queryRiskList: {method:'GET', url:'riskmodel/list?disable=0&compId='},
        queryRiskmodel: {method: "GET", url: 'riskmodel/{id}'},
        queryOtherRiskModelList: {method: 'GET', url: 'riskmodel/other/list'},
        queryConfigList: {method: 'GET', url:'riskmapconfig/list'},
        saveConfig:{method: 'POST', url: 'riskmapconfig/batch'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("dominationarea"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '2010005001',
        'edit': '2010005002',
        'delete': '2010005003',
        'import': '2010005004',
        'export': '2010005005',
        'enable': '2010005006',
        'copy':'2010005010'
    };
    return resource;
});