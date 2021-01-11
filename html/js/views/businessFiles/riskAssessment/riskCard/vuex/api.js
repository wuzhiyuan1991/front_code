define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'riskcard/disable'},
        saveRiskAssessments : {method: 'GET', url: 'riskcard/autoBatch'},
        codeUniq : {method: 'GET', url: 'riskcard/CodeUniq'},
        deleteBatch: {method: 'DELETE', url: 'riskcard/ids'},//批量删除

    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("riskcard"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '3010002001',
        'edit':   '3010002002',
        'delete': '3010002003',
        'import': '3010002004',
        'export': '3010002005',
        'enable': '3010002006',
    };
    return resource;
});