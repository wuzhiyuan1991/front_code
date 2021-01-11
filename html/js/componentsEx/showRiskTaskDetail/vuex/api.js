define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        riskjudgmenttaskCompany:{method:"GET", url:'riskjudgmentrecord/task/{id}'}


    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("riskjudgment"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '5020001001',
        'edit':   '5020001002',
        'delete': '5020001003',
        // 'import': '_YYYYYYY004',
        // 'export': '_YYYYYYY005',
        'enable': '5020001006',
        'copy':'5020001010'
    };
    return resource;
});