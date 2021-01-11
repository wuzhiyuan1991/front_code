define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        queryRiskjudgment:{method:'GET',url:'riskjudgmenttask/level'},
        queryRiskjudgmentTask:{method:'GET',url:'riskjudgmenttask/unit/user'},
        quertRiskjudgmentDetail:{method:"GET", url:'riskjudgmenttask/detail'},
        queryRiskDetail:{method:"GET", url:'riskjudgmentunit/list'},

};

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("riskjudgmenttask"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        // 'create': '_YYYYYYY001',
        // 'edit':   '_YYYYYYY002',
        // 'delete': '_YYYYYYY003',
        // 'import': '_YYYYYYY004',
        // 'export': '_YYYYYYY005',
        // 'enable': '_YYYYYYY006',
        'execute':'5030001007'
    };
    return resource;
});