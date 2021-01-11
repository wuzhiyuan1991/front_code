define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        queryRiskList:{method:"GET", url:"riskassessment/list"},
        queryRiskassessmentDistinct:{method:"GET", url: "riskassessment/distinct/val"},
        queryRiskPoint:{method:"GET", url: "riskassessment/distinct/riskpoint"},
        riskModelGradeList:{method:"GET", url:'riskmodel/gradelat/list'}
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("riskassessment"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '3010001001',
        'edit': '3010001002',
        'delete': '3010001003',
        'audit': '3010001004',
        'notAudit': '3010001005',
        'import':'3010001006'
    };
    return resource;
});